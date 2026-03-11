/* ============================================
   SHOE SACK — Cart Service (Class-based)
   Extends StorageService for cart persistence
   ============================================ */

import { StorageService } from '../core/StorageService.js';

class CartService extends StorageService {
    constructor() {
        super('shoesack_cart');
    }

    /** Get all items in cart */
    getCart() {
        return this._get([]);
    }

    /** Add item to cart or increment qty if exists */
    addToCart(product, size, color) {
        const cart = this.getCart();
        const itemId = `${product.id}_${size}_${color}`;
        const existing = cart.find(i => i.id === itemId);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: itemId,
                productId: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images[0],
                size,
                color,
                qty: 1
            });
        }
        this._set(cart);
        return cart;
    }

    /** Remove item from cart by ID */
    removeFromCart(itemId) {
        const cart = this.getCart().filter(i => i.id !== itemId);
        this._set(cart);
        return cart;
    }

    /** Update quantity of an item */
    updateQty(itemId, qty) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.qty = Math.max(1, qty);
            this._set(cart);
        }
        return cart;
    }

    /** Clear entire cart */
    clearCart() {
        this._set([]);
    }

    /** Get total items count */
    getCartCount() {
        return this.getCart().reduce((sum, i) => sum + i.qty, 0);
    }

    /** Calculate totals: subtotal, shipping, itemCount, total */
    getCartTotal() {
        const cart = this.getCart();
        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
        const shipping = subtotal >= 1999 ? 0 : 99;
        return { subtotal, shipping, itemCount, total: subtotal + shipping };
    }
}

// Singleton export
const cartService = new CartService();
export default cartService;

// Named exports for backward compatibility
export const getCart = () => cartService.getCart();
export const addToCart = (p, s, c) => cartService.addToCart(p, s, c);
export const removeFromCart = (id) => cartService.removeFromCart(id);
export const updateQty = (id, q) => cartService.updateQty(id, q);
export const clearCart = () => cartService.clearCart();
export const getCartCount = () => cartService.getCartCount();
export const getCartTotal = () => cartService.getCartTotal();
