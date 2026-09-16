const SECURITY_HEADERS = {
  'Cache-Control': 'private, no-store',
  'Content-Security-Policy': "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https://formspree.io",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex'
};

function secured(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'proposals.optiflows.com.au') {
      if (url.pathname === '/') url.pathname = '/proposals/';
      const permitted = url.pathname === '/proposals/' || url.pathname.startsWith('/776bc/proposals/');
      if (!permitted) return secured(new Response('Not found', { status: 404 }));
      request = new Request(url, request);
    }

    return secured(await env.ASSETS.fetch(request));
  }
};
