'use strict';

const byId = id => document.getElementById(id);
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const urls = new Map();
let campaign, postsById, active, revision = 0;
const dateLabel = day => new Intl.DateTimeFormat('en-AU', {weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,11,day)));

function goTo(id) {
  const target = byId(id);
  target.scrollIntoView({block:'start'});
  target.focus({preventScroll:true});
}
for (const anchor of document.querySelectorAll('a[href^="#"]')) {
  anchor.addEventListener('click', event => { event.preventDefault(); goTo(anchor.getAttribute('href').slice(1)); });
}
function lines(parent, copy) {
  for (const part of copy.split(/\n\s*\n/).filter(Boolean)) {
    const p=el('p',part);
    if (/^(Illustration:|Pictured:|Photo[: ])/i.test(part)) p.className='credit';
    parent.append(p);
  }
}
function external(label,url) {
  const a=el('a',label);
  a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
  return a;
}
function pausePlayers(container) {
  for (const v of container.querySelectorAll('video')) v.pause();
}
function mediaView() {
  const name=active.files[revision];
  if (name.endsWith('.mp4')) {
    const video=el('video');
    video.controls=true; video.playsInline=true; video.muted=true; video.preload='metadata';
    video.setAttribute('aria-label',active.title+' – silent nine-second Reel');
    video.poster=urls.get('reel-still.png');
    video.src=urls.get(name);
    const track=el('track');
    track.kind='captions'; track.label='Visual descriptions'; track.srclang='en'; track.src=urls.get(campaign.track);
    video.append(track);
    return video;
  }
  const img=el('img');
  img.src=urls.get(name); img.alt=campaign.alt[name]; img.decoding='async';
  if (name==='story-2.png') {
    const wrap=el('div',undefined,'story-wrapper');
    const link=external('Choose a market route',postsById[active.post].guide);
    link.className='sticker'; link.setAttribute('aria-label','Preview link sticker: Choose a market route');
    wrap.append(img,link); return wrap;
  }
  return img;
}
function variants(target) {
  target.replaceChildren();
  if (active.files.length<2) return;
  active.labels.forEach((label,i) => {
    const btn=el('button',label);
    btn.type='button'; btn.setAttribute('aria-pressed',String(i===revision));
    btn.addEventListener('click',() => {
      revision=i; renderArtwork();
      const replacement=target.children[i];
      if(replacement) replacement.focus({preventScroll:true});
    });
    target.append(btn);
  });
}
function renderArtwork() {
  const post=postsById[active.post];
  const name=active.files[revision];
  byId('asset-format').textContent=active.format+' · '+dateLabel(post.day);
  byId('asset-title').textContent=active.title;
  byId('asset-guide').href=post.guide;
  byId('asset-guide').textContent=active.id==='gallery'?'Open exhibition guide':active.id==='tile'?'Open event guide':'Open PI guide';
  byId('caption').replaceChildren();
  if (post.frames) {
    lines(byId('caption'),post.frames[revision]);
    const c=el('p','Illustration: Peninsula Insider','credit'); byId('caption').append(c);
  } else lines(byId('caption'),post.copy);
  byId('description').open=false;
  byId('description').querySelector('summary').textContent=name.endsWith('.mp4')?'Video description and transcript':'Image description';
  const box=byId('description-text'); box.replaceChildren();
  if (name.endsWith('.mp4')) {
    const blocks=campaign.transcript.split(/\n\s*\n/).slice(1);
    for (const block of blocks) {
      const [timing,...words]=block.split('\n'); const p=el('p');
      p.append(el('strong',timing.slice(3,8)+' '),document.createTextNode(words.join(' '))); box.append(p);
    }
  } else lines(box,campaign.alt[name]);
  const primary=byId('primary-media'); pausePlayers(primary); primary.replaceChildren(mediaView());
  variants(byId('variants'));
  for (const b of byId('tray').children) b.setAttribute('aria-pressed',String(b.dataset.id===active.id));
  byId('asset-live').textContent=active.title+', '+active.labels[revision];
  if (byId('enlarged').open) renderLarge();
}
function showSet(id) {
  active=campaign.sets.find(x => x.id===id);
  revision=0; renderArtwork();
}
function renderLarge() {
  const box=byId('large-media'); pausePlayers(box); box.replaceChildren(mediaView());
  const credit=byId('large-credit');
  credit.hidden=active.id!=='facebook-market';
  if(!credit.hidden) credit.textContent='Mornington Farmers Market, Mornington Peninsula. Photo: Robert Blackburn, courtesy of Visit Victoria';
  byId('large-title').textContent=active.title+' · '+active.labels[revision];
  variants(byId('large-controls'));
}
byId('expand').addEventListener('click',() => {
  pausePlayers(byId('primary-media')); renderLarge();
  byId('enlarged').showModal(); byId('close').focus();
});
byId('close').addEventListener('click',()=>byId('enlarged').close());
byId('enlarged').addEventListener('close',()=>{pausePlayers(byId('large-media'));byId('large-media').replaceChildren();});

function format(post) {
  if(post.frames) return 'Story';
  if(post.channel==='Facebook') return post.format.includes('preview')?'Link post':'Graphic';
  if(post.channel==='LinkedIn') return post.format.includes('graphic')?'Graphic':'Link post';
  return post.format;
}
function renderDay() {
  const day=Number(byId('date').value);
  const posts=campaign.posts.filter(p=>p.day===day);
  const list=byId('post-list'); list.replaceChildren();
  for (const post of posts) {
    const article=el('article',undefined,'post');
    const meta=el('div',post.channel+' · '+format(post)+' · '+post.time+' AEDT','post-meta');
    article.append(meta,el('h3',post.title));
    const body=el('div',undefined,'post-body');
    if(post.frames) {
      post.frames.forEach((frame,i)=>{const p=el('p');p.append(el('strong','Frame '+(i+1)),document.createTextNode(frame));body.append(p);});
      const p=el('p');p.append(el('strong','Link sticker'),document.createTextNode(post.sticker));body.append(p);
    } else lines(body,post.copy);
    article.append(body);
    const links=el('div',undefined,'post-links');
    if(post.art) {
      const button=el('button','View artwork');button.type='button';
      button.addEventListener('click',()=>{showSet(post.art);goTo('artwork');});
      links.append(button);
    }
    links.append(external('Open PI guide',post.guide));article.append(links);
    list.append(article);
  }
  byId('date-live').textContent=dateLabel(day)+', '+posts.length+' posts';
}
function showContent(data,bytes) {
  campaign=data;
  for(const [name,file] of Object.entries(data.files)) {
    urls.set(name,URL.createObjectURL(new Blob([bytes.subarray(file.start,file.start+file.size)],{type:file.type})));
  }
  postsById=Object.fromEntries(data.posts.map(p=>[p.id,p]));
  const tray=byId('tray');tray.replaceChildren();
  data.sets.forEach(set=>{
    const button=el('button',undefined,'asset-tab');button.type='button';button.dataset.id=set.id;
    const img=el('img');img.src=urls.get(set.thumb);img.alt='';
    button.append(img,el('span',set.short));
    button.addEventListener('click',()=>showSet(set.id));tray.append(button);
  });
  const date=byId('date');date.replaceChildren();
  data.days.forEach((title,i)=>{const option=el('option',dateLabel(i+1)+' · '+title);option.value=String(i+1);date.add(option);});
  date.addEventListener('change',renderDay);
  showSet('reel');renderDay();
  byId('entry').hidden=true;byId('campaign').hidden=false;byId('navigation').hidden=false;
}
const sessionKey='pi-december-2026-preview';
function tokenFrom(text) {
  const value=text.trim();
  if (/^[\w-]{43}$/.test(value)) return value;
  try { return new URLSearchParams(new URL(value,location.href).hash.slice(1)).get('k')||''; }
  catch { return ''; }
}
function entry(message) {byId('entry-state').textContent=message;byId('unlock').hidden=false;}
async function unlock(token,fromForm) {
  if (!/^[\w-]{43}$/.test(token)) {entry('Open the private link supplied with the campaign, or paste it below.');return;}
  byId('unlock').hidden=true;byId('entry-state').textContent='Opening the campaign gallery…';
  try {
    const decoded=Uint8Array.from(atob(token.replace(/-/g,'+').replace(/_/g,'/')+'='),c=>c.charCodeAt(0));
    const key=await crypto.subtle.importKey('raw',decoded,'AES-GCM',false,['decrypt']);
    const resp=await fetch('./december.bin',{credentials:'omit',referrerPolicy:'no-referrer'});
    if (!resp.ok) throw new Error('fetch');
    const packet=new Uint8Array(await resp.arrayBuffer());
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:packet.subarray(0,12)},key,packet.subarray(12));
    const size=new DataView(plain).getUint32(0);
    const data=JSON.parse(new TextDecoder().decode(new Uint8Array(plain,4,size)));
    showContent(data,new Uint8Array(plain,4+size));
    try {sessionStorage.setItem(sessionKey,token);}catch{}
    if (fromForm) history.replaceState(null,'','#k='+token);
    byId('access-link').value='';
  } catch (err) {
    if(err.name==='OperationError') entry('This link could not unlock the campaign. Paste the complete private review link.');
    else entry('The gallery could not load. Reopen the private review link or try again below.');
  }
}
byId('unlock').addEventListener('submit',e=>{e.preventDefault();unlock(tokenFrom(byId('access-link').value),true);});
const supplied=tokenFrom(location.href);
let saved='';
try {saved=sessionStorage.getItem(sessionKey)||'';}catch{}
unlock(supplied||saved,false);
window.addEventListener('hashchange',()=>{
  const incoming=tokenFrom(location.href);
  if(byId('campaign').hidden && incoming) unlock(incoming,false);
});
