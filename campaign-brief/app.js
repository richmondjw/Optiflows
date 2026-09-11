import { BRANDS } from './plugins.js';
import { LIBRARIES, LIBRARY_META } from './libraries.js';
const STORAGE_KEY = 'm2m-campaign-brief-compiler-v1';

const STAGES = [
  ['foundation', 'Foundation', 'What is this campaign?'],
  ['audience', 'Audience', 'Who needs to act?'],
  ['objectives', 'Objectives', 'What changes commercially?'],
  ['proposition', 'Proposition', 'What should they believe?'],
  ['strategy', 'Strategy', 'How will the idea travel?'],
  ['production', 'Production', 'What gets made?'],
  ['governance', 'Evidence & gates', 'What can we prove?'],
  ['branches', 'Brand branches', 'Who owns the output?']
];

const blankState = () => ({
  meta: { campaignName: '', campaignSlug: '', product: '', market: 'Australia', campaignType: 'Demand generation', owner: '', startDate: '', endDate: '' },
  audience: { primary: '', primarySegments: [], primaryOther: '', primaryDetail: '', roles: [], rolesSelected: [], rolesOther: '', verticals: [], verticalsSelected: [], verticalsOther: '', geographies: '', trigger: '', problem: '', objections: '' },
  objectives: { commercial: '', commercialTypes: [], commercialOther: '', marketing: '', marketingTypes: [], marketingOther: '', communications: '', communicationsTypes: [], communicationsOther: '', kpis: [], primaryKpi: '', secondaryKpis: [], nonGoals: '' },
  proposition: { promise: '', supporting: '', proof: '', claimsStatus: 'Needs evidence review', cta: '', landingUrl: '', suggestions: [] },
  strategy: { route: '', phases: '', channels: [], tactics: '', nurture: '', recommendations: [] },
  production: { formats: ['LinkedIn organic'], creative: '', imagery: '', motion: '', assetNotes: '' },
  governance: { sources: '', rights: '', assumptions: '', gates: [], activation: 'Private review' },
  branches: { selected: ['m2m-connectivity', 'm2m-one-au'], independent: true, higgsfield: 'Job specifications only', handoff: '' }
});

const fixture = {
  meta: { campaignName: 'Coverage Beyond the Grid', campaignSlug: 'coverage-beyond-the-grid', product: 'Iridium Certus 9604 Hybrid IoT', market: 'Australia + New Zealand', campaignType: 'Demand generation', owner: 'M2M Group', startDate: '2026-09-21', endDate: '2026-12-13' },
  audience: {
    primary: 'Product teams and system integrators whose connected devices move beyond dependable cellular coverage.',
    primarySegments: ['OEM and product teams', 'System integrators and channel partners'],
    primaryOther: '',
    primaryDetail: 'Product teams and system integrators whose connected devices move beyond dependable cellular coverage.',
    roles: ['Product manager', 'Embedded systems engineer', 'Solution architect', 'Operations leader'],
    rolesSelected: ['Product manager', 'Embedded systems engineer', 'Solution architect', 'Operations leader'],
    rolesOther: '',
    verticals: ['Asset tracking and logistics', 'Agtech', 'Environmental monitoring', 'Remote equipment', 'Field safety'],
    verticalsSelected: ['Asset tracking and monitoring', 'Agriculture and agtech', 'Environmental monitoring', 'Industrial automation', 'Security and field safety'],
    verticalsOther: 'Remote equipment',
    geographies: 'Australia and New Zealand; remote, regional and mobile operating environments.',
    trigger: 'A device, asset or worker reaches the edge of the cellular operating map and a missed message has an operational consequence.',
    problem: 'Teams need to decide which messages must travel, by which path, and what the device should do when its preferred network is unavailable.',
    objections: 'Hybrid connectivity sounds like a magic switch; satellite claims may over-promise; architecture, power, antenna, service and commercial constraints still need review.'
  },
  objectives: {
    commercial: 'Generate qualified technical conversations and sales-accepted leads for Hybrid IoT design work.',
    commercialTypes: ['Generate sales-accepted leads'],
    commercialOther: '',
    marketing: 'Build a qualified audience around the coverage boundary and move engaged teams to a readiness guide.',
    marketingTypes: ['Create qualified pipeline', 'Drive an assessment or consultation'],
    marketingOther: '',
    communications: 'Make the operational boundary visible, prove the design questions in credible contexts, then invite a scoped engineering conversation.',
    communicationsTypes: ['Educate a technical market'],
    communicationsOther: '',
    primaryKpi: 'Qualified design-session requests and sales-accepted leads',
    secondaryKpis: ['Readiness-guide conversion', 'Repeat visits', 'LinkedIn document completion', 'Lead response time', 'Performance by source and vertical'],
    kpis: ['Qualified design-session requests and sales-accepted leads', 'Readiness-guide conversion', 'Repeat visits', 'LinkedIn document completion', 'Lead response time', 'Performance by source and vertical'],
    nonGoals: 'This is not an impressions or opens campaign. It does not promise universal coverage, automatic failover or a confirmed event.'
  },
  proposition: {
    promise: 'Cellular where you can. Satellite where you must.',
    supporting: 'One compact module makes both layers available. Your product design defines routing, retry, priority and fallback behaviour.',
    proof: 'Official Iridium 9604 product information: LTE-M cellular, Iridium Short Burst Data and GNSS in a 16 × 26 × 2.4 mm module; independent subsystem control and a unified AT-command interface.',
    claimsStatus: 'Confirmed and qualified; application behaviour remains developer-defined.',
    cta: 'Start a Hybrid IoT design conversation',
    landingUrl: 'https://m2mone.com.au/hybrid-iot-readiness/'
  },
  strategy: {
    route: 'Coverage problem → readiness guide → qualified design conversation',
    phases: '01 Recognise the coverage gap (weeks 1–3) → 02 Prove it in the field (weeks 4–8) → 03 Move into engineering (weeks 9–12)',
    channels: ['LinkedIn organic', 'LinkedIn document', 'Segmented email nurture', 'Hybrid IoT landing page', 'Paid search', 'Retargeting', 'Sales and SI follow-up'],
    tactics: 'Weekly stills, five vertical carousels, technical document posts, segmented emails, landing-page proof, readiness guide, proposed design clinic and sales talk tracks.',
    nurture: 'Recognise → educate → diagnose → convert, with lead response and qualification owned by sales.',
    recommendations: []
  },
  production: {
    formats: ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Sales enablement', 'Motion study'],
    creative: 'Human operating moments at the coverage edge. Technical clarity over product glamour. Every claim carries an evidence label.',
    imagery: 'Illustrative human and field settings are allowed when marked as generated and not presented as customer proof. Product and technical diagrams require source approval.',
    motion: 'Short explainer and motion studies may be generated from text-free Higgsfield masters, then composited with approved typography and logos.',
    assetNotes: 'Create independent M2M Connectivity and M2M One branches. Never place both logos on one artwork.'
  },
  governance: {
    sources: 'Official Iridium 9604 product information; campaign-owned readiness framework; live OptiFlows campaign pack at /campaigns/9604-hybrid-connectivity/.',
    rights: 'Confirm image, logo, font, product-render, partner and customer permissions before publication. Generated illustrations are not case studies or testimonials.',
    assumptions: 'Date, speaker, capacity and owner for the proposed design clinic remain unconfirmed. Final application architecture and coverage depend on engineering review.',
    gates: ['Technical claims reviewed', 'Brand branch reviewed', 'Landing-page destination and form owner confirmed', 'Creative rights and provenance recorded', 'Budget and activation owner approved'],
    activation: 'Private review'
  },
  branches: { selected: ['m2m-connectivity', 'm2m-one-au'], independent: true, higgsfield: 'Job specifications only', handoff: 'M2M marketing owns the brief; technical, brand and commercial owners approve before activation.' }
};

let state = loadState();
let currentStage = 0;

const $ = (selector) => document.querySelector(selector);
const formMount = $('#formMount');
const previewMount = $('#previewMount');

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loaded = saved ? merge(blankState(), JSON.parse(saved)) : blankState();
    return normalizeState(loaded);
  } catch { return normalizeState(blankState()); }
}

function merge(base, input) {
  if (!input || typeof input !== 'object') return base;
  Object.keys(base).forEach((key) => {
    if (input[key] && typeof base[key] === 'object' && !Array.isArray(base[key]) && typeof input[key] === 'object') base[key] = { ...base[key], ...input[key] };
    else if (input[key] !== undefined) base[key] = input[key];
  });
  return base;
}

function normalizeState(nextState = state) {
  const audience = nextState.audience || (nextState.audience = {});
  const objectives = nextState.objectives || (nextState.objectives = {});
  const proposition = nextState.proposition || (nextState.proposition = {});
  const strategy = nextState.strategy || (nextState.strategy = {});
  const array = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
  audience.primarySegments = array(audience.primarySegments);
  audience.rolesSelected = array(audience.rolesSelected);
  audience.verticalsSelected = array(audience.verticalsSelected);
  audience.roles = array(audience.roles);
  audience.verticals = array(audience.verticals);
  audience.primaryOther = audience.primaryOther || '';
  audience.rolesOther = audience.rolesOther || '';
  audience.verticalsOther = audience.verticalsOther || '';
  const splitKnown = (legacy, selected, other, options) => {
    if (selected.length || !legacy.length) return { selected, other };
    const known = legacy.filter((item) => options.includes(item));
    const unknown = legacy.filter((item) => !options.includes(item));
    return { selected: known, other: [other, ...unknown].filter(Boolean).join('; ') };
  };
  let split = splitKnown(audience.roles, audience.rolesSelected, audience.rolesOther, LIBRARIES.roles);
  audience.rolesSelected = split.selected; audience.rolesOther = split.other;
  split = splitKnown(audience.verticals, audience.verticalsSelected, audience.verticalsOther, LIBRARIES.verticals);
  audience.verticalsSelected = split.selected; audience.verticalsOther = split.other;
  if (!audience.primarySegments.length && audience.primary) audience.primaryOther = audience.primaryOther || audience.primary;
  if (audience.primary && audience.primarySegments.length && !audience.primaryDetail) audience.primaryDetail = audience.primary;
  audience.primary = audience.primaryDetail || [...audience.primarySegments, audience.primaryOther].filter(Boolean).join('; ') || audience.primary || '';
  audience.roles = [...audience.rolesSelected, audience.rolesOther].filter(Boolean);
  audience.verticals = [...audience.verticalsSelected, audience.verticalsOther].filter(Boolean);
  objectives.commercialTypes = array(objectives.commercialTypes);
  objectives.marketingTypes = array(objectives.marketingTypes);
  objectives.communicationsTypes = array(objectives.communicationsTypes);
  objectives.kpis = array(objectives.kpis);
  objectives.secondaryKpis = array(objectives.secondaryKpis);
  if (!objectives.kpis.length) objectives.kpis = [objectives.primaryKpi, ...objectives.secondaryKpis].filter(Boolean);
  if (!objectives.primaryKpi && objectives.kpis.length) objectives.primaryKpi = objectives.kpis[0];
  objectives.secondaryKpis = objectives.kpis.filter((item) => item !== objectives.primaryKpi);
  objectives.commercialOther = objectives.commercialOther || '';
  objectives.marketingOther = objectives.marketingOther || '';
  objectives.communicationsOther = objectives.communicationsOther || '';
  proposition.suggestions = array(proposition.suggestions);
  strategy.recommendations = array(strategy.recommendations);
  return nextState;
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function get(path) { return path.split('.').reduce((obj, key) => obj?.[key], state); }
function set(path, value) { const bits = path.split('.'); const last = bits.pop(); const target = bits.reduce((obj, key) => obj[key], state); target[last] = value; }
function slugify(value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70); }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $('#saveState').textContent = `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600); }

function input(path, label, hint = '', type = 'text', placeholder = '') {
  const val = get(path) || '';
  return `<div class="field"><label for="${path.replace('.', '-')}">${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</label><input id="${path.replace('.', '-')}" data-bind="${path}" type="${type}" value="${esc(val)}" placeholder="${esc(placeholder)}"></div>`;
}
function textarea(path, label, hint = '', placeholder = '', full = true) {
  const val = get(path) || '';
  return `<div class="field ${full ? 'full' : ''}"><label for="${path.replace('.', '-')}">${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</label><textarea id="${path.replace('.', '-')}" data-bind="${path}" placeholder="${esc(placeholder)}">${esc(val)}</textarea></div>`;
}
function select(path, label, options, hint = '') {
  const current = get(path) || '';
  const values = current && !options.includes(current) ? [options[0], current, ...options.slice(1)] : options;
  const val = current || options[0];
  return `<div class="field"><label for="${path.replace('.', '-')}">${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</label><select id="${path.replace('.', '-')}" data-bind="${path}">${values.map((option) => `<option value="${esc(option)}" ${option === val ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select></div>`;
}
function tags(path, label, hint = '', placeholder = 'Type and press Enter') {
  const items = get(path) || [];
  return `<div class="field full"><label>${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</label><div class="tag-editor" data-tags="${path}">${items.map((item, index) => `<span class="tag">${esc(item)}<button type="button" data-remove-tag="${path}" data-index="${index}" aria-label="Remove ${esc(item)}">×</button></span>`).join('')}<input class="tag-input" data-tag-input="${path}" placeholder="${esc(placeholder)}"></div></div>`;
}
function libraryChoices(path, otherPath, label, options, hint = '', columns = 2) {
  const selected = get(path) || [];
  const source = `${LIBRARY_META.source} · reviewed ${LIBRARY_META.reviewed}`;
  return `<fieldset class="field full library-field"><legend>${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</legend><p class="source-note">${esc(source)}. ${esc(LIBRARY_META.status)}</p><div class="choice-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr))">${options.map((option) => `<div class="choice"><input id="${path.replace(/\./g, '-')}-${slugify(option)}" data-check="${path}" type="checkbox" value="${esc(option)}" ${selected.includes(option) ? 'checked' : ''}><label for="${path.replace(/\./g, '-')}-${slugify(option)}">${esc(option)}</label></div>`).join('')}</div><div class="other-field">${input(otherPath, 'Other', 'Add a value that is not in the curated library.', 'text', 'Type another option')}</div></fieldset>`;
}
function choices(path, label, options, hint = '', columns = 2) {
  const selected = get(path) || [];
  return `<fieldset class="field full"><legend>${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</legend><div class="choice-grid" style="grid-template-columns:repeat(${columns},minmax(0,1fr))">${options.map((option) => `<div class="choice"><input id="${path.replace('.', '-')}-${slugify(option)}" data-check="${path}" type="checkbox" value="${esc(option)}" ${selected.includes(option) ? 'checked' : ''}><label for="${path.replace('.', '-')}-${slugify(option)}">${esc(option)}</label></div>`).join('')}</div></fieldset>`;
}
function suggestionPanel(kind) {
  const isProposition = kind === 'proposition';
  const items = get(isProposition ? 'proposition.suggestions' : 'strategy.recommendations') || [];
  const cards = items.length ? items.map((item) => isProposition
    ? `<article class="suggestion-card"><div><span class="suggestion-label">${esc(item.label)}</span><h4>${esc(item.promise)}</h4><p>${esc(item.supporting)}</p><small>${esc(item.proofNeed)}</small></div><div class="suggestion-actions"><span class="suggestion-confidence">${esc(item.confidence || 'Working hypothesis')}</span><button type="button" class="button button-secondary button-small" data-action="use-suggestion" data-suggestion="${esc(item.id)}">Use this direction</button></div></article>`
    : `<article class="suggestion-card recommendation-card"><div><span class="suggestion-label">${esc(item.title)}</span><h4>${esc(item.why)}</h4><p><strong>Route:</strong> ${esc(item.route)}</p><p><strong>Phases:</strong> ${esc(item.phases)}</p><small><strong>Channels:</strong> ${esc((item.channels || []).join(', '))}</small></div><div class="suggestion-actions"><span class="suggestion-confidence">${esc(item.confidence || 'Working recommendation')}</span><button type="button" class="button button-secondary button-small" data-action="use-strategy" data-strategy="${esc(item.id)}">Use this strategy</button></div></article>`).join('') : `<div class="empty-note">${isProposition ? 'Answer the audience, product and problem questions, then generate a few message directions.' : 'Complete the decision fields, then generate a few strategic routes.'}</div>`;
  return `<section class="suggestion-panel"><div class="suggestion-head"><div><span class="suggestion-kicker">Assisted starting point</span><h3>${isProposition ? 'Generate message directions' : 'Recommend a strategy'}</h3><p>${isProposition ? 'Uses the information already in this brief to propose reviewable promise and supporting-message options.' : 'Uses the audience, objective, proposition and channels to propose a practical route.'}</p></div><button type="button" class="button button-primary button-small" data-action="${isProposition ? 'generate-suggestions' : 'recommend-strategy'}">${isProposition ? 'Suggest messages' : 'Generate strategy'}</button></div><p class="suggestion-disclaimer">These are working hypotheses from the current brief. Confirm proof, owners and gates before they enter production.</p><div class="suggestion-list">${cards}</div></section>`;
}
function radio(path, label, options, hint = '') {
  const selected = get(path);
  return `<fieldset class="field full"><legend>${esc(label)}${hint ? `<span>${esc(hint)}</span>` : ''}</legend><div class="choice-grid">${options.map((option) => `<div class="choice radio"><input id="${path.replace('.', '-')}-${slugify(option)}" data-radio="${path}" type="radio" name="${path}" value="${esc(option)}" ${selected === option ? 'checked' : ''}><label for="${path.replace('.', '-')}-${slugify(option)}">${esc(option)}</label></div>`).join('')}</div></fieldset>`;
}
function stageHeader(index, title, description) { return `<div class="section-header"><span class="section-index">${String(index + 1).padStart(2, '0')} / ${String(STAGES.length).padStart(2, '0')}</span><h2>${esc(title)}</h2><p>${esc(description)}</p></div>`; }

function renderStage(index) {
  const [id, title, desc] = STAGES[index];
  let body = '';
  if (id === 'foundation') body = `<div class="field-grid">${input('meta.campaignName', 'Campaign name', 'Working title; make it clear enough for sales and production.', 'text', 'e.g. Coverage Beyond the Grid')}${input('meta.campaignSlug', 'Campaign slug', 'Used for exports, URLs and file names.', 'text', 'coverage-beyond-the-grid')}${input('meta.product', 'Product, offer or focus', '', 'text', 'What is this campaign about?')}${select('meta.market', 'Market or operating region', ['Australia', 'New Zealand', 'Australia + New Zealand', 'Global', 'Other'])}${select('meta.campaignType', 'Campaign type', ['Demand generation', 'Product launch', 'Education', 'Event or webinar', 'Account-based', 'Always-on nurture', 'Other'])}${input('meta.owner', 'Campaign owner', '', 'text', 'Person or team accountable for the brief')}${input('meta.startDate', 'Proposed start', '', 'date')}${input('meta.endDate', 'Proposed end', '', 'date')}</div><div class="helper"><strong>Start with the decision.</strong> The compiler keeps the brief generic; the brand plugin is selected later so one strategy can create independent M2M or Semtech branches.</div>`;
  if (id === 'audience') body = `<div class="field-grid">${libraryChoices('audience.primarySegments', 'audience.primaryOther', 'Primary audience', LIBRARIES.audiences, 'Select the audience groups this campaign is designed to move. Add a specific segment under Other if needed.', 2)}${textarea('audience.primaryDetail', 'Audience context', 'Add the sentence that makes the selected groups specific to this campaign.', 'e.g. Product teams whose devices move beyond dependable cellular coverage.', true)}${textarea('audience.geographies', 'Where they operate', '', 'Markets, routes, sites or regions.', false)}${libraryChoices('audience.rolesSelected', 'audience.rolesOther', 'Roles in the decision', LIBRARIES.roles, 'Select the roles who influence, approve or use the offer.', 2)}${libraryChoices('audience.verticalsSelected', 'audience.verticalsOther', 'Primary verticals', LIBRARIES.verticals, 'Select the vertical contexts that make the problem urgent or valuable.', 2)}${textarea('audience.trigger', 'Trigger or moment', 'What happened that makes this problem worth solving now?', 'The situation that starts the search.', true)}${textarea('audience.problem', 'Problem to solve', 'Describe the operational problem in their words.', 'What fails, costs time or creates risk?', true)}${textarea('audience.objections', 'Likely objections', 'Capture the reasons a credible buyer may hesitate.', 'What must the campaign answer?', true)}</div>`;
  if (id === 'objectives') body = `<div class="field-grid">${libraryChoices('objectives.commercialTypes', 'objectives.commercialOther', 'Commercial objective type', LIBRARIES.commercialObjectiveTypes, 'Choose the business outcome this campaign should influence, then explain the commercial context.', 2)}${textarea('objectives.commercial', 'Commercial objective detail', 'The business result this campaign is expected to influence.', 'Pipeline, revenue, retention, partner or product adoption.', true)}${libraryChoices('objectives.marketingTypes', 'objectives.marketingOther', 'Marketing objective type', LIBRARIES.marketingObjectiveTypes, 'Choose the audience or behaviour marketing must move.', 2)}${textarea('objectives.marketing', 'Marketing objective detail', 'The audience or behaviour marketing must move.', 'Qualified traffic, demand, engagement or progression.', true)}${libraryChoices('objectives.communicationsTypes', 'objectives.communicationsOther', 'Communication objective type', LIBRARIES.communicationsObjectiveTypes, 'Choose the change in understanding or belief the campaign must create.', 2)}${textarea('objectives.communications', 'Communication objective detail', 'The understanding or belief that needs to change.', 'What should become clear or credible?', true)}${tags('objectives.kpis', 'KPIs', 'Add as many measures as the campaign needs. The first selected KPI is the primary measure unless you choose another below.', 'e.g. Qualified opportunities')}${select('objectives.primaryKpi', 'Primary KPI', ['Choose a primary KPI', ...(get('objectives.kpis') || [])], 'Choose one measure that decides whether the campaign worked.')}${textarea('objectives.nonGoals', 'Non-goals and guardrails', 'Prevent optimisation from drifting into the wrong outcome.', 'e.g. Not an impressions campaign.', true)}</div>`;
  if (id === 'proposition') body = `${suggestionPanel('proposition')}<div class="field-grid">${textarea('proposition.promise', 'Core promise', 'One line the audience can remember.', 'The clearest defensible promise.', true)}${textarea('proposition.supporting', 'Supporting message', 'How the promise becomes useful in the real world.', 'The mechanism, distinction or design truth.', true)}${textarea('proposition.proof', 'Proof available', 'Use claims, sources, customer evidence or product facts.', 'What can we show or cite?', true)}${select('proposition.claimsStatus', 'Claim confidence', ['Needs evidence review', 'Confirmed and qualified', 'Strongly supported', 'Inferred from evidence', 'Contradictory or stale'])}${input('proposition.cta', 'Primary CTA', 'The action the campaign should earn.', 'text', 'e.g. Start a design conversation')}${input('proposition.landingUrl', 'Destination URL', 'Use a real URL or mark it for confirmation.', 'url', 'https://')}</div><div class="helper"><strong>Proof follows promise.</strong> If a statement cannot be sourced, it becomes an assumption or a gate in the exported pack.</div>`;
  if (id === 'strategy') body = `${suggestionPanel('strategy')}<div class="field-grid">${textarea('strategy.route', 'Conversion route', 'Write the movement from problem to action.', 'Problem → proof → offer → qualified action.', true)}${textarea('strategy.phases', 'Strategic phases', 'Name the job of each phase and its time window.', 'Recognise → prove → convert, or your own sequence.', true)}${choices('strategy.channels', 'Channels', ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Partner or SI outreach', 'Sales follow-up', 'Webinar or clinic'], 'Select the channels you want the pack to specify.', 3)}${textarea('strategy.tactics', 'Marcom tactics', 'What will each channel do, and in what order?', 'Content, nurture, offer, retargeting and sales actions.', true)}${textarea('strategy.nurture', 'Nurture and handoff', 'What happens after engagement? Name the owner.', 'Scoring, routing, response time and sales follow-up.', true)}</div>`;
  if (id === 'production') body = `<div class="field-grid">${choices('production.formats', 'Output formats', ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Sales enablement', 'Motion study', 'Lead magnet'], 'These become objects in the campaign pack.', 3)}${textarea('production.creative', 'Creative direction', 'Give production a visual and editorial north star.', 'Mood, subject, point of view and what to avoid.', true)}${textarea('production.imagery', 'Imagery and asset rules', 'Describe what may be generated, supplied or composited.', 'Rights, product renders, people, diagrams and alt text.', true)}${textarea('production.motion', 'Motion and Higgsfield direction', 'Describe motion energy and the role of generated masters.', 'What should move, and what must remain deterministic?', true)}${textarea('production.assetNotes', 'Format and brand constraints', 'Specific rules that must survive every channel.', 'e.g. Independent single-brand artwork; no combined lockups.', true)}</div>`;
  if (id === 'governance') body = `<div class="field-grid">${textarea('governance.sources', 'Sources of truth', 'Link or name the evidence behind claims and decisions.', 'URLs, documents, CRM evidence or campaign references.', true)}${textarea('governance.rights', 'Rights and provenance', 'Record permissions and generation provenance.', 'Logo, photo, customer, product and AI-generation rights.', true)}${textarea('governance.assumptions', 'Open assumptions', 'What remains unknown, proposed or conditional?', 'Surface uncertainty instead of hiding it.', true)}${choices('governance.gates', 'Required release gates', ['Technical claims reviewed', 'Brand branch reviewed', 'Landing destination and form owner confirmed', 'Creative rights and provenance recorded', 'Budget and activation owner approved', 'Legal or privacy review'], 'The pack cannot be treated as activation approval.', 2)}${radio('governance.activation', 'Current release state', ['Private review', 'Ready for approval', 'Approved for activation'], 'Publishing, spend, sending and external communication remain separate human decisions.')}</div>`;
  if (id === 'branches') {
    body = `<div class="field-grid"><fieldset class="field full"><legend>Brand plugins<span>Select every independent branch this brief should produce.</span></legend><div class="brand-grid">${Object.entries(BRANDS).map(([id, brand]) => `<div class="brand-option"><input id="brand-${id}" data-brand="${id}" type="checkbox" ${get('branches.selected').includes(id) ? 'checked' : ''}><label for="brand-${id}"><span class="brand-logo ${brand.logo ? '' : 'wordmark'}">${brand.logo ? `<img src="${brand.logo}" alt="">` : esc(brand.name)}</span><span><strong>${esc(brand.name)}</strong><small>${esc(brand.entity)} · ${esc(brand.market)}</small></span></label></div>`).join('')}</div></fieldset><div class="field full"><div class="switch-row"><span><strong>Independent brand artwork</strong><small>Each artwork receives one selected brand identity and one approved logo. No combined lockups.</small></span><label class="switch"><input type="checkbox" data-toggle="branches.independent" ${get('branches.independent') ? 'checked' : ''}><span class="slider"></span></label></div></div>${radio('branches.higgsfield', 'Higgsfield handoff', ['Job specifications only', 'Server connector when approved', 'Manual creative production'], 'The browser exports safe job specs; provider credentials stay server-side.')}${textarea('branches.handoff', 'Owners and handoff notes', 'Who reviews, who produces and who accepts the lead?', 'Brand approver, technical reviewer, sales owner and next handoff.', true)}</div><div class="helper"><strong>Brand plugins are replaceable.</strong> The generic core carries the strategy. Each selected plugin adds voice, logo, CTA, market and approval metadata to its own branch.</div>`;
  }
  return `${stageHeader(index, title, desc)}${body}`;
}

function renderNav() {
  const html = STAGES.map(([id, name], index) => `<button class="stage-button ${index === currentStage ? 'active' : ''} ${stageComplete(id) ? 'done' : ''}" data-stage="${index}" type="button"><span class="stage-number">${String(index + 1).padStart(2, '0')}</span><span class="stage-name">${esc(name)}</span><span class="stage-state">${stageComplete(id) ? '✓' : ''}</span></button>`).join('');
  $('#stageNav').innerHTML = html;
  document.querySelectorAll('[data-stage]').forEach((button) => button.addEventListener('click', () => { currentStage = Number(button.dataset.stage); render(); }));
}

const requiredByStage = {
  foundation: ['meta.campaignName', 'meta.product', 'meta.owner'],
  audience: ['audience.primary', 'audience.problem'],
  objectives: ['objectives.commercial', 'objectives.communications', 'objectives.primaryKpi'],
  proposition: ['proposition.promise', 'proposition.cta'],
  strategy: ['strategy.route', 'strategy.channels'],
  production: ['production.formats', 'production.creative'],
  governance: ['governance.sources', 'governance.gates'],
  branches: ['branches.selected', 'branches.handoff']
};
function hasValue(value) { return Array.isArray(value) ? value.length > 0 : String(value || '').trim().length > 0; }
function stageComplete(id) { return (requiredByStage[id] || []).every((path) => hasValue(get(path))); }
function missing() { return Object.values(requiredByStage).flat().filter((path) => !hasValue(get(path))); }
function score() { const total = Object.values(requiredByStage).flat().length; const complete = total - missing().length; let value = Math.round((complete / total) * 100); if (!get('branches.independent')) value = Math.max(0, value - 7); return value; }

function audienceSummary() {
  const audience = get('audience.primary') || [...(get('audience.primarySegments') || []), get('audience.primaryOther')].filter(Boolean).join(', ');
  return audience || 'the selected audience';
}

function generateSuggestions() {
  const audience = audienceSummary();
  const product = get('meta.product') || 'the offer';
  const problem = String(get('audience.problem') || 'the operational problem').trim().replace(/[.!?]+$/, '');
  const objective = String(get('objectives.commercial') || get('objectives.marketing') || 'move from uncertainty to a qualified next step').trim().replace(/[.!?]+$/, '');
  set('proposition.suggestions', [
    { id: 'problem-visible', label: 'Make the problem visible', promise: `Help ${audience} respond when ${problem}.`, supporting: `${product} gives the campaign a practical way to explain the decision, the trade-offs and the next step.`, proofNeed: `Proof to attach: evidence that supports the problem, the product mechanism and the outcome.`, confidence: 'Working hypothesis' },
    { id: 'decision-ready', label: 'Make the decision easier', promise: `Give ${audience} a clearer path from ${problem} to a decision they can defend.`, supporting: `Turn the campaign into a useful guide: what to assess, what to ask and how ${product} may fit the context.`, proofNeed: `Proof to attach: readiness criteria, technical facts and a qualified owner for follow-up.`, confidence: 'Working hypothesis' },
    { id: 'outcome-led', label: 'Connect the offer to the outcome', promise: `Help ${audience} make progress on ${objective}.`, supporting: `Show the design or commercial questions behind ${product}, then invite a scoped conversation rather than an unsupported guarantee.`, proofNeed: `Proof to attach: measurable outcome definition, source references and claim review.`, confidence: 'Working hypothesis' }
  ]);
  showToast('Three message directions generated for review');
}

function recommendStrategy() {
  const audience = audienceSummary();
  const problem = get('audience.problem') || 'the operational problem';
  const promise = get('proposition.promise') || 'the campaign promise';
  const selectedChannels = get('strategy.channels') || [];
  const channels = selectedChannels.length ? selectedChannels : ['LinkedIn organic', 'Landing page', 'Email nurture', 'Sales follow-up'];
  set('strategy.recommendations', [
    { id: 'diagnose-first', title: 'Diagnose before you sell', why: `Lead ${audience} from a recognisable ${problem} to a short readiness assessment.`, route: 'Problem signal → diagnostic content → readiness assessment → qualified conversation', phases: 'Recognise the trigger → help the buyer self-assess → route high-intent responses', channels, tactics: 'Use a problem-led social series, a concise diagnostic checklist, a landing page with proof and a sales follow-up play.', nurture: 'Score assessment completion and route qualified responses to the named owner.', confidence: 'Working recommendation' },
    { id: 'proof-led', title: 'Let proof carry the argument', why: `Build credibility around ${promise} before asking for a conversation.`, route: 'Claim or question → technical proof → use-case context → scoped conversation', phases: 'Frame the question → demonstrate the mechanism → answer objections → invite the next step', channels, tactics: 'Create a proof matrix, a technical document post, an objection-handling email and a source-linked landing page.', nurture: 'Move engaged readers into a proof-led sequence and record the evidence used in the handoff.', confidence: 'Working recommendation' },
    { id: 'conversion-led', title: 'Design for a clear handoff', why: `Make every touchpoint point to the same qualified action for ${audience}.`, route: 'Audience need → focused proposition → offer page → form and sales response', phases: 'Create intent → remove friction → capture context → respond quickly', channels, tactics: 'Use one proposition across paid and organic entry points, a focused form, retargeting and a response-time promise.', nurture: 'Capture role, vertical and urgency in the form, then assign a response owner and SLA.', confidence: 'Working recommendation' }
  ]);
  showToast('Three strategy recommendations generated for review');
}

function useSuggestion(id) {
  const item = (get('proposition.suggestions') || []).find((suggestion) => suggestion.id === id);
  if (!item) return;
  set('proposition.promise', item.promise); set('proposition.supporting', item.supporting);
  if (!get('proposition.cta')) set('proposition.cta', 'Explore the next step');
  save(); render(); showToast('Message direction applied; check proof before production');
}

function useStrategy(id) {
  const item = (get('strategy.recommendations') || []).find((recommendation) => recommendation.id === id);
  if (!item) return;
  set('strategy.route', item.route); set('strategy.phases', item.phases); set('strategy.channels', item.channels || []); set('strategy.tactics', item.tactics); set('strategy.nurture', item.nurture);
  save(); render(); showToast('Strategy recommendation applied; review owners and gates');
}

function attachFormEvents() {
  formMount.querySelectorAll('[data-bind]').forEach((element) => ['input', 'change'].forEach((eventName) => element.addEventListener(eventName, () => {
    set(element.dataset.bind, element.dataset.bind === 'objectives.primaryKpi' && element.value === 'Choose a primary KPI' ? '' : element.value);
    if (element.dataset.bind === 'meta.campaignName' && !get('meta.campaignSlug')) { const slug = document.querySelector('[data-bind="meta.campaignSlug"]'); if (slug) slug.value = slugify(element.value); }
    normalizeState(); save(); updateOutput(); renderNav();
  })));
  formMount.querySelectorAll('[data-check]').forEach((element) => element.addEventListener('change', () => {
    const values = [...formMount.querySelectorAll(`[data-check="${element.dataset.check}"]:checked`)].map((item) => item.value); set(element.dataset.check, values); normalizeState(); save(); updateOutput(); renderNav();
  }));
  formMount.querySelectorAll('[data-radio]').forEach((element) => element.addEventListener('change', () => { if (element.checked) { set(element.dataset.radio, element.value); save(); updateOutput(); renderNav(); } }));
  formMount.querySelectorAll('[data-toggle]').forEach((element) => element.addEventListener('change', () => { set(element.dataset.toggle, element.checked); save(); updateOutput(); renderNav(); }));
  formMount.querySelectorAll('[data-brand]').forEach((element) => element.addEventListener('change', () => { const selected = [...formMount.querySelectorAll('[data-brand]:checked')].map((item) => item.dataset.brand); set('branches.selected', selected); save(); updateOutput(); renderNav(); }));
  formMount.querySelectorAll('[data-tag-input]').forEach((element) => element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ',') return; event.preventDefault(); const value = element.value.trim().replace(/,$/, ''); if (!value) return; const path = element.dataset.tagInput; set(path, [...(get(path) || []), value]); normalizeState(); element.value = ''; save(); render();
  }));
  formMount.querySelectorAll('[data-remove-tag]').forEach((element) => element.addEventListener('click', () => { const path = element.dataset.removeTag; const values = [...(get(path) || [])]; values.splice(Number(element.dataset.index), 1); set(path, values); save(); render(); }));
  formMount.querySelectorAll('[data-action="generate-suggestions"]').forEach((element) => element.addEventListener('click', () => { generateSuggestions(); save(); render(); }));
  formMount.querySelectorAll('[data-action="use-suggestion"]').forEach((element) => element.addEventListener('click', () => useSuggestion(element.dataset.suggestion)));
  formMount.querySelectorAll('[data-action="recommend-strategy"]').forEach((element) => element.addEventListener('click', () => { recommendStrategy(); save(); render(); }));
  formMount.querySelectorAll('[data-action="use-strategy"]').forEach((element) => element.addEventListener('click', () => useStrategy(element.dataset.strategy)));
}

function brandBranch(id) {
  const brand = BRANDS[id];
  const selectedFormats = get('production.formats') || [];
  return {
    id, plugin: `${id}@${brand.pluginVersion}`, brand: brand.name, entity: brand.entity, market: brand.market,
    voice: brand.tone, palette: brand.palette, logo: brand.logo ? { path: brand.logo, rule: 'Use exactly one approved logo per artwork.' } : { path: null, rule: 'Supply the official Semtech logo before production.' },
    cta: get('proposition.cta') || brand.cta, destination: get('proposition.landingUrl') || brand.url,
    independentArtwork: Boolean(get('branches.independent')), formats: selectedFormats,
    reviewOwner: get('branches.handoff') || 'Assign brand approver',
    legal: { claimStatus: get('proposition.claimsStatus'), rights: get('governance.rights') || 'Required before activation' }
  };
}
function higgsfieldJobs(branches) {
  const formats = get('production.formats') || [];
  const jobs = [];
  branches.forEach((branch) => {
    if (formats.includes('Landing page') || formats.includes('Motion study')) jobs.push({
      id: `${branch.id}-hero-master`, provider: 'Higgsfield', jobType: 'gpt_image_2', mode: get('branches.higgsfield'), branch: branch.id, model: 'GPT Image 2 / approved campaign model',
      prompt: `${get('production.creative') || 'Human operating moment at the edge of dependable connectivity.'} Subject: ${get('meta.product') || 'the campaign product'}. Tone: ${branch.voice}.`,
      negativePrompt: 'No logos, no typography, no invented product claims, no customer testimonial, no UI text.',
      postProcess: 'Apply the approved branch logo and copy in the deterministic channel renderer.', humanGate: 'Creative approval and rights review before publication.'
    });
    if (formats.includes('LinkedIn organic') || formats.includes('LinkedIn document')) jobs.push({
      id: `${branch.id}-social-master`, provider: 'Higgsfield', jobType: 'gpt_image_2', mode: get('branches.higgsfield'), branch: branch.id, model: 'GPT Image 2 / approved campaign model',
      prompt: `A clear, human-centred visual for ${get('audience.primary') || 'the campaign audience'} showing ${get('audience.problem') || 'the operational problem'}. ${get('production.imagery') || ''}`,
      negativePrompt: 'No logo lockups, no words in the image, no performance guarantee, no generic stock-tech collage.',
      postProcess: 'Add one branch identity only; generate accessible alt text and platform copy separately.', humanGate: 'Brand and technical claim review.'
    });
    if (formats.includes('Email nurture')) jobs.push({
      id: `${branch.id}-email-visual`, provider: 'Higgsfield', jobType: 'gpt_image_2', mode: get('branches.higgsfield'), branch: branch.id, model: 'GPT Image 2 / approved campaign model',
      prompt: `A restrained supporting image for an email about ${get('proposition.promise') || 'the campaign promise'}, legible at 600px wide, with clear negative space for deterministic copy.` ,
      negativePrompt: 'No logos, no embedded type, no unverified feature claims.', postProcess: 'Compose in email-safe HTML, with alt text and one approved logo.', humanGate: 'Email and brand review.'
    });
  });
  return jobs;
}
function compilePack() {
  const branches = (get('branches.selected') || []).map(brandBranch);
  const packSlug = slugify(get('meta.campaignSlug') || get('meta.campaignName')) || 'untitled-campaign';
  const warnings = [];
  if (!get('proposition.proof')) warnings.push('Proof is empty; claims should not enter production until evidence is attached.');
  if (!get('governance.sources')) warnings.push('No source-of-truth references supplied.');
  if (branches.length > 1 && !get('branches.independent')) warnings.push('Multiple brands selected without independent artwork enabled.');
  if (get('governance.activation') === 'Approved for activation') warnings.push('Activation approval is a human gate; this browser export does not publish or spend.');
  return {
    schema: 'm2m-campaign-pack/v1', packId: packSlug, generatedAt: new Date().toISOString(), status: get('governance.activation'),
    readiness: { score: score(), missing: missing(), warnings }, brief: state,
    brandBranches: branches, outputs: {
      landingPage: (get('production.formats') || []).includes('Landing page') ? { route: get('proposition.landingUrl') || 'TBD', sections: ['Hero', 'Problem', 'Proof', 'Use cases', 'Readiness offer', 'Form', 'Legal'] } : null,
      social: (get('production.formats') || []).filter((format) => format.startsWith('LinkedIn') || ['Paid search', 'Retargeting'].includes(format)).map((format) => ({ format, branches: branches.map((branch) => branch.id), copySource: 'brief.proposition + brief.strategy', artworkRule: 'one logo per branch' })),
      email: (get('production.formats') || []).includes('Email nurture') ? { sequence: 'Build from strategy phases', owner: get('meta.owner') || 'Assign owner', branchCount: branches.length } : null,
      salesEnablement: (get('production.formats') || []).includes('Sales enablement') ? { talkTrack: true, qualification: get('objectives.primaryKpi') || 'Define qualification measure' } : null
    },
    higgsfieldJobs: higgsfieldJobs(branches), assistance: { propositionDirections: get('proposition.suggestions') || [], strategyRecommendations: get('strategy.recommendations') || [], method: 'Deterministic suggestions from current brief inputs; reviewable hypotheses, not external research.' }, provenance: { source: 'Interactive brief compiler', fixture: get('meta.campaignSlug') === 'coverage-beyond-the-grid' ? '9604 reverse-engineering fixture' : null, generatedMasters: 'None; job specifications only', logoApplication: 'Deterministic post-processing per brand branch' },
    gates: { required: get('governance.gates') || [], activation: 'Separate human approval required before publication, spend, send or external communication.' }
  };
}

function updateOutput() {
  const pack = compilePack(); const value = pack.readiness.score; const title = get('meta.campaignName') || 'Untitled campaign';
  $('#scoreValue').textContent = `${value}%`; $('#scoreRing').style.setProperty('--score', `${value}%`); $('#outputTitle').textContent = title; $('#outputSubtitle').textContent = value >= 75 ? 'Enough signal for a reviewable handoff.' : 'Complete the decision fields to compile the handoff.';
  const pill = $('#readinessPill'); pill.textContent = value >= 75 ? 'Reviewable draft' : 'Draft'; pill.classList.toggle('ready', value >= 75);
  const branches = pack.brandBranches;
  previewMount.innerHTML = `<div class="preview-group"><h3>Decision</h3><p>${esc(get('proposition.promise') || 'Add the promise on the Proposition stage.')}</p></div><div class="preview-group"><h3>Audience</h3><p>${esc(get('audience.primary') || 'Add a primary audience.')}</p></div><div class="preview-group"><h3>Route</h3><p>${esc(get('strategy.route') || 'Add the conversion route.')}</p></div><div class="preview-group"><h3>Outputs</h3><div class="preview-list">${(get('production.formats') || []).length ? get('production.formats').map((item) => `<span class="preview-line">${esc(item)}</span>`).join('') : '<div class="empty-note">Select the formats the pack should specify.</div>'}</div></div><div class="preview-group"><h3>Independent branches · ${branches.length}</h3><div class="preview-list">${branches.length ? branches.map((branch) => `<div class="preview-branch"><span class="branch-logo">${branch.logo.path ? `<img src="${branch.logo.path}" alt="">` : esc(branch.brand)}</span><span>${esc(branch.brand)}<small style="display:block;color:var(--muted);font-weight:500;margin-top:2px">one logo per artwork</small></span></div>`).join('') : '<div class="empty-note">Select at least one brand plugin.</div>'}</div></div><div class="preview-group"><h3>Open items · ${pack.readiness.missing.length + pack.readiness.warnings.length}</h3><div class="preview-list">${[...pack.readiness.missing.map((item) => `<span class="preview-line">Complete ${esc(item.split('.').pop())}</span>`), ...pack.readiness.warnings.map((item) => `<span class="preview-line">${esc(item)}</span>`)].slice(0, 5).join('') || '<span class="preview-line" style="color:var(--green)">No blocking gaps detected.</span>'}</div></div>`;
}

function render() {
  formMount.innerHTML = renderStage(currentStage); renderNav(); attachFormEvents(); updateOutput();
  $('#mobileProgressLabel').textContent = `${String(currentStage + 1).padStart(2, '0')} / ${String(STAGES.length).padStart(2, '0')}`; $('#mobileProgressBar').style.width = `${((currentStage + 1) / STAGES.length) * 100}%`;
  $('#backBtn').disabled = currentStage === 0; $('#backBtn').style.opacity = currentStage === 0 ? '.45' : '1'; $('#nextBtn').innerHTML = currentStage === STAGES.length - 1 ? 'Review pack <span aria-hidden="true">↗</span>' : 'Next <span aria-hidden="true">→</span>';
}

function markdown(pack) {
  const b = pack.brief; const lines = [`# ${b.meta.campaignName || 'Untitled campaign'}`, '', `> Compiled ${new Date(pack.generatedAt).toLocaleString()} · ${pack.packId}`, '', '## Campaign decision', b.proposition.promise || 'Not supplied', '', '## Foundation', `- Product: ${b.meta.product || 'TBD'}`, `- Market: ${b.meta.market || 'TBD'}`, `- Owner: ${b.meta.owner || 'TBD'}`, `- Run: ${b.meta.startDate || 'TBD'} to ${b.meta.endDate || 'TBD'}`, '', '## Audience', `- Primary: ${b.audience.primary || 'TBD'}`, `- Problem: ${b.audience.problem || 'TBD'}`, `- Trigger: ${b.audience.trigger || 'TBD'}`, `- Roles: ${(b.audience.roles || []).join(', ') || 'TBD'}`, `- Verticals: ${(b.audience.verticals || []).join(', ') || 'TBD'}`, '', '## Objectives', `- Commercial: ${b.objectives.commercial || 'TBD'}`, `- Marketing: ${b.objectives.marketing || 'TBD'}`, `- Communications: ${b.objectives.communications || 'TBD'}`, `- Primary KPI: ${b.objectives.primaryKpi || 'TBD'}`, `- All KPIs: ${(b.objectives.kpis || []).join(', ') || 'TBD'}`, `- Non-goals: ${b.objectives.nonGoals || 'TBD'}`, '', '## Strategy and production', `- Route: ${b.strategy.route || 'TBD'}`, `- Phases: ${b.strategy.phases || 'TBD'}`, `- Channels: ${(b.strategy.channels || []).join(', ') || 'TBD'}`, `- Formats: ${(b.production.formats || []).join(', ') || 'TBD'}`, `- Creative: ${b.production.creative || 'TBD'}`, '', '## Independent brand branches', ...pack.brandBranches.map((branch) => `- **${branch.brand}** (${branch.market}) · ${branch.cta} · ${branch.destination} · one approved logo per artwork`), '', '## Evidence and gates', `- Sources: ${b.governance.sources || 'TBD'}`, `- Rights: ${b.governance.rights || 'TBD'}`, `- Assumptions: ${b.governance.assumptions || 'TBD'}`, `- Required gates: ${(b.governance.gates || []).join('; ') || 'TBD'}`, `- Release state: ${b.governance.activation || 'TBD'}`, '', '## Higgsfield handoff', 'The pack contains safe job specifications only. Generate text-free masters, then apply approved copy and one branch logo in deterministic post-processing. Provider credentials and activation remain server-side and human-gated.', '', '## Readiness', `- Score: ${pack.readiness.score}%`, `- Missing: ${pack.readiness.missing.join(', ') || 'None'}`, `- Warnings: ${pack.readiness.warnings.join(' | ') || 'None'}`]; return lines.join('\n');
}
function csv(pack) { const rows = [['branch_id', 'brand', 'market', 'format', 'cta', 'destination', 'logo_rule']]; pack.brandBranches.forEach((branch) => (branch.formats || []).forEach((format) => rows.push([branch.id, branch.brand, branch.market, format, branch.cta, branch.destination, 'one approved logo per artwork']))); return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); }
function reviewHtml(pack) {
  const b = pack.brief; const branchRows = pack.brandBranches.map((branch) => `<tr><td>${esc(branch.brand)}</td><td>${esc(branch.market)}</td><td>${esc(branch.cta)}</td><td>${esc(branch.destination)}</td><td>One approved logo per artwork</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(b.meta.campaignName || 'Campaign pack')} · Review</title><style>body{font:15px/1.6 system-ui,sans-serif;color:#102f36;background:#f7f4ee;margin:0;padding:42px}main{max-width:980px;margin:auto;background:#fff;padding:42px;box-shadow:0 12px 40px #073b431a}h1{font-size:42px;line-height:1.05;margin:8px 0 14px;color:#073b43}h2{font-size:17px;border-top:1px solid #ccd9d5;padding-top:22px;margin-top:30px;color:#073b43}p{max-width:75ch}small,.meta{color:#5b6d70}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #ccd9d5;padding:9px;text-align:left;vertical-align:top}th{color:#5b6d70;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.score{display:inline-block;background:#edf7f5;border:1px solid #a6d6bf;padding:5px 9px;border-radius:4px;font:600 12px ui-monospace,monospace}.warn{background:#fff7ef;border-left:3px solid #f26b38;padding:12px 14px;font-size:12px}</style></head><body><main><small class="meta">M2M CAMPAIGN PACK · ${esc(pack.packId)} · ${esc(pack.status || 'Draft')}</small><h1>${esc(b.meta.campaignName || 'Untitled campaign')}</h1><p><strong>${esc(b.proposition.promise || 'Promise not supplied')}</strong></p><p class="score">Readiness ${pack.readiness.score}%</p><h2>Audience and route</h2><p>${esc(b.audience.primary || 'Primary audience not supplied')}</p><p>${esc(b.strategy.route || 'Conversion route not supplied')}</p><h2>Production scope</h2><p>${esc((b.production.formats || []).join(' · ') || 'No output formats selected')}</p><h2>Independent brand branches</h2><table><thead><tr><th>Brand</th><th>Market</th><th>CTA</th><th>Destination</th><th>Artwork rule</th></tr></thead><tbody>${branchRows || '<tr><td colspan="5">No branches selected</td></tr>'}</tbody></table><h2>Evidence and gates</h2><p>${esc(b.governance.sources || 'Sources not supplied')}</p><div class="warn">${esc(pack.gates.activation)}</div><h2>Higgsfield handoff</h2><p>${pack.higgsfieldJobs.length} safe job specifications are included. Generate text-free masters, then apply approved copy and one branch logo in deterministic post-processing. Provider credentials and activation remain server-side and human-gated.</p></main></body></html>`;
}
function download(name, content, type) { const blob = new Blob([content], { type }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
function exportPack() { const pack = compilePack(); const base = pack.packId; download(`${base}-campaign-pack.json`, JSON.stringify(pack, null, 2), 'application/json'); download(`${base}-campaign-brief.md`, markdown(pack), 'text/markdown'); download(`${base}-campaign-review.html`, reviewHtml(pack), 'text/html'); download(`${base}-brand-branches.csv`, csv(pack), 'text/csv'); download(`${base}-higgsfield-jobs.json`, JSON.stringify(pack.higgsfieldJobs, null, 2), 'application/json'); showToast('Campaign pack exported as JSON, review HTML, Markdown, CSV and Higgsfield jobs'); }

$('#nextBtn').addEventListener('click', () => { if (currentStage < STAGES.length - 1) { currentStage += 1; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { exportPack(); } });
$('#backBtn').addEventListener('click', () => { if (currentStage > 0) { currentStage -= 1; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
$('#fixtureBtn').addEventListener('click', () => { state = normalizeState(merge(blankState(), fixture)); currentStage = 0; save(); render(); showToast('9604 campaign fixture loaded'); });
$('#resetBtn').addEventListener('click', () => { if (!confirm('Reset this local brief?')) return; state = blankState(); currentStage = 0; localStorage.removeItem(STORAGE_KEY); render(); showToast('Draft reset'); });
$('#exportBtn').addEventListener('click', exportPack);
$('#exportTopBtn').addEventListener('click', exportPack);
$('#copyBtn').addEventListener('click', async () => { try { await navigator.clipboard.writeText(JSON.stringify(compilePack(), null, 2)); showToast('Compiled brief JSON copied'); } catch { showToast('Copy unavailable; use Export pack'); } });

render();
