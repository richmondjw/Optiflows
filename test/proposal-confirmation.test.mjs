import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import worker from '../workers/proposal-approvals.js';
import contract from '../workers/proposal-contract.json' with {type:'json'};
import calliope from '../workers/proposal-contract-calliope.json' with {type:'json'};

const db = new DatabaseSync(':memory:');
db.exec(fs.readFileSync(new URL('../workers/proposal-approvals.sql', import.meta.url), 'utf8'));
const stored = new Map(), renders = [];
let pdfBytes = 20000;
const env = {PUBLIC_ORIGIN:'https://optiflows.com.au', RECORD_SIGNING_KEY:'test-only-key', APPROVAL_ADMIN_TOKEN:'test-admin',
  REMY_TELEGRAM_BOT_TOKEN:'test-bot', REMY_TELEGRAM_CHAT_ID:'test-chat', APPROVAL_EMAIL_ENDPOINT:'https://email.example.test',
  RESEND_API_KEY:'re_test', CONFIRM_FROM:'James Richmond <james.richmond@optiflows.com.au>',
  RENDER_SIGNED_PDF:async (link, id) => { renders.push({link, id}); return new Uint8Array(pdfBytes).fill(37); },
  RECORDS_BUCKET:{async put(key, body, opts){ stored.set(key, {size:body.byteLength, opts}); }},
  APPROVALS_DB:{prepare(sql){return {bind(...args){return {async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};},async first(){return db.prepare(sql).get(...args);}};}};}}};
const originalFetch = globalThis.fetch, calls = [], waits = [];
let resendStatus = 200;
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  calls.push({url:String(url), body, headers:options.headers});
  if (String(url).startsWith('https://api.resend.com')) return new Response(JSON.stringify(resendStatus === 200 ? {id:'resend-msg-1'} : {message:'nope'}), {status:resendStatus});
  return new Response(JSON.stringify({ok:true, result:{message_id:42}}));
};
const sig = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jvU8AAAAASUVORK5CYII=';
const base = {recipients:['Cameron.mcmc@776bc.com', 'kate.mcmc@776bc.com'], name:'Cameron McKenzie-McHarg', role:'Director', date:'2026-11-30', signature:sig, consent:contract.consent, consent_accepted:true, proposal_version:contract.proposal_version};
const post = (body, headers = {}) => worker.fetch(new Request(env.PUBLIC_ORIGIN + '/api/proposal-approvals', {method:'POST', headers:{Origin:env.PUBLIC_ORIGIN, 'Content-Type':'application/json', ...headers}, body:JSON.stringify(body)}), env, {waitUntil:p => waits.push(p)});
const resendCalls = () => calls.filter(c => c.url.startsWith('https://api.resend.com'));
const row = id => db.prepare('SELECT * FROM proposal_approvals WHERE id=?').get(id);

try {
  // 1. A real Teamwear approval: client copy to Cam, James in CC, signed PDF attached and stored.
  const real = {...base, record_id:crypto.randomUUID()};
  assert.equal((await post(real)).status, 201);
  await Promise.all(waits);
  let r = resendCalls();
  assert.equal(r.length, 1);
  assert.deepEqual(r[0].body.to, ['cameron.mcmc@776bc.com', 'kate.mcmc@776bc.com']);
  assert.deepEqual(r[0].body.cc, ['james.richmond@optiflows.com.au']);
  assert.equal(r[0].body.reply_to, 'james.richmond@optiflows.com.au');
  assert.equal(r[0].body.subject, 'Thank you for signing: Custom Teamwear retainer');
  assert.match(r[0].body.html, /Thank you for signing, Cameron./);
  assert.doesNotMatch(r[0].body.html, /—|–/);
  assert.equal(r[0].body.attachments[0].filename, `OptiFlows-776BC-Custom-Teamwear-signed-v${contract.proposal_version}.pdf`);
  assert.equal(Buffer.from(r[0].body.attachments[0].content, 'base64').length, 20000);
  assert.equal(r[0].headers['Idempotency-Key'], `approval-confirmation/${real.record_id}/first`);
  assert.match(r[0].body.text, /Signed by: Cameron McKenzie-McHarg, Director/);
  assert.match(r[0].body.text, /Monthly fee: A\$5,000 \(ex GST/);
  assert.ok(!r[0].body.text.includes(sig) && !r[0].body.html.includes(sig));
  assert.match(renders[0].link, new RegExp(`776bc-custom-teamwear/#record=${real.record_id}\\.[a-f0-9]{64}$`));
  assert.equal(row(real.record_id).confirmation_status, 'accepted');
  assert.equal(row(real.record_id).confirmation_message_id, 'resend-msg-1');
  assert.equal(stored.get(`approvals/${real.record_id}.pdf`).size, 20000);
  assert.equal(calls.length, 3); // Formspree, Telegram, Resend

  // Duplicate submission sends nothing more.
  assert.equal((await (await post(real)).json()).duplicate, true);
  await Promise.all(waits); assert.equal(resendCalls().length, 1);

  // 2. A test record goes to James only, clearly labelled.
  const test = {...base, record_id:crypto.randomUUID(), name:'TEST ONLY', is_test:true};
  assert.equal((await post(test, {Authorization:'Bearer test-admin'})).status, 201);
  await Promise.all(waits);
  r = resendCalls();
  assert.equal(r.length, 2);
  assert.deepEqual(r[1].body.to, ['james.richmond@optiflows.com.au']);
  assert.deepEqual(r[1].body.cc, []);
  assert.match(r[1].body.subject, /^TEST ONLY: /);
  assert.match(r[1].body.attachments[0].filename, /-TEST\.pdf$/);
  assert.match(r[1].body.text, /Not a client approval/);
  // Missing or bad recipients are rejected before anything is stored.
  assert.equal((await post({...base, record_id:crypto.randomUUID(), recipients:[]})).status, 422);
  assert.equal((await post({...base, record_id:crypto.randomUUID(), recipients:['not-an-email']})).status, 422);
  assert.equal((await post({...base, record_id:crypto.randomUUID(), recipients:Array(6).fill('a@b.co')})).status, 422);

  // 3. Proposals without a confirmation config send no client email.
  const pilot = {...base, record_id:crypto.randomUUID(), proposal_id:calliope.proposal_id, proposal_version:calliope.proposal_version, consent:calliope.consent};
  assert.equal((await post(pilot)).status, 201);
  await Promise.all(waits);
  assert.equal(resendCalls().length, 2);

  // 4. A Resend failure is recorded and James is alerted on Telegram; no automatic retry.
  resendStatus = 500;
  const failing = {...base, record_id:crypto.randomUUID()};
  const before = calls.length;
  assert.equal((await post(failing)).status, 201);
  await Promise.all(waits);
  assert.equal(row(failing.record_id).confirmation_status, 'failed');
  const alerts = calls.slice(before).filter(c => c.url.includes('telegram') && /NOT sent/.test(c.body.text));
  assert.equal(alerts.length, 1);
  assert.equal(resendCalls().length, 3);

  // 5. Operator resend: admin only, new idempotency key, status updated.
  resendStatus = 200;
  const resendUrl = `${env.PUBLIC_ORIGIN}/api/proposal-approvals/${failing.record_id}/confirmation`;
  assert.equal((await worker.fetch(new Request(resendUrl, {method:'POST'}), env, {})).status, 401);
  const res = await worker.fetch(new Request(resendUrl, {method:'POST', headers:{Authorization:'Bearer test-admin'}}), env, {});
  assert.equal((await res.json()).confirmation_status, 'accepted');
  assert.match(resendCalls().at(-1).headers['Idempotency-Key'], new RegExp(`^approval-confirmation/${failing.record_id}/resend-\\d+$`));
  assert.equal(row(failing.record_id).confirmation_status, 'accepted');

  // 6. A broken render (tiny PDF) never sends an empty attachment.
  pdfBytes = 50;
  const tiny = {...base, record_id:crypto.randomUUID()};
  const n = resendCalls().length;
  await post(tiny); await Promise.all(waits);
  assert.equal(resendCalls().length, n);
  assert.equal(row(tiny.record_id).confirmation_status, 'failed');

  // 7. The admin record read exposes the confirmation receipt.
  const read = await worker.fetch(new Request(`${env.PUBLIC_ORIGIN}/api/proposal-approvals/${real.record_id}`, {headers:{Authorization:'Bearer test-admin'}}), env, {});
  const receipt = await read.json();
  assert.equal(receipt.confirmation_status, 'accepted');
  assert.equal(receipt.confirmation_pdf_key, `approvals/${real.record_id}.pdf`);

  console.log('PASS: signed-copy email to Cam with James in CC, PDF attached and stored, test records to James only, other proposals untouched, failure alert, admin resend, empty-PDF guard, receipt');
} finally { globalThis.fetch = originalFetch; db.close(); }
