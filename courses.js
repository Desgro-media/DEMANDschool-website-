/* ============================================================
   DEMAND SCHOOL — courses.js
   Behavior for the individual course detail pages (courses/*.html).
   Loaded after main.js, which already handles the shared navbar,
   mobile menu, back-to-top and page loader on these pages too.
   ============================================================ */

'use strict';

/* ── Scroll-reveal stagger for curriculum modules & outcome rows ── */
(function initCourseStagger() {
  const targets = document.querySelectorAll('.cd-module, .cd-outcome-item');
  if (!targets.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Array.from(targets).indexOf(e.target);
      setTimeout(() => e.target.classList.add('row-in'), (i % 12) * 60);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
})();

/* ── FAQ accordion ── */
(function initCourseFaq() {
  const items = document.querySelectorAll('.cd-faq-item');
  if (!items.length) return;
  items.forEach(item => {
    const btn = item.querySelector('.cd-faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      items.forEach(other => other.classList.remove('open'));
      if (willOpen) item.classList.add('open');
    });
  });
})();

/* ── Sticky enroll bar — shows once the hero scrolls out of view ── */
(function initStickyBar() {
  const bar = document.getElementById('cdStickyBar');
  const hero = document.querySelector('.cd-hero');
  if (!bar || !hero) return;
  const io = new IntersectionObserver(([entry]) => {
    bar.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });
  io.observe(hero);
})();

/* ── Download Brochure — print the page itself, chrome stripped
   out and colors flipped for paper via the @media print rules
   in courses.css. Also auto-triggers on arrival from the home
   page's "Request Brochure" modal button (?brochure=1). ── */
(function initDownloadBrochure() {
  const buttons = document.querySelectorAll('.cd-download-btn');
  if (buttons.length) buttons.forEach(btn => btn.addEventListener('click', () => window.print()));

  if (new URLSearchParams(location.search).get('brochure') === '1') {
    window.addEventListener('load', () => setTimeout(() => window.print(), 300));
  }
})();
