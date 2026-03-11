/* ============================================
   SHOE SACK — Auth Forms (Class-based)
   Extends Component — Login/Signup with particles
   ============================================ */

import { Component } from '../core/Component.js';
import { signup, login, loginWithGoogle, loginWithPhone } from '../services/auth-service.js';

class AuthForms extends Component {
    constructor(props) {
        super(props);
        this._isLogin = true;
        this._animId = null;
        this._particles = [];
    }

    template() {
        return `
            <div class="auth-bg" style="background-image: url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1400')"></div>
            <div class="auth-bg-overlay"></div>
            <canvas class="auth-particle-canvas" id="auth-particles"></canvas>

            <div class="auth-card glass-panel-strong">
                <div class="auth-logo">
                    <div class="auth-logo-text">SHOE SACK</div>
                    <div class="auth-logo-sub">Premium Shoe Store</div>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Sign In</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>

                <div class="auth-error" id="auth-error"></div>

                <form class="auth-form" id="login-form">
                    <div class="auth-form-group">
                        <label class="auth-form-label">Email</label>
                        <input type="email" class="input-glass" id="login-email" placeholder="your@email.com" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Password</label>
                        <input type="password" class="input-glass" id="login-password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%;margin-top:4px">Sign In</button>
                </form>

                <form class="auth-form" id="signup-form" style="display:none">
                    <div class="auth-form-group">
                        <label class="auth-form-label">Full Name</label>
                        <input type="text" class="input-glass" id="signup-name" placeholder="John Doe" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Email</label>
                        <input type="email" class="input-glass" id="signup-email" placeholder="your@email.com" required>
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Phone</label>
                        <input type="tel" class="input-glass" id="signup-phone" placeholder="+91 9876543210">
                    </div>
                    <div class="auth-form-group">
                        <label class="auth-form-label">Password</label>
                        <input type="password" class="input-glass" id="signup-password" placeholder="Min 6 characters" required minlength="6">
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%;margin-top:4px">Create Account</button>
                </form>

                <div class="auth-divider"><span>or continue with</span></div>

                <div class="auth-social-btns">
                    <button class="auth-social-btn" id="google-login">🔵 Google</button>
                    <button class="auth-social-btn" id="phone-login">📱 Phone</button>
                </div>

                <div class="auth-toggle" id="auth-toggle">
                    Don't have an account? <a id="toggle-link">Sign up</a>
                </div>
            </div>
        `;
    }

    render() {
        this.el = this.createElement('div', 'auth-page');
        this.el.innerHTML = this.template();
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    /** Show error message with auto-dismiss */
    _showError(msg) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.classList.add('show');
            setTimeout(() => errorEl.classList.remove('show'), 4000);
        }
    }

    /** Switch between login and signup tabs */
    _switchTab(tab) {
        this._isLogin = tab === 'login';
        this.$$('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.getElementById('login-form').style.display = this._isLogin ? 'flex' : 'none';
        document.getElementById('signup-form').style.display = this._isLogin ? 'none' : 'flex';

        const authToggle = document.getElementById('auth-toggle');
        authToggle.innerHTML = this._isLogin
            ? 'Don\'t have an account? <a id="toggle-link">Sign up</a>'
            : 'Already have an account? <a id="toggle-link">Sign in</a>';
        this.listen(document.getElementById('toggle-link'), 'click', () =>
            this._switchTab(this._isLogin ? 'signup' : 'login')
        );
        document.getElementById('auth-error')?.classList.remove('show');
    }

    /** Initialize particle animation */
    _initParticles() {
        const canvas = document.getElementById('auth-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const PARTICLE_COUNT = 50;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        this.listen(window, 'resize', resize);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            this._particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
                r: Math.random() * 2 + 1, a: Math.random() * 0.5 + 0.2
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this._particles.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(229, 62, 62, ${p.a})`;
                ctx.fill();

                for (let j = i + 1; j < this._particles.length; j++) {
                    const dx = p.x - this._particles[j].x;
                    const dy = p.y - this._particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(this._particles[j].x, this._particles[j].y);
                        ctx.strokeStyle = `rgba(229, 62, 62, ${0.15 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            this._animId = requestAnimationFrame(draw);
        };
        draw();

        this.observe(document.body, { childList: true, subtree: true }, () => {
            if (!document.contains(canvas)) { cancelAnimationFrame(this._animId); this.destroy(); }
        });
    }

    onMount() {
        super.onMount();
        const { onSuccess } = this.props;

        // Tabs
        this.$$('.auth-tab').forEach(t =>
            this.listen(t, 'click', () => this._switchTab(t.dataset.tab))
        );
        this.listen(document.getElementById('toggle-link'), 'click', () => this._switchTab('signup'));

        // Login form
        this.listen(document.getElementById('login-form'), 'submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            const result = login(email, pass, 'USER');
            result.success ? onSuccess(result.user) : this._showError(result.message);
        });

        // Signup form
        this.listen(document.getElementById('signup-form'), 'submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const password = document.getElementById('signup-password').value;
            if (password.length < 6) { this._showError('Password must be at least 6 characters.'); return; }
            const result = signup({ name, email, phone, password });
            result.success ? onSuccess(result.user) : this._showError(result.message);
        });

        // Social logins
        this.listen(document.getElementById('google-login'), 'click', () => {
            const result = loginWithGoogle('USER');
            if (result.success) onSuccess(result.user);
        });
        this.listen(document.getElementById('phone-login'), 'click', () => {
            const phone = prompt('Enter your phone number:');
            if (phone) { const result = loginWithPhone(phone, 'USER'); if (result.success) onSuccess(result.user); }
        });

        // Particles
        this._initParticles();
    }

    destroy() {
        if (this._animId) cancelAnimationFrame(this._animId);
        super.destroy();
    }
}

// Factory for backward compatibility
export async function renderAuthLayout(props) {
    const auth = new AuthForms(props);
    return auth.render();
}

export { AuthForms };
