import assert from 'node:assert/strict';
import {generateKeyPairSync, sign} from 'node:crypto';
import privateContent from '../workers/private-content.js';

const env = {
  ACCESS_TEAM_DOMAIN: 'https://team.cloudflareaccess.com',
  ACCESS_AUD: 'audience',
  PRIVATE_CONTENT: {head: async () => { throw new Error('bucket must not be reached'); }}
};

const anonymous = await privateContent.fetch(new Request('https://private.optiflows.com.au/reports/example.html'), env);
assert.equal(anonymous.status, 401);
assert.equal(anonymous.headers.get('cache-control'), 'private, no-store');
assert.equal(anonymous.headers.get('x-content-type-options'), 'nosniff');
assert.match(await anonymous.text(), /unauthorised/);

const malformed = await privateContent.fetch(new Request('https://private.optiflows.com.au/reports/example.html', {
  headers: {'CF-Access-Jwt-Assertion': 'not-a-jwt'}
}), env);
assert.equal(malformed.status, 401);

const health = await privateContent.fetch(new Request('https://private.optiflows.com.au/healthz'), env);
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), {ok: true});

const {publicKey, privateKey} = generateKeyPairSync('rsa', {modulusLength: 2048});
const jwk = {...publicKey.export({format: 'jwk'}), kid: 'test-key', alg: 'RS256', use: 'sig'};
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => new Response(JSON.stringify({keys: [jwk]}), {status: 200});
const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const tokenFor = email => {
  const header = encoded({alg: 'RS256', kid: 'test-key'});
  const payload = encoded({iss: env.ACCESS_TEAM_DOMAIN, aud: env.ACCESS_AUD,
    exp: Math.floor(Date.now() / 1000) + 300, email});
  const signature = sign('RSA-SHA256', Buffer.from(`${header}.${payload}`), privateKey).toString('base64url');
  return `${header}.${payload}.${signature}`;
};
const requestFor = (key, email, method = 'GET') => new Request(`https://private.optiflows.com.au/${key}`, {
  method, headers: {'CF-Access-Jwt-Assertion': tokenFor(email)}
});
env.PRIVATE_CONTENT = {
  head: async key => key === 'proposals/a.html' || key === 'reports/b.html' ? {
    customMetadata: {'x-optiflows-allowed-emails': key === 'proposals/a.html' ? 'client@example.test' : ''},
    httpMetadata: {contentType: 'text/html'}, etag: 'test-etag', size: 5
  } : null,
  get: async () => ({body: 'hello'})
};
try {
  env.PRIVATE_CONTENT_OWNER_EMAILS = ' James@Example.Test ';
  assert.equal((await privateContent.fetch(requestFor('proposals/a.html', 'james@example.test'), env)).status, 200);
  assert.equal((await privateContent.fetch(requestFor('reports/b.html', 'james@example.test', 'HEAD'), env)).status, 200);
  assert.equal((await privateContent.fetch(requestFor('proposals/a.html', 'client@example.test'), env)).status, 200);
  assert.equal((await privateContent.fetch(requestFor('reports/b.html', 'client@example.test'), env)).status, 403);
  assert.equal((await privateContent.fetch(requestFor('reports/b.html', 'stranger@example.test'), env)).status, 403);
  delete env.PRIVATE_CONTENT_OWNER_EMAILS;
  assert.equal((await privateContent.fetch(requestFor('reports/b.html', 'james@example.test'), env)).status, 403);
} finally {
  globalThis.fetch = originalFetch;
}

console.log('PASS: private content denies unauthenticated requests and limits recipients while allowing verified owner access');
