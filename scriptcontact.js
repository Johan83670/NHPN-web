document.addEventListener('DOMContentLoaded', function () {
  const startMailBtn = document.getElementById('start-mail-flow');
  const modalMail = document.getElementById('modal-mail-flow');
  const closeMail = document.getElementById('close-mail-flow');
  const mailTypeChoices = document.getElementById('mail-type-choices');
  const mailPrestations = document.getElementById('mail-prestations');
  const prestationsList = document.getElementById('prestations-list');

  if (!startMailBtn || !modalMail) return;

  // Prestations reprenant exactement les titres des pages prestation-particulier / prestation-professionel
  const prestations = {
    particulier: [
      'Formule Premium',
      'Formule Médium',
      'Formule Low-Cost',
      'Nettoyage de mobilier & extérieur'
    ],
    professionnel: [
      'Formule Premium Pro',
      'Formule Médium Pro',
      'Formule Low-Cost Pro',
      'Nettoyage de locaux & extérieurs professionnels'
    ]
  };

  function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  startMailBtn.addEventListener('click', () => openModal(modalMail));
  closeMail.addEventListener('click', () => {
    closeModal(modalMail);
    mailPrestations.style.display = 'none';
    prestationsList.innerHTML = '';
  });

  // choix Particulier / Professionnel
  mailTypeChoices.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-type]');
    if (!btn) return;
    const type = btn.getAttribute('data-type');
    showPrestationsFor(type);
  });

  function showPrestationsFor(type) {
    const list = prestations[type] || [];
    prestationsList.innerHTML = '';
    list.forEach((p) => {
      const b = document.createElement('button');
      b.className = 'btn-prestation';
      b.type = 'button';
      b.textContent = p;
      b.style.textAlign = 'left';
      b.dataset.type = type;
      b.dataset.prestation = p;
      prestationsList.appendChild(b);
    });
    mailPrestations.style.display = 'flex';
  }

  prestationsList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-prestation]');
    if (!btn) return;
    const type = btn.dataset.type;
    const prestation = btn.dataset.prestation;
    const to = 'contact@detaillium.fr';
    const subject = `[${type === 'professionnel' ? 'Pro' : 'Particulier'}] Demande - ${prestation}`;
    const bodyLines = [
      `Bonjour,`,
      ``,
      `Je souhaite obtenir des informations / un devis pour la prestation suivante :`,
      `- Type : ${type}`,
      `- Prestation : ${prestation}`,
      ``,
      `Merci de me recontacter aux coordonnées suivantes :`,
      `Nom :`,
      `Téléphone :`,
      `Adresse e-mail :`,
      ``,
      `Cordialement,`
    ];
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
    closeModal(modalMail);
    prestationsList.innerHTML = '';
    mailPrestations.style.display = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalMail.style.display === 'flex') closeModal(modalMail);
    }
  });
});

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