/* ==========================================================================
   main.js — shared site behaviour
   Loaded on every page. Handles: mobile nav, active nav state, footer year,
   scroll-reveal animations, and animated correlation bars.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Mobile navigation toggle ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    // Menu is collapsed by default on small screens only.
    var mq = window.matchMedia('(max-width: 900px)');
    function sync() {
      if (mq.matches) {
        links.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        links.hidden = false;
      }
    }
    sync();
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);

    toggle.addEventListener('click', function () {
      var open = !links.hidden;
      links.hidden = open;
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  /* ---------- Highlight the current page in the nav ---------- */
  function initActiveLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- Footer copyright year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Scroll reveal for cards / sections ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.style.opacity = 1; });
      return;
    }

    targets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease ' + (i % 4) * 0.07 + 's, transform .55s ease ' + (i % 4) * 0.07 + 's';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animate correlation bars when visible ----------
     Usage: <div class="bar__fill" data-bar="82"></div>
  ------------------------------------------------------------- */
  function animateBars(scope) {
    var root = scope || document;
    root.querySelectorAll('[data-bar]').forEach(function (el) {
      var pct = Math.max(0, Math.min(100, parseInt(el.getAttribute('data-bar'), 10) || 0));
      el.style.width = '0%';
      // next frame so the transition fires
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.style.width = pct + '%'; });
      });
    });
  }
  // Expose for pages that inject markup dynamically (reports.js).
  window.VPI = window.VPI || {};
  window.VPI.animateBars = animateBars;

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initActiveLink();
    initYear();
    initReveal();
    animateBars();
  });
})();