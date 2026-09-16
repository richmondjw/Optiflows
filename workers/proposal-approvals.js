import contract from './proposal-contract.json' with {type:'json'};

const BASE = '/api/proposal-approvals';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {
  'content-type': 'application/json', 'cache-control': 'no-store',
  'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer'
}});
const hex = bytes => [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
const hash = value => crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)).then(hex);
async function keyFor(env, id) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.RECORD_SIGNING_KEY), {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id)));
}
const admin = (req, env) => env.APPROVAL_ADMIN_TOKEN && req.headers.get('Authorization') === `Bearer ${env.APPROVAL_ADMIN_TOKEN}`;
const linkFor = async (env,id) => `${env.PUBLIC_ORIGIN}${contract.path}#record=${id}.${await keyFor(env,id)}`;

async function deliver(env, record) {
  const id = record.record_id;
  const link = await linkFor(env,id);
  const heading = record.is_test ? 'TEST ONLY: 776BC approval notification. No client approval.' : '776BC proposal approved in principle';
  const message = `${heading}\n\n${record.name}, ${record.role}\nReceived: ${record.approved_at}\nProposal: v${record.proposal_version}\nA$14,400 ex GST\n\nNext: Project Management Agreement and commencement payment before kickoff.\n\nRecord: ${id}\nPrivate signed record: ${link}\n\nRemy`;
  // One attempt per channel. Ambiguous network outcomes require operator review,
  // never an automatic replay that could duplicate an external notification.
  await Promise.all([
    (async () => {
      let status = 'unknown';
      try {
        const response = await fetch(env.APPROVAL_EMAIL_ENDPOINT, {method:'POST', signal:AbortSignal.timeout(12000), headers:{
          'content-type':'application/json', Accept:'application/json', origin:env.PUBLIC_ORIGIN, referer:env.PUBLIC_ORIGIN + contract.path
        }, body:JSON.stringify({_subject:heading, name:record.name, message, record_id:id, approval_type:record.approval_type, is_test:record.is_test, signed_record:link})});
        status = response.ok ? 'accepted' : 'failed';
      } catch (_) {}
      await env.APPROVALS_DB.prepare('UPDATE proposal_approvals SET email_status = ?, notification_checked_at = ? WHERE id = ?').bind(status,new Date().toISOString(),id).run();
    })(),
    (async () => {
      let status = 'unknown', messageId = null;
      try {
        const response = await fetch(`https://api.telegram.org/bot${env.REMY_TELEGRAM_BOT_TOKEN}/sendMessage`, {method:'POST', signal:AbortSignal.timeout(12000), headers:{'content-type':'application/json'},
          body:JSON.stringify({chat_id:env.REMY_TELEGRAM_CHAT_ID, text:message, link_preview_options:{is_disabled:true}, protect_content:true})});
        const result = await response.json();
        if (response.ok && result.ok && result.result?.message_id) { status = 'accepted'; messageId = String(result.result.message_id); }
        else status = 'failed';
      } catch (_) {}
      await env.APPROVALS_DB.prepare('UPDATE proposal_approvals SET telegram_status = ?, telegram_message_id = ?, notification_checked_at = ? WHERE id = ?').bind(status,messageId,new Date().toISOString(),id).run();
    })()
  ]);
}

async function post(req, env, ctx) {
  if (req.headers.get('Origin') !== env.PUBLIC_ORIGIN) return json({error:'origin_not_allowed'},403);
  if (!req.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'invalid_content_type'},415);
  if (!env.RECORD_SIGNING_KEY || !env.REMY_TELEGRAM_BOT_TOKEN || !env.REMY_TELEGRAM_CHAT_ID || !env.APPROVAL_EMAIL_ENDPOINT) return json({error:'service_unavailable'},503);
  // Bound the stream, not just the untrusted Content-Length header.
  const reader = req.body?.getReader();
  if (!reader) return json({error:'invalid_json'},400);
  let total=0, chunks=[];
  while (true) { const {done,value}=await reader.read(); if(done)break; total+=value.length; if(total>180000){await reader.cancel();return json({error:'payload_too_large'},413);} chunks.push(value); }
  const bytes=new Uint8Array(total); let offset=0; for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  let input;
  try { input=JSON.parse(new TextDecoder().decode(bytes)); } catch (_) { return json({error:'invalid_json'},400); }
  if (!input || typeof input!=='object') return json({error:'invalid_submission'},422);
  const isTest = input.is_test === true;
  if (isTest && !admin(req,env)) return json({error:'unauthorised_test'},403);
  if (!UUID.test(input.record_id || '') || typeof input.name!=='string' || !input.name.trim() || input.name.length>160 ||
      typeof input.role!=='string' || !input.role.trim() || input.role.length>160 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date || '') || !Number.isFinite(Date.parse(input.date)) ||
      input.proposal_version!==contract.proposal_version || input.consent!==contract.consent || input.consent_accepted!==true ||
      typeof input.signature!=='string' || input.signature.length>100000 || !/^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=]+$/.test(input.signature)) return json({error:'invalid_submission'},422);
  const payload = {name:input.name.trim(),role:input.role.trim(),date:input.date,signature:input.signature,is_test:isTest,proposal_version:contract.proposal_version,consent:contract.consent};
  const payloadHash = await hash(JSON.stringify(payload));
  const record = {...contract,...payload,record_id:input.record_id,approved_at:new Date().toISOString(),consent_accepted:true};
  const stored = await env.APPROVALS_DB.prepare('INSERT INTO proposal_approvals (id,payload_hash,received_at,is_test,record_json) VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING')
    .bind(record.record_id,payloadHash,record.approved_at,isTest?1:0,JSON.stringify(record)).run();
  if (!stored.meta.changes) {
    const prior = await env.APPROVALS_DB.prepare('SELECT * FROM proposal_approvals WHERE id = ?').bind(record.record_id).first();
    if (prior.payload_hash!==payloadHash) return json({error:'record_conflict'},409);
    return json({accepted:true,stored:true,duplicate:true,record:JSON.parse(prior.record_json),record_url:await linkFor(env,record.record_id)});
  }
  ctx.waitUntil(deliver(env,record));
  return json({accepted:true,stored:true,duplicate:false,record,record_url:await linkFor(env,record.record_id)},201);
}

export default { async fetch(req,env,ctx) {
  const url=new URL(req.url);
  try {
    if (url.pathname===BASE && req.method==='POST') return await post(req,env,ctx);
    const id=url.pathname.slice(BASE.length+1);
    if (url.pathname.startsWith(BASE+'/') && UUID.test(id) && req.method==='GET') {
      const isAdmin=admin(req,env);
      if (!isAdmin && (!env.RECORD_SIGNING_KEY || req.headers.get('X-Approval-Key')!==await keyFor(env,id))) return json({error:'unauthorised'},401);
      const row=await env.APPROVALS_DB.prepare('SELECT * FROM proposal_approvals WHERE id = ?').bind(id).first();
      if(!row)return json({error:'not_found'},404);
      return json({record:JSON.parse(row.record_json),...(isAdmin?{email_status:row.email_status,telegram_status:row.telegram_status,telegram_message_id:row.telegram_message_id}:{})});
    }
    return json({error:'not_found'},404);
  } catch (_) { return json({error:'service_unavailable'},503); }
}};
