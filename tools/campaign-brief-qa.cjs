const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'campaign-brief');
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'pack-builder.js', 'plugins.js', 'libraries.js', 'README.md', 'fixtures/9604-hybrid-connectivity.json', 'assets/m2m-connectivity-logo.svg', 'assets/m2m-one-logo.png'];
const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Missing campaign brief files: ${missing.join(', ')}`);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const libraries = fs.readFileSync(path.join(root, 'libraries.js'), 'utf8');
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/9604-hybrid-connectivity.json'), 'utf8'));
const checks = [
  ['noindex metadata', /noindex,nofollow,noarchive/.test(html)],
  ['copilot schema', app.includes("m2m-campaign-copilot-v2") && app.includes("m2m-campaign-copilot/v2")],
  ['four-step flow', app.includes("Consult") && app.includes("Propose") && app.includes("Refine") && app.includes("Review") && app.includes("const STEPS")],
  ['brand plugin registry', Object.keys(fixture.branches).length === 2 && app.includes("from './plugins.js'") && fs.readFileSync(path.join(root, 'plugins.js'), 'utf8').includes('semtech')],
  ['independent artwork rule', app.includes('one approved logo per artwork')],
  ['Higgsfield handoff', app.includes('higgsfieldJobs') && app.includes('text-free masters')],
  ['9604 route', fixture.route.includes('readiness guide') && fixture.promise.includes('Satellite')],
  ['curated Vault library', app.includes("from './libraries.js'") && libraries.includes('LIBRARY_META') && libraries.includes('audiences')],
  ['assisted proposal', app.includes('generateConcepts') && app.includes('conceptTemplates') && app.includes('data-action="build-proposal"')],
  ['consultant front door', html.includes('appRoot') && app.includes('questionMap') && app.includes('build-proposal')],
  ['comparison rounds', app.includes('comparisonRounds') && app.includes('data-action="preference"')],
  ['research modes', app.includes('Evidence pack') && app.includes('buildResearchPlan') && app.includes('Requires approval')],
  ['structured consultant export', app.includes('consultantRun') && app.includes('preferenceEvents') && app.includes('campaignCore')],
  ['complete production adapter', app.includes("from './pack-builder.js") && app.includes('buildCampaignPack') && fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('m2m-campaign-production/v1')],
  ['complete channel assets', fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('landing-pages/') && fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('social-assets.json') && fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('email-sequence.json') && fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('campaign-calendar.csv')],
  ['text-free creative masters', fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('text-free-master.svg') && fs.readFileSync(path.join(root, 'pack-builder.js'), 'utf8').includes('no embedded copy')],
  ['regeneration variants', app.includes('consultantRun.generation') && app.includes('boundaryIdeas') && app.includes('conceptTemplates(inputs, generation)')],
  ['canonical brief adapter', app.includes('function toLegacyBrief') && app.includes('derivedFormats') && app.includes('approvals')],
  ['campaigns publisher', fs.existsSync(path.join(__dirname, 'publish-campaign-pack.cjs')) && fs.readFileSync(path.join(__dirname, 'publish-campaign-pack.cjs'), 'utf8').includes("published-private-review") && fs.readFileSync(path.join(__dirname, 'publish-campaign-pack.cjs'), 'utf8').includes('asset-manifest.json')]
];
const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) throw new Error(`Campaign brief QA failed: ${failed.join(', ')}`);
console.log(`Campaign brief QA passed (${checks.length} checks, ${requiredFiles.length} files).`);
