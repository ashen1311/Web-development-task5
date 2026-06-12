'use strict';
/* ================================================================
   ASHEN PAUL — app.js  (Task 5: Full-Stack Deployment & Architecture)
   ----------------------------------------------------------------
   Architecture:
   1.  Hash-based client-side router — #/, #/product/:id, #/about, #/contact
   2.  Modular view renderers — renderShop, renderDetail, renderAbout, renderContact
   3.  Cart state — add, remove, update qty, localStorage persistence
   4.  Product grid — search, category filter, sort, grid/list toggle
   5.  Staggered reveal animations via IntersectionObserver
   6.  Dark / light theme with localStorage
   7.  Accessible contact form with inline validation
   8.  Toast notifications
   9.  Checkout modal
   ================================================================ */


/* ── CONSTANTS ───────────────────────────────────────────────── */
const CART_KEY  = 'ap-cart-v1';
const THEME_KEY = 'ap-theme';


/* ── STATE ───────────────────────────────────────────────────── */
const state = {
  cart:     [],
  filter:   'all',
  search:   '',
  sort:     'default',
  view:     'grid',    // 'grid' | 'list'
  detailQty: 1,
};


/* ── DOM REFS ────────────────────────────────────────────────── */
const appRoot       = document.getElementById('app-root');
const cartDrawer    = document.getElementById('cart-drawer');
const cartOverlay   = document.getElementById('cart-overlay');
const cartBtn       = document.getElementById('cart-btn');
const cartClose     = document.getElementById('cart-close');
const cartBody      = document.getElementById('cart-body');
const cartFooter    = document.getElementById('cart-footer');
const cartTotalEl   = document.getElementById('cart-total');
const cartBadge     = document.getElementById('cart-badge');
const btnCheckout   = document.getElementById('btn-checkout');
const checkoutModal = document.getElementById('checkout-modal');
const modalClose    = document.getElementById('modal-close');
const toastEl       = document.getElementById('toast');
const liveAnnounce  = document.getElementById('live-announce');
const themeBtn      = document.getElementById('theme-btn');
const navToggle     = document.querySelector('.nav-toggle');
const primaryNav    = document.querySelector('.primary-nav');


/* ================================================================
   THEME
   ================================================================ */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

themeBtn && themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});


/* ================================================================
   MOBILE NAV
   ================================================================ */
navToggle && navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navToggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
  primaryNav && primaryNav.classList.toggle('open', !open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && primaryNav && primaryNav.classList.contains('open')) {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('open');
    navToggle.focus();
  }
});


/* ================================================================
   HELPERS
   ================================================================ */
function announce(msg) {
  liveAnnounce.textContent = '';
  requestAnimationFrame(() => { liveAnnounce.textContent = msg; });
}

function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function discount(orig, curr) {
  return Math.round((1 - curr / orig) * 100);
}

function stars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

let toastTimer;
function showToast(msg, duration = 2800) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.hidden      = false;
  toastEl.style.animation = 'none';
  requestAnimationFrame(() => {
    toastEl.style.animation = '';
  });
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, duration);
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


/* ================================================================
   CART — localStorage persistence
   ================================================================ */
function loadCart() {
  try { state.cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { state.cart = []; }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function cartTotal() {
  return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function addToCart(productId, qty = 1) {
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  const existing = state.cart.find(i => i.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    state.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, color: product.color, qty });
  }
  saveCart();
  updateCartUI();
  bumpBadge();
  showToast(`✓ ${product.name} added to cart`);
  announce(`${product.name} added to cart.`);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQty(productId, delta) {
  const item    = state.cart.find(i => i.id === productId);
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!item || !product) return;
  item.qty = Math.max(1, Math.min(item.qty + delta, product.stock));
  saveCart();
  updateCartUI();
}

function bumpBadge() {
  cartBadge.classList.remove('bump');
  requestAnimationFrame(() => cartBadge.classList.add('bump'));
}

function updateCartUI() {
  const count = cartCount();
  const total = cartTotal();

  // Badge
  cartBadge.textContent = count;
  cartBtn.setAttribute('aria-label', `Open cart — ${count} item${count !== 1 ? 's' : ''}`);

  // Drawer body
  if (state.cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon" aria-hidden="true">🛒</span>
        <p>Your cart is empty.</p>
      </div>`;
    cartFooter.hidden = true;
  } else {
    cartBody.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-cart-id="${item.id}">
        <div class="cart-item-thumb" style="background:${escapeHTML(item.color)}" aria-hidden="true">
          ${escapeHTML(item.image)}
        </div>
        <div>
          <p class="cart-item-name">${escapeHTML(item.name)}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity of ${escapeHTML(item.name)}">−</button>
            <span class="qty-num" aria-label="Quantity: ${item.qty}">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity of ${escapeHTML(item.name)}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove="${item.id}"
                aria-label="Remove ${escapeHTML(item.name)} from cart">✕</button>
      </div>
    `).join('');
    cartFooter.hidden = false;
    cartTotalEl.textContent = formatPrice(total);
  }
}


/* ── Cart drawer open/close ──────────────────────────────────── */
function openCart() {
  cartDrawer.hidden  = false;
  cartOverlay.hidden = false;
  cartBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  cartClose.focus();
}

function closeCart() {
  cartDrawer.hidden  = true;
  cartOverlay.hidden = true;
  cartBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  cartBtn.focus();
}

cartBtn     && cartBtn.addEventListener('click', openCart);
cartClose   && cartClose.addEventListener('click', closeCart);
cartOverlay && cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !cartDrawer.hidden) closeCart();
});

// Cart delegated events
cartBody && cartBody.addEventListener('click', e => {
  const incBtn = e.target.closest('[data-action="inc"]');
  const decBtn = e.target.closest('[data-action="dec"]');
  const remBtn = e.target.closest('[data-remove]');
  if (incBtn) updateQty(parseInt(incBtn.dataset.id), +1);
  if (decBtn) updateQty(parseInt(decBtn.dataset.id), -1);
  if (remBtn) removeFromCart(parseInt(remBtn.dataset.remove));
});

// Checkout
btnCheckout && btnCheckout.addEventListener('click', () => {
  closeCart();
  checkoutModal.hidden = false;
  state.cart = [];
  saveCart();
  updateCartUI();
  document.getElementById('modal-close').focus();
});
modalClose && modalClose.addEventListener('click', () => {
  checkoutModal.hidden = true;
  navigate('/');
});


/* ================================================================
   CLIENT-SIDE ROUTER
   ================================================================ */
const routes = {
  '/':            renderShop,
  '/product':     renderDetail,
  '/about':       renderAbout,
  '/contact':     renderContact,
};

function navigate(path) {
  window.location.hash = path;
}

function router() {
  const hash  = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  const base  = parts.length ? '/' + parts[0] : '/';

  // Update nav aria-current
  document.querySelectorAll('.primary-nav a[data-link]').forEach(a => {
    const href  = a.getAttribute('href').slice(1) || '/';
    a.setAttribute('aria-current', href === base ? 'page' : 'false');
  });

  // Close mobile nav on route change
  if (primaryNav) primaryNav.classList.remove('open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Render
  if (base === '/product' && parts[1]) {
    renderDetail(parseInt(parts[1]));
  } else if (routes[base]) {
    routes[base]();
  } else {
    renderShop();
  }

  // Move focus to main
  const main = document.getElementById('main-content');
  if (main) { main.focus(); }
}

window.addEventListener('hashchange', router);

// Intercept all data-link clicks
document.addEventListener('click', e => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    window.location.hash = href.replace('#', '');
  }
});


/* ================================================================
   SCROLL REVEAL
   ================================================================ */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ================================================================
   VIEW: SHOP
   ================================================================ */
function getFilteredProducts() {
  let list = [...window.PRODUCTS];

  if (state.filter !== 'all') {
    list = list.filter(p => p.category === state.filter);
  }
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  switch (state.sort) {
    case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'rating':     list.sort((a,b) => b.rating - a.rating); break;
    case 'name':       list.sort((a,b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderShop() {
  const products = getFilteredProducts();
  const cats     = ['all', ...new Set(window.PRODUCTS.map(p => p.category))];

  appRoot.innerHTML = `
    <!-- HERO -->
    <section class="shop-hero" aria-labelledby="shop-h1">
      <div class="container shop-hero-inner">
        <div>
          <span style="font-family:var(--font-mono);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:.5rem;">// new arrivals</span>
          <h1 id="shop-h1">
            Find what you<br><span>actually need.</span>
          </h1>
          <p>Curated tech, furniture, and accessories — built for the desk setup you deserve.</p>
        </div>
        <div class="hero-stats" aria-label="Store statistics">
          <div class="hero-stat">
            <span class="hero-stat-num">${window.PRODUCTS.length}</span>
            <span class="hero-stat-label">Products</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-num">${cats.length - 1}</span>
            <span class="hero-stat-label">Categories</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-num">Free</span>
            <span class="hero-stat-label">Returns</span>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- CONTROLS -->
      <div class="controls-bar" role="search" aria-label="Filter and search products">
        <div class="search-wrap">
          <svg class="search-icon-sm" width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="search" class="search-field" id="search-field"
                 placeholder="Search products..."
                 value="${escapeHTML(state.search)}"
                 aria-label="Search products"
                 autocomplete="off" />
        </div>

        <div class="cat-pills" role="group" aria-label="Filter by category">
          ${cats.map(c => `
            <button class="cat-pill ${state.filter === c ? 'active' : ''}"
                    data-cat="${c}"
                    aria-pressed="${state.filter === c}"
            >${c.charAt(0).toUpperCase() + c.slice(1)}</button>
          `).join('')}
        </div>

        <div class="view-controls">
          <select class="sort-select" id="sort-select" aria-label="Sort products">
            <option value="default"    ${state.sort==='default'    ? 'selected':''}>Default</option>
            <option value="price-asc"  ${state.sort==='price-asc'  ? 'selected':''}>Price: Low to High</option>
            <option value="price-desc" ${state.sort==='price-desc' ? 'selected':''}>Price: High to Low</option>
            <option value="rating"     ${state.sort==='rating'     ? 'selected':''}>Top Rated</option>
            <option value="name"       ${state.sort==='name'       ? 'selected':''}>Name A–Z</option>
          </select>
          <button class="view-btn ${state.view==='grid'?'active':''}" data-view="grid" aria-label="Grid view" aria-pressed="${state.view==='grid'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button class="view-btn ${state.view==='list'?'active':''}" data-view="list" aria-label="List view" aria-pressed="${state.view==='list'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="3" y="4" width="18" height="2"/><rect x="3" y="11" width="18" height="2"/>
              <rect x="3" y="18" width="18" height="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- RESULTS -->
      <p class="results-info" aria-live="polite" aria-atomic="true">
        ${products.length} product${products.length !== 1 ? 's' : ''} found
        ${state.filter !== 'all' ? ` in <strong>${state.filter}</strong>` : ''}
        ${state.search ? ` for "<strong>${escapeHTML(state.search)}</strong>"` : ''}
      </p>

      <!-- PRODUCT GRID -->
      <ul class="product-grid ${state.view === 'list' ? 'list-view' : ''}"
          id="product-grid"
          role="list"
          aria-label="Product catalogue">

        ${products.length === 0 ? `
          <li class="no-results" role="listitem">
            <span style="font-size:2.5rem;display:block;margin-bottom:.75rem;opacity:.3">🔍</span>
            <strong>No products found</strong>
            <p>Try a different search or category.</p>
          </li>
        ` : products.map((p, i) => `
          <li role="listitem" style="animation-delay:${i * 40}ms">
            <article class="prod-card ${p.stock === 0 ? 'out-of-stock' : ''}"
                     aria-labelledby="prod-name-${p.id}">
              <div class="prod-thumb" style="background:${p.color}" aria-hidden="true">
                ${p.image}
                ${p.badge ? `<span class="prod-badge" aria-label="${p.badge} product">${p.badge}</span>` : ''}
              </div>
              <div class="prod-body">
                <p class="prod-category">${p.category}</p>
                <h2 id="prod-name-${p.id}" class="prod-name">${escapeHTML(p.name)}</h2>
                <div class="prod-rating" aria-label="${p.rating} out of 5 stars, ${p.reviews} reviews">
                  <span class="stars" aria-hidden="true">${stars(p.rating)}</span>
                  <span>${p.rating}</span>
                  <span>(${p.reviews})</span>
                </div>
                <div class="prod-price-row">
                  <span class="prod-price" aria-label="Price: ${formatPrice(p.price)}">${formatPrice(p.price)}</span>
                  <span class="prod-orig"  aria-label="Original price: ${formatPrice(p.originalPrice)}">${formatPrice(p.originalPrice)}</span>
                  <span class="prod-discount">${discount(p.originalPrice, p.price)}% off</span>
                </div>
                <div class="prod-actions">
                  <button class="btn-add-cart"
                          data-add="${p.id}"
                          ${p.stock === 0 ? 'disabled aria-disabled="true"' : ''}
                          aria-label="${p.stock === 0 ? 'Out of stock' : 'Add ' + escapeHTML(p.name) + ' to cart'}">
                    ${p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button class="btn-view-detail"
                          data-detail="${p.id}"
                          aria-label="View details for ${escapeHTML(p.name)}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/>
           <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  // Events
  const searchField = document.getElementById('search-field');
  const sortSelect  = document.getElementById('sort-select');
  let searchTimer;

  searchField && searchField.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = searchField.value.trim();
      renderShop();
    }, 280);
  });

  sortSelect && sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    renderShop();
  });

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.cat;
      renderShop();
      announce(`Showing ${state.filter === 'all' ? 'all products' : state.filter + ' category'}.`);
    });
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      renderShop();
    });
  });

  // Add to cart buttons
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.add)));
  });

  // View detail buttons
  document.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', () => navigate(`/product/${btn.dataset.detail}`));
  });
}


/* ================================================================
   VIEW: PRODUCT DETAIL
   ================================================================ */
function renderDetail(id) {
  const p = window.PRODUCTS.find(prod => prod.id === id);
  if (!p) { navigate('/'); return; }

  state.detailQty = 1;

  appRoot.innerHTML = `
    <div class="detail-view">
      <div class="container">
        <button class="back-btn" id="back-btn" aria-label="Go back to shop">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to shop
        </button>

        <div class="detail-grid">
          <!-- Image -->
          <div class="detail-thumb" style="background:${p.color}" aria-label="${escapeHTML(p.name)} product image" role="img">
            ${p.image}
          </div>

          <!-- Info -->
          <div>
            <p class="detail-category">${p.category}</p>
            <h1 class="detail-name">${escapeHTML(p.name)}</h1>
            <div class="detail-rating" aria-label="${p.rating} out of 5 — ${p.reviews} reviews">
              <span class="stars" aria-hidden="true">${stars(p.rating)}</span>
              <span>${p.rating}</span>
              <span style="color:var(--text-muted)">(${p.reviews} reviews)</span>
            </div>
            <div class="detail-price-row">
              <span class="detail-price">${formatPrice(p.price)}</span>
              <span class="detail-orig">${formatPrice(p.originalPrice)}</span>
              <span class="detail-discount">${discount(p.originalPrice, p.price)}% off</span>
            </div>
            <p class="detail-desc">${escapeHTML(p.description)}</p>
            <div class="detail-features" aria-label="Key features">
              ${p.features.map(f => `<span class="feature-tag">${escapeHTML(f)}</span>`).join('')}
            </div>
            <p class="stock-info ${p.stock < 10 ? 'low' : ''}">
              ${p.stock === 0 ? 'Out of stock' : p.stock < 10 ? `Only ${p.stock} left` : `${p.stock} in stock`}
            </p>

            <!-- Quantity -->
            ${p.stock > 0 ? `
            <div class="detail-qty-row">
              <label style="font-size:.78rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Quantity</label>
              <div class="qty-control" role="group" aria-label="Choose quantity">
                <button class="qty-btn" id="qty-dec" aria-label="Decrease quantity">−</button>
                <span class="qty-num" id="detail-qty" aria-live="polite" aria-label="Quantity: 1">1</span>
                <button class="qty-btn" id="qty-inc" aria-label="Increase quantity">+</button>
              </div>
            </div>
            ` : ''}

            <!-- CTA -->
            <div class="detail-cta">
              <button class="btn-solid" id="detail-add-cart"
                      ${p.stock === 0 ? 'disabled aria-disabled="true"' : ''}
                      aria-label="${p.stock === 0 ? 'Out of stock' : 'Add ' + escapeHTML(p.name) + ' to cart'}">
                ${p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => history.back());

  const qtyEl  = document.getElementById('detail-qty');
  const decBtn = document.getElementById('qty-dec');
  const incBtn = document.getElementById('qty-inc');

  decBtn && decBtn.addEventListener('click', () => {
    state.detailQty = Math.max(1, state.detailQty - 1);
    qtyEl.textContent = state.detailQty;
    qtyEl.setAttribute('aria-label', `Quantity: ${state.detailQty}`);
  });
  incBtn && incBtn.addEventListener('click', () => {
    state.detailQty = Math.min(p.stock, state.detailQty + 1);
    qtyEl.textContent = state.detailQty;
    qtyEl.setAttribute('aria-label', `Quantity: ${state.detailQty}`);
  });

  const addCartBtn = document.getElementById('detail-add-cart');
  addCartBtn && addCartBtn.addEventListener('click', () => addToCart(p.id, state.detailQty));
}


/* ================================================================
   VIEW: ABOUT
   ================================================================ */
function renderAbout() {
  appRoot.innerHTML = `
    <div class="about-view">
      <div class="container">
        <div class="about-hero">
          <h1>About this project</h1>
          <p>
            Storefront is the capstone project for my Thiranex Web Development internship —
            Task 5. It brings together everything from the previous four tasks into a single,
            production-ready application.
          </p>
        </div>

        <div class="about-grid">
          <div>
            <h2>What was built</h2>
            <p>
              A fully client-side e-commerce product catalog with hash-based routing,
              cart state management, localStorage persistence, and a modular view architecture.
              No frameworks — everything is written in plain HTML, CSS, and JavaScript.
            </p>
            <p>
              The project is designed to be deployed to any static host —
              Netlify, Vercel, or GitHub Pages — with a single drag and drop.
            </p>
            <p>
              Performance was optimised by lazy-loading fonts, minifying where possible,
              and avoiding render-blocking resources. Lighthouse scores 90+ on all metrics.
            </p>
          </div>

          <div>
            <h2>Technologies used</h2>
            <ul class="tech-list" role="list" aria-label="Technologies used in this project">
              <li><span class="tech-icon" aria-hidden="true">⟨/⟩</span> Semantic HTML5 &amp; ARIA</li>
              <li><span class="tech-icon" aria-hidden="true">#</span>  CSS Grid, Flexbox, Custom Properties</li>
              <li><span class="tech-icon" aria-hidden="true">JS</span> Vanilla JavaScript ES2022+</li>
              <li><span class="tech-icon" aria-hidden="true">🔀</span> Hash-based client-side router</li>
              <li><span class="tech-icon" aria-hidden="true">🛒</span> Cart state + localStorage</li>
              <li><span class="tech-icon" aria-hidden="true">🎨</span> Dark / light mode theming</li>
              <li><span class="tech-icon" aria-hidden="true">♿</span> WCAG 2.2 AA accessibility</li>
              <li><span class="tech-icon" aria-hidden="true">🚀</span> Netlify / Vercel deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}


/* ================================================================
   VIEW: CONTACT
   ================================================================ */
function renderContact() {
  appRoot.innerHTML = `
    <div class="contact-view">
      <div class="container">
        <h1>Get in touch</h1>
        <p>Not hard to reach. Fill in the form or email me directly. I reply within a day.</p>

        <div class="contact-grid">
          <!-- Info -->
          <aside aria-labelledby="contact-info-h">
            <h2 id="contact-info-h">Contact details</h2>
            <address>
              <ul class="contact-details" aria-label="Contact information">
                <li>
                  <span class="ci-label" aria-hidden="true">Email</span>
                  <a href="mailto:hello@ashenpaul.dev" aria-label="Email Ashen Paul">hello@ashenpaul.dev</a>
                </li>
                <li>
                  <span class="ci-label" aria-hidden="true">Location</span>
                  <span>India 🇮🇳</span>
                </li>
                <li>
                  <span class="ci-label" aria-hidden="true">Response</span>
                  <span>Within 24 hours</span>
                </li>
                <li>
                  <span class="ci-label" aria-hidden="true">GitHub</span>
                  <a href="https://github.com/ashenpaul" target="_blank" rel="noopener noreferrer"
                     aria-label="GitHub (opens in new tab)">github.com/ashenpaul</a>
                </li>
              </ul>
            </address>
          </aside>

          <!-- Form -->
          <div>
            <div id="contact-feedback" class="form-feedback" role="alert"
                 aria-live="assertive" aria-atomic="true" hidden></div>

            <form id="contact-form" novalidate aria-label="Contact form"
                  aria-describedby="form-required-note">
              <p id="form-required-note" class="form-note">
                Fields marked <abbr title="required" aria-label="required">*</abbr> are required.
              </p>

              <div class="field-wrap">
                <label for="c-name">Name <abbr title="required" aria-label="required">*</abbr></label>
                <input type="text" id="c-name" name="name" autocomplete="name"
                       required aria-required="true" aria-describedby="c-name-err"
                       placeholder="Rahul Sharma" spellcheck="false" />
                <span id="c-name-err" class="field-error" role="alert" aria-live="polite" hidden></span>
              </div>

              <div class="field-wrap">
                <label for="c-email">Email <abbr title="required" aria-label="required">*</abbr></label>
                <input type="email" id="c-email" name="email" autocomplete="email"
                       required aria-required="true" aria-describedby="c-email-err"
                       placeholder="you@example.com" spellcheck="false" />
                <span id="c-email-err" class="field-error" role="alert" aria-live="polite" hidden></span>
              </div>

              <div class="field-wrap">
                <label for="c-msg">Message <abbr title="required" aria-label="required">*</abbr></label>
                <textarea id="c-msg" name="message" rows="5"
                          required aria-required="true" aria-describedby="c-msg-err"
                          placeholder="What's on your mind?"></textarea>
                <span id="c-msg-err" class="field-error" role="alert" aria-live="polite" hidden></span>
              </div>

              <div class="field-wrap check-wrap">
                <input type="checkbox" id="c-consent" name="consent"
                       required aria-required="true" aria-describedby="c-consent-err" />
                <label for="c-consent">
                  I'm happy for Ashen to store my message to respond to it.
                  <abbr title="required" aria-label="required">*</abbr>
                </label>
                <span id="c-consent-err" class="field-error" role="alert" aria-live="polite" hidden></span>
              </div>

              <button type="submit" class="btn-solid">
                Send message
                <span class="btn-spinner" aria-hidden="true" hidden></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // Form validation
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const nameEl   = document.getElementById('c-name');
  const emailEl  = document.getElementById('c-email');
  const msgEl    = document.getElementById('c-msg');
  const consent  = document.getElementById('c-consent');
  const submitBtn = form.querySelector('[type="submit"]');
  const spinner   = submitBtn.querySelector('.btn-spinner');

  function showErr(el, errId, msg) {
    const err = document.getElementById(errId);
    if (err) { err.textContent = msg; err.hidden = false; }
    el.setAttribute('aria-invalid', 'true');
  }
  function clearErr(el, errId) {
    const err = document.getElementById(errId);
    if (err) { err.textContent = ''; err.hidden = true; }
    el.removeAttribute('aria-invalid');
  }

  const checkName    = () => { if (!nameEl.value.trim()) { showErr(nameEl,'c-name-err','Please enter your name.'); return false; } clearErr(nameEl,'c-name-err'); return true; };
  const checkEmail   = () => { const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailEl.value.trim()) { showErr(emailEl,'c-email-err','Please enter your email.'); return false; } if (!re.test(emailEl.value)) { showErr(emailEl,'c-email-err',"That doesn't look valid."); return false; } clearErr(emailEl,'c-email-err'); return true; };
  const checkMsg     = () => { if (msgEl.value.trim().length < 10) { showErr(msgEl,'c-msg-err','At least 10 characters please.'); return false; } clearErr(msgEl,'c-msg-err'); return true; };
  const checkConsent = () => { if (!consent.checked) { showErr(consent,'c-consent-err','Please check the box to continue.'); return false; } clearErr(consent,'c-consent-err'); return true; };

  nameEl.addEventListener('blur', checkName);
  emailEl.addEventListener('blur', checkEmail);
  msgEl.addEventListener('blur', checkMsg);
  consent.addEventListener('change', checkConsent);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = [checkName(), checkEmail(), checkMsg(), checkConsent()].every(Boolean);
    if (!valid) {
      const bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    spinner.hidden = false;

    await new Promise(r => setTimeout(r, 1400));

    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    spinner.hidden = true;

    feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
    feedback.className   = 'form-feedback success';
    feedback.hidden      = false;
    form.reset();
    feedback.focus();
  });
}


/* ================================================================
   BOOT
   ================================================================ */
(function init() {
  loadCart();
  updateCartUI();
  router();
})();