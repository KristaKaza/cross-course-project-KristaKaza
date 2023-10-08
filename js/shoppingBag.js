const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.add("cart-active");
});

cartClose.addEventListener("click", () => {
  cart.classList.remove("cart-active");
});

document.addEventListener("DOMContentLoaded", loadJackets);

function loadJackets() {
  loadContent();
}

function loadContent() {
  // Remove Jacket Items From Cart
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("cart-remove")) {
      const cartItem = event.target.parentElement;
      cartItem.remove();
      // After removing an item, update the total
      updateTotal();
    }
  });

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

    // Round the total to 2 decimal places and set it as text content
    totalValue.textContent = "NOK " + total.toFixed(2);

    // Update the cart count (you can implement this part)
    const cartCount = document.querySelector(".cart-count");
    let count = cartItems.length;
    cartCount.textContent = count;

    // Check if the cart is empty
    if (total === 0) {
      emptyCartMessage.style.display = "block";
      document.querySelector(".cart-content").style.display = "none";
    } else {
      emptyCartMessage.style.display = "none";
      document.querySelector(".cart-content").style.display = "block";
    }
  }

  var addToBagButtons = document.querySelectorAll(".add-to-bag");
  addToBagButtons.forEach((btn) => {
    btn.addEventListener("click", addToShoppingBag);
  });

  // Add event listener to quantity input fields
  const quantityInputs = document.querySelectorAll(".cart-quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", updateTotal);
  });
}
