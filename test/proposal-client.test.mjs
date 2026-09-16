import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import teamwear from '../workers/proposal-contract.json' with {type:'json'};
import calliope from '../workers/proposal-contract-calliope.json' with {type:'json'};
function harness(response,contract){
  const source=fs.readFileSync(new URL('..'+contract.path+'approval.js',import.meta.url),'utf8');
  const nodes=new Map(), events={}, stored=new Map(), requests=[];
  const ctx={setTransform(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},drawImage(){},save(){},restore(){},clearRect(){}};
  function node(id){if(!nodes.has(id))nodes.set(id,{hidden:false,value:'',checked:false,textContent:'',classList:{add(){},remove(){},toggle(){}},listeners:{},addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);},getBoundingClientRect(){return {width:520,height:200,left:0,top:0};},getContext(){return ctx;},setPointerCapture(){},scrollIntoView(){},toDataURL(){return 'data:image/png;base64,iVBORw0KGgoAAAA';}});return nodes.get(id);}
  node('consentLabel').textContent=contract.consent;node('proposalContent').textContent=contract.proposal_text;
  const location={origin:'https://optiflows.com.au',pathname:contract.path,href:'https://optiflows.com.au'+contract.path,hash:''};
  const sandbox={crypto,Date,URL,setTimeout,clearTimeout,Image:function(){},localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)},location,
    history:{replaceState(a,b,url){location.href=url;}},document:{getElementById:node,querySelector:()=>node('consentLabel'),querySelectorAll:()=>[],createElement:()=>node('offscreen'),body:node('body')},
    window:{devicePixelRatio:1,addEventListener(type,fn){events[type]=fn;},print(){}},fetch:async(url,options)=>{const payload=JSON.parse(options.body);requests.push({url,payload});return response(payload);}};
  vm.runInNewContext(source,sandbox);
  async function submit(){node('name').value='Synthetic signer';node('role').value='Test';node('consent').checked=true;
    for(const fn of node('sigpad').listeners.pointerdown)fn({preventDefault(){},clientX:5,clientY:5,pointerId:1});
    node('approvalForm').listeners.submit[0]({preventDefault(){}});await new Promise(setImmediate);await new Promise(setImmediate);}
  return {submit,node,requests,stored,location};
}
for(const contract of [teamwear,calliope]){
let h=harness(p=>({ok:true,json:async()=>({accepted:true,stored:true,record:{...p,approved_at:'2026-09-16T08:00:00Z'},record_url:'https://optiflows.com.au'+contract.path+'#record='+p.record_id+'.'+'a'.repeat(64)})}),contract);
await h.submit();assert.equal(h.requests[0].url,'/api/proposal-approvals');assert.equal(h.requests[0].payload.consent_accepted,true);assert.equal(h.node('approvalForm').hidden,true);assert.equal(h.stored.size,1);assert.match(h.location.href,/#record=/);
assert.equal(h.requests[0].payload.fee_aud_ex_gst,contract.fee_aud_ex_gst);assert.equal(h.requests[0].payload.proposal_id,contract.proposal_id);
for(const response of [{ok:false,status:503},{ok:true,json:async()=>({stored:false})}]){
  h=harness(()=>response,contract);await h.submit();assert.equal(h.node('approvalForm').hidden,false);assert.equal(h.stored.size,0);assert.equal(h.node('submitBtn').disabled,false);assert.match(h.node('msg').textContent,/could not be sent/);
}
}
console.log('PASS: both browser submit contracts, stored acknowledgement, server timestamp, private URL and failure recovery');
