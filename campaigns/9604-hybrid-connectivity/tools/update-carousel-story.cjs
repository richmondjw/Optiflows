const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'campaign-data.js');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const raw = fs.readFileSync(source, 'utf8');
const sandbox = {};
vm.runInNewContext(raw + ';globalThis.data=CAMPAIGN', sandbox);
for (const item of sandbox.data.carousels) {
  const story = input.carousels.find(c => c.id === item.id);
  if (!story || story.slides.length !== 5) throw new Error('Missing five-card story: ' + item.id);
  item.technicalNotes = item.technicalNotes || item.slides;
  item.title = story.title;
  item.master = `carousel-${item.id}-human.jpg`;
  item.storyAccent = story.accent;
  item.illustrative = 'Generated illustrative person and setting; not a customer case study or testimonial.';
  item.slides = story.slides.map(({ headline, body, cta }) => ({ headline, body, ...(cta ? { cta } : {}) }));
}
const start = raw.indexOf('  carousels: [');
const end = raw.indexOf('  emails: [', start);
if (start < 0 || end < 0) throw new Error('Source boundaries not found');
fs.writeFileSync(source, raw.slice(0, start) + '  carousels: ' + JSON.stringify(sandbox.data.carousels, null, 2).replace(/\n/g, '\n  ') + ',\n\n' + raw.slice(end));
fs.writeFileSync(path.join(root, 'carousel-story-direction.json'), JSON.stringify(input, null, 2) + '\n');
console.log('Updated 25 carousel cards; retained original technical notes and all other channel records.');
