/* ================================================================
   ASHEN PAUL — style.css  (Task 5: Full-Stack Deployment & Architecture)
   ================================================================ */

/* ── TOKENS ──────────────────────────────────────────────────── */
:root {
  --bg:           #111010;
  --bg-2:         #1a1918;
  --bg-card:      #1f1d1c;
  --bg-input:     #252220;
  --border:       rgba(255,255,255,.09);
  --border-soft:  rgba(255,255,255,.05);
  --accent:       #e8923a;
  --accent-dim:   rgba(232,146,58,.13);
  --accent-hover: #f0a85a;
  --text:         #ede9e3;
  --text-soft:    #b8b2ab;
  --text-muted:   #7a7470;
  --white:        #fff;
  --danger:       #e05555;
  --success:      #4caf72;
  --success-dim:  rgba(76,175,114,.13);

  --font-head: 'Syne', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --max-w:  1160px;
  --r:      .5rem;
  --r-lg:   1rem;
  --ease:   cubic-bezier(.16,1,.3,1);
  --dur:    200ms;
}

[data-theme="light"] {
  --bg:          #f4f2ee;
  --bg-2:        #ebe8e3;
  --bg-card:     #ffffff;
  --bg-input:    #ffffff;
  --border:      rgba(0,0,0,.1);
  --border-soft: rgba(0,0,0,.05);
  --text:        #1a1816;
  --text-soft:   #4a4540;
  --text-muted:  #8a8480;
  --accent:      #c96a2a;
  --accent-dim:  rgba(201,106,42,.12);
  --accent-hover:#a0521e;
}

/* ── RESET ───────────────────────────────────────────────────── */
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }
@media (prefers-reduced-motion:reduce) {
  *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; }
}
body {
  background:var(--bg); color:var(--text);
  font-family:var(--font-body);
  font-size:clamp(1rem,.95rem + .2vw,1.05rem);
  line-height:1.65; min-height:100vh;
  -webkit-font-smoothing:antialiased;
  transition:background var(--dur),color var(--dur);
}
li  { list-style:none; }
img { display:block; max-width:100%; }
a   { color:var(--accent); text-decoration:none; transition:opacity var(--dur); }
a:hover { opacity:.8; }

/* ── A11Y ────────────────────────────────────────────────────── */
.sr-only {
  position:absolute; width:1px; height:1px;
  padding:0; margin:-1px; overflow:hidden;
  clip:rect(0,0,0,0); white-space:nowrap; border:0;
}
.skip-link {
  position:absolute; top:-10rem; left:1rem;
  background:var(--accent); color:#fff;
  padding:.5em 1.25em; border-radius:0 0 var(--r) var(--r);
  font-weight:700; font-size:.875rem; text-decoration:none;
  z-index:9999; transition:top var(--dur);
}
.skip-link:focus { top:0; }
:focus-visible { outline:2.5px solid var(--accent); outline-offset:3px; border-radius:var(--r); }

/* ── LAYOUT ──────────────────────────────────────────────────── */
.container { width:min(var(--max-w),100% - 2rem); margin-inline:auto; }

/* ── BUTTONS ─────────────────────────────────────────────────── */
.btn-solid {
  display:inline-flex; align-items:center; gap:.4em;
  padding:.65em 1.5em; background:var(--accent);
  border:none; border-radius:var(--r); color:#fff;
  font-family:var(--font-body); font-size:.9rem; font-weight:700;
  cursor:pointer; white-space:nowrap;
  transition:background var(--dur),transform 120ms var(--ease);
}
.btn-solid:hover,.btn-solid:focus-visible { background:var(--accent-hover); transform:translateY(-1px); color:#fff; }
.btn-outline {
  display:inline-flex; align-items:center; gap:.4em;
  padding:.6em 1.4em; background:none;
  border:1.5px solid var(--accent); border-radius:var(--r);
  color:var(--accent); font-family:var(--font-body);
  font-size:.9rem; font-weight:600; cursor:pointer;
  transition:background var(--dur),color var(--dur),transform 120ms;
}
.btn-outline:hover,.btn-outline:focus-visible { background:var(--accent); color:#fff; transform:translateY(-1px); }
.icon-btn {
  display:grid; place-items:center;
  width:2.2rem; height:2.2rem;
  background:none; border:1.5px solid var(--border);
  border-radius:var(--r); cursor:pointer;
  color:var(--text-muted); position:relative;
  transition:border-color var(--dur),color var(--dur);
}
.icon-btn:hover,.icon-btn:focus-visible { border-color:var(--accent); color:var(--accent); }

/* ── HEADER ──────────────────────────────────────────────────── */
.site-header {
  position:sticky; top:0; z-index:200;
  background:rgba(17,16,16,.92);
  backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  transition:background var(--dur);
}
[data-theme="light"] .site-header { background:rgba(244,242,238,.92); }

.header-inner {
  display:flex; align-items:center;
  justify-content:space-between;
  padding-block:.9rem; gap:1rem;
}
.logo {
  display:flex; align-items:center; gap:.6rem;
  font-family:var(--font-head); font-size:1.25rem; font-weight:700;
  color:var(--text); text-decoration:none; flex-shrink:0;
}
.logo:hover { opacity:1; color:var(--accent); }
.logo-mark {
  width:2rem; height:2rem; background:var(--accent);
  border-radius:var(--r); display:grid; place-items:center;
  font-size:.9rem; color:#fff; font-style:italic; flex-shrink:0;
}

.primary-nav ul { display:flex; gap:1.75rem; }
.primary-nav a {
  font-size:.875rem; font-weight:600; letter-spacing:.06em;
  text-transform:uppercase; color:var(--text-muted);
  padding-bottom:2px; border-bottom:1.5px solid transparent;
  transition:color var(--dur),border-color var(--dur);
}
.primary-nav a:hover,
.primary-nav a[aria-current="page"] {
  color:var(--text); border-color:var(--accent); opacity:1;
}

.header-right { display:flex; align-items:center; gap:.5rem; flex-shrink:0; }

.theme-btn .icon-sun  { display:none; }
.theme-btn .icon-moon { display:block; }
[data-theme="light"] .theme-btn .icon-sun  { display:block; }
[data-theme="light"] .theme-btn .icon-moon { display:none; }

.cart-badge {
  position:absolute; top:-.4rem; right:-.4rem;
  min-width:1.1rem; height:1.1rem;
  background:var(--accent); border-radius:99px;
  font-size:.6rem; font-weight:700; color:#fff;
  display:grid; place-items:center; padding:0 .2rem;
  transition:transform .2s var(--ease);
}
.cart-badge.bump { animation:bump .25s var(--ease); }
@keyframes bump { 0%,100%{transform:scale(1)} 50%{transform:scale(1.45)} }

.nav-toggle {
  display:none; flex-direction:column;
  align-items:center; justify-content:center; gap:5px;
}
.nav-toggle span {
  display:block; width:1.1rem; height:2px;
  background:var(--text); border-radius:2px;
  transition:transform var(--dur) var(--ease),opacity 150ms;
}
.nav-toggle[aria-expanded="true"] span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.nav-toggle[aria-expanded="true"] span:nth-child(2) { opacity:0; }
.nav-toggle[aria-expanded="true"] span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

@media (max-width:47.99rem) {
  .nav-toggle { display:flex; }
  .primary-nav {
    display:none; position:absolute;
    top:100%; left:0; right:0;
    background:var(--bg-2); border-bottom:1px solid var(--border);
    padding:1.25rem 1rem; z-index:190;
  }
  .primary-nav.open { display:block; }
  .primary-nav ul { flex-direction:column; gap:1rem; }
  .primary-nav a { font-size:1rem; }
}

/* ── CART DRAWER ─────────────────────────────────────────────── */
.cart-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,.55);
  z-index:300; animation:fade-in .2s ease both;
}
@keyframes fade-in { from{opacity:0} to{opacity:1} }

.cart-drawer {
  position:fixed; top:0; right:0; bottom:0;
  width:min(420px,100%); z-index:400;
  background:var(--bg-card); border-left:1px solid var(--border);
  display:flex; flex-direction:column;
  animation:slide-in-r .25s var(--ease) both;
  transition:background var(--dur);
}
@keyframes slide-in-r { from{transform:translateX(100%)} to{transform:none} }

.cart-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:1.25rem 1.5rem; border-bottom:1px solid var(--border);
}
.cart-title { font-family:var(--font-head); font-size:1.25rem; }
.cart-body  { flex:1; overflow-y:auto; padding:1rem 1.5rem; }

.cart-empty {
  display:flex; flex-direction:column; align-items:center;
  gap:.75rem; padding:3rem 1rem; text-align:center;
}
.cart-empty-icon { font-size:3rem; opacity:.3; }
.cart-empty p    { color:var(--text-muted); font-size:.9rem; }

.cart-item {
  display:grid; grid-template-columns:3rem 1fr auto;
  gap:.75rem; align-items:center;
  padding-block:.85rem; border-bottom:1px solid var(--border-soft);
  animation:fade-up .2s var(--ease) both;
}
.cart-item-thumb {
  width:3rem; height:3rem; border-radius:var(--r);
  display:grid; place-items:center; font-size:1.4rem; flex-shrink:0;
}
.cart-item-name  { font-size:.88rem; font-weight:600; margin-bottom:.2rem; line-height:1.3; }
.cart-item-price { font-size:.82rem; color:var(--accent); font-family:var(--font-mono); }
.cart-item-qty   { display:flex; align-items:center; gap:.4rem; margin-top:.35rem; }
.qty-btn {
  width:1.4rem; height:1.4rem; border-radius:50%;
  background:none; border:1px solid var(--border);
  color:var(--text-muted); cursor:pointer; font-size:.9rem;
  display:grid; place-items:center;
  transition:border-color var(--dur),color var(--dur);
}
.qty-btn:hover { border-color:var(--accent); color:var(--accent); }
.qty-num { font-size:.82rem; font-family:var(--font-mono); min-width:1.2rem; text-align:center; }
.cart-item-remove {
  background:none; border:none; cursor:pointer;
  color:var(--text-muted); font-size:.8rem;
  transition:color var(--dur);
}
.cart-item-remove:hover { color:var(--danger); }

.cart-footer {
  padding:1.25rem 1.5rem; border-top:1px solid var(--border); flex-shrink:0;
}
.cart-total-row {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:.4rem;
}
.cart-total  { font-family:var(--font-head); font-size:1.35rem; color:var(--accent); }
.cart-note   { font-size:.75rem; color:var(--text-muted); margin-bottom:1rem; }
.btn-checkout {
  width:100%; padding:.8em; background:var(--accent);
  border:none; border-radius:var(--r); color:#fff;
  font-family:var(--font-body); font-size:1rem; font-weight:700;
  cursor:pointer; transition:background var(--dur);
}
.btn-checkout:hover,.btn-checkout:focus-visible { background:var(--accent-hover); }

/* ── APP ROOT ────────────────────────────────────────────────── */
#app-root { animation:fade-up .25s var(--ease) both; }
@keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

/* ── SHOP HERO ───────────────────────────────────────────────── */
.shop-hero {
  background:var(--bg-2); border-bottom:1px solid var(--border);
  padding-block:2.5rem 2rem; transition:background var(--dur);
}
.shop-hero-inner {
  display:grid; grid-template-columns:1fr auto;
  align-items:center; gap:2rem;
}
@media (max-width:47.99rem) { .shop-hero-inner { grid-template-columns:1fr; } }
.shop-hero h1 { font-size:clamp(1.75rem,3vw+.8rem,2.6rem); margin-bottom:.35rem; }
.shop-hero h1 span { color:var(--accent); }
.shop-hero p  { color:var(--text-muted); font-size:.93rem; }
.hero-stats   { display:flex; gap:1.75rem; flex-wrap:wrap; }
.hero-stat    { text-align:center; }
.hero-stat-num   { display:block; font-family:var(--font-head); font-size:1.7rem; color:var(--accent); line-height:1; }
.hero-stat-label { font-size:.68rem; color:var(--text-muted); font-family:var(--font-mono); letter-spacing:.1em; text-transform:uppercase; }

/* ── CONTROLS BAR ────────────────────────────────────────────── */
.controls-bar {
  display:flex; align-items:center; flex-wrap:wrap;
  gap:.65rem; padding-block:1.1rem;
  border-bottom:1px solid var(--border);
}
.search-wrap { position:relative; flex:1; min-width:180px; }
.search-icon-sm {
  position:absolute; left:.7rem; top:50%; transform:translateY(-50%);
  color:var(--text-muted); pointer-events:none;
}
.search-field {
  width:100%; padding:.58em .9em .58em 2.1rem;
  background:var(--bg-card); border:1.5px solid var(--border);
  border-radius:var(--r); color:var(--text); font-size:.88rem;
  transition:border-color var(--dur),box-shadow var(--dur),background var(--dur);
}
.search-field::placeholder { color:var(--text-muted); }
.search-field:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }

.cat-pills { display:flex; gap:.35rem; flex-wrap:wrap; }
.cat-pill {
  padding:.28em 1em; border:1px solid var(--border);
  border-radius:99px; background:none; font-size:.78rem;
  color:var(--text-muted); cursor:pointer;
  transition:border-color var(--dur),color var(--dur),background var(--dur);
}
.cat-pill:hover,.cat-pill:focus-visible { border-color:var(--accent); color:var(--accent); }
.cat-pill.active { background:var(--accent); border-color:var(--accent); color:#fff; font-weight:700; }

.view-controls { display:flex; align-items:center; gap:.45rem; margin-left:auto; }
.sort-select {
  padding:.38em .8em; background:var(--bg-card);
  border:1.5px solid var(--border); border-radius:var(--r);
  color:var(--text); font-size:.8rem; cursor:pointer;
  transition:border-color var(--dur),background var(--dur);
}
.sort-select:focus { outline:none; border-color:var(--accent); }
.view-btn {
  width:2rem; height:2rem; background:none;
  border:1.5px solid var(--border); border-radius:var(--r);
  color:var(--text-muted); cursor:pointer; display:grid; place-items:center;
  transition:border-color var(--dur),color var(--dur);
}
.view-btn.active,.view-btn:hover { border-color:var(--accent); color:var(--accent); }

.results-info { font-size:.78rem; color:var(--text-muted); font-family:var(--font-mono); padding-block:.45rem; }

/* ── PRODUCT GRID ────────────────────────────────────────────── */
.product-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));
  gap:1.2rem; padding-block:1.25rem 3rem;
}
.product-grid.list-view { grid-template-columns:1fr; }

/* ── PRODUCT CARD ────────────────────────────────────────────── */
.prod-card {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--r-lg); overflow:hidden;
  display:flex; flex-direction:column;
  transition:border-color var(--dur),transform var(--dur) var(--ease),box-shadow var(--dur);
  animation:fade-up .22s var(--ease) both;
}
.prod-card:hover {
  border-color:rgba(232,146,58,.35);
  transform:translateY(-4px);
  box-shadow:0 12px 36px rgba(0,0,0,.3);
}
.list-view .prod-card { flex-direction:row; transform:none!important; }

.prod-thumb {
  height:10rem; display:grid; place-items:center;
  font-size:3.5rem; flex-shrink:0; position:relative;
}
.list-view .prod-thumb { width:8rem; height:auto; min-height:8rem; }

.prod-badge {
  position:absolute; top:.65rem; left:.65rem;
  padding:.2em .65em; background:var(--accent); border-radius:99px;
  font-size:.62rem; font-family:var(--font-mono); color:#fff; font-weight:700;
}

.prod-body {
  padding:1rem; flex:1; display:flex; flex-direction:column;
}
.prod-category {
  font-size:.68rem; font-family:var(--font-mono); color:var(--accent);
  letter-spacing:.12em; text-transform:uppercase; margin-bottom:.3rem;
}
.prod-name   { font-family:var(--font-head); font-size:1rem; margin-bottom:.45rem; line-height:1.25; }
.prod-rating { display:flex; align-items:center; gap:.35rem; font-size:.78rem; color:var(--text-muted); margin-bottom:.55rem; }
.stars       { color:#e8c23a; letter-spacing:-.1em; font-size:.88rem; }

.prod-price-row {
  display:flex; align-items:baseline; gap:.45rem;
  margin-bottom:.8rem; margin-top:auto; flex-wrap:wrap;
}
.prod-price    { font-family:var(--font-head); font-size:1.2rem; color:var(--accent); font-weight:700; }
.prod-orig     { font-size:.8rem; color:var(--text-muted); text-decoration:line-through; }
.prod-discount {
  font-size:.68rem; background:var(--success-dim);
  color:var(--success); padding:.15em .5em;
  border-radius:99px; font-family:var(--font-mono);
}

.prod-actions { display:flex; gap:.45rem; }
.btn-add-cart {
  flex:1; padding:.58em 1em; background:var(--accent);
  border:none; border-radius:var(--r); color:#fff;
  font-family:var(--font-body); font-size:.82rem; font-weight:700;
  cursor:pointer; transition:background var(--dur),transform 120ms;
}
.btn-add-cart:hover,.btn-add-cart:focus-visible { background:var(--accent-hover); transform:translateY(-1px); }
.btn-add-cart:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.btn-view-detail {
  padding:.58em .8em; background:none;
  border:1.5px solid var(--border); border-radius:var(--r);
  color:var(--text-muted); cursor:pointer; font-size:.82rem;
  transition:border-color var(--dur),color var(--dur);
}
.btn-view-detail:hover,.btn-view-detail:focus-visible { border-color:var(--accent); color:var(--accent); }

.out-of-stock .prod-thumb::after {
  content:'Out of Stock'; position:absolute; inset:0;
  background:rgba(0,0,0,.65); display:grid; place-items:center;
  font-size:.78rem; font-weight:700; color:var(--text-muted);
  font-family:var(--font-mono); letter-spacing:.1em;
}

.no-results { grid-column:1/-1; text-align:center; padding:4rem 1rem; }
.no-results p { color:var(--text-muted); margin-top:.5rem; }

/* ── PRODUCT DETAIL ──────────────────────────────────────────── */
.detail-view { padding-block:2rem 4rem; }
.back-btn {
  display:inline-flex; align-items:center; gap:.4rem;
  font-size:.85rem; color:var(--text-muted); cursor:pointer;
  background:none; border:none; margin-bottom:1.5rem;
  transition:color var(--dur);
}
.back-btn:hover { color:var(--accent); }
.detail-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:clamp(2rem,5vw,5rem); align-items:start;
}
@media (max-width:47.99rem) { .detail-grid { grid-template-columns:1fr; } }
.detail-thumb {
  border-radius:var(--r-lg); aspect-ratio:1;
  background:var(--bg-card); border:1px solid var(--border);
  display:grid; place-items:center; font-size:7rem;
}
.detail-category {
  font-size:.7rem; font-family:var(--font-mono);
  color:var(--accent); letter-spacing:.14em;
  text-transform:uppercase; margin-bottom:.45rem;
}
.detail-name   { font-size:clamp(1.5rem,3vw+.5rem,2.1rem); margin-bottom:.65rem; line-height:1.15; }
.detail-rating { display:flex; align-items:center; gap:.5rem; font-size:.88rem; color:var(--text-muted); margin-bottom:.85rem; }
.detail-price-row {
  display:flex; align-items:baseline; gap:.7rem;
  margin-bottom:1.1rem; flex-wrap:wrap;
}
.detail-price    { font-family:var(--font-head); font-size:2rem; color:var(--accent); font-weight:700; }
.detail-orig     { font-size:1rem; color:var(--text-muted); text-decoration:line-through; }
.detail-discount {
  font-size:.8rem; background:var(--success-dim);
  color:var(--success); padding:.2em .65em; border-radius:99px;
  font-family:var(--font-mono);
}
.detail-desc     { color:var(--text-soft); line-height:1.8; margin-bottom:1.1rem; font-size:.94rem; }
.detail-features { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:1.25rem; }
.feature-tag {
  padding:.22em .8em; background:var(--accent-dim);
  border:1px solid rgba(232,146,58,.2); border-radius:99px;
  font-size:.7rem; font-family:var(--font-mono); color:var(--accent);
}
.stock-info      { font-size:.78rem; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:1.1rem; }
.stock-info.low  { color:var(--danger); }

.detail-qty-row  { display:flex; align-items:center; gap:1rem; margin-bottom:1.1rem; flex-wrap:wrap; }
.qty-control {
  display:flex; align-items:center; gap:.5rem;
  background:var(--bg-card); border:1.5px solid var(--border);
  border-radius:var(--r); padding:.3rem .6rem;
}
.qty-control .qty-btn {
  width:1.6rem; height:1.6rem; border:none; background:none;
  cursor:pointer; color:var(--text-muted); font-size:1.1rem;
  display:grid; place-items:center; transition:color var(--dur);
}
.qty-control .qty-btn:hover { color:var(--accent); }
.qty-control .qty-num { font-size:.95rem; font-family:var(--font-mono); min-width:1.5rem; text-align:center; }
.detail-cta { display:flex; gap:.75rem; flex-wrap:wrap; }

/* ── ABOUT VIEW ──────────────────────────────────────────────── */
.about-view  { padding-block:3rem 5rem; }
.about-hero  { margin-bottom:2.5rem; border-bottom:1px solid var(--border); padding-bottom:2rem; }
.about-hero h1 { font-size:clamp(1.75rem,3vw+.8rem,2.6rem); margin-bottom:.65rem; }
.about-hero p  { color:var(--text-soft); max-width:60ch; line-height:1.8; }
.about-grid  { display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:start; }
@media (max-width:47.99rem) { .about-grid { grid-template-columns:1fr; } }
.about-grid p  { color:var(--text-soft); margin-bottom:1rem; line-height:1.8; }
.about-grid h2 { margin-bottom:1rem; }
.tech-list { list-style:none; display:flex; flex-direction:column; gap:.5rem; }
.tech-list li {
  display:flex; align-items:center; gap:.75rem;
  padding:.55rem .85rem; background:var(--bg-card);
  border:1px solid var(--border); border-radius:var(--r);
  font-size:.88rem; transition:border-color var(--dur);
}
.tech-list li:hover { border-color:var(--accent); }
.tech-icon { font-size:1.1rem; }

/* ── CONTACT VIEW ────────────────────────────────────────────── */
.contact-view   { padding-block:3rem 5rem; }
.contact-view h1 { font-size:clamp(1.75rem,3vw+.8rem,2.6rem); margin-bottom:.45rem; }
.contact-view > .container > p { color:var(--text-muted); margin-bottom:2rem; }
.contact-grid { display:grid; grid-template-columns:1fr 1.5fr; gap:4rem; align-items:start; }
@media (max-width:47.99rem) { .contact-grid { grid-template-columns:1fr; gap:2.5rem; } }

.contact-details { list-style:none; }
.contact-details li {
  display:flex; align-items:baseline; gap:.85rem;
  padding-block:.6rem; border-bottom:1px solid var(--border); font-size:.9rem;
}
.ci-label {
  font-family:var(--font-mono); font-size:.68rem; color:var(--accent);
  min-width:5rem; flex-shrink:0; text-transform:uppercase; letter-spacing:.1em;
}

.form-note  { font-size:.78rem; color:var(--text-muted); margin-bottom:1.2rem; }
.field-wrap { display:flex; flex-direction:column; gap:.3rem; margin-bottom:1.1rem; }
.field-wrap label {
  font-size:.78rem; font-weight:700; color:var(--text-soft);
  text-transform:uppercase; letter-spacing:.06em;
}
.field-wrap input,
.field-wrap textarea {
  padding:.68em 1em; background:var(--bg-card);
  border:1.5px solid var(--border); border-radius:var(--r);
  color:var(--text); font-size:.93rem; width:100%;
  transition:border-color var(--dur),box-shadow var(--dur),background var(--dur);
}
.field-wrap input::placeholder,
.field-wrap textarea::placeholder { color:var(--text-muted); }
.field-wrap input:focus,
.field-wrap textarea:focus {
  outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim);
}
.field-wrap input[aria-invalid="true"],
.field-wrap textarea[aria-invalid="true"] { border-color:var(--danger); }
.field-wrap textarea { resize:vertical; min-height:8rem; }
.field-error { font-size:.75rem; color:var(--danger); font-weight:700; }
.check-wrap  { flex-direction:row; align-items:flex-start; gap:.65rem; }
.check-wrap input[type="checkbox"] { width:1rem; height:1rem; margin-top:.2rem; accent-color:var(--accent); flex-shrink:0; }
.check-wrap label { font-weight:400; text-transform:none; letter-spacing:0; font-size:.85rem; }
.form-feedback {
  padding:.78rem 1rem; border-radius:var(--r);
  margin-bottom:1.1rem; font-size:.87rem; font-weight:700;
}
.form-feedback.success { background:var(--success-dim); border:1px solid rgba(76,175,114,.3); color:var(--success); }
.form-feedback.error   { background:rgba(224,85,85,.12); border:1px solid rgba(224,85,85,.3); color:var(--danger); }
.btn-spinner {
  width:1em; height:1em; border:2px solid transparent;
  border-top-color:currentColor; border-radius:50%; animation:spin .7s linear infinite;
}
@keyframes spin { to{transform:rotate(360deg)} }

/* ── TOAST ───────────────────────────────────────────────────── */
.toast {
  position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--r); padding:.6rem 1.25rem;
  font-size:.88rem; font-weight:600; z-index:600;
  box-shadow:0 8px 24px rgba(0,0,0,.3); white-space:nowrap;
  animation:toast-in .25s var(--ease) both;
}
@keyframes toast-in {
  from{opacity:0;transform:translate(-50%,12px)}
  to  {opacity:1;transform:translate(-50%,0)}
}

/* ── MODAL ───────────────────────────────────────────────────── */
.modal-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,.65);
  display:grid; place-items:center; z-index:700;
  padding:1rem; animation:fade-in .15s ease both;
}
.modal {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--r-lg); padding:2.5rem 2rem;
  text-align:center; max-width:400px; width:100%;
  animation:slide-up .2s var(--ease) both;
}
@keyframes slide-up { from{transform:translateY(16px);opacity:0} to{transform:none;opacity:1} }
.modal-icon { display:block; font-size:3rem; margin-bottom:.75rem; }
.modal h2   { font-size:1.5rem; margin-bottom:.5rem; }
.modal p    { color:var(--text-soft); margin-bottom:1.5rem; }

/* ── FOOTER ──────────────────────────────────────────────────── */
.site-footer {
  background:var(--bg-2); border-top:1px solid var(--border);
  padding-block:1.25rem; transition:background var(--dur);
}
.footer-inner {
  display:flex; justify-content:space-between;
  align-items:center; flex-wrap:wrap; gap:.75rem;
}
.footer-copy  { font-size:.78rem; color:var(--text-muted); }
.foot-links   { display:flex; gap:1.25rem; }
.foot-links a { font-size:.78rem; color:var(--text-muted); }
.foot-links a:hover { color:var(--accent); opacity:1; }

/* ── PRINT ───────────────────────────────────────────────────── */
@media print {
  .site-header,.skip-link,.cart-drawer,.cart-overlay,
  .toast,.nav-toggle,.controls-bar,.prod-actions,
  .icon-btn,.site-footer { display:none; }
  body { background:#fff; color:#000; }
  .prod-card { border:1px solid #ccc; break-inside:avoid; }
}