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
  const slides = Array.from(document.querySelectorAll('.hero-slideshow .slide'));
  if (!slides.length) return;

  let current = 0;
  const intervalMs = 6000; // durée d'affichage d'une image
  slides[current].classList.add('active');

  // autoplay, respecte prefers-reduced-motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    const timer = setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, intervalMs);

    // pause on hover / touch
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => clearInterval(timer), { once: true });
    hero.addEventListener('touchstart', () => clearInterval(timer), { once: true });
  }
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