#!/usr/bin/env node
/*
 * Publish a compiler export as a complete, private HTML campaign workspace.
 * This is intentionally a local/review-gated step: it writes only inside
 * campaigns/<slug>/ and updates the campaign library card. It never activates
 * a channel, sends email, spends budget or calls an external provider.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repo = path.resolve(__dirname, '..');
const campaignsDir = path.join(repo, 'campaigns');
const source = process.argv[2];
const requestedSlug = process.argv[3];
if (!source) {
  console.error('Usage: node tools/publish-campaign-pack.cjs <campaign-pack.json> [slug]');
  process.exit(1);
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const pack = readJson(source);
const brief = pack.brief || {};
const production = pack.production || {};
const meta = brief.meta || {};
const slugify = (input) => String(input || 'campaign').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'campaign';
const slug = slugify(requestedSlug || pack.packId || meta.campaignSlug || meta.campaignName);
const target = path.resolve(campaignsDir, slug);
if (!target.startsWith(path.resolve(campaignsDir) + path.sep)) throw new Error('Refusing to write outside campaigns/.');
const esc = (input) => String(input ?? '').replace(/\.{2,}/g, '.').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lines = (input) => esc(input).replace(/\n/g, '<br>');
const arr = (input) => Array.isArray(input) ? input : [];
const first = (input, fallback = '') => arr(input)[0] || fallback;
const slugPart = (input) => slugify(input).slice(0, 50);

fs.mkdirSync(target, { recursive: true });
const files = arr(production._downloadFiles);
for (const file of files) {
  if (!file || !file.path) continue;
  const out = path.resolve(target, file.path);
  if (!out.startsWith(target + path.sep)) throw new Error(`Refusing unsafe pack path: ${file.path}`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, String(file.content ?? ''), 'utf8');
}

// Copy official branch logo sources into the generated workspace. SVG/PNG are
// copied as supplied; no combined logo is ever created.
const brandSource = path.join(repo, 'campaign-brief', 'assets');
const brandTarget = path.join(target, 'assets', 'brand');
fs.mkdirSync(brandTarget, { recursive: true });
for (const logo of ['m2m-connectivity-logo.svg', 'm2m-one-logo.png']) {
  const from = path.join(brandSource, logo);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(brandTarget, logo));
}

const serializable = JSON.parse(JSON.stringify(pack));
if (serializable.production) delete serializable.production._downloadFiles;
fs.mkdirSync(path.join(target, 'downloads'), { recursive: true });
fs.writeFileSync(path.join(target, 'downloads', 'campaign-pack.json'), JSON.stringify(serializable, null, 2));

const branches = arr(pack.brandBranches);
const creative = arr(production.creativeMasters);
const landing = arr(production.copy?.landing);
const social = arr(production.copy?.social);
const emails = arr(production.copy?.email);
const paid = arr(production.copy?.paid);
const sales = arr(production.copy?.sales);
const leads = arr(production.copy?.leadMagnets);
const calendar = arr(production.calendar);
const claims = arr(production.claimsRegister);
const firstMaster = first(creative);
const firstLanding = first(landing);
const firstLead = first(leads);
const fileLink = (needle, fallback = '') => {
  const match = files.find((file) => String(file.path || '').includes(needle));
  return match ? match.path : fallback;
};
const logoPath = (branch) => /m2m one/i.test(branch.brand || '') ? 'assets/brand/m2m-one-logo.png' : /m2m connectivity/i.test(branch.brand || '') ? 'assets/brand/m2m-connectivity-logo.svg' : '';
const brandRows = branches.map((branch) => `<article class="branch"><div class="branch-logo">${logoPath(branch) ? `<img src="${logoPath(branch)}" alt="${esc(branch.brand)}">` : esc(branch.brand || 'Selected branch')}</div><div><strong>${esc(branch.brand || 'Selected branch')}</strong><span>${esc(branch.market || branch.entity || 'Market to confirm')}</span></div><small>One approved logo per artwork</small></article>`).join('');
const stat = (number, label) => `<div class="stat"><strong>${esc(number)}</strong><span>${esc(label)}</span></div>`;
const card = (eyebrow, heading, body, extra = '') => `<article class="card"><p class="eyebrow">${esc(eyebrow)}</p><h3>${esc(heading)}</h3><p>${lines(body)}</p>${extra}</article>`;
const inventory = production.summary || {};
const rawStatus = String(pack.status || production.status || 'Draft').trim();
const reviewStatus = /^private review$/i.test(rawStatus) ? 'Ready for review' : rawStatus.replace(/^private review\s*·\s*/i, '').trim() || 'Ready for review';

const data = {
  schema: 'm2m-campaign-html-pack/v1', packId: pack.packId || slug, name: meta.campaignName || 'Untitled campaign', product: meta.product || '', market: meta.market || '', promise: brief.proposition?.promise || '', supporting: brief.proposition?.supporting || '', route: brief.strategy?.route || '', branches: branches.map(({ id, brand, market, cta, destination, independentArtwork }) => ({ id, brand, market, cta, destination, independentArtwork })), production: { summary: inventory, calendar, claims, creative: creative.map(({ content, ...item }) => item), files: production.files || [] }
};
fs.writeFileSync(path.join(target, 'campaign-data.js'), `const CAMPAIGN = ${JSON.stringify(data, null, 2)};\n`);

const html = `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex"><meta name="googlebot" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#073b43"><title>${esc(meta.campaignName || 'Campaign')} · Campaign Production Pack</title>
  <script defer src="/gate.js"></script>
  <style>
    :root{--deep:#073b43;--ink:#102f36;--teal:#147f79;--orange:#f26b38;--mint:#d9eee9;--paper:#f7f4ee;--line:#d5dfdc;--muted:#5b6d70;--white:#fff;--shadow:0 22px 70px rgba(7,59,67,.12)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.55 system-ui,-apple-system,sans-serif}a{color:inherit}.topbar{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.94);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}.topbar-inner{max-width:1480px;margin:auto;min-height:70px;padding:0 28px;display:flex;align-items:center;gap:22px}.wordmark{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:800;color:var(--deep);letter-spacing:.02em}.wordmark-mark{width:31px;height:31px;display:grid;place-items:center;background:var(--deep);color:var(--mint);font-size:10px;border-radius:5px}.topbar nav{margin-left:auto;display:flex;gap:18px;align-items:center;flex-wrap:wrap}.topbar nav a{text-decoration:none;color:var(--muted);font-size:13px;font-weight:700}.review-pill{background:var(--deep);color:#fff!important;border-radius:999px;padding:8px 13px}.hero{background:var(--deep);color:#fff;padding:92px 28px 70px}.hero-inner{max-width:1480px;margin:auto;display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:60px;align-items:end}.eyebrow{font:700 11px/1.2 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);margin:0 0 11px}.hero .eyebrow{color:var(--mint)}h1{font-size:clamp(54px,8vw,112px);line-height:.9;letter-spacing:-.06em;margin:0 0 22px;max-width:11ch}.tagline{font-size:clamp(24px,3vw,40px);line-height:1.05;color:#e3f0ed;max-width:700px;margin:0 0 15px}.lede{color:#c4d9d5;max-width:700px;font-size:19px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:25px}.button{display:inline-flex;align-items:center;gap:8px;border-radius:4px;text-decoration:none;font-weight:800;padding:12px 16px;background:var(--mint);color:var(--deep)}.button.dark{background:var(--orange);color:#fff}.button.outline{background:#fff;color:var(--deep)}.hero-card{background:#fff;color:var(--ink);padding:25px;border-radius:14px;box-shadow:var(--shadow)}.hero-card .status{font:700 11px ui-monospace,monospace;letter-spacing:.1em;color:var(--teal);text-transform:uppercase}.hero-card h2{color:var(--deep);font-size:27px;line-height:1.05;margin:10px 0}.hero-card p{font-size:15px;color:var(--muted)}.hero-card ul{list-style:none;padding:0;margin:12px 0 0}.hero-card li{border-top:1px solid var(--line);padding:8px 0;font-size:14px}.hero-card li:before{content:'✓';color:var(--teal);font-weight:800;margin-right:8px}.stats{background:#062e35;color:#fff}.stats-inner{max-width:1480px;margin:auto;display:grid;grid-template-columns:repeat(6,1fr)}.stat{text-align:center;padding:19px 10px;border-left:1px solid rgba(255,255,255,.12)}.stat strong{display:block;font-size:30px;line-height:1;color:var(--mint)}.stat span{display:block;font-size:11px;color:#c7dbd7;text-transform:uppercase;letter-spacing:.07em;margin-top:6px}.section{max-width:1480px;margin:auto;padding:80px 28px}.section-head{display:grid;grid-template-columns:1fr minmax(300px,560px);gap:40px;align-items:end;margin-bottom:36px}.section h2{font-size:clamp(40px,5vw,70px);line-height:.95;letter-spacing:-.05em;color:var(--deep);margin:0}.section-intro{color:var(--muted);font-size:18px;margin:0}.strategy-grid{display:grid;grid-template-columns:1.4fr .6fr;gap:22px}.strategy-card,.side-card,.card,.table-wrap,.branch{background:#fff;border:1px solid var(--line);border-radius:13px;box-shadow:0 14px 44px rgba(7,59,67,.06)}.strategy-card{padding:32px}.strategy-card .big{font-size:clamp(30px,4vw,56px);line-height:1;color:var(--deep);font-weight:800;margin:0 0 28px}.route{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.route div{border-left:3px solid var(--teal);padding:5px 12px}.route span{display:block;color:var(--muted);font:700 10px ui-monospace,monospace;text-transform:uppercase}.route strong{display:block;color:var(--deep);font-size:18px;line-height:1.1;margin-top:5px}.side-card{background:#0d555d;color:#fff;padding:28px}.side-card h3{color:var(--mint);margin:0 0 13px}.side-card ul{margin:0;padding-left:20px}.side-card li{margin:7px 0;color:#d4e7e3}.table-wrap{overflow:hidden}.table{width:100%;border-collapse:collapse}.table th,.table td{text-align:left;padding:13px 15px;border-bottom:1px solid var(--line);vertical-align:top;font-size:13px}.table th{background:var(--deep);color:#fff;text-transform:uppercase;font:700 10px ui-monospace,monospace;letter-spacing:.08em}.table tr:last-child td{border-bottom:0}.phase-grid,.cards,.branch-grid,.creative-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.cards.two,.branch-grid{grid-template-columns:repeat(2,1fr)}.card{padding:22px}.card h3{font-size:24px;line-height:1.05;color:var(--deep);margin:7px 0}.card p{font-size:14px;color:var(--muted);margin:0}.card .eyebrow{color:var(--teal)}.creative-card{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:hidden}.creative-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--deep)}.creative-card-body{padding:17px}.creative-card h3{font-size:19px;color:var(--deep);margin:0 0 4px}.creative-card p{font-size:13px;color:var(--muted);margin:0}.brand-section{background:#fff}.branch{padding:18px;display:grid;grid-template-columns:110px 1fr auto;gap:14px;align-items:center}.branch-logo{height:32px;display:grid;place-items:center}.branch-logo img{max-width:105px;max-height:30px}.branch strong,.branch span{display:block}.branch strong{color:var(--deep);font-size:15px}.branch span{color:var(--muted);font-size:12px;margin-top:2px}.branch small{font:700 10px ui-monospace,monospace;color:var(--teal);text-align:right}.dark-section{background:var(--deep);color:#fff}.dark-section h2{color:#fff}.dark-section .section-intro{color:#c7dbd7}.copy-card{background:rgba(255,255,255,.05);border:1px solid rgba(217,238,233,.18);border-radius:10px;padding:20px}.copy-card h3{color:var(--mint);font-size:20px;line-height:1.1;margin:0 0 8px}.copy-card p,.copy-card li{color:#d5e7e3;font-size:14px}.copy-card ul{padding-left:18px}.copy-label{font:700 10px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#8dc5bc}.release{background:#0d555d;border-radius:15px;padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:30px}.release h3{color:var(--mint);margin:0 0 10px}.release li{margin:7px 0;color:#d6e8e4}.release .boundary{border-left:1px solid rgba(255,255,255,.25);padding-left:25px}.release .boundary p{color:#d6e8e4;font-size:14px}.footer{background:#06242a;color:#bcd1cd;padding:30px 28px}.footer-inner{max-width:1480px;margin:auto;display:flex;justify-content:space-between;gap:20px}.footer a{color:var(--mint)}
    @media(max-width:960px){.hero-inner,.strategy-grid,.section-head,.release{grid-template-columns:1fr}.hero-card{max-width:520px}.stats-inner{grid-template-columns:repeat(3,1fr)}.creative-grid,.phase-grid{grid-template-columns:repeat(2,1fr)}.release .boundary{border-left:0;border-top:1px solid rgba(255,255,255,.25);padding:20px 0 0}.topbar nav a:not(.review-pill){display:none}}
    @media(max-width:640px){body{font-size:16px}.topbar-inner{padding:0 15px;min-height:62px}.topbar nav{gap:0}.hero{padding:68px 18px 45px}.hero h1{font-size:56px}.tagline{font-size:26px}.stats-inner{grid-template-columns:repeat(2,1fr)}.section{padding:56px 18px}.section h2{font-size:44px}.route,.creative-grid,.phase-grid,.cards,.cards.two,.branch-grid{grid-template-columns:1fr}.strategy-card{padding:22px}.table-wrap{overflow-x:auto}.table{min-width:720px}.branch{grid-template-columns:80px 1fr}.branch small{grid-column:2;text-align:left}.footer-inner{display:block}.footer-inner p{margin:5px 0}}
  </style>
</head>
<body>
  <header class="topbar"><div class="topbar-inner"><a class="wordmark" href="../" aria-label="Campaign library"><span class="wordmark-mark">OF</span><span>CAMPAIGN SYSTEMS</span></a><nav><a href="#strategy">Strategy</a><a href="#calendar">Calendar</a><a href="#creative">Creative</a><a href="#copy">Copy</a><a href="#evidence">Evidence</a><a class="review-pill" href="#release">Review gates</a></nav></div></header>
  <main>
    <section class="hero"><div class="hero-inner"><div><p class="eyebrow">${esc(meta.product || 'Campaign')} · complete HTML production pack</p><h1>${esc(meta.campaignName || 'Untitled campaign')}</h1><p class="tagline">${lines(brief.proposition?.promise || 'Campaign promise to confirm.')}</p><p class="lede">${lines(brief.proposition?.supporting || 'A structured campaign workspace generated from the Campaign Consultant and compiler.')}</p><div class="actions"><a class="button" href="#creative">Review the campaign</a>${firstLead ? `<a class="button outline" href="${esc(leadPath(firstLead))}">Open lead magnet</a>` : ''}</div></div><aside class="hero-card"><div class="status">Private review · ${esc(reviewStatus)}</div><h2>Production complete.<br>Activation gated.</h2><p>This workspace contains the strategy, complete channel copy, conversion objects, evidence register, independent brand branches and creative handoff.</p><ul><li>No posts scheduled</li><li>No email sent</li><li>No paid media activated</li><li>No CRM records changed</li></ul></aside></div></section>
    <section class="stats"><div class="stats-inner">${stat(inventory.landingPages || 0, 'landing pages')}${stat(inventory.socialAssets || 0, 'social objects')}${stat(inventory.emailAssets || 0, 'email objects')}${stat(inventory.paidAssets || 0, 'paid objects')}${stat(inventory.creativeMasters || 0, 'text-free masters')}${stat(branches.length, 'independent branches')}</div></section>
    <section id="downloads" class="section"><div class="section-head"><div><p class="eyebrow">Campaign library / downloads</p><h2>Everything in one room.</h2></div><p class="section-intro">The HTML review surface is the master view. Supporting copy, calendar, claims, provenance and creative specifications remain downloadable beside it.</p></div><div class="actions"><a class="button dark" href="downloads/campaign-pack.json" download>Download campaign JSON</a>${fileLink('copy/social-assets.json') ? `<a class="button outline" href="${esc(fileLink('copy/social-assets.json'))}" download>Social copy</a>` : ''}${fileLink('planning/campaign-calendar.csv') ? `<a class="button outline" href="${esc(fileLink('planning/campaign-calendar.csv'))}" download>Calendar CSV</a>` : ''}${fileLink('evidence/claims-register.csv') ? `<a class="button outline" href="${esc(fileLink('evidence/claims-register.csv'))}" download>Claims CSV</a>` : ''}</div></section>
    <section id="strategy" class="section"><div class="section-head"><div><p class="eyebrow">01 · Campaign system</p><h2>From decision to action.</h2></div><p class="section-intro">The selected campaign spine is carried from the consultant into a generic strategy, then adapted independently for each brand plugin.</p></div><div class="strategy-grid"><div class="strategy-card"><p class="big">“${esc(brief.proposition?.promise || 'Promise to confirm.')}”</p><div class="route"><div><span>Problem</span><strong>${esc(brief.audience?.problem || 'Make the audience problem visible')}</strong></div><div><span>Value</span><strong>${esc(brief.proposition?.supporting || 'Give the decision a useful proof path')}</strong></div><div><span>Action</span><strong>${esc(brief.strategy?.route || 'Move to the qualified next step')}</strong></div></div></div><aside class="side-card"><h3>Primary audience</h3><ul>${(arr(brief.audience?.primary ? [brief.audience.primary] : brief.audience?.roles)).concat(arr(brief.audience?.verticals)).slice(0,8).map((item) => `<li>${esc(item)}</li>`).join('') || '<li>Audience to confirm</li>'}</ul><h3 style="margin-top:24px">Primary KPI</h3><p>${esc(brief.objectives?.primaryKpi || 'KPI to confirm')}</p></aside></div><div class="phase-grid" style="margin-top:18px">${['Recognise the problem','Prove the decision','Invite the qualified next step'].map((phase, i) => card(`0${i+1} · Phase`, phase, i === 0 ? (brief.audience?.trigger || 'Make the trigger concrete.') : i === 1 ? (brief.proposition?.proof || 'Attach approved evidence.') : (brief.proposition?.cta || 'Define the conversion action.'))).join('')}</div></section>
    <section id="calendar" class="section"><div class="section-head"><div><p class="eyebrow">02 · Release rhythm</p><h2>The campaign calendar.</h2></div><p class="section-intro">Dates and states are proposed production planning. Activation remains a separate approval decision.</p></div><div class="table-wrap"><table class="table"><thead><tr><th>Week</th><th>Phase</th><th>Brand</th><th>Channel</th><th>Asset</th><th>CTA / owner</th><th>State</th></tr></thead><tbody>${calendar.map((row) => `<tr><td>W${esc(row.week)}</td><td>${esc(row.phase)}</td><td>${esc(row.brand)}</td><td>${esc(row.channel)}</td><td>${esc(row.asset)}</td><td>${esc(row.cta)}<br><small>${esc(row.owner)}</small></td><td>${esc(row.status)}</td></tr>`).join('') || '<tr><td colspan="7">Calendar to confirm</td></tr>'}</tbody></table></div></section>
    <section id="creative" class="section"><div class="section-head"><div><p class="eyebrow">03 · Creative studio</p><h2>Text-free masters. One branch at a time.</h2></div><p class="section-intro">The compiler creates safe visual masters without embedded copy or logos. Apply approved copy and exactly one official branch logo in deterministic post-processing.</p></div><div class="creative-grid">${creative.map((item) => `<article class="creative-card"><img loading="lazy" src="creative/${esc(item.filename)}" alt="Text-free illustrative master for ${esc(item.brand || meta.product)}"><div class="creative-card-body"><h3>${esc(item.brand || 'Selected branch')}</h3><p>${esc(item.usage || 'Text-free master; apply approved composition downstream.')}</p></div></article>`).join('') || '<div class="card">No visual masters generated yet.</div>'}</div><div class="branch-grid" style="margin-top:22px">${brandRows || '<div class="card">No brand branches selected.</div>'}</div></section>
    <div class="dark-section" id="copy"><section class="section"><div class="section-head"><div><p class="eyebrow">04 · Channel copy</p><h2>Every downstream conversation.</h2></div><p class="section-intro">Copy is generated once from the campaign spine and retained beside the destination, proof and CTA so the promise does not drift.</p></div><div class="cards two">${social.slice(0,6).map((item) => card(item.platform || 'Social', item.hook || item.headline || 'Social direction', item.body || '', `<p class="copy-label" style="margin-top:14px">CTA · ${esc(item.cta || '')}</p>`)).join('')}${emails.slice(0,6).map((item) => card('Email nurture', item.subject || 'Email subject', item.body || '', `<p class="copy-label" style="margin-top:14px">Preheader · ${esc(item.preheader || '')}</p>`)).join('')}${paid.slice(0,4).map((item) => card(item.channel || 'Paid', item.headline || 'Paid direction', item.description || '', `<p class="copy-label" style="margin-top:14px">CTA · ${esc(item.cta || '')}</p>`)).join('')}${sales.slice(0,4).map((item) => card('Sales talk track', item.opener || 'Sales opener', item.handoff || item.proof || '', item.questions?.length ? `<ul>${item.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>` : '')).join('')}</div></section></div>
    <section class="section"><div class="section-head"><div><p class="eyebrow">05 · Conversion object</p><h2>The lead magnet is built.</h2></div><p class="section-intro">A practical HTML conversion object turns the campaign question into a structured next step.</p></div><div class="cards two">${leads.map((lead) => card(lead.brand || 'Lead magnet', lead.title || 'Readiness guide', lead.questions?.join(' · ') || lead.status || '', `<div class="actions"><a class="button dark" href="${esc(leadPath(lead))}">Open HTML guide</a></div>`)).join('') || '<div class="card">Lead magnet to confirm.</div>'}</div></section>
    <section id="evidence" class="section"><div class="section-head"><div><p class="eyebrow">06 · Evidence and release control</p><h2>Proof before promise.</h2></div><p class="section-intro">Every claim remains attached to a source, confidence state, approver and expiry. Inference is visible and activation is gated.</p></div><div class="cards two">${claims.map((claim) => card(claim.confidence || 'Evidence', claim.claim || 'Claim', `Source: ${claim.source || 'Not supplied'}\nApprover: ${claim.approver || 'Assign owner'}\nExpiry: ${claim.expiry || 'Confirm at activation'}`)).join('') || '<div class="card">Claims register to confirm.</div>'}</div><div class="release" id="release" style="margin-top:28px"><div><h3>Release sequence</h3><ol><li>Recheck claims, dates, destinations and source evidence.</li><li>Accept named marketing, technical, brand and sales reviews.</li><li>Use an authorised human or governed executor for external release.</li><li>Read back the public result, attribution and lead response.</li></ol></div><div class="boundary"><h3>Review publication is not activation.</h3><p>${esc(production.provenance?.activation || 'This workspace is private review only. No channel has been scheduled, sent or activated.')}</p><p><strong>Non-goal:</strong> ${esc(brief.objectives?.nonGoals || 'Do not optimise for reach alone.')}</p></div></div></section>
  </main><footer class="footer"><div class="footer-inner"><p><strong>${esc(meta.campaignName || 'Campaign production pack')}</strong><br>Private review · Generated from Campaign Consultant → Compiler</p><p><a href="../">Campaign library</a> · <a href="campaign-data.js">Campaign data</a> · <a href="asset-manifest.json">Asset manifest</a></p></div></footer>
</body></html>`;

function firstLandingPath(item) { return item?.id ? `landing-pages/${slugPart(item.brand)}/index.html` : ''; }
function leadPath(item) { return item?.id ? `lead-magnets/${slugPart(item.brand)}/readiness-guide.html` : ''; }
fs.writeFileSync(path.join(target, 'index.html'), html.replace(/href=""/g, 'href="#creative"'));
if (firstLead && !fs.existsSync(path.join(target, 'readiness-guide.html'))) fs.copyFileSync(path.join(target, leadPath(firstLead)), path.join(target, 'readiness-guide.html'));

fs.writeFileSync(path.join(target, 'verification-report.md'), `# ${meta.campaignName || 'Campaign'} HTML production pack\n\n- Generated from compiler export: ${pack.packId || slug}\n- Review route: /campaigns/${slug}/\n- Status: PRIVATE REVIEW · NOT ACTIVATED\n- Noindex: page metadata, Googlebot metadata and site robots policy\n- Independent brand branches: ${branches.map((branch) => `${branch.brand} (${branch.market || 'market to confirm'})`).join('; ') || 'none selected'}\n- One approved logo per artwork; no combined lockups\n- Production inventory: ${JSON.stringify(inventory)}\n- External publication, spend, sends, CRM mutation and provider generation remain human-gated.\n\nGenerated files are hash-recorded in \`asset-manifest.json\`; the manifest itself is excluded from its own hash list.\n`);

const generatedFiles = [];
function walk(dir, relative = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(relative, entry.name).replace(/\\/g, '/');
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, rel);
    else if (!rel.startsWith('tmp/') && rel !== 'asset-manifest.json') generatedFiles.push({ file: rel, bytes: fs.statSync(full).size, sha256: crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex') });
  }
}
walk(target);
fs.writeFileSync(path.join(target, 'asset-manifest.json'), JSON.stringify({ schemaVersion: '1.0', campaignId: pack.packId || slug, generatedAt: new Date().toISOString(), status: 'PRIVATE REVIEW · NOT ACTIVATED', exclusions: ['provider credentials', 'external sends and spend', 'customer proof not supplied'], counts: inventory, totalFiles: generatedFiles.length + 1, files: generatedFiles }, null, 2));

const library = path.join(campaignsDir, 'index.html');
const markerStart = `<!-- GENERATED PACK:${slug} -->`;
const markerEnd = `<!-- END GENERATED PACK:${slug} -->`;
const cardHtml = `${markerStart}<article class="campaign-card" data-generated-pack="${esc(slug)}"><div class="campaign-card__visual"><img src="./${esc(slug)}/${firstMaster ? `creative/${esc(firstMaster.filename)}` : 'assets/brand/m2m-connectivity-logo.svg'}" alt="${esc(meta.campaignName || 'Generated campaign')} text-free master"><div class="campaign-card__visual-top"><span class="status"><i></i> Private review ready</span><span>Generated ${esc(new Date().toISOString().slice(0,10))}</span></div><div class="campaign-card__visual-bottom"><span>${esc(first(branches)?.brand || 'Campaign Consultant')}</span><span>Compiler generated</span></div></div><div class="campaign-card__content"><p class="campaign-card__type">Campaign Consultant / Complete HTML production pack</p><h3>${esc(meta.campaignName || 'Generated campaign')}</h3><p class="campaign-card__summary">A compiler-generated review workspace with strategy, complete channel copy, conversion objects, evidence, independent brand branches and production handoff.</p><div class="campaign-card__inventory" aria-label="Campaign contents"><span>${esc(inventory.socialAssets || 0)} social objects</span><span>${esc(inventory.emailAssets || 0)} email objects</span><span>${esc(inventory.landingPages || 0)} landing pages</span><span>${esc(inventory.creativeMasters || 0)} visual masters</span><span>${esc(inventory.calendarRows || 0)} calendar rows</span></div><div class="campaign-card__phases" aria-label="Campaign readiness"><div><i></i><span>Strategy + copy</span><strong>Complete</strong></div><div><i></i><span>HTML pack</span><strong>Ready</strong></div><div><i></i><span>Evidence register</span><strong>Review</strong></div><div class="is-gated"><i></i><span>External activation</span><strong>Approval gate</strong></div></div><div class="campaign-card__actions"><a class="button" href="./${esc(slug)}/">Open review workspace <span aria-hidden="true">&rarr;</span></a><a class="button button--secondary" href="./${esc(slug)}/downloads/campaign-pack.json" download>Download campaign JSON</a><a class="text-link" href="./${esc(slug)}/asset-manifest.json">Open asset manifest <span aria-hidden="true">&rarr;</span></a></div></div></article>${markerEnd}`;
let libraryHtml = fs.readFileSync(library, 'utf8');
const existing = new RegExp(`${markerStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${markerEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
if (existing.test(libraryHtml)) libraryHtml = libraryHtml.replace(existing, cardHtml);
else libraryHtml = libraryHtml.replace('<section class="library" aria-labelledby="library-title">', `<section class="library" aria-labelledby="library-title">\n      ${cardHtml}`);
fs.writeFileSync(library, libraryHtml);
console.log(JSON.stringify({ status: 'published-private-review', slug, path: `campaigns/${slug}/`, files: generatedFiles.length, summary: inventory }, null, 2));
