import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname);
const output = resolve(root, 'assets/exports/linkedin');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/usr/local/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 627 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(root, 'render-linkedin-assets.html')).href);
await page.evaluate(() => document.fonts.ready);
for (const id of ['post-01', 'post-04']) {
  await page.locator(`[data-id="${id}"]`).screenshot({ path: resolve(output, `${id}-1200x627.png`) });
}
await browser.close();
