/* ============================================
   SHOE SACK — Product List (Class-based)
   Extends Component — product grid with cards
   ============================================ */

import { Component } from '../core/Component.js';
import { fetchProducts, getTrendingProducts } from '../services/db-service.js';
import { addToCart } from '../services/cart-service.js';
import { toggleWishlist, isInWishlist } from '../services/wishlist-service.js';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this._products = [];
    }

    /** Generate star rating string */
    static formatStars(rating) {
        return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
    }

    /** Build a single product card HTML */
    _cardHTML(product, index) {
        const stars = ProductList.formatStars(product.rating);
        const inWishlist = isInWishlist(product.id);

        return `
            <div class="product-card glass-panel" style="animation-delay:${index * 50}ms" data-pid="${product.id}">
                <div class="product-card-image">
                    <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                    ${product.discount > 0 ? `<span class="product-card-discount">${product.discount}% OFF</span>` : ''}
                    <button class="product-card-wishlist ${inWishlist ? 'active' : ''}" data-wid="${product.id}">
                        ${inWishlist ? '♥' : '♡'}
                    </button>
                    <div class="product-card-quick-add">
                        <button data-addid="${product.id}">🛒 Add to Cart</button>
                    </div>
                </div>
                <div class="product-card-info">
                    <div class="product-card-brand">${product.brand}</div>
                    <div class="product-card-name">${product.name}</div>
                    <div class="product-card-rating">
                        <span class="product-card-stars">${stars}</span>
                        <span class="product-card-review-count">(${product.reviewCount.toLocaleString()})</span>
                    </div>
                    <div class="product-card-pricing">
                        <span class="product-card-price">₹${product.price.toLocaleString()}</span>
                        ${product.mrp > product.price ? `<span class="product-card-mrp">₹${product.mrp.toLocaleString()}</span>` : ''}
                        ${product.discount > 0 ? `<span class="product-card-discount-text">(${product.discount}% off)</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    async renderAsync() {
        this.el = this.createElement('div', 'product-grid-wrapper');

        const { query, filters } = this.props;
        const hasFilters = query || (filters && Object.keys(filters).some(k => filters[k] && filters[k] !== 'All'));

        this._products = hasFilters
            ? await fetchProducts(query, filters)
            : await getTrendingProducts();

        const sectionTitle = hasFilters
            ? `<span class="accent">Search Results</span> (${this._products.length})`
            : '🔥 <span class="accent">Trending</span> Shoes';

        if (this._products.length === 0) {
            this.el.innerHTML = `
                <div class="product-section-title">${sectionTitle}</div>
                <div class="product-empty glass-panel">
                    <div class="product-empty-icon">🔍</div>
                    <div class="product-empty-title">No shoes found</div>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return this.el;
        }

        this.el.innerHTML = `
            <div class="product-section-title">${sectionTitle}</div>
            <div class="product-grid" id="product-grid">
                ${this._products.map((p, i) => this._cardHTML(p, i)).join('')}
            </div>
        `;

        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    onMount() {
        super.onMount();
        const { onProductClick } = this.props;

        // Wishlist toggle
        this.$$('.product-card-wishlist').forEach(btn => {
            this.listen(btn, 'click', (e) => {
                e.stopPropagation();
                const id = +btn.dataset.wid;
                const added = toggleWishlist(id);
                btn.classList.toggle('active', added);
                btn.textContent = added ? '♥' : '♡';
            });
        });

        // Quick add to cart
        this.$$('[data-addid]').forEach(btn => {
            this.listen(btn, 'click', (e) => {
                e.stopPropagation();
                const id = +btn.dataset.addid;
                const product = this._products.find(p => p.id === id);
                if (product) {
                    addToCart(product, product.sizes[Math.floor(product.sizes.length / 2)], product.colors[0]);
                    this.emit('cartUpdated');
                    showToast(`${product.name} added to cart!`, 'success');
                }
            });
        });

        // Product click → detail
        this.$$('.product-card').forEach(card => {
            this.listen(card, 'click', () => {
                if (onProductClick) onProductClick(+card.dataset.pid);
            });
        });
    }
}

// Toast utility (standalone — used across components)
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(120%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Factory for backward compatibility
export async function renderProductList(props) {
    const list = new ProductList(props);
    return list.renderAsync();
}

export { ProductList, showToast };
