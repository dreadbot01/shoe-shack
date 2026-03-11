/* ============================================
   SHOE SACK — User Service (Class-based)
   Extends StorageService — Profile, Addresses, Orders
   ============================================ */

import { StorageService } from '../core/StorageService.js';

// ---------- Profile Manager ----------
class ProfileManager extends StorageService {
    constructor() {
        super('shoesack_profile');
    }

    getProfile() { return this._get(null); }

    updateProfile(data) {
        const existing = this.getProfile() || {};
        const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };
        this._set(merged);
        return merged;
    }
}

// ---------- Address Manager ----------
class AddressManager extends StorageService {
    constructor() {
        super('shoesack_addresses');
    }

    getAddresses() { return this._get([]); }

    addAddress(address) {
        const addresses = this.getAddresses();
        const newAddr = {
            id: StorageService.generateId('addr'),
            ...address,
            isDefault: addresses.length === 0,
            createdAt: new Date().toISOString()
        };
        addresses.push(newAddr);
        this._set(addresses);
        return addresses;
    }

    updateAddress(id, data) {
        const addresses = this.getAddresses();
        const idx = addresses.findIndex(a => a.id === id);
        if (idx !== -1) {
            addresses[idx] = { ...addresses[idx], ...data };
            this._set(addresses);
        }
        return addresses;
    }

    deleteAddress(id) {
        let addresses = this.getAddresses().filter(a => a.id !== id);
        if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
            addresses[0].isDefault = true;
        }
        this._set(addresses);
        return addresses;
    }

    setDefaultAddress(id) {
        const addresses = this.getAddresses();
        addresses.forEach(a => { a.isDefault = a.id === id; });
        this._set(addresses);
        return addresses;
    }

    getDefaultAddress() {
        return this.getAddresses().find(a => a.isDefault) || null;
    }
}

// ---------- Order Manager ----------
class OrderManager extends StorageService {
    constructor() {
        super('shoesack_orders');
    }

    getOrders() { return this._get([]); }

    addOrder(order) {
        const orders = this.getOrders();
        const newOrder = {
            id: StorageService.generateId('ord'),
            ...order,
            createdAt: new Date().toISOString(),
            status: 'Confirmed'
        };
        orders.unshift(newOrder);
        this._set(orders);
        return orders;
    }

    getOrderById(id) {
        return this.getOrders().find(o => o.id === id) || null;
    }
}

// ---------- Unified User Service (Facade) ----------
class UserService {
    constructor() {
        this.profile = new ProfileManager();
        this.addresses = new AddressManager();
        this.orders = new OrderManager();
    }

    // Profile shortcuts
    getProfile() { return this.profile.getProfile(); }
    updateProfile(data) { return this.profile.updateProfile(data); }

    // Address shortcuts
    getAddresses() { return this.addresses.getAddresses(); }
    addAddress(addr) { return this.addresses.addAddress(addr); }
    updateAddress(id, data) { return this.addresses.updateAddress(id, data); }
    deleteAddress(id) { return this.addresses.deleteAddress(id); }
    setDefaultAddress(id) { return this.addresses.setDefaultAddress(id); }
    getDefaultAddress() { return this.addresses.getDefaultAddress(); }

    // Order shortcuts
    getOrders() { return this.orders.getOrders(); }
    addOrder(order) { return this.orders.addOrder(order); }
    getOrderById(id) { return this.orders.getOrderById(id); }
}

// Singleton
const userService = new UserService();
export default userService;

// Named exports for backward compatibility
export const getProfile = () => userService.getProfile();
export const updateProfile = (d) => userService.updateProfile(d);
export const getAddresses = () => userService.getAddresses();
export const addAddress = (a) => userService.addAddress(a);
export const updateAddress = (id, d) => userService.updateAddress(id, d);
export const deleteAddress = (id) => userService.deleteAddress(id);
export const setDefaultAddress = (id) => userService.setDefaultAddress(id);
export const getDefaultAddress = () => userService.getDefaultAddress();
export const getOrders = () => userService.getOrders();
export const addOrder = (o) => userService.addOrder(o);
export const getOrderById = (id) => userService.getOrderById(id);
