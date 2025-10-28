document.getElementById('btn-social').onclick = function() {
  document.getElementById('modal-social').style.display = 'flex';
};
document.getElementById('btn-contact').onclick = function() {
  document.getElementById('modal-contact').style.display = 'flex';
};
document.getElementById('close-social').onclick = function() {
  document.getElementById('modal-social').style.display = 'none';
};
document.getElementById('close-contact').onclick = function() {
  document.getElementById('modal-contact').style.display = 'none';
};

// Fermer la modale en cliquant en dehors
document.getElementById('modal-social').onclick = function(e) {
  if (e.target === this) this.style.display = 'none';
};
document.getElementById('modal-contact').onclick = function(e) {
  if (e.target === this) this.style.display = 'none';
};