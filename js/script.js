const shoppingBagItems = [];

const corsAnywhereUrl = "https://noroffcors.onrender.com/";
const originalUrl = "https://www.rainydays-noroff.no/wp-json/wp/v2/product";
const rainydaysAPI = corsAnywhereUrl + originalUrl;

const getJacketText = document.querySelectorAll(".jacketText");

async function fetchProductData() {
  try {
    const response = await fetch(rainydaysAPI);
    const products = await response.json();

    return products;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

function createCartItemHTML(item) {
  return `
    <div class="cart-boxes">
      <img src="${item.image}" alt="${item.title}">
      <div class="detail-box">
        <div class="cart-jacket-title" data-id="${item.id}">${item.title}</div>
        <div class="price-box">
          <div class="cart-price">${item.price} NOK</div>
        </div>
        <input type="number" value="${item.quantity}" class="cart-quantity" name="quantity${item.id}">
        <i class="fa-regular fa-trash-can cart-remove" data-id="${item.id}"></i>
      </div>
    </div>
  `;
}

function createCartSummaryHTML(totalPrice) {
  return `
    <div class="total">
      <div class="total-title">Total</div>
      <div class="total-price">${totalPrice} NOK</div>
    </div>
    <button class="btn-buy">Place Order</button>
  `;
}

function createEmptyCartMessage() {
  return `
    <div class="empty-cart-message">
      Your cart is empty.
    </div>
  `;
}

// Function to update the cart count
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const totalCount = shoppingBagItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartCount.textContent = totalCount;
}

function updateCartDisplay() {
  const cartItemsContainer = document.querySelector(".cart-content");
  const cartSummaryContainer = document.querySelector(".cart-summary");
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  const totalValueElement = document.querySelector(".total-price");

  cartItemsContainer.innerHTML = "";

  const updatedItems = shoppingBagItems.filter((item) => item.quantity > 0);

  updatedItems.forEach((item) => {
    const cartItemHTML = createCartItemHTML(item);
    cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
  });

  const totalValue = updatedItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Round the total to 0 decimal places and set it as text content
  totalValueElement.textContent = "NOK " + totalValue.toFixed(0);

  // Check if there are no items in the cart
  if (updatedItems.length === 0) {
    emptyCartMessage.style.display = "block";
    cartSummaryContainer.style.display = "none";
  } else {
    emptyCartMessage.style.display = "none";
    cartSummaryContainer.style.display = "block";
  }

  updateCartCount();
}

// Function to update the total price and handle empty cart
function updateTotal() {
  const cartItems = document.querySelectorAll(".cart-boxes");
  const totalValue = document.querySelector(".total-price");
  const emptyCartMessage = document.querySelector(".empty-cart-message");

  let total = 0;

  cartItems.forEach((product) => {
    let priceElement = product.querySelector(".cart-price");
    let price = parseFloat(priceElement.textContent.replace("NOK", ""));
    let qty = parseInt(product.querySelector(".cart-quantity").value, 10);
    total += price * qty;
  });

  totalValue.textContent = "NOK " + total.toFixed(0);

  // Update the cart count (you can implement this part)
  const cartCount = document.querySelector(".cart-count");
  let count = cartItems.length;
  cartCount.textContent = count;

  // Check if there are any items with quantity <= 0
  const itemsWithQuantityZero = Array.from(cartItems).filter((product) => {
    const qty = parseInt(product.querySelector(".cart-quantity").value, 10);
    return qty <= 0;
  });

  if (itemsWithQuantityZero.length > 0) {
    itemsWithQuantityZero.forEach((item) => {
      item.remove();
    });
  }

  // Check if the cart is empty
  if (total === 0) {
    emptyCartMessage.style.display = "block";
    document.querySelector(".cart-content").style.display = "none";
  } else {
    emptyCartMessage.style.display = "none";
    document.querySelector(".cart-content").style.display = "block";
  }
}

function removeItemFromCart(itemId) {
  const itemIndex = shoppingBagItems.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const itemToRemove = shoppingBagItems[itemIndex];
    if (itemToRemove.quantity > 0) {
      itemToRemove.quantity--;
      if (itemToRemove.quantity === 0) {
        shoppingBagItems.splice(itemIndex, 1);
      }
    }
    updateCartDisplay();
  }
}

function addToShoppingBag(product) {
  const existingItem = shoppingBagItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const shoppingBagItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    shoppingBagItems.push(shoppingBagItem);
  }

  // Check if the cart is empty
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  if (shoppingBagItems.length === 0) {
    emptyCartMessage.style.display = "block";
    document.querySelector(".cart-content").style.display = "none";
  } else {
    emptyCartMessage.style.display = "none";
    document.querySelector(".cart-content").style.display = "block";
  }

  updateCartCount();
  updateCartDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
});

// Event listener for removing items from the cart
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-remove")) {
    event.stopPropagation(); // Prevent event propagation
    const itemId = event.target.getAttribute("data-id");
    removeItemFromCart(itemId);
  }
});

// Event listener for quantity input fields
document.addEventListener("change", (event) => {
  if (event.target.classList.contains("cart-quantity")) {
    updateTotal();
  }
});

// click event listener for the cart item title
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-jacket-title")) {
    const itemId = event.target.getAttribute("data-id");
    const item = shoppingBagItems.find((item) => item.id === itemId);
    if (item) {
      window.location.href = `/html/product.html?id=${item.id}&title=${item.title}`;
    }
  }
});

// Function to fetch the image URL based on media ID
async function fetchImage(mediaId) {
  try {
    const response = await fetch(
      `https://www.rainydays-noroff.no/wp-json/wp/v2/media/${mediaId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const mediaData = await response.json();
    const imageUrl = mediaData.media_details.sizes.medium.source_url;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
}

// Function to display jackets on the webpage
async function displayJackets() {
  try {
    const products = await fetchProductData();

    const productsList = document.getElementById("flexbox-container");

    productsList.innerHTML = "";

    if (products && products.length > 0) {
      for (const product of products) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("flexbox-description");

        const image = document.createElement("img");
        image.alt = product.title.rendered;

        // Fetch the image URL and set it as the image source
        const imageUrl = await fetchImage(product.featured_media);
        image.src = imageUrl;

        const title = document.createElement("p");
        title.textContent = product.title.rendered;

        const excerpt = document.createElement("p");
        excerpt.innerHTML = product.excerpt.rendered;

        const price = document.createElement("p");
        price.textContent = `Price: ${product.price} NOK`;

        const addToCartBtn = document.createElement("p");
        addToCartBtn.textContent = "Add to Bag";
        addToCartBtn.addEventListener("click", () => {
          addToShoppingBag(product);
        });

        productDiv.appendChild(image);
        productDiv.appendChild(title);
        productDiv.appendChild(excerpt);
        productDiv.appendChild(price);
        productDiv.appendChild(addToCartBtn);

        // Add click event listener to open the product's details page
        productDiv.addEventListener("click", () => {
          // Redirect to the product details page passing product ID and title
          window.location.href = `/html/product.html?id=${product.id}&title=${product.title.rendered}`;
        });

        productsList.appendChild(productDiv);
      }
    } else {
      productsList.textContent = "No products available.";
    }
  } catch (error) {
    console.error("Error displaying products:", error);
  }
}

// Event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const productsList = document.getElementById("flexbox-container");

    if (!productsList) {
      console.error("Error: flexbox-container not found in the document.");
      return;
    }

    // Call the displayJackets function to show products
    await displayJackets();
  } catch (error) {
    console.error("Error displaying products:", error);
  }
});

// Call window.onload to start displaying jackets when the window is loaded
window.onload = displayJackets;
