import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { renderCarouselHtml } from './templates/carousel.js';

const args = parseArgs(process.argv.slice(2));
const inputPath = args.input || 'tools/social-assets/examples/optiflows-carousel.json';
const outputDir = args.output || 'tools/social-assets/output/run';

const rootDir = process.cwd();
const absInput = path.resolve(rootDir, inputPath);
const absOutput = path.resolve(rootDir, outputDir);
const templatesDir = path.resolve(rootDir, 'tools/social-assets/templates');
const brandsDir = path.resolve(rootDir, 'tools/social-assets/brands');

const payload = JSON.parse(await fs.readFile(absInput, 'utf8'));
const brand = JSON.parse(await fs.readFile(path.join(brandsDir, `${payload.brand}.json`), 'utf8'));
await fs.mkdir(absOutput, { recursive: true });
await fs.copyFile(path.join(templatesDir, 'base.css'), path.join(absOutput, 'base.css'));

const previewHtml = renderCarouselHtml(payload, brand, { mode: 'preview' });
const exportHtml = renderCarouselHtml(payload, brand, { mode: 'export' });
const previewPath = path.join(absOutput, 'index.html');
const exportPath = path.join(absOutput, 'export.html');
await fs.writeFile(previewPath, previewHtml, 'utf8');
await fs.writeFile(exportPath, exportHtml, 'utf8');

const baseName = payload.output?.baseName || slugify(payload.title || 'asset-pack');
const manifest = {
  title: payload.title,
  brand: payload.brand,
  generatedAt: new Date().toISOString(),
  input: inputPath,
  outputBaseName: baseName,
  outputs: [],
  previewHtml: 'index.html',
  exportHtml: 'export.html',
  renderStatus: 'html-ready',
  notes: [],
};

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: {
      width: payload.size?.width || 1080,
      height: payload.size?.height || 1350,
    },
    deviceScaleFactor: 1,
  });

  await page.goto(`file://${previewPath}`, { waitUntil: 'networkidle' });

  for (let i = 0; i < payload.slides.length; i += 1) {
    const filename = `${baseName}-slide-${String(i + 1).padStart(2, '0')}.png`;
    const outputPath = path.join(absOutput, filename);
    const locator = page.locator(`[data-slide="${i + 1}"]`);
    await locator.screenshot({ path: outputPath });
    manifest.outputs.push({
      slide: i + 1,
      variant: payload.slides[i].variant,
      file: filename,
    });
  }

  const pdfPage = await browser.newPage({
    viewport: {
      width: payload.size?.width || 1080,
      height: payload.size?.height || 1350,
    },
    deviceScaleFactor: 1,
  });
  await pdfPage.goto(`file://${exportPath}`, { waitUntil: 'networkidle' });
  const pdfName = `${baseName}.pdf`;
  await pdfPage.pdf({
    path: path.join(absOutput, pdfName),
    width: `${payload.size?.width || 1080}px`,
    height: `${payload.size?.height || 1350}px`,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  });

  manifest.renderStatus = 'rendered';
  manifest.pdf = pdfName;
  manifest.notes.push('PNG and PDF rendering completed successfully.');
} catch (error) {
  manifest.renderStatus = 'html-ready';
  manifest.notes.push(`Render fallback: ${error.message}`);
} finally {
  if (browser) await browser.close();
}

await fs.writeFile(path.join(absOutput, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Prepared asset preview at ${absOutput}`);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--input') out.input = argv[++i];
    if (token === '--output') out.output = argv[++i];
  }
  return out;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
