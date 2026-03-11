/* ============================================
   SHOE SACK — Payment Service (Class-based)
   Razorpay integration
   ============================================ */

import { StorageService } from '../core/StorageService.js';

class PaymentService extends StorageService {
    constructor() {
        super('shoesack_payments');
        this.razorpayKey = 'rzp_test_1DP5mmOlF5G5ag';
        this.themColor = '#e53e3e';
    }

    /** Get payment history */
    getPaymentHistory() {
        return this._get([]);
    }

    /** Save a payment record */
    _savePayment(payment) {
        const payments = this.getPaymentHistory();
        payments.unshift(payment);
        this._set(payments);
        return payment;
    }

    /** Simulate payment (fallback when Razorpay CDN unavailable) */
    _simulatePayment(orderId, amount) {
        const payment = {
            paymentId: StorageService.generateId('pay_sim'),
            orderId, amount,
            method: 'simulated',
            status: 'captured',
            timestamp: new Date().toISOString()
        };
        this._savePayment(payment);
        return payment;
    }

    /**
     * Initiate Razorpay checkout
     * @param {Object} params - { amount, orderId, user, address, items }
     * @returns {Promise<Object>} - { success, paymentId, ... }
     */
    initiatePayment({ amount, orderId, user, address, items }) {
        return new Promise((resolve) => {
            if (typeof window.Razorpay === 'undefined') {
                console.warn('Razorpay not loaded. Simulating payment...');
                resolve({ success: true, ...this._simulatePayment(orderId, amount) });
                return;
            }

            const options = {
                key: this.razorpayKey,
                amount: amount * 100,
                currency: 'INR',
                name: 'Shoe Sack',
                description: `Order #${orderId}`,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                notes: {
                    address: address ? `${address.street}, ${address.city}, ${address.state} ${address.pincode}` : '',
                    itemCount: items?.length || 0
                },
                theme: { color: this.themColor },
                handler: (response) => {
                    const payment = {
                        paymentId: response.razorpay_payment_id,
                        orderId, amount,
                        method: 'razorpay',
                        status: 'captured',
                        razorpayOrderId: response.razorpay_order_id || null,
                        razorpaySignature: response.razorpay_signature || null,
                        timestamp: new Date().toISOString()
                    };
                    this._savePayment(payment);
                    resolve({ success: true, ...payment });
                },
                modal: {
                    ondismiss: () => resolve({ success: false, reason: 'dismissed' }),
                    escape: true,
                    animation: true
                }
            };

            try {
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', (response) => {
                    resolve({ success: false, reason: 'failed', error: response.error?.description || 'Payment failed' });
                });
                rzp.open();
            } catch (err) {
                console.warn('Razorpay error, simulating:', err);
                resolve({ success: true, ...this._simulatePayment(orderId, amount) });
            }
        });
    }
}

// Singleton
const paymentService = new PaymentService();
export default paymentService;

// Named exports for backward compatibility
export const initiatePayment = (params) => paymentService.initiatePayment(params);
export const getPaymentHistory = () => paymentService.getPaymentHistory();
