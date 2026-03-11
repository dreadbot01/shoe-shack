/* ============================================
   SHOE SACK — Navbar (Class-based)
   Extends Component — sticky nav with search
   ============================================ */

import { Component } from '../core/Component.js';
import { getCurrentUser, logout } from '../services/auth-service.js';
import { getCartCount } from '../services/cart-service.js';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this._categories = ['All', 'Men', 'Women', 'Running', 'Sneakers', 'Casual'];
    }

    template() {
        const user = getCurrentUser();
        const cartCount = getCartCount();

        return `
            <div class="nav-brand" id="nav-brand">SHOE SACK</div>

            <div class="nav-categories" id="nav-categories">
                ${this._categories.map((c, i) => `
                    <button class="nav-cat-link ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>
                `).join('')}
            </div>

            <div class="nav-search">
                <span class="nav-search-icon">🔍</span>
                <input type="text" id="nav-search-input" placeholder="Search shoes, brands...">
            </div>

            <div class="nav-actions">
                <button class="nav-action-btn" id="nav-cart-btn" title="Cart">
                    🛒
                    ${cartCount > 0 ? `<span class="nav-badge" id="nav-cart-badge">${cartCount}</span>` : ''}
                </button>

                <div style="position:relative">
                    <button class="nav-action-btn" id="nav-profile-btn" title="Profile">👤</button>
                    <div class="nav-profile-dropdown" id="nav-profile-dropdown">
                        ${user ? `
                            <div class="dropdown-header">
                                ${user.name}
                                <div class="dropdown-sub">${user.email}</div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item" id="nav-orders">📦 My Orders</button>
                            <button class="dropdown-item" id="nav-settings">⚙️ Settings</button>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item" id="nav-logout" style="color:var(--danger)">🚪 Logout</button>
                        ` : `
                            <button class="dropdown-item" id="nav-login">🔑 Sign In</button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.el = this.createElement('nav', 'navbar');
        this.el.innerHTML = this.template();
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    onMount() {
        super.onMount();
        const { onSearch, onNavigate, onCartOpen, onCategoryFilter } = this.props;

        // Search with debounce
        const searchInput = document.getElementById('nav-search-input');
        let debounce;
        if (searchInput) {
            this.listen(searchInput, 'input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => onSearch(searchInput.value.trim()), 300);
            });
            this.listen(searchInput, 'keydown', (e) => {
                if (e.key === 'Enter') { clearTimeout(debounce); onSearch(searchInput.value.trim()); }
            });
        }

        // Brand click → reset
        this.listen(document.getElementById('nav-brand'), 'click', () => {
            onCategoryFilter('All');
            if (searchInput) searchInput.value = '';
            onSearch('');
        });

        // Category tabs
        this.$$('.nav-cat-link').forEach(link => {
            this.listen(link, 'click', () => {
                this.$$('.nav-cat-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                onCategoryFilter(link.dataset.cat);
            });
        });

        // Cart
        this.listen(document.getElementById('nav-cart-btn'), 'click', onCartOpen);

        // Profile dropdown toggle
        const profileBtn = document.getElementById('nav-profile-btn');
        const dropdown = document.getElementById('nav-profile-dropdown');
        if (profileBtn && dropdown) {
            this.listen(profileBtn, 'click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); });
            this.listen(document, 'click', () => dropdown.classList.remove('open'));
        }

        // Navigation items
        this.listen(document.getElementById('nav-logout'), 'click', () => { logout(); onNavigate('auth'); });
        this.listen(document.getElementById('nav-login'), 'click', () => onNavigate('auth'));
        this.listen(document.getElementById('nav-orders'), 'click', () => onNavigate('profile'));
        this.listen(document.getElementById('nav-settings'), 'click', () => onNavigate('profile'));
    }
}

// Factory for backward compatibility
export async function renderNavbar(props) {
    const nav = new Navbar(props);
    return nav.render();
}

export function updateCartBadge() {
    const count = getCartCount();
    const btn = document.getElementById('nav-cart-btn');
    if (btn) {
        const existing = btn.querySelector('.nav-badge');
        if (existing) existing.remove();
        if (count > 0) {
            const span = document.createElement('span');
            span.className = 'nav-badge';
            span.id = 'nav-cart-badge';
            span.textContent = count;
            btn.appendChild(span);
        }
    }
}

export { Navbar };
