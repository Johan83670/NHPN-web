document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }
});