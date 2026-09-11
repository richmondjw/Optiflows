import { BRANDS } from './plugins.js';
import { LIBRARIES, LIBRARY_META } from './libraries.js';
import { buildCampaignPack } from './pack-builder.js?v=20260911-production';
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

const blankConsultantRun = () => ({
  inputs: { commercialGoal: '', offer: '', decisionMaker: '', trigger: '', market: '', proofConstraints: '' },
  research: { mode: 'Quick scan', questions: [], evidence: [], sources: [], status: 'Not prepared', preparedAt: null },
  concepts: [], generation: 0, preferenceEvents: [], pendingRewriteRound: null, selectedConcept: null, handoffStatus: 'Not started', brief: null, brandBranches: [], pack: null
});

const blankState = () => ({
  meta: { campaignName: '', campaignSlug: '', product: '', market: 'Australia', campaignType: 'Demand generation', owner: '', startDate: '', endDate: '' },
  audience: { primary: '', primarySegments: [], primaryOther: '', primaryDetail: '', roles: [], rolesSelected: [], rolesOther: '', verticals: [], verticalsSelected: [], verticalsOther: '', geographies: '', trigger: '', problem: '', objections: '' },
  objectives: { commercial: '', commercialTypes: [], commercialOther: '', marketing: '', marketingTypes: [], marketingOther: '', communications: '', communicationsTypes: [], communicationsOther: '', kpis: [], primaryKpi: '', secondaryKpis: [], nonGoals: '' },
  proposition: { promise: '', supporting: '', proof: '', claimsStatus: 'Needs evidence review', cta: '', landingUrl: '', suggestions: [] },
  strategy: { route: '', phases: '', channels: [], tactics: '', nurture: '', recommendations: [] },
  production: { formats: ['LinkedIn organic'], creative: '', imagery: '', motion: '', assetNotes: '' },
  governance: { sources: '', rights: '', assumptions: '', gates: [], activation: 'Private review' },
  branches: { selected: ['m2m-connectivity', 'm2m-one-au'], independent: true, higgsfield: 'Job specifications only', handoff: '' },
  consultantRun: blankConsultantRun()
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
let currentView = 'consultant';

const $ = (selector) => document.querySelector(selector);
const formMount = $('#formMount');
const previewMount = $('#previewMount');
const consultantMount = $('#consultantView');
const compilerView = $('#compilerView');

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
  const consultantDefaults = blankConsultantRun();
  const consultant = nextState.consultantRun || (nextState.consultantRun = consultantDefaults);
  consultant.inputs = { ...consultantDefaults.inputs, ...(consultant.inputs || {}) };
  consultant.research = { ...consultantDefaults.research, ...(consultant.research || {}) };
  consultant.research.questions = Array.isArray(consultant.research.questions) ? consultant.research.questions : [];
  consultant.research.evidence = Array.isArray(consultant.research.evidence) ? consultant.research.evidence : [];
  consultant.research.sources = Array.isArray(consultant.research.sources) ? consultant.research.sources : [];
  consultant.concepts = Array.isArray(consultant.concepts) ? consultant.concepts : [];
  consultant.generation = Number.isFinite(Number(consultant.generation)) ? Number(consultant.generation) : 0;
  consultant.preferenceEvents = Array.isArray(consultant.preferenceEvents) ? consultant.preferenceEvents : [];
  consultant.pendingRewriteRound = consultant.pendingRewriteRound || null;
  consultant.selectedConcept = consultant.selectedConcept || null;
  consultant.handoffStatus = consultant.handoffStatus || 'Not started';
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

const CONSULTANT_QUESTIONS = [
  ['commercialGoal', 'What are you trying to achieve commercially?', 'Pipeline, revenue, adoption, retention, partner movement or another business result.'],
  ['offer', 'What are you trying to sell, promote or change?', 'A product, service, launch, behaviour, offer or customer decision.'],
  ['decisionMaker', 'Who needs to act or decide?', 'Name the people, roles or organisations who can move the decision forward.'],
  ['trigger', 'What problem or trigger makes this relevant now?', 'The moment, friction, risk or opportunity that gives the campaign urgency.'],
  ['market', 'Where or in which market does it matter?', 'Country, region, vertical, route, account group or operating environment.'],
  ['proofConstraints', 'What proof, constraints or known assets already exist?', 'Sources, product facts, customer evidence, rights, timing, budget or things that must be avoided.']
];

function consultantInput(path) { return get(`consultantRun.inputs.${path}`) || ''; }
function consultantAnswer(value, fallback) { const text = String(value || '').trim(); return text && !/^i\s*don'?t\s*know$/i.test(text) ? text : fallback; }
function consultantQuestion(path, label, hint) {
  const value = consultantInput(path);
  return `<div class="consultant-question"><label for="consultant-${path}">${esc(label)}<span>${esc(hint)}</span></label><textarea id="consultant-${path}" data-consultant-bind="consultantRun.inputs.${path}" placeholder="${esc(hint)}">${esc(value)}</textarea><button type="button" class="unknown-button" data-consultant-unknown="${esc(path)}">I don't know</button></div>`;
}

function buildResearchPlan() {
  const mode = get('consultantRun.research.mode') || 'Quick scan';
  const inputs = get('consultantRun.inputs') || {};
  const questions = [
    `What evidence supports the commercial goal: ${consultantAnswer(inputs.commercialGoal, 'the stated business outcome')}?`,
    `Which approved terminology and brand rules apply to ${consultantAnswer(inputs.offer, 'the offer')} in ${consultantAnswer(inputs.market, 'the selected market')}?`,
    `What proof can substantiate the audience problem: ${consultantAnswer(inputs.trigger, 'the stated trigger')}?`,
    'Which claims, rights, destinations or owners need approval before activation?'
  ];
  const baseEvidence = [
    { id: 'brand-brief', status: 'Confirmed', title: 'M2M Group brand brief', source: LIBRARY_META.source, date: LIBRARY_META.reviewed, detail: 'Audience, voice and brand-branch rules are available as an attributable internal reference.' },
    { id: 'engagement-brief', status: 'Confirmed', title: 'M2M engagement and governance brief', source: 'JWR-TheOne · 07-projects/m2m-group/brief/ENGAGEMENT.md', date: LIBRARY_META.reviewed, detail: 'Business-unit values, approval boundaries and handoff expectations are available for review.' },
    { id: 'existing-campaign', status: 'Strongly supported', title: 'Existing campaign reference', source: 'https://optiflows.com.au/campaigns/9604-hybrid-connectivity/', date: '2026-09-11', detail: 'Use the existing pack as a reference for route, production objects and evidence treatment.' },
    { id: 'campaign-fit', status: inputs.offer && inputs.trigger ? 'Inferred' : 'Unknown', title: 'Campaign-specific evidence', source: 'Supplied in this consultant run', date: new Date().toISOString().slice(0, 10), detail: inputs.offer && inputs.trigger ? 'The current concept is inferred from the offer and trigger supplied above; verify before treating it as a claim.' : 'Supply an offer and trigger, or keep this item explicitly unknown.' },
    { id: 'approval', status: 'Requires approval', title: 'Activation and claim approvals', source: 'Human gate', date: null, detail: 'Technical claims, rights, destination, budget, spend, send and external generation remain approval gates.' }
  ];
  let evidence = mode === 'No research' ? [{ id: 'no-research', status: 'Unknown', title: 'Research skipped', source: 'User selection', date: null, detail: 'Concepts use supplied information only. No source claims have been checked.' }] : baseEvidence;
  if (mode === 'Evidence pack') evidence = [...evidence, { id: 'claims-register', status: 'Requires approval', title: 'Claims register starter', source: 'Prepared from campaign inputs', date: new Date().toISOString().slice(0, 10), detail: 'Record each claim, source, confidence, expiry and approver before publication.' }];
  set('consultantRun.research', { mode, questions, evidence, sources: evidence.map((item) => ({ title: item.title, source: item.source, date: item.date, status: item.status })), status: mode === 'No research' ? 'Prepared without research' : 'Prepared research plan; source review remains human-controlled', preparedAt: new Date().toISOString() });
}

function conceptTemplates(inputs, generation = 1) {
  const offer = consultantAnswer(inputs.offer, 'the offer');
  const audience = consultantAnswer(inputs.decisionMaker, 'the people who need to decide');
  const trigger = consultantAnswer(inputs.trigger, 'the moment the problem becomes urgent');
  const market = consultantAnswer(inputs.market, 'the selected market');
  const problem = trigger;
  const is9604 = /9604|hybrid|iridium|satellite/i.test(`${inputs.offer || ''} ${inputs.trigger || ''} ${inputs.proofConstraints || ''}`);
  const variant = Math.max(0, generation - 1) % 3;
  const boundaryIdeas = is9604 ? ['Where does your device lose coverage?', 'Where does the operating map stop?', 'Make the coverage boundary a design input.'] : ['Where does the journey break?', 'Where does the operating journey stop?', 'Make the friction boundary visible.'];
  const consequenceIdeas = is9604 ? ['What does one missed transmission cost?', 'How long can silence last?', 'Which signal earns a different path?'] : ['What does one missed signal cost?', 'How long can the gap remain invisible?', 'Which moment deserves a different response?'];
  const engineeringIdeas = is9604 ? ['One module. Both layers. Your logic.', 'Design the path before the edge case.', 'The exception path belongs in the architecture.'] : ['One design. Evidence you can use.', 'Build the proof into the decision.', 'Make the next technical step defensible.'];
  const boundaryMessages = is9604 ? ['Coverage is a design question. Map where the preferred path stops, then plan what happens next.', 'Coverage is an operating input. Locate the boundary, then design the response around it.', 'Treat the coverage boundary as a first-class design input before selecting the response.'] : [`Make ${problem} visible before asking the market to act.`, `Name the point where ${problem} becomes a decision, then make the next step clear.`, `Turn ${problem} into a visible design question before asking for action.`];
  const consequenceMessages = ['When a message matters, the cost of silence should be visible before the system is designed.', 'When silence has a cost, message priority should shape the design before implementation.', 'The right response starts by deciding which moments are too valuable to leave to chance.'];
  const engineeringMessages = is9604 ? ['One module can expose both connectivity layers; your logic defines routing, retry and priority.', 'The module makes both layers available; the product still defines routing, retry and priority.', 'A compact module can simplify the hardware footprint while leaving the important logic with your design team.'] : [`${offer} gives the team a basis for a defensible design; the application logic and constraints still need review.`, `${offer} can support a more defensible decision when the interfaces and constraints are explicit.`, `Use ${offer} as a starting point for a proof-led design review, with the application constraints still visible.`];
  const sharedChannels = ['LinkedIn organic', 'Landing page', 'Email nurture', 'Sales follow-up'];
  return [
    {
      id: 'coverage-boundary', title: 'Coverage boundary', idea: boundaryIdeas[variant], audience, problem: `Make the boundary visible: ${problem}.`, message: boundaryMessages[variant], supporting: `Give ${audience} a simple way to see where ${offer} fits and what needs to be assessed in ${market}.`, why: 'This direction turns an abstract market problem into a recognisable moment that can earn attention quickly.', proofRequirements: ['A sourced description of the boundary or trigger', 'A clear definition of what the offer can and cannot do', 'A useful assessment or checklist'], risks: ['The hook becomes generic if the boundary is not concrete', 'The audience may not recognise the moment without a real example'], cta: 'Map the next decision', route: 'Boundary signal → diagnostic guide → scoped assessment → qualified conversation', channels: sharedChannels, formats: ['LinkedIn organic', 'LinkedIn document', 'Landing page', 'Email nurture'], visual: 'A human or asset approaching a visible operating boundary; no embedded copy or invented customer proof.'
    },
    {
      id: 'operational-consequence', title: 'Operational consequence', idea: consequenceIdeas[variant], audience, problem: `Connect the trigger to the consequence: ${problem}.`, message: consequenceMessages[variant], supporting: `Show the operational decision behind ${offer}: what must travel, when it must travel and what a responsible fallback requires.`, why: 'This direction makes the commercial value tangible by linking the problem to time, risk, cost or continuity.', proofRequirements: ['A quantified or bounded consequence', 'A credible use case or customer-safe scenario', 'Evidence that supports the proposed response'], risks: ['Unverified numbers can over-promise', 'The campaign needs a concrete consequence, not a fear statement'], cta: 'Assess the cost of a missed message', route: 'Operational consequence → proof-led scenario → readiness offer → qualified conversation', channels: sharedChannels, formats: ['LinkedIn organic', 'LinkedIn document', 'Landing page', 'Email nurture', 'Sales enablement'], visual: 'A field decision interrupted at the moment it matters; show consequence through context, not alarmist overlays.'
    },
    {
      id: 'engineering-proof', title: 'Engineering proof', idea: engineeringIdeas[variant], audience, problem: `Answer the engineering question inside ${problem}.`, message: engineeringMessages[variant], supporting: `Lead with the mechanism, the interfaces and the decisions that remain with the product team.`, why: 'This direction earns trust with technically literate buyers who need proof and boundaries before a sales conversation.', proofRequirements: ['Official product or service facts', 'Interface, architecture or integration evidence', 'A qualified statement of what remains developer- or customer-defined'], risks: ['A technical hook can lose non-engineering decision-makers', 'The mechanism must be explained without implying automatic outcomes'], cta: 'Review the design questions', route: 'Engineering question → technical proof → architecture checklist → design conversation', channels: sharedChannels, formats: ['LinkedIn document', 'Landing page', 'Email nurture', 'Sales enablement'], visual: 'A restrained technical field scene with room for deterministic copy and a later single-brand composition.'
    }
  ];
}

function generateConcepts() {
  const inputs = get('consultantRun.inputs') || {};
  if (!get('consultantRun.research.questions')?.length) buildResearchPlan();
  const generation = Number(get('consultantRun.generation') || 0) + 1;
  set('consultantRun.generation', generation);
  set('consultantRun.concepts', conceptTemplates(inputs, generation));
  set('consultantRun.preferenceEvents', []);
  set('consultantRun.pendingRewriteRound', null);
  set('consultantRun.selectedConcept', null);
  set('consultantRun.handoffStatus', 'Concepts generated; comparison not complete');
  showToast('Three distinct campaign directions generated');
}

function comparisonRounds() {
  const concepts = get('consultantRun.concepts') || [];
  if (concepts.length < 3) return [];
  const [a, b, c] = concepts;
  return [
    { id: 'commercial-fit', prompt: 'Which concept better matches the commercial goal?', left: { label: a.title, text: a.idea, conceptId: a.id }, right: { label: b.title, text: b.idea, conceptId: b.id } },
    { id: 'message-believability', prompt: 'Which message feels more believable?', left: { label: a.title, text: a.message, conceptId: a.id }, right: { label: c.title, text: c.message, conceptId: c.id } },
    { id: 'audience-sharpness', prompt: 'Which audience problem is sharper?', left: { label: b.title, text: b.problem, conceptId: b.id }, right: { label: c.title, text: c.problem, conceptId: c.id } },
    { id: 'cta-natural', prompt: 'Which CTA feels more natural?', left: { label: a.title, text: `${a.cta} · ${a.route}`, conceptId: a.id }, right: { label: b.title, text: `${b.cta} · ${b.route}`, conceptId: b.id } },
    { id: 'visual-direction', prompt: 'Which visual direction is stronger?', left: { label: b.title, text: b.visual, conceptId: b.id }, right: { label: c.title, text: c.visual, conceptId: c.id } }
  ];
}

function preferenceFor(roundId) { return (get('consultantRun.preferenceEvents') || []).find((event) => event.roundId === roundId); }
function rankedConcepts() {
  const concepts = get('consultantRun.concepts') || [];
  const scores = Object.fromEntries(concepts.map((concept, index) => [concept.id, { concept, score: 0, index }]));
  (get('consultantRun.preferenceEvents') || []).forEach((event) => (event.conceptIds || []).forEach((id) => { if (scores[id]) scores[id].score += event.choice === 'combine' ? 1 : event.choice === 'none' || event.choice === 'rewrite' ? 0 : 2; }));
  return Object.values(scores).sort((a, b) => b.score - a.score || a.index - b.index);
}

function recordPreference(roundId, choice) {
  const round = comparisonRounds().find((item) => item.id === roundId); if (!round) return;
  const ids = choice === 'A' ? [round.left.conceptId] : choice === 'B' ? [round.right.conceptId] : choice === 'combine' ? [round.left.conceptId, round.right.conceptId] : [];
  const events = (get('consultantRun.preferenceEvents') || []).filter((event) => event.roundId !== roundId);
  events.push({ roundId, prompt: round.prompt, choice, conceptIds: ids, options: [round.left, round.right], timestamp: new Date().toISOString() });
  set('consultantRun.preferenceEvents', events); set('consultantRun.pendingRewriteRound', choice === 'rewrite' ? roundId : null); set('consultantRun.handoffStatus', `Comparison ${events.length} of ${comparisonRounds().length} recorded`); save(); renderConsultant();
}

function saveRewrite(roundId) {
  const field = consultantMount.querySelector(`[data-consultant-rewrite="${roundId}"]`); const rewrite = field?.value?.trim(); if (!rewrite) return;
  const events = (get('consultantRun.preferenceEvents') || []).map((event) => event.roundId === roundId ? { ...event, rewrite } : event);
  set('consultantRun.preferenceEvents', events); set('consultantRun.pendingRewriteRound', null); set('consultantRun.handoffStatus', `Comparison ${events.length} of ${comparisonRounds().length} recorded`); save(); renderConsultant(); showToast('Rewrite recorded as a preference');
}

function chooseConcept(id) { if (!(get('consultantRun.concepts') || []).some((concept) => concept.id === id)) return; set('consultantRun.selectedConcept', id); set('consultantRun.handoffStatus', 'Concept selected; ready for compiler handoff'); save(); renderConsultant(); }

function briefSnapshot() {
  return { meta: { ...state.meta }, audience: { ...state.audience }, objectives: { ...state.objectives }, proposition: { ...state.proposition, suggestions: [] }, strategy: { ...state.strategy, recommendations: [] }, production: { ...state.production }, governance: { ...state.governance }, branches: { ...state.branches } };
}

function handoffConsultant() {
  const ranked = rankedConcepts(); const chosenId = get('consultantRun.selectedConcept') || ranked[0]?.concept.id; const concept = (get('consultantRun.concepts') || []).find((item) => item.id === chosenId);
  if (!concept) { showToast('Generate concepts before opening the compiler'); return; }
  const inputs = get('consultantRun.inputs') || {};
  set('meta.campaignName', concept.title); if (!get('meta.product') || get('meta.product') === 'I don\'t know') set('meta.product', consultantAnswer(inputs.offer, 'Define the offer')); if (!get('meta.owner')) set('meta.owner', 'Assign campaign owner');
  set('meta.market', ['Australia', 'New Zealand', 'Australia + New Zealand', 'Global'].includes(inputs.market) ? inputs.market : get('meta.market') || 'Australia');
  set('audience.primaryDetail', consultantAnswer(inputs.decisionMaker, 'Define the primary audience')); set('audience.primaryOther', ''); set('audience.primarySegments', []); set('audience.primary', get('audience.primaryDetail')); set('audience.trigger', consultantAnswer(inputs.trigger, 'Define the campaign trigger')); set('audience.problem', concept.problem); set('audience.objections', concept.risks.join('; '));
  set('objectives.commercial', consultantAnswer(inputs.commercialGoal, 'Define the commercial goal')); set('objectives.marketing', `Create a qualified audience around ${concept.title.toLowerCase()} and move engaged people to the next step.`); set('objectives.communications', concept.message); set('objectives.commercialTypes', []); set('objectives.marketingTypes', []); set('objectives.communicationsTypes', []);
  set('objectives.kpis', []); set('objectives.primaryKpi', ''); set('objectives.secondaryKpis', []);
  set('proposition.promise', concept.message); set('proposition.supporting', concept.supporting); set('proposition.proof', concept.proofRequirements.join('; ')); set('proposition.cta', concept.cta); set('proposition.landingUrl', ''); set('strategy.route', concept.route); set('strategy.phases', 'Recognise the problem → prove the decision → invite the qualified next step'); set('strategy.channels', concept.channels); set('strategy.tactics', `Build the ${concept.title.toLowerCase()} direction across ${concept.formats.join(', ')}.`); set('strategy.nurture', 'Define scoring, response owner and handoff SLA.'); set('production.formats', concept.formats); set('production.creative', concept.visual); set('production.imagery', 'Use text-free masters and deterministic copy/logo application. Record provenance and rights before activation.'); set('production.assetNotes', 'Independent single-brand artwork; no combined lockups.');
  const research = get('consultantRun.research') || {}; set('governance.sources', research.sources?.map((source) => `${source.title} (${source.source})`).join('; ') || 'Research not prepared'); set('governance.assumptions', [...concept.risks, ...(research.evidence || []).filter((item) => ['Unknown', 'Inferred', 'Requires approval'].includes(item.status)).map((item) => item.detail)].join('; ')); set('governance.gates', ['Technical claims reviewed', 'Brand branch reviewed', 'Landing destination and form owner confirmed', 'Creative rights and provenance recorded', 'Budget and activation owner approved']); set('governance.activation', 'Private review');
  normalizeState(); const run = get('consultantRun'); run.selectedConcept = concept.id; run.handoffStatus = 'Handed into compiler; review unresolved fields'; run.brief = briefSnapshot(); run.brandBranches = (get('branches.selected') || []).map(brandBranch); run.pack = { schema: 'm2m-campaign-pack/v1', status: 'Compiler review required' }; currentView = 'compiler'; currentStage = 0; save(); render(); showToast('Selected campaign spine handed into the compiler');
}

function renderConsultant() {
  if (!consultantMount) return;
  const run = get('consultantRun') || blankConsultantRun(); const concepts = run.concepts || []; const research = run.research || {}; const ranked = rankedConcepts();
  const questionFields = CONSULTANT_QUESTIONS.map(([path, label, hint]) => consultantQuestion(path, label, hint)).join('');
  const researchCards = (research.evidence || []).map((item) => `<article class="evidence-card"><span class="evidence-status evidence-${slugify(item.status)}">${esc(item.status)}</span><h4>${esc(item.title)}</h4><p>${esc(item.detail)}</p><small>${esc(item.source || 'No source supplied')}${item.date ? ` · ${esc(item.date)}` : ''}</small></article>`).join('') || '<div class="empty-note">Choose a research mode, then prepare the research questions before generating concepts.</div>';
  const conceptCards = concepts.map((concept, index) => `<article class="concept-card"><header><span class="concept-number">0${index + 1}</span><div><span class="concept-kicker">${esc(concept.title)}</span><h3>${esc(concept.idea)}</h3></div></header><div class="concept-grid"><div><strong>For</strong><p>${esc(concept.audience)}</p></div><div><strong>Problem</strong><p>${esc(concept.problem)}</p></div><div><strong>Message</strong><p>${esc(concept.message)}</p></div><div><strong>Why it might work</strong><p>${esc(concept.why)}</p></div><div><strong>Proof required</strong><p>${esc(concept.proofRequirements.join('; '))}</p></div><div><strong>Risk</strong><p>${esc(concept.risks.join('; '))}</p></div><div><strong>CTA and route</strong><p>${esc(concept.cta)} · ${esc(concept.route)}</p></div><div><strong>Visual direction</strong><p>${esc(concept.visual)}</p></div></div><footer><span class="concept-meta">${esc((concept.channels || []).join(' · '))}</span><button type="button" class="button button-secondary button-small" data-consultant-action="choose-concept" data-concept="${esc(concept.id)}">${run.selectedConcept === concept.id ? 'Selected' : 'Choose this direction'}</button></footer></article>`).join('');
  consultantMount.innerHTML = `<div class="consultant-shell"><div class="consultant-hero"><span class="kicker">CAMPAIGN CONSULTANT / 01</span><h1>From a rough idea<br>to a campaign spine.</h1><p>Answer six short questions. The consultant proposes a brand-neutral campaign direction, shows what it knows and does not know, then hands your choice into the compiler.</p><div class="consultant-hero-actions"><button type="button" class="button button-primary" data-consultant-action="generate-concepts">Generate campaign directions <span aria-hidden="true">→</span></button><button type="button" class="button button-secondary" data-consultant-action="seed-9604">Start with the 9604 example</button><button type="button" class="button button-quiet" data-consultant-action="open-compiler">Open compiler</button></div><p class="consultant-note"><strong>Human choice stays in the loop.</strong> Suggestions are hypotheses until the evidence, brand branch and release gates are reviewed.</p></div><section class="consultant-panel consultant-intake"><div class="panel-heading"><div><span class="suggestion-kicker">01 · Intake</span><h2>Tell me enough to make a useful first proposal.</h2><p>“I don't know” is a valid answer. The consultant will label any inference and keep it visible.</p></div><span class="run-state">${esc(run.handoffStatus || 'Not started')}</span></div><div class="consultant-question-grid">${questionFields}</div></section><section class="consultant-panel research-panel"><div class="panel-heading"><div><span class="suggestion-kicker">02 · Research control</span><h2>Choose how much checking to do.</h2><p>Research questions are created first so the scan stays tied to the campaign decision.</p></div>${select('consultantRun.research.mode', 'Research mode', ['Quick scan', 'No research', 'Evidence pack'], 'Default: a bounded scan of approved brand and campaign sources.')}</div><div class="research-actions"><button type="button" class="button button-secondary button-small" data-consultant-action="prepare-research">Prepare research questions</button><span class="research-state">${esc(research.status || 'Not prepared')}</span></div><div class="research-question-list">${(research.questions || []).map((question, index) => `<span><b>Q${index + 1}</b> ${esc(question)}</span>`).join('') || '<div class="empty-note">No research questions prepared yet.</div>'}</div><div class="evidence-grid">${researchCards}</div></section><section class="consultant-panel concepts-panel"><div class="panel-heading"><div><span class="suggestion-kicker">03 · Concept directions</span><h2>Compare three distinct campaign spines.</h2><p>Each direction includes the audience problem, message, proof requirements, risks, CTA, route and visual direction.</p></div><button type="button" class="button button-primary button-small" data-consultant-action="generate-concepts">${concepts.length ? 'Regenerate directions' : 'Generate directions'}</button></div><div class="concept-list">${conceptCards || '<div class="empty-note">Complete the intake, then generate three directions. Partial answers are fine.</div>'}</div></section>${concepts.length ? `<section class="consultant-panel compare-panel"><div class="panel-heading"><div><span class="suggestion-kicker">04 · Preference rounds</span><h2>Make five meaningful choices.</h2><p>The consultant records A/B, combine, rewrite or none, then ranks the directions. You can stop at the first useful decision.</p></div><span class="decision-count">${(run.preferenceEvents || []).length} / ${comparisonRounds().length}</span></div>${renderComparisonBody(ranked)}</section>` : ''}</div>`;
  attachConsultantEvents();
}

function renderComparisonBody(ranked) {
  const rounds = comparisonRounds(); const pendingRewrite = get('consultantRun.pendingRewriteRound'); const next = rounds.find((round) => !preferenceFor(round.id) || pendingRewrite === round.id);
  if (!next) return `<div class="ranking-summary"><h3>Current ranking</h3><div class="rank-list">${ranked.map((item, index) => `<div class="rank-row"><span>${index + 1}</span><strong>${esc(item.concept.title)}</strong><small>${item.score} preference points</small><button type="button" class="button button-secondary button-small" data-consultant-action="choose-concept" data-concept="${esc(item.concept.id)}">${get('consultantRun.selectedConcept') === item.concept.id ? 'Selected' : 'Select'}</button></div>`).join('')}</div><div class="handoff-callout"><strong>${get('consultantRun.selectedConcept') ? 'Your selected direction is ready.' : 'The top-ranked direction is ready.'}</strong><span>Open it in the compiler to resolve remaining fields and apply a brand plugin.</span><button type="button" class="button button-primary" data-consultant-action="handoff">Use this direction in the compiler <span aria-hidden="true">↗</span></button></div></div>`;
  const left = next.left; const right = next.right; const rewrite = preferenceFor(next.id)?.choice === 'rewrite';
  return `<div class="round-progress"><span>Decision ${rounds.findIndex((round) => round.id === next.id) + 1} of ${rounds.length}</span><div class="progress-track"><span style="width:${(((get('consultantRun.preferenceEvents') || []).length) / rounds.length) * 100}%"></span></div></div><h3 class="round-prompt">${esc(next.prompt)}</h3><div class="comparison-options"><article class="comparison-option"><span class="option-letter">A</span><span class="concept-kicker">${esc(left.label)}</span><p>${esc(left.text)}</p><button type="button" class="button button-secondary button-small" data-consultant-choice="A" data-round="${esc(next.id)}">Choose A</button></article><article class="comparison-option"><span class="option-letter">B</span><span class="concept-kicker">${esc(right.label)}</span><p>${esc(right.text)}</p><button type="button" class="button button-secondary button-small" data-consultant-choice="B" data-round="${esc(next.id)}">Choose B</button></article></div><div class="comparison-actions"><button type="button" class="text-action" data-consultant-choice="combine" data-round="${esc(next.id)}">Combine</button><button type="button" class="text-action" data-consultant-choice="rewrite" data-round="${esc(next.id)}">Rewrite</button><button type="button" class="text-action" data-consultant-choice="none" data-round="${esc(next.id)}">Neither</button></div>${rewrite ? `<div class="rewrite-box"><label for="rewrite-${esc(next.id)}">What would you change?</label><input id="rewrite-${esc(next.id)}" data-consultant-rewrite="${esc(next.id)}" placeholder="Write the direction you want to test"><button type="button" class="button button-primary button-small" data-consultant-action="save-rewrite" data-round="${esc(next.id)}">Save rewrite</button></div>` : ''}<div class="answered-rounds">${rounds.filter((round) => preferenceFor(round.id)).map((round) => `<span>${esc(round.prompt)} · ${esc(preferenceFor(round.id).choice)}</span>`).join('')}</div>`;
}

function attachConsultantEvents() {
  consultantMount.querySelectorAll('[data-consultant-bind]').forEach((element) => ['input', 'change'].forEach((eventName) => element.addEventListener(eventName, () => { set(element.dataset.consultantBind, element.value); save(); })));
  consultantMount.querySelectorAll('[data-bind]').forEach((element) => ['input', 'change'].forEach((eventName) => element.addEventListener(eventName, () => {
    set(element.dataset.bind, element.value);
    if (eventName === 'change' && element.dataset.bind === 'consultantRun.research.mode') {
      set('consultantRun.research.questions', []); set('consultantRun.research.evidence', []); set('consultantRun.research.sources', []); set('consultantRun.research.status', 'Mode changed; prepare a new research plan');
      save(); renderConsultant();
    } else save();
  })));
  consultantMount.querySelectorAll('[data-consultant-unknown]').forEach((element) => element.addEventListener('click', () => { set(`consultantRun.inputs.${element.dataset.consultantUnknown}`, "I don't know"); save(); renderConsultant(); }));
  consultantMount.querySelectorAll('[data-consultant-action="prepare-research"]').forEach((element) => element.addEventListener('click', () => { buildResearchPlan(); save(); renderConsultant(); showToast('Research questions prepared before source review'); }));
  consultantMount.querySelectorAll('[data-consultant-action="generate-concepts"]').forEach((element) => element.addEventListener('click', () => { generateConcepts(); save(); renderConsultant(); }));
  consultantMount.querySelectorAll('[data-consultant-action="seed-9604"]').forEach((element) => element.addEventListener('click', () => { const source = fixture; set('consultantRun.inputs.commercialGoal', source.objectives.commercial); set('consultantRun.inputs.offer', source.meta.product); set('consultantRun.inputs.decisionMaker', source.audience.primary); set('consultantRun.inputs.trigger', source.audience.trigger); set('consultantRun.inputs.market', source.meta.market); set('consultantRun.inputs.proofConstraints', source.proposition.proof); buildResearchPlan(); save(); renderConsultant(); showToast('9604 example loaded into the consultant'); }));
  consultantMount.querySelectorAll('[data-consultant-action="open-compiler"]').forEach((element) => element.addEventListener('click', () => { currentView = 'compiler'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  consultantMount.querySelectorAll('[data-consultant-action="choose-concept"]').forEach((element) => element.addEventListener('click', () => chooseConcept(element.dataset.concept)));
  consultantMount.querySelectorAll('[data-consultant-action="handoff"]').forEach((element) => element.addEventListener('click', handoffConsultant));
  consultantMount.querySelectorAll('[data-consultant-choice]').forEach((element) => element.addEventListener('click', () => { const choice = element.dataset.consultantChoice; recordPreference(element.dataset.round, choice); }));
  consultantMount.querySelectorAll('[data-consultant-action="save-rewrite"]').forEach((element) => element.addEventListener('click', () => saveRewrite(element.dataset.round)));
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
  const output = {
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
  output.production = buildCampaignPack({ brief: state, branches, consultantRun: get('consultantRun'), higgsfieldJobs: output.higgsfieldJobs });
  output.outputs = {
    ...output.outputs,
    completePack: {
      schema: output.production.schema,
      status: output.production.status,
      summary: output.production.summary,
      files: output.production.files,
      activation: output.production.provenance.activation
    }
  };
  const consultant = get('consultantRun');
  output.consultantRun = (consultant && (consultant.concepts || []).length) ? {
    ...consultant,
    brief: briefSnapshot(),
    brandBranches: branches,
    pack: { schema: output.schema, packId: output.packId, readiness: output.readiness, status: output.status }
  } : null;
  return output;
}

function updateOutput() {
  const pack = compilePack(); const value = pack.readiness.score; const title = get('meta.campaignName') || 'Untitled campaign';
  $('#scoreValue').textContent = `${value}%`; $('#scoreRing').style.setProperty('--score', `${value}%`); $('#outputTitle').textContent = title; $('#outputSubtitle').textContent = value >= 75 ? 'Enough signal for a reviewable handoff.' : 'Complete the decision fields to compile the handoff.';
  const pill = $('#readinessPill'); pill.textContent = value >= 75 ? 'Reviewable draft' : 'Draft'; pill.classList.toggle('ready', value >= 75);
  const branches = pack.brandBranches;
  const production = pack.production;
  previewMount.innerHTML = `<div class="preview-group"><h3>Decision</h3><p>${esc(get('proposition.promise') || 'Add the promise on the Proposition stage.')}</p></div><div class="preview-group"><h3>Audience</h3><p>${esc(get('audience.primary') || 'Add a primary audience.')}</p></div><div class="preview-group"><h3>Route</h3><p>${esc(get('strategy.route') || 'Add the conversion route.')}</p></div><div class="preview-group"><h3>Outputs</h3><div class="preview-list">${(get('production.formats') || []).length ? get('production.formats').map((item) => `<span class="preview-line">${esc(item)}</span>`).join('') : '<div class="empty-note">Select the formats the pack should specify.</div>'}</div></div><div class="preview-group production-summary"><h3>Complete pack · ${production.summary.files} files</h3><div class="production-counts"><span><b>${production.summary.landingPages}</b> landing</span><span><b>${production.summary.socialAssets}</b> social</span><span><b>${production.summary.emailAssets}</b> email</span><span><b>${production.summary.paidAssets}</b> paid</span><span><b>${production.summary.salesTalkTracks}</b> sales</span><span><b>${production.summary.creativeMasters}</b> visual masters</span></div><p class="production-note">Copy, calendar, claims register, lead magnet HTML, native text-free SVG masters and safe Higgsfield job specs are ready for review. External generation and activation remain gated.</p></div><div class="preview-group"><h3>Independent branches · ${branches.length}</h3><div class="preview-list">${branches.length ? branches.map((branch) => `<div class="preview-branch"><span class="branch-logo">${branch.logo.path ? `<img src="${branch.logo.path}" alt="">` : esc(branch.brand)}</span><span>${esc(branch.brand)}<small style="display:block;color:var(--muted);font-weight:500;margin-top:2px">one logo per artwork</small></span></div>`).join('') : '<div class="empty-note">Select at least one brand plugin.</div>'}</div></div><div class="preview-group"><h3>Open items · ${pack.readiness.missing.length + pack.readiness.warnings.length}</h3><div class="preview-list">${[...pack.readiness.missing.map((item) => `<span class="preview-line">Complete ${esc(item.split('.').pop())}</span>`), ...pack.readiness.warnings.map((item) => `<span class="preview-line">${esc(item)}</span>`)].slice(0, 5).join('') || '<span class="preview-line" style="color:var(--green)">No blocking gaps detected.</span>'}</div></div>`;
}

function render() {
  renderConsultant();
  formMount.innerHTML = renderStage(currentStage); renderNav(); attachFormEvents(); updateOutput();
  renderView();
  $('#mobileProgressLabel').textContent = `${String(currentStage + 1).padStart(2, '0')} / ${String(STAGES.length).padStart(2, '0')}`; $('#mobileProgressBar').style.width = `${((currentStage + 1) / STAGES.length) * 100}%`;
  $('#backBtn').disabled = currentStage === 0; $('#backBtn').style.opacity = currentStage === 0 ? '.45' : '1'; $('#nextBtn').innerHTML = currentStage === STAGES.length - 1 ? 'Review pack <span aria-hidden="true">↗</span>' : 'Next <span aria-hidden="true">→</span>';
}

function renderView() {
  consultantMount?.classList.toggle('is-hidden', currentView !== 'consultant');
  compilerView?.classList.toggle('is-hidden', currentView !== 'compiler');
  const topButton = $('#consultantTopBtn');
  if (topButton) topButton.textContent = currentView === 'consultant' ? 'Open compiler' : 'Campaign consultant';
  const resetButton = $('#resetBtn');
  const exportButton = $('#exportTopBtn');
  if (resetButton) resetButton.style.display = currentView === 'consultant' ? 'none' : '';
  if (exportButton) exportButton.style.display = currentView === 'consultant' ? 'none' : '';
}

function markdown(pack) {
  const b = pack.brief; const lines = [`# ${b.meta.campaignName || 'Untitled campaign'}`, '', `> Compiled ${new Date(pack.generatedAt).toLocaleString()} · ${pack.packId}`, '', '## Campaign decision', b.proposition.promise || 'Not supplied', '', '## Foundation', `- Product: ${b.meta.product || 'TBD'}`, `- Market: ${b.meta.market || 'TBD'}`, `- Owner: ${b.meta.owner || 'TBD'}`, `- Run: ${b.meta.startDate || 'TBD'} to ${b.meta.endDate || 'TBD'}`, '', '## Audience', `- Primary: ${b.audience.primary || 'TBD'}`, `- Problem: ${b.audience.problem || 'TBD'}`, `- Trigger: ${b.audience.trigger || 'TBD'}`, `- Roles: ${(b.audience.roles || []).join(', ') || 'TBD'}`, `- Verticals: ${(b.audience.verticals || []).join(', ') || 'TBD'}`, '', '## Objectives', `- Commercial: ${b.objectives.commercial || 'TBD'}`, `- Marketing: ${b.objectives.marketing || 'TBD'}`, `- Communications: ${b.objectives.communications || 'TBD'}`, `- Primary KPI: ${b.objectives.primaryKpi || 'TBD'}`, `- All KPIs: ${(b.objectives.kpis || []).join(', ') || 'TBD'}`, `- Non-goals: ${b.objectives.nonGoals || 'TBD'}`, '', '## Strategy and production', `- Route: ${b.strategy.route || 'TBD'}`, `- Phases: ${b.strategy.phases || 'TBD'}`, `- Channels: ${(b.strategy.channels || []).join(', ') || 'TBD'}`, `- Formats: ${(b.production.formats || []).join(', ') || 'TBD'}`, `- Creative: ${b.production.creative || 'TBD'}`, '', '## Independent brand branches', ...pack.brandBranches.map((branch) => `- **${branch.brand}** (${branch.market}) · ${branch.cta} · ${branch.destination} · one approved logo per artwork`), '', '## Evidence and gates', `- Sources: ${b.governance.sources || 'TBD'}`, `- Rights: ${b.governance.rights || 'TBD'}`, `- Assumptions: ${b.governance.assumptions || 'TBD'}`, `- Required gates: ${(b.governance.gates || []).join('; ') || 'TBD'}`, `- Release state: ${b.governance.activation || 'TBD'}`, '', '## Higgsfield handoff', 'The pack contains safe job specifications only. Generate text-free masters, then apply approved copy and one branch logo in deterministic post-processing. Provider credentials and activation remain server-side and human-gated.', '', '## Readiness', `- Score: ${pack.readiness.score}%`, `- Missing: ${pack.readiness.missing.join(', ') || 'None'}`, `- Warnings: ${pack.readiness.warnings.join(' | ') || 'None'}`]; return lines.join('\n');
}
function csv(pack) { const rows = [['branch_id', 'brand', 'market', 'format', 'cta', 'destination', 'logo_rule']]; pack.brandBranches.forEach((branch) => (branch.formats || []).forEach((format) => rows.push([branch.id, branch.brand, branch.market, format, branch.cta, branch.destination, 'one approved logo per artwork']))); return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); }
function reviewHtml(pack) {
  const b = pack.brief; const branchRows = pack.brandBranches.map((branch) => `<tr><td>${esc(branch.brand)}</td><td>${esc(branch.market)}</td><td>${esc(branch.cta)}</td><td>${esc(branch.destination)}</td><td>One approved logo per artwork</td></tr>`).join('');
  const production = pack.production;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${esc(b.meta.campaignName || 'Campaign pack')} · Review</title><style>body{font:15px/1.6 system-ui,sans-serif;color:#102f36;background:#f7f4ee;margin:0;padding:42px}main{max-width:980px;margin:auto;background:#fff;padding:42px;box-shadow:0 12px 40px #073b431a}h1{font-size:42px;line-height:1.05;margin:8px 0 14px;color:#073b43}h2{font-size:17px;border-top:1px solid #ccd9d5;padding-top:22px;margin-top:30px;color:#073b43}p{max-width:75ch}small,.meta{color:#5b6d70}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #ccd9d5;padding:9px;text-align:left;vertical-align:top}th{color:#5b6d70;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.score{display:inline-block;background:#edf7f5;border:1px solid #a6d6bf;padding:5px 9px;border-radius:4px;font:600 12px ui-monospace,monospace}.warn{background:#fff7ef;border-left:3px solid #f26b38;padding:12px 14px;font-size:12px}.inventory{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:14px 0}.inventory span{background:#f2f7f5;padding:10px;border-radius:4px}.inventory b{display:block;font-size:22px;color:#073b43}.files{columns:2;font-size:12px}.files li{margin:4px 0}</style></head><body><main><small class="meta">M2M CAMPAIGN PACK · ${esc(pack.packId)} · ${esc(pack.status || 'Draft')}</small><h1>${esc(b.meta.campaignName || 'Untitled campaign')}</h1><p><strong>${esc(b.proposition.promise || 'Promise not supplied')}</strong></p><p class="score">Readiness ${pack.readiness.score}%</p><h2>Audience and route</h2><p>${esc(b.audience.primary || 'Primary audience not supplied')}</p><p>${esc(b.strategy.route || 'Conversion route not supplied')}</p><h2>Complete production inventory</h2><div class="inventory"><span><b>${production.summary.landingPages}</b>landing pages</span><span><b>${production.summary.socialAssets}</b>social objects</span><span><b>${production.summary.emailAssets}</b>email objects</span><span><b>${production.summary.paidAssets}</b>paid objects</span><span><b>${production.summary.salesTalkTracks}</b>sales talk tracks</span><span><b>${production.summary.creativeMasters}</b>text-free masters</span></div><ul class="files">${production.files.map((file) => `<li>${esc(file.path)}</li>`).join('')}</ul><h2>Independent brand branches</h2><table><thead><tr><th>Brand</th><th>Market</th><th>CTA</th><th>Destination</th><th>Artwork rule</th></tr></thead><tbody>${branchRows || '<tr><td colspan="5">No branches selected</td></tr>'}</tbody></table><h2>Evidence and gates</h2><p>${esc(b.governance.sources || 'Sources not supplied')}</p><div class="warn">${esc(pack.gates.activation)}</div><h2>Higgsfield handoff</h2><p>${pack.higgsfieldJobs.length} safe job specifications are included. Generate text-free masters, then apply approved copy and one branch logo in deterministic post-processing. Provider credentials and activation remain server-side and human-gated.</p></main></body></html>`;
}
function download(name, content, type) { const blob = new Blob([content], { type }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
function exportPack() { const pack = compilePack(); const base = pack.packId; download(`${base}-campaign-pack.json`, JSON.stringify(pack, null, 2), 'application/json'); download(`${base}-campaign-brief.md`, markdown(pack), 'text/markdown'); download(`${base}-campaign-review.html`, reviewHtml(pack), 'text/html'); download(`${base}-brand-branches.csv`, csv(pack), 'text/csv'); download(`${base}-higgsfield-jobs.json`, JSON.stringify(pack.higgsfieldJobs, null, 2), 'application/json'); (pack.production?._downloadFiles || []).forEach((file) => download(`${base}-${file.path.replace(/[^a-z0-9._-]+/gi, '-')}`, file.content, file.type)); showToast(`Complete campaign pack exported · ${pack.production?.summary.files || 0} production files`); }

$('#nextBtn').addEventListener('click', () => { if (currentStage < STAGES.length - 1) { currentStage += 1; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { exportPack(); } });
$('#backBtn').addEventListener('click', () => { if (currentStage > 0) { currentStage -= 1; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
$('#consultantTopBtn').addEventListener('click', () => { currentView = currentView === 'consultant' ? 'compiler' : 'consultant'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('#fixtureBtn').addEventListener('click', () => { state = normalizeState(merge(blankState(), fixture)); currentStage = 0; currentView = 'compiler'; save(); render(); showToast('9604 campaign fixture loaded'); });
$('#resetBtn').addEventListener('click', () => { if (!confirm('Reset this local brief?')) return; state = blankState(); currentStage = 0; currentView = 'consultant'; localStorage.removeItem(STORAGE_KEY); render(); showToast('Draft reset'); });
$('#exportBtn').addEventListener('click', exportPack);
$('#exportTopBtn').addEventListener('click', exportPack);
$('#copyBtn').addEventListener('click', async () => { try { await navigator.clipboard.writeText(JSON.stringify(compilePack(), null, 2)); showToast('Compiled brief JSON copied'); } catch { showToast('Copy unavailable; use Export pack'); } });

render();
