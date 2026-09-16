import assert from 'node:assert/strict';
import fs from 'node:fs';
import leadWorker from '../workers/lead-capture.js';

const root = new URL('..', import.meta.url);
const client = fs.readFileSync(new URL('../lead-capture.js', import.meta.url), 'utf8');
const worker = fs.readFileSync(new URL('../workers/lead-capture.js', import.meta.url), 'utf8');
const schema = fs.readFileSync(new URL('../workers/schema.sql', import.meta.url), 'utf8');
const formPages = ['../index.html', '../blog/index.html', '../growth.html', '../v4/index.html'];

assert.match(client, /Idempotency-Key/);
assert.match(client, /\/api\/leads/);
assert.doesNotMatch(client, /formspree\.io/);
assert.match(worker, /INSERT INTO leads/);
assert.match(worker, /ON CONFLICT\(idempotency_key\)/);
assert.match(worker, /ctx\.waitUntil/);
assert.match(worker, /notification_status/);
assert.match(worker, /FORMSPREE_EMAIL_ENDPOINT/);
assert.match(worker, /Authorization/);
assert.match(schema, /idempotency_key TEXT NOT NULL UNIQUE/);
assert.doesNotMatch(worker, /console\.(log|error|warn)/);
for (const page of formPages) {
  const html = fs.readFileSync(new URL(page, import.meta.url), 'utf8');
  assert.match(html, /lead-capture\.js/);
  assert.doesNotMatch(html, /formspree\.io\/f\/meelyrkd/);
  assert.doesNotMatch(html, /name="honeypot"/);
}

for (const page of ['../blog/index.html', '../growth.html', '../v4/index.html']) {
  const html = fs.readFileSync(new URL(page, import.meta.url), 'utf8');
  assert.match(html, /OptiflowsLeadCapture\.submit\(form/);
  assert.doesNotMatch(html, /OptiflowsLeadCapture\.initialise\(form\)/);
}

const rows = new Map();
const db = {
  prepare(sql) {
    return {
      bind(...values) {
        return {
          async run() {
            if (sql.includes('INSERT INTO leads')) {
              const [id, idempotencyKey] = values;
              if (rows.has(idempotencyKey)) return { meta: { changes: 0 } };
              rows.set(idempotencyKey, { id, notification_status: 'pending' });
              return { meta: { changes: 1 } };
            }
            if (sql.includes('UPDATE leads')) {
              const [status, , id] = values;
              for (const row of rows.values()) if (row.id === id) row.notification_status = status;
              return { meta: { changes: 1 } };
            }
            throw new Error('unexpected write');
          },
          async first() { return rows.get(values[0]); },
          async all() { return { results: [...rows.values()] }; }
        };
      }
    };
  }
};
const requestId = '11111111-2222-4333-8444-555555555555';
const body = { idempotency_key: requestId, source: '/synthetic', form_started_at: String(Date.now() - 2000), full_name: 'Synthetic lead', email: 'synthetic@example.test', utm: { utm_source: 'contract-test' } };
const waits = [];
const originalFetch = globalThis.fetch;
const notifications = [];
globalThis.fetch = async (url, options) => {
  notifications.push({ url, body: JSON.parse(options.body) });
  return new Response('{}', { status: 200 });
};
const env = { LEADS_DB: db, PUBLIC_ORIGIN: 'https://optiflows.example.test', FORMSPREE_EMAIL_ENDPOINT: 'https://delivery.example.test/forms/lead' };
const context = { waitUntil(promise) { waits.push(promise); } };
const makeRequest = () => new Request('https://optiflows.example.test/api/leads', { method: 'POST', headers: { Origin: env.PUBLIC_ORIGIN, 'Content-Type': 'application/json', 'Idempotency-Key': requestId }, body: JSON.stringify(body) });
const first = await leadWorker.fetch(makeRequest(), env, context);
assert.equal(first.status, 201);
assert.equal((await first.json()).stored, true);
await Promise.all(waits);
assert.equal(rows.size, 1);
assert.equal(notifications.length, 1);
assert.equal(notifications[0].body.lead_id, [...rows.values()][0].id);
assert.equal(notifications[0].body.email, body.email);
assert.equal(notifications[0].options.headers.origin, env.PUBLIC_ORIGIN);
assert.equal(notifications[0].options.headers.referer, `${env.PUBLIC_ORIGIN}/`);
const duplicate = await leadWorker.fetch(makeRequest(), env, { waitUntil() {} });
assert.equal(duplicate.status, 200);
assert.equal((await duplicate.json()).duplicate, true);
globalThis.fetch = originalFetch;
console.log('lead capture contract checks passed');
