import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=resolve(import.meta.dirname); const out=resolve(root,'assets/exports'); await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/local/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await page.goto(pathToFileURL(resolve(root,'render-assets.html')).href); await page.evaluate(()=>document.fonts.ready);
for(const id of ['post-01','post-02','post-03','post-04']){const el=page.locator(`[data-id="${id}"]`);await el.screenshot({path:resolve(out,`${id}-1080x1350.png`)});}
await browser.close();
