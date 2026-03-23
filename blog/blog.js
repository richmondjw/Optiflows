/* ================================================================
   OPTIFLOWS — BLOG.JS
   Dynamic blog engine. Reads posts/manifest.json, renders cards,
   handles category filtering and stagger animation.
   
   HOW TO ADD A NEW POST:
   1. Open posts/manifest.json
   2. Add a new object to the top of the array:
      {
        "slug": "your-post-slug",
        "title": "Your post title",
        "excerpt": "A short summary of the post...",
        "category": "Category Name",
        "date": "2026-04-01",
        "readTime": "5 min",
        "featured": false
      }
   3. Deploy. That's it.

   Set "featured": true on up to 2 posts for hero placement.
   ================================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('blogGrid');
  const countEl = document.getElementById('postCount');
  const filterWrap = document.getElementById('filterCategories');

  if (!grid) return;

  // ——— Arrow SVG (northeast) ———
  const arrowSVG = `<svg class="PostCard-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14L14 6M14 6H7M14 6v7"/></svg>`;

  // ——— Format date ———
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ——— Build a post card ———
  function createCard(post, index, isFeatured, featuredIndex, regularIndex) {
    const card = document.createElement('a');
    card.href = `./posts/${post.slug}.html`;
    card.className = 'PostCard';
    card.setAttribute('data-category', post.category);

    // Apply layout class
    if (isFeatured) {
      card.classList.add(`PostCard--featured-${featuredIndex}`);
    } else {
      // Cycle through row patterns for asymmetry
      const pattern = regularIndex % 7;
      card.classList.add('PostCard--regular');
      card.classList.add(`PostCard--row-${pattern}`);

      // Every 5th regular post gets accent treatment
      if (regularIndex > 0 && regularIndex % 5 === 0) {
        card.classList.add('PostCard--accent');
      }
    }

    // Stagger animation
    card.style.animationDelay = `${index * 0.06}s`;

    card.innerHTML = `
      <div class="PostCard-top">
        <div class="PostCard-category">${post.category}</div>
        <div class="PostCard-title">${post.title}</div>
        <div class="PostCard-excerpt">${post.excerpt}</div>
      </div>
      <div class="PostCard-bottom">
        <div class="PostCard-meta">${formatDate(post.date)} &middot; ${post.readTime}</div>
        ${arrowSVG}
      </div>
    `;

    return card;
  }

  // ——— Render posts ———
  function renderPosts(posts, filter) {
    grid.innerHTML = '';

    const filtered = filter === 'all'
      ? posts
      : posts.filter(p => p.category === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="BlogEmpty">
          <svg class="BlogEmpty-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="20"/><path d="M16 20h16M16 28h8"/></svg>
          <div class="BlogEmpty-text">No articles in this category yet.</div>
        </div>`;
      countEl.textContent = '0';
      return;
    }

    countEl.textContent = filtered.length;

    let featuredCount = 0;
    let regularCount = 0;

    filtered.forEach((post, i) => {
      const isFeatured = post.featured && filter === 'all' && featuredCount < 2;
      const card = createCard(
        post, i,
        isFeatured,
        isFeatured ? featuredCount : -1,
        isFeatured ? -1 : regularCount
      );
      grid.appendChild(card);

      if (isFeatured) featuredCount++;
      else regularCount++;
    });
  }

  // ——— Build category filters ———
  function buildFilters(posts) {
    const categories = [...new Set(posts.map(p => p.category))].sort();

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'BlogFilter-tag';
      btn.dataset.category = cat;
      btn.textContent = cat;
      filterWrap.appendChild(btn);
    });

    // Filter click handler
    filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.BlogFilter-tag');
      if (!btn) return;

      filterWrap.querySelectorAll('.BlogFilter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderPosts(posts, btn.dataset.category);
    });
  }

  // ——— Load manifest ———
  fetch('./posts/manifest.json')
    .then(res => {
      if (!res.ok) throw new Error('Manifest not found');
      return res.json();
    })
    .then(posts => {
      // Sort by date descending
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      buildFilters(posts);
      renderPosts(posts, 'all');
    })
    .catch(err => {
      console.error('Blog engine error:', err);
      grid.innerHTML = `
        <div class="BlogEmpty">
          <svg class="BlogEmpty-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="20"/><path d="M24 16v8M24 32h.01"/></svg>
          <div class="BlogEmpty-text">Could not load articles. Check posts/manifest.json.</div>
        </div>`;
    });

})();
