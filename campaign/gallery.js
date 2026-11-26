'use strict';

const byId = id => document.getElementById(id);
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const urls = new Map();
let campaign, postsById, active, revision = 0, enlarged, enlargedRevision = 0;
const groups = {
  facebook: {label:'Facebook', short:'Facebook'},
  stories: {label:'Instagram Stories', short:'IG Story'},
  feed: {label:'Instagram feed', short:'IG feed'},
  linkedin: {label:'LinkedIn', short:'LinkedIn'}
};
const shortDate = new Intl.DateTimeFormat('en-AU', {weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
const longDate = new Intl.DateTimeFormat('en-AU', {weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
const monthLabel = new Intl.DateTimeFormat('en-AU', {month:'long', year:'numeric', timeZone:'UTC'});
const calendarDate = iso => new Date(iso+'T00:00:00Z');
const dateLabel = iso => shortDate.format(calendarDate(iso));
const dayId = iso => 'day-'+iso;
function groupOf(post) {
  if (post.channel !== 'Instagram') return post.channel.toLowerCase();
  return post.frames ? 'stories' : 'feed';
}

function goTo(id) {
  const target = byId(id);
  target.scrollIntoView({block:'start'});
  target.focus({preventScroll:true});
}
// In-page navigation keeps the private review fragment in the address bar.
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const id = anchor.getAttribute('href').slice(1);
  if (!byId(id)) return;
  event.preventDefault();
  if (campaign && (id === 'posts' || anchor.closest('#calendar-days'))) applyFilter('all');
  if (id.startsWith('day-')) byId('date').value = id.slice(4);
  goTo(id);
});
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
function layoutPanel(post, index, thumbnail) {
  const frame = post.layout[index];
  const panel = el('span', undefined, 'layout-panel');
  panel.dataset.shape = post.frames || post.format === 'Reel' ? 'portrait' : post.channel === 'Instagram' ? 'tile' : 'landscape';
  panel.dataset.group = groupOf(post);
  const brand = el('span', 'Peninsula ', 'layout-brand');
  brand.append(el('b','Insider'));
  const stamp = el('span', post.layout.length > 1 ? frame.label+' · '+post.layout.length+(post.format==='Reel'?' scenes':post.frames?' frames':' slides') : dateLabel(post.date), 'layout-label');
  panel.append(brand, el('span',frame.text,'layout-copy'), stamp);
  if (!thumbnail && post.frames && index === 1) {
    const link=external(post.sticker,post.guide);
    link.className='layout-sticker';
    panel.append(link);
  }
  return panel;
}
function mediaView(set, index) {
  if (set.layout) return layoutPanel(postsById[set.post],index,false);
  const name=set.files[index];
  if (name.endsWith('.mp4')) {
    const video=el('video');
    video.controls=true; video.playsInline=true; video.muted=true; video.preload='metadata';
    const metadata=campaign.videos[name];
    video.setAttribute('aria-label',metadata.label);
    video.poster=urls.get(metadata.poster);
    video.src=urls.get(name);
    const track=el('track');
    track.kind='captions'; track.label='Visual descriptions'; track.srclang='en'; track.src=urls.get(metadata.track);
    video.append(track);
    return video;
  }
  const img=el('img');
  img.src=urls.get(name); img.alt=set.alt || campaign.alt[name]; img.decoding='async';
  const post=postsById[set.post];
  if (post.frames && index===1) {
    const wrap=el('div',undefined,'story-wrapper');
    const link=external(post.sticker,post.guide);
    link.className='sticker'; link.setAttribute('aria-label','Preview link sticker: '+post.sticker);
    wrap.append(img,link); return wrap;
  }
  return img;
}
function variants(target, set, index, onSelect) {
  target.replaceChildren();
  if (set.labels.length<2) return;
  set.labels.forEach((label,i) => {
    const btn=el('button',label);
    btn.type='button'; btn.setAttribute('aria-pressed',String(i===index));
    btn.addEventListener('click',() => {
      onSelect(i);
      const replacement=target.children[i];
      if(replacement) replacement.focus({preventScroll:true});
    });
    target.append(btn);
  });
}
function renderArtwork() {
  const post=postsById[active.post];
  const name=active.files[revision];
  byId('asset-format').textContent=active.format+' · '+dateLabel(post.date);
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
    const blocks=campaign.videos[name].transcript.split(/\n\s*\n/).slice(1);
    for (const block of blocks) {
      const [timing,...words]=block.split('\n'); const p=el('p');
      p.append(el('strong',timing.slice(3,8)+' '),document.createTextNode(words.join(' '))); box.append(p);
    }
  } else lines(box,campaign.alt[name]);
  const primary=byId('primary-media'); pausePlayers(primary); primary.replaceChildren(mediaView(active,revision));
  variants(byId('variants'),active,revision,i=>{revision=i;renderArtwork();});
  for (const b of byId('tray').children) b.setAttribute('aria-pressed',String(b.dataset.id===active.id));
  byId('asset-live').textContent=active.title+', '+active.labels[revision];
}
function showSet(id) {
  active=campaign.sets.find(x => x.id===id);
  revision=0; renderArtwork();
}
function renderLarge() {
  const box=byId('large-media'); pausePlayers(box); box.replaceChildren(mediaView(enlarged,enlargedRevision));
  const credit=byId('large-credit');
  const creditText=enlarged.credit || (enlarged.id==='facebook-market' ? 'Mornington Farmers Market, Mornington Peninsula. Photo: Robert Blackburn, courtesy of Visit Victoria' : '');
  credit.textContent=creditText;
  credit.hidden=!creditText;
  const direction=byId('layout-direction');
  direction.hidden=!enlarged.layout;
  direction.querySelector('p').textContent=enlarged.layout ? postsById[enlarged.post].creative : '';
  byId('large-title').textContent=enlarged.title+' · '+enlarged.labels[enlargedRevision];
  variants(byId('large-controls'),enlarged,enlargedRevision,i=>{
    enlargedRevision=i;
    if (enlarged===active) {revision=i;renderArtwork();}
    renderLarge();
  });
}
function openLarge(set, index) {
  enlarged=set; enlargedRevision=index;
  pausePlayers(byId('primary-media')); renderLarge();
  byId('enlarged').showModal(); byId('close').focus();
}
byId('expand').addEventListener('click',() => openLarge(active,revision));
byId('close').addEventListener('click',()=>byId('enlarged').close());
byId('enlarged').addEventListener('close',()=>{pausePlayers(byId('large-media'));byId('large-media').replaceChildren();});

function internalLink(label, id, className) {
  const a = el('a', label, className);
  a.href = '#'+id;
  return a;
}

function calendarDay(day, posts) {
  const cell = el('td');
  const link = internalLink(undefined, dayId(day), 'calendar-date');
  link.setAttribute('aria-label', longDate.format(calendarDate(day))+', '+posts.length+' posts');
  link.append(el('span', String(calendarDate(day).getUTCDate()), 'date-number'), el('span', posts.length+' posts', 'date-count'));
  const agenda = el('ul', undefined, 'calendar-agenda');
  for (const post of posts) {
    const item = el('li');
    const jump = internalLink(undefined, 'post-'+post.id, 'calendar-slot');
    jump.dataset.group = groupOf(post);
    jump.setAttribute('aria-label', post.time+' AEDT, '+post.channel+', '+post.format+', '+post.title);
    const time = el('time', post.time);
    time.dateTime = day+'T'+post.time+':00+11:00';
    jump.append(time, el('span', groups[groupOf(post)].short));
    item.append(jump);
    agenda.append(item);
  }
  cell.append(link, agenda);
  return cell;
}

function renderCalendars(byDate) {
  const months = new Map();
  for (const day of byDate.keys()) {
    const month = day.slice(0,7);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(day);
  }
  for (const dates of months.values()) {
    const table = byId('month-calendar').content.querySelector('table').cloneNode(true);
    const start = calendarDate(dates[0]);
    const end = calendarDate(dates[dates.length-1]);
    const count = dates.reduce((total, day) => total+byDate.get(day).length, 0);
    const caption = table.caption;
    caption.append(el('strong',monthLabel.format(start)),el('span',count+' planned posts'));
    table.dataset.month = dates[0].slice(0,7);
    const body = table.tBodies[0];
    const monday = new Date(start);
    monday.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
    for (const cursor = monday; cursor <= end;) {
      const row = el('tr');
      for (let weekday=0;weekday<7;weekday++) {
        const day = cursor.toISOString().slice(0,10);
        const posts = day.slice(0,7) === table.dataset.month ? byDate.get(day) : null;
        row.append(posts ? calendarDay(day,posts) : el('td',undefined,'outside-month'));
        cursor.setUTCDate(cursor.getUTCDate()+1);
      }
      body.append(row);
    }
    byId('calendar-days').append(table);
  }
}

function postMedia(post) {
  let set, label, preview;
  if (post.art) {
    const source = campaign.sets.find(item => item.id === post.art);
    set = {id: source.id, title: post.title, post: post.id, files: post.media,
      labels: post.media.map(name => source.labels[source.files.indexOf(name)])};
    label = {Carousel:'View '+set.files.length+' slides', 'Two-frame Story':'View both frames', Reel:'View Reel'}[post.format] || (campaign.videos[set.files[0]] ? 'View animation' : 'View image');
    if (set.id === 'facebook-market') set.credit = 'Mornington Farmers Market, Mornington Peninsula. Photo: Robert Blackburn, courtesy of Visit Victoria';
  } else if (post.native) {
    set = {title:post.title, post:post.id, files:[post.native.file], labels:['Link preview'], alt:post.imageDescription, credit:post.native.credit};
    label = 'View link preview';
  } else {
    const kind = post.format === 'Reel' ? 'Draft storyboard' : 'Draft layout';
    set = {title:post.title+' · '+kind, post:post.id, layout:post.layout, labels:post.layout.map(frame=>frame.label)};
    label = 'View '+kind.toLowerCase();
  }
  const figure = el('figure', undefined, 'post-art');
  figure.dataset.preview = post.art ? 'reviewed' : post.native ? 'native' : 'layout';
  const button = el('button', undefined, 'art-open');
  button.type = 'button';
  if (set.layout) {
    preview = layoutPanel(post,0,true);
    preview.setAttribute('aria-hidden','true');
  } else {
    preview = el('img');
    preview.src = urls.get(campaign.videos[set.files[0]]?.poster || set.files[0]);
    preview.alt = '';
    preview.loading = 'lazy';
  }
  button.append(preview, el('span', label, 'preview-action'));
  button.setAttribute('aria-label', label+' for '+post.channel+' on '+dateLabel(post.date));
  button.addEventListener('click', () => openLarge(set, 0));
  figure.append(button);
  if (set.credit) figure.append(el('figcaption',set.credit,'credit'));
  return figure;
}

function storyCopy(post, body) {
  body.classList.add('story-copy');
  post.frames.forEach((frame, i) => {
    const card = el('div', undefined, 'story-frame');
    card.append(el('span', 'Frame '+(i+1), 'frame-label'), el('p', frame));
    if (i === 1) {
      const sticker = external(post.sticker, post.guide);
      sticker.className = 'story-link guide-link';
      sticker.setAttribute('aria-label', 'Link sticker: '+post.sticker);
      card.append(sticker);
    }
    body.append(card);
  });
}

function renderPost(post) {
  const group = groupOf(post);
  const article = el('article', undefined, 'post');
  article.id = 'post-'+post.id;
  article.tabIndex = -1;
  article.dataset.post = post.id;
  article.dataset.group = group;
  article.setAttribute('aria-labelledby', 'title-'+post.id);

  const meta = el('div', undefined, 'post-meta');
  const time = el('time', post.time);
  time.dateTime = post.date+'T'+post.time+':00+11:00';
  const channel = el('span', groups[group].label, 'channel-name');
  meta.append(time, channel, el('span', post.format, 'post-format'));

  const content = el('div', undefined, 'post-content');
  const title = el('h4', post.title);
  title.id = 'title-'+post.id;
  const body = el('div', undefined, 'post-body');
  if (post.frames) storyCopy(post, body);
  else lines(body, post.copy);
  content.append(title, body);
  if (post.frames && post.copy !== [...post.frames, 'Sticker • '+post.sticker].join('\n\n')) {
    const caption = el('div', undefined, 'story-caption');
    caption.append(el('strong', 'Accompanying copy'));
    lines(caption, post.copy);
    content.append(caption);
  }

  const controls = el('div', undefined, 'post-actions');
  if (!post.frames) {
    const guide = external('Open PI guide', post.guide);
    guide.className = 'guide-link';
    controls.append(guide);
  }
  const brief = el('details', undefined, 'brief');
  brief.append(el('summary', 'Creative brief'), el('p', post.creative, 'direction'));
  if (post.imageDescription) {
    brief.append(el('strong', 'Draft image description'), el('p', post.imageDescription));
  }
  controls.append(brief);
  content.append(controls);
  article.append(meta, content);
  article.append(postMedia(post));
  return article;
}

function renderDay(day, posts) {
  const section = el('section', undefined, 'post-day');
  section.id = dayId(day);
  section.tabIndex = -1;
  section.setAttribute('aria-labelledby', 'heading-'+section.id);
  const head = el('header', undefined, 'day-heading');
  const title = el('h3', longDate.format(calendarDate(day)));
  title.id = 'heading-'+section.id;
  head.append(title, el('span', undefined, 'day-count'));
  section.append(head, ...posts.map(renderPost));
  return section;
}

function applyFilter(group) {
  byId('channel').value = group;
  const date = byId('date');
  date.value = '';
  let count = 0;
  for (const section of byId('post-list').children) {
    let dayCount = 0;
    for (const post of section.querySelectorAll('article')) {
      post.hidden = group !== 'all' && post.dataset.group !== group;
      if (!post.hidden) dayCount++;
    }
    section.hidden = dayCount === 0;
    section.querySelector('.day-count').textContent = dayCount+(dayCount===1 ? ' post' : ' posts');
    date.options.namedItem('option-'+section.id).disabled = section.hidden;
    count += dayCount;
  }
  byId('showing').textContent = group === 'all' ? 'Showing all '+count+' planned posts.' : 'Showing '+count+' of '+campaign.posts.length+' planned posts.';
}

function renderPlan() {
  const days = [...campaign.days].sort((a,b)=>a.date.localeCompare(b.date));
  const byDate = new Map(days.map(day => [day.date, []]));
  for (const post of campaign.posts) byDate.get(post.date).push(post);
  for (const posts of byDate.values()) posts.sort((a,b)=>a.time.localeCompare(b.time));
  byId('total-posts').textContent = campaign.posts.length+' planned posts';
  byId('read-all').textContent = 'Read all '+campaign.posts.length+' posts ↓';
  const reviewed = campaign.posts.filter(post => post.art).length;
  const native = campaign.posts.filter(post => post.native).length;
  const drafts = campaign.posts.length-reviewed-native;
  byId('preview-types').textContent = reviewed+' posts use reviewed artwork, '+native+' use guide link previews and '+drafts+' have draft layouts or storyboards.';
  for (const [group, names] of Object.entries(groups)) {
    const count = campaign.posts.filter(p => groupOf(p)===group).length;
    const legend = el('li');
    legend.dataset.group = group;
    legend.append(el('strong', String(count)), document.createTextNode(' '+names.label));
    byId('legend').append(legend);
    const option = el('option', names.label+' ('+count+')');
    option.value = group;
    byId('channel').add(option);
  }
  renderCalendars(byDate);
  days.forEach(({date:day,title}) => {
    const posts=byDate.get(day);
    const option = el('option', dateLabel(day)+' · '+title);
    option.id = 'option-'+dayId(day);
    option.value = String(day);
    byId('date').add(option);
    byId('post-list').append(renderDay(day, posts));
  });
  applyFilter('all');
}

byId('channel').addEventListener('change', event => applyFilter(event.target.value));
byId('date').addEventListener('change', event => {
  if (event.target.value) goTo(dayId(event.target.value));
});

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
  renderPlan();
  showSet('reel');
  byId('entry').hidden=true;byId('campaign').hidden=false;byId('navigation').hidden=false;byId('footer-schedule').hidden=false;
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
  byId('unlock').hidden=true;byId('entry-state').textContent='Opening the campaign preview…';
  try {
    const decoded=Uint8Array.from(atob(token.replace(/-/g,'+').replace(/_/g,'/')+'='),c=>c.charCodeAt(0));
    const key=await crypto.subtle.importKey('raw',decoded,'AES-GCM',false,['decrypt']);
    const resp=await fetch('./december.bin?v=nov-dec-2026-1',{credentials:'omit',referrerPolicy:'no-referrer'});
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
