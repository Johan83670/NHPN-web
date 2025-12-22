document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }
});

// Hero slideshow auto-rotation (ne pas dupliquer si déjà présent)
document.addEventListener('DOMContentLoaded', function () {
  const hero = document.querySelector('.hero');
  const slides = Array.from(document.querySelectorAll('.hero-slideshow .slide'));
  if (!hero || !slides.length) return;

  const intervalMs = 6000; // durée d'affichage d'une image
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = null;

  function setActiveSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (prefersReduced.matches || slides.length <= 1) return;
    timer = setInterval(() => {
      current = (current + 1) % slides.length;
      setActiveSlide(current);
    }, intervalMs);
  }

  // init
  setActiveSlide(current);
  startAutoPlay();

  // pause on hover / touch / focus, resume on leave
  const pauseEvents = ['mouseenter', 'touchstart', 'focusin'];
  const resumeEvents = ['mouseleave', 'touchend', 'focusout'];
  pauseEvents.forEach(evt => hero.addEventListener(evt, stopAutoPlay));
  resumeEvents.forEach(evt => hero.addEventListener(evt, startAutoPlay));

  // respect prefers-reduced-motion changes and tab visibility
  prefersReduced.addEventListener('change', startAutoPlay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });
});

// synchronous before/after slideshows: advance all groups at once
document.addEventListener('DOMContentLoaded', function () {
  const groups = Array.from(document.querySelectorAll('.before-after'));
  if (!groups.length) return;

  // build per-group arrays of items and ensure same length
  const groupData = groups.map(g => {
    const beforeItems = Array.from(g.querySelectorAll('.ba-track.ba-before .ba-item'));
    const afterItems  = Array.from(g.querySelectorAll('.ba-track.ba-after .ba-item'));
    const len = Math.min(beforeItems.length, afterItems.length);
    // hide extras if lengths mismatch
    beforeItems.slice(len).forEach(el => el.style.display = 'none');
    afterItems.slice(len).forEach(el => el.style.display = 'none');
    return { el: g, before: beforeItems.slice(0, len), after: afterItems.slice(0, len), len };
  });

  // global index
  let idx = 0;
  const duration = 6000; // ms
  const transitionMs = 600; // match CSS transition

  // helper to show index on all groups
  function showIndex(i) {
    groupData.forEach(gd => {
      const n = gd.len;
      if (n === 0) return;
      const j = i % n;
      // deactivate all
      gd.before.forEach((it, k) => {
        it.classList.toggle('active', k === j);
      });
      gd.after.forEach((it, k) => {
        it.classList.toggle('active', k === j);
      });
    });
  }

  // init: add active class to first slide
  groupData.forEach(gd => {
    if (gd.len > 0) {
      gd.before.forEach((it, k) => it.classList.toggle('active', k === 0));
      gd.after.forEach((it, k) => it.classList.toggle('active', k === 0));
    }
  });

  // auto-advance respecting prefers-reduced-motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    let timer = setInterval(() => {
      idx = (idx + 1) % (groupData.reduce((m, g) => Math.max(m, g.len), 0) || 1);
      showIndex(idx);
    }, duration);

    // optional: pause on hover for any group
    groups.forEach(g => {
      g.addEventListener('mouseenter', () => clearInterval(timer));
      g.addEventListener('mouseleave', () => { timer = setInterval(() => { idx = (idx + 1) % (groupData.reduce((m, g) => Math.max(m, g.len), 0) || 1); showIndex(idx); }, duration); });
    });
  }
});