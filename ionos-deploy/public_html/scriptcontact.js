/**
 * DETAILLIUM - Script de gestion du formulaire de contact
 * Envoie les données au serveur PHP pour traitement
 */

document.addEventListener('DOMContentLoaded', function () {
  // Éléments du DOM
  const startMailBtn = document.getElementById('start-mail-flow');
  const modalMail = document.getElementById('modal-mail-flow');
  const closeMail = document.getElementById('close-mail-flow');
  const form = document.getElementById('contact-form');
  
  const stepType = document.getElementById('step-type');
  const stepPrestation = document.getElementById('step-prestation');
  const stepCoordonnees = document.getElementById('step-coordonnees');
  const stepConfirmation = document.getElementById('step-confirmation');
  const prestationsList = document.getElementById('prestations-list');
  
  const inputType = document.getElementById('input-type');
  const inputPrestation = document.getElementById('input-prestation');

  if (!startMailBtn || !modalMail || !form) return;

  // Prestations disponibles
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

  // Fonctions utilitaires
  function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function resetForm() {
    form.reset();
    inputType.value = '';
    inputPrestation.value = '';
    prestationsList.innerHTML = '';
    stepType.style.display = 'block';
    stepPrestation.style.display = 'none';
    stepCoordonnees.style.display = 'none';
    stepConfirmation.style.display = 'none';
  }

  function showStep(step) {
    stepType.style.display = 'none';
    stepPrestation.style.display = 'none';
    stepCoordonnees.style.display = 'none';
    stepConfirmation.style.display = 'none';
    step.style.display = 'block';
  }

  // Ouvrir la modale
  startMailBtn.addEventListener('click', () => {
    resetForm();
    openModal(modalMail);
  });

  // Fermer la modale
  closeMail.addEventListener('click', () => {
    closeModal(modalMail);
    resetForm();
  });

  // Étape 1 : Choix du type (Particulier / Professionnel)
  stepType.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-type]');
    if (!btn) return;
    
    const type = btn.getAttribute('data-type');
    inputType.value = type;
    
    // Générer les boutons de prestation
    const list = prestations[type] || [];
    prestationsList.innerHTML = '';
    list.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-prestation';
      b.textContent = p;
      b.dataset.prestation = p;
      prestationsList.appendChild(b);
    });
    
    showStep(stepPrestation);
  });

  // Étape 2 : Choix de la prestation
  prestationsList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-prestation]');
    if (!btn) return;
    
    inputPrestation.value = btn.dataset.prestation;
    showStep(stepCoordonnees);
  });

  // Étape 3 : Envoi du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="material-icons" style="vertical-align:middle;">hourglass_empty</span> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(form);
      const response = await fetch('send-contact.php', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        showStep(stepConfirmation);
      } else {
        const errors = result.errors ? result.errors.join('\n') : result.message;
        alert('Erreur : ' + errors);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalMail.style.display === 'flex') {
      closeModal(modalMail);
      resetForm();
    }
  });

  // Fermer en cliquant en dehors
  modalMail.addEventListener('click', (e) => {
    if (e.target === modalMail) {
      closeModal(modalMail);
      resetForm();
    }
  });
});

// Gestion des modales réseaux sociaux et contact
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