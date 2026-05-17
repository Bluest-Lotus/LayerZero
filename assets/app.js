let PRODUCTS = [];
let FILTERED = [];
let CURRENT_PRODUCT = null;

async function loadProducts() {
  const res = await fetch("assets/products.json");

  const data = await res.json();

  PRODUCTS = data.products;
  FILTERED = PRODUCTS;
}

function renderCatalog() {
  const catalog = document.getElementById("catalog");

  if (!catalog) return;

  catalog.innerHTML = "";

  FILTERED.forEach(product => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>$${product.price}</p>

      <a href="product.html?id=${product.id}">
        <button>View Product</button>
      </a>
    `;

    catalog.appendChild(card);
  });
}

function searchProducts(query) {
  query = query.toLowerCase();

  FILTERED = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );

  renderCatalog();
}

function filterByMaterial(material) {
  FILTERED = !material
    ? PRODUCTS
    : PRODUCTS.filter(
        product =>
          product.materials.includes(material)
      );

  renderCatalog();
}

function filterByColor(color) {
  FILTERED = !color
    ? PRODUCTS
    : PRODUCTS.filter(
        product =>
          product.colors.includes(color)
      );

  renderCatalog();
}

function resetFilters() {
  FILTERED = PRODUCTS;

  renderCatalog();
}

function calculateBulk(price, qty) {
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

function calculateProductionTime(
  volume,
  factor,
  qty
) {
  const minutes =
    volume * 0.08 * factor * qty;

  if (minutes < 60)
    return `${Math.round(minutes)} min`;

  if (minutes < 1440)
    return `${(minutes / 60).toFixed(1)} hrs`;

  return `${(minutes / 1440).toFixed(1)} days`;
}

function renderProductPage() {
  const id =
    new URLSearchParams(
      window.location.search
    ).get("id");

  CURRENT_PRODUCT =
    PRODUCTS.find(
      product => product.id === id
    );

  if (!CURRENT_PRODUCT) return;

  document.getElementById(
    "title"
  ).innerText =
    CURRENT_PRODUCT.name;

  document.getElementById(
    "desc"
  ).innerText =
    CURRENT_PRODUCT.description;

  const material =
    document.getElementById(
      "material"
    );

  const color =
    document.getElementById(
      "color"
    );

  CURRENT_PRODUCT.materials.forEach(
    item =>
      material.innerHTML +=
        `<option>${item}</option>`
  );

  CURRENT_PRODUCT.colors.forEach(
    item =>
      color.innerHTML +=
        `<option>${item}</option>`
  );

  document.getElementById(
    "buy"
  ).href =
    `https://www.paypal.com/ncp/payment/${CURRENT_PRODUCT.paypal}`;

  updateQuote();
}

function updateQuote() {
  if (!CURRENT_PRODUCT) return;

  const qty = parseInt(
    document.getElementById(
      "quantity"
    ).value || 1
  );

  const volume = parseFloat(
    document.getElementById(
      "volume"
    ).value || 10
  );

  const factor = parseFloat(
    document.getElementById(
      "materialFactor"
    ).value
  );

  const region =
    document.getElementById(
      "region"
    ).value;

  const speed =
    document.getElementById(
      "speed"
    ).value;

  const productCost =
    calculateBulk(
      CURRENT_PRODUCT.price,
      qty
    );

  const shipping =
    calculateShipping(
      region,
      speed
    );

  const productionTime =
    calculateProductionTime(
      volume,
      factor,
      qty
    );

  const total =
    productCost + shipping;

  document.getElementById(
    "price"
  ).innerText =
    `$${total.toFixed(2)}`;

  document.getElementById(
    "productionTime"
  ).innerText =
    `Production Time: ${productionTime}`;
}

function sendQuoteEmail() {
  alert(
    "Email integration ready."
  );
}
