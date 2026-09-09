/* Publishing downloads use the same native IDs as campaign-data.js. */
(() => {
  const download = (label, href, secondary = false) => {
    const link = document.createElement('a');
    link.className = secondary ? 'mini light' : 'mini';
    link.href = href;
    link.download = '';
    link.textContent = label;
    return link;
  };
  const heroAction = document.querySelector('.hero-actions .primary');
  heroAction.href = '#downloads';
  heroAction.textContent = 'Download publishing assets';
  const navLink = document.createElement('a');
  navLink.href = '#downloads';
  navLink.textContent = 'Downloads';
  document.querySelector('.topbar nav').prepend(navLink);
  document.querySelectorAll('.show-copy').forEach(button => {
    const id = button.dataset.week;
    const row = button.closest('.card-actions');
    row.querySelectorAll('a').forEach(link => {
      const format = link.getAttribute('href').match(/-(feed|wide|square|story)\.webp$/)?.[1];
      if (format) link.href = `downloads/publishing-kit/weeks/${id}/${id}-${format}.png`;
    });
    row.prepend(download('Download post kit ↓', `downloads/${id}-publishing-kit.zip`));
    row.append(download('Caption TXT ↓', `downloads/publishing-kit/weeks/${id}/caption.txt`, true));
    const copy = document.createElement('button');
    copy.className = 'mini light copy-raw';
    copy.type = 'button';
    copy.dataset.copytext = CAMPAIGN.weeks.find(week => week.id === id).caption;
    copy.textContent = 'Copy caption';
    row.append(copy);
  });
  document.querySelectorAll('.carousel-set').forEach((article, index) => {
    const carousel = CAMPAIGN.carousels[index];
    const chooser = document.createElement('div');
    chooser.className = 'brand-chooser';
    chooser.setAttribute('role', 'group');
    chooser.setAttribute('aria-label', 'Preview brand version: ' + carousel.title);
    for (const [variant, label] of [['', 'M2M Connectivity'], ['co-branded/', 'M2M Connectivity + M2M One']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-pressed', String(!variant));
      button.addEventListener('click', () => {
        chooser.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        article.querySelectorAll('.slide-rail img').forEach((img, i) => {
          img.src = `assets/carousels/${variant}${carousel.id}-${String(i + 1).padStart(2, '0')}.webp?v=human-story-2`;
          img.alt = `${label}, slide ${i + 1}: ${carousel.slides[i].headline}`;
        });
      });
      chooser.append(button);
    }
    article.querySelector('.slide-rail').before(chooser);
    const row = document.createElement('div');
    row.className = 'card-actions';
    row.append(download('Both versions + copy ZIP ↓', `downloads/${carousel.id}-carousel-kit.zip`));
    row.append(download('Connectivity PDF ↓', `downloads/${carousel.id}-linkedin-document.pdf`, true));
    row.append(download('Both logos PDF ↓', `downloads/${carousel.id}-co-branded-linkedin-document.pdf`, true));
    row.append(download('Matching caption TXT ↓', `downloads/publishing-kit/carousels/${carousel.id}/caption.txt`, true));
    article.append(row);
  });
  document.querySelectorAll('.show-email').forEach(button => {
    const row = document.createElement('div');
    row.className = 'card-actions';
    button.before(row);
    row.append(download('Download email kit ↓', `downloads/${button.dataset.email}-email-kit.zip`), button);
  });
})();
