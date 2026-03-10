// Navbar toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }
});

// Hero slideshow auto-rotation
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (!slides.length) return;

  let current = 0;
  slides[current].classList.add('active');

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 6000);
  }
});

// Gallery slideshow - paires avant/après
document.addEventListener('DOMContentLoaded', function() {
  const galleries = document.querySelectorAll('.prestation-gallery');
  if (!galleries.length) return;

  galleries.forEach(gallery => {
    const pairs = gallery.querySelectorAll('.slide-pair');
    if (pairs.length <= 1) return;

    let current = 0;
    pairs[current].classList.add('active');

    setInterval(() => {
      pairs[current].classList.remove('active');
      current = (current + 1) % pairs.length;
      pairs[current].classList.add('active');
    }, 5000);
  });
});
