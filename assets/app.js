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
   HOMEPAGE CAROUSEL
========================= */

function renderPreviewCarousel() {

  const carousel =
    document.getElementById(
      "previewCarousel"
    );

  if (!carousel) return;

  carousel.innerHTML = "";

  PRODUCTS.forEach(
    product => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "preview-card";

      card.innerHTML = `

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="preview-content">

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.description}
          </p>

          <a
            href="product.html?id=${product.id}"
          >

            <button class="primary-btn">

              View Product

            </button>

          </a>

        </div>

      `;

      carousel.appendChild(
        card
      );

    }
  );

}

/* =========================
   HOMEPAGE ESTIMATOR
========================= */

function calculateHomepageEstimate() {

  const material =

    parseFloat(
      document.getElementById(
        "estimateMaterial"
      ).value
    );

  const color =

    parseFloat(
      document.getElementById(
        "estimateColor"
      ).value
    );

  const grams =

    parseFloat(
      document.getElementById(
        "estimateGrams"
      ).value
    );

  const total =

    8 +
    (grams * material) +
    color;

  const time =

    Math.max(
      4,
      Math.round(
        grams / 18
      )
    );

  document.getElementById(
    "estimatePrice"
  ).innerText =

    `$${total.toFixed(2)}`;

  document.getElementById(
    "estimateTime"
  ).innerText =

    `Estimated Production Time: ${time} hrs`;

}
