export function renderCarouselHtml(payload, brand, options = {}) {
  const slides = payload.slides.map((slide, index) => renderSlide(slide, index + 1, payload.slides.length, brand)).join('\n');
  const previewMode = options.mode !== 'export';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(payload.title || 'Social Assets')}</title>
    <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
    <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./base.css" />
  </head>
  <body class="${previewMode ? 'mode-preview' : 'mode-export'}">
    <div class="viewer ${previewMode ? '' : 'viewer--export'}">
      ${previewMode ? renderToolbar(payload.slides.length) : ''}
      <div class="viewer__slides" id="slidesRoot">
        ${slides}
      </div>
    </div>
    ${previewMode ? renderPreviewScript(payload.slides.length) : ''}
  </body>
</html>`;
}

function renderToolbar(totalSlides) {
  return `<div class="viewer__toolbar">
    <div class="viewer__controls">
      <button class="viewer__button" type="button" id="prevSlide">Previous</button>
      <button class="viewer__button" type="button" id="nextSlide">Next</button>
      <span class="viewer__status" id="slideStatus">Slide 1 / ${totalSlides}</span>
    </div>
    <button class="viewer__button" type="button" id="downloadPdf">Download as PDF</button>
  </div>`;
}

function renderPreviewScript() {
  return `<script>
    const slides = Array.from(document.querySelectorAll('[data-slide]'));
    const status = document.getElementById('slideStatus');
    let current = 0;

    function showSlide(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      slides[current].scrollIntoView({ behavior: 'smooth', block: 'center' });
      status.textContent = 'Slide ' + (current + 1) + ' / ' + slides.length;
    }

    document.getElementById('prevSlide').addEventListener('click', () => showSlide(current - 1));
    document.getElementById('nextSlide').addEventListener('click', () => showSlide(current + 1));
    document.getElementById('downloadPdf').addEventListener('click', () => window.print());
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showSlide(current - 1);
      if (event.key === 'ArrowRight') showSlide(current + 1);
    });
  </script>`;
}

function renderSlide(slide, position, total, brand) {
  const variant = slide.variant || 'body';
  const bodyOrSubhead = variant === 'body'
    ? `<div class="asset__card"><div class="asset__body">${withBreaks(slide.body || '')}</div></div>`
    : `<div class="asset__subhead">${withBreaks(slide.subhead || '')}</div>`;

  const cta = variant === 'cta' && slide.cta
    ? `<div class="asset__cta">${escapeHtml(slide.cta)}</div>`
    : '';

  return `<section class="asset asset--${escapeHtml(variant)}" data-slide="${position}">
    <div class="asset__header">
      <div class="asset__pretitle">${escapeHtml(brand.pretitle || brand.name)}</div>
      <div class="asset__logo">${escapeHtml(brand.logoText || brand.name)}</div>
    </div>
    <div class="asset__main">
      <div class="asset__headline">${withBreaks(slide.headline || '')}</div>
      ${bodyOrSubhead}
    </div>
    <div class="asset__footer">
      <div class="asset__meta">Slide ${position} / ${total}</div>
      ${cta}
    </div>
  </section>`;
}

function withBreaks(value) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
