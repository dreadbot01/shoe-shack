/* ============================================
   SHOE SACK — Base Component Class
   All UI components inherit from this
   ============================================ */

export class Component {
    /**
     * @param {Object} props - Configuration passed to the component
     */
    constructor(props = {}) {
        this.props = props;
        this.el = null;
        this._mounted = false;
        this._listeners = [];
        this._timers = [];
        this._observers = [];
    }

    /**
     * Create the root DOM element — override in subclasses
     * @returns {string} HTML string
     */
    template() {
        return '';
    }

    /**
     * Build and return the component's root element
     * @returns {HTMLElement}
     */
    createElement(tag = 'div', className = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    }

    /**
     * Render the component: creates element, sets HTML, binds events
     * @returns {HTMLElement}
     */
    render() {
        this.el = this.createElement();
        this.el.innerHTML = this.template();
        // Defer event binding to next tick so DOM is ready
        setTimeout(() => this.onMount(), 0);
        return this.el;
    }

    /**
     * Async render — for components that need to fetch data
     * @returns {Promise<HTMLElement>}
     */
    async renderAsync() {
        return this.render();
    }

    /**
     * Called after element is in the DOM — bind events here
     * Override in subclasses
     */
    onMount() {
        this._mounted = true;
    }

    /**
     * Cleanup: remove listeners, clear timers, disconnect observers
     */
    destroy() {
        this._mounted = false;
        this._listeners.forEach(({ el, event, handler }) => {
            el?.removeEventListener(event, handler);
        });
        this._timers.forEach(id => clearInterval(id));
        this._observers.forEach(obs => obs.disconnect());
        this._listeners = [];
        this._timers = [];
        this._observers = [];
        if (this.el?.parentNode) this.el.parentNode.removeChild(this.el);
    }

    /**
     * Safe event listener that auto-cleans on destroy
     */
    listen(el, event, handler, options) {
        if (!el) return;
        el.addEventListener(event, handler, options);
        this._listeners.push({ el, event, handler });
    }

    /**
     * Safe interval that auto-clears on destroy
     */
    setTimer(callback, ms) {
        const id = setInterval(callback, ms);
        this._timers.push(id);
        return id;
    }

    /**
     * Safe MutationObserver that auto-disconnects
     */
    observe(target, config, callback) {
        const obs = new MutationObserver(callback);
        obs.observe(target, config);
        this._observers.push(obs);
        return obs;
    }

    /**
     * Query within this component's element
     */
    $(selector) {
        return this.el?.querySelector(selector);
    }

    $$(selector) {
        return this.el?.querySelectorAll(selector) || [];
    }

    /**
     * Emit a custom event
     */
    emit(eventName, detail = {}) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
}
