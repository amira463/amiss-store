/* ==========================================================================
   Amiss Store — app.js
   Vanilla JS: no framework, no backend. Products live in memory + cart in
   localStorage so it survives a page refresh.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Sample product data                                             */
  /* ------------------------------------------------------------------ */
  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "electronics", label: "Electronics" },
    { id: "home", label: "Home & Kitchen" },
    { id: "fashion", label: "Fashion" },
    { id: "beauty", label: "Beauty" },
    { id: "toys", label: "Toys & Games" },
    { id: "sports", label: "Sports & Outdoors" },
  ];

  const PRODUCTS = [
    { id: 1, title: "Mini USB-C desk fan with 3 speeds", category: "electronics", price: 8.49, was: 21.99, rating: 4.6, reviews: 2140, seed: "amiss-1" },
    { id: 2, title: "Wireless earbuds with charging case", category: "electronics", price: 14.99, was: 39.0, rating: 4.3, reviews: 5310, seed: "amiss-2" },
    { id: 3, title: "Ring light with adjustable phone clamp", category: "electronics", price: 11.25, was: 28.0, rating: 4.5, reviews: 980, seed: "amiss-3" },
    { id: 4, title: "6-in-1 fast charging cable set", category: "electronics", price: 6.99, was: 15.5, rating: 4.4, reviews: 1720, seed: "amiss-4" },
    { id: 5, title: "Non-stick ceramic frying pan, 26cm", category: "home", price: 12.8, was: 29.99, rating: 4.7, reviews: 860, seed: "amiss-5" },
    { id: 6, title: "Set of 4 stackable storage bins", category: "home", price: 9.5, was: 22.0, rating: 4.2, reviews: 430, seed: "amiss-6" },
    { id: 7, title: "LED strip lights, 5m with remote", category: "home", price: 7.2, was: 18.99, rating: 4.5, reviews: 3020, seed: "amiss-7" },
    { id: 8, title: "Memory foam bath mat, quick-dry", category: "home", price: 6.4, was: 14.0, rating: 4.3, reviews: 610, seed: "amiss-8" },
    { id: 9, title: "Oversized knit cardigan", category: "fashion", price: 15.99, was: 34.0, rating: 4.1, reviews: 290, seed: "amiss-9" },
    { id: 10, title: "Cargo pants with side pockets", category: "fashion", price: 13.5, was: 27.99, rating: 4.0, reviews: 540, seed: "amiss-10" },
    { id: 11, title: "Retro round sunglasses", category: "fashion", price: 5.99, was: 13.0, rating: 4.4, reviews: 1220, seed: "amiss-11" },
    { id: 12, title: "Canvas tote bag with inner pocket", category: "fashion", price: 8.0, was: 17.5, rating: 4.6, reviews: 780, seed: "amiss-12" },
    { id: 13, title: "Vitamin C serum, 30ml", category: "beauty", price: 6.75, was: 16.0, rating: 4.5, reviews: 1990, seed: "amiss-13" },
    { id: 14, title: "Silicone facial cleansing brush", category: "beauty", price: 4.99, was: 11.5, rating: 4.2, reviews: 660, seed: "amiss-14" },
    { id: 15, title: "12-piece makeup brush set", category: "beauty", price: 9.99, was: 24.0, rating: 4.3, reviews: 1440, seed: "amiss-15" },
    { id: 16, title: "Building blocks construction set, 350pc", category: "toys", price: 16.5, was: 35.0, rating: 4.7, reviews: 520, seed: "amiss-16" },
    { id: 17, title: "Remote control stunt car", category: "toys", price: 18.0, was: 42.0, rating: 4.4, reviews: 310, seed: "amiss-17" },
    { id: 18, title: "Puzzle cube speed set", category: "toys", price: 4.5, was: 10.0, rating: 4.6, reviews: 2210, seed: "amiss-18" },
    { id: 19, title: "Adjustable resistance bands set", category: "sports", price: 7.99, was: 19.99, rating: 4.5, reviews: 1330, seed: "amiss-19" },
    { id: 20, title: "Insulated stainless steel water bottle", category: "sports", price: 8.9, was: 20.0, rating: 4.6, reviews: 1870, seed: "amiss-20" },
    { id: 21, title: "Foldable yoga mat with strap", category: "sports", price: 10.2, was: 23.5, rating: 4.4, reviews: 640, seed: "amiss-21" },
    { id: 22, title: "Quick-dry microfiber towel, 2-pack", category: "sports", price: 6.1, was: 14.0, rating: 4.3, reviews: 410, seed: "amiss-22" },
  ];

  const IMG = (seed, size) => `https://picsum.photos/seed/${seed}/${size}/${size}`;

  /* ------------------------------------------------------------------ */
  /* 2. State                                                            */
  /* ------------------------------------------------------------------ */
  const state = {
    category: "all",
    query: "",
    cart: loadCart(),
  };

  function loadCart() {
    try {
      const raw = localStorage.getItem("amiss_cart");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem("amiss_cart", JSON.stringify(state.cart));
    } catch (e) {
      /* storage unavailable — cart just won't persist across reloads */
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. DOM refs                                                         */
  /* ------------------------------------------------------------------ */
  const el = {
    categoryNav: document.getElementById("categoryNav"),
    dealsRow: document.getElementById("dealsRow"),
    productGrid: document.getElementById("productGrid"),
    gridTitle: document.getElementById("gridTitle"),
    resultCount: document.getElementById("resultCount"),
    emptyState: document.getElementById("emptyState"),
    searchInput: document.getElementById("searchInput"),
    cartToggle: document.getElementById("cartToggle"),
    cartClose: document.getElementById("cartClose"),
    cartDrawer: document.getElementById("cartDrawer"),
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    cartItems: document.getElementById("cartItems"),
    cartEmpty: document.getElementById("cartEmpty"),
    cartFooter: document.getElementById("cartFooter"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartTotal: document.getElementById("cartTotal"),
    cartCount: document.getElementById("cartCount"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    toast: document.getElementById("toast"),
    year: document.getElementById("year"),
    countdownH: document.getElementById("cd-h"),
    countdownM: document.getElementById("cd-m"),
    countdownS: document.getElementById("cd-s"),
  };

  const money = (n) => `$${n.toFixed(2)}`;

  /* ------------------------------------------------------------------ */
  /* 4. Category chips                                                  */
  /* ------------------------------------------------------------------ */
  function renderCategoryNav() {
    el.categoryNav.innerHTML = CATEGORIES.map(
      (c) =>
        `<button class="chip${c.id === state.category ? " is-active" : ""}" data-category="${c.id}">${c.label}</button>`
    ).join("");
  }

  el.categoryNav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    state.category = btn.dataset.category;
    renderCategoryNav();
    renderGrid();
  });

  /* ------------------------------------------------------------------ */
  /* 5. Deals strip (top-rated items, fixed subset)                     */
  /* ------------------------------------------------------------------ */
  function renderDeals() {
    const deals = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
    el.dealsRow.innerHTML = deals
      .map((p) => {
        const pct = discountPct(p);
        return `
        <div class="deal-card" data-id="${p.id}">
          <div class="deal-card-img">
            <img src="${IMG(p.seed, 200)}" alt="" loading="lazy">
            <span class="deal-badge">-${pct}%</span>
          </div>
          <p class="deal-card-title">${p.title}</p>
          <p class="deal-card-price">${money(p.price)}</p>
        </div>`;
      })
      .join("");
  }

  el.dealsRow.addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    const target = document.getElementById("products");
    target.scrollIntoView({ behavior: "smooth" });
    state.query = "";
    el.searchInput.value = "";
    const product = PRODUCTS.find((p) => p.id === Number(card.dataset.id));
    if (product) {
      state.category = product.category;
      renderCategoryNav();
      renderGrid();
    }
  });

  function discountPct(p) {
    return Math.round(((p.was - p.price) / p.was) * 100);
  }

  /* ------------------------------------------------------------------ */
  /* 6. Product grid                                                    */
  /* ------------------------------------------------------------------ */
  function getFilteredProducts() {
    return PRODUCTS.filter((p) => {
      const inCategory = state.category === "all" || p.category === state.category;
      const inQuery =
        state.query.trim() === "" ||
        p.title.toLowerCase().includes(state.query.trim().toLowerCase());
      return inCategory && inQuery;
    });
  }

  function starString(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function renderGrid() {
    const list = getFilteredProducts();
    const activeCat = CATEGORIES.find((c) => c.id === state.category);
    el.gridTitle.textContent =
      state.query.trim() !== ""
        ? `Results for "${state.query.trim()}"`
        : activeCat && activeCat.id !== "all"
        ? activeCat.label
        : "Everything, basically";
    el.resultCount.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;

    if (list.length === 0) {
      el.productGrid.innerHTML = "";
      el.emptyState.hidden = false;
      return;
    }
    el.emptyState.hidden = true;

    el.productGrid.innerHTML = list
      .map((p) => {
        const inCart = !!state.cart[p.id];
        return `
        <div class="product-card">
          <div class="product-media">
            <img src="${IMG(p.seed, 400)}" alt="" loading="lazy">
            <span class="product-discount">-${discountPct(p)}%</span>
          </div>
          <div class="product-body">
            <p class="product-title">${p.title}</p>
            <div class="product-rating">
              <span class="stars">${starString(p.rating)}</span>
              <span>${p.reviews.toLocaleString()}</span>
            </div>
            <div class="product-price-row">
              <span class="product-price">${money(p.price)}</span>
              <span class="product-was">${money(p.was)}</span>
            </div>
            <button class="add-btn${inCart ? " is-added" : ""}" data-add="${p.id}">
              ${inCart ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>`;
      })
      .join("");
  }

  el.productGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = Number(btn.dataset.add);
    addToCart(id);
    btn.textContent = "Added ✓";
    btn.classList.add("is-added");
    showToast("Added to cart");
    setTimeout(() => {
      btn.textContent = "Add to cart";
      btn.classList.remove("is-added");
    }, 1200);
  });

  /* ------------------------------------------------------------------ */
  /* 7. Search                                                           */
  /* ------------------------------------------------------------------ */
  let searchTimer = null;
  el.searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value;
    searchTimer = setTimeout(() => {
      state.query = value;
      renderGrid();
    }, 150);
  });

  /* ------------------------------------------------------------------ */
  /* 8. Cart logic                                                       */
  /* ------------------------------------------------------------------ */
  function addToCart(id) {
    if (state.cart[id]) {
      state.cart[id].qty += 1;
    } else {
      state.cart[id] = { qty: 1 };
    }
    saveCart();
    renderCartCount();
    renderCartDrawer();
    renderGrid();
  }

  function updateQty(id, delta) {
    const item = state.cart[id];
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) delete state.cart[id];
    saveCart();
    renderCartCount();
    renderCartDrawer();
    renderGrid();
  }

  function removeFromCart(id) {
    delete state.cart[id];
    saveCart();
    renderCartCount();
    renderCartDrawer();
    renderGrid();
  }

  function cartEntries() {
    return Object.keys(state.cart)
      .map((id) => {
        const product = PRODUCTS.find((p) => p.id === Number(id));
        if (!product) return null;
        return { product, qty: state.cart[id].qty };
      })
      .filter(Boolean);
  }

  function renderCartCount() {
    const total = cartEntries().reduce((sum, e) => sum + e.qty, 0);
    el.cartCount.textContent = total;
  }

  function renderCartDrawer() {
    const entries = cartEntries();
    if (entries.length === 0) {
      el.cartItems.innerHTML = "";
      el.cartEmpty.style.display = "block";
      el.cartFooter.style.display = "none";
      return;
    }
    el.cartEmpty.style.display = "none";
    el.cartFooter.style.display = "block";

    el.cartItems.innerHTML = entries
      .map(({ product, qty }) => {
        return `
        <div class="cart-item" data-id="${product.id}">
          <img src="${IMG(product.seed, 120)}" alt="" loading="lazy">
          <div class="cart-item-info">
            <p class="cart-item-title">${product.title}</p>
            <div class="cart-item-row">
              <div class="qty-control">
                <button data-qty="-1">&minus;</button>
                <span>${qty}</span>
                <button data-qty="1">+</button>
              </div>
              <span class="cart-item-price">${money(product.price * qty)}</span>
            </div>
            <button class="remove-btn" data-remove>Remove</button>
          </div>
        </div>`;
      })
      .join("");

    const subtotal = entries.reduce((sum, e) => sum + e.product.price * e.qty, 0);
    el.cartSubtotal.textContent = money(subtotal);
    el.cartTotal.textContent = money(subtotal);
  }

  el.cartItems.addEventListener("click", (e) => {
    const row = e.target.closest("[data-id]");
    if (!row) return;
    const id = Number(row.dataset.id);

    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      updateQty(id, Number(qtyBtn.dataset.qty));
      return;
    }
    if (e.target.closest("[data-remove]")) {
      removeFromCart(id);
    }
  });

  /* ------------------------------------------------------------------ */
  /* 9. Drawer open/close                                                */
  /* ------------------------------------------------------------------ */
  function openDrawer() {
    el.cartDrawer.classList.add("is-open");
    el.drawerBackdrop.classList.add("is-open");
    el.cartDrawer.setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    el.cartDrawer.classList.remove("is-open");
    el.drawerBackdrop.classList.remove("is-open");
    el.cartDrawer.setAttribute("aria-hidden", "true");
  }
  el.cartToggle.addEventListener("click", openDrawer);
  el.cartClose.addEventListener("click", closeDrawer);
  el.drawerBackdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  el.checkoutBtn.addEventListener("click", () => {
    showToast("This is a demo — no real checkout yet");
  });

  /* ------------------------------------------------------------------ */
  /* 10. Toast                                                           */
  /* ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("is-visible"), 1800);
  }

  /* ------------------------------------------------------------------ */
  /* 11. Countdown (resets every 6 hours, purely cosmetic)               */
  /* ------------------------------------------------------------------ */
  function tickCountdown() {
    const sixHours = 6 * 60 * 60 * 1000;
    const remainder = sixHours - (Date.now() % sixHours);
    const h = Math.floor(remainder / 3600000);
    const m = Math.floor((remainder % 3600000) / 60000);
    const s = Math.floor((remainder % 60000) / 1000);
    el.countdownH.textContent = String(h).padStart(2, "0");
    el.countdownM.textContent = String(m).padStart(2, "0");
    el.countdownS.textContent = String(s).padStart(2, "0");
  }

  /* ------------------------------------------------------------------ */
  /* 12. Smooth-scroll buttons                                           */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ------------------------------------------------------------------ */
  /* 13. Init                                                            */
  /* ------------------------------------------------------------------ */
  function init() {
    el.year.textContent = new Date().getFullYear();
    renderCategoryNav();
    renderDeals();
    renderGrid();
    renderCartCount();
    renderCartDrawer();
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  init();
})();
