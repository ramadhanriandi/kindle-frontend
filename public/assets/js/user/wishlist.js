window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderWishlist();
};

function getCookie(variable) {
  const name = variable + "=";
  const cookieData = document.cookie.split(';');
  for(let i = 0; i < cookieData.length; i++) {
    let cookieString = cookieData[i];
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

function renderWishlist() {
  const request = new XMLHttpRequest();
  const parsedCookie = document.cookie.split('|');
  const userId = parsedCookie[parsedCookie.length-1];
  const url = `http://localhost:8000/kindle-backend/api/customers/${userId}/wishlist`;
  
  request.open("GET", url, true);

  request.onload = function () {
    let allBook = '';
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
              <div class="p-2 rounded-sm delete-button" onclick="removeFromWishlist(${bookData['bookSku']})">
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
              <div class="p-2 rounded-sm cart-button" onclick="addToCart(${bookData['bookSku']})">
                <span class="fa fa-shopping-cart"></span>&nbsp; Cart
              </div>
            </div>
          </div>
        </div>
      `
    }
    document.getElementById("wishlist-wrapper").innerHTML = allBook;
  };

  request.send();
}

function addToCart(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/cart?bookSku=${bookSku}`;
  
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['customerId'] == customerId) {
      alert('Success added into cart');
    }
  };
}

function removeFromWishlist(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/wishlist?bookSku=${bookSku}`;
  
  request.open("DELETE", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    const jsonData = JSON.parse(request.response);
    let wishlistContent = "";
    
    for (let i = 0; i < jsonData['wishlist'].length; i++) {
      let wishlist = jsonData['wishlist'][i];

      wishlistContent += `
        <div class="wishlist-item w-100">
          <div class="d-flex flex-row">
            <div class="d-flex justify-content-start">
              <img class="book-image" src="${wishlist['document']}" />
            </div>
            <div
              class="d-flex flex-column justify-content-between w-100 px-3"
            >
              <div class="d-flex flex-nowrap book-title">
                ${wishlist['title']}
              </div>
              <div class="d-flex flex-nowrap book-publisher">
                ${wishlist['merchant']['fullname']}
              </div>
              <div class="d-flex flex-nowrap book-author">
                ${wishlist['author']}
              </div>
              <div class="d-flex flex-nowrap book-year">
                ${wishlist['year']}
              </div>
              <div class="d-flex flex-nowrap book-price">
                IDR ${convertToCurrency(wishlist['price'])}
              </div>
            </div>
            <div
              class="d-flex flex-column justify-content-end align-items-end"
            >
              <div 
                class="p-2 rounded-sm detail-button"
                onclick='location.href="/books/${wishlist['bookSku']}"'
              >
                <span class="fa fa-th-list"></span>&nbsp; Details
              </div>
              <div class="p-2 rounded-sm delete-button" onclick="removeFromWishlist(${wishlist['bookSku']})">
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
              <div class="p-2 rounded-sm cart-button" onclick="addToCart(${wishlist['bookSku']})">
                <span class="fa fa-shopping-cart"></span>&nbsp; Cart
              </div>
            </div>
          </div>
        </div>
      `
    }

    document.getElementById("wishlist-wrapper").innerHTML = wishlistContent;

    if (jsonData['customerId'] == customerId) {
      alert('Success removed from wishlist');
    }
  };
}