import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist-public');

const publicPaths = [
  '.nojekyll',
  '404.html',
  'CNAME',
  'app.js',
  'base.css',
  'blog',
  'brand-mark.svg',
  'favicon.svg',
  'homepage-rebuild.css',
  'homepage-rebuild.js',
  'index.html',
  'lead-capture.js',
  'robots.txt',
  'site-navigation.css',
  'site-navigation.js',
  'sitemap.xml',
  'style.css',
  'v4/services.html',
  'v4/v4.css'
];

const publicImageExtensions = new Set([
  '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp', '.woff', '.woff2'
]);

async function copyPath(path) {
  const source = join(root, path);
  const destination = join(output, path);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function copyPublicImages(sourceDir = join(root, 'images')) {
  const { readdir } = await import('node:fs/promises');
  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    const source = join(sourceDir, entry.name);
    if (entry.isDirectory()) {
      await copyPublicImages(source);
      continue;
    }
    const extension = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase();
    if (!publicImageExtensions.has(extension)) continue;
    const destination = join(output, relative(root, source));
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of publicPaths) await copyPath(path);
await copyPublicImages();

const forbidden = [
  '776bc', 'admin', 'campaign-brief', 'campaigns', 'crm', 'design', 'gate.js',
  'growth.html', 'm2m', 'proposals', 'prototypes', 'reports', 'social-assets', 'team', 'workers'
];
for (const path of forbidden) {
  try {
    await stat(join(output, path));
    throw new Error(`Private path leaked into public artifact: ${path}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const html = await readFile(join(output, 'index.html'), 'utf8');
if (!html.includes('OptiFlows') && !html.includes('Optiflows')) {
  throw new Error('Public homepage validation failed');
}

console.log(`Built default-private Pages artifact at ${relative(root, output)}`);
