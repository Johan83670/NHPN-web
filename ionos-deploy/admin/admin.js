/**
 * DETAILLIUM Admin - Script principal
 * Fonctionnalités de la zone d'administration
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================
    // DATE ACTUELLE
    // ============================
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('fr-FR', options);
    }

    // ============================
    // GESTION DES MENUS ACTIFS
    // ============================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.admin-menu li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // ============================
    // BOUTONS D'ACTION
    // ============================
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = btn.textContent.trim();
            alert(`Action "${action}" - Fonctionnalité à implémenter selon vos besoins.`);
        });
    });

    // ============================
    // CONFIRMATION DE DÉCONNEXION
    // ============================
    const logoutLinks = document.querySelectorAll('a[href*="logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                e.preventDefault();
            }
        });
    });

    // ============================
    // NOTIFICATIONS
    // ============================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${message}</span>
        `;
        
        // Ajouter les styles si pas déjà présents
        if (!document.querySelector('.notification-styles')) {
            const style = document.createElement('style');
            style.className = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    padding: 16px 24px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { background: #4CAF50; }
                .notification-error { background: #e74c3c; }
                .notification-info { background: #2196F3; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    // Exposer la fonction globalement
    window.showNotification = showNotification;

    // ============================
    // SIMULATION DE DONNÉES DYNAMIQUES
    // ============================
    // En production, ces données viendraient d'une API
    const stats = {
        messages: 12,
        devis: 8,
        commandes: 5,
        visites: 1247
    };

    // Mise à jour des statistiques (simulation)
    function updateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            statValues[0].textContent = stats.messages;
            statValues[1].textContent = stats.devis;
            statValues[2].textContent = stats.commandes;
            statValues[3].textContent = stats.visites.toLocaleString('fr-FR');
        }
    }

    updateStats();

    // ============================
    // RECHERCHE GLOBALE (préparation)
    // ============================
    document.addEventListener('keydown', function(e) {
        // Ctrl+K pour ouvrir la recherche
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showNotification('Recherche globale - Fonctionnalité à venir', 'info');
        }
    });

    console.log('DETAILLIUM Admin chargé avec succès');
});
