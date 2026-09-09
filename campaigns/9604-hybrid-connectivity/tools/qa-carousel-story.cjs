const fs=require('fs'),path=require('path'),vm=require('vm');
const {chromium}=require('\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright');
const root=path.resolve(__dirname,'..'),ctx={};
vm.runInNewContext(fs.readFileSync(path.join(root,'campaign-data.js'),'utf8')+';this.data=CAMPAIGN',ctx);
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
const page=await browser.newPage({viewport:{width:1080,height:1350}}),results=[];
try{for(const item of ctx.data.carousels)for(const group of [false,true])for(let n=1;n<=5;n++){
await page.goto(`http://127.0.0.1:48771/render.html?type=carousel&id=${item.id}&slide=${n}${group?'&brand=group':''}`,{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
const check=await page.evaluate(({n,group})=>{
const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
const copy=rect('.car-copy'),photo=rect('.story-photo'),brand=rect('.brand'),step=rect('.story-step');
const issues=[];const logos=[...document.querySelectorAll('.brand img')];
if(logos.length!==(group?2:1))issues.push('logo count');
if([...document.images].some(i=>!i.complete||!i.naturalWidth))issues.push('unloaded image');
if(brand.right>step.x)issues.push('logo/progress overlap');
if(n<3&&copy.bottom>photo.y-12)issues.push('opening copy/photo crowding');
if(n>=3&&copy.bottom>1060)issues.push('copy/route crowding');
if(copy.right>1080||copy.bottom>1350)issues.push('copy overflow');
if(logos.some(i=>Math.abs(i.width/i.height-i.naturalWidth/i.naturalHeight)>.04))issues.push('logo distortion');
if(group&&document.querySelector('.one-logo').width>326)issues.push('M2M One upscale');
return {copy,photo,brand,step,issues,logoCount:logos.length};
},{n,group});results.push({id:item.id,group,slide:n,...check});
} }finally{await browser.close()}
fs.mkdirSync(path.join(root,'tmp'),{recursive:true});fs.writeFileSync(path.join(root,'tmp/carousel-layout-qa.json'),JSON.stringify(results,null,2));
const failures=results.filter(r=>r.issues.length);console.log(JSON.stringify({checked:results.length,failures},null,2));process.exitCode=failures.length?1:0;
})().catch(e=>{console.error(e);process.exit(1)});
