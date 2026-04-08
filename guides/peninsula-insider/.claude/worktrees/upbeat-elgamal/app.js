/* ================================================================
   OPTIFLOWS — APP.JS
   Firmus-style interactions: Lenis smooth scroll, scroll reveal,
   accordion, mobile menu, header scroll behavior. No theme toggle.
   ================================================================ */

(function () {
  'use strict';

  // ——— Lenis Smooth Scroll ———
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    touchMultiplier: 2,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ——— Scroll Reveal (staggered, firmus-style) ———
  var animateElements = document.querySelectorAll('.animate-div');
  var revealQueue = [];
  var revealTimer = null;

  function flushRevealQueue() {
    revealQueue.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('Visible');
      }, i * 120);
    });
    revealQueue = [];
    revealTimer = null;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealQueue.push(entry.target);
          observer.unobserve(entry.target);
          if (!revealTimer) {
            revealTimer = requestAnimationFrame(flushRevealQueue);
          }
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    animateElements.forEach(function (el) { observer.observe(el); });
  } else {
    animateElements.forEach(function (el) { el.classList.add('Visible'); });
  }

  // ——— Header Scroll Behavior ———
  var header = document.getElementById('header');
  var lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function () {
      var currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ——— Mobile Menu ———
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');

      var spans = mobileToggle.querySelectorAll('span');
      if (!isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.MobileMenu-link, .Button').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        var spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ——— Accordion ———
  var accordions = document.querySelectorAll('.Accordion');

  accordions.forEach(function (accordion) {
    var items = accordion.querySelectorAll('.Accordion-item');

    items.forEach(function (item) {
      var question = item.querySelector('.Accordion-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all items in this accordion
        items.forEach(function (i) { i.classList.remove('active'); });

        // Open clicked item (if it wasn't already open)
        if (!isActive) {
          item.classList.add('active');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  });

  // ——— Smooth Scroll (via Lenis) ———
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 70;
        lenis.scrollTo(target, { offset: -headerHeight });
      }
    });
  });

})();
