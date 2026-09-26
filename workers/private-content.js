/**
 * Protected OptiFlows content origin.
 *
 * Cloudflare Access remains the outer authentication boundary. This worker
 * adds a second check at the origin: it verifies the Access JWT and checks
 * the requested object's recipient allow-list before reading from R2.
 * There is no workers.dev endpoint in the deployment configuration.
 */

const encoder = new TextEncoder();
const jwksCache = new Map();

const securityHeaders = {
  'cache-control': 'private, no-store',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), geolocation=(), microphone=()'
};

const reply = (body, status, extra = {}) => new Response(body, {
  status,
  headers: {...securityHeaders, ...extra}
});

const json = (body, status = 200) => reply(JSON.stringify(body), status, {
  'content-type': 'application/json'
});

const base64UrlDecode = value => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
};

const parseJsonPart = value => JSON.parse(new TextDecoder().decode(base64UrlDecode(value)));

async function jwkFor(issuer, kid) {
  const cached = jwksCache.get(issuer);
  if (cached?.expires > Date.now() && cached.keys[kid]) return cached.keys[kid];
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error('access_jwks_unavailable');
  const body = await response.json();
  const keys = Object.fromEntries((body.keys || []).map(key => [key.kid, key]));
  jwksCache.set(issuer, {keys, expires: Date.now() + 300000});
  return keys[kid];
}

async function accessClaims(request, env) {
  const token = request.headers.get('CF-Access-Jwt-Assertion');
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null;
  let header, claims;
  try {
    header = parseJsonPart(encodedHeader);
    claims = parseJsonPart(encodedPayload);
  } catch (_) {
    return null;
  }
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;
  const issuer = env.ACCESS_TEAM_DOMAIN.replace(/\/$/, '');
  if (claims.iss !== issuer || claims.aud !== env.ACCESS_AUD ||
      typeof claims.exp !== 'number' || claims.exp <= Math.floor(Date.now() / 1000) ||
      typeof claims.email !== 'string') return null;
  try {
    const jwk = await jwkFor(issuer, header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}, false, ['verify']);
    const valid = await crypto.subtle.verify(
      {name: 'RSASSA-PKCS1-v1_5'},
      key,
      base64UrlDecode(encodedSignature),
      encoder.encode(`${encodedHeader}.${encodedPayload}`)
    );
    return valid ? claims : null;
  } catch (_) {
    return null;
  }
}

const safeObjectKey = pathname => {
  const key = decodeURIComponent(pathname.replace(/^\/+/, ''));
  if (!key || key.includes('..') || key.includes('\\') || key.startsWith('.')) return null;
  return key;
};

const allowedEmails = metadata => (metadata?.['x-optiflows-allowed-emails'] || '')
  .split(',').map(email => email.trim().toLowerCase()).filter(Boolean);

const ownerEmails = env => (env.PRIVATE_CONTENT_OWNER_EMAILS || '')
  .split(',').map(email => email.trim().toLowerCase()).filter(Boolean);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'HEAD') return json({error: 'method_not_allowed'}, 405);
    if (url.pathname === '/healthz') return json({ok: true});

    const claims = await accessClaims(request, env);
    if (!claims) return json({error: 'unauthorised'}, 401, {'www-authenticate': 'Bearer realm="cloudflare-access"'});

    let key;
    try { key = safeObjectKey(url.pathname); } catch (_) { key = null; }
    if (!key) return json({error: 'not_found'}, 404);
    const object = await env.PRIVATE_CONTENT.head(key);
    if (!object) return json({error: 'not_found'}, 404);
    const emails = allowedEmails(object.customMetadata);
    const email = claims.email.trim().toLowerCase();
    if (!ownerEmails(env).includes(email) && !emails.includes(email)) return json({error: 'forbidden'}, 403);

    const response = request.method === 'HEAD' ? null : await env.PRIVATE_CONTENT.get(key);
    if (request.method !== 'HEAD' && !response) return json({error: 'not_found'}, 404);
    const headers = new Headers(securityHeaders);
    headers.set('content-type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('etag', object.etag);
    headers.set('content-length', String(object.size));
    return new Response(response?.body || null, {status: 200, headers});
  }
};
