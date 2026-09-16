import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist-private');

const privatePaths = [
  '776bc',
  'admin',
  'app.js',
  'base.css',
  'brand-mark.svg',
  'campaign-brief',
  'crm',
  'design',
  'favicon.svg',
  'growth.html',
  'homepage-rebuild.css',
  'homepage-rebuild.js',
  'lead-capture.js',
  'm2m',
  'proposals',
  'prototypes',
  'reports',
  'site-navigation.css',
  'site-navigation.js',
  'social-assets',
  'style.css',
  'team',
  'v4/index.html',
  'v4/v4.css'
];

async function copyPath(path) {
  const source = join(root, path);
  const destination = join(output, path);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of privatePaths) await copyPath(path);
await copyPath('images');

for (const path of await walk(output)) {
  if (extname(path).toLowerCase() !== '.html') continue;
  const source = await readFile(path, 'utf8');
  const clean = source.replace(
    /<script\s+src=["'][^"']*gate\.js["']\s*><\/script>/gi,
    ''
  );
  await writeFile(path, clean);
}

const forbidden = /(?:SITE_PASS|GATE_HASH)\s*[:=]/;
for (const path of await walk(output)) {
  if (!['.html', '.js', '.mjs', '.json'].includes(extname(path).toLowerCase())) continue;
  if (forbidden.test(await readFile(path, 'utf8'))) {
    throw new Error(`Client-side access secret remains in ${relative(output, path)}`);
  }
}

console.log(`Built protected-content artifact at ${relative(root, output)}`);
