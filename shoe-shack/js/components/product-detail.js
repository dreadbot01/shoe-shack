/* ============================================
   SHOE SACK — Product Detail (Class-based)
   Extends Component — modal with size/color selectors
   ============================================ */

import { Component } from '../core/Component.js';
import { getProductById } from '../services/db-service.js';
import { addToCart } from '../services/cart-service.js';
import { toggleWishlist, isInWishlist } from '../services/wishlist-service.js';
import { showToast } from './product-list.js';

/** Color name → hex mapping */
const COLOR_MAP = {
    'Black': '#111', 'White': '#f5f5f5', 'Navy': '#1a237e', 'Red': '#d32f2f', 'Blue': '#1976d2',
    'Grey': '#757575', 'Green': '#388e3c', 'Brown': '#5d4037', 'Pink': '#e91e63', 'Wheat': '#d4a056',
    'Sand Suede': '#c2b280', 'Beeswax': '#a89060', 'Dark Brown': '#3e2723', 'Walnut': '#78583c',
    'Dark Chili': '#8b1a1a', 'Core Black': '#111', 'Cloud White': '#f5f5f5', 'Chalk': '#e8e0d0',
    'Parchment': '#f1e9d2', 'Egret': '#f0ead6', 'Blush': '#de5d83', 'Cognac': '#9a3324',
    'Chestnut': '#954535', 'Ivory': '#fffff0', 'Moonbeam': '#d1d0ce', 'Timberwolf': '#dbd7d2',
    'Sea Salt': '#f0ece2', 'Checkerboard': '#fff', 'White/Green': '#f5f5f5', 'White/Navy': '#f5f5f5',
    'White/Red': '#f5f5f5', 'White/Black': '#f5f5f5', 'White/Gold': '#f5f5f5', 'All White': '#f5f5f5',
    'Black/White': '#111', 'Chicago Red': '#ce1141', 'Royal Blue': '#1a237e', 'Shadow Grey': '#616161',
    'Cherry Red': '#cc0000', 'Optical White': '#f5f5f5', 'Saddle': '#8b4513', 'Arctic Orange': '#ff6f00',
    'Barely Rose': '#f8c8c8', 'Nude': '#f2d2bd', 'Peacoat': '#2c3e6b', 'Lavender': '#b39ddb',
    'Panda': '#111', 'Rose Whisper': '#f5c6d0', 'University Blue': '#5b9bd5', 'Grey/Pink': '#a0a0a0',
    'Camel': '#c19a6b', 'Tan': '#d2b48c',
};

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this._product = null;
        this._selectedSize = '';
        this._selectedColor = '';
    }

    _buildTemplate() {
        const p = this._product;
        const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(p.rating));
        const inWishlist = isInWishlist(p.id);

        return `
            <div class="product-detail-modal" style="position:relative">
                <button class="product-detail-close" id="detail-close">✕</button>
                <div class="product-detail-grid">
                    <div class="product-detail-image-section">
                        <img src="${p.images[0]}" alt="${p.name}">
                    </div>
                    <div class="product-detail-info-section">
                        <div class="product-detail-brand">${p.brand}</div>
                        <h2 class="product-detail-name">${p.name}</h2>
                        <div class="product-detail-rating">
                            <span class="stars">${stars}</span>
                            <span>${p.rating}</span>
                            <span class="count">(${p.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                        <div class="product-detail-pricing">
                            <span class="product-detail-price">₹${p.price.toLocaleString()}</span>
                            ${p.mrp > p.price ? `<span class="product-detail-mrp">₹${p.mrp.toLocaleString()}</span>` : ''}
                            ${p.discount > 0 ? `<span class="product-detail-discount-badge">${p.discount}% OFF</span>` : ''}
                        </div>
                        <p class="product-detail-desc">${p.description}</p>

                        <div>
                            <div class="product-detail-label">Select Size</div>
                            <div class="product-detail-sizes" id="detail-sizes">
                                ${p.sizes.map((s, i) => `<button class="detail-size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s.replace('UK ', '')}</button>`).join('')}
                            </div>
                        </div>

                        <div>
                            <div class="product-detail-label">Select Color</div>
                            <div class="product-detail-colors" id="detail-colors">
                                ${p.colors.map((c, i) => {
            const bg = COLOR_MAP[c] || '#888';
            return `<button class="detail-color-btn ${i === 0 ? 'selected' : ''}" data-color="${c}" style="background:${bg}" title="${c}"></button>`;
        }).join('')}
                            </div>
                        </div>

                        <div class="product-detail-actions">
                            <button class="btn-primary" id="detail-add-cart">🛒 Add to Cart</button>
                            <button class="btn-glass" id="detail-wishlist">${inWishlist ? '♥' : '♡'}</button>
                        </div>

                        ${p.stock < 20 ? `<p style="font-size:0.82rem;color:var(--warning)">⚡ Only ${p.stock} left in stock!</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    async renderAsync() {
        this._product = await getProductById(this.props.productId);
        if (!this._product) return null;

        this._selectedSize = this._product.sizes[0];
        this._selectedColor = this._product.colors[0];

        this.el = this.createElement('div', 'product-detail-overlay');
        this.el.innerHTML = this._buildTemplate();
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    _close() {
        this.destroy();
        this.el?.remove();
    }

    onMount() {
        super.onMount();

        // Close actions
        this.listen(document.getElementById('detail-close'), 'click', () => this._close());
        this.listen(this.el, 'click', (e) => { if (e.target === this.el) this._close(); });

        const onEsc = (e) => { if (e.key === 'Escape') this._close(); };
        this.listen(document, 'keydown', onEsc);

        // Size selection
        this.$$('.detail-size-btn').forEach(btn => {
            this.listen(btn, 'click', () => {
                this.$$('.detail-size-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this._selectedSize = btn.dataset.size;
            });
        });

        // Color selection
        this.$$('.detail-color-btn').forEach(btn => {
            this.listen(btn, 'click', () => {
                this.$$('.detail-color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this._selectedColor = btn.dataset.color;
            });
        });

        // Add to cart
        this.listen(document.getElementById('detail-add-cart'), 'click', () => {
            addToCart(this._product, this._selectedSize, this._selectedColor);
            this.emit('cartUpdated');
            showToast(`${this._product.name} (${this._selectedSize}, ${this._selectedColor}) added to cart!`);
            this._close();
        });

        // Wishlist
        const wishBtn = document.getElementById('detail-wishlist');
        if (wishBtn) {
            this.listen(wishBtn, 'click', () => {
                const added = toggleWishlist(this._product.id);
                wishBtn.textContent = added ? '♥' : '♡';
                showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'error');
            });
        }
    }
}

// Factory for backward compatibility
export async function renderProductDetail(productId) {
    const detail = new ProductDetail({ productId });
    return detail.renderAsync();
}

export { ProductDetail };
