const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'campaign-brief');
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'plugins.js', 'libraries.js', 'README.md', 'fixtures/9604-hybrid-connectivity.json', 'assets/m2m-connectivity-logo.svg', 'assets/m2m-one-logo.png'];
const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Missing campaign brief files: ${missing.join(', ')}`);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const libraries = fs.readFileSync(path.join(root, 'libraries.js'), 'utf8');
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/9604-hybrid-connectivity.json'), 'utf8'));
const checks = [
  ['noindex metadata', /noindex,nofollow,noarchive/.test(html)],
  ['eight stages', (app.match(/\['foundation'|\['audience'|\['objectives'|\['proposition'|\['strategy'|\['production'|\['governance'|\['branches'/g) || []).length === 8],
  ['pack schema', app.includes("m2m-campaign-pack/v1")],
  ['brand plugin registry', Object.keys(fixture.branches).length === 2 && app.includes("from './plugins.js'") && fs.readFileSync(path.join(root, 'plugins.js'), 'utf8').includes('semtech')],
  ['independent artwork rule', app.includes('one approved logo per artwork')],
  ['Higgsfield handoff', app.includes('higgsfieldJobs') && app.includes('text-free masters')],
  ['9604 route', fixture.route.includes('readiness guide') && fixture.promise.includes('Satellite')],
  ['curated Vault library', app.includes("from './libraries.js'") && libraries.includes('LIBRARY_META') && libraries.includes('audiences')],
  ['assisted suggestions', app.includes('generateSuggestions') && app.includes('recommendStrategy') && app.includes('data-action')],
  ['consultant front door', html.includes('consultantView') && app.includes('CONSULTANT_QUESTIONS') && app.includes('handoffConsultant')],
  ['comparison rounds', app.includes('comparisonRounds') && app.includes('recordPreference') && app.includes('data-consultant-choice')],
  ['research modes', app.includes('Evidence pack') && app.includes('buildResearchPlan') && app.includes('Requires approval')],
  ['structured consultant export', app.includes('consultantRun') && app.includes('preferenceEvents') && app.includes('assistance')]
];
const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) throw new Error(`Campaign brief QA failed: ${failed.join(', ')}`);
console.log(`Campaign brief QA passed (${checks.length} checks, ${requiredFiles.length} files).`);
