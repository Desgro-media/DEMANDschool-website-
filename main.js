/* ============================================================
   DEMAND SCHOOL — main.js
   Standalone site. Does not import or depend on the Desgro Media
   portfolio's JS — all selectors/ids below are local to this page.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   Hamburger Mobile Nav
────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn  = document.getElementById('mobileNavClose');
  if (!hamburger || !mobileNav) return;

  function openNav()  { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; hamburger.classList.add('active'); }
  function closeNav() { mobileNav.classList.remove('open'); document.body.style.overflow = ''; hamburger.classList.remove('active'); }

  hamburger.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
})();

/* ──────────────────────────────────────────
   NAVBAR scroll style
────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20 ? 'rgba(0,0,0,0.99)' : 'rgba(0,0,0,0.97)';
  }, { passive: true });
})();

/* ──────────────────────────────────────────
   LOGO — click to jump back to home/top
────────────────────────────────────────── */
(function initLogoHome() {
  const logo = document.getElementById('navLogo');
  if (!logo) return;
  function goHome() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  logo.addEventListener('click', goHome);
  logo.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
  });
})();

/* ──────────────────────────────────────────
   BACK TO TOP
────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════════
   ANIMATIONS — loader · hero reveal · scroll-reveal
══════════════════════════════════════════════════════ */
(function initAnimations() {

  document.documentElement.classList.add('js-ready');

  /* ── PAGE LOADER ── */
  const loader = document.querySelector('.page-loader');

  setTimeout(() => {
    revealHero();
    if (loader) {
      loader.classList.add('exit');
      setTimeout(() => { try { loader.remove(); } catch (e) {} }, 1000);
    }
  }, 2100);

  /* ── HERO CHAR SPLIT: "DEMAND" → per-character reveal ── */
  const demandEl = document.querySelector('.hero-title-demand');
  const schoolEl = document.querySelector('.hero-title-school');
  let charInners = [];

  if (demandEl) {
    const text = demandEl.textContent.trim();
    demandEl.innerHTML = '';
    text.split('').forEach(ch => {
      const outer = document.createElement('span');
      outer.className = 'char';
      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.textContent = ch;
      outer.appendChild(inner);
      demandEl.appendChild(outer);
    });
    charInners = Array.from(demandEl.querySelectorAll('.char-inner'));
  }

  function revealHero() {
    charInners.forEach((ch, i) => {
      ch.style.animation = `char-up 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`;
    });

    const schoolDelay = charInners.length * 50 + 60;
    setTimeout(() => { if (schoolEl) schoolEl.classList.add('anim-in'); }, schoolDelay);

    const headline = document.querySelector('.hero-headline');
    const tagline  = document.querySelector('.hero-tagline');
    const ctaRow   = document.querySelector('.hero-cta-row');
    setTimeout(() => { if (headline) headline.classList.add('anim-in'); }, 340);
    setTimeout(() => { if (tagline)  tagline.classList.add('anim-in'); }, 400);
    setTimeout(() => { if (ctaRow)   ctaRow.classList.add('anim-in'); }, 460);
  }

  /* ── Generic .fade-in sections ── */
  const fadeTargets = document.querySelectorAll('.fade-in');
  const fadeIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeIO.unobserve(e.target); } });
  }, { threshold: 0.1 });
  fadeTargets.forEach(t => fadeIO.observe(t));

  /* ── Curriculum cards: staggered entrance ── */
  const curCards = document.querySelectorAll('.cur-card');
  const curIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Array.from(curCards).indexOf(e.target);
      setTimeout(() => e.target.classList.add('row-in'), i * 80);
      curIO.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  curCards.forEach(c => curIO.observe(c));

})();

const COURSE_LABELS = {
  mma: 'Modern Marketing Architect (MMA)',
  aic: 'AI Contentology (AIC)',
  cc: 'Content Creation (CC)'
};

/* ──────────────────────────────────────────
   Contact form: pre-select the course when a course
   detail page's "Enroll Now" link lands here with
   ?enroll=mma|aic|cc in the URL
────────────────────────────────────────── */
(function initEnrollPrefill() {
  const select = document.querySelector('#enquiryForm select[name="course"]');
  if (!select) return;
  const param = new URLSearchParams(location.search).get('enroll');
  if (param && COURSE_LABELS[param]) select.value = COURSE_LABELS[param];
})();

/* ──────────────────────────────────────────
   Curriculum cards: clicking the arrow opens a quick-view
   modal (details + brochure/enroll/explore) instead of
   navigating straight to the course page
────────────────────────────────────────── */
(function initCourseModal() {
  const modal      = document.getElementById('courseModal');
  const titleEl    = document.getElementById('courseModalTitle');
  const descEl     = document.getElementById('courseModalDesc');
  const formatEl   = document.getElementById('courseModalFormat');
  const durationEl = document.getElementById('courseModalDuration');
  const modulesEl  = document.getElementById('courseModalModules');
  const afterEl    = document.getElementById('courseModalAfter');
  const brochureBtn = document.getElementById('courseModalBrochure');
  const enrollBtn  = document.getElementById('courseModalEnroll');
  const exploreLink = document.getElementById('courseModalExplore');
  const triggers   = document.querySelectorAll('.cur-explore');
  if (!modal || !triggers.length) return;

  let activePage = '#';
  let activeCourse = '';

  function openModal(card, btn) {
    activeCourse = btn.dataset.course;
    activePage = btn.dataset.page;
    titleEl.innerHTML = card.querySelector('.cur-title').innerHTML;
    descEl.innerHTML = card.querySelector('.cur-desc').innerHTML;
    formatEl.textContent = btn.dataset.format;
    durationEl.textContent = btn.dataset.duration;
    modulesEl.textContent = btn.dataset.modules;
    afterEl.textContent = btn.dataset.after;
    exploreLink.href = activePage;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cur-card');
      if (!card) return;
      openModal(card, btn);
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  brochureBtn.addEventListener('click', () => { location.href = activePage + '?brochure=1'; });

  enrollBtn.addEventListener('click', () => {
    const select = document.querySelector('#enquiryForm select[name="course"]');
    if (select && COURSE_LABELS[activeCourse]) select.value = COURSE_LABELS[activeCourse];
    closeModal();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════════
   STATS: entrance + count-up
══════════════════════════════════════════════════════ */
(function initStats() {
  const rows = document.querySelectorAll('.stat-row');
  if (!rows.length) return;

  function runRowCounter(row) {
    const target = parseInt(row.dataset.val, 10);
    const numEl  = row.querySelector('.stat-num');
    const sufEl  = row.querySelector('.stat-suf');
    if (!numEl || isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.floor(ease * target);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        numEl.textContent = target;
        if (sufEl) {
          sufEl.classList.add('pop');
          setTimeout(() => sufEl.classList.remove('pop'), 380);
        }
      }
    })(start);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Array.from(rows).indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('row-in');
        runRowCounter(e.target);
      }, i * 120);
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  rows.forEach(r => io.observe(r));
})();

/* ──────────────────────────────────────────
   Enquiry form — static site, no backend, so this
   opens the visitor's email client with the details
   pre-filled rather than pretending to submit anywhere.
────────────────────────────────────────── */
(function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  const note = document.getElementById('efNote');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();
    const qualification = data.get('qualification') || '';
    const course = data.get('course') || '';

    const subject = `Course Enquiry — ${course}`;
    const body = `Name: ${name}\nPhone: ${phone}\nAcademic Qualification: ${qualification}\nCourse: ${course}`;
    const mailto = `mailto:hello@demandschool.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    if (note) note.textContent = 'Opening your email app to send this to us…';
  });
})();

/* ══════════════════════════════════════════════════════
   TESTIMONIALS MARQUEE — duplicate content once for a
   seamless CSS translateX(-50%) loop
══════════════════════════════════════════════════════ */
(function initTestiMarquee() {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const clone = track.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  Array.from(clone.children).forEach(child => track.appendChild(child));
})();

/* ══════════════════════════════════════════════════════
   OUTCOMES SPOTLIGHT — one real result expanded large, the
   rest as thumbnails; rotates automatically, or on click the
   clicked thumbnail takes the spotlight
══════════════════════════════════════════════════════ */
(function initOutcomesSpotlight() {
  const wrap     = document.getElementById('outcomesSpotlight');
  const mediaWrapEl = document.getElementById('spotlightMediaWrap');
  const thumbsEl = document.getElementById('spotlightThumbs');
  const catEl   = document.getElementById('spotlightCat');
  const nameEl  = document.getElementById('spotlightName');
  const descEl  = document.getElementById('spotlightDesc');
  const linkEl  = document.getElementById('spotlightLink');
  if (!wrap || !mediaWrapEl || !thumbsEl) return;

  const ITEMS = [
    {
      shortName: 'Lulu',
      media: { type: 'image', src: 'realresults/lulu.jpg', alt: 'Lulu' },
      cat: 'Content Creation · Student',
      name: 'Lulu crossed 6K+ followers while still studying',
      desc: 'Juggling coursework and content, Lulu used the platform and storytelling frameworks from the program to build a consistent posting rhythm — growing a personal page past 6,000 followers before she’d even graduated.',
      link: 'https://www.instagram.com/being.luluuu/',
      linkText: 'View on Instagram'
    },
    {
      shortName: 'AI Contentology',
      media: { type: 'video', src: 'realresults/bammbuzz-tissue-ad.mp4' },
      cat: 'AI Contentology · Freelance Work',
      name: 'AI Contentology students are already freelancing for real brands',
      desc: 'This Bammbuzz tissue ad was produced end-to-end using the AI content workflows taught in the program — proof that graduates are landing paid freelance briefs and earning from client work before the course even ends.',
      link: '#curriculum',
      linkText: 'Explore the course'
    },
    {
      shortName: 'Dr. Muneer',
      media: { type: 'image', src: 'realresults/dr-pk-muneer.jpg', alt: 'Dr. PK Muneer' },
      cat: 'Content Creation · Personal Brand',
      name: 'Dr. Muneer gained 20K+ followers after the Content Creation program',
      desc: 'A busy working professional, Dr. Muneer used the platform and content strategy frameworks from the program to turn an inconsistent presence into a fast-growing personal brand — crossing 20,000 followers in the process.',
      link: 'https://www.instagram.com/dr.pk.muneer/',
      linkText: 'View on Instagram'
    },
    {
      shortName: 'Dilna',
      media: { type: 'image', src: 'realresults/dilna-najeeb.png', alt: 'Dilna Najeeb' },
      cat: 'Business Growth · Founder',
      name: 'Dilna is scaling her business with expert mentorship',
      desc: 'As Founder & CEO of Tibbway Medical Tourism Company, Dilna joined the program to sharpen her brand and content strategy — using 1:1 mentorship to take her business into its next phase of growth.',
      link: 'https://www.instagram.com/reel/DaSX3dZvAhJ/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==',
      linkText: 'View the reel'
    }
  ];

  // Persistent media nodes: created once so the video keeps playing
  // uninterrupted as it's moved between the main slot and a thumb slot.
  const nodes = ITEMS.map(item => {
    let el;
    if (item.media.type === 'video') {
      el = document.createElement('video');
      el.src = item.media.src;
      el.autoplay = true;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
    } else {
      el = document.createElement('img');
      el.src = item.media.src;
      el.alt = item.media.alt || '';
      el.loading = 'lazy';
    }
    el.className = 'spotlight-media';
    return el;
  });

  let order = ITEMS.map((_, i) => i);
  let timer = null;

  function buildThumb(idx) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'spotlight-thumb spotlight-thumb-enter';
    btn.setAttribute('aria-label', 'Show ' + ITEMS[idx].shortName);
    btn.appendChild(nodes[idx]);
    const label = document.createElement('span');
    label.className = 'spotlight-thumb-label';
    label.textContent = ITEMS[idx].shortName;
    btn.appendChild(label);
    btn.addEventListener('click', () => focusItem(idx));
    return btn;
  }

  function render() {
    const mainIdx = order[0];

    mediaWrapEl.classList.remove('spotlight-visual-enter');
    void mediaWrapEl.offsetWidth;
    mediaWrapEl.appendChild(nodes[mainIdx]);
    mediaWrapEl.classList.add('spotlight-visual-enter');

    thumbsEl.innerHTML = '';
    order.slice(1).forEach(idx => thumbsEl.appendChild(buildThumb(idx)));

    const item = ITEMS[mainIdx];
    catEl.textContent = item.cat;
    nameEl.textContent = item.name;
    descEl.textContent = item.desc;
    linkEl.textContent = item.linkText + ' →';
    linkEl.href = item.link;
    if (/^https?:/.test(item.link)) {
      linkEl.target = '_blank';
      linkEl.rel = 'noopener';
    } else {
      linkEl.removeAttribute('target');
      linkEl.removeAttribute('rel');
    }
  }

  function focusItem(idx) {
    const pos = order.indexOf(idx);
    if (pos <= 0) return;
    order.splice(pos, 1);
    order.unshift(idx);
    render();
    resetTimer();
  }

  function rotate() {
    if (wrap.matches(':hover')) return;
    order.push(order.shift());
    render();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(rotate, 3000);
  }

  render();
  resetTimer();

  wrap.addEventListener('mouseenter', () => clearInterval(timer));
  wrap.addEventListener('mouseleave', resetTimer);
})();

/* ══════════════════════════════════════════════════════
   FILM STRIP — cursor-speed control + per-card 3D tilt
══════════════════════════════════════════════════════ */
(function initFilmStrip() {
  const row   = document.querySelector('.filmstrip-row');
  const inner = document.querySelector('.filmstrip-inner');
  const track = document.querySelector('.filmstrip-track');
  if (!row || !inner || !track) return;

  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  inner.appendChild(clone);

  let activeFrame = null;
  let tiltRect = null;

  inner.addEventListener('mousemove', e => {
    const frame = e.target.closest('.filmstrip-frame');
    if (!frame) return;
    if (frame !== activeFrame) {
      if (activeFrame) activeFrame.style.transform = '';
      activeFrame = frame;
      tiltRect = frame.getBoundingClientRect();
    }
    const x = (e.clientX - tiltRect.left) / tiltRect.width - 0.5;
    const y = (e.clientY - tiltRect.top) / tiltRect.height - 0.5;
    frame.style.transform = `perspective(480px) rotateY(${x * 18}deg) rotateX(${-y * 12}deg) scale(1.05)`;
  }, { passive: true });

  inner.addEventListener('mouseleave', () => {
    if (activeFrame) { activeFrame.style.transform = ''; activeFrame = null; }
    tiltRect = null;
  });

  const BASE = 0.65;
  let speed = BASE;
  let target = BASE;
  let rowRect = null;

  const resizeObs = new ResizeObserver(() => { rowRect = null; });
  resizeObs.observe(row);

  row.addEventListener('mousemove', e => {
    if (!rowRect) rowRect = row.getBoundingClientRect();
    const rx = (e.clientX - rowRect.left) / rowRect.width;
    target = BASE * (0.1 + rx * 2.1);
  }, { passive: true });

  row.addEventListener('mouseleave', () => { target = BASE; rowRect = null; });

  const trackW = track.scrollWidth;
  let offset = 0;
  (function loop() {
    speed += (target - speed) * 0.06;
    offset += speed;
    if (offset >= trackW) offset -= trackW;
    if (offset < 0) offset += trackW;
    inner.style.transform = `translateX(${-offset}px)`;
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════════════════════
   3D ROTATING RING — mentor carousel
══════════════════════════════════════════════════════ */
(function initRing() {
  const track    = document.getElementById('ringTrack');
  const viewport = document.getElementById('ringViewport');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.mentor-card'));
  const N = cards.length;

  const isMobile  = () => window.innerWidth < 768;
  const getRadius = () => isMobile() ? 220 : 360;
  const getCardW  = () => isMobile() ? 120 : 175;
  const getCardH  = () => isMobile() ? 160 : 230;

  const TILT_X = -14;
  const TILT_Z = -18;

  const POP_Z     = 60;
  const POP_SCALE = 1.18;

  const HOVER_IN_MS  = 480;
  const HOVER_OUT_MS = 360;

  const FRICTION   = 0.96;
  const IDLE_SPEED = 0.28;
  const MAX_VEL    = 8;
  const IDLE_NUDGE = IDLE_SPEED * (1 / FRICTION - 1);

  function positionCards() {
    const r  = getRadius();
    const cw = getCardW();
    const ch = getCardH();
    cards.forEach((card, i) => {
      const angle = (360 / N) * i;
      card.style.width      = cw + 'px';
      card.style.height     = ch + 'px';
      card.style.marginLeft = (-cw / 2) + 'px';
      card.style.marginTop  = (-ch / 2) + 'px';
      card.dataset.baseAngle = String(angle);
      card.style.transform = `rotateY(${angle}deg) translateZ(${r}px)`;
    });
  }

  positionCards();
  window.addEventListener('resize', positionCards, { passive: true });

  let currentAngle = 0;
  let velocity = 0;
  let dragging = false;

  let hoveredCard = null;
  let hoverProgress = 0;
  let hoverDir = 0;
  let exitingCard = null;
  let exitProgress = 0;
  let hoverExitTimer = null;
  let prevTime = 0;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function setRingAngle(deg) {
    track.style.transform = `rotateX(${TILT_X}deg) rotateZ(${TILT_Z}deg) rotateY(${deg}deg)`;
  }

  function buildHoverTransform(p) {
    const ep = easeOutCubic(p);
    return `translateZ(${POP_Z * ep}px) scale(${1 + (POP_SCALE - 1) * ep})`;
  }

  function clearHover() {
    if (hoverExitTimer) { clearTimeout(hoverExitTimer); hoverExitTimer = null; }
    if (exitingCard) {
      const inner = exitingCard._inner;
      if (inner) inner.style.transform = '';
      exitingCard.classList.remove('card-hovered');
      exitingCard = null;
      exitProgress = 0;
    }
    if (!hoveredCard) return;
    const inner = hoveredCard._inner;
    if (inner) inner.style.transform = '';
    hoveredCard.classList.remove('card-hovered');
    hoveredCard = null;
    hoverDir = 0;
    hoverProgress = 0;
  }

  function startHoverEnter(card) {
    if (dragging) return;
    if (hoverExitTimer) { clearTimeout(hoverExitTimer); hoverExitTimer = null; }

    if (hoveredCard === card) {
      hoverDir = 1;
      card.classList.add('card-hovered');
      return;
    }

    if (hoveredCard) {
      if (exitingCard) {
        const pi = exitingCard._inner;
        if (pi) pi.style.transform = '';
        exitingCard.classList.remove('card-hovered');
      }
      exitingCard = hoveredCard;
      exitingCard._inner = hoveredCard._inner;
      exitProgress = hoverProgress;
      exitingCard.classList.remove('card-hovered');
      hoveredCard = null;
      hoverProgress = 0;
      hoverDir = 0;
    }

    hoveredCard = card;
    hoveredCard._inner = card.querySelector('.card-inner');
    hoverDir = 1;
    card.classList.add('card-hovered');
  }

  function startHoverExit(card) {
    if (!hoveredCard || hoveredCard !== card) return;
    if (hoverExitTimer) clearTimeout(hoverExitTimer);
    hoverExitTimer = setTimeout(() => {
      hoverExitTimer = null;
      if (!hoveredCard || hoveredCard !== card) return;
      hoverDir = -1;
      hoveredCard.classList.remove('card-hovered');
    }, 60);
  }

  function finishHoverExit() {
    if (!hoveredCard) return;
    const inner = hoveredCard._inner;
    if (inner) inner.style.transform = '';
    hoveredCard.classList.remove('card-hovered');
    hoveredCard = null;
    hoverDir = 0;
    hoverProgress = 0;
  }

  let lastDragX = 0;
  let lastDragT = 0;

  function onDragStart(x) {
    clearHover();
    dragging = true;
    lastDragX = x;
    lastDragT = performance.now();
    velocity = 0;
  }

  function onDragMove(x) {
    if (!dragging) return;
    const dx = x - lastDragX;
    const dt = performance.now() - lastDragT;
    velocity = Math.max(-MAX_VEL, Math.min(MAX_VEL, (dx / (dt || 1)) * 1.3));
    currentAngle += dx * 0.15;
    setRingAngle(currentAngle);
    lastDragX = x;
    lastDragT = performance.now();
  }

  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
  }

  viewport.addEventListener('mousedown', e => { onDragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) onDragMove(e.clientX); });
  window.addEventListener('mouseup', onDragEnd);

  viewport.addEventListener('touchstart', e => { onDragStart(e.touches[0].clientX); }, { passive: true });
  viewport.addEventListener('touchmove', e => { if (dragging) onDragMove(e.touches[0].clientX); }, { passive: true });
  viewport.addEventListener('touchend', onDragEnd);

  viewport.addEventListener('mouseleave', () => { if (hoveredCard) startHoverExit(hoveredCard); });

  let inView = false;
  const visIO = new IntersectionObserver(en => { inView = en[0].isIntersecting; }, { threshold: 0.2 });
  visIO.observe(viewport);

  window.addEventListener('wheel', e => {
    if (!inView) return;
    velocity = Math.max(-MAX_VEL, Math.min(MAX_VEL, velocity + e.deltaY * 0.015));
  }, { passive: true });

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!inView) return;
    const dy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    velocity = Math.max(-MAX_VEL, Math.min(MAX_VEL, velocity + dy * 0.04));
  }, { passive: true });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => startHoverEnter(card));
    card.addEventListener('mouseleave', () => startHoverExit(card));
  });

  function masterLoop(now) {
    const dt = prevTime ? Math.min(now - prevTime, 50) : 16;
    prevTime = now;

    if (!dragging && !hoveredCard && velocity < IDLE_SPEED) {
      velocity = Math.min(IDLE_SPEED, velocity + IDLE_NUDGE);
    }

    if (!dragging) velocity *= FRICTION;
    currentAngle += velocity;
    setRingAngle(currentAngle);

    if (exitingCard) {
      exitProgress = Math.max(0, exitProgress - dt / HOVER_OUT_MS);
      const inner = exitingCard._inner;
      if (exitProgress === 0) {
        if (inner) inner.style.transform = '';
        exitingCard = null;
      } else if (inner) {
        inner.style.transform = buildHoverTransform(exitProgress);
      }
    }

    if (hoverDir !== 0 || hoveredCard) {
      if (hoverDir === 1) {
        hoverProgress = Math.min(1, hoverProgress + dt / HOVER_IN_MS);
      } else if (hoverDir === -1) {
        hoverProgress = Math.max(0, hoverProgress - dt / HOVER_OUT_MS);
        if (hoverProgress === 0) { finishHoverExit(); }
      }
      if (hoveredCard) {
        const inner = hoveredCard._inner;
        if (inner) inner.style.transform = buildHoverTransform(hoverProgress);
      }
    }

    requestAnimationFrame(masterLoop);
  }

  setRingAngle(0);
  requestAnimationFrame(masterLoop);
})();

/* ══════════════════════════════════════════════════════
   3D GLASS ASTERISKS — Three.js WebGL hero backdrop
══════════════════════════════════════════════════════ */
(function initAsterisk3D() {
  if (typeof THREE === 'undefined') return;

  function makeAstShape(rOut, rIn) {
    const arms = 6;
    const step = (2 * Math.PI) / arms;
    const sh = new THREE.Shape();

    const waist0A = -Math.PI / 2 - step / 2;
    sh.moveTo(rIn * Math.cos(waist0A), rIn * Math.sin(waist0A));

    for (let i = 0; i < arms; i++) {
      const tipA = i * step - Math.PI / 2;
      const nextWaistA = tipA + step / 2;
      sh.quadraticCurveTo(
        rOut * Math.cos(tipA) * 1.12,
        rOut * Math.sin(tipA) * 1.12,
        rIn * Math.cos(nextWaistA),
        rIn * Math.sin(nextWaistA)
      );
    }

    sh.closePath();
    return sh;
  }

  /* Mounts the same pair of floating glass asterisks (mouse-parallax,
     slow rotation, fade-in reveal, pause when off-screen) into any
     hero container. `scale` shrinks both the geometry and the float
     range together, so a smaller mount still keeps its shapes inside
     its own (smaller) hero instead of drifting out of it. `biasX`/`biasY`
     shift the whole pair so they clear left-aligned copy instead of
     sitting centered the way the homepage's centered hero wants them. */
  function mountAsterisks(hero, cBack, cFront, scale, biasX, biasY) {
    if (!hero || !cBack || !cFront) return;
    biasX = biasX || 0;
    biasY = biasY || 0;

    function buildScene(canvas, cfg) {
      const W = hero.offsetWidth, H = hero.offsetHeight;
      const isMobile = W < 768;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 2.2;
      renderer.shadowMap.enabled = false;

      const scene = new THREE.Scene();
      const fov = isMobile ? 62 : 42;
      const camZ = isMobile ? 6.5 : 10;
      const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 100);
      camera.position.z = camZ;

      const geo = new THREE.ExtrudeGeometry(makeAstShape(cfg.rOut, cfg.rIn), {
        depth: cfg.depth,
        bevelEnabled: true,
        bevelThickness: cfg.bevel,
        bevelSize: cfg.bevel * 0.85,
        bevelSegments: 20,
        curveSegments: 56,
      });
      geo.center();

      /* Dark glossy body, green emissive glow in shadowed areas */
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x181818,
        emissive: 0x2ab460,
        emissiveIntensity: cfg.emissive,
        metalness: 0.05,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 1.0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0x1a2620, 4));

      const key = new THREE.PointLight(0xffffff, 80, 50);
      key.position.set(-4, 6, 8);
      scene.add(key);

      const key2 = new THREE.PointLight(0xeaffef, 40, 45);
      key2.position.set(5, 3, 6);
      scene.add(key2);

      /* Green fill — signature green glow on edges */
      const greenFront = new THREE.PointLight(0x2ab460, 20, 25);
      greenFront.position.set(0, -3, 5);
      scene.add(greenFront);

      const greenBack = new THREE.PointLight(0x2ab460, 12, 20);
      greenBack.position.set(-3, 3, -5);
      scene.add(greenBack);

      const rim = new THREE.PointLight(0x224433, 8, 22);
      rim.position.set(2, -6, -3);
      scene.add(rim);

      window.addEventListener('resize', () => {
        const nW = hero.offsetWidth, nH = hero.offsetHeight;
        const nm = nW < 768;
        camera.fov = nm ? 62 : 42;
        camera.position.z = nm ? 6.5 : 10;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      }, { passive: true });

      return { renderer, scene, camera, mesh };
    }

    const back  = buildScene(cBack,  { rOut: 2.10 * scale, rIn: 0.52 * scale, depth: 0.70 * scale, bevel: 0.16 * scale, emissive: 0.30 });
    const front = buildScene(cFront, { rOut: 1.65 * scale, rIn: 0.40 * scale, depth: 0.58 * scale, bevel: 0.12 * scale, emissive: 0.18 });

    let mx = 0, my = 0;
    let smx = 0, smy = 0;
    let vmx = 0, vmy = 0;
    let inside = false;

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      inside = true;
    });
    hero.addEventListener('mouseleave', () => { inside = false; });

    let astActive = true;
    new IntersectionObserver(([e]) => { astActive = e.isIntersecting; }, { threshold: 0 }).observe(hero);

    let mob = window.innerWidth < 768;
    window.addEventListener('resize', () => { mob = window.innerWidth < 768; }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      if (!astActive) return;

      const tx = inside ? mx : 0, ty = inside ? my : 0;
      vmx = vmx * 0.72 + (tx - smx) * 0.12;
      vmy = vmy * 0.72 + (ty - smy) * 0.12;
      smx += vmx; smy += vmy;

      back.mesh.position.x  = ((mob ? -2.0 : -3.8) + smx * (mob ? 1.4 : 3.0)) * scale + biasX;
      back.mesh.position.y  = ((mob ?  0.9 :  1.4) - smy * (mob ? 1.0 : 2.0)) * scale + biasY;
      back.mesh.position.z  = mob ? 0.8 : 0;
      back.mesh.rotation.z -= 0.0024;
      back.mesh.rotation.x  = smy * 1.0;
      back.mesh.rotation.y  = smx * 0.85;
      back.renderer.render(back.scene, back.camera);

      front.mesh.position.x  = ((mob ?  1.8 :  3.2) - smx * (mob ? 1.0 : 2.0)) * scale + biasX;
      front.mesh.position.y  = ((mob ? -1.1 : -1.8) + smy * (mob ? 0.7 : 1.4)) * scale + biasY;
      front.mesh.position.z  = mob ? 0.8 : 0;
      front.mesh.rotation.z += 0.0017;
      front.mesh.rotation.x  = -smy * 0.70;
      front.mesh.rotation.y  = -smx * 0.55;
      front.renderer.render(front.scene, front.camera);
    }

    back.renderer.render(back.scene, back.camera);
    front.renderer.render(front.scene, front.camera);
    animate();

    const fadeMs = 1600;
    setTimeout(() => {
      back.renderer.render(back.scene, back.camera);
      cBack.classList.add('ast-visible');
      setTimeout(() => {
        front.renderer.render(front.scene, front.camera);
        cFront.classList.add('ast-visible');
      }, 300);
    }, fadeMs);

    document.addEventListener('touchstart', function onFirstTouch() {
      back.renderer.render(back.scene, back.camera);
      front.renderer.render(front.scene, front.camera);
      cBack.classList.add('ast-visible');
      cFront.classList.add('ast-visible');
    }, { once: true, passive: true });
  }

  mountAsterisks(
    document.getElementById('heroIntroWrap'),
    document.getElementById('astCanvasBack'),
    document.getElementById('astCanvasFront'),
    1
  );

  mountAsterisks(
    document.getElementById('cdHero'),
    document.getElementById('cdAstCanvasBack'),
    document.getElementById('cdAstCanvasFront'),
    0.4,
    2.6,
    -0.3
  );
})();
