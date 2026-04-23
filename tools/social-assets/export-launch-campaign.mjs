import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const htmlPath = path.resolve(root, 'social-assets/launch-campaign/index.html');
const outDir = path.resolve(root, 'social-assets/launch-campaign/exports');
await fs.mkdir(outDir, { recursive: true });

const url = `file://${htmlPath}`;
const browser = await chromium.launch({ headless: true, executablePath: '/home/node/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome' });

const jobs = [
  { name: 'post-01-launch-day', selector: '#posts .asset-pair:nth-of-type(1) .linkedin-card', width: 1080, height: 1080 },
  { name: 'post-02-day-3', selector: '#posts .asset-pair:nth-of-type(2) .linkedin-card', width: 1080, height: 1080 },
  { name: 'post-03-day-7', selector: '#posts .asset-pair:nth-of-type(3) .linkedin-card', width: 1080, height: 1080 },
  { name: 'post-04-day-10', selector: '#posts .asset-pair:nth-of-type(4) .linkedin-card', width: 1080, height: 1080 },
  { name: 'post-05-day-14', selector: '#posts .asset-pair:nth-of-type(5) .linkedin-card', width: 1080, height: 1080 },
  { name: 'ad-a-problem-first', selector: '#ads .asset-pair:nth-of-type(1) .ad-card', width: 1200, height: 628 },
  { name: 'ad-b-outcome-first', selector: '#ads .asset-pair:nth-of-type(2) .ad-card', width: 1200, height: 628 },
  { name: 'ad-c-guarantee', selector: '#ads .asset-pair:nth-of-type(3) .ad-card', width: 1200, height: 628 },
  { name: 'onepager-operating-audit', selector: '#onepager .onepager', width: 1240, height: 1754 },
];

for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: Math.max(job.width + 200, 1400), height: Math.max(job.height + 200, 1400) },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const locator = page.locator(job.selector).first();
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({
    path: path.join(outDir, `${job.name}.png`),
  });
  await page.close();
}

await browser.close();
console.log(`Exported ${jobs.length} PNGs to ${outDir}`);
