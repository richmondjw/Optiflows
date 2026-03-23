/* ================================================================
   OPTIFLOWS — APP.JS
   Firmus-style interactions: scroll reveal, accordion, 
   mobile menu, header scroll behavior. No theme toggle.
   ================================================================ */

(function () {
  'use strict';

  // ——— Scroll Reveal (IntersectionObserver, firmus-style) ———
  const animateElements = document.querySelectorAll('.animate-div');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('Visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => el.classList.add('Visible'));
  }

  // ——— Header Scroll Behavior ———
  const header = document.getElementById('header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ——— Mobile Menu ———
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');

      const spans = mobileToggle.querySelectorAll('span');
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
    mobileMenu.querySelectorAll('.MobileMenu-link, .Button').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ——— Accordion ———
  const accordions = document.querySelectorAll('.Accordion');

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.Accordion-item');

    items.forEach(item => {
      const question = item.querySelector('.Accordion-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items in this accordion
        items.forEach(i => i.classList.remove('active'));

        // Open clicked item (if it wasn't already open)
        if (!isActive) {
          item.classList.add('active');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  });

  // ——— Smooth Scroll ———
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
