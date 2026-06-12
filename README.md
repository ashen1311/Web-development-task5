# Web-development-task5

# Ashen Paul — Task 5: Full-Stack Deployment & Project Architecture

**Capstone project.** An e-commerce product catalog that combines everything from Tasks 1–4 into a single, production-ready application — deployed live to a public URL.

---

## What was built

A fully client-side e-commerce storefront. No frameworks, no build tools, no backend. Just HTML, CSS, and JavaScript — written by hand, architected like a real project.

---

## Features

| Feature | Detail |
|---|---|
| **Client-side routing** | Hash-based router (`#/`, `#/about`, `#/contact`, `#/product/:id`) — seamless SPA navigation |
| **Modular views** | Each page is a separate render function — `renderShop`, `renderDetail`, `renderAbout`, `renderContact` |
| **Product catalog** | 12 products across 3 categories with search, filter, sort, and grid/list toggle |
| **Cart system** | Add, remove, update quantity — state saved to `localStorage` |
| **Product detail page** | Full description, features, quantity selector, dynamic routing |
| **Contact form** | Accessible, validated, inline errors, ARIA live regions |
| **Dark / light mode** | Toggle saved to `localStorage` |
| **Toast notifications** | Feedback on cart actions |
| **Checkout modal** | Order confirmation clears cart |
| **Accessibility** | Skip link, ARIA labels, focus management, keyboard navigation |
| **Responsive** | Mobile-first, works on all screen sizes |

---

## File structure

```
task5-ecommerce/
├── index.html          Entry point — SPA shell
├── assets/
│   ├── style.css       All styles — tokens, Grid, Flexbox, animations
│   ├── products.js     Product data — 12 items exposed as window.PRODUCTS
│   └── app.js          All logic — router, views, cart, forms
└── README.md           This file
```

---

## How to upload to GitHub

### First time on this machine

```bash
git config --global user.name "Ashen Paul"
git config --global user.email "hello@ashenpaul.dev"
```

---

### Create a GitHub repo

1. Go to **https://github.com/new**
2. Repository name: `storefront`
3. Visibility: **Public**
4. Do NOT tick "Add a README"
5. Click **Create repository**

---

### Push your files

```bash
cd path/to/task5-ecommerce

git init
git add .
git commit -m "task 5: e-commerce capstone — client-side SPA, routing, cart"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/storefront.git
git push -u origin main
```

---

## Deploy live (free)

### Option A — Netlify (recommended, easiest)

1. Go to **https://netlify.com** and sign up free
2. Click **Add new site → Import an existing project**
3. Connect GitHub → select your `storefront` repo
4. Build settings: leave everything blank (no build command, no publish directory)
5. Click **Deploy site**
6. Your live URL will be something like: `https://ashen-storefront.netlify.app`

**Or drag and drop:** Go to **https://app.netlify.com/drop** and drag your `task5-ecommerce` folder straight onto the page. Done in 30 seconds.

---

### Option B — Vercel

1. Go to **https://vercel.com** and sign up free
2. Click **Add New → Project**
3. Import your GitHub repo
4. Framework preset: **Other**
5. Leave build settings blank
6. Click **Deploy**
7. Live at: `https://storefront-your-username.vercel.app`

---

### Option C — GitHub Pages (already know this one)

1. Repo → **Settings → Pages**
2. Source: **main** / folder: **/ (root)**
3. Save
4. Live at: `https://YOUR_USERNAME.github.io/storefront/`

> **Note for GitHub Pages:** The hash-based router (`#/`) works perfectly on GitHub Pages — no server config needed.

---

## Every future update

```bash
git add .
git commit -m "describe what changed"
git push
```

Netlify and Vercel redeploy automatically on every push. GitHub Pages does too.

---

## Useful Git commands

```bash
git status          # see what changed
git log --oneline   # commit history
git diff            # line-by-line changes before staging
```

---

## Licence

MIT
