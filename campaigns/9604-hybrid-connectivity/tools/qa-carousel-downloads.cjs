const fs=require('fs'),path=require('path');
const {chromium}=require('\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright');
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});const results=[];
try{for(const width of [1440,390,320]){
const page=await browser.newPage({viewport:{width,height:1000}});await page.goto('http://127.0.0.1:48771/#carousels',{waitUntil:'networkidle'});
await page.locator('#carousels').scrollIntoViewIfNeeded();
for(const article of await page.locator('.carousel-set').all()){
await article.getByRole('button',{name:'M2M Connectivity + M2M One',exact:true}).click();
const images=await article.locator('.slide-rail img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
if(images.some(s=>!s.includes('/co-branded/')))throw new Error('Brand preview did not switch');
}
await page.locator('.carousel-set').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,`tmp/carousel-gallery-${width}.png`)});
const links=await page.locator('a[download]').evaluateAll(a=>a.map(i=>i.getAttribute('href')));
const missing=links.filter(l=>!fs.existsSync(path.join(root,l.split('?')[0])));
results.push({width,brandToggles:5,downloadLinks:links.length,missing,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});await page.close();
}}finally{await browser.close()}
fs.writeFileSync(path.join(root,'tmp/carousel-download-qa.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(r=>r.missing.length||r.overflow))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
