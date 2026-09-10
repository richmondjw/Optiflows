const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {chromium}=require('\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright');
const root=path.resolve(__dirname,'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'campaign-data.js'),'utf8')+';this.data=CAMPAIGN',ctx);
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
const page=await browser.newPage({viewport:{width:1080,height:1350}}),results=[],sharedLayouts=new Map();
const base=process.env.CAMPAIGN_RENDER_URL||'http://127.0.0.1:48771';
try{for(const item of ctx.data.carousels)for(const one of [false,true])for(let n=1;n<=5;n++){
await page.goto(`${base}/render.html?type=carousel&id=${item.id}&slide=${n}${one?'&brand=m2m-one':''}`,{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
const check=await page.evaluate(({n,one})=>{
const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
const copy=rect('.car-copy'),photo=rect('.story-photo'),brand=rect('.brand'),step=rect('.story-step');
const issues=[];const logos=[...document.querySelectorAll('.brand img')];
const label=one?'M2M One':'M2M Connectivity';
const source=one?'assets/brand/m2m-one-logo.png':'assets/brand/m2m-connectivity-logo.svg';
if(logos.length!==1)issues.push('expected exactly one logo');
if(logos.some(i=>i.getAttribute('src')!==source||i.alt!==label))issues.push('wrong brand logo');
if(document.querySelector('.story-signature').textContent!==`${label} · Hybrid IoT`)issues.push('wrong brand signature');
if([...document.images].some(i=>!i.complete||!i.naturalWidth))issues.push('unloaded image');
if(brand.right>step.x)issues.push('logo/progress overlap');
if(n<3&&copy.bottom>photo.y-12)issues.push('opening copy/photo crowding');
if(n>=3&&copy.bottom>1060)issues.push('copy/route crowding');
if(copy.right>1080||copy.bottom>1350)issues.push('copy overflow');
if(logos.some(i=>Math.abs(i.width/i.height-i.naturalWidth/i.naturalHeight)>.04))issues.push('logo distortion');
if(one&&logos.some(i=>i.width>326||i.height>80))issues.push('M2M One upscale');
const shared={copy,photo,step,copyText:document.querySelector('.car-copy').textContent,photoSource:document.querySelector('.story-photo img').getAttribute('src'),route:document.querySelector('.story-route').outerHTML,topic:document.querySelector('.story-topic').textContent,next:document.querySelector('.story-next').textContent};
return {copy,photo,brand,step,issues,logoCount:logos.length,logoSource:source,signature:document.querySelector('.story-signature').textContent,shared};
},{n,one});
const key=item.id+'-'+n;
if(one)assert.deepStrictEqual(check.shared,sharedLayouts.get(key),'Brand versions changed shared copy, photography or geometry: '+key);
else sharedLayouts.set(key,check.shared);
delete check.shared;results.push({id:item.id,brand:one?'M2M One':'M2M Connectivity',slide:n,...check});
} }finally{await browser.close()}
assert.strictEqual(results.length,50);assert.strictEqual(sharedLayouts.size,25);
fs.mkdirSync(path.join(root,'tmp'),{recursive:true});fs.writeFileSync(path.join(root,'tmp/carousel-layout-qa.json'),JSON.stringify(results,null,2));
const failures=results.filter(r=>r.issues.length);console.log(JSON.stringify({checked:results.length,failures},null,2));process.exitCode=failures.length?1:0;
})().catch(e=>{console.error(e);process.exit(1)});
