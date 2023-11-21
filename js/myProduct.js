// Function to fetch image based on mediaId
async function fetchImage(mediaId) {
  try {
    const imageUrl = `https://noroffcors.onrender.com/https://www.rainydays-noroff.no/wp-json/wp/v2/media/${mediaId}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const mediaData = await response.json();
    const imageSrc = mediaData.media_details.sizes.medium.source_url;
    return imageSrc;
  } catch (error) {
    console.error("Error fetching image:", error);
    return ""; // Return an empty string or a placeholder image URL
  }
}

function getJacketIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function getJacketTitleFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("title");
}

function handleCheckoutButtonClick() {
  const checkoutButton = document.querySelector("#checkoutButton");

  checkoutButton.addEventListener("click", () => {
    window.location.href = "/html/payment.html";
  });
}

// Function to fetch jacket details and display them on the webpage
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
      `https://noroffcors.onrender.com/https://www.rainydays-noroff.no/wp-json/wp/v2/product/${jacketId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const productDetail = await response.json();

    const image = document.createElement("img");
    image.alt = productDetail.title.rendered;
    image.classList.add("flexbox-item");

    const imageUrl = await fetchImage(productDetail.featured_media);
    image.src = imageUrl;

    productDetailContainer.appendChild(image);

    productDetailContainer.innerHTML += `
      <div class="flexbox-container-men">

        <h1>${productDetail.title.rendered}</h1>
        <p>${productDetail.excerpt.rendered}</p>
        <p id="flexbox-size">
          XS S M L XL
        </p>
        <p id="price">${productDetail.price} NOK</p>
        <div class="btn-container-men">
          <button>Add to Bag</button>
          <button id="checkoutButton">Checkout</button>
        </div>
      </div>
    `;
    handleCheckoutButtonClick();
  } catch (error) {
    console.error("Error fetching jacket detail:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchJacketDetail);
