/* ============================================
   SHOE SACK — PWA Service Worker & Install Prompt
   Extracted from inline HTML script
   ============================================ */

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[PWA] SW registered:', reg.scope))
            .catch(err => console.warn('[PWA] SW failed:', err));
    });
}

// Detect platform
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// Android: beforeinstallprompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install banner after 5 seconds if not dismissed before
    if (!localStorage.getItem('pwa_dismissed') && !isStandalone) {
        setTimeout(() => {
            const banner = document.getElementById('pwa-install-banner');
            if (banner) banner.classList.add('show');
        }, 5000);
    }
});

// Android install button
document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('[PWA] Install result:', result.outcome);
        deferredPrompt = null;
    } else if (isIOS) {
        // Show iOS instructions
        document.getElementById('ios-install-modal')?.classList.add('show');
    }
    document.getElementById('pwa-install-banner')?.classList.remove('show');
});

// Dismiss banner
document.getElementById('pwa-dismiss')?.addEventListener('click', () => {
    document.getElementById('pwa-install-banner')?.classList.remove('show');
    localStorage.setItem('pwa_dismissed', Date.now());
});

// iOS: Show install banner for iOS Safari
if (isIOS && !isStandalone && !localStorage.getItem('pwa_dismissed')) {
    setTimeout(() => {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.add('show');
    }, 8000);
}

// Close iOS modal
document.getElementById('ios-install-close')?.addEventListener('click', () => {
    document.getElementById('ios-install-modal')?.classList.remove('show');
});

// Track successful install
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed!');
    document.getElementById('pwa-install-banner')?.classList.remove('show');
    localStorage.setItem('pwa_installed', Date.now());
});
