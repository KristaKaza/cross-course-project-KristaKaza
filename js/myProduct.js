/* function getJacketIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get("id");
}

function getJacketTitleFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get("title");
}

async function fetchJacketDetail() {
  const jacketId = getJacketIdFromQuery();
  const title = getJacketTitleFromQuery();
  const productDetailContainer = document.getElementById(
    "productDetailContainer"
  );

  if (!jacketId) {
    return;
  }

  try {
    const response = await fetch(
      `https://www.rainydays-noroff.no/wp-json/wp/v2/product/${jacketId}`
    );
    const productDetail = await response.json();

    const titleContainer = document.getElementById("title");
    titleContainer.textContent = title;

    productDetailContainer.innerHTML = `
      <div class="flexbox-container-men">
        <img src="${
          productDetail.media_details.sizes.medium.source_url
        }" class="flexbox-item flexbox-men" alt="${productDetail.alt_text}">
        <div class="flexbox-description-men">
          <h1>${productDetail.title.rendered}</h1>
          <hr class="hr1">
          <form>
            <fieldset class="flexbox-size">
              <legend></legend>
              ${productDetail.sizes
                .map(
                  (size) => `
                <input type="radio" id="${size}" value="${size}" name="size" />
                <label for="${size}">${size}</label>
              `
                )
                .join("")}
            </fieldset>
          </form>
          <h2>NOK ${productDetail.price}</h2>
          <hr class="hr1">
          <div class="button-div">
            <button><a href="#" class="addToBag addToBagMenHover btn-container">ADD TO BAG</a></button>
            <button><a href="/html/payment.html" class="goToCheckout goToCheckoutHover btn-container">CHECKOUT</a></button>
          </div>
          <p>${productDetail.description.rendered}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching jacket detail:", error);
    // Handle errors here, such as displaying an error message to the user
  }
}

fetchJacketDetail();
 */

function getJacketIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get("id");
}

function getJacketTitleFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get("title");
}

async function fetchJacketDetail() {
  const jacketId = getJacketIdFromQuery();
  const title = getJacketTitleFromQuery();
  const productDetailContainer = document.getElementById(
    "productDetailContainer"
  );

  if (!jacketId) {
    return;
  }

  try {
    const response = await fetch(
      `https://www.rainydays-noroff.no/wp-json/wp/v2/product/${jacketId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const productDetail = await response.json();

    const titleContainer = document.getElementById("title");
    titleContainer.textContent = title;

    productDetailContainer.innerHTML = `
      <!-- Your HTML template for displaying the product details -->
    `;
  } catch (error) {
    console.error("Error fetching jacket detail:", error);
  }
}

fetchJacketDetail();
