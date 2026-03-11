/* ============================================
   SHOE SACK — Search Filter (Class-based)
   Extends Component — sidebar with filters
   ============================================ */

import { Component } from '../core/Component.js';
import { getAllBrands, getAllCategories, getPriceRange } from '../services/db-service.js';

/** Static filter constants */
const SIZES = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
const COLORS = [
    { name: 'Black', hex: '#111' }, { name: 'White', hex: '#f5f5f5' },
    { name: 'Navy', hex: '#1a237e' }, { name: 'Red', hex: '#d32f2f' },
    { name: 'Blue', hex: '#1976d2' }, { name: 'Grey', hex: '#757575' },
    { name: 'Brown', hex: '#5d4037' }, { name: 'Pink', hex: '#e91e63' },
    { name: 'Green', hex: '#388e3c' }, { name: 'Beige', hex: '#d4a76a' },
    { name: 'White', hex: '#f0ead6' }, { name: 'Yellow', hex: '#f9a825' }
];
const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'discount', label: 'Best Discount' }
];

class SearchFilter extends Component {
    constructor(props) {
        super(props);
        this._filters = { ...props.currentFilters };
        this._brands = getAllBrands();
        this._categories = getAllCategories();
        this._priceRange = getPriceRange();
    }

    /** Build a radio group section */
    _radioSection(title, targetId, name, options, currentValue) {
        return `
            <div class="filter-section">
                <div class="filter-section-header" data-target="${targetId}">
                    <span class="filter-section-title">${title}</span>
                    <span class="filter-toggle">▾</span>
                </div>
                <div class="filter-section-body" id="${targetId}">
                    ${options.map(o => `
                        <label class="filter-checkbox">
                            <input type="radio" name="${name}" value="${typeof o === 'object' ? o.value : o}" ${currentValue === (typeof o === 'object' ? o.value : o) ? 'checked' : ''}>
                            ${typeof o === 'object' ? o.label : o}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    template() {
        const currentMax = this._filters.maxPrice || this._priceRange.max;
        return `
            ${this._radioSection('Sort By', 'sort-body', 'sort', SORT_OPTIONS, this._filters.sort || 'relevance')}
            ${this._radioSection('Gender', 'gender-body', 'gender', ['All', 'Men', 'Women'], this._filters.gender || 'All')}
            ${this._radioSection('Category', 'category-body', 'category', this._categories, this._filters.category)}

            <div class="filter-section">
                <div class="filter-section-header" data-target="price-body">
                    <span class="filter-section-title">Price Range</span>
                    <span class="filter-toggle">▾</span>
                </div>
                <div class="filter-section-body" id="price-body">
                    <div class="filter-price-range">
                        <input type="range" id="price-slider" min="${this._priceRange.min}" max="${this._priceRange.max}" value="${currentMax}" step="100">
                        <div class="filter-price-label">
                            <span>₹${this._priceRange.min.toLocaleString()}</span>
                            <span id="price-max-label">₹${currentMax.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <div class="filter-section-header" data-target="size-body">
                    <span class="filter-section-title">Size</span>
                    <span class="filter-toggle">▾</span>
                </div>
                <div class="filter-section-body" id="size-body">
                    <div class="filter-size-grid">
                        ${SIZES.map(s => `<button class="size-chip ${this._filters.size === s ? 'active' : ''}" data-size="${s}">${s.replace('UK ', '')}</button>`).join('')}
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <div class="filter-section-header" data-target="color-body">
                    <span class="filter-section-title">Color</span>
                    <span class="filter-toggle">▾</span>
                </div>
                <div class="filter-section-body" id="color-body">
                    <div class="filter-color-grid">
                        ${COLORS.map(c => `<button class="color-swatch ${this._filters.color === c.name ? 'active' : ''}" data-color="${c.name}" style="background:${c.hex}" title="${c.name}"></button>`).join('')}
                    </div>
                </div>
            </div>

            ${this._radioSection('Brand', 'brand-body', 'brand', this._brands, this._filters.brand)}

            <div class="filter-section">
                <div class="filter-section-header" data-target="rating-body">
                    <span class="filter-section-title">Rating</span>
                    <span class="filter-toggle">▾</span>
                </div>
                <div class="filter-section-body" id="rating-body">
                    ${[4, 3, 2].map(r => `
                        <label class="filter-checkbox">
                            <input type="radio" name="rating" value="${r}" ${this._filters.minRating === r ? 'checked' : ''}>
                            ${'★'.repeat(r)}${'☆'.repeat(5 - r)} & Above
                        </label>
                    `).join('')}
                </div>
            </div>

            <button class="filter-clear-btn" id="filter-clear">✕ Clear All Filters</button>
        `;
    }

    render() {
        this.el = this.createElement('aside', 'filter-sidebar glass-panel');
        this.el.innerHTML = this.template();
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    _emitChange() {
        this.props.onFilterChange({ ...this._filters });
    }

    onMount() {
        super.onMount();

        // Collapse toggles
        this.$$('.filter-section-header').forEach(header => {
            this.listen(header, 'click', () => {
                const body = document.getElementById(header.dataset.target);
                const toggle = header.querySelector('.filter-toggle');
                if (body) body.classList.toggle('collapsed');
                if (toggle) toggle.classList.toggle('collapsed');
            });
        });

        // Sort
        this.$$('input[name="sort"]').forEach(input =>
            this.listen(input, 'change', () => { this._filters.sort = input.value === 'relevance' ? undefined : input.value; this._emitChange(); })
        );

        // Gender
        this.$$('input[name="gender"]').forEach(input =>
            this.listen(input, 'change', () => { this._filters.gender = input.value; this._emitChange(); })
        );

        // Category
        this.$$('input[name="category"]').forEach(input =>
            this.listen(input, 'change', () => {
                this._filters.category = this._filters.category === input.value ? (input.checked = false, undefined) : input.value;
                this._emitChange();
            })
        );

        // Price slider
        const priceSlider = document.getElementById('price-slider');
        const priceLabel = document.getElementById('price-max-label');
        if (priceSlider) {
            this.listen(priceSlider, 'input', () => {
                const val = +priceSlider.value;
                if (priceLabel) priceLabel.textContent = `₹${val.toLocaleString()}`;
                this._filters.maxPrice = val;
                this._emitChange();
            });
        }

        // Size chips
        this.$$('.size-chip').forEach(chip => {
            this.listen(chip, 'click', () => {
                const isActive = chip.classList.contains('active');
                this.$$('.size-chip').forEach(c => c.classList.remove('active'));
                if (!isActive) { chip.classList.add('active'); this._filters.size = chip.dataset.size; }
                else { this._filters.size = undefined; }
                this._emitChange();
            });
        });

        // Color swatches
        this.$$('.color-swatch').forEach(swatch => {
            this.listen(swatch, 'click', () => {
                const isActive = swatch.classList.contains('active');
                this.$$('.color-swatch').forEach(s => s.classList.remove('active'));
                if (!isActive) { swatch.classList.add('active'); this._filters.color = swatch.dataset.color; }
                else { this._filters.color = undefined; }
                this._emitChange();
            });
        });

        // Brand
        this.$$('input[name="brand"]').forEach(input =>
            this.listen(input, 'change', () => {
                this._filters.brand = this._filters.brand === input.value ? (input.checked = false, undefined) : input.value;
                this._emitChange();
            })
        );

        // Rating
        this.$$('input[name="rating"]').forEach(input =>
            this.listen(input, 'change', () => { this._filters.minRating = +input.value; this._emitChange(); })
        );

        // Clear all
        this.listen(document.getElementById('filter-clear'), 'click', () => {
            Object.keys(this._filters).forEach(k => delete this._filters[k]);
            this.$$('input[type="radio"]').forEach(i => i.checked = false);
            this.$$('.size-chip, .color-swatch').forEach(c => c.classList.remove('active'));
            this.$$('input[name="gender"][value="All"]').forEach(i => i.checked = true);
            this.$$('input[name="sort"][value="relevance"]').forEach(i => i.checked = true);
            if (priceSlider) { priceSlider.value = this._priceRange.max; if (priceLabel) priceLabel.textContent = `₹${this._priceRange.max.toLocaleString()}`; }
            this._emitChange();
        });
    }
}

// Factory for backward compatibility
export async function renderFilters(props) {
    const filter = new SearchFilter(props);
    return filter.render();
}

export { SearchFilter };
