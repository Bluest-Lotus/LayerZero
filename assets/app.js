let PRODUCTS = [];

let FILTERED = [];

let CURRENT_PRODUCT = null;

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const res =
    await fetch(
      "./assets/products.json"
    );

  const data =
    await res.json();

  PRODUCTS =
    data.products;

  FILTERED =
    PRODUCTS;

}

/* =========================
   STOREFRONT
========================= */

function renderCatalog() {

  const catalog =
    document.getElementById(
      "catalog"
    );

  if (!catalog) return;

  catalog.innerHTML = "";

  FILTERED.forEach(
    product => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "product-card";

      card.innerHTML = `

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="product-content">

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.description}
          </p>

          <div class="product-footer">

            <h3>
              $${product.price}
            </h3>

            <a
              href="product.html?id=${product.id}"
            >

              <button class="primary-btn">

                View Product

              </button>

            </a>

          </div>

        </div>

      `;

      catalog.appendChild(
        card
      );

    }
  );

}

/* =========================
   PRODUCT PAGE
========================= */

function renderProductPage() {

  const id =

    new URLSearchParams(
      window.location.search
    ).get("id");

  CURRENT_PRODUCT =

    PRODUCTS.find(
      product =>
        product.id === id
    );

  if (
    !CURRENT_PRODUCT
  ) return;

  document.getElementById(
    "title"
  ).innerText =

    CURRENT_PRODUCT.name;

  document.getElementById(
    "desc"
  ).innerText =

    CURRENT_PRODUCT.description;

  document.getElementById(
    "productImage"
  ).src =

    CURRENT_PRODUCT.image;

  const material =

    document.getElementById(
      "material"
    );

  const color =

    document.getElementById(
      "color"
    );

  CURRENT_PRODUCT.materials.forEach(
    item => {

      material.innerHTML +=
        `<option>${item}</option>`;

    }
  );

  CURRENT_PRODUCT.colors.forEach(
    item => {

      color.innerHTML +=
        `<option>${item}</option>`;

    }
  );

  document.getElementById(
    "buy"
  ).href =

    `https://www.paypal.com/ncp/payment/${CURRENT_PRODUCT.paypal}`;

  updateQuote();

}

/* =========================
   PRICING
========================= */

function calculateBulk(
  price,
  qty
) {

  let discount = 0;

  if (qty >= 25)
    discount = 0.25;

  else if (qty >= 10)
    discount = 0.15;

  else if (qty >= 5)
    discount = 0.10;

  return (
    price *
    qty *
    (1 - discount)
  );

}

function calculateShipping(
  region,
  speed
) {

  let base = 0;

  if (
    region === "canada"
  ) base = 6.99;

  if (
    region === "usa"
  ) base = 9.99;

  if (
    region === "intl"
  ) base = 18.99;

  return (
    base *
    parseFloat(speed)
  );

}

function calculateProductionTime(
  qty
) {

  const hours =
    qty * 2;

  return (
    hours +
    " hrs"
  );

}

function updateQuote() {

  if (
    !CURRENT_PRODUCT
  ) return;

  const qty =

    parseInt(
      document.getElementById(
        "quantity"
      ).value || 1
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
      qty
    );

  const total =

    productCost +
    shipping;

  document.getElementById(
    "price"
  ).innerText =

    `$${total.toFixed(2)}`;

  document.getElementById(
    "productionTime"
  ).innerText =

    `Estimated Production Time: ${productionTime}`;

}
