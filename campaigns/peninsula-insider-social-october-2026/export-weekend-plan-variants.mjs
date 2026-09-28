import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=resolve(import.meta.dirname); const out=resolve(root,'assets/exports/weekend-plan'); await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/local/bin/chromium',args:['--no-sandbox']});
for(const [id,file,width,height] of [['instagram','pi-weekend-plan-instagram-feed-1080x1350.png',1080,1350],['story','pi-weekend-plan-instagram-story-1080x1920.png',1080,1920],['facebook','pi-weekend-plan-facebook-feed-1200x1500.png',1200,1500],['linkedin','pi-weekend-plan-linkedin-1200x627.png',1200,627]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const url=pathToFileURL(resolve(root,'render-weekend-plan-variants.html')); url.searchParams.set('id',id);
  await page.goto(url.href); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(150);
  await page.locator(`[data-id="${id}"]`).screenshot({path:resolve(out,file)}); await page.close();
}
await browser.close();
