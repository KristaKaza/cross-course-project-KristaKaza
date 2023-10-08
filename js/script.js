const shoppingBagItems = [];

const rainyDaysAPI = "https://api.noroff.dev/api/v1/rainy-days/";
const getJacketText = document.querySelectorAll(".jacketText");

// Modify the createCartItemHTML function
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
    cartSummaryContainer.style.display = "none"; // Hide the cart summary
  } else {
    emptyCartMessage.style.display = "none";
    cartSummaryContainer.style.display = "block"; // Show the cart summary
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

  // Round the total to 0 decimal places and set it as text content
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
      item.remove(); // Remove items with quantity <= 0 from the cart
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
      itemToRemove.quantity--; // Decrease the quantity
      if (itemToRemove.quantity === 0) {
        // If quantity becomes 0, remove the item from the shopping bag
        shoppingBagItems.splice(itemIndex, 1);
      }
    }
    updateCartDisplay(); // Update the cart display
  }
}

// Function to add an item to the shopping bag
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

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  displayJackets();
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

// Add a click event listener for the cart item title
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-jacket-title")) {
    const itemId = event.target.getAttribute("data-id");
    const item = shoppingBagItems.find((item) => item.id === itemId);
    if (item) {
      window.location.href = `/html/product.html?id=${item.id}&title=${item.title}`;
    }
  }
});

// Function to load jackets from the API
async function getJackets() {
  const response = await fetch(rainyDaysAPI);
  const results = await response.json();
  return results;
}

// Function to display jackets on the page
async function displayJackets() {
  const jackets = await getJackets();
  const productContainer = document.getElementById("product-container");

  productContainer.innerHTML = "";

  for (let i = 0; i < jackets.length; i++) {
    const jacket = jackets[i];

    if (jacket.tags) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("flexbox-description");
      productDiv.addEventListener("click", () => {
        window.location.href = `/html/product.html?id=${jacket.id}&title=${jacket.title}`;
      });

      const image = document.createElement("img");
      image.src = jacket.image;
      image.alt = jacket.description;
      image.classList.add("flexbox-item", "flexbox-item-1");

      const jacketTitle = document.createElement("p");
      jacketTitle.innerHTML = `${jacket.title}`;

      const jacketPrice = document.createElement("p");
      jacketPrice.classList.add("price");
      jacketPrice.innerHTML = `NOK ${jacket.price}`;

      const addToBag = document.createElement("p");
      addToBag.classList.add("add-to-bag");
      addToBag.textContent = "Add to Bag";

      addToBag.addEventListener("click", (event) => {
        event.stopPropagation();
        addToShoppingBag(jacket);
      });

      productContainer.appendChild(productDiv);
      productDiv.appendChild(image);
      productDiv.appendChild(jacketTitle);
      productDiv.appendChild(jacketPrice);
      productDiv.appendChild(addToBag);
    }
  }
}
