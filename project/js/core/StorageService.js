/* ============================================
   SHOE SACK — Base Storage Service Class
   All services with localStorage inherit from this
   ============================================ */

export class StorageService {
    /**
     * @param {string} storageKey - The localStorage key prefix
     */
    constructor(storageKey) {
        this._key = storageKey;
    }

    /**
     * Read data from localStorage
     * @param {*} fallback - Default value if key not found
     * @returns {*}
     */
    _get(fallback = null) {
        try {
            const data = localStorage.getItem(this._key);
            return data ? JSON.parse(data) : fallback;
        } catch {
            return fallback;
        }
    }

    /**
     * Write data to localStorage
     * @param {*} data
     */
    _set(data) {
        localStorage.setItem(this._key, JSON.stringify(data));
    }

    /**
     * Remove the key from localStorage
     */
    _remove() {
        localStorage.removeItem(this._key);
    }

    /**
     * Read a sub-key from a stored object
     */
    _getField(field, fallback = null) {
        const data = this._get({});
        return data[field] ?? fallback;
    }

    /**
     * Update a sub-key in a stored object
     */
    _setField(field, value) {
        const data = this._get({});
        data[field] = value;
        this._set(data);
    }

    /**
     * Generate a unique ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now().toString(36)}`;
    }
}
