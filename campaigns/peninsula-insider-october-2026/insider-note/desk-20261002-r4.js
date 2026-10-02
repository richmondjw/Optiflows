'use strict';
const $=id=>document.getElementById(id);
const BRIDGE='http://127.0.0.1:8792';
let resizePreview=()=>{};
let socials=[];let issues=[],manifest=null,active=0,variant=0,token=null,approval=null,revokePending=Promise.resolve();
const local=location.origin===BRIDGE;
function status(text){$('action-status').textContent=text;}
async function api(path,data){
 const r=await fetch(BRIDGE+path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const j=await r.json();if(!r.ok)throw Error(j.error||'The local email desk could not complete this request.');return j;
}
function clearApproval(){const old=approval;approval=null;$('approve').checked=false;$('push').disabled=true;$('draft-link').hidden=true;if(old&&token)revokePending=revokePending.then(()=>api('/api/revoke',{sha256:old.sha256})).catch(()=>{token=null;$('approve').disabled=true;status('Reconnect the local desk before recording a new approval.');});}
async function digest(){
 const payload=await fetch(manifest.issues[active].payload).then(r=>r.json());
 payload.email_settings.email_subject_line=issues[active].variants[variant][0];payload.email_settings.email_preview_text=issues[active].variants[variant][1];
 // Server canonicalizes the same payload. Ask it for the authoritative revision before recording approval.
 const version=await api('/api/version',{id:issues[active].id,variant,base_sha256:manifest.issues[active].sha256});return version.sha256;
}
function loadFrame(){
 const m=manifest.issues[active],importing=$('import-mode').checked;
 $('email-frame').src=importing?m.beehiiv_html:m.email;
 $('layout-note').textContent=importing?'Single-column import with inline styles. This is the exact body sent to beehiiv, which removes stylesheets.':'The established Insider Note layout. Switch to the import view to review beehiiv’s stylesheet-free version.';
 $('download').href=importing?m.beehiiv_html:m.email;
 $('text-export').href=m.email.replace('.html','.txt');$('payload-export').href=m.payload;
 clearApproval();status('');
 $('approve').disabled=!token||!importing;
}
function choose(i){
 active=i;variant=0;const d=issues[i];
 document.querySelectorAll('.week').forEach((b,n)=>b.setAttribute('aria-pressed',String(i===n)));
 $('week-title').textContent=d.title;$('context').textContent=d.context;
 $('steps').replaceChildren(...d.plan_steps.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
 for(const [id,kind] of [['whats-on','What’s on'],['whats-new','What’s new']])$(''+id).textContent=d.picks.find(p=>p.kind===kind).headline;
 $('editorial').textContent=d.editorial.headline;$('game-plug').textContent=d.rail[2][2];
 $('checks').replaceChildren(...d.checks.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
 $('subject-choice').replaceChildren(...d.variants.map((v,n)=>{const o=document.createElement('option');o.value=n;o.textContent=v[0];return o;}));
 $('preheader').textContent=d.variants[0][1];loadFrame();
 renderSocial(d.id);history.replaceState(null,'','#'+d.id);
}
async function connected(){
 try{const j=await api('/api/status');$('connection-note').textContent='Connected to '+j.publication+'. Review the import layout, then approve an unscheduled draft.';$('connect').textContent='beehiiv connected';$('approve').disabled=!$('import-mode').checked;}
 catch(e){token=null;$('approve').disabled=true;status(e instanceof TypeError?'Could not reach the local email desk. Start the Windows launcher, allow this page’s local-access request, then reconnect. You can also open the local desk directly.':e.message);}
}
$('connect').addEventListener('click',()=>{
 const w=window.open(BRIDGE+'/connect?origin='+encodeURIComponent(location.origin),'pi-beehiiv-connect','width=520,height=480');
 if(!w){status('Allow the connection window, then try again.');return;}
 status('Connect in the local email desk window. If it is not running, start the installed launcher.');
});
window.addEventListener('message',event=>{if(event.origin!==BRIDGE||event.data?.type!=='pi-beehiiv-connected'||typeof event.data.token!=='string')return;token=event.data.token;connected();});
$('approve').addEventListener('change',async()=>{
 if(!$('approve').checked){clearApproval();status('Draft approval cleared.');return;}
 $('push').disabled=true;
 try{await revokePending;const hash=await digest();approval=await api('/api/approve',{id:issues[active].id,variant,sha256:hash});$('push').disabled=false;status('This exact version is approved for draft transfer only.');}
 catch(e){clearApproval();status(e.message);}
});
$('push').addEventListener('click',async()=>{
 if(!approval)return;$('push').disabled=true;status('Creating the draft and checking beehiiv’s response…');
 try{const j=await api('/api/push',{id:issues[active].id,variant,sha256:approval.sha256});
  if(j.state==='draft'){status(j.reused?'The existing beehiiv draft is ready. No duplicate was created.':'Draft created and read back in beehiiv. It has not been scheduled or sent.');$('draft-link').href=j.preview_url;$('draft-link').hidden=false;}
  else if(j.state==='body_verification_pending'){status('The draft is saved, but its full body differs from the approved version. Open it in beehiiv and reconcile the content before any send.');$('draft-link').href=j.preview_url;$('draft-link').hidden=false;}
  else{status('beehiiv is still processing the saved draft. Choose Push again to check the same post.');$('push').disabled=false;}
 }catch(e){status(e.message);$('push').disabled=false;}
});
$('subject-choice').addEventListener('change',()=>{variant=Number($('subject-choice').value);$('preheader').textContent=issues[active].variants[variant][1];clearApproval();status('Subject changed. Review and approve this version again.');});
$('import-mode').addEventListener('change',loadFrame);
for(const [id,isMobile] of [['desktop',false],['mobile',true]])$(id).addEventListener('click',()=>{document.querySelector('.frame-stage').classList.toggle('mobile',isMobile);$('desktop').setAttribute('aria-pressed',String(!isMobile));$('mobile').setAttribute('aria-pressed',String(isMobile));requestAnimationFrame(resizePreview);});
$('email-frame').addEventListener('load',()=>{
 try{const doc=$('email-frame').contentDocument;if(doc){doc.querySelectorAll('a').forEach(a=>{a.target='_blank';a.rel='noopener';});const size=resizePreview=()=>{$('email-frame').style.height='100px';$('email-frame').style.height=(doc.documentElement.scrollHeight+6)+'px';};size();doc.fonts?.ready.then(size);doc.querySelectorAll('img').forEach(im=>im.addEventListener('load',size));}}
 catch(e){status('Open the downloaded HTML to inspect this preview.');}
});
window.addEventListener('resize',()=>requestAnimationFrame(resizePreview));
async function start(){
 try{[issues,manifest,socials]=await Promise.all([fetch('sources/issues-20261002-r3.json').then(r=>r.json()),fetch('manifest-20261002-r3.json').then(r=>r.json()),fetch('social-manifest.json').then(r=>r.json()).then(j=>j.tiles)]);
  $('weeks').replaceChildren(...issues.map((d,i)=>{const b=document.createElement('button');b.type='button';b.className='week';const date=document.createElement('span');date.textContent='Wednesday '+Number(d.id.slice(-2))+' October';const title=document.createElement('strong');title.textContent=d.title;b.append(date,title);b.addEventListener('click',()=>choose(i));return b;}));
  const id=location.hash.slice(1);choose(Math.max(0,issues.findIndex(d=>d.id===id)));
  if(local){token=(await api('/api/session')).token;await connected();}
 }catch(e){$('week-title').textContent='The previews could not load';$('context').textContent='Reload this page, or open the downloadable email files.';status(e.message);}
}
start();

function renderSocial(id){$('social-tiles').replaceChildren(...socials.filter(t=>t.week===id).map(t=>{const a=document.createElement('article'),im=document.createElement('img'),h=document.createElement('h3'),links=document.createElement('div');im.src=t.file;im.alt=t.alt;im.width=1080;im.height=1350;im.loading='lazy';h.textContent=t.title;for(const [label,href] of [['Download tile',t.file],['Editable layout',t.source],['Draft caption',t.caption]]){const link=document.createElement('a');link.textContent=label;link.href=href;if(label!=='Editable layout')link.download='';else{link.target='_blank';link.rel='noopener';}links.append(link);}a.append(im,h,links);return a;}));}
