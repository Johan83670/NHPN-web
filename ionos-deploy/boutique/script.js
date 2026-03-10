/**
 * DETAILLIUM Boutique - Script principal
 * Gestion des produits, filtres, panier et commandes
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================
    // NAVBAR MOBILE
    // ============================
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => navbar.classList.toggle('open'));
    }

    // ============================
    // FILTRES ET TRI PRODUITS
    // ============================
    const chips = document.querySelectorAll('.chip');
    const grid = document.getElementById('productGrid');
    const cards = Array.from(grid.querySelectorAll('.card'));
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');

    let state = { filter: 'all', query: '', sort: 'default' };

    function applyFilters() {
        let list = cards.slice();
        
        // Filtre par catégorie
        if (state.filter !== 'all') {
            list = list.filter(c => c.dataset.category === state.filter);
        }
        
        // Filtre par recherche
        if (state.query) {
            const q = state.query.toLowerCase();
            list = list.filter(c => c.dataset.name.toLowerCase().includes(q));
        }
        
        // Tri
        switch(state.sort) {
            case 'price-asc': 
                list.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)); 
                break;
            case 'price-desc': 
                list.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)); 
                break;
            case 'name-asc': 
                list.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name, 'fr')); 
                break;
            case 'name-desc': 
                list.sort((a,b) => b.dataset.name.localeCompare(a.dataset.name, 'fr')); 
                break;
        }
        
        // Mettre à jour la grille
        grid.innerHTML = '';
        list.forEach(el => grid.appendChild(el));
    }

    chips.forEach(btn => {
        btn.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            applyFilters();
        });
    });

    if (search) {
        search.addEventListener('input', e => { 
            state.query = e.target.value.trim(); 
            applyFilters(); 
        });
    }

    if (sort) {
        sort.addEventListener('change', e => { 
            state.sort = e.target.value; 
            applyFilters(); 
        });
    }

    applyFilters();

    // ============================
    // PANIER
    // ============================
    let cart = JSON.parse(localStorage.getItem('detaillium_cart')) || [];

    const cartToggle = document.getElementById('cart-toggle');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    function saveCart() {
        localStorage.setItem('detaillium_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Mise à jour du compteur
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        // Mise à jour du contenu du dropdown
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Votre panier est vide</p>';
            cartTotalPrice.textContent = '0,00 €';
            checkoutBtn.style.display = 'none';
            return;
        }

        checkoutBtn.style.display = 'block';
        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-qty">Qté: ${item.qty}</div>
                    </div>
                    <span class="cart-item-price">${itemTotal.toFixed(2).replace('.', ',')} €</span>
                    <button class="cart-item-remove" data-index="${index}" aria-label="Supprimer">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        cartTotalPrice.textContent = total.toFixed(2).replace('.', ',') + ' €';

        // Event listeners pour supprimer
        cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cart.splice(index, 1);
                saveCart();
                updateCartUI();
            });
        });
    }

    function addToCart(name, price) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        saveCart();
        updateCartUI();
        
        // Animation feedback
        cartToggle.classList.add('pulse');
        setTimeout(() => cartToggle.classList.remove('pulse'), 300);
    }

    // Toggle panier
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            const isVisible = cartDropdown.style.display === 'block';
            cartDropdown.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Fermer panier en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-widget')) {
            cartDropdown.style.display = 'none';
        }
    });

    // Boutons Ajouter au panier
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = btn.closest('.card');
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            addToCart(name, price);
        });
    });

    updateCartUI();

    // ============================
    // MODALE DÉTAILS PRODUIT
    // ============================
    const productModal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = btn.closest('.card');
            const img = card.querySelector('img').src;
            const title = card.querySelector('.title').textContent;
            const badge = card.querySelector('.badge').textContent;
            const price = card.querySelector('.price').textContent;
            const volume = card.querySelector('.muted').textContent;
            const desc = card.querySelector('.desc').textContent;

            modalBody.innerHTML = `
                <img src="${img}" alt="${title}" class="modal-product-img">
                <div class="badge">${badge}</div>
                <h3 class="modal-product-title">${title}</h3>
                <p class="modal-product-price">${price}</p>
                <p><strong>Contenance :</strong> ${volume}</p>
                <p class="modal-product-desc">${desc}</p>
                <button class="btn-prestation modal-add-cart" style="margin-top: 20px; width: 100%;">
                    <span class="material-icons" style="vertical-align:middle;">add_shopping_cart</span>
                    Ajouter au panier
                </button>
            `;

            productModal.style.display = 'flex';

            // Ajouter au panier depuis la modale
            modalBody.querySelector('.modal-add-cart').addEventListener('click', () => {
                addToCart(card.dataset.name, parseFloat(card.dataset.price));
                productModal.style.display = 'none';
            });
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            productModal.style.display = 'none';
        });
    }

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // ============================
    // MODALE COMMANDE
    // ============================
    const orderModal = document.getElementById('orderModal');
    const orderClose = document.getElementById('orderClose');
    const orderSummary = document.getElementById('order-summary');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            let html = '';
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                total += itemTotal;
                html += `
                    <div class="order-item">
                        <span>${item.name} x${item.qty}</span>
                        <span>${itemTotal.toFixed(2).replace('.', ',')} €</span>
                    </div>
                `;
            });

            html += `<div class="order-total">Total : ${total.toFixed(2).replace('.', ',')} €</div>`;
            orderSummary.innerHTML = html;
            orderModal.style.display = 'flex';
            cartDropdown.style.display = 'none';
        });
    }

    if (orderClose) {
        orderClose.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });
    }

    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // ============================
    // FERMER MODALES AVEC ESCAPE
    // ============================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            productModal.style.display = 'none';
            orderModal.style.display = 'none';
            cartDropdown.style.display = 'none';
        }
    });
});

// Animation pulse pour le panier
const style = document.createElement('style');
style.textContent = `
    .cart-toggle.pulse {
        animation: pulse 0.3s ease;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
