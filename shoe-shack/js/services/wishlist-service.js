/* ============================================
   SHOE SACK — Wishlist Service (Class-based)
   Extends StorageService for wishlist persistence
   ============================================ */

import { StorageService } from '../core/StorageService.js';

class WishlistService extends StorageService {
    constructor() {
        super('shoesack_wishlist');
    }

    /** Get all wishlist product IDs */
    getWishlist() {
        return this._get([]);
    }

    /** Toggle product in wishlist — returns true if added, false if removed */
    toggleWishlist(productId) {
        const list = this.getWishlist();
        const index = list.indexOf(productId);

        if (index === -1) {
            list.push(productId);
            this._set(list);
            return true; // added
        } else {
            list.splice(index, 1);
            this._set(list);
            return false; // removed
        }
    }

    /** Check if product is in wishlist */
    isInWishlist(productId) {
        return this.getWishlist().includes(productId);
    }
}

// Singleton export
const wishlistService = new WishlistService();
export default wishlistService;

// Named exports for backward compatibility
export const getWishlist = () => wishlistService.getWishlist();
export const toggleWishlist = (id) => wishlistService.toggleWishlist(id);
export const isInWishlist = (id) => wishlistService.isInWishlist(id);
