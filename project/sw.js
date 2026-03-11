/* ============================================
   SHOE SACK — Service Worker
   Offline support, caching for Android & iOS PWA
   ============================================ */

const CACHE_NAME = 'SHOE SACK-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/services/db-service.js',
    '/js/services/auth-service.js',
    '/js/services/cart-service.js',
    '/js/services/wishlist-service.js',
    '/js/services/user-service.js',
    '/js/services/payment-service.js',
    '/js/components/auth-forms.js',
    '/js/components/navbar.js',
    '/js/components/hero-banner.js',
    '/js/components/product-list.js',
    '/js/components/product-detail.js',
    '/js/components/search-filter.js',
    '/js/components/cart-view.js',
    '/js/components/profile-page.js',
    '/manifest.json'
];

// Install — cache all static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch — Network first for HTML/API, Cache first for assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests and Razorpay/external scripts
    if (event.request.method !== 'GET') return;
    if (url.origin !== self.location.origin && !url.href.includes('unsplash') && !url.href.includes('fonts.googleapis') && !url.href.includes('fonts.gstatic')) return;

    // For images (Unsplash, etc) — cache first, then network
    if (url.href.includes('unsplash') || url.href.includes('images.')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => new Response('', { status: 404 }));
            })
        );
        return;
    }

    // For Google Fonts — cache first
    if (url.href.includes('fonts.googleapis') || url.href.includes('fonts.gstatic')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => new Response('', { status: 404 }));
            })
        );
        return;
    }

    // For app files — network first, fall back to cache
    event.respondWith(
        fetch(event.request).then((response) => {
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => {
            return caches.match(event.request).then((cached) => {
                return cached || caches.match('/index.html');
            });
        })
    );
});

// Push notification support (future)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'SHOE SACK';
    const options = {
        body: data.body || 'Check out the latest shoes!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
