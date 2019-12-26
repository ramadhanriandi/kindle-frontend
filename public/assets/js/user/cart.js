window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderCart();
};

function getCookie(variable) {
  const name = variable + "=";
  const cookieData = document.cookie.split(';');
  for(let i = 0; i < cookieData.length; i++) {
    const cookieString = cookieData[i];
    while (cookieString.charAt(0) === ' ') {
      cookieString = cookieString.substring(1);
    }
    if (cookieString.indexOf(name) === 0) {
      return cookieString.substring(name.length, cookieString.length);
    }
  }
  return "";
}

function checkCookie(role) {
  const emailCookie = getCookie("email");
  const parsedCookie = emailCookie.split('|');
  
  if (emailCookie != "" && emailCookie != null && parsedCookie[1] == role) {
    return true;
  }
  return false;
}

function convertToCurrency(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderCart() {
  const request = new XMLHttpRequest();
  const parsedCookie = document.cookie.split('|');
  const userId = parsedCookie[parsedCookie.length-1];
  const url = `http://localhost:8000/kindle-backend/api/customers/${userId}/cart`;
  
  request.open("GET", url, true);

  request.onload = function () {
    let allBook = '';
    let total = 0;
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let bookData = JSON.parse(request.response)[i]["bookData"];
      let merchant = JSON.parse(request.response)[i]["merchant"];

      allBook += `
        <div class="wishlist-item w-100">
          <div class="d-flex flex-row">
            <div class="d-flex justify-content-start">
              <img class="book-image" src="${bookData['document']}" />
            </div>
            <div
              class="d-flex flex-column justify-content-between w-100 px-3"
            >
              <div class="d-flex flex-nowrap book-title">
                ${bookData['title']}
              </div>
              <div class="d-flex flex-nowrap book-publisher">
                ${merchant}
              </div>
              <div class="d-flex flex-nowrap book-author">
                ${bookData['author']}
              </div>
              <div class="d-flex flex-nowrap book-year">
                ${bookData['year']}
              </div>
              <div class="d-flex flex-nowrap book-price">
                IDR ${convertToCurrency(bookData['price'])}
              </div>
            </div>
            <div
              class="d-flex flex-column justify-content-end align-items-end"
            >
              <div 
                class="p-2 rounded-sm detail-button"
                onclick='location.href="/books/${bookData['bookSku']}"'
              >
                <span class="fa fa-th-list"></span>&nbsp; Details
              </div>
              <div class="p-2 rounded-sm delete-button" onclick="removeFromCart(${bookData['bookSku']})">
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
            </div>
          </div>
        </div>
        `

        total += bookData['price'];
    }
    document.getElementById("cart-wrapper").innerHTML = allBook;
    document.getElementById("total").innerHTML = convertToCurrency(total);
  };

  request.send();
}

function removeFromCart(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/cart?bookSku=${bookSku}`;
  
  request.open("DELETE", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    const jsonData = JSON.parse(request.response);
    let cartContent = "";
    let total = 0;
    
    for (let i = 0; i < jsonData['cart'].length; i++) {
      let cart = jsonData['cart'][i];

      cartContent += `
        <div class="wishlist-item w-100">
        <div class="d-flex flex-row">
          <div class="d-flex justify-content-start">
            <img class="book-image" src="${cart['document']}" />
          </div>
          <div
            class="d-flex flex-column justify-content-between w-100 px-3"
          >
            <div class="d-flex flex-nowrap book-title">
              ${cart['title']}
            </div>
            <div class="d-flex flex-nowrap book-publisher">
              ${cart['merchant']['fullname']}
            </div>
            <div class="d-flex flex-nowrap book-author">
              ${cart['author']}
            </div>
            <div class="d-flex flex-nowrap book-year">
              ${cart['year']}
            </div>
            <div class="d-flex flex-nowrap book-price">
              IDR ${convertToCurrency(cart['price'])}
            </div>
          </div>
          <div
            class="d-flex flex-column justify-content-end align-items-end"
          >
            <div 
              class="p-2 rounded-sm detail-button"
              onclick='location.href="/books/${cart['bookSku']}"'
            >
              <span class="fa fa-th-list"></span>&nbsp; Details
            </div>
            <div class="p-2 rounded-sm delete-button" onclick="removeFromCart(${cart['bookSku']})">
              <span class="fa fa-trash-o"></span>&nbsp; Delete
            </div>
          </div>
        </div>
      </div>
      `
      total += cart['price'];
    }

    document.getElementById("cart-wrapper").innerHTML = cartContent;
    document.getElementById("total").innerHTML = convertToCurrency(total);

    if (jsonData['customerId'] == customerId) {
      alert('Success removed from cart');
    }
  };
}