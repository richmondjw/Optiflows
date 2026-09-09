const fs=require('fs'),vm=require('vm'),{execFileSync}=require('child_process'),assert=require('assert');
const parse=raw=>{const c={};vm.runInNewContext(raw+';this.d=CAMPAIGN',c);return JSON.parse(JSON.stringify(c.d));};
const old=parse(execFileSync('git',['show','b17f3efe7413b5f1bebe0a1b0cdf3121b2e5af6f:campaigns/9604-hybrid-connectivity/campaign-data.js'],{encoding:'utf8'}));
const current=parse(fs.readFileSync(require('path').join(__dirname,'../campaign-data.js'),'utf8'));
for(const key of Object.keys(old))if(key!=='carousels')assert.deepStrictEqual(current[key],old[key],key);
old.carousels.forEach((c,i)=>assert.deepStrictEqual(current.carousels[i].technicalNotes,c.slides,c.id));
console.log('PASS: other channel data unchanged; original carousel engineering notes preserved.');
