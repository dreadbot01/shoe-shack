/* ============================================
   SHOE SACK — Hero Banner (Class-based)
   Extends Component — auto-rotating carousel
   ============================================ */

import { Component } from '../core/Component.js';

class HeroBanner extends Component {
    constructor(props) {
        super(props);
        this._current = 0;
        this._slides = [
            { badge: '🔥 New Arrivals', title: 'Step Into the Future', desc: 'Discover the latest sneakers and running shoes from top global brands.', cta: 'Shop New', bg: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1400' },
            { badge: '🏃 Running Collection', title: 'Run Like Never Before', desc: 'Performance running shoes with advanced cushioning technology.', cta: 'Shop Running', bg: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1400' },
            { badge: '👟 Sneaker Drop', title: 'Street Style Icons', desc: 'Limited edition sneakers from Nike, Jordan, Adidas & more.', cta: 'Shop Sneakers', bg: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1400' },
            { badge: '💥 Flash Sale', title: 'Up to 50% Off Everything', desc: 'Grab the best deals on premium footwear. Limited time only.', cta: 'Shop Sale', bg: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1400' },
        ];
    }

    template() {
        return `
            <div class="hero-carousel">
                <div class="hero-track" id="hero-track">
                    ${this._slides.map(s => `
                        <div class="hero-slide">
                            <div class="hero-slide-bg" style="background-image:url('${s.bg}')"></div>
                            <div class="hero-slide-overlay"></div>
                            <div class="hero-slide-content">
                                <span class="hero-badge">${s.badge}</span>
                                <h2 class="hero-title">${s.title}</h2>
                                <p class="hero-desc">${s.desc}</p>
                                <button class="btn-primary">${s.cta} →</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="hero-arrows">
                    <button class="hero-arrow" id="hero-prev">‹</button>
                    <button class="hero-arrow" id="hero-next">›</button>
                </div>
                <div class="hero-dots" id="hero-dots">
                    ${this._slides.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></div>`).join('')}
                </div>
            </div>
        `;
    }

    _goTo(i) {
        this._current = ((i % this._slides.length) + this._slides.length) % this._slides.length;
        const track = document.getElementById('hero-track');
        if (track) track.style.transform = `translateX(-${this._current * 100}%)`;
        this.$$('.hero-dot').forEach((d, idx) => d.classList.toggle('active', idx === this._current));
    }

    _resetTimer() {
        this._timers.forEach(id => clearInterval(id));
        this._timers = [];
        this.setTimer(() => this._goTo(this._current + 1), 4000);
    }

    onMount() {
        super.onMount();

        this.listen(document.getElementById('hero-prev'), 'click', () => { this._goTo(this._current - 1); this._resetTimer(); });
        this.listen(document.getElementById('hero-next'), 'click', () => { this._goTo(this._current + 1); this._resetTimer(); });

        this.$$('.hero-dot').forEach(d => {
            this.listen(d, 'click', () => { this._goTo(+d.dataset.i); this._resetTimer(); });
        });

        // Touch support
        let touchStartX = 0;
        const carousel = this.$('.hero-carousel');
        if (carousel) {
            this.listen(carousel, 'touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
            this.listen(carousel, 'touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { this._goTo(diff > 0 ? this._current + 1 : this._current - 1); this._resetTimer(); }
            }, { passive: true });
        }

        this._resetTimer();

        // Auto cleanup when removed from DOM
        this.observe(document.body, { childList: true, subtree: true }, () => {
            if (!document.contains(this.el)) this.destroy();
        });
    }
}

// Factory function for backward compatibility
export async function renderHeroBanner() {
    const banner = new HeroBanner();
    return banner.render();
}

export { HeroBanner };
