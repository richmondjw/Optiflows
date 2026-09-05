import { campaign } from './campaign-data.js';

const reviewKey = 'optiflows-visible-flow-review-v1';
const channelLabels = Object.fromEntries(campaign.channels.map((channel) => [channel.id, channel.label]));
const reviewState = readReviewState();
const weekMap = document.querySelector('#week-map');
const emailGrid = document.querySelector('#email-grid');
const campaignGrid = document.querySelector('#campaign-grid');
const emptyState = document.querySelector('#empty-state');
const progressValue = document.querySelector('#progress-value');
const progressBar = document.querySelector('#progress-bar');
const toast = document.querySelector('#toast');

weekMap.innerHTML = campaign.weeks.map((week) => `
  <article class="week-card" style="--week-colour:${week.colour}">
    <span class="week-card__number">Week ${week.number} / ${escapeHtml(week.dates)}</span>
    <h3>${escapeHtml(week.theme)}</h3>
    <p>${escapeHtml(week.intent)}</p>
  </article>
`).join('');

emailGrid.innerHTML = campaign.emails.map(emailMarkup).join('');
campaignGrid.innerHTML = campaign.posts.map(postMarkup).join('');
bindEmailCards();
bindCopyPanels();
bindReviewChecks();
bindFilters();
bindMotionPlayers();
updateProgress();

function emailMarkup(email) {
  const accent = accentColour(email.accent);
  const checks = ['copy', 'creative', 'send-ready'].map((type) => {
    const checked = reviewState[`${email.id}:${type}`] ? ' checked' : '';
    return `<label><input type="checkbox" data-review-key="${email.id}:${type}"${checked}>${labelForCheck(type)}</label>`;
  }).join('');

  return `
    <article class="email-card" style="--accent:${accent}">
      <div class="email-card__head">
        <span>${escapeHtml(email.sequence)}</span>
        <strong>${escapeHtml(email.id.toUpperCase())}</strong>
      </div>
      <div class="email-preview">
        <iframe src="./${email.html}" title="Preview: ${escapeHtml(email.title)}" loading="lazy"></iframe>
      </div>
      <div class="email-card__body">
        <p class="email-intent">${escapeHtml(email.intent)}</p>
        <h3>${escapeHtml(email.title)}</h3>
        <p class="email-audience"><strong>Audience:</strong> ${escapeHtml(email.audience)}</p>
        <div class="email-field">
          <span>Subject line options</span>
          <div class="subject-options" role="tablist" aria-label="Subject options for ${escapeHtml(email.title)}">
            ${email.subjects.map((subject, index) => `<button class="subject-option${index === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${index === 0}" data-subject-index="${index}">${index + 1}</button>`).join('')}
          </div>
          <p class="subject-output">${escapeHtml(email.subjects[0])}</p>
          <button class="copy-subject" type="button">Copy subject</button>
        </div>
        <div class="email-field">
          <span>Preheader</span>
          <p>${escapeHtml(email.preheader)}</p>
        </div>
        <details class="email-copy">
          <summary>Plain-text version</summary>
          <pre>${escapeHtml(email.plainText)}</pre>
          <button class="copy-email" type="button">Copy email copy</button>
        </details>
        <div class="email-actions">
          <a href="./${email.html}" target="_blank" rel="noopener">Open HTML</a>
          <a href="./${email.html}" download>Download HTML</a>
          <button class="copy-html" type="button">Copy HTML code</button>
        </div>
        <div class="review-checks" aria-label="Review status for ${escapeHtml(email.title)}">${checks}</div>
        <script type="application/json" class="email-data">${safeJson(email)}</script>
      </div>
    </article>
  `;
}

function postMarkup(post) {
  const accent = accentColour(post.accent);
  const channels = Object.keys(post.channels);
  const firstChannel = channels[0];
  const media = mediaMarkup(post);
  const assetLinks = assetLinksMarkup(post);
  const checks = ['copy', 'creative', 'scheduled'].map((type) => {
    const checked = reviewState[`${post.id}:${type}`] ? ' checked' : '';
    return `<label><input type="checkbox" data-review-key="${post.id}:${type}"${checked}>${labelForCheck(type)}</label>`;
  }).join('');

  return `
    <article class="post-card" data-week="week-${post.week}" data-format="${post.format}" style="--accent:${accent}">
      ${media}
      <div class="post-body">
        <div class="post-date"><span>${escapeHtml(post.day)}</span><span>${escapeHtml(post.format)}</span></div>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-deck">${escapeHtml(post.deck)}</p>
        <div class="asset-actions">${assetLinks}</div>
        <details class="copy-panel">
          <summary>Channel copy</summary>
          <div class="channel-tabs" role="tablist" aria-label="Copy channels for ${escapeHtml(post.title)}">
            ${channels.map((channel, index) => `<button class="channel-tab${index === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${index === 0}" data-channel="${channel}">${escapeHtml(shortChannelLabel(channel))}</button>`).join('')}
          </div>
          <pre class="copy-text">${escapeHtml(post.channels[firstChannel])}</pre>
          <button class="copy-button" type="button">Copy ${escapeHtml(channelLabels[firstChannel] || firstChannel)}</button>
          <script type="application/json" class="channel-copy">${safeJson(post.channels)}</script>
        </details>
        <div class="review-checks" aria-label="Review status for ${escapeHtml(post.title)}">${checks}</div>
      </div>
    </article>
  `;
}

function mediaMarkup(post) {
  if (post.format === 'motion') {
    return `<div class="post-media post-media--motion"><img src="./${post.asset.poster}" alt="${escapeHtml(post.title)} motion poster" loading="lazy"><button class="play-clip" type="button" data-video="./${post.asset.video}" data-poster="./${post.asset.poster}" aria-label="Play ${escapeHtml(post.title)}">Play clip</button><span class="post-media__badge">6 sec / Silent MP4</span></div>`;
  }
  const source = post.format === 'carousel' ? `${post.asset.slideBase}01.png` : post.asset.image;
  const badge = post.format === 'carousel' ? `${post.asset.slideCount} pages / PDF + PNG` : '1080 x 1350 / PNG';
  return `<div class="post-media"><img src="./${source}" alt="${escapeHtml(post.title)}" loading="lazy"><span class="post-media__badge">${escapeHtml(badge)}</span></div>`;
}

function assetLinksMarkup(post) {
  if (post.format === 'tile') {
    return `<a class="asset-link" href="./${post.asset.image}" target="_blank" rel="noopener">Open image</a><a class="asset-link" href="./${post.asset.image}" download>Download PNG</a>`;
  }
  if (post.format === 'carousel') {
    return `<a class="asset-link" href="./${post.asset.pdf}" target="_blank" rel="noopener">Open PDF</a><a class="asset-link" href="./${post.asset.pdf}" download>Download PDF</a><a class="asset-link" href="./${post.asset.slideBase}01.png" target="_blank" rel="noopener">Open cover</a>`;
  }
  return `<a class="asset-link" href="./${post.asset.video}" target="_blank" rel="noopener">Open video</a><a class="asset-link" href="./${post.asset.video}" download>Download MP4</a><a class="asset-link" href="./${post.asset.poster}" download>Poster PNG</a>`;
}

function bindCopyPanels() {
  document.querySelectorAll('.copy-panel').forEach((panel) => {
    const copies = JSON.parse(panel.querySelector('.channel-copy').textContent);
    const output = panel.querySelector('.copy-text');
    const copyButton = panel.querySelector('.copy-button');
    let active = Object.keys(copies)[0];

    panel.querySelectorAll('.channel-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        active = tab.dataset.channel;
        panel.querySelectorAll('.channel-tab').forEach((item) => {
          const selected = item === tab;
          item.classList.toggle('is-active', selected);
          item.setAttribute('aria-selected', String(selected));
        });
        output.textContent = copies[active];
        copyButton.textContent = `Copy ${channelLabels[active] || active}`;
      });
    });

    copyButton.addEventListener('click', async () => {
      await copyText(copies[active]);
      showToast(`${channelLabels[active] || active} copy copied`);
    });
  });
}

function bindEmailCards() {
  document.querySelectorAll('.email-card').forEach((card) => {
    const email = JSON.parse(card.querySelector('.email-data').textContent);
    const subjectOutput = card.querySelector('.subject-output');
    card.querySelectorAll('.subject-option').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedIndex = Number(button.dataset.subjectIndex);
        subjectOutput.textContent = email.subjects[selectedIndex];
        card.querySelectorAll('.subject-option').forEach((option) => {
          const selected = option === button;
          option.classList.toggle('is-active', selected);
          option.setAttribute('aria-selected', String(selected));
        });
      });
    });
    card.querySelector('.copy-subject').addEventListener('click', async () => {
      await copyText(subjectOutput.textContent);
      showToast('Email subject copied');
    });
    card.querySelector('.copy-email').addEventListener('click', async () => {
      await copyText(email.plainText);
      showToast('Email copy copied');
    });
    card.querySelector('.copy-html').addEventListener('click', async () => {
      const response = await fetch(`./${email.html}`);
      if (!response.ok) throw new Error(`Could not load ${email.html}`);
      await copyText(await response.text());
      showToast('Email HTML copied');
    });
  });
}

function bindReviewChecks() {
  document.querySelectorAll('[data-review-key]').forEach((input) => {
    input.addEventListener('change', () => {
      reviewState[input.dataset.reviewKey] = input.checked;
      localStorage.setItem(reviewKey, JSON.stringify(reviewState));
      updateProgress();
    });
  });
}

function bindMotionPlayers() {
  document.querySelectorAll('.play-clip').forEach((button) => {
    button.addEventListener('click', () => {
      const container = button.closest('.post-media');
      const video = document.createElement('video');
      video.src = button.dataset.video;
      video.poster = button.dataset.poster;
      video.controls = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      container.querySelector('img').replaceWith(video);
      button.remove();
    }, { once: true });
  });
}

function bindFilters() {
  document.querySelectorAll('.filter').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('is-active', item === button));
      const filter = button.dataset.filter;
      let visible = 0;
      document.querySelectorAll('.post-card').forEach((card) => {
        const show = filter === 'all' || card.dataset.week === filter || card.dataset.format === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });
      emptyState.hidden = visible !== 0;
    });
  });
}

function updateProgress() {
  const total = (campaign.posts.length + campaign.emails.length) * 3;
  const completed = Object.values(reviewState).filter(Boolean).length;
  progressValue.textContent = `${completed} / ${total}`;
  progressBar.style.width = `${(completed / total) * 100}%`;
}

function readReviewState() {
  try { return JSON.parse(localStorage.getItem(reviewKey) || '{}'); }
  catch { return {}; }
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function shortChannelLabel(channel) {
  return {
    'linkedin-personal': 'James / LinkedIn',
    'linkedin-company': 'OptiFlows / LinkedIn',
    instagram: 'Instagram',
    youtube: 'YouTube Shorts',
  }[channel] || channel;
}

function labelForCheck(type) {
  return { copy: 'Copy', creative: 'Creative', scheduled: 'Scheduled', 'send-ready': 'Send-ready' }[type];
}

function accentColour(name) {
  return { coral: '#ff8c73', signal: '#66c7ff', intelligence: '#8b7cff', human: '#ffc857', mint: '#66ffe0' }[name] || '#66ffe0';
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
