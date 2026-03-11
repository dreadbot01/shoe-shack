# 👟 Shoe Shack — Premium Shoe Store

Welcome to **Shoe Shack** (also branded as Shoe Sack), a modern, full-stack Progressive Web App (PWA) e-commerce platform for premium footwear. 

## ✨ Features

- **Progressive Web App (PWA):** Fully installable on iOS and Android with customized installation banners and instructions.
- **Sleek UI/UX:** Responsive, modern design with smooth animations and an out-of-the-box dark-theme aesthetic using modular CSS.
- **E-Commerce functionality:**
  - Product browsing and responsive grid layouts.
  - Search and filtering capabilities.
  - Wishlist and cart management.
  - User profile and authentication handling.
- **Payment Integration:** Ready-to-use Razorpay checkout integration.
- **Component-Based Vanilla JS:** Built with a modular Javascript architecture (`js/core/Component.js`) for a scalable and maintainable frontend without the overhead of heavy frameworks.

## 📁 Project Structure

```text
shoe-shack/
├── css/                  # Modular CSS architecture
│   ├── base/             # Resets, design tokens, and utilities
│   ├── components/       # Component-specific styles (hero, navbar, products, etc.)
│   └── style.css         # Main stylesheet importing all modules
├── js/                   # Vanilla JS component-based app
│   ├── components/       # UI components (navbar, cart, auth forms, product lists)
│   ├── core/             # Base classes (Component, StorageService)
│   ├── services/         # Application services (auth, db, cart, wishlist, payment)
│   ├── app.js            # Main entry point triggering initialization
│   └── pwa.js            # Service worker registration and PWA logic
├── icons/                # PWA icons and SVGs
├── index.html            # Main application HTML structure
├── manifest.json         # PWA Web App Manifest
└── sw.js                 # Service Worker for offline and caching support
```

## 🚀 Getting Started

Simply serve the `shoe-shack` directory using any local web server.

```bash
# Example using Python 3
cd shoe-shack
python -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.

## 🛠️ Built With

- **HTML5 & CSS3** (Vanilla, customized theming)
- **JavaScript (ES6+)** with a custom component wrapper
- **Razorpay** (Payment Gateway)
- **Service Workers & Web App Manifest** (PWA features)
