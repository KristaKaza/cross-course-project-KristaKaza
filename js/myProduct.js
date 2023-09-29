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

  if (!jacketId) {
    return;
  }

  const response = await fetch(
    `https://api.noroff.dev/api/v1/rainy-days/${jacketId}`
  );

  const addToBagMen = document.createElement("a");
  addToBagMen.classList.add("add-to-bag-men");

  const productDetail = await response.json();

  const titleContainer = document.getElementById("title");
  titleContainer.textContent = title;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-div");

  productDetailContainer.innerHTML = "";

  productDetailContainer.innerHTML += `<div class="flexbox-container-men">

<img src="${productDetail.image}" class="flexbox-item", "flexbox-men" alt="${
    productDetail.description
  }">

<div class="flexbox-description-men">

<h1>${productDetail.title}</h1>
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

<div class=button-div><button><a href="#" class="addToBag", "addToBagMenHover", "btn-container">ADD TO BAG</a></button>
<button><a href="/html/payment.html" class="goToCheckout", "goToCheckoutHover", "btn-container">CHECKOUT</a></button></div>


<p>${productDetail.description}</p>


</div>`;
}

fetchJacketDetail();
