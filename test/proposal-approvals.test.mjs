import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import worker from '../workers/proposal-approvals.js';
import contract from '../workers/proposal-contract.json' with {type:'json'};
const db=new DatabaseSync(':memory:');
db.exec(fs.readFileSync(new URL('../workers/proposal-approvals.sql',import.meta.url),'utf8'));
const env={PUBLIC_ORIGIN:'https://optiflows.com.au', RECORD_SIGNING_KEY:'test-only-key', APPROVAL_ADMIN_TOKEN:'test-admin', REMY_TELEGRAM_BOT_TOKEN:'test-bot', REMY_TELEGRAM_CHAT_ID:'test-chat', APPROVAL_EMAIL_ENDPOINT:'https://email.example.test',
  APPROVALS_DB:{prepare(sql){return {bind(...args){return {async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};},async first(){return db.prepare(sql).get(...args);}};}};}}};
const originalFetch=globalThis.fetch, calls=[], waits=[];
globalThis.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return new Response(JSON.stringify({ok:true,result:{message_id:42}}));};
const input={record_id:crypto.randomUUID(),name:'TEST ONLY',role:'Integration verification',date:'2026-09-16',signature:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jvU8AAAAASUVORK5CYII=',consent:contract.consent,proposal_version:'1.7',consent_accepted:true,fee_aud_ex_gst:1};
async function post(body=input,headers={}){return worker.fetch(new Request(env.PUBLIC_ORIGIN+'/api/proposal-approvals',{method:'POST',headers:{Origin:env.PUBLIC_ORIGIN,'Content-Type':'application/json',...headers},body:JSON.stringify(body)}),env,{waitUntil(p){waits.push(p);}});}
try{
  assert.equal((await post(input,{Origin:'https://wrong.test'})).status,403);
  assert.equal((await post({...input,consent_accepted:false})).status,422);
  assert.equal((await post({...input,is_test:true})).status,403);
  assert.equal((await post({...input,signature:'invalid'})).status,422);
  assert.equal((await post({...input,padding:'x'.repeat(180000)})).status,413);
  assert.equal(calls.length,0);
  let res=await post();assert.equal(res.status,201);const saved=await res.json();
  assert.equal(saved.record.fee_aud_ex_gst,14400);
  assert.equal(saved.record.proposal_text,contract.proposal_text);
  await Promise.all(waits);assert.equal(calls.length,2);
  assert.match(calls[1].body.text,/approved in principle/);
  assert.ok(!calls[1].body.text.includes(input.signature));
  res=await post();assert.equal((await res.json()).duplicate,true);assert.equal(calls.length,2);
  assert.equal((await post({...input,name:'Different signer'})).status,409);
  const recordUrl=env.PUBLIC_ORIGIN+'/api/proposal-approvals/'+input.record_id;
  assert.equal((await worker.fetch(new Request(recordUrl),env,{})).status,401);
  const key=saved.record_url.split('.').at(-1);
  res=await worker.fetch(new Request(recordUrl,{headers:{'X-Approval-Key':key}}),env,{});
  assert.equal((await res.json()).record.name,input.name);
  res=await worker.fetch(new Request(recordUrl,{headers:{Authorization:'Bearer test-admin'}}),env,{});
  const receipt=await res.json();assert.equal(receipt.telegram_status,'accepted');assert.equal(receipt.telegram_message_id,'42');assert.equal(receipt.email_status,'accepted');
  globalThis.fetch=async()=>{throw new Error('timeout');};
  const test={...input,record_id:crypto.randomUUID(),is_test:true};
  assert.equal((await post(test,{Authorization:'Bearer test-admin'})).status,201);
  await Promise.all(waits);
  assert.equal(db.prepare('SELECT telegram_status FROM proposal_approvals WHERE id=?').get(test.record_id).telegram_status,'unknown');
  assert.equal(db.prepare('SELECT count(*) AS n FROM proposal_approvals').get().n,2);
  console.log('PASS: persistence, canonical scope/fee, validation, private reads, duplicate/conflict handling, independent receipts, protected tests and ambiguous delivery');
}finally{globalThis.fetch=originalFetch;db.close();}
