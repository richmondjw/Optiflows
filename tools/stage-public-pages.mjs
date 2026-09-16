import {cp, mkdir, readdir, rm} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';

const source = resolve(process.argv[2] || '.');
const destination = resolve(process.argv[3] || '.pages-public');

const excluded = new Set([
  '.git', '.github', '.claude', '.agents',
  'admin', 'campaign-brief', 'crm', 'education', 'output', 'prototypes',
  'reports', 'proposals', '776bc', 'team', 'test', 'tools', 'workers',
  'growth.html', 'gate.js',
  'social-assets',
  'guides/peninsula-insider/docs',
  'guides/peninsula-insider/reports',
  'guides/peninsula-insider/next',
  'm2m/report', 'm2m/reports'
]);

const isExcluded = path => {
  const value = relative(source, path).replaceAll('\\', '/');
  return [...excluded].some(item => value === item || value.startsWith(`${item}/`));
};

await rm(destination, {recursive: true, force: true});
await mkdir(destination, {recursive: true});

for (const entry of await readdir(source)) {
  const from = join(source, entry);
  if (isExcluded(from)) continue;
  await cp(from, join(destination, entry), {recursive: true, force: true});
}

console.log(`Staged public Pages output at ${destination}`);
