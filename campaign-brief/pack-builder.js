const today = () => new Date().toISOString().slice(0, 10);

const value = (input, fallback = 'TBD') => String(input || '').trim().replace(/\.{2,}/g, '.') || fallback;
const list = (input) => Array.isArray(input) ? input.filter(Boolean) : [];
const slug = (input) => String(input || 'campaign').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'campaign';
const html = (input) => String(input || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const csvCell = (input) => `"${String(input ?? '').replace(/"/g, '""')}"`;
const href = (input, fallback = '#route') => {
  const candidate = String(input || '').trim();
  return /^(?:https?:\/\/|\/|#)/i.test(candidate) ? candidate : fallback;
};
const sentence = (input) => String(input || '').trim().replace(/[.。]+$/g, '');

function core(brief, consultantRun) {
  const concept = list(consultantRun?.concepts).find((item) => item.id === consultantRun?.selectedConcept) || list(consultantRun?.concepts)[0] || {};
  const proposition = brief.proposition || {};
  const audience = brief.audience || {};
  const objectives = brief.objectives || {};
  const strategy = brief.strategy || {};
  return {
    name: value(brief.meta?.campaignName, 'Untitled campaign'),
    campaignSlug: slug(brief.meta?.campaignSlug || brief.meta?.campaignName),
    product: value(brief.meta?.product, 'the offer'),
    market: value(brief.meta?.market, 'the selected market'),
    owner: value(brief.meta?.owner, 'Campaign owner to assign'),
    primaryAudience: value(audience.primary, 'the priority decision-maker'),
    problem: value(audience.problem, concept.problem || 'an unresolved operating problem'),
    trigger: value(audience.trigger, concept.audienceTension || 'a change that makes the current approach less reliable'),
    promise: value(proposition.promise, concept.message || 'A clearer way to move from problem to action.'),
    supporting: value(proposition.supporting, concept.supporting || 'The campaign explains the decision and gives the audience a practical next step.'),
    proof: value(proposition.proof, concept.proofRequirements || 'Attach approved product, customer or first-party evidence before activation.'),
    claimsStatus: value(proposition.claimsStatus, 'Needs evidence review'),
    cta: value(proposition.cta, concept.cta || 'Start the conversation'),
    destination: value(proposition.landingUrl, 'Destination URL to confirm'),
    route: value(strategy.route, 'Problem → proof → offer → qualified action'),
    channels: list(strategy.channels),
    formats: list(brief.production?.formats),
    commercial: value(objectives.commercial, 'Create a measurable commercial outcome.'),
    kpi: value(objectives.primaryKpi, 'Primary KPI to confirm'),
    nonGoals: value(objectives.nonGoals, 'Do not optimise for reach alone.'),
    concept
  };
}

function branchCopy(campaign, branch) {
  const brand = value(branch.brand, 'Selected brand');
  const voice = value(branch.voice, 'clear, useful and technically grounded');
  const suffix = branch.market ? ` for ${branch.market}` : '';
  return { brand, voice, suffix, cta: value(branch.cta, campaign.cta), destination: value(branch.destination, campaign.destination) };
}

function landingPage(campaign, branch) {
  const b = branchCopy(campaign, branch);
  const trigger = sentence(campaign.trigger);
  const problem = sentence(campaign.problem);
  const problemCopy = problem.toLowerCase().includes(trigger.toLowerCase()) || trigger.toLowerCase() === problem.toLowerCase() ? `${problem}.` : `${trigger}. ${problem}.`;
  const sections = [
    { id: 'hero', label: 'Hero', heading: campaign.promise, copy: `${campaign.product}${b.suffix} for ${sentence(campaign.primaryAudience)}. ${sentence(campaign.supporting)}.`, cta: b.cta },
    { id: 'problem', label: 'Audience problem', heading: 'The operating problem appears at the boundary.', copy: problemCopy },
    { id: 'argument', label: 'Argument', heading: 'Make the decision visible before you choose the production path.', copy: `Start with the messages, conditions and consequences that matter. Then connect the offer to the job it must do. ${campaign.supporting}` },
    { id: 'proof', label: 'Proof', heading: 'A claim is useful when its source and limits are clear.', copy: campaign.proof, evidence: campaign.claimsStatus },
    { id: 'route', label: 'Conversion route', heading: 'Turn the question into a scoped next step.', copy: `Use the route: ${campaign.route}`, cta: b.cta },
    { id: 'form', label: 'Form', heading: 'Bring the real context.', copy: 'Ask for the minimum information needed to qualify the conversation: operating environment, current approach, priority outcome and timing.', fields: ['Name', 'Work email', 'Company', 'Operating environment', 'What would you like to solve?'] },
    { id: 'approval', label: 'Approval note', heading: 'Review before release.', copy: 'Technical claims, destination, rights, brand branch and activation owner require approval before external publication.' }
  ];
  const sectionsHtml = sections.map((section) => `<section id="${section.id}"><p class="eyebrow">${html(section.label)}</p><h2>${html(section.heading)}</h2><p>${html(section.copy)}</p>${section.evidence ? `<p class="evidence"><strong>Evidence status:</strong> ${html(section.evidence)}</p>` : ''}${section.fields ? `<ul>${section.fields.map((field) => `<li>${html(field)}</li>`).join('')}</ul>` : ''}${section.cta ? `<a class="cta" href="${html(href(b.destination))}">${html(section.cta)}</a>` : ''}</section>`).join('');
  const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${html(campaign.name)} · ${html(b.brand)}</title><style>body{margin:0;background:#f7f4ee;color:#17353b;font:16px/1.6 system-ui,sans-serif}main{max-width:920px;margin:0 auto;padding:56px 24px;background:#fff;min-height:100vh}.eyebrow{font:700 11px/1.2 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#147f79}h1{font-size:clamp(38px,7vw,76px);line-height:1.02;max-width:12ch;margin:10px 0 22px;color:#073b43}h2{font-size:28px;line-height:1.1;color:#073b43}section{border-top:1px solid #d5dfdc;padding:34px 0}section:first-of-type{border-top:0}.cta{display:inline-block;background:#073b43;color:#fff;padding:12px 18px;text-decoration:none;border-radius:3px;font-weight:700}.evidence{background:#edf7f5;padding:12px 14px;border-left:3px solid #147f79}li{margin:6px 0}</style></head><body><main><p class="eyebrow">${html(b.brand)} · ${html(campaign.market)} · PRIVATE REVIEW</p><h1>${html(campaign.name)}</h1>${sectionsHtml}</main></body></html>`;
  return { id: `${branch.id}-landing-page`, type: 'landing-page', brand: b.brand, destination: b.destination, sections, html: document, copyStatus: 'Complete draft copy; form wiring and claims approval required.' };
}

function social(campaign, branch) {
  const b = branchCopy(campaign, branch);
  const base = [
    { id: 'problem', platform: 'LinkedIn organic', hook: campaign.promise, body: `${sentence(campaign.trigger)}\n\n${sentence(campaign.problem)}\n\nStart with the operating question before selecting the architecture.`, cta: b.cta, visual: 'Text-free boundary visual with one approved branch identity applied in post.' },
    { id: 'proof', platform: 'LinkedIn document', hook: 'What should the system do when the preferred path is unavailable?', body: `A useful design review covers message priority, retry behaviour, power, antenna conditions and the consequence of silence.\n\n${campaign.supporting}\n\nEvidence: ${campaign.proof}`, cta: b.cta, visual: 'Five-slide text-free master set; copy is composed deterministically.' },
    { id: 'conversion', platform: 'LinkedIn retargeting', hook: 'Turn the coverage question into an engineering brief.', body: `${campaign.primaryAudience}: bring the route, the message profile and the constraints. The next step is a scoped conversation, not a generic promise.`, cta: b.cta, visual: 'Quiet proof-led visual with clear negative space for copy.' }
  ];
  return base.map((item) => ({ ...item, id: `${branch.id}-social-${item.id}`, brand: b.brand, destination: b.destination, altText: `${item.hook}. Illustrative campaign visual for ${campaign.product}; not customer proof.`, approval: 'Review product claims, destination and brand branch before activation.' }));
}

function emails(campaign, branch) {
  const b = branchCopy(campaign, branch);
  const base = [
    { id: '01', subject: campaign.promise, preheader: 'Start with the operating boundary.', body: `Hi {{first_name}},\n\n${campaign.trigger}\n\n${campaign.problem}\n\nWe have turned the first design questions into a practical next step.\n\n${b.cta}: ${b.destination}\n\nRegards,\n${b.brand}` },
    { id: '02', subject: 'Which messages must still arrive?', preheader: 'Prioritise the messages that change a decision.', body: `Hi {{first_name}},\n\nNot every message has the same operational value. Rank the events that are time-sensitive, the ones that can wait, and the ones that trigger a human decision.\n\n${campaign.supporting}\n\nReview the questions: ${b.destination}\n\nRegards,\n${b.brand}` },
    { id: '03', subject: 'Ready for a scoped design conversation?', preheader: 'Bring the route, constraints and desired outcome.', body: `Hi {{first_name}},\n\nIf the coverage question is active for your product, the most useful next step is a focused design conversation. Bring the operating environment, message profile, power and antenna constraints, and the commercial outcome.\n\n${b.cta}: ${b.destination}\n\nRegards,\n${b.brand}` }
  ];
  return base.map((item) => ({ ...item, id: `${branch.id}-email-${item.id}`, brand: b.brand, destination: b.destination, format: 'Email nurture', copyStatus: 'Complete copy draft; sender, list, links and deliverability checks required.' }));
}

function paid(campaign, branch) {
  const b = branchCopy(campaign, branch);
  return [
    { id: `${branch.id}-paid-search-01`, channel: 'Paid search', headline: campaign.promise, description: `${campaign.product}: make the operating boundary visible, then plan the next design step.`, cta: b.cta, destination: b.destination },
    { id: `${branch.id}-retargeting-01`, channel: 'Retargeting', headline: 'Design the exception path before it happens.', description: `${sentence(campaign.primaryAudience)}. Review the evidence and bring the real constraints to a scoped conversation.`, cta: b.cta, destination: b.destination }
  ].map((item) => ({ ...item, brand: b.brand, approval: 'Budget, audience, claims, destination and activation owner remain gated.' }));
}

function sales(campaign, branch) {
  const b = branchCopy(campaign, branch);
  return {
    id: `${branch.id}-sales-talk-track`, brand: b.brand, opener: `I’m calling because ${campaign.trigger.toLowerCase()}`, questions: [
      'Where does the device or workflow move beyond dependable coverage?',
      'Which messages change a decision, and how quickly must they arrive?',
      'What are the power, antenna, payload, retry and service constraints?',
      'What commercial outcome would make this design worth progressing?'
    ], proof: campaign.proof, objectionHandling: [
      'If the prospect expects automatic failover, clarify that the application still defines routing, retry and fallback behaviour.',
      'If the prospect asks for universal coverage or guaranteed delivery, qualify the claim and move to an engineering review.',
      'If the prospect is early stage, offer the readiness guide before a detailed design session.'
    ], handoff: `Qualify to ${campaign.kpi}; record source, vertical, urgency and owner before sales follow-up.`
  };
}

function calendar(campaign, branches) {
  const rows = [];
  const channels = ['LinkedIn organic', 'Email nurture', 'Landing page', 'Sales follow-up', 'Retargeting', 'Partner outreach'];
  for (let week = 1; week <= 6; week += 1) {
    branches.forEach((branch, index) => rows.push({ week, phase: week <= 2 ? 'Recognise' : week <= 4 ? 'Prove' : 'Convert', brand: branch.brand, channel: channels[(week + index - 1) % channels.length], asset: week === 1 ? 'problem post + landing hero' : week === 2 ? 'message-priority email' : week === 3 ? 'proof document' : week === 4 ? 'vertical use-case post' : week === 5 ? 'readiness guide' : 'design conversation follow-up', cta: value(branch.cta, campaign.cta), owner: value(campaign.owner, 'Assign owner'), status: 'Draft / approval required' }));
  }
  return rows;
}

function svgMaster(campaign, branch, index) {
  const hue = index % 2 ? '#147f79' : '#f26b38';
  const brand = value(branch.brand, 'Selected brand');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Text-free illustrative campaign master for ${html(campaign.product)}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#073b43"/><stop offset="1" stop-color="#102f36"/></linearGradient><radialGradient id="r"><stop stop-color="${hue}" stop-opacity=".8"/><stop offset="1" stop-color="${hue}" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="1240" cy="210" r="420" fill="url(#r)"/><path d="M-40 680 C 220 520 360 760 600 610 S 980 470 1220 590 1480 760 1660 560" fill="none" stroke="#d9eee9" stroke-opacity=".48" stroke-width="5"/><path d="M-20 760 C 280 590 400 820 680 690 S 1050 560 1260 690 1490 820 1650 650" fill="none" stroke="#d9eee9" stroke-opacity=".22" stroke-width="3"/><circle cx="600" cy="610" r="16" fill="#fff"/><circle cx="1220" cy="590" r="16" fill="#fff"/><g fill="#fff" opacity=".72"><circle cx="220" cy="180" r="2"/><circle cx="370" cy="280" r="3"/><circle cx="940" cy="120" r="2"/><circle cx="1390" cy="440" r="3"/></g><!-- ${brand}: one approved logo is applied downstream; no embedded copy or logo --></svg>`;
}

function claims(campaign, brief, consultantRun) {
  const inferred = list(consultantRun?.research?.evidence).filter((item) => /inferred/i.test(item.status));
  return [
    { id: 'claim-promise', claim: campaign.promise, source: value(brief.governance?.sources, 'Source not supplied'), confidence: campaign.claimsStatus, approver: 'Technical + brand owner', expiry: 'Confirm at activation' },
    { id: 'claim-support', claim: campaign.supporting, source: value(brief.governance?.sources, 'Source not supplied'), confidence: inferred.length ? 'Inferred' : 'Needs evidence review', approver: 'Technical owner', expiry: 'Confirm at activation' },
    { id: 'claim-proof', claim: campaign.proof, source: value(brief.governance?.sources, 'Source not supplied'), confidence: 'Requires approval', approver: 'Technical owner', expiry: 'Record source date' }
  ];
}

function leadMagnet(campaign, branch) {
  const b = branchCopy(campaign, branch);
  const questions = ['Operating regions and movement patterns', 'Known or suspected coverage boundaries', 'Message types, payload sizes and urgency', 'Power, enclosure and antenna constraints', 'Retry, acknowledgement and fallback behaviour', 'Commercial outcome and decision timeline'];
  const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Readiness guide · ${html(campaign.name)}</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f7f4ee;color:#17353b;margin:0}main{max-width:820px;margin:auto;background:#fff;padding:48px 28px;min-height:100vh}h1{color:#073b43;font-size:48px;line-height:1.05}.eyebrow{font:700 11px ui-monospace,monospace;letter-spacing:.14em;color:#147f79;text-transform:uppercase}li{margin:12px 0}.note{padding:16px;background:#edf7f5;border-left:3px solid #147f79}.cta{display:inline-block;background:#073b43;color:white;text-decoration:none;padding:12px 18px;font-weight:700}</style></head><body><main><p class="eyebrow">${html(b.brand)} · WORKING GUIDE</p><h1>${html(campaign.name)} readiness questions</h1><p>${html(campaign.promise)}</p><p>${html(sentence(campaign.problem))}.</p><h2>Bring these inputs</h2><ol>${questions.map((question) => `<li>${html(question)}</li>`).join('')}</ol><p class="note">This guide is a diagnostic starting point. It is not a coverage assessment, product certification or delivery guarantee.</p><a class="cta" href="${html(href(b.destination))}">${html(b.cta)}</a></main></body></html>`;
  return { id: `${branch.id}-lead-magnet`, brand: b.brand, title: `${campaign.name} readiness questions`, html: document, questions, status: 'Complete HTML lead-magnet draft; form and destination approval required.' };
}

export function buildCampaignPack({ brief, branches = [], consultantRun = null, higgsfieldJobs = [] }) {
  const campaign = core(brief, consultantRun);
  const branchData = branches.length ? branches : [{ id: 'unassigned', brand: 'Unassigned branch', market: campaign.market, cta: campaign.cta, destination: campaign.destination, voice: 'clear and useful' }];
  const landing = branchData.map((branch) => landingPage(campaign, branch));
  const socialAssets = branchData.flatMap((branch) => social(campaign, branch));
  const emailAssets = branchData.flatMap((branch) => emails(campaign, branch));
  const paidAssets = branchData.flatMap((branch) => paid(campaign, branch));
  const salesAssets = branchData.map((branch) => sales(campaign, branch));
  const leadMagnets = branchData.map((branch) => leadMagnet(campaign, branch));
  const calendarRows = calendar(campaign, branchData);
  const claimsRegister = claims(campaign, brief, consultantRun);
  const creativeMasters = branchData.map((branch, index) => ({ id: `${branch.id}-text-free-master`, brand: branch.brand, filename: `${campaign.campaignSlug}-${branch.id}-text-free-master.svg`, mimeType: 'image/svg+xml', content: svgMaster(campaign, branch, index), usage: 'Illustrative text-free master; apply approved copy and exactly one branch logo in deterministic post-processing.', rights: 'Generated locally by the compiler; no customer or product photography implied.' }));
  const files = [
    ...landing.map((item) => ({ path: `landing-pages/${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/index.html`, type: 'text/html', purpose: 'Landing-page copy and structure', content: item.html })),
    ...leadMagnets.map((item) => ({ path: `lead-magnets/${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/readiness-guide.html`, type: 'text/html', purpose: 'Lead magnet', content: item.html })),
    { path: 'copy/social-assets.json', type: 'application/json', purpose: 'Complete social copy objects', content: JSON.stringify(socialAssets, null, 2) },
    { path: 'copy/email-sequence.json', type: 'application/json', purpose: 'Complete email copy objects', content: JSON.stringify(emailAssets, null, 2) },
    { path: 'copy/paid-assets.json', type: 'application/json', purpose: 'Paid and retargeting copy objects', content: JSON.stringify(paidAssets, null, 2) },
    { path: 'sales/talk-tracks.json', type: 'application/json', purpose: 'Sales qualification and objection handling', content: JSON.stringify(salesAssets, null, 2) },
    { path: 'planning/campaign-calendar.csv', type: 'text/csv', purpose: 'Channel calendar', content: [['week', 'phase', 'brand', 'channel', 'asset', 'cta', 'owner', 'status'], ...calendarRows.map((row) => [row.week, row.phase, row.brand, row.channel, row.asset, row.cta, row.owner, row.status])].map((row) => row.map(csvCell).join(',')).join('\n') },
    { path: 'evidence/claims-register.csv', type: 'text/csv', purpose: 'Evidence and claims register', content: [['id', 'claim', 'source', 'confidence', 'approver', 'expiry'], ...claimsRegister.map((row) => [row.id, row.claim, row.source, row.confidence, row.approver, row.expiry])].map((row) => row.map(csvCell).join(',')).join('\n') },
    ...creativeMasters.map((item) => ({ path: `creative/${item.filename}`, type: item.mimeType, purpose: item.usage, content: item.content })),
    { path: 'creative/higgsfield-job-specs.json', type: 'application/json', purpose: 'Safe downstream generation specifications', content: JSON.stringify(higgsfieldJobs, null, 2) }
  ];
  const provenance = {
    generatedAt: new Date().toISOString(), generator: 'M2M Campaign Brief Compiler · deterministic production adapter', source: value(brief.governance?.sources, 'No source-of-truth reference supplied'), concept: consultantRun?.selectedConcept || null,
    researchMode: consultantRun?.research?.mode || 'No research', researchEvidence: list(consultantRun?.research?.evidence), generatedMasters: creativeMasters.map((item) => ({ filename: item.filename, method: 'local SVG text-free master', logo: 'none embedded', rights: item.rights })),
    humanGates: ['Technical claims', 'Brand branch and logo', 'Destination and form owner', 'Creative rights and provenance', 'Budget and activation owner'],
    activation: 'Private review only; no publication, spend, send, CRM mutation or external provider call is performed by this browser tool.'
  };
  return {
    schema: 'm2m-campaign-production/v1', status: 'PRIVATE REVIEW · COMPLETE DRAFT PACK', generatedAt: new Date().toISOString(), publication: {
      targetRoot: '/campaigns/', route: `/campaigns/${campaign.campaignSlug}/`, mode: 'controlled repository publisher',
      command: 'node tools/publish-campaign-pack.cjs <campaign-pack.json> [slug]', status: 'Private review; commit and Pages deployment required.'
    }, summary: {
      landingPages: landing.length, socialAssets: socialAssets.length, emailAssets: emailAssets.length, paidAssets: paidAssets.length, salesTalkTracks: salesAssets.length, leadMagnets: leadMagnets.length, calendarRows: calendarRows.length, claims: claimsRegister.length, creativeMasters: creativeMasters.length, higgsfieldJobs: higgsfieldJobs.length, files: files.length
    }, copy: { landing, social: socialAssets, email: emailAssets, paid: paidAssets, sales: salesAssets, leadMagnets }, calendar: calendarRows, claimsRegister, creativeMasters: creativeMasters.map(({ content, ...metadata }) => metadata), files: files.map(({ content, ...metadata }) => metadata), provenance,
    _downloadFiles: files
  };
}

