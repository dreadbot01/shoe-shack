/* ============================================
   SHOE SACK — Profile Page (Class-based)
   Extends Component — profile, addresses, orders
   ============================================ */

import { Component } from '../core/Component.js';
import { getCurrentUser } from '../services/auth-service.js';
import { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, setDefaultAddress, getOrders } from '../services/user-service.js';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this._selectedGender = '';
    }

    template() {
        const user = getCurrentUser();
        const profile = getProfile() || {};
        const addresses = getAddresses();
        const orders = getOrders();
        this._selectedGender = profile.gender || '';

        return `
            <div style="margin-bottom:28px">
                <button class="btn-glass" id="profile-back" style="margin-bottom:16px">← Back to Shop</button>
                <h1 style="font-family:var(--font-heading);font-size:2rem;font-weight:800">
                    My <span style="background:var(--accent-gradient-full);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Profile</span>
                </h1>
            </div>

            <div style="display:flex;gap:4px;margin-bottom:24px;background:var(--glass-bg);border-radius:12px;padding:4px">
                <button class="profile-tab active" data-tab="info" style="flex:1;padding:10px;border-radius:10px;font-size:0.9rem;font-weight:500;color:var(--text-secondary);transition:var(--transition-fast)">👤 Personal Info</button>
                <button class="profile-tab" data-tab="addresses" style="flex:1;padding:10px;border-radius:10px;font-size:0.9rem;font-weight:500;color:var(--text-secondary);transition:var(--transition-fast)">📍 Addresses</button>
                <button class="profile-tab" data-tab="orders" style="flex:1;padding:10px;border-radius:10px;font-size:0.9rem;font-weight:500;color:var(--text-secondary);transition:var(--transition-fast)">📦 Orders</button>
            </div>

            ${this._personalInfoTab(user, profile)}
            ${this._addressesTab(addresses)}
            ${this._ordersTab(orders)}
        `;
    }

    _personalInfoTab(user, profile) {
        return `
            <div class="profile-panel glass-panel-strong" id="tab-info" style="padding:28px;margin-bottom:20px">
                <h3 style="font-family:var(--font-heading);font-weight:700;margin-bottom:20px;font-size:1.1rem">Personal Information</h3>
                <form id="profile-form" style="display:flex;flex-direction:column;gap:14px">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                        <div><label class="auth-form-label">Full Name</label><input type="text" class="input-glass" id="pf-name" value="${user?.name || profile.name || ''}" placeholder="John Doe"></div>
                        <div><label class="auth-form-label">Email</label><input type="email" class="input-glass" id="pf-email" value="${user?.email || profile.email || ''}" placeholder="your@email.com"></div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                        <div><label class="auth-form-label">Phone</label><input type="tel" class="input-glass" id="pf-phone" value="${user?.phone || profile.phone || ''}" placeholder="+91 9876543210"></div>
                        <div><label class="auth-form-label">Date of Birth</label><input type="date" class="input-glass" id="pf-dob" value="${profile.dob || ''}" style="color-scheme:dark"></div>
                    </div>
                    <div>
                        <label class="auth-form-label">Gender</label>
                        <div style="display:flex;gap:8px;margin-top:4px">
                            ${['Male', 'Female', 'Other'].map(g => `<button type="button" class="size-chip pf-gender ${profile.gender === g ? 'active' : ''}" data-g="${g}">${g}</button>`).join('')}
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="width:fit-content;margin-top:8px">💾 Save Changes</button>
                </form>
                <div id="profile-msg" style="margin-top:12px;font-size:0.88rem;color:var(--success);display:none"></div>
            </div>
        `;
    }

    _addressesTab(addresses) {
        return `
            <div class="profile-panel glass-panel-strong" id="tab-addresses" style="padding:28px;margin-bottom:20px;display:none">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
                    <h3 style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem">Saved Addresses</h3>
                    <button class="btn-primary" id="add-address-btn" style="font-size:0.85rem;padding:8px 18px">+ Add Address</button>
                </div>
                <div id="address-form-wrap" style="display:none;margin-bottom:20px;padding:20px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:14px">
                    <h4 style="font-weight:600;margin-bottom:14px;font-size:0.95rem">New Address</h4>
                    <form id="address-form" style="display:flex;flex-direction:column;gap:12px">
                        <div><label class="auth-form-label">Full Name</label><input type="text" class="input-glass" id="addr-name" placeholder="Recipient name" required></div>
                        <div><label class="auth-form-label">Phone</label><input type="tel" class="input-glass" id="addr-phone" placeholder="+91 9876543210" required></div>
                        <div><label class="auth-form-label">Street Address</label><input type="text" class="input-glass" id="addr-street" placeholder="House/flat no, street name" required></div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                            <div><label class="auth-form-label">City</label><input type="text" class="input-glass" id="addr-city" placeholder="Mumbai" required></div>
                            <div><label class="auth-form-label">State</label><input type="text" class="input-glass" id="addr-state" placeholder="Maharashtra" required></div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                            <div><label class="auth-form-label">Pincode</label><input type="text" class="input-glass" id="addr-pincode" placeholder="400001" required pattern="[0-9]{6}"></div>
                            <div><label class="auth-form-label">Landmark (optional)</label><input type="text" class="input-glass" id="addr-landmark" placeholder="Near..."></div>
                        </div>
                        <div style="display:flex;gap:10px">
                            <button type="submit" class="btn-primary" style="font-size:0.85rem;padding:10px 22px">Save Address</button>
                            <button type="button" class="btn-glass" id="cancel-address">Cancel</button>
                        </div>
                    </form>
                </div>
                <div id="address-list">${ProfilePage.renderAddressList(addresses)}</div>
            </div>
        `;
    }

    _ordersTab(orders) {
        return `
            <div class="profile-panel glass-panel-strong" id="tab-orders" style="padding:28px;display:none">
                <h3 style="font-family:var(--font-heading);font-weight:700;margin-bottom:20px;font-size:1.1rem">Order History</h3>
                <div id="orders-list">
                    ${orders.length === 0
                ? `<div style="text-align:center;padding:40px;color:var(--text-muted)">
                            <div style="font-size:2.5rem;margin-bottom:10px">📦</div>
                            <div style="font-weight:600;color:var(--text-secondary)">No orders yet</div>
                            <p style="font-size:0.88rem">Your order history will appear here after checkout.</p>
                          </div>`
                : orders.map(o => `
                            <div style="padding:16px;margin-bottom:12px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:14px">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                                    <div>
                                        <span style="font-weight:700;font-size:0.9rem">#${o.id}</span>
                                        <span style="font-size:0.78rem;color:var(--text-muted);margin-left:8px">${new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <span style="padding:4px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;background:rgba(16,185,129,0.12);color:var(--success);border:1px solid rgba(16,185,129,0.2)">${o.status}</span>
                                </div>
                                <div style="font-size:0.88rem;color:var(--text-secondary)">${o.itemCount || o.items?.length || 0} item(s)</div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                                    <span style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem">₹${(o.total || 0).toLocaleString()}</span>
                                    ${o.paymentId ? `<span style="font-size:0.75rem;color:var(--text-muted)">Payment: ${o.paymentId}</span>` : ''}
                                </div>
                                ${o.shippingAddress ? `<div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted)">📍 ${o.shippingAddress}</div>` : ''}
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    }

    /** Render a list of address cards (static helper) */
    static renderAddressList(addresses) {
        if (addresses.length === 0) {
            return `<div style="text-align:center;padding:40px;color:var(--text-muted)">
                <div style="font-size:2.5rem;margin-bottom:10px">📍</div>
                <div style="font-weight:600;color:var(--text-secondary)">No saved addresses</div>
                <p style="font-size:0.88rem">Add a delivery address to speed up checkout.</p>
            </div>`;
        }
        return addresses.map(a => `
            <div style="padding:16px;margin-bottom:12px;background:var(--glass-bg);border:1px solid ${a.isDefault ? 'var(--accent-1)' : 'var(--glass-border)'};border-radius:14px;position:relative">
                ${a.isDefault ? '<span style="position:absolute;top:10px;right:10px;padding:2px 10px;border-radius:6px;font-size:0.7rem;font-weight:600;background:var(--accent-gradient);color:#fff">DEFAULT</span>' : ''}
                <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${a.name}</div>
                <div style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6">${a.street}${a.landmark ? ', ' + a.landmark : ''}<br>${a.city}, ${a.state} — ${a.pincode}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px">📱 ${a.phone}</div>
                <div style="display:flex;gap:8px;margin-top:12px">
                    ${!a.isDefault ? `<button class="btn-glass set-default-addr" data-aid="${a.id}" style="font-size:0.8rem;padding:6px 14px">Set Default</button>` : ''}
                    <button class="btn-glass del-addr" data-aid="${a.id}" style="font-size:0.8rem;padding:6px 14px;color:var(--danger)">Delete</button>
                </div>
            </div>
        `).join('');
    }

    render() {
        this.el = this.createElement('div');
        this.el.style.cssText = 'position:relative;z-index:1;padding:32px;max-width:900px;margin:0 auto;';
        this.el.innerHTML = this.template();
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    _bindAddressActions() {
        setTimeout(() => {
            this.el.querySelectorAll('.set-default-addr').forEach(btn => {
                btn.addEventListener('click', () => {
                    const updated = setDefaultAddress(btn.dataset.aid);
                    document.getElementById('address-list').innerHTML = ProfilePage.renderAddressList(updated);
                    this._bindAddressActions();
                });
            });
            this.el.querySelectorAll('.del-addr').forEach(btn => {
                btn.addEventListener('click', () => {
                    const updated = deleteAddress(btn.dataset.aid);
                    document.getElementById('address-list').innerHTML = ProfilePage.renderAddressList(updated);
                    this._bindAddressActions();
                });
            });
        }, 0);
    }

    onMount() {
        super.onMount();
        const { onNavigate } = this.props;

        // Back button
        this.listen(document.getElementById('profile-back'), 'click', () => onNavigate('home'));

        // Tabs
        const tabs = this.$$('.profile-tab');
        tabs.forEach(tab => {
            this.listen(tab, 'click', () => {
                tabs.forEach(t => { t.classList.remove('active'); t.style.background = ''; t.style.color = 'var(--text-secondary)'; });
                tab.classList.add('active');
                tab.style.background = 'var(--accent-gradient)';
                tab.style.color = '#fff';
                this.$$('.profile-panel').forEach(p => p.style.display = 'none');
                document.getElementById(`tab-${tab.dataset.tab}`).style.display = 'block';
            });
        });
        // Activate first tab styling
        if (tabs.length) { tabs[0].style.background = 'var(--accent-gradient)'; tabs[0].style.color = '#fff'; }

        // Gender chips
        this.$$('.pf-gender').forEach(btn => {
            this.listen(btn, 'click', () => {
                this.$$('.pf-gender').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._selectedGender = btn.dataset.g;
            });
        });

        // Save profile
        this.listen(document.getElementById('profile-form'), 'submit', (e) => {
            e.preventDefault();
            updateProfile({
                name: document.getElementById('pf-name').value.trim(),
                email: document.getElementById('pf-email').value.trim(),
                phone: document.getElementById('pf-phone').value.trim(),
                dob: document.getElementById('pf-dob').value,
                gender: this._selectedGender,
            });
            const msg = document.getElementById('profile-msg');
            if (msg) { msg.textContent = '✅ Profile saved successfully!'; msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
        });

        // Address form
        this.listen(document.getElementById('add-address-btn'), 'click', () => document.getElementById('address-form-wrap').style.display = 'block');
        this.listen(document.getElementById('cancel-address'), 'click', () => document.getElementById('address-form-wrap').style.display = 'none');

        this.listen(document.getElementById('address-form'), 'submit', (e) => {
            e.preventDefault();
            const addr = {
                name: document.getElementById('addr-name').value.trim(),
                phone: document.getElementById('addr-phone').value.trim(),
                street: document.getElementById('addr-street').value.trim(),
                city: document.getElementById('addr-city').value.trim(),
                state: document.getElementById('addr-state').value.trim(),
                pincode: document.getElementById('addr-pincode').value.trim(),
                landmark: document.getElementById('addr-landmark').value.trim(),
            };
            const updated = addAddress(addr);
            document.getElementById('address-list').innerHTML = ProfilePage.renderAddressList(updated);
            document.getElementById('address-form-wrap').style.display = 'none';
            document.getElementById('address-form').reset();
            this._bindAddressActions();
        });

        this._bindAddressActions();
    }
}

// Factory for backward compatibility
export async function renderProfilePage(props) {
    const page = new ProfilePage(props);
    return page.render();
}

export { ProfilePage };
