const rainyDaysAPI = "https://api.noroff.dev/api/v1/rainy-days/";
const getJacketText = document.querySelectorAll(".jacketText");

async function getJackets() {
  const response = await fetch(rainyDaysAPI);
  const results = await response.json();
  return results;
}

async function displayJackets() {
  const jackets = await getJackets();
  const productContainer = document.getElementById("product-container");

  productContainer.innerHTML = "";

  for (i = 0; i < jackets.length; i++) {
    const jacket = jackets[i];

    if (jacket.tags) {
      const productDiv = document.createElement("a");

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

      productContainer.appendChild(productDiv);
      productDiv.appendChild(image);
      productDiv.appendChild(jacketTitle);
      productDiv.appendChild(jacketPrice);
      productDiv.appendChild(addToBag);
    }
  }
}

displayJackets();
