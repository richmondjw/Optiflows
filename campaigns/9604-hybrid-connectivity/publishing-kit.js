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
    const row = document.createElement('div');
    row.className = 'card-actions';
    row.append(download('Download LinkedIn PDF ↓', `downloads/${carousel.id}-linkedin-document.pdf`));
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
