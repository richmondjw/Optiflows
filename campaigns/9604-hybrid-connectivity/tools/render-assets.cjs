#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const playwrightPath = process.platform === 'win32'
  ? '\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright'
  : '/home/james/openclaw/workspace/Optiflows-homepage-deploy/node_modules/playwright';
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, '..');
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'campaign-data.js'), 'utf8') + '\n;globalThis.__CAMPAIGN = CAMPAIGN;', context);
const campaign = context.__CAMPAIGN;
const baseUrl = process.env.CAMPAIGN_RENDER_URL || 'http://127.0.0.1:8765';
const browserPath = process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : '/home/james/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome';

const jobs = [];
for (const week of campaign.weeks) {
  for (const [format, width, height] of [
    ['wide', 1600, 900],
    ['feed', 1080, 1350],
    ['square', 1080, 1080],
    ['story', 1080, 1920]
  ]) {
    jobs.push({
      url: `/render.html?type=social&id=${week.id}&format=${format}`,
      output: `assets/exports/${week.id}-${format}.webp`, width, height
    });
  }
}
for (const carousel of campaign.carousels) {
  for (const variant of ['', 'm2m-one']) carousel.slides.forEach((_, i) => jobs.push({
    url: `/render.html?type=carousel&id=${carousel.id}&slide=${i + 1}${variant ? '&brand=m2m-one' : ''}`,
    output: `assets/carousels/${variant ? variant + '/' : ''}${carousel.id}-${String(i + 1).padStart(2, '0')}.webp`,
    width: 1080, height: 1350
  }));
}
for (const email of campaign.emails) jobs.push({
  url: `/render.html?type=email&id=${email.id}`,
  output: `assets/email/${email.id}-email.webp`, width: 1200, height: 900
});
for (const study of campaign.website) jobs.push({
  url: `/render.html?type=website&id=${study.id}`,
  output: `assets/website/${study.id}-website.webp`, width: 1600, height: 900
});

const scope = process.env.RENDER_SCOPE || 'all';
const selectedSlides = process.env.RENDER_SLIDES?.split(',');
const jobsToRun = (scope === 'all' ? jobs : jobs.filter(job => job.output.startsWith(`assets/${scope}/`))).filter(job => !selectedSlides || selectedSlides.includes(new URL(job.url, baseUrl).searchParams.get('slide')));

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  let count = 0;
  try {
    for (const job of jobsToRun) {
      const output = path.join(root, job.output);
      const temp = output.replace(/\.webp$/, '.render.png');
      fs.mkdirSync(path.dirname(output), { recursive: true });
      await page.setViewportSize({ width: job.width, height: job.height });
      await page.goto(baseUrl + job.url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
      await page.screenshot({ path: temp, type: 'png', animations: 'disabled' });
      const conversion = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', temp, '-c:v', 'libwebp', '-quality', '90', output], { encoding: 'utf8' });
      if (conversion.status !== 0) throw new Error(`ffmpeg failed for ${job.output}: ${conversion.stderr || conversion.stdout}`);
      fs.unlinkSync(temp);
      count += 1;
      if (count % 10 === 0 || count === jobsToRun.length) process.stdout.write(`rendered ${count}/${jobsToRun.length}\n`);
    }
  } finally {
    await browser.close();
  }
  process.stdout.write(`complete ${jobsToRun.length} assets\n`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
