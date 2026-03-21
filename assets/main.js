// Theme engine with localStorage persistence
(function () {
  const STORAGE_KEY = "cc-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }
})();

// Product search + tag filtering
(function () {
  const searchInput = document.getElementById("product-search");
  const productGrid = document.getElementById("product-grid");
  const tagFilterContainer = document.getElementById("tag-filter");

  if (!searchInput || !productGrid) return;

  const cards = Array.from(productGrid.querySelectorAll(".product-card"));

  const tagSet = new Set();
  cards.forEach(card => {
    const tagsAttr = card.getAttribute("data-tags") || "";
    tagsAttr.split(",").map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t));
  });

  const tags = Array.from(tagSet).sort();
  let activeTag = null;

  function renderTagPills() {
    if (!tagFilterContainer) return;
    tagFilterContainer.innerHTML = "";

    tags.forEach(tag => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "tag-pill";
      pill.textContent = tag;
      pill.dataset.tag = tag;

      if (activeTag === tag) {
        pill.classList.add("tag-pill--active");
      }

      pill.addEventListener("click", () => {
        if (activeTag === tag) {
          activeTag = null;
        } else {
          activeTag = tag;
        }
        renderTagPills();
        applyFilters();
      });

      tagFilterContainer.appendChild(pill);
    });
  }

  function applyFilters() {
    const query = (searchInput.value || "").toLowerCase().trim();

    cards.forEach(card => {
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const tagsAttr = (card.getAttribute("data-tags") || "").toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        tagsAttr.includes(query);

      const matchesTag =
        !activeTag ||
        tagsAttr.split(",").map(t => t.trim()).includes(activeTag);

      if (matchesSearch && matchesTag) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", applyFilters);

  renderTagPills();
})();

/* -----------------------------------------------------------
   LAYERZERO MICRO‑INTERACTIONS
----------------------------------------------------------- */

/* PAGE LOAD — Fade-in cascade */
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(
    ".hero, .catalog-header, .product-card, .category-card, .page-section"
  );

  elements.forEach((el, i) => {
    el.classList.add("fade-in-up");
    el.style.animationDelay = `${i * 40}ms`;
  });
});

/* HEADER SCROLL — Compression */
let lastScroll = 0;
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 40) {
    header.classList.add("lz-condensed");
  } else {
    header.classList.remove("lz-condensed");
  }

  lastScroll = current;
});

/* HERO PARALLAX */
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-content");
  if (!hero) return;

  const offset = window.scrollY * 0.02;
  hero.style.transform = `translateY(${offset}px)`;
});