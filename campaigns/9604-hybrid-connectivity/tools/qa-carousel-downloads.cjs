const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require('\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright');
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});const results=[];
const base=process.env.CAMPAIGN_RENDER_URL||'http://127.0.0.1:48771';
fs.mkdirSync(path.join(root,'tmp'),{recursive:true});
try{for(const width of [1440,390,320]){
const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(base+'/#carousels',{waitUntil:'networkidle'});
await page.locator('#carousels').scrollIntoViewIfNeeded();
const articles=await page.locator('.carousel-set').all();assert.strictEqual(articles.length,5);
for(const article of articles){
for(const label of ['M2M One','M2M Connectivity']){
const button=article.getByRole('button',{name:label,exact:true});await button.click();
assert.strictEqual(await button.getAttribute('aria-pressed'),'true');
assert.strictEqual(await article.locator('.brand-chooser button[aria-pressed="true"]').count(),1);
const images=await article.locator('.slide-rail img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),alt:i.alt})));
assert.strictEqual(images.length,5);
for(const [i,img] of images.entries()){
assert.strictEqual(img.src.includes('/m2m-one/'),label==='M2M One','Brand preview did not switch');
assert(img.alt.startsWith(`${label}, slide ${i+1}:`),'Wrong preview label');
assert(fs.existsSync(path.join(root,img.src.split('?')[0])),'Preview asset missing');
}
}
assert.strictEqual(await article.getByRole('link',{name:'M2M Connectivity kit ZIP ↓',exact:true}).count(),1);
assert.strictEqual(await article.getByRole('link',{name:'M2M One kit ZIP ↓',exact:true}).count(),1);
}
await articles[0].getByRole('button',{name:'M2M One',exact:true}).click();
await page.locator('.carousel-set').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,`tmp/carousel-gallery-${width}.png`)});
const links=await page.locator('a[download]').evaluateAll(a=>a.map(i=>i.getAttribute('href')));
assert(!links.some(l=>l.includes('co-branded')),'Superseded brand download remains');
assert.strictEqual(links.filter(l=>l.endsWith('-m2m-one-carousel-kit.zip')).length,5);
assert.strictEqual(links.filter(l=>l.endsWith('-m2m-connectivity-carousel-kit.zip')).length,5);
assert.strictEqual(links.filter(l=>l.endsWith('-m2m-one-linkedin-document.pdf')).length,5);
const missing=links.filter(l=>!fs.existsSync(path.join(root,l.split('?')[0])));
results.push({width,brandToggles:10,independentBrandKits:10,downloadLinks:links.length,missing,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});await page.close();
}}finally{await browser.close()}
fs.writeFileSync(path.join(root,'tmp/carousel-download-qa.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(r=>r.missing.length||r.overflow))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
