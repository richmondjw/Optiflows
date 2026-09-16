/* Cloudflare Worker: store first, then notify through a configured delivery sink. */
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
});

const fields = ['full_name', 'email', 'company_name', 'message', 'inquiry_type', 'cta_location', 'estimated_annual_drag'];
const text = (value, size) => typeof value === 'string' ? value.trim().slice(0, size) : '';
const cleanSource = (value) => text(value, 256).replace(/[^a-zA-Z0-9_./:-]/g, '');
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

function sameOrigin(request, env) {
  const origin = request.headers.get('Origin');
  return Boolean(origin) && origin === env.PUBLIC_ORIGIN;
}

async function notify(env, lead, id) {
  if (!env.FORMSPREE_EMAIL_ENDPOINT) return 'not_configured';
  try {
    const response = await fetch(env.FORMSPREE_EMAIL_ENDPOINT, {
      method: 'POST', headers: {
        'content-type': 'application/json',
        'origin': env.PUBLIC_ORIGIN,
        'referer': `${env.PUBLIC_ORIGIN}/`
      },
      body: JSON.stringify({
        full_name: lead.full_name,
        email: lead.email,
        company_name: lead.company_name,
        message: lead.message,
        inquiry_type: lead.inquiry_type,
        cta_location: lead.cta_location,
        estimated_annual_drag: lead.estimated_annual_drag,
        source: lead.source,
        lead_id: id,
        _subject: 'New OptiFlows website enquiry'
      })
    });
    return response.ok ? 'sent' : 'failed';
  } catch (_) {
    return 'failed';
  }
}

async function storeLead(env, lead, id) {
  const timestamp = new Date().toISOString();
  const result = await env.LEADS_DB.prepare(`
    INSERT INTO leads (id, idempotency_key, received_at, source, status, full_name, email, company_name, message, inquiry_type, cta_location, estimated_annual_drag, utm_json, notification_status)
    VALUES (?, ?, ?, ?, 'stored', ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ON CONFLICT(idempotency_key) DO NOTHING
  `).bind(id, lead.idempotency_key, timestamp, lead.source, lead.full_name, lead.email, lead.company_name, lead.message, lead.inquiry_type, lead.cta_location, lead.estimated_annual_drag, JSON.stringify(lead.utm)).run();
  return { inserted: result.meta.changes === 1, timestamp };
}

async function passedChallenge(env, input, remoteIp) {
  if (!env.TURNSTILE_SECRET) return true;
  const token = text(input.turnstile_token, 4096);
  if (!token) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: remoteIp || '' })
    });
    return Boolean((await response.json()).success);
  } catch (_) {
    return false;
  }
}

async function handlePost(request, env, ctx) {
  if (!sameOrigin(request, env)) return json({ error: 'origin_not_allowed' }, 403);
  let input;
  try { input = await request.json(); } catch (_) { return json({ error: 'invalid_json' }, 400); }
  const lead = { idempotency_key: text(request.headers.get('Idempotency-Key') || input.idempotency_key, 128), source: cleanSource(input.source), utm: {} };
  fields.forEach((field) => { lead[field] = text(input[field], field === 'message' ? 4000 : 256); });
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((field) => { lead.utm[field] = text(input.utm && input.utm[field], 256); });
  if (!/^[a-f0-9-]{16,128}$/i.test(lead.idempotency_key) || !lead.source || !lead.full_name || !isEmail(lead.email)) return json({ error: 'invalid_submission' }, 422);
  const startedAt = text(input.form_started_at, 32);
  if (startedAt && (!Number.isSafeInteger(Number(startedAt)) || Date.now() - Number(startedAt) < 800)) return json({ error: 'invalid_submission' }, 422);
  if (!(await passedChallenge(env, input, request.headers.get('CF-Connecting-IP')))) return json({ error: 'invalid_submission' }, 422);
  const id = crypto.randomUUID();
  const stored = await storeLead(env, lead, id);
  if (!stored.inserted) {
    const existing = await env.LEADS_DB.prepare('SELECT id FROM leads WHERE idempotency_key = ?').bind(lead.idempotency_key).first();
    return json({ accepted: true, id: existing.id, duplicate: true, stored: true });
  }
  ctx.waitUntil((async () => {
    const status = await notify(env, lead, id);
    await env.LEADS_DB.prepare('UPDATE leads SET notification_status = ?, notification_checked_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
  })());
  return json({ accepted: true, id, duplicate: false, stored: true }, 201);
}

async function handleExport(request, env) {
  if (!env.ADMIN_API_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_API_TOKEN}`) return json({ error: 'unauthorised' }, 401);
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100), 1), 500);
  const since = text(url.searchParams.get('since'), 32);
  const query = since ? env.LEADS_DB.prepare('SELECT * FROM leads WHERE received_at >= ? ORDER BY received_at DESC LIMIT ?').bind(since, limit) : env.LEADS_DB.prepare('SELECT * FROM leads ORDER BY received_at DESC LIMIT ?').bind(limit);
  return json({ leads: (await query.all()).results });
}

export default { async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === '/api/leads' && request.method === 'POST') return handlePost(request, env, ctx);
  if (url.pathname === '/api/leads' && request.method === 'GET') return handleExport(request, env);
  return json({ error: 'not_found' }, 404);
} };
