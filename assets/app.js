let PRODUCTS = [];
let FILTERED = [];
let CURRENT_PRODUCT = null;

async function loadProducts() {
  const res = await fetch("./assets/products.json");
  const data = await res.json();
  PRODUCTS = data.products;
  FILTERED = PRODUCTS;
}

/* ---------------- CATALOG ---------------- */

function renderCatalog() {
  const c = document.getElementById("catalog");
  if (!c) return;

  c.innerHTML = "";

  FILTERED.forEach(p => {
    const d = document.createElement("div");
    d.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p>$${p.price}</p>
      <a href="product.html?id=${p.id}">
        <button>View</button>
      </a>
    `;
    c.appendChild(d);
  });
}

function searchProducts(q) {
  q = q.toLowerCase();
  FILTERED = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
  renderCatalog();
}

function filterByMaterial(m) {
  FILTERED = !m ? PRODUCTS : PRODUCTS.filter(p => p.materials.includes(m));
  renderCatalog();
}

function filterByColor(c) {
  FILTERED = !c ? PRODUCTS : PRODUCTS.filter(p => p.colors.includes(c));
  renderCatalog();
}

function resetFilters() {
  FILTERED = PRODUCTS;
  renderCatalog();
}

/* ---------------- PRICING ---------------- */

function calcBulk(price, qty) {
  let discount = 0;
  if (qty >= 25) discount = 0.25;
  else if (qty >= 10) discount = 0.15;
  else if (qty >= 5) discount = 0.10;
  return price * qty * (1 - discount);
}

function calculateShipping(region, speed) {
  let base = 0;

  if (region === "canada") base = 6.99;
  if (region === "usa") base = 9.99;
  if (region === "intl") base = 18.99;

  return base * parseFloat(speed);
}

function calculateProductionTime(volume, factor, qty) {
  const baseRate = 0.08;
  const minutes = volume * baseRate * factor * qty;

  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hrs`;
  return `${(minutes / 1440).toFixed(1)} days`;
}

/* ---------------- PRODUCT PAGE ---------------- */

function renderProductPage() {
  const id = new URLSearchParams(location.search).get("id");
  CURRENT_PRODUCT = PRODUCTS.find(p => p.id === id);
  if (!CURRENT_PRODUCT) return;

  document.getElementById("title").innerText = CURRENT_PRODUCT.name;
  document.getElementById("desc").innerText = CURRENT_PRODUCT.description;

  const m = document.getElementById("material");
  const c = document.getElementById("color");

  CURRENT_PRODUCT.materials.forEach(x => m.innerHTML += `<option>${x}</option>`);
  CURRENT_PRODUCT.colors.forEach(x => c.innerHTML += `<option>${x}</option>`);

  document.getElementById("quantity").value = 1;

  document.getElementById("buy").href =
    `https://www.paypal.com/ncp/payment/${CURRENT_PRODUCT.paypal}`;

  updateQuote();
}

/* ---------------- QUOTE ENGINE ---------------- */

function updateQuote() {
  if (!CURRENT_PRODUCT) return;

  const qty = parseInt(document.getElementById("quantity").value || 1);
  const volume = parseFloat(document.getElementById("volume").value || 10);
  const factor = parseFloat(document.getElementById("materialFactor").value);

  const region = document.getElementById("region").value;
  const speed = document.getElementById("speed").value;

  const productCost = calcBulk(CURRENT_PRODUCT.price, qty);
  const shipping = calculateShipping(region, speed);
  const time = calculateProductionTime(volume, factor, qty);

  const total = productCost + shipping;

  document.getElementById("price").innerText =
    `$${total.toFixed(2)}`;

  document.getElementById("productionTime").innerText =
    `Production Time: ${time}`;
}

/* ---------------- EMAIL (PLACEHOLDER HOOK) ---------------- */

function sendQuoteEmail() {
  alert("Email integration hook ready (EmailJS or Formspree can be added here).");
}
