(function () {
  'use strict';

  var header = document.querySelector('[data-of-site-header]');
  var toggle = document.querySelector('[data-of-menu-toggle]');
  var mobileNav = document.querySelector('[data-of-mobile-nav]');

  if (!header) return;

  function closeMenu(returnFocus) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('of-menu-open');
    if (returnFocus) toggle.focus();
  }

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 28);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
      mobileNav.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('of-menu-open', willOpen);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });
  }
})();
