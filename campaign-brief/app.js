import { BRANDS } from './plugins.js';
import { LIBRARIES, LIBRARY_META } from './libraries.js';
import { buildCampaignPack } from './pack-builder.js?v=20260911-production';

const STORAGE_KEY = 'm2m-campaign-copilot-v2';
const STEPS = [
  { id: 'consult', label: 'Consult', title: 'Start with the decision.' },
  { id: 'propose', label: 'Propose', title: 'Choose a campaign spine.' },
  { id: 'refine', label: 'Refine', title: 'Shape the digital brief.' },
  { id: 'review', label: 'Review', title: 'Approve before production.' }
];
const CHANNEL_FORMATS = {
  'LinkedIn organic': ['LinkedIn organic'], 'LinkedIn document': ['LinkedIn document'], 'Email nurture': ['Email nurture'],
  'Landing page': ['Landing page'], 'Paid search': ['Paid search'], Retargeting: ['Retargeting'],
  'Sales follow-up': ['Sales enablement'], 'Partner outreach': ['Partner outreach'], 'Motion study': ['Motion study']
};
const questionMap = [
  ['intent.commercialOutcome', 'What commercial outcome are you trying to achieve?', 'Pipeline, revenue, adoption, retention, partner movement or another business result.'],
  ['intent.offer', 'What are you selling, promoting or changing?', 'A product, service, launch, behaviour, offer or customer decision.'],
  ['audience.primary', 'Who needs to act or decide?', 'Name the people, roles or organisations that can move the decision forward.'],
  ['intent.trigger', 'What makes this relevant now?', 'The moment, friction, risk or opportunity that gives the campaign urgency.'],
  ['intent.market', 'Where will this campaign run?', 'Country, region, vertical, account group or operating environment.']
];

const blankCore = () => ({
  id: 'campaign-' + Date.now(), name: '', slug: '',
  intent: { commercialOutcome: '', outcomeType: '', offer: '', trigger: '', market: '', owner: '', timing: '' },
  audience: { primary: '', roles: [], rolesOther: '', verticals: [], verticalsOther: [], geography: '', problem: '', objections: '' },
  proposition: { promise: '', supporting: '', proof: '', claimsStatus: 'Needs evidence review', cta: '', destination: '' },
  conversionRoute: { route: '', formAction: '', handoff: '' },
  activation: { channels: [], startDate: '', endDate: '', formats: [] },
  measurement: { primaryKpi: '', supportingKpis: [], target: '', event: '', source: '' },
  guardrails: { sources: '', rights: '', assumptions: '', exclusions: '', approvalNotes: '' },
  brand: { plugins: ['m2m-connectivity', 'm2m-one-au'], independentArtwork: true, handoff: '' },
  advanced: { creative: '', imagery: '', motion: '', nurture: '', budget: '' },
  provenance: { fields: {}, inferred: [], generated: [], edited: [] },
  approvals: { strategy: false, claims: false, brand: false, destination: false, rights: false, generation: false }
});

const blankRun = () => ({
  inputs: {}, research: { mode: 'Quick scan', questions: [], evidence: [], sources: [], status: 'Not prepared', preparedAt: null },
  concepts: [], generation: 0, preferenceEvents: [], pendingRewriteRound: null, selectedConcept: null,
  status: 'Draft', pack: null, publication: null
});

const blankState = () => ({ campaignCore: blankCore(), consultantRun: blankRun() });

const seed9604 = () => {
  const core = blankCore();
  core.id = 'fixture-9604-hybrid-connectivity';
  core.name = 'Coverage Beyond the Grid';
  core.slug = 'coverage-beyond-the-grid';
  core.intent = {
    commercialOutcome: 'Generate qualified technical conversations and sales-accepted leads for Hybrid IoT design work.',
    outcomeType: 'Generate sales-accepted leads', offer: 'Iridium Certus 9604 Hybrid IoT',
    trigger: 'A device, asset or worker reaches the edge of the cellular operating map and a missed message has an operational consequence.',
    market: 'Australia + New Zealand', owner: 'M2M Group', timing: '12-week demand generation campaign'
  };
  core.audience = {
    primary: 'Product teams and system integrators whose connected devices move beyond dependable cellular coverage.',
    roles: ['Product manager', 'Embedded systems engineer', 'Solution architect', 'Operations leader'], rolesOther: '',
    verticals: ['Asset tracking and monitoring', 'Agriculture and agtech', 'Environmental monitoring', 'Industrial automation', 'Security and field safety'],
    verticalsOther: ['Remote equipment'], geography: 'Australia and New Zealand; remote, regional and mobile operating environments.',
    problem: 'Teams need to decide which messages must travel, by which path, and what the device should do when its preferred network is unavailable.',
    objections: 'Hybrid connectivity may over-promise; architecture, power, antenna, service and commercial constraints need review.'
  };
  core.proposition = {
    promise: 'Cellular where you can. Satellite where you must.',
    supporting: 'One compact module makes both layers available. Your product design defines routing, retry, priority and fallback behaviour.',
    proof: 'Official Iridium 9604 product information: LTE-M cellular, Iridium Short Burst Data and GNSS in a 16 × 26 × 2.4 mm module; independent subsystem control and a unified AT-command interface.',
    claimsStatus: 'Confirmed and qualified; application behaviour remains developer-defined.',
    cta: 'Start a Hybrid IoT design conversation', destination: 'https://m2mone.com.au/hybrid-iot-readiness/'
  };
  core.conversionRoute = { route: 'Coverage problem → readiness guide → qualified design conversation', formAction: 'Readiness guide form', handoff: 'Sales owns response and qualification.' };
  core.activation = {
    channels: ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Sales follow-up'],
    startDate: '2026-09-21', endDate: '2026-12-13',
    formats: ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Sales enablement', 'Motion study']
  };
  core.measurement = {
    primaryKpi: 'Qualified design-session requests and sales-accepted leads',
    supportingKpis: ['Assessment or consultation requests', 'Landing-page conversion rate', 'Lead response time'],
    target: '', event: 'Qualified design-session request', source: 'CRM and campaign source attribution'
  };
  core.guardrails = {
    sources: 'Official Iridium 9604 product information; campaign-owned readiness framework; live OptiFlows campaign pack at /campaigns/9604-hybrid-connectivity/.',
    rights: 'Confirm image, logo, font, product-render, partner and customer permissions before publication.',
    assumptions: 'Final application architecture and coverage depend on engineering review.',
    exclusions: 'No universal coverage, automatic failover, safety guarantee or confirmed customer event.',
    approvalNotes: 'Technical claims, brand, destination, rights, budget and activation owner require approval.'
  };
  core.brand = { plugins: ['m2m-connectivity', 'm2m-one-au'], independentArtwork: true, handoff: 'M2M marketing owns the brief; technical, brand and commercial owners approve before activation.' };
  core.advanced = {
    creative: 'Human operating moments at the coverage edge. Technical clarity over product glamour.',
    imagery: 'Illustrative field settings are allowed when marked as generated and not presented as customer proof.',
    motion: 'Short explainer and motion studies may be generated from text-free masters, then composited with approved typography and logos.',
    nurture: 'Recognise → educate → diagnose → convert, with lead response and qualification owned by sales.', budget: ''
  };
  const run = blankRun();
  run.inputs = { commercialGoal: core.intent.commercialOutcome, offer: core.intent.offer, decisionMaker: core.audience.primary, trigger: core.intent.trigger, market: core.intent.market, proofConstraints: core.proposition.proof };
  return { campaignCore: core, consultantRun: run };
};

let state = loadState();
let currentStep = Number(sessionStorage.getItem('m2m-campaign-copilot-step') || 0);
let toastTimer = null;
const appRoot = document.querySelector('#appRoot');

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function merge(base, input) {
  if (!input || typeof input !== 'object') return base;
  Object.keys(input).forEach((key) => {
    if (input[key] && typeof input[key] === 'object' && !Array.isArray(input[key]) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) base[key] = merge({ ...base[key] }, input[key]);
    else if (input[key] !== undefined) base[key] = input[key];
  });
  return base;
}
function fromLegacy(input) {
  const core = blankCore(), meta = input.meta || {}, audience = input.audience || {}, objectives = input.objectives || {}, proposition = input.proposition || {}, strategy = input.strategy || {}, production = input.production || {}, governance = input.governance || {};
  core.name = meta.campaignName || ''; core.slug = meta.campaignSlug || '';
  core.intent = { commercialOutcome: objectives.commercial || '', outcomeType: objectives.commercialTypes?.[0] || '', offer: meta.product || '', trigger: audience.trigger || '', market: meta.market || '', owner: meta.owner || '', timing: [meta.startDate, meta.endDate].filter(Boolean).join(' to ') };
  core.audience = { primary: audience.primary || '', roles: audience.roles || audience.rolesSelected || [], rolesOther: audience.rolesOther || '', verticals: audience.verticals || audience.verticalsSelected || [], verticalsOther: audience.verticalsOther ? [audience.verticalsOther] : [], geography: audience.geographies || '', problem: audience.problem || '', objections: audience.objections || '' };
  core.proposition = { promise: proposition.promise || '', supporting: proposition.supporting || '', proof: proposition.proof || '', claimsStatus: proposition.claimsStatus || 'Needs evidence review', cta: proposition.cta || '', destination: proposition.landingUrl || '' };
  core.conversionRoute = { route: strategy.route || '', formAction: '', handoff: '' };
  core.activation = { channels: strategy.channels || [], startDate: meta.startDate || '', endDate: meta.endDate || '', formats: production.formats || [] };
  core.measurement = { primaryKpi: objectives.primaryKpi || objectives.kpis?.[0] || '', supportingKpis: objectives.secondaryKpis || (objectives.kpis || []).slice(1), target: '', event: objectives.primaryKpi || '', source: '' };
  core.guardrails = { sources: governance.sources || '', rights: governance.rights || '', assumptions: governance.assumptions || '', exclusions: objectives.nonGoals || '', approvalNotes: '' };
  core.brand = { plugins: input.branches?.selected || ['m2m-connectivity'], independentArtwork: input.branches?.independent !== false, handoff: input.branches?.handoff || '' };
  core.advanced = { creative: production.creative || '', imagery: production.imagery || '', motion: production.motion || '', nurture: strategy.nurture || '', budget: '' };
  return { campaignCore: core, consultantRun: merge(blankRun(), input.consultantRun || {}) };
}
function normalise(next) {
  if (!next.campaignCore) next = fromLegacy(next);
  const clean = merge(blankState(), next), template = blankCore(), c = clean.campaignCore;
  ['intent', 'audience', 'proposition', 'conversionRoute', 'activation', 'measurement', 'guardrails', 'brand', 'advanced', 'approvals'].forEach((key) => { c[key] = merge(template[key], c[key]); });
  ['roles', 'verticals', 'verticalsOther'].forEach((key) => { if (!Array.isArray(c.audience[key])) c.audience[key] = c.audience[key] ? [c.audience[key]] : []; });
  ['channels', 'formats'].forEach((key) => { if (!Array.isArray(c.activation[key])) c.activation[key] = []; });
  if (!Array.isArray(c.measurement.supportingKpis)) c.measurement.supportingKpis = [];
  if (!Array.isArray(c.brand.plugins)) c.brand.plugins = [];
  c.provenance = merge(template.provenance, c.provenance);
  c.provenance.fields = c.provenance.fields || {};
  ['inferred', 'generated', 'edited'].forEach((key) => { if (!Array.isArray(c.provenance[key])) c.provenance[key] = []; });
  clean.consultantRun = merge(blankRun(), clean.consultantRun || {});
  clean.consultantRun.research = merge(blankRun().research, clean.consultantRun.research || {});
  ['questions', 'evidence', 'sources'].forEach((key) => { if (!Array.isArray(clean.consultantRun.research[key])) clean.consultantRun.research[key] = []; });
  ['concepts', 'preferenceEvents'].forEach((key) => { if (!Array.isArray(clean.consultantRun[key])) clean.consultantRun[key] = []; });
  clean.consultantRun.generation = Number(clean.consultantRun.generation || 0);
  c.slug = c.slug || slugify(c.name);
  c.activation.formats = derivedFormats(c.activation.channels, c.activation.formats);
  return clean;
}
function loadState() {
  try { const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('m2m-campaign-brief-compiler-v1'); return normalise(stored ? JSON.parse(stored) : blankState()); }
  catch { return normalise(blankState()); }
}
function save() {
  state = normalise(state); localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const node = document.querySelector('#saveState'); if (node) node.textContent = 'Saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function getPath(path) { return path.split('.').reduce((obj, key) => obj?.[key], state.campaignCore); }
function setPath(path, value) { const bits = path.split('.'), last = bits.pop(), target = bits.reduce((obj, key) => obj[key], state.campaignCore); target[last] = value; }
function getRun(path) { return path.split('.').reduce((obj, key) => obj?.[key], state.consultantRun); }
function setRun(path, value) { const bits = path.split('.'), last = bits.pop(), target = bits.reduce((obj, key) => obj[key], state.consultantRun); target[last] = value; }
function slugify(value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70); }
function esc(value = '') { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800); }
function consultantAnswer(value, fallback) { const text = String(value || '').trim(); return text && !/^i\s*don'?t\s*know$/i.test(text) ? text : fallback; }
function cleanPhrase(value) { return String(value || '').trim().replace(/[.。]+$/g, ''); }
function derivedFormats(channels, existing = []) { return [...new Set((channels || []).flatMap((channel) => CHANNEL_FORMATS[channel] || []).concat(existing || []))]; }
function selectedBrandNames() { return (state.campaignCore.brand.plugins || []).map((id) => BRANDS[id]?.name || id); }
function markProvenance(paths, kind) {
  const provenance = state.campaignCore.provenance || (state.campaignCore.provenance = { fields: {}, inferred: [], generated: [], edited: [] });
  paths.forEach((path) => { provenance.fields[path] = kind; if (Array.isArray(provenance[kind === 'Generated' ? 'generated' : kind === 'Inferred' ? 'inferred' : 'edited']) && !provenance[kind === 'Generated' ? 'generated' : kind === 'Inferred' ? 'inferred' : 'edited'].includes(path)) provenance[kind === 'Generated' ? 'generated' : kind === 'Inferred' ? 'inferred' : 'edited'].push(path); });
}

function field(path, label, hint, placeholder, type = 'text') {
  const value = getPath(path) || '';
  return '<div class="field"><label for="field-' + path.replace(/\./g, '-') + '">' + esc(label) + (hint ? '<span>' + esc(hint) + '</span>' : '') + '</label><input id="field-' + path.replace(/\./g, '-') + '" data-bind="' + path + '" type="' + type + '" value="' + esc(value) + '" placeholder="' + esc(placeholder || '') + '"></div>';
}
function area(path, label, hint, placeholder) {
  const value = getPath(path) || '';
  return '<div class="field"><label for="field-' + path.replace(/\./g, '-') + '">' + esc(label) + (hint ? '<span>' + esc(hint) + '</span>' : '') + '</label><textarea id="field-' + path.replace(/\./g, '-') + '" data-bind="' + path + '" placeholder="' + esc(placeholder || '') + '">' + esc(value) + '</textarea></div>';
}
function selectField(path, label, options, hint) {
  const current = getPath(path) || '';
  const values = current && !options.includes(current) ? [current].concat(options) : options;
  return '<div class="field"><label for="field-' + path.replace(/\./g, '-') + '">' + esc(label) + (hint ? '<span>' + esc(hint) + '</span>' : '') + '</label><select id="field-' + path.replace(/\./g, '-') + '" data-bind="' + path + '"><option value="">Choose one</option>' + values.map((option) => '<option value="' + esc(option) + '"' + (option === current ? ' selected' : '') + '>' + esc(option) + '</option>').join('') + '</select></div>';
}
function checkboxSet(path, label, options, hint, otherPath) {
  const selected = getPath(path) || [], choices = options.concat(otherPath ? ['Other'] : []);
  return '<fieldset class="choice-field"><legend>' + esc(label) + (hint ? '<span>' + esc(hint) + '</span>' : '') + '</legend><div class="choice-grid">' + choices.map((option) => '<label class="choice"><input type="checkbox" data-check="' + path + '" value="' + esc(option) + '"' + (selected.includes(option) ? ' checked' : '') + '><span>' + esc(option) + '</span></label>').join('') + '</div>' + (otherPath && selected.includes('Other') ? '<div class="other-inline">' + field(otherPath, 'Tell us more', '', 'Add the missing option') + '</div>' : '') + '</fieldset>';
}
function brandChoices() {
  const selected = state.campaignCore.brand.plugins || [];
  return '<fieldset class="choice-field brand-choice"><legend>Brand branch<span>Applied after the campaign spine is selected. Each branch stays independent.</span></legend><div class="brand-grid">' + Object.entries(BRANDS).map(([id, brand]) => '<label class="brand-option"><input type="checkbox" data-brand="' + id + '"' + (selected.includes(id) ? ' checked' : '') + '><span><strong>' + esc(brand.name) + '</strong><small>' + esc(brand.entity + ' · ' + brand.market) + '</small></span></label>').join('') + '</div><p class="micro-note">Artwork is generated per branch with one approved logo. Mixed-logo lockups are disabled.</p></fieldset>';
}

function buildResearchPlan() {
  const core = state.campaignCore, mode = state.consultantRun.research.mode || 'Quick scan';
  const offer = consultantAnswer(core.intent.offer, 'the offer'), outcome = consultantAnswer(core.intent.commercialOutcome, 'the commercial outcome'), audience = consultantAnswer(core.audience.primary, 'the priority audience'), today = new Date().toISOString().slice(0, 10);
  const questions = [
    'What evidence supports the commercial outcome: ' + outcome + '?',
    'Which approved terminology and brand rules apply to ' + offer + ' in ' + consultantAnswer(core.intent.market, 'the selected market') + '?',
    'What proof can substantiate the problem for ' + audience + '?',
    'Which claims, rights, destination or owners need approval before release?'
  ];
  let evidence = mode === 'No research' ? [{ id: 'no-research', status: 'Unknown', title: 'Research skipped', source: 'User selection', date: null, detail: 'Concepts use supplied information only. No source claims have been checked.' }] : [
    { id: 'brand-brief', status: 'Confirmed', title: 'M2M Group brand brief', source: LIBRARY_META.source, date: LIBRARY_META.reviewed, detail: 'Audience, voice and brand-branch rules are available as an attributable internal reference.' },
    { id: 'existing-campaign', status: 'Strongly supported', title: 'Existing campaign reference', source: 'https://optiflows.com.au/campaigns/9604-hybrid-connectivity/', date: today, detail: 'The existing pack provides a reference for route, production objects and evidence treatment.' },
    { id: 'campaign-fit', status: core.intent.offer && core.intent.trigger ? 'Inferred' : 'Unknown', title: 'Campaign-specific evidence', source: 'Supplied in this consultant run', date: today, detail: core.intent.offer && core.intent.trigger ? 'The current campaign direction is inferred from the offer and trigger; verify before treating it as a claim.' : 'Supply an offer and trigger, or keep this item explicitly unknown.' },
    { id: 'approval', status: 'Requires approval', title: 'Activation and claim approvals', source: 'Human gate', date: null, detail: 'Technical claims, rights, destination, budget, send and external generation remain approval gates.' }
  ];
  if (mode === 'Evidence pack') evidence = evidence.concat([{ id: 'claims-register', status: 'Requires approval', title: 'Claims register starter', source: 'Prepared from campaign inputs', date: today, detail: 'Record each claim, source, confidence, expiry and approver before publication.' }]);
  state.consultantRun.research = { mode, questions, evidence, sources: evidence.map((item) => ({ title: item.title, source: item.source, date: item.date, status: item.status })), status: mode === 'No research' ? 'Prepared without research' : 'Prepared research plan; source review remains human-controlled', preparedAt: new Date().toISOString() };
}

function conceptTemplates(inputs, generation) {
  const offer = consultantAnswer(inputs.offer, 'the offer'), audience = consultantAnswer(inputs.decisionMaker, 'the people who need to decide'), trigger = cleanPhrase(consultantAnswer(inputs.trigger, 'the moment the problem becomes urgent')), market = consultantAnswer(inputs.market, 'the selected market');
  const is9604 = /9604|hybrid|iridium|satellite/i.test([inputs.offer, inputs.trigger, inputs.proofConstraints].join(' ')), variant = Math.max(0, Number(generation || 1) - 1) % 3;
  const boundaryIdeas = is9604 ? ['Where does your device lose coverage?', 'Where does the operating map stop?', 'Make the coverage boundary a design input.'] : ['Where does the journey break?', 'Where does the operating journey stop?', 'Make the friction boundary visible.'];
  const consequenceIdeas = is9604 ? ['What does one missed transmission cost?', 'How long can silence last?', 'Which signal earns a different path?'] : ['What does one missed signal cost?', 'How long can the gap remain invisible?', 'Which moment deserves a different response?'];
  const engineeringIdeas = is9604 ? ['One module. Both layers. Your logic.', 'Design the path before the edge case.', 'The exception path belongs in the architecture.'] : ['One design. Evidence you can use.', 'Build the proof into the decision.', 'Make the next technical step defensible.'];
  const boundaryMessages = is9604 ? ['Coverage is a design question. Map where the preferred path stops, then plan what happens next.', 'Coverage is an operating input. Locate the boundary, then design the response around it.', 'Treat the coverage boundary as a first-class design input before selecting the response.'] : ['Make ' + trigger + ' visible before asking the market to act.', 'Name the point where ' + trigger + ' becomes a decision, then make the next step clear.', 'Turn ' + trigger + ' into a visible design question before asking for action.'];
  const consequenceMessages = ['When a message matters, the cost of silence should be visible before the system is designed.', 'When silence has a cost, message priority should shape the design before implementation.', 'The right response starts by deciding which moments are too valuable to leave to chance.'];
  const engineeringMessages = is9604 ? ['One module can expose both connectivity layers; your logic defines routing, retry and priority.', 'The module makes both layers available; the product still defines routing, retry and priority.', 'A compact module can simplify the hardware footprint while leaving the important logic with your design team.'] : [offer + ' gives the team a basis for a defensible design; the application logic and constraints still need review.', offer + ' can support a more defensible decision when the interfaces and constraints are explicit.', 'Use ' + offer + ' as a starting point for a proof-led design review, with the application constraints still visible.'];
  const sharedChannels = ['LinkedIn organic', 'Landing page', 'Email nurture', 'Sales follow-up'];
  return [
    { id: 'coverage-boundary', title: 'Coverage boundary', idea: boundaryIdeas[variant], audience, audienceTension: trigger, problem: 'Make the boundary visible: ' + trigger + '.', message: boundaryMessages[variant], supporting: 'Give ' + audience + ' a simple way to see where ' + offer + ' fits and what needs to be assessed in ' + market + '.', why: 'Turns an abstract problem into a recognisable moment that can earn attention quickly.', proofRequirements: ['A sourced description of the boundary or trigger', 'A clear definition of what the offer can and cannot do', 'A useful assessment or checklist'], risks: ['The hook becomes generic if the boundary is not concrete', 'The audience may not recognise the moment without a real example'], cta: 'Map the next decision', route: 'Boundary signal → diagnostic guide → scoped assessment → qualified conversation', channels: sharedChannels, formats: ['LinkedIn organic', 'LinkedIn document', 'Landing page', 'Email nurture'], visual: 'A human or asset approaching a visible operating boundary; no embedded copy or invented customer proof.' },
    { id: 'operational-consequence', title: 'Operational consequence', idea: consequenceIdeas[variant], audience, audienceTension: trigger, problem: 'Connect the trigger to the consequence: ' + trigger + '.', message: consequenceMessages[variant], supporting: 'Show the operational decision behind ' + offer + ': what must travel, when it must travel and what a responsible fallback requires.', why: 'Makes commercial value tangible by linking the problem to time, risk, cost or continuity.', proofRequirements: ['A quantified or bounded consequence', 'A credible use case or customer-safe scenario', 'Evidence that supports the proposed response'], risks: ['Unverified numbers can over-promise', 'The campaign needs a concrete consequence, not a fear statement'], cta: 'Assess the cost of a missed message', route: 'Operational consequence → proof-led scenario → readiness offer → qualified conversation', channels: sharedChannels, formats: ['LinkedIn organic', 'LinkedIn document', 'Landing page', 'Email nurture', 'Sales enablement'], visual: 'A field decision interrupted at the moment it matters; show consequence through context, not alarmist overlays.' },
    { id: 'engineering-proof', title: 'Engineering proof', idea: engineeringIdeas[variant], audience, audienceTension: trigger, problem: 'Answer the engineering question inside ' + trigger + '.', message: engineeringMessages[variant], supporting: 'Lead with the mechanism, the interfaces and the decisions that remain with the product team.', why: 'Earns trust with technically literate buyers who need proof and boundaries before a sales conversation.', proofRequirements: ['Official product or service facts', 'Interface, architecture or integration evidence', 'A qualified statement of what remains developer- or customer-defined'], risks: ['A technical hook can lose non-engineering decision-makers', 'The mechanism must be explained without implying automatic outcomes'], cta: 'Review the design questions', route: 'Engineering question → technical proof → architecture checklist → design conversation', channels: sharedChannels, formats: ['LinkedIn document', 'Landing page', 'Email nurture', 'Sales enablement'], visual: 'A restrained technical field scene with room for deterministic copy and a later single-brand composition.' }
  ];
}
function generateConcepts() {
  const core = state.campaignCore;
  if (!state.consultantRun.research.questions.length) buildResearchPlan();
  state.consultantRun.generation = Number(state.consultantRun.generation || 0) + 1;
  state.consultantRun.inputs = { commercialGoal: core.intent.commercialOutcome, offer: core.intent.offer, decisionMaker: core.audience.primary, trigger: core.intent.trigger, market: core.intent.market, proofConstraints: core.proposition.proof || core.guardrails.sources };
  state.consultantRun.concepts = conceptTemplates(state.consultantRun.inputs, state.consultantRun.generation);
  state.consultantRun.preferenceEvents = []; state.consultantRun.pendingRewriteRound = null; state.consultantRun.selectedConcept = null; state.consultantRun.status = 'Proposal generated; choose a direction';
}
function comparisonRounds() {
  const concepts = state.consultantRun.concepts || []; if (concepts.length < 3) return [];
  const [a, b, c] = concepts;
  return [
    { id: 'commercial-fit', prompt: 'Which concept better matches the commercial outcome?', left: { label: a.title, text: a.idea, conceptId: a.id }, right: { label: b.title, text: b.idea, conceptId: b.id } },
    { id: 'message-believability', prompt: 'Which message feels more believable?', left: { label: a.title, text: a.message, conceptId: a.id }, right: { label: c.title, text: c.message, conceptId: c.id } },
    { id: 'audience-sharpness', prompt: 'Which audience problem is sharper?', left: { label: b.title, text: b.problem, conceptId: b.id }, right: { label: c.title, text: c.problem, conceptId: c.id } },
    { id: 'cta-natural', prompt: 'Which CTA feels more natural?', left: { label: a.title, text: a.cta + ' · ' + a.route, conceptId: a.id }, right: { label: b.title, text: b.cta + ' · ' + b.route, conceptId: b.id } }
  ];
}
function preferenceFor(roundId) { return (state.consultantRun.preferenceEvents || []).find((event) => event.roundId === roundId); }
function rankedConcepts() {
  const concepts = state.consultantRun.concepts || [], scores = Object.fromEntries(concepts.map((concept, index) => [concept.id, { concept, score: 0, index }]));
  (state.consultantRun.preferenceEvents || []).forEach((event) => (event.conceptIds || []).forEach((id) => { if (scores[id]) scores[id].score += event.choice === 'combine' ? 1 : event.choice === 'none' || event.choice === 'rewrite' ? 0 : 2; }));
  return Object.values(scores).sort((a, b) => b.score - a.score || a.index - b.index);
}
function applyConcept(concept) {
  const core = state.campaignCore;
  core.name = core.name || concept.title; core.slug = core.slug || slugify(core.name);
  core.proposition.promise = concept.message; core.proposition.supporting = concept.supporting; core.proposition.proof = core.proposition.proof || concept.proofRequirements.join('; '); core.proposition.cta = concept.cta;
  core.conversionRoute.route = concept.route; core.audience.problem = concept.problem; core.activation.channels = concept.channels.slice(); core.activation.formats = derivedFormats(concept.channels, concept.formats);
  core.advanced.creative = concept.visual; core.advanced.imagery = 'Use text-free masters and deterministic copy/logo application. Record provenance and rights before activation.'; core.advanced.nurture = 'Recognise → educate → diagnose → convert, with lead response and qualification owned by sales.';
  markProvenance(['proposition.promise', 'proposition.supporting', 'proposition.proof', 'proposition.cta', 'conversionRoute.route', 'audience.problem', 'activation.channels', 'activation.formats', 'advanced.creative', 'advanced.imagery', 'advanced.nurture'], 'Generated');
  state.consultantRun.selectedConcept = concept.id; state.consultantRun.status = 'Direction handed into the brief';
}
function brandBranches() {
  const core = state.campaignCore;
  return (core.brand.plugins || []).map((id) => {
    const brand = BRANDS[id]; return { id, plugin: id + '@' + brand.pluginVersion, brand: brand.name, entity: brand.entity, market: brand.market, voice: brand.tone, palette: brand.palette,
      logo: brand.logo ? { path: brand.logo, rule: 'Use exactly one approved logo per artwork.' } : { path: null, rule: 'Supply the official Semtech logo before production.' },
      cta: core.proposition.cta || brand.cta, destination: core.proposition.destination || brand.url, independentArtwork: true, formats: core.activation.formats, reviewOwner: core.brand.handoff || 'Assign brand approver',
      legal: { claimStatus: core.proposition.claimsStatus, rights: core.guardrails.rights || 'Required before activation' } };
  });
}
function higgsfieldJobs(branches) {
  const core = state.campaignCore;
  return branches.flatMap((branch) => {
    const jobs = [];
    if (core.activation.formats.includes('Landing page') || core.activation.formats.includes('Motion study')) jobs.push({ id: branch.id + '-hero-master', provider: 'Higgsfield', jobType: 'gpt_image_2', mode: 'Job specifications only', branch: branch.id, model: 'GPT Image 2 / approved campaign model', prompt: (core.advanced.creative || 'Human operating moment at the edge of dependable connectivity.') + ' Subject: ' + (core.intent.offer || 'the campaign offer') + '. Tone: ' + branch.voice + '.', negativePrompt: 'No logos, no typography, no invented product claims, no customer testimonial, no UI text.', postProcess: 'Apply the approved branch logo and copy in the deterministic channel renderer.', humanGate: 'Creative approval and rights review before publication.' });
    if (core.activation.formats.includes('LinkedIn organic') || core.activation.formats.includes('LinkedIn document')) jobs.push({ id: branch.id + '-social-master', provider: 'Higgsfield', jobType: 'gpt_image_2', mode: 'Job specifications only', branch: branch.id, model: 'GPT Image 2 / approved campaign model', prompt: 'A clear, human-centred visual for ' + (core.audience.primary || 'the campaign audience') + ' showing ' + (core.audience.problem || 'the operating problem') + '. ' + (core.advanced.imagery || ''), negativePrompt: 'No logo lockups, no words in the image, no performance guarantee, no generic stock-tech collage.', postProcess: 'Add one branch identity only; generate accessible alt text and platform copy separately.', humanGate: 'Brand and technical claim review.' });
    if (core.activation.formats.includes('Email nurture')) jobs.push({ id: branch.id + '-email-visual', provider: 'Higgsfield', jobType: 'gpt_image_2', mode: 'Job specifications only', branch: branch.id, model: 'GPT Image 2 / approved campaign model', prompt: 'A restrained supporting image for an email about ' + (core.proposition.promise || 'the campaign promise') + ', legible at 600px wide, with clear negative space for deterministic copy.', negativePrompt: 'No logos, no embedded type, no unverified feature claims.', postProcess: 'Compose in email-safe HTML, with alt text and one approved logo.', humanGate: 'Email and brand review.' });
    return jobs;
  });
}
function toLegacyBrief() {
  const core = state.campaignCore, formats = derivedFormats(core.activation.channels, core.activation.formats);
  return {
    meta: { campaignName: core.name || 'Untitled campaign', campaignSlug: core.slug || slugify(core.name), product: core.intent.offer, market: core.intent.market, campaignType: 'Demand generation', owner: core.intent.owner, startDate: core.activation.startDate, endDate: core.activation.endDate },
    audience: { primary: core.audience.primary, primarySegments: [], primaryOther: '', primaryDetail: core.audience.primary, roles: core.audience.roles.concat(core.audience.rolesOther || []), rolesSelected: core.audience.roles, rolesOther: '', verticals: core.audience.verticals.concat(core.audience.verticalsOther || []), verticalsSelected: core.audience.verticals, verticalsOther: '', geographies: core.audience.geography, trigger: core.intent.trigger, problem: core.audience.problem, objections: core.audience.objections },
    objectives: { commercial: core.intent.commercialOutcome, commercialTypes: [core.intent.outcomeType].filter(Boolean), commercialOther: '', marketing: 'Create a qualified audience and move engaged people to the next step.', marketingTypes: [], marketingOther: '', communications: core.proposition.promise, communicationsTypes: [], communicationsOther: '', kpis: [core.measurement.primaryKpi].concat(core.measurement.supportingKpis).filter(Boolean), primaryKpi: core.measurement.primaryKpi, secondaryKpis: core.measurement.supportingKpis, nonGoals: core.guardrails.exclusions },
    proposition: { promise: core.proposition.promise, supporting: core.proposition.supporting, proof: core.proposition.proof, claimsStatus: core.proposition.claimsStatus, cta: core.proposition.cta, landingUrl: core.proposition.destination, suggestions: [] },
    strategy: { route: core.conversionRoute.route, phases: 'Recognise the problem → prove the decision → invite the qualified next step', channels: core.activation.channels, tactics: 'Build the selected campaign spine across ' + formats.join(', ') + '.', nurture: core.advanced.nurture, recommendations: [] },
    production: { formats, creative: core.advanced.creative, imagery: core.advanced.imagery, motion: core.advanced.motion, assetNotes: 'Independent single-brand artwork; no combined lockups.' },
    governance: { sources: core.guardrails.sources, rights: core.guardrails.rights, assumptions: core.guardrails.assumptions, gates: ['Technical claims reviewed', 'Brand branch reviewed', 'Landing destination and form owner confirmed', 'Creative rights and provenance recorded', 'Budget and activation owner approved'], activation: 'Private review' },
    branches: { selected: core.brand.plugins, independent: true, higgsfield: 'Job specifications only', handoff: core.brand.handoff }
  };
}
function readiness() {
  const c = state.campaignCore, checks = [['commercial outcome', c.intent.commercialOutcome], ['offer', c.intent.offer], ['primary audience', c.audience.primary], ['market', c.intent.market], ['campaign promise', c.proposition.promise], ['CTA', c.proposition.cta], ['conversion route', c.conversionRoute.route], ['priority channel', c.activation.channels.length], ['primary KPI', c.measurement.primaryKpi], ['brand branch', c.brand.plugins.length], ['source or evidence', c.guardrails.sources]];
  const missing = checks.filter(([, value]) => !value).map(([label]) => 'Define the ' + label + '.');
  const warnings = []; if (!c.proposition.proof) warnings.push('Proof is empty; claims should not enter production until evidence is attached.'); if (!c.proposition.destination) warnings.push('Destination is unresolved and needs owner confirmation.'); if (c.brand.plugins.length > 1 && !c.brand.independentArtwork) warnings.push('Multiple brands require independent artwork.');
  return { score: Math.round(((checks.length - missing.length) / checks.length) * 100), missing, warnings };
}
function compilePack() {
  const brief = toLegacyBrief(), branches = brandBranches(), jobs = higgsfieldJobs(branches), production = buildCampaignPack({ brief, branches, consultantRun: state.consultantRun, higgsfieldJobs: jobs }), ready = readiness();
  return { schema: 'm2m-campaign-copilot/v2', packId: brief.meta.campaignSlug || 'untitled-campaign', generatedAt: new Date().toISOString(), status: 'PRIVATE REVIEW · ' + (ready.score >= 75 ? 'READY FOR REVIEW' : 'DRAFT'), readiness: ready, campaignCore: clone(state.campaignCore), brief, brandBranches: branches, consultantRun: clone(state.consultantRun), production, outputs: { completePack: production.summary, landingPage: production.copy.landing.map((item) => ({ id: item.id, brand: item.brand, destination: item.destination })), independentArtwork: true }, approvalState: clone(state.campaignCore.approvals || {}) };
}
function markdown(pack) {
  const c = pack.campaignCore;
  return ['# ' + (c.name || 'Untitled campaign'), '', '> Campaign Copilot brief · ' + pack.packId, '', '## Campaign intent', c.intent.commercialOutcome || 'Not supplied', '', '- Offer: ' + (c.intent.offer || 'TBD'), '- Market: ' + (c.intent.market || 'TBD'), '- Owner: ' + (c.intent.owner || 'TBD'), '', '## Audience', '- Primary: ' + (c.audience.primary || 'TBD'), '- Roles: ' + (c.audience.roles || []).join(', '), '- Verticals: ' + (c.audience.verticals || []).join(', '), '- Problem: ' + (c.audience.problem || 'TBD'), '- Trigger: ' + (c.intent.trigger || 'TBD'), '', '## Proposition', c.proposition.promise || 'Not supplied', '', c.proposition.supporting || 'Supporting message not supplied', '', '- Proof: ' + (c.proposition.proof || 'TBD'), '- CTA: ' + (c.proposition.cta || 'TBD'), '- Destination: ' + (c.proposition.destination || 'TBD'), '', '## Activation and measurement', '- Route: ' + (c.conversionRoute.route || 'TBD'), '- Channels: ' + (c.activation.channels || []).join(', '), '- Formats: ' + (c.activation.formats || []).join(', '), '- Primary KPI: ' + (c.measurement.primaryKpi || 'TBD'), '- Supporting KPIs: ' + (c.measurement.supportingKpis || []).join(', '), '', '## Brand branches', ...pack.brandBranches.map((branch) => '- **' + branch.brand + '** (' + branch.market + ') · one approved logo per artwork'), '', '## Evidence and gates', '- Sources: ' + (c.guardrails.sources || 'TBD'), '- Rights: ' + (c.guardrails.rights || 'TBD'), '- Approvals: strategy, claims, brand, destination and rights remain human gates.'].join('\n');
}
function csv(pack) {
  const rows = [['branch_id', 'brand', 'market', 'format', 'cta', 'destination', 'logo_rule']];
  pack.brandBranches.forEach((branch) => (branch.formats || []).forEach((format) => rows.push([branch.id, branch.brand, branch.market, format, branch.cta, branch.destination, 'one approved logo per artwork'])));
  return rows.map((row) => row.map((cell) => '"' + String(cell ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
}
function publishInstructions(pack) {
  const publication = pack.production.publication || {}, fence = String.fromCharCode(96).repeat(3);
  return ['# Publish ' + (pack.campaignCore.name || 'campaign') + ' into /campaigns/', '', 'The signed Campaign Copilot export is a portable handoff. From the repository root run:', '', fence + 'bash', publication.command || 'node tools/publish-campaign-pack.cjs <campaign-pack.json> [slug]', fence, '', 'Target route: ' + (publication.route || '/campaigns/<slug>/'), 'Status: private review with noindex.', '', 'The publisher creates the complete HTML pack, updates the campaign library, writes the asset manifest and verification report, and keeps external sends, spend, CRM changes and provider generation behind approval gates.'].join('\n');
}
function download(name, content, type) {
  const blob = new Blob([content], { type }), link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function exportPack() {
  const pack = compilePack(), base = pack.packId;
  download(base + '-campaign-pack.json', JSON.stringify(pack, null, 2), 'application/json'); download(base + '-campaign-brief.md', markdown(pack), 'text/markdown'); download(base + '-campaign-branches.csv', csv(pack), 'text/csv'); download(base + '-publish-instructions.md', publishInstructions(pack), 'text/markdown');
  (pack.production._downloadFiles || []).forEach((file) => download(base + '-' + file.path.replace(/[^a-z0-9._-]+/gi, '-'), file.content, file.type));
  showToast('Campaign pack exported · ' + pack.production.summary.files + ' production files');
}
function generatePack() {
  const pack = compilePack(); state.consultantRun.pack = { packId: pack.packId, generatedAt: pack.generatedAt, status: pack.status, readiness: pack.readiness, summary: pack.production.summary }; state.consultantRun.status = 'Pack generated; private publish is ready'; save(); showToast('Complete campaign pack generated');
}
function publishPack() {
  const pack = compilePack(); state.consultantRun.publication = { status: 'Handoff ready', route: pack.production.publication.route, requestedAt: new Date().toISOString(), noindex: true, method: 'Controlled repository publisher' }; state.consultantRun.status = 'Private publish handoff ready'; save();
  download(pack.packId + '-campaign-pack.json', JSON.stringify(pack, null, 2), 'application/json'); download(pack.packId + '-publish-instructions.md', publishInstructions(pack), 'text/markdown'); showToast('Private publish handoff prepared for ' + pack.production.publication.route); render();
}

function evidenceCards() {
  const evidence = state.consultantRun.research.evidence || [];
  return evidence.length ? evidence.map((item) => '<article class="evidence-card"><span class="evidence-status status-' + slugify(item.status) + '">' + esc(item.status) + '</span><h4>' + esc(item.title) + '</h4><p>' + esc(item.detail) + '</p><small>' + esc(item.source || 'No source supplied') + (item.date ? ' · ' + item.date : '') + '</small></article>').join('') : '<div class="empty-note">Prepare a research plan after choosing a research mode.</div>';
}
function conceptCards() {
  return (state.consultantRun.concepts || []).map((concept, index) => '<article class="concept-card ' + (state.consultantRun.selectedConcept === concept.id ? 'selected' : '') + '"><div class="concept-index">0' + (index + 1) + '</div><div class="concept-main"><span class="eyebrow">' + esc(concept.title) + '</span><h3>' + esc(concept.idea) + '</h3><div class="concept-grid"><div><strong>For</strong><p>' + esc(concept.audience) + '</p></div><div><strong>Problem</strong><p>' + esc(concept.problem) + '</p></div><div><strong>Message</strong><p>' + esc(concept.message) + '</p></div><div><strong>Why it might work</strong><p>' + esc(concept.why) + '</p></div><div><strong>Proof required</strong><p>' + esc(concept.proofRequirements.join('; ')) + '</p></div><div><strong>Risk</strong><p>' + esc(concept.risks.join('; ')) + '</p></div></div><div class="concept-footer"><span>' + esc(concept.channels.join(' · ')) + '</span><button class="button button-secondary button-small" data-action="choose-concept" data-concept="' + esc(concept.id) + '">' + (state.consultantRun.selectedConcept === concept.id ? 'Selected' : 'Choose direction') + '</button></div></div></article>').join('');
}
function comparisonHtml() {
  const rounds = comparisonRounds(); if (!rounds.length) return '';
  const next = rounds.find((round) => !preferenceFor(round.id));
  if (!next) return '<div class="ranking"><p class="eyebrow">Preference result</p><h3>Your current ranking</h3>' + rankedConcepts().map((item, index) => '<div class="rank-row"><b>' + (index + 1) + '</b><strong>' + esc(item.concept.title) + '</strong><span>' + item.score + ' points</span><button class="button button-secondary button-small" data-action="choose-concept" data-concept="' + esc(item.concept.id) + '">Select</button></div>').join('') + '</div>';
  return '<div class="comparison"><div class="comparison-meta">Decision ' + (rounds.indexOf(next) + 1) + ' of ' + rounds.length + '</div><h3>' + esc(next.prompt) + '</h3><div class="comparison-options"><button class="comparison-option" data-action="preference" data-round="' + next.id + '" data-choice="A"><span>A</span><strong>' + esc(next.left.label) + '</strong><p>' + esc(next.left.text) + '</p></button><button class="comparison-option" data-action="preference" data-round="' + next.id + '" data-choice="B"><span>B</span><strong>' + esc(next.right.label) + '</strong><p>' + esc(next.right.text) + '</p></button></div><div class="comparison-links"><button class="text-action" data-action="preference" data-round="' + next.id + '" data-choice="combine">Combine them</button><button class="text-action" data-action="preference" data-round="' + next.id + '" data-choice="rewrite">Rewrite this round</button><button class="text-action" data-action="preference" data-round="' + next.id + '" data-choice="none">Neither</button></div></div>';
}

function renderConsult() {
  const questions = questionMap.map(([path, label, hint]) => '<div class="consult-question">' + area(path, label, hint, 'Write a short answer or choose “I don’t know”.') + '<button class="text-action" data-action="unknown" data-path="' + path + '">I don’t know</button></div>').join('');
  return '<section class="screen consult-screen"><div class="screen-hero"><span class="eyebrow">CAMPAIGN COPILOT / 01</span><h1>Start with the decision.<br>We’ll shape the campaign.</h1><p>Five short answers are enough to create a useful campaign hypothesis. The Copilot labels inference, keeps research bounded and hands your chosen direction into one editable brief.</p><div class="hero-actions"><button class="button button-primary" data-action="build-proposal">Build my proposal <span>→</span></button><button class="button button-secondary" data-action="seed-9604">Start with the 9604 example</button></div></div><div class="panel"><div class="panel-heading"><div><span class="eyebrow">01 · High-level consult</span><h2>Tell us what matters.</h2><p>Answer in rough notes. “I don’t know” is valid and will be shown as an inference in the next step.</p></div><span class="panel-note">No duplication later</span></div><div class="consult-grid">' + questions + '</div></div><div class="panel compact-panel">' + brandChoices() + '</div></section>';
}
function renderPropose() {
  const run = state.consultantRun, concepts = run.concepts || [], research = run.research || {};
  return '<section class="screen"><div class="screen-heading"><div><span class="eyebrow">02 · Proposal</span><h1>Choose a campaign spine.</h1><p>The Copilot separates the strategic idea from brand positioning, then shows the evidence and decisions behind each direction.</p></div><button class="button button-secondary" data-action="regenerate">' + (concepts.length ? 'Regenerate directions' : 'Generate directions') + '</button></div><div class="proposal-layout"><div class="proposal-main"><div class="panel research-control"><div><span class="eyebrow">Research control</span><h2>How much checking should I do?</h2><p>Research questions are prepared before evidence is reviewed so the scan stays tied to the campaign decision.</p></div>' + selectFieldRun('research.mode', 'Research mode', ['Quick scan', 'No research', 'Evidence pack']) + '<button class="button button-secondary button-small" data-action="prepare-research">Prepare questions</button><span class="inline-status">' + esc(research.status || 'Not prepared') + '</span><div class="question-list">' + (research.questions || []).map((question, index) => '<span><b>Q' + (index + 1) + '</b>' + esc(question) + '</span>').join('') + '</div><div class="evidence-grid">' + evidenceCards() + '</div></div><div class="panel"><div class="panel-heading"><div><span class="eyebrow">Campaign directions</span><h2>Three different ways in.</h2><p>Each card includes message, audience problem, proof needs, risk, route and visual direction.</p></div></div><div class="concept-list">' + (concepts.length ? conceptCards() : '<div class="empty-note">Build the proposal from Consult to see three directions.</div>') + '</div></div>' + (concepts.length ? '<div class="panel compare-panel"><div class="panel-heading"><div><span class="eyebrow">Preference rounds</span><h2>Make only the decisions that help.</h2><p>Choose, combine, rewrite or reject. The Copilot stops after four bounded comparisons.</p></div><span class="panel-note">' + run.preferenceEvents.length + ' / ' + comparisonRounds().length + '</span></div>' + comparisonHtml() + '</div>' : '') + '</div><aside class="proposal-aside"><div class="panel sticky-panel"><span class="eyebrow">Your inputs</span><h3>' + esc(state.campaignCore.intent.offer || 'Offer not supplied') + '</h3><p>' + esc(state.campaignCore.intent.commercialOutcome || 'Commercial outcome not supplied') + '</p><div class="aside-list"><span><b>Audience</b>' + esc(state.campaignCore.audience.primary || 'Not supplied') + '</span><span><b>Market</b>' + esc(state.campaignCore.intent.market || 'Not supplied') + '</span><span><b>Brand branches</b>' + esc(selectedBrandNames().join(', ') || 'Choose a branch') + '</span></div><button class="button button-primary button-wide" data-action="to-refine" ' + (concepts.length ? '' : 'disabled') + '>Refine this brief <span>→</span></button></div></aside></div></section>';
}
function selectFieldRun(path, label, options) {
  const current = getRun(path) || '';
  return '<div class="field compact-field"><label>' + esc(label) + '</label><select data-run-bind="' + path + '">' + options.map((option) => '<option value="' + esc(option) + '"' + (option === current ? ' selected' : '') + '>' + esc(option) + '</option>').join('') + '</select></div>';
}
function renderRefine() {
  const core = state.campaignCore, formats = derivedFormats(core.activation.channels, core.activation.formats);
  return '<section class="screen"><div class="screen-heading"><div><span class="eyebrow">03 · Editable brief</span><h1>Shape the digital brief.</h1><p>Everything here is pre-populated from the consult and selected direction. Edit the decision once; downstream assets derive from it.</p></div><span class="ready-tag">' + readiness().score + '% ready</span></div><div class="refine-grid"><div class="refine-main"><details class="brief-section" open><summary><span>01</span><strong>Intent and audience</strong><small>Who, why now and what must change.</small></summary><div class="field-grid">' + field('name', 'Campaign name', 'A useful working title.', 'e.g. Coverage Beyond the Grid') + field('intent.offer', 'Offer or change', '', 'Product, service or behaviour') + selectField('intent.outcomeType', 'Outcome type', LIBRARIES.commercialObjectiveTypes, 'One primary commercial direction.') + field('intent.owner', 'Owner', '', 'Who will carry the brief?') + area('intent.commercialOutcome', 'Commercial outcome', 'Write the business result in one sentence.', 'What will be different commercially?') + area('intent.trigger', 'Why now / trigger', 'The moment or tension that makes this relevant.', 'What has changed or is at risk?') + area('audience.primary', 'Primary audience', 'The audience that must decide or act first.', 'Who is this for?') + area('audience.problem', 'Audience problem', 'The job, friction or consequence the campaign must make visible.', 'What problem are they trying to solve?') + field('intent.market', 'Market or operating context', '', 'Country, region, vertical or environment') + field('audience.geography', 'Geography', '', 'Where does the audience operate?') + checkboxSet('audience.roles', 'Decision roles', LIBRARIES.roles, 'Select all roles that influence the decision.', 'audience.rolesOther') + checkboxSet('audience.verticals', 'Primary verticals', LIBRARIES.verticals, 'Select the contexts where this campaign is relevant.', 'audience.verticalsOther') + '</div></details><details class="brief-section" open><summary><span>02</span><strong>Proposition and route</strong><small>What they should believe and do next.</small></summary><div class="field-grid">' + area('proposition.promise', 'Core promise', 'The single message the campaign should carry.', 'What should the audience believe?') + area('proposition.supporting', 'Supporting message', 'Explain the mechanism, value or boundary.', 'What makes the promise credible?') + area('proposition.proof', 'Proof available', 'List evidence, sources or proof still required.', 'What can we substantiate?') + selectField('proposition.claimsStatus', 'Claims status', ['Confirmed and qualified', 'Needs evidence review', 'Inferred; approval required', 'Unknown']) + field('proposition.cta', 'Call to action', '', 'What should they do next?') + field('proposition.destination', 'Destination', 'URL, form or route; can remain unresolved.', 'https://… or describe the route') + area('conversionRoute.route', 'Conversion route', 'The shortest path from problem to qualified action.', 'Problem → proof → offer → action') + '</div></details><details class="brief-section" open><summary><span>03</span><strong>Activation and measurement</strong><small>Where the idea travels and how success is known.</small></summary><div class="field-grid">' + checkboxSet('activation.channels', 'Priority channels', ['LinkedIn organic', 'LinkedIn document', 'Email nurture', 'Landing page', 'Paid search', 'Retargeting', 'Sales follow-up', 'Partner outreach'], 'Choose only channels that can change the decision.') + '<div class="derived-output"><span class="eyebrow">Derived production formats</span><strong>' + esc(formats.join(' · ') || 'Choose a channel to derive formats') + '</strong><p>Formats are calculated from channels so production metadata is never entered twice.</p></div>' + field('activation.startDate', 'Start date', '', '', 'date') + field('activation.endDate', 'End date', '', '', 'date') + selectField('measurement.primaryKpi', 'Primary KPI', LIBRARIES.kpis, 'One measure that matters most.') + checkboxSet('measurement.supportingKpis', 'Supporting KPIs', LIBRARIES.kpis.filter((item) => item !== core.measurement.primaryKpi).slice(0, 8), 'Choose up to three; the rest stay out of the brief.') + field('measurement.target', 'Target or value', '', 'Optional target') + field('measurement.event', 'Conversion event', '', 'What counts as success?') + field('measurement.source', 'Measurement source', '', 'CRM, analytics, platform or owner') + '</div></details><details class="brief-section"><summary><span>04</span><strong>Guardrails and brand</strong><small>Evidence, approvals and independent branches.</small></summary><div class="field-grid">' + area('guardrails.sources', 'Sources and evidence', '', 'Links, documents or approved references') + area('guardrails.rights', 'Rights and constraints', '', 'Image, logo, customer, partner or legal constraints') + area('guardrails.assumptions', 'Assumptions', '', 'What remains inferred or unresolved?') + area('guardrails.exclusions', 'Exclusions', '', 'What must the campaign avoid promising?') + brandChoices() + area('brand.handoff', 'Approval owner or handoff', '', 'Who reviews the branches and claims?') + '</div></details><details class="brief-section advanced-section"><summary><span>05</span><strong>More detail when needed</strong><small>Production guidance appears only when it helps.</small></summary><div class="field-grid">' + area('audience.objections', 'Known objections', '', 'What could make this unconvincing?') + area('advanced.creative', 'Creative direction', '', 'What should the visual world feel like?') + area('advanced.imagery', 'Imagery notes', '', 'What can and cannot be shown?') + area('advanced.motion', 'Motion notes', '', 'Optional motion or video requirement') + area('advanced.nurture', 'Nurture and handoff', '', 'Response owner, sequence or SLA') + field('advanced.budget', 'Budget', '', 'Optional planning input') + '</div></details></div><aside class="refine-aside"><div class="panel sticky-panel"><span class="eyebrow">Live brief</span><h3>' + esc(core.name || 'Untitled campaign') + '</h3><p>' + esc(core.proposition.promise || 'Add a promise to see the campaign spine.') + '</p><div class="aside-list"><span><b>Route</b>' + esc(core.conversionRoute.route || 'Not supplied') + '</span><span><b>Channels</b>' + esc(core.activation.channels.join(', ') || 'Not supplied') + '</span><span><b>Outputs</b>' + esc(formats.join(', ') || 'Derived after channel choice') + '</span></div><button class="button button-primary button-wide" data-action="to-review">Review and sign off <span>→</span></button></div></aside></div></section>';
}
function renderReview() {
  const core = state.campaignCore, ready = readiness(), approvals = core.approvals || {}, pack = state.consultantRun.pack;
  const approvalItems = [['strategy', 'I approve the campaign strategy and selected direction.'], ['claims', 'I have reviewed the proof, claims status and evidence gaps.'], ['brand', 'I confirm the brand and market branches are correct and independent.'], ['destination', 'I confirm the destination, form route and owner.'], ['rights', 'I have reviewed rights, constraints and required legal approvals.'], ['generation', 'I accept the generation scope and private-review status.']];
  return '<section class="screen"><div class="screen-heading"><div><span class="eyebrow">04 · Review and sign-off</span><h1>Approve before production.</h1><p>This is the final strategic checkpoint. Generated fields stay visible with their provenance, and unresolved items are explicit.</p></div><span class="ready-tag ' + (ready.score >= 75 ? 'ready' : '') + '">' + ready.score + '% ready</span></div><div class="review-grid"><div class="review-main"><div class="panel review-summary"><div class="summary-header"><div><span class="eyebrow">Campaign summary</span><h2>' + esc(core.name || 'Untitled campaign') + '</h2></div><span class="source-badge">Canonical campaignCore</span></div><div class="summary-section"><h3>Decision</h3><p class="summary-lead">' + esc(core.proposition.promise || 'Promise not supplied') + '</p><dl><div><dt>Commercial outcome</dt><dd>' + esc(core.intent.commercialOutcome || 'Missing') + '</dd></div><div><dt>Offer</dt><dd>' + esc(core.intent.offer || 'Missing') + '</dd></div><div><dt>Route</dt><dd>' + esc(core.conversionRoute.route || 'Missing') + '</dd></div></dl></div><div class="summary-section"><h3>Audience</h3><p>' + esc(core.audience.primary || 'Missing') + '</p><p class="muted">' + esc(cleanPhrase(core.audience.problem) || 'Audience problem not supplied') + '.</p></div><div class="summary-section"><h3>Proposition and proof</h3><p>' + esc(core.proposition.supporting || 'Supporting message not supplied') + '</p><p class="evidence-line"><strong>' + esc(core.proposition.claimsStatus) + '</strong> · ' + esc(core.proposition.proof || 'Proof is still required') + '</p></div><div class="summary-section"><h3>Activation and measurement</h3><p>' + esc(core.activation.channels.join(' · ') || 'Channels not selected') + '</p><dl><div><dt>Primary KPI</dt><dd>' + esc(core.measurement.primaryKpi || 'Missing') + '</dd></div><div><dt>Conversion event</dt><dd>' + esc(core.measurement.event || 'Missing') + '</dd></div></dl></div><div class="summary-section"><h3>Independent branches</h3><div class="branch-pills">' + selectedBrandNames().map((name) => '<span>' + esc(name) + '</span>').join('') + '</div><p class="muted">One approved logo per artwork. Brand plugins are applied after the generic campaign spine is approved.</p></div><div class="summary-section"><h3>Open items</h3>' + (ready.missing.concat(ready.warnings).map((item) => '<p class="open-item">• ' + esc(item) + '</p>').join('') || '<p class="good-item">No blocking brief gaps detected.</p>') + '</div></div><div class="panel signoff-panel"><span class="eyebrow">Human sign-off</span><h2>Ready to generate?</h2><p>Tick each statement that has been reviewed. Generation remains disabled until all gates are acknowledged.</p><div class="approval-list">' + approvalItems.map(([key, label]) => '<label><input type="checkbox" data-approval="' + key + '"' + (approvals[key] ? ' checked' : '') + '><span>' + esc(label) + '</span></label>').join('') + '</div><button class="button button-primary button-wide" data-action="generate-pack" ' + (ready.score < 75 || !approvalItems.every(([key]) => approvals[key]) ? 'disabled' : '') + '>Generate campaign pack <span>→</span></button><button class="button button-secondary button-wide" data-action="export-pack">Download current pack</button>' + (pack ? '<div class="generated-callout"><strong>Pack generated</strong><span>' + esc(pack.summary.files + ' production files · ' + pack.status) + '</span><button class="button button-primary button-wide" data-action="publish-pack">Publish private review to /campaigns/</button></div>' : '') + '</div></div></section>';
}
function renderRail() {
  const ready = readiness();
  return '<div class="progress-head"><span class="eyebrow">CAMPAIGN COPILOT</span><span>' + (currentStep + 1) + ' / ' + STEPS.length + '</span></div><div class="rail-steps">' + STEPS.map((step, index) => '<button class="rail-step ' + (index === currentStep ? 'active' : '') + ' ' + (index < currentStep ? 'done' : '') + '" data-action="step" data-step="' + index + '"><span>' + String(index + 1).padStart(2, '0') + '</span><strong>' + esc(step.label) + '</strong><small>' + esc(step.title) + '</small></button>').join('') + '</div><div class="rail-card"><span class="eyebrow">CURRENT BRIEF</span><strong>' + esc(state.campaignCore.name || 'Untitled campaign') + '</strong><span>' + ready.score + '% ready · ' + esc(selectedBrandNames().join(', ') || 'No branch selected') + '</span></div>';
}
function render() {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, currentStep)); sessionStorage.setItem('m2m-campaign-copilot-step', String(currentStep));
  const stepHtml = currentStep === 0 ? renderConsult() : currentStep === 1 ? renderPropose() : currentStep === 2 ? renderRefine() : renderReview();
  appRoot.innerHTML = '<div class="copilot-frame"><aside class="copilot-rail">' + renderRail() + '<button class="button button-quiet rail-reset" data-action="reset">Reset local draft</button></aside><main class="copilot-main">' + stepHtml + '</main></div>';
}
function allApprovals() { const approvals = state.campaignCore.approvals || {}; return ['strategy', 'claims', 'brand', 'destination', 'rights', 'generation'].every((key) => approvals[key]); }

appRoot.addEventListener('input', (event) => {
  const element = event.target;
  if (element.dataset.bind) { setPath(element.dataset.bind, element.value); markProvenance([element.dataset.bind], 'Edited'); if (element.dataset.bind === 'name' && !state.campaignCore.slug) state.campaignCore.slug = slugify(element.value); save(); updateChrome(); }
  if (element.dataset.runBind) { setRun(element.dataset.runBind, element.value); save(); }
});
appRoot.addEventListener('change', (event) => {
  const element = event.target;
  if (element.dataset.check) {
    let values = [...appRoot.querySelectorAll('[data-check="' + element.dataset.check + '"]:checked')].map((item) => item.value);
    if (element.dataset.check === 'measurement.supportingKpis' && values.length > 3) { values = values.slice(0, 3); showToast('Choose up to three supporting KPIs'); }
    setPath(element.dataset.check, values);
    if (element.dataset.check === 'activation.channels') state.campaignCore.activation.formats = derivedFormats(values, []);
    save(); render();
  }
  if (element.dataset.brand) { state.campaignCore.brand.plugins = [...appRoot.querySelectorAll('[data-brand]:checked')].map((item) => item.dataset.brand); save(); render(); }
  if (element.dataset.approval) { state.campaignCore.approvals = state.campaignCore.approvals || {}; state.campaignCore.approvals[element.dataset.approval] = element.checked; save(); render(); }
});
appRoot.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const action = button.dataset.action;
  if (action === 'unknown') { setPath(button.dataset.path, 'I don’t know'); markProvenance([button.dataset.path], 'Inferred'); save(); render(); return; }
  if (action === 'build-proposal') { generateConcepts(); currentStep = 1; save(); render(); return; }
  if (action === 'regenerate') { generateConcepts(); save(); render(); showToast('A new set of directions is ready'); return; }
  if (action === 'prepare-research') { buildResearchPlan(); save(); render(); showToast('Research questions prepared'); return; }
  if (action === 'choose-concept') { state.consultantRun.selectedConcept = button.dataset.concept; state.consultantRun.status = 'Direction selected'; save(); render(); return; }
  if (action === 'preference') { const round = comparisonRounds().find((item) => item.id === button.dataset.round); if (round) { const choice = button.dataset.choice, ids = choice === 'A' ? [round.left.conceptId] : choice === 'B' ? [round.right.conceptId] : choice === 'combine' ? [round.left.conceptId, round.right.conceptId] : []; state.consultantRun.preferenceEvents = state.consultantRun.preferenceEvents.filter((item) => item.roundId !== round.id).concat([{ roundId: round.id, prompt: round.prompt, choice, conceptIds: ids, timestamp: new Date().toISOString() }]); save(); render(); } return; }
  if (action === 'to-refine') { const selected = state.consultantRun.selectedConcept || rankedConcepts()[0]?.concept.id, concept = state.consultantRun.concepts.find((item) => item.id === selected); if (concept) applyConcept(concept); currentStep = 2; save(); render(); return; }
  if (action === 'to-review') { currentStep = 3; save(); render(); return; }
  if (action === 'step') { const target = Number(button.dataset.step); if (target <= currentStep || (target === currentStep + 1 && (target !== 1 || state.consultantRun.concepts.length))) { currentStep = target; render(); } return; }
  if (action === 'generate-pack') { if (!allApprovals() || readiness().score < 75) return; generatePack(); currentStep = 3; render(); return; }
  if (action === 'export-pack') { exportPack(); return; }
  if (action === 'publish-pack') { publishPack(); return; }
  if (action === 'seed-9604') { state = normalise(seed9604()); currentStep = 0; save(); render(); showToast('9604 example loaded into the Copilot'); return; }
  if (action === 'reset') { if (!window.confirm('Reset this local campaign draft?')) return; state = blankState(); currentStep = 0; localStorage.removeItem(STORAGE_KEY); save(); render(); showToast('Draft reset'); }
});
document.querySelector('#fixtureTopBtn')?.addEventListener('click', () => {
  state = normalise(seed9604());
  currentStep = 0;
  save();
  render();
  showToast('9604 example loaded into the Copilot');
});
function updateChrome() { const score = document.querySelector('.ready-tag'); if (score) score.textContent = readiness().score + '% ready'; }
render();
