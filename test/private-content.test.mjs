import assert from 'node:assert/strict';
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

console.log('PASS: private content denies anonymous and malformed Access requests before R2 access');
