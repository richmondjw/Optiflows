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
  if (campaign && (id === 'posts' || id.startsWith('day-') || id.startsWith('post-') || anchor.closest('#calendar-days'))) applyFilter('all');
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
    video.loop=Boolean(metadata.loop) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  if (post.poll && index===0){
    const wrap=el('div',undefined,'story-wrapper');const poll=el('div',undefined,'sticker poll-preview');
    poll.append(el('b',post.poll.question),el('span',post.poll.options.join('  /  ')));
    wrap.append(img,poll);return wrap;
  }
  if (post.frames && index===post.frames.length-1) {
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
  byId('asset-guide').textContent='Open PI guide';
  byId('caption').replaceChildren();
  if (post.frames) {
    lines(byId('caption'),post.frames[revision]);

  } else lines(byId('caption'),post.copy);
  byId('description').open=false;
  byId('description').querySelector('summary').textContent=name.endsWith('.mp4')?'Video description and transcript':'Image description';
  const box=byId('description-text'); box.replaceChildren();
  if (name.endsWith('.mp4')) {
    const blocks=campaign.videos[name].transcript.split(/\n\s*\n/).slice(1);
    for (const block of blocks) {
      const rows=block.split('\n');if(/^\d+$/.test(rows[0]))rows.shift();
      const [timing,...words]=rows; const p=el('p');
      p.append(el('strong',timing.slice(3,8)+' '),document.createTextNode(words.join(' '))); box.append(p);
    }
  } else lines(box,active.alt || campaign.alt[name]);
  const primary=byId('primary-media'); pausePlayers(primary); primary.replaceChildren(mediaView(active,revision));
  variants(byId('variants'),active,revision,i=>{revision=i;renderArtwork();});
  byId('art-select').value=active.id;
  const position=campaign.sets.indexOf(active);
  byId('previous-art').disabled=position===0; byId('next-art').disabled=position===campaign.sets.length-1;
  drawCredit(byId('gallery-credit'),active,Boolean(!post.frames && post.copy.includes(active.credit)));
  byId('asset-live').textContent=active.title+', '+active.labels[revision];
}
function showSet(id) {
  active=campaign.sets.find(x => x.id===id);
  revision=0; renderArtwork();
}
function drawCredit(node,set,alreadyVisible) {
  node.replaceChildren();
  const credit=alreadyVisible?'':set.credit;
  if(credit) node.append(document.createTextNode(credit));
  if(set.source){
    if(credit) node.append(document.createTextNode(' · '));
    node.append(external('Original photograph',set.source),document.createTextNode(' · '),external(set.licenceLabel,set.licence));
  }
  node.hidden=!node.hasChildNodes();
}
function fileActions(set,index) {
  const actions=byId('file-actions'); actions.replaceChildren();
  if(set.layout) return;
  if(set.nativeOnly){
    actions.append(el('p','The guide supplies this image when its link is shared.','credit'));
    return;
  }
  const name=set.files[index];
  const isFilm=name.endsWith('.mp4');
  const button=el('a',isFilm?'Download MP4':name.endsWith('.webp')?'Download PNG':'Download image');
  button.download=name; button.href=urls.get(name);
  if(name.endsWith('.webp')) button.addEventListener('click',async event=>{
    event.preventDefault();
    const img=new Image(); img.src=urls.get(name);await img.decode();
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    canvas.getContext('2d').drawImage(img,0,0);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)return;
    const url=URL.createObjectURL(blob);const file=document.createElement('a');file.download=name.slice(0,-5)+'.png';file.href=url;
    document.body.append(file);file.click();file.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  });
  actions.append(button);
  if(isFilm){
    const link=el('a','Download descriptions (.vtt)');
    const track=campaign.videos[name].track;link.download=track;link.href=urls.get(track);actions.append(link);
  }
}
function renderLarge() {
  const box=byId('large-media'); pausePlayers(box); box.replaceChildren(mediaView(enlarged,enlargedRevision));
  drawCredit(byId('large-credit'),enlarged,false);
  fileActions(enlarged,enlargedRevision);
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
byId('enlarged').addEventListener('close',()=>{if(byId('enlarged').open)return;pausePlayers(byId('large-media'));byId('large-media').replaceChildren();});

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
    caption.append(el('strong',monthLabel.format(start)),el('span',count+' posts'));
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
  set=campaign.sets.find(item=>item.post===post.id);
  if(set){
    label=post.native || set.nativeOnly ? 'View link image' : post.frames ? 'View both frames' : post.format==='Reel' ? 'Play Reel' : campaign.videos[set.files[0]] ? 'Play animation' : set.files.length>1 ? 'View '+set.files.length+(post.format==='Carousel'?' slides':' images') : 'View image';
  } else {
    const kind=post.format==='Reel'?'Draft storyboard':'Draft layout';
    set={title:post.title+' · '+kind,post:post.id,layout:post.layout,labels:post.layout.map(frame=>frame.label)};
    label='View '+kind.toLowerCase();
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
    preview.src = urls.get(set.thumb || campaign.videos[set.files[0]]?.poster || set.files[0]);
    preview.alt = '';
    preview.loading = 'lazy';
  }
  button.append(preview, el('span', label, 'preview-action'));
  button.setAttribute('aria-label', label+' for '+post.channel+' on '+dateLabel(post.date));
  button.addEventListener('click', () => openLarge(set, 0));
  figure.append(button);
  if (set.credit && (post.native || set.nativeOnly || set.source || set.placeCredit)) { const caption=el('figcaption',undefined,'credit');drawCredit(caption,set,false);figure.append(caption); }
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
  const booked=campaign.buffer?.rows[post.id];
  if(booked){
    const standard=booked.method==='notification'?'Buffer · Mobile reminder':'Buffer · Automatic';
    const delivery=el('span',booked.observation || standard,'buffer-delivery');
    delivery.title='Buffer post '+booked.id;delivery.dataset.bufferId=booked.id;
    meta.append(delivery);
  }

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
  if (booked?.permalink) {
    const published = external('View published post', booked.permalink);
    published.className='guide-link';
    controls.append(published);
  }
  if (!post.frames) {
    const guide = external('Open PI guide', post.guide);
    guide.className = 'guide-link';
    controls.append(guide);
  }
  const brief = el('details', undefined, 'brief');
  brief.append(el('summary', 'Creative brief'), el('p', post.creative, 'direction'));
  if (post.imageDescription) {
    brief.append(el('strong', 'Image description'), el('p', post.imageDescription));
  }
  if(post.profile){
    const profile=external('Town guides profile destination',post.profile.hub);profile.className='guide-link';controls.append(profile);
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
  byId('showing').textContent = group === 'all' ? 'Showing all '+count+' posts.' : 'Showing '+count+' of '+campaign.posts.length+' posts.';
}

function renderPlan() {
  const days = [...campaign.days].sort((a,b)=>a.date.localeCompare(b.date));
  const byDate = new Map(days.map(day => [day.date, []]));
  for (const post of campaign.posts) byDate.get(post.date).push(post);
  for (const posts of byDate.values()) posts.sort((a,b)=>a.time.localeCompare(b.time));
  byId('total-posts').textContent = campaign.posts.length+' campaign posts';
  if(campaign.buffer){
    const status=byId('queue-status');
    const verified=new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit',timeZone:'Australia/Melbourne',timeZoneName:'short'}).format(new Date(campaign.buffer.checked));
    const rows=Object.values(campaign.buffer.rows);
    const scheduled=rows.filter(row=>row.status==='scheduled').length;
    const published=rows.filter(row=>row.status==='published').length;
    const onMobile=rows.filter(row=>row.status==='notified').length;
    status.textContent=scheduled+' scheduled in Buffer · '+published+' published · '+onMobile+' awaiting mobile sharing. Checked '+verified+'.';
    status.hidden=false;
  }
  byId('read-all').textContent = 'Read all '+campaign.posts.length+' posts ↓';
  const native = campaign.sets.filter(set => set.nativeOnly).length;
  const attachments = campaign.sets.length-native;
  const drafts = campaign.posts.length-campaign.sets.length;
  byId('preview-types').textContent = attachments+' posts have media to attach. '+native+' use the image from their linked guide.'+(drafts?' '+drafts+' have draft layouts or storyboards.':'');
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

function renderReserves(sets){
  byId('reserve').hidden=!sets.length;
  if(!sets.length)return;
  const select=byId('reserve-select');
  for(const s of sets){const o=el('option',s.title);o.value=s.id;select.add(o);}
  function display(s,i){
    byId('reserve-title').textContent=s.title;byId('reserve-caption').textContent=s.copy;
    byId('reserve-credit').textContent=s.credit;byId('reserve-guide').href=s.guide;
    const f=s.files[i],img=el('img');img.src=urls.get(f);img.alt=s.alt[f];
    const wrap=el('div',undefined,'story-wrapper');wrap.append(img);
    if(i===1&&s.sticker){const a=external(s.sticker,s.guide);a.className='sticker';wrap.append(a);}
    byId('reserve-media').replaceChildren(wrap);
    const download=byId('reserve-download');download.href=urls.get(f);download.download=f;
    variants(byId('reserve-variants'),s,i,j=>display(s,j));
  }
  select.addEventListener('change',()=>display(sets.find(s=>s.id===select.value),0));
  display(sets[0],0);
}
function renderScorecard(card){
  const section=byId('scorecard');
  section.hidden=!card;
  if(!card)return;
  const {dimensions,rows,programme}=card;
  const codes=dimensions.map(d=>d.code);
  const total=s=>codes.reduce((n,k)=>n+s[k],0);
  byId('score-overview').textContent=rows.filter(r=>total(r.scores)>=99).length+' of '+rows.length+' planned posts reach the 99/100 target.';
  byId('score-programme').textContent='Programme '+programme.score+'/100. The first round scored '+programme.baseline+'/100. The lowest final placement scores '+Math.min(...rows.map(r=>r.total))+'/100.';
  const programmeNote=el('p',programme.reason);byId('score-rubric').prepend(programmeNote);
  byId('score-scope').textContent='The independent scores assess publishing copy and finished media before release. Engagement and traffic are measured after publication.';
  const legend=byId('score-rubric');
  const list=el('dl');for(const d of dimensions){list.append(el('dt',d.code+' · '+d.name+' ('+d.max+')'),el('dd',d.criteria));}legend.append(list);
  if(card.references){const p=el('p','References: ');for(const [i,s] of card.references.entries()){if(i)p.append(document.createTextNode(' · '));p.append(external(s.title,s.url));}legend.append(p);}
  const head=el('tr');head.append(el('th','Post'),el('th','Total'));for(const d of dimensions){const h=el('th');h.scope='col';const a=el('abbr',d.code+' / '+d.max);a.title=d.name;h.append(a);head.append(h);}byId('score-table').tHead.append(head);
  const reserveTbody=byId('reserve-score-rows');
  const reserveHead=byId('reserve-score-head');
  for(const d of dimensions){const h=el('th');h.scope='col';const a=el('abbr',d.code+' / '+d.max);a.title=d.name;h.append(a);reserveHead.append(h);}
  const reviewCol=el('th','Review');reviewCol.scope='col';reserveHead.append(reviewCol);
  for(const row of card.reserveRows||[]){
    const tr=el('tr');const name=el('th');name.scope='row';const btn=el('button',row.title,'score-post');btn.type='button';
    btn.addEventListener('click',()=>{byId('reserve').open=true;byId('reserve-select').value=row.id;byId('reserve-select').dispatchEvent(new Event('change'));byId('reserve').scrollIntoView();byId('reserve-select').focus({preventScroll:true});});
    name.append(btn);tr.append(name,el('td',String(row.total)));
    for(const d of dimensions)tr.append(el('td',String(row.scores[d.code])));
    const reason=el('td',row.evidence);if(row.remaining)reason.append(el('p',row.remaining));tr.append(reason);reserveTbody.append(tr);
  }
  function render(){
    const tb=byId('score-table').tBodies[0];tb.replaceChildren();
    const order=byId('score-order').value,channel=byId('score-channel').value;
    const chronology=(a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time);
    const shown=rows.filter(r=>channel==='all'||groupOf(postsById[r.id])===channel).sort((a,b)=>(order==='low'?total(a.scores)-total(b.scores):0)||chronology(postsById[a.id],postsById[b.id]));
    for(const r of shown){
      const post=postsById[r.id],tr=el('tr');tr.dataset.scorePost=r.id;
      const name=el('th');name.scope='row';const btn=el('button',post.title,'score-post');btn.type='button';btn.setAttribute('aria-expanded','false');
      btn.append(el('span',dateLabel(post.date)+' · '+groups[groupOf(post)].short,'score-byline'));name.append(btn);
      tr.append(name,el('td',String(total(r.scores)),'score-total'));for(const d of dimensions)tr.append(el('td',String(r.scores[d.code])));
      const notes=el('tr');notes.hidden=true;const cell=el('td');cell.colSpan=dimensions.length+2;
      const block=el('div',undefined,'score-note');block.append(el('strong','Review evidence'),el('p',r.evidence));
      if(r.sources?.length){
        const sources=el('ul',undefined,'source-list');
        for(const address of r.sources){
          const url=new URL(address),last=url.pathname.split('/').filter(Boolean).pop();
          const label=last ? decodeURI(last).replaceAll('_',' ').replaceAll('-',' ') : url.hostname;
          const item=el('li');item.append(external(label,url.href));sources.append(item);
        }
        block.append(el('strong','Sources checked'),sources);
      }
      if(r.change)block.append(el('strong','Revision'),el('p',r.change));if(r.remaining)block.append(el('strong','Remaining deduction'),el('p',r.remaining));
      block.append(internalLink('Open scheduled post','post-'+post.id));cell.append(block);notes.append(cell);
      btn.addEventListener('click',()=>{notes.hidden=!notes.hidden;btn.setAttribute('aria-expanded',String(!notes.hidden));});
      tb.append(tr,notes);
    }
  }
  byId('score-channel').addEventListener('change',render);byId('score-order').addEventListener('change',render);render();
}
function renderCovers(covers) {
  if (!covers) return;
  for (const card of covers.items) {
    const figure=el('figure');
    const picture=el('img');
    picture.alt=card.alt;
    picture.width=card.width;
    picture.height=card.height;
    picture.src=urls.get(card.file);
    const caption=el('figcaption');
    const name=el('h3',card.channel);
    const link=el('a','Download JPG');
    link.download=card.file;
    link.href=urls.get(card.file);
    link.setAttribute('aria-label','Download '+card.channel+' cover as JPG');
    caption.append(name,el('span',card.width+' × '+card.height),link);
    figure.append(picture,caption);
    byId('cover-gallery').append(figure);
  }
  const source=byId('cover-source');
  source.href=urls.get(covers.source);
  source.download=covers.source;
  byId('covers').hidden=false;
}
function showContent(data,bytes) {
  campaign=data;
  for(const [name,file] of Object.entries(data.files)) {
    urls.set(name,URL.createObjectURL(new Blob([bytes.subarray(file.start,file.start+file.size)],{type:file.type})));
  }
  for(const type of ['scorecard','schedule']){
    const link=byId('download-'+type),file=data.downloads?.[type];
    link.hidden=!file;
    if(file){link.href=urls.get(file);link.download=file;}
  }
  postsById=Object.fromEntries(data.posts.map(p=>[p.id,p]));
  const picker=byId('art-select');picker.replaceChildren();
  let previousMonth='',monthGroup;
  for (const set of data.sets){
    const p=postsById[set.post],month=p.date.slice(0,7);
    if(month!==previousMonth){monthGroup=el('optgroup');monthGroup.label=monthLabel.format(calendarDate(p.date));picker.append(monthGroup);previousMonth=month;}
    const option=el('option',dateLabel(p.date)+' · '+p.time+' · '+groups[groupOf(p)].short+' · '+p.title);
    option.value=set.id;monthGroup.append(option);
  }
  picker.addEventListener('change',()=>showSet(picker.value));
  for(const [button,step] of [['previous-art',-1],['next-art',1]]){
    byId(button).addEventListener('click',()=>{const next=data.sets[data.sets.indexOf(active)+step];if(next)showSet(next.id);});
  }
  renderPlan();
  renderCovers(data.covers);
  renderReserves(data.reserves||[]);
  renderScorecard(data.scorecard);
  showSet(data.sets.find(s=>s.post==='d03_ig_feed')?.id||data.sets[0].id);
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
    const resp=await fetch('./december.bin?v=pi-covers-2026-1',{credentials:'omit',referrerPolicy:'no-referrer'});
    if (!resp.ok) throw new Error('fetch');
    const packet=new Uint8Array(await resp.arrayBuffer());
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:packet.subarray(0,12)},key,packet.subarray(12));
    const size=new DataView(plain).getUint32(0);
    const data=JSON.parse(new TextDecoder().decode(new Uint8Array(plain,4,size)));
    showContent(data,new Uint8Array(plain,4+size));
    const options=new URLSearchParams(location.hash.slice(1));
    const destination=options.get('view');const selected=options.get('post');
    if(selected&&postsById[selected])requestAnimationFrame(()=>goTo('post-'+selected));
    else if(['scorecard','artwork','schedule','posts','covers'].includes(destination)&&!byId(destination).hidden)requestAnimationFrame(()=>goTo(destination));
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
