import teamwear from './proposal-contract.json' with {type:'json'};
import calliope from './proposal-contract-calliope.json' with {type:'json'};

import copySkill from './proposal-contract-copy-skill.json' with {type:'json'};
import feedbackLoop from './proposal-contract-workbench-feedback-loop.json' with {type:'json'};
import puppeteer from '@cloudflare/puppeteer';

// The Calliope contract stays registered after its page was superseded on
// 30 September 2026 so stored records keep resolving against their own terms.
const contracts = new Map([['776bc-custom-teamwear', teamwear], ['776bc-calliope-telegram-pilot', calliope], ['776bc-content-copy-skill', copySkill], ['776bc-workbench-feedback-loop', feedbackLoop]]);
const notificationDetails = new Map([
  // From v4.0 the Teamwear proposal is itself the agreement for the monthly retainer: full approval, not in principle.
  [teamwear.path, {title:'776BC Custom Teamwear', outcome:'approved', payment:true, next:'Issue the first monthly invoice (A$5,000), confirm the start date, day-to-day lead, historical job and access, and schedule kickoff.',
    // Signed-copy email to the client, with the rendered signed proposal attached. Test records go to OptiFlows only.
    confirm:{cc:['james.richmond@optiflows.com.au'], agreement:'Custom Teamwear retainer', file:'OptiFlows-776BC-Custom-Teamwear-signed',
      lead:'The Custom Teamwear retainer is now in place. Your signed copy of the proposal is attached as a PDF for your records.',
      tiles:[['Monthly fee','A$5,000','ex GST, invoiced monthly'],['Initial term','6 months','then month to month'],['Capacity','~100 hours','pooled across the term'],['Rate','A$300/hour','standard rate A$350']],
      next:[['Start date','I’ll confirm the start date with you in the next day or two.'],['First invoice','The first monthly invoice of A$5,000 ex GST follows on the start date, payable within seven days.'],['Kickoff','We’ll lock in the day-to-day lead, the past job we’ll trace and the access we need, then book the kickoff.']]}}],
  [calliope.path, {title:'776BC Calliope Telegram Pilot', next:'Confirm pilot users, launch deliverables, the review owner and kickoff date.'}],
  // Not "in principle": this proposal carries its own payment terms and needs no separate agreement.
  [copySkill.path, {title:'776BC Content & Copy Skill for Claude', outcome:'approved', payment:true, next:'Issue the commencement invoice (50%), confirm Claude and source-material access, and book the authorship policy session.'}],
  [feedbackLoop.path, {title:'776BC Workbench Feedback Loop', outcome:'approved', payment:true, next:'Issue the commencement invoice (50%), get a recent Hero pack with feedback for the test, and confirm team Workbench sign-ins.'}]
]);

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
const linkFor = async (env,record) => `${env.PUBLIC_ORIGIN}${record.path}#record=${record.record_id}.${await keyFor(env,record.record_id)}`;

async function deliver(env, record) {
  const id = record.record_id;
  const link = await linkFor(env,record);
  const details = notificationDetails.get(record.path);
  const heading = record.is_test ? `TEST ONLY: ${details.title} approval notification. No client approval.` : `${details.title} ${details.outcome ?? 'approved in principle'}`;
  const fee = new Intl.NumberFormat('en-AU').format(record.fee_aud_ex_gst);
  const payment = details.payment ? `\nPayment: ${record.payment_milestones}` : '';
  const message = `${heading}\n\n${record.name}, ${record.role}\nReceived: ${record.approved_at}\nProposal: ${record.proposal}\nA$${fee} ex GST\nScope: ${record.scope}${payment}${record.recipients ? `\nSigned copy to: ${record.recipients.join(', ')}` : ''}\n\nNext: ${details.next}\n\nRecord: ${id}\nPrivate signed record: ${link}\n\nRemy`;
  // One attempt per channel. Ambiguous network outcomes require operator review,
  // never an automatic replay that could duplicate an external notification.
  await Promise.all([
    (async () => {
      let status = 'unknown';
      try {
        const response = await fetch(env.APPROVAL_EMAIL_ENDPOINT, {method:'POST', signal:AbortSignal.timeout(12000), headers:{
          'content-type':'application/json', Accept:'application/json', origin:env.PUBLIC_ORIGIN, referer:env.PUBLIC_ORIGIN + record.path
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

const b64 = buf => { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when = iso => new Intl.DateTimeFormat('en-AU', {timeZone:'Australia/Sydney', dateStyle:'long', timeStyle:'short'}).format(new Date(iso));

// The signed copy is the client's own page, opened at the private record link and printed by
// Cloudflare Browser Rendering, so the attachment is exactly what the client sees and saves.
async function renderSignedPdf(env, link, id) {
  if (env.RENDER_SIGNED_PDF) return env.RENDER_SIGNED_PDF(link, id);
  const t0 = Date.now(), log = m => console.log(`render ${id} ${m} +${Date.now() - t0}ms`);
  const browser = await puppeteer.launch(env.BROWSER); log("launched");
  try {
    const page = await browser.newPage();
    await page.setViewport({width:1280, height:900});
    await page.goto(link, {waitUntil:'networkidle0', timeout:20000}); log("loaded");
    await page.waitForFunction(rid => document.getElementById('recId')?.textContent === rid, {timeout:10000}, id);
    log("record shown"); await page.emulateMediaType('print');
    return await page.pdf({format:'A4', printBackground:true, preferCSSPageSize:true});
  } finally { await browser.close(); }
}

const EMAIL = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[a-z]{2,}$/i;
const cleanRecipients = list => {
  if (!Array.isArray(list) || !list.length || list.length > 5) return null;
  const out = [];
  for (const raw of list) {
    if (typeof raw !== 'string') return null;
    const e = raw.trim().toLowerCase();
    if (!e || e.length > 254 || !EMAIL.test(e)) return null;
    if (!out.includes(e)) out.push(e);
  }
  return out;
};

// Brand: OptiFlows proposal tokens (dark #053D3D, mid #0A6E6E, electric #66FFE0, light teal #E0FFF6, paper #F7F7F7).
function confirmationEmail(record, c, link, to, cc) {
  const test = record.is_test;
  const first = test ? 'James' : (record.name.trim().split(/\s+/)[0] || record.name);
  const signed = when(record.approved_at);
  const subject = `${test ? 'TEST ONLY: ' : ''}Thank you for signing: ${c.agreement}`;
  const F = "'General Sans',Arial,Helvetica,sans-serif", M = "'Space Mono','Courier New',monospace";
  const rows = [];
  for (let i = 0; i < c.tiles.length; i += 2) rows.push(c.tiles.slice(i, i + 2));
  const tile = t => t ? `<td class="tile" width="50%" valign="top" style="background:#E0FFF6;border-radius:12px;padding:16px 16px">
<div style="font-family:${M};font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#0A6E6E">${esc(t[0])}</div>
<div class="tv" style="font-family:${F};font-size:21px;font-weight:600;color:#053D3D;padding-top:6px;white-space:nowrap">${esc(t[1])}</div>
<div style="font-family:${F};font-size:13px;line-height:1.4;color:#4A5A5A;padding-top:2px">${esc(t[2])}</div></td>` : '<td width="50%"></td>';
  const steps = c.next.map(([h, b], i) => `<tr><td valign="top" style="padding:0 14px 16px 0;width:28px"><div style="width:28px;height:28px;border-radius:14px;background:#053D3D;color:#66FFE0;font-family:${M};font-size:13px;line-height:28px;text-align:center">${i + 1}</div></td>
<td valign="top" style="padding:3px 0 16px;font-family:${F};font-size:15px;line-height:1.5;color:#1A1A1A"><strong style="color:#053D3D">${esc(h)}.</strong> ${esc(b)}</td></tr>`).join('');
  const testBanner = test ? `<tr><td style="background:#8A2A1B;color:#FFFFFF;font-family:${F};font-size:14px;font-weight:600;padding:12px 32px">TEST ONLY. Not a client approval. Sent to OptiFlows only.</td></tr>` : '';
  const lead = test ? 'This is a test of the signed-copy email. The signed PDF is attached exactly as a client would receive it.' : c.lead;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media (max-width:480px){.px{padding-left:22px!important;padding-right:22px!important}.px-t{padding-left:12px!important;padding-right:12px!important}.tile{padding:14px 12px!important}.tv{font-size:18px!important}.h1{font-size:26px!important}}</style><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F7F7F7">
<div style="display:none;max-height:0;overflow:hidden">Your signed copy of the ${esc(c.agreement)} is attached.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7"><tr><td align="center" style="padding:28px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden">
<tr><td class="px" style="background:#053D3D;padding:26px 32px"><span style="font-family:${F};font-size:20px;font-weight:600;color:#FFFFFF;letter-spacing:-.01em">OptiFlows</span><div style="width:36px;height:3px;background:#66FFE0;margin-top:10px;border-radius:2px"></div></td></tr>
${testBanner}
<tr><td class="px" style="padding:36px 32px 8px">
<h1 class="h1" style="margin:0;font-family:${F};font-size:30px;line-height:1.15;font-weight:600;color:#053D3D">Thank you for signing, ${esc(first)}.</h1>
<p style="margin:16px 0 0;font-family:${F};font-size:16px;line-height:1.55;color:#1A1A1A">${esc(lead)}</p>
</td></tr>
<tr><td class="px-t" style="padding:14px 22px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="10" style="border-collapse:separate">${rows.map(r => `<tr>${tile(r[0])}${tile(r[1])}</tr>`).join('')}</table></td></tr>
<tr><td class="px" style="padding:20px 32px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD">
<tr><td style="padding:16px 0;font-family:${F};font-size:14px;line-height:1.7;color:#1A1A1A">
<span style="color:#6F6F6F">Signed by</span>&nbsp; <strong>${esc(record.name)}</strong>, ${esc(record.role)}<br>
<span style="color:#6F6F6F">Signed on</span>&nbsp; ${esc(signed)} (Sydney time)<br>
<span style="color:#6F6F6F">Record</span>&nbsp; <span style="font-family:${M};font-size:12px">${esc(record.record_id)}</span></td></tr></table></td></tr>
<tr><td class="px" style="padding:26px 32px 4px"><h2 style="margin:0 0 16px;font-family:${F};font-size:19px;font-weight:600;color:#053D3D">What happens next</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table></td></tr>
<tr><td class="px" style="padding:4px 32px 8px"><a href="${esc(link)}" style="display:inline-block;background:#053D3D;color:#FFFFFF;text-decoration:none;font-family:${F};font-size:15px;font-weight:600;padding:14px 24px;border-radius:6px">View the signed record</a></td></tr>
<tr><td class="px" style="padding:24px 32px 34px;font-family:${F};font-size:15px;line-height:1.6;color:#1A1A1A">Thanks again. I’m looking forward to getting started.<br><br><strong style="color:#053D3D">James Richmond</strong><br><span style="color:#6F6F6F">OptiFlows · <a href="mailto:james.richmond@optiflows.com.au" style="color:#0A6E6E">james.richmond@optiflows.com.au</a></span></td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;font-family:${F};font-size:12px;line-height:1.5;color:#6F6F6F;text-align:center">Sent to ${esc(to.join(', '))}${cc.length ? `, with a copy to ${esc(cc.join(', '))}` : ''}. The attached PDF is the signed proposal and your record of the agreement.</p>
</td></tr></table></body></html>`;
  const text = [test ? 'TEST ONLY. Not a client approval. Sent to OptiFlows only.\n' : '', `Thank you for signing, ${first}.`, '', lead, '',
    ...c.tiles.map(t => `${t[0]}: ${t[1]} (${t[2]})`), '',
    `Signed by: ${record.name}, ${record.role}`, `Signed on: ${signed} (Sydney time)`, `Record: ${record.record_id}`, '',
    'What happens next', ...c.next.map(([h, b], i) => `${i + 1}. ${h}. ${b}`), '',
    `View the signed record: ${link}`, '', 'Thanks again. I’m looking forward to getting started.', '', 'James Richmond', 'OptiFlows', 'james.richmond@optiflows.com.au'].join('\n').trimStart();
  return {subject, html, text};
}

// One attempt, recorded. The Resend idempotency key makes an accidental repeat of the same
// attempt a no-op; an operator resend passes a new attempt label.
async function confirm(env, record, attempt = 'first') {
  const details = notificationDetails.get(record.path);
  const c = details?.confirm;
  if (!c || !env.RESEND_API_KEY || !env.CONFIRM_FROM || (!env.BROWSER && !env.RENDER_SIGNED_PDF)) return 'not_configured';
  const id = record.record_id;
  let status = 'failed', messageId = null, pdfKey = null, reason = '';
  try {
    // Test records go to OptiFlows only, whatever addresses were entered.
    const to = record.is_test ? [...c.cc] : cleanRecipients(record.recipients);
    if (!to) throw new Error('no_recipients');
    const cc = record.is_test ? [] : c.cc.filter(e => !to.includes(e.toLowerCase()));
    const link = await linkFor(env, record);
    const pdf = await renderSignedPdf(env, link, id);
    if (!pdf || pdf.byteLength < 10000) throw new Error('pdf_too_small');
    if (env.RECORDS_BUCKET) {
      pdfKey = `approvals/${id}.pdf`;
      await env.RECORDS_BUCKET.put(pdfKey, pdf, {httpMetadata:{contentType:'application/pdf'}, customMetadata:{record_id:id, proposal:record.proposal}});
    }
    const {subject, html, text} = confirmationEmail(record, c, link, to, cc);
    const filename = `${c.file}-v${record.proposal_version}${record.is_test ? '-TEST' : ''}.pdf`;
    const response = await fetch('https://api.resend.com/emails', {method:'POST', signal:AbortSignal.timeout(20000), headers:{
      Authorization:`Bearer ${env.RESEND_API_KEY}`, 'content-type':'application/json', 'Idempotency-Key':`approval-confirmation/${id}/${attempt}`
    }, body:JSON.stringify({from:env.CONFIRM_FROM, to, cc, reply_to:env.CONFIRM_REPLY_TO || c.cc[0], subject, text, html,
      attachments:[{filename, content:b64(pdf)}], tags:[{name:'kind', value:'proposal_confirmation'}]})});
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.id) { status = 'accepted'; messageId = result.id; } else reason = `resend_${response.status}`;
  } catch (e) { reason = String(e?.message || e).slice(0, 120); console.log(`confirm ${id} error ${reason}`); }
  await env.APPROVALS_DB.prepare('UPDATE proposal_approvals SET confirmation_status = ?, confirmation_message_id = ?, confirmation_pdf_key = ?, confirmation_checked_at = ? WHERE id = ?')
    .bind(status, messageId, pdfKey, new Date().toISOString(), id).run();
  if (status !== 'accepted' && env.REMY_TELEGRAM_BOT_TOKEN) {
    // The client's copy did not go out: tell James, never retry automatically.
    try { await fetch(`https://api.telegram.org/bot${env.REMY_TELEGRAM_BOT_TOKEN}/sendMessage`, {method:'POST', signal:AbortSignal.timeout(12000), headers:{'content-type':'application/json'},
      body:JSON.stringify({chat_id:env.REMY_TELEGRAM_CHAT_ID, text:`Signed-copy email NOT sent for ${details.title} (${reason || status}).\nRecord: ${id}\nResend: POST ${BASE}/${id}/confirmation with the admin token.\n\nRemy`, link_preview_options:{is_disabled:true}, protect_content:true})}); } catch (_) {}
  }
  return status;
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
  // Omitted ID preserves the deployed Teamwear client's contract and retry hash.
  const contract = contracts.get(input.proposal_id === undefined ? '776bc-custom-teamwear' : input.proposal_id);
  if (!contract) return json({error:'unknown_proposal'},422);
  const isTest = input.is_test === true;
  if (isTest && !admin(req,env)) return json({error:'unauthorised_test'},403);
  if (!UUID.test(input.record_id || '') || typeof input.name!=='string' || !input.name.trim() || input.name.length>160 ||
      typeof input.role!=='string' || !input.role.trim() || input.role.length>160 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date || '') || !Number.isFinite(Date.parse(input.date)) ||
      input.proposal_version!==contract.proposal_version || input.consent!==contract.consent || input.consent_accepted!==true ||
      typeof input.signature!=='string' || input.signature.length>100000 || !/^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=]+$/.test(input.signature)) return json({error:'invalid_submission'},422);
  // Proposals with a signed-copy email require at least one recipient address (up to five).
  const wantsCopy = Boolean(notificationDetails.get(contract.path)?.confirm);
  const recipients = wantsCopy ? cleanRecipients(input.recipients) : null;
  if (wantsCopy && !recipients) return json({error:'invalid_submission'},422);
  const payload = {name:input.name.trim(),role:input.role.trim(),date:input.date,signature:input.signature,is_test:isTest,proposal_version:contract.proposal_version,consent:contract.consent};
  if (recipients) payload.recipients = recipients;
  if (contract.proposal_id) payload.proposal_id = contract.proposal_id;
  const payloadHash = await hash(JSON.stringify(payload));
  const record = {...contract,...payload,record_id:input.record_id,approved_at:new Date().toISOString(),consent_accepted:true};
  const stored = await env.APPROVALS_DB.prepare('INSERT INTO proposal_approvals (id,payload_hash,received_at,is_test,record_json) VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING')
    .bind(record.record_id,payloadHash,record.approved_at,isTest?1:0,JSON.stringify(record)).run();
  if (!stored.meta.changes) {
    const prior = await env.APPROVALS_DB.prepare('SELECT * FROM proposal_approvals WHERE id = ?').bind(record.record_id).first();
    if (prior.payload_hash!==payloadHash) return json({error:'record_conflict'},409);
    const savedRecord = JSON.parse(prior.record_json);
    return json({accepted:true,stored:true,duplicate:true,record:savedRecord,record_url:await linkFor(env,savedRecord)});
  }
  ctx.waitUntil(Promise.all([deliver(env,record), confirm(env,record)]));
  return json({accepted:true,stored:true,duplicate:false,record,record_url:await linkFor(env,record)},201);
}

export default { async fetch(req,env,ctx) {
  const url=new URL(req.url);
  try {
    if (url.pathname===BASE && req.method==='POST') return await post(req,env,ctx);
    const resend=/^\/api\/proposal-approvals\/([a-f0-9-]{36})\/confirmation$/i.exec(url.pathname);
    if (resend && req.method==='POST') {
      if (!admin(req,env)) return json({error:'unauthorised'},401);
      const row=await env.APPROVALS_DB.prepare('SELECT * FROM proposal_approvals WHERE id = ?').bind(resend[1]).first();
      if(!row)return json({error:'not_found'},404);
      return json({confirmation_status:await confirm(env,JSON.parse(row.record_json),`resend-${Date.now()}`)});
    }
    const id=url.pathname.slice(BASE.length+1);
    if (url.pathname.startsWith(BASE+'/') && UUID.test(id) && req.method==='GET') {
      const isAdmin=admin(req,env);
      if (!isAdmin && (!env.RECORD_SIGNING_KEY || req.headers.get('X-Approval-Key')!==await keyFor(env,id))) return json({error:'unauthorised'},401);
      const row=await env.APPROVALS_DB.prepare('SELECT * FROM proposal_approvals WHERE id = ?').bind(id).first();
      if(!row)return json({error:'not_found'},404);
      return json({record:JSON.parse(row.record_json),...(isAdmin?{email_status:row.email_status,telegram_status:row.telegram_status,telegram_message_id:row.telegram_message_id,confirmation_status:row.confirmation_status,confirmation_message_id:row.confirmation_message_id,confirmation_pdf_key:row.confirmation_pdf_key}:{})});
    }
    return json({error:'not_found'},404);
  } catch (_) { return json({error:'service_unavailable'},503); }
}};
