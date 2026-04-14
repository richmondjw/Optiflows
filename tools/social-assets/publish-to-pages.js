import fs from 'node:fs/promises';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
if (!args.input) {
  console.error('Usage: node tools/social-assets/publish-to-pages.js --input <manifest.json> [--target social-assets/your-folder]');
  process.exit(1);
}

const rootDir = process.cwd();
const absInput = path.resolve(rootDir, args.input);
const manifest = JSON.parse(await fs.readFile(absInput, 'utf8'));
const inputDir = path.dirname(absInput);
const targetDir = path.resolve(rootDir, args.target || defaultTargetDir(manifest));

await fs.mkdir(targetDir, { recursive: true });

const copied = [];
for (const file of collectFiles(manifest)) {
  const source = path.resolve(inputDir, file);
  const destination = path.join(targetDir, path.basename(file));
  await fs.copyFile(source, destination);
  copied.push(path.relative(rootDir, destination));
}

const publicBaseUrl = inferPublicBaseUrl(args.target || defaultTargetDir(manifest));
const publishManifest = {
  publishedAt: new Date().toISOString(),
  sourceManifest: path.relative(rootDir, absInput),
  publicBaseUrl,
  files: copied,
};

await fs.writeFile(path.join(targetDir, 'publish-manifest.json'), JSON.stringify(publishManifest, null, 2));
console.log(JSON.stringify(publishManifest, null, 2));

function collectFiles(input) {
  const files = new Set();
  if (Array.isArray(input.outputs)) {
    for (const entry of input.outputs) {
      if (entry?.file) files.add(entry.file);
    }
  }
  if (input.pdf) files.add(input.pdf);
  if (input.previewHtml) files.add(input.previewHtml);
  if (input.exportHtml) files.add(input.exportHtml);
  files.add('manifest.json');
  return [...files];
}

function defaultTargetDir(input) {
  return `social-assets/${input.outputBaseName || 'run'}`;
}

function inferPublicBaseUrl(target) {
  const normalized = String(target).replace(/^\/+|\/+$/g, '');
  const base = process.env.OPTIFLOWS_SITE_BASE_URL || 'https://www.optiflows.com.au';
  return `${base.replace(/\/$/, '')}/${normalized}`;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--input') out.input = argv[++i];
    if (token === '--target') out.target = argv[++i];
  }
  return out;
}
