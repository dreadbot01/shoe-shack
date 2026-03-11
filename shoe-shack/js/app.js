/* ============================================
   SHOE SACK — App Shell (Class-based)
   App class: SPA Router, State, Bootstrap
   ============================================ */

import { initDB } from './services/db-service.js';
import { getCurrentUser, isLoggedIn } from './services/auth-service.js';
import { renderAuthLayout } from './components/auth-forms.js';
import { renderNavbar, updateCartBadge } from './components/navbar.js';
import { renderHeroBanner } from './components/hero-banner.js';
import { renderProductList } from './components/product-list.js';
import { renderProductDetail } from './components/product-detail.js';
import { renderFilters } from './components/search-filter.js';
import { renderCart } from './components/cart-view.js';
import { renderProfilePage } from './components/profile-page.js';

class App {
    constructor(rootId = 'app-root') {
        this._root = document.getElementById(rootId);
        this._state = {
            view: 'home',       // 'auth' | 'home' | 'profile'
            searchQuery: '',
            filters: {},
            categoryFilter: 'All'
        };
        this._cartEl = null;
    }

    // ---------- Animated Background ----------
    _createAnimatedBg() {
        const bg = document.createElement('div');
        bg.className = 'animated-bg';
        bg.innerHTML = `<div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>`;
        return bg;
    }

    // ---------- Navbar Config ----------
    _navbarProps() {
        return {
            onSearch: (query) => {
                this._state.searchQuery = query;
                if (this._state.view !== 'home') { this._state.view = 'home'; this.render().then(() => this._refreshProducts()); }
                else this._refreshProducts();
            },
            onNavigate: (view) => { this._state.view = view; this.render(); },
            onCartOpen: () => { if (this._cartEl?._openCart) this._cartEl._openCart(); },
            onCategoryFilter: (cat) => {
                this._state.categoryFilter = cat;
                this._state.searchQuery = '';
                if (this._state.view !== 'home') { this._state.view = 'home'; this.render(); }
                else this._refreshProducts();
            }
        };
    }

    // ---------- Product Refresh ----------
    async _refreshProducts() {
        const wrapper = document.getElementById('product-area');
        if (!wrapper) return;

        const mergedFilters = { ...this._state.filters };
        if (this._state.categoryFilter && this._state.categoryFilter !== 'All') {
            if (this._state.categoryFilter === 'Men' || this._state.categoryFilter === 'Women') {
                mergedFilters.gender = this._state.categoryFilter;
            } else {
                mergedFilters.category = this._state.categoryFilter;
            }
        }

        const productList = await renderProductList({
            query: this._state.searchQuery,
            filters: mergedFilters,
            onProductClick: async (id) => {
                const detailEl = await renderProductDetail(id);
                if (detailEl) document.body.appendChild(detailEl);
            }
        });

        wrapper.innerHTML = '';
        wrapper.appendChild(productList);
    }

    // ---------- Render Views ----------
    async _renderAuth() {
        const authPage = await renderAuthLayout({
            onSuccess: () => { this._state.view = 'home'; this.render(); }
        });
        this._root.appendChild(authPage);
        this._cartEl = await renderCart();
        this._root.appendChild(this._cartEl);
    }

    async _renderProfile() {
        this._root.appendChild(this._createAnimatedBg());
        const navbar = await renderNavbar(this._navbarProps());
        this._root.appendChild(navbar);

        const profilePage = await renderProfilePage({
            onNavigate: (view) => { this._state.view = view; this.render(); }
        });
        this._root.appendChild(profilePage);

        this._cartEl = await renderCart();
        this._root.appendChild(this._cartEl);
    }

    async _renderHome() {
        this._root.appendChild(this._createAnimatedBg());
        const navbar = await renderNavbar(this._navbarProps());
        this._root.appendChild(navbar);

        const mainContent = document.createElement('main');
        mainContent.className = 'main-content';

        const hero = await renderHeroBanner();
        mainContent.appendChild(hero);

        const homeLayout = document.createElement('div');
        homeLayout.className = 'home-layout';

        const sidebar = await renderFilters({
            onFilterChange: (filters) => { this._state.filters = filters; this._refreshProducts(); },
            currentFilters: this._state.filters
        });
        homeLayout.appendChild(sidebar);

        const productArea = document.createElement('div');
        productArea.id = 'product-area';
        productArea.style.flex = '1';
        productArea.style.minWidth = '0';
        homeLayout.appendChild(productArea);

        mainContent.appendChild(homeLayout);
        this._root.appendChild(mainContent);

        this._cartEl = await renderCart();
        this._root.appendChild(this._cartEl);

        await this._refreshProducts();
    }

    // ---------- Main Render ----------
    async render() {
        if (!this._root) return;
        this._root.innerHTML = '';

        if (!isLoggedIn()) {
            this._state.view = 'auth';
            return this._renderAuth();
        }

        if (this._state.view === 'profile') {
            return this._renderProfile();
        }

        this._state.view = 'home';
        return this._renderHome();
    }

    // ---------- Bootstrap ----------
    async init() {
        await initDB();

        // Global cart update listener
        document.addEventListener('cartUpdated', () => {
            updateCartBadge();
            if (this._cartEl?._refresh) this._cartEl._refresh();
        });

        await this.render();
    }
}

// ---------- Start the App ----------
const app = new App();
app.init();
