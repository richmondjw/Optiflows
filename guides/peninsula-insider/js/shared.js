// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

window.closeMenu = function() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  navMobile.classList.remove('open');
};

hamburger.addEventListener('click', function(e) {
  e.stopPropagation();
  const isOpen = navMobile.classList.contains('open');
  if (isOpen) {
    window.closeMenu();
  } else {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navMobile.classList.add('open');
  }
});

document.addEventListener('click', function(e) {
  if (navMobile.classList.contains('open') &&
      !navMobile.contains(e.target) &&
      !hamburger.contains(e.target)) {
    window.closeMenu();
  }
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// ===== ACTIVE NAV (pathname-based for multi-page) =====
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const hash = window.location.hash;

  const pageMap = {
    'whats-on.html': ['whats-on.html', 'whats-on.html#april'],
    'stay.html': ['stay.html'],
    'eat.html': ['eat.html'],
    'wine.html': ['wine.html'],
    'explore.html': ['explore.html', 'explore.html#do', 'explore.html#walks', 'explore.html#beaches', 'explore.html#gems'],
    'itinerary.html': ['itinerary.html']
  };

  document.querySelectorAll('.nav-dropdown a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('#')[0] || 'index.html';
    const isCurrentPage = linkPage === path || (path === '' && linkPage === 'index.html');
    if (isCurrentPage) {
      link.classList.add('active');
      const parentLi = link.closest('li');
      if (parentLi) {
        const trigger = parentLi.querySelector('.nav-group-trigger');
        if (trigger) trigger.style.color = 'var(--terra)';
      }
    }
  });
})();

// ===== GENERIC FILTER =====
window.filterCards = function(containerId, dataAttr, value, filterBarId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('[data-' + dataAttr + ']').forEach(el => {
    el.style.display = (value === 'all' || el.dataset[toCamelCase(dataAttr)] === value) ? '' : 'none';
  });
  if (filterBarId) {
    document.querySelectorAll('#' + filterBarId + ' .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  }
};

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// ===== COLLAPSIBLE TIERS =====
document.querySelectorAll('.tier-section').forEach((section, i) => {
  const header = section.querySelector('.tier-header');
  if (!header) return;
  if (i > 0) {
    section.classList.add('collapsed');
    header.classList.add('collapsed');
  }
  header.addEventListener('click', () => {
    section.classList.toggle('collapsed');
    header.classList.toggle('collapsed');
  });
});

// ===== CROSS-PAGE SEARCH =====
(function() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const trigger = document.getElementById('searchTrigger');
  let activeIdx = -1;
  let searchIndex = null;

  function loadIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    const base = document.querySelector('script[src*="shared.js"]');
    const jsPath = base ? base.src.replace('shared.js', 'search-index.json') : 'js/search-index.json';
    return fetch(jsPath)
      .then(r => r.json())
      .then(data => { searchIndex = data; return data; })
      .catch(() => { searchIndex = []; return []; });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
  }

  function search(query) {
    resultsEl.innerHTML = '';
    activeIdx = -1;
    if (!query || query.length < 2) {
      resultsEl.removeAttribute('data-no-results');
      return;
    }
    if (!searchIndex) return;
    const q = query.toLowerCase();
    const matches = searchIndex.filter(item =>
      (item.title + ' ' + item.location + ' ' + item.desc + ' ' + (item.badge || '')).toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsEl.setAttribute('data-no-results', '');
      return;
    }
    resultsEl.removeAttribute('data-no-results');

    const groups = {};
    matches.forEach(m => {
      if (!groups[m.section]) groups[m.section] = [];
      groups[m.section].push(m);
    });

    Object.keys(groups).forEach(section => {
      const label = document.createElement('div');
      label.className = 'search-group-label';
      label.textContent = section;
      resultsEl.appendChild(label);

      groups[section].forEach(m => {
        const div = document.createElement('div');
        div.className = 'search-result';
        div.innerHTML = '<span class="search-result-icon">' + (m.emoji || '') + '</span>'
          + '<div class="search-result-text">'
          + '<div class="search-result-title">' + highlightMatch(m.title, query) + '</div>'
          + '<div class="search-result-meta">' + highlightMatch(m.location || '', query) + '</div>'
          + '</div>';
        div.addEventListener('click', () => goTo(m));
        resultsEl.appendChild(div);
      });
    });
  }

  function goTo(item) {
    closeSearch();
    const target = item.page + (item.anchor ? '#' + item.anchor : '');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (item.page === currentPage) {
      const el = document.getElementById(item.anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightEl(el);
      }
    } else {
      window.location.href = target;
    }
  }

  function highlightEl(el) {
    el.style.outline = '3px solid var(--terra)';
    el.style.outlineOffset = '4px';
    el.style.borderRadius = 'var(--radius)';
    el.style.transition = 'outline-color .8s';
    setTimeout(() => {
      el.style.outlineColor = 'transparent';
      setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 800);
    }, 1500);
  }

  function openSearch() {
    loadIndex().then(() => {
      overlay.classList.add('open');
      input.value = '';
      resultsEl.innerHTML = '';
      resultsEl.removeAttribute('data-no-results');
      activeIdx = -1;
      setTimeout(() => input.focus(), 50);
    });
  }

  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    activeIdx = -1;
  }

  function navigateResults(dir) {
    const items = resultsEl.querySelectorAll('.search-result');
    if (!items.length) return;
    items.forEach(i => i.classList.remove('active'));
    activeIdx += dir;
    if (activeIdx < 0) activeIdx = items.length - 1;
    if (activeIdx >= items.length) activeIdx = 0;
    items[activeIdx].classList.add('active');
    items[activeIdx].scrollIntoView({ block: 'nearest' });
  }

  trigger.addEventListener('click', openSearch);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  input.addEventListener('input', () => search(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); e.preventDefault(); }
    if (e.key === 'ArrowDown') { navigateResults(1); e.preventDefault(); }
    if (e.key === 'ArrowUp') { navigateResults(-1); e.preventDefault(); }
    if (e.key === 'Enter') {
      const items = resultsEl.querySelectorAll('.search-result');
      if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].click();
      else if (items.length) items[0].click();
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !overlay.classList.contains('open')) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });

  // On page load, check for hash and highlight target element
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightEl(el);
      }
    }, 300);
  }
})();
