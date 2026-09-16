import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../workers/private-content.js';

const env = {
  ASSETS: {
    async fetch(request) {
      return new Response(new URL(request.url).pathname, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }
};

test('private hostname serves protected assets with defensive headers', async () => {
  const response = await worker.fetch(new Request('https://private.optiflows.com.au/reports/example/'), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '/reports/example/');
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});

test('proposal hostname exposes only proposal routes', async () => {
  const allowed = await worker.fetch(new Request('https://proposals.optiflows.com.au/776bc/proposals/example/'), env);
  assert.equal(allowed.status, 200);

  const denied = await worker.fetch(new Request('https://proposals.optiflows.com.au/reports/example/'), env);
  assert.equal(denied.status, 404);
});

test('proposal hostname root maps to proposal index', async () => {
  const response = await worker.fetch(new Request('https://proposals.optiflows.com.au/'), env);
  assert.equal(await response.text(), '/proposals/');
});
