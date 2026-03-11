/* ============================================
   SHOE SACK — Cart Drawer (Class-based)
   Extends Component — slide-out cart with Razorpay
   ============================================ */

import { Component } from '../core/Component.js';
import { getCart, removeFromCart, updateQty, clearCart, getCartTotal } from '../services/cart-service.js';
import { getCurrentUser } from '../services/auth-service.js';
import { getDefaultAddress, addOrder } from '../services/user-service.js';
import { initiatePayment } from '../services/payment-service.js';
import { showToast } from './product-list.js';

class CartDrawer extends Component {
    constructor(props) {
        super(props);
    }

    template() {
        return `
            <div class="cart-overlay-bg" id="cart-overlay-bg"></div>
            <div class="cart-drawer" id="cart-drawer">
                <div class="cart-header">
                    <div class="cart-header-title">🛒 Shopping Cart</div>
                    <button class="cart-close" id="cart-close">✕</button>
                </div>
                <div class="cart-items" id="cart-items"></div>
                <div id="cart-footer"></div>
            </div>
        `;
    }

    /** Open the cart drawer */
    open() {
        this.$('#cart-overlay-bg')?.classList.add('open');
        this.$('#cart-drawer')?.classList.add('open');
        this._refreshItems();
    }

    /** Close the cart drawer */
    close() {
        this.$('#cart-overlay-bg')?.classList.remove('open');
        this.$('#cart-drawer')?.classList.remove('open');
    }

    /** Toggle open/close */
    toggle() {
        this.$('#cart-drawer')?.classList.contains('open') ? this.close() : this.open();
    }

    /** Refresh cart contents */
    _refreshItems() {
        const items = getCart();
        const itemsEl = this.$('#cart-items');
        const footerEl = this.$('#cart-footer');
        if (!itemsEl || !footerEl) return;

        if (items.length === 0) {
            itemsEl.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">👟</div>
                    <div class="cart-empty-title">Your cart is empty</div>
                    <p style="color:var(--text-muted);font-size:0.9rem">Add some shoes to get started!</p>
                    <button class="btn-primary" id="cart-continue-shop">Continue Shopping</button>
                </div>
            `;
            footerEl.innerHTML = '';
            setTimeout(() => {
                document.getElementById('cart-continue-shop')?.addEventListener('click', () => this.close());
            }, 0);
            return;
        }

        const totals = getCartTotal();

        itemsEl.innerHTML = items.map(item => `
            <div class="cart-item">
                <button class="cart-item-remove" data-rid="${item.id}">✕</button>
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variant">${item.size} · ${item.color}</div>
                    <div class="cart-item-bottom">
                        <div class="cart-item-qty">
                            <button data-dec="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button data-inc="${item.id}">+</button>
                        </div>
                        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `).join('');

        footerEl.innerHTML = `
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span>Subtotal (${totals.itemCount} item${totals.itemCount > 1 ? 's' : ''})</span>
                    <span>₹${totals.subtotal.toLocaleString()}</span>
                </div>
                <div class="cart-summary-row">
                    <span>Shipping</span>
                    <span class="${totals.shipping === 0 ? 'free-shipping' : ''}">${totals.shipping === 0 ? 'FREE' : '₹' + totals.shipping}</span>
                </div>
                <div class="cart-summary-row total">
                    <span>Total</span>
                    <span>₹${totals.total.toLocaleString()}</span>
                </div>
            </div>
            <div class="cart-actions">
                <button class="btn-primary" id="cart-checkout">💳 Pay with Razorpay</button>
                <button class="btn-glass" id="cart-clear">Clear Cart</button>
            </div>
        `;

        this._bindItemActions(items);
    }

    /** Bind event handlers for cart item actions */
    _bindItemActions(items) {
        setTimeout(() => {
            // Remove
            this.el.querySelectorAll('[data-rid]').forEach(btn => {
                btn.addEventListener('click', () => {
                    removeFromCart(btn.dataset.rid);
                    this.emit('cartUpdated');
                    this._refreshItems();
                });
            });

            // Decrease qty
            this.el.querySelectorAll('[data-dec]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = getCart().find(i => i.id === btn.dataset.dec);
                    if (item && item.qty > 1) updateQty(btn.dataset.dec, item.qty - 1);
                    else removeFromCart(btn.dataset.dec);
                    this.emit('cartUpdated');
                    this._refreshItems();
                });
            });

            // Increase qty
            this.el.querySelectorAll('[data-inc]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = getCart().find(i => i.id === btn.dataset.inc);
                    if (item) updateQty(btn.dataset.inc, item.qty + 1);
                    this.emit('cartUpdated');
                    this._refreshItems();
                });
            });

            // Checkout
            document.getElementById('cart-checkout')?.addEventListener('click', () => this._checkout());

            // Clear cart
            document.getElementById('cart-clear')?.addEventListener('click', () => {
                clearCart();
                this.emit('cartUpdated');
                this._refreshItems();
            });
        }, 0);
    }

    /** Handle Razorpay checkout */
    async _checkout() {
        const user = getCurrentUser();
        const address = getDefaultAddress();
        const totals = getCartTotal();
        const items = getCart();

        if (!user) { showToast('Please log in to checkout.', 'error'); return; }

        const checkoutBtn = document.getElementById('cart-checkout');
        if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.textContent = '⏳ Processing...'; }

        const orderId = 'ord_' + Date.now().toString(36);

        try {
            const result = await initiatePayment({
                amount: totals.total, orderId,
                user: { name: user.name, email: user.email, phone: user.phone },
                address, items
            });

            if (result.success) {
                addOrder({
                    items: items.map(i => ({ ...i })),
                    total: totals.total, itemCount: totals.itemCount,
                    paymentId: result.paymentId, paymentMethod: result.method,
                    shippingAddress: address
                        ? `${address.street}, ${address.city}, ${address.state} ${address.pincode}`
                        : 'Not specified'
                });
                clearCart();
                this.emit('cartUpdated');
                this._refreshItems();
                this.close();
                showToast(`🎉 Order placed! Payment ID: ${result.paymentId}`);
            } else {
                showToast(result.reason === 'dismissed' ? 'Payment cancelled.' : `Payment failed: ${result.error || 'Unknown error'}`, 'error');
            }
        } catch (err) {
            showToast('Payment error. Please try again.', 'error');
            console.error('Payment error:', err);
        }

        if (checkoutBtn) { checkoutBtn.disabled = false; checkoutBtn.textContent = '💳 Pay with Razorpay'; }
    }

    onMount() {
        super.onMount();
        this.listen(document.getElementById('cart-overlay-bg'), 'click', () => this.close());
        this.listen(document.getElementById('cart-close'), 'click', () => this.close());
        this._refreshItems();
    }
}

// Factory for backward compatibility
export async function renderCart() {
    const drawer = new CartDrawer();
    const el = drawer.render();
    // Expose methods on DOM element for legacy app.js integration
    el._openCart = () => drawer.open();
    el._closeCart = () => drawer.close();
    el._toggleCart = () => drawer.toggle();
    el._refresh = () => drawer._refreshItems();
    return el;
}

export { CartDrawer };
