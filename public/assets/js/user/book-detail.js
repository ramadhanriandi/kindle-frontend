window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }

  let url = window.location.href;
  let book_sku = url.substring(url.lastIndexOf('/') + 1);
  
  renderBookDetail(book_sku);
  isOnLibrary(book_sku);
  isOnWishlist(book_sku);
  isOnCart(book_sku);
}

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

function renderBookDetail(book_sku){
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/books/${book_sku}/detail`

  request.open("GET", url, true);
  request.onload = function(){
    if (JSON.parse(request.response)["code"] == 200) {
      const bookData = JSON.parse(request.response)["bookData"];
      const merchantData = JSON.parse(request.response)["merchant"];
      const categoryData = JSON.parse(request.response)["categories"];
      let categories = '';

      for (let i = 0; i < categoryData.length; i++) {
        if (i !== 0) {
          categories += ", ";
        }
        categories += categoryData[i]["name"];
      }
  
      document.getElementById("bookSku").value = bookData["bookSku"];
      document.getElementById("image").innerHTML = `<img class="book-detail-image" src="${bookData["document"]}" />`;
      document.getElementById("title").innerHTML = bookData["title"];
      document.getElementById("author").innerHTML = bookData["author"];
      document.getElementById("year").innerHTML = bookData["year"];
      document.getElementById("variant").innerHTML = bookData["variant"];
      document.getElementById("price").innerHTML = "IDR " + convertToCurrency(bookData["price"]);
      document.getElementById("description").innerHTML = bookData["description"];
      document.getElementById("merchant").innerHTML = merchantData;
      document.getElementById("merchant").onclick = function() {
        location.href=`/merchants/${bookData['merchantId']}`
      }
      document.getElementById("categories").innerHTML = categories;
    } else {
      alert(JSON.parse(request.response)["message"]);
    } 
  }
  request.send();
}

function addToWishlist(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/wishlist?bookSku=${bookSku}`;
  
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['customerId'] == customerId) {
      document.getElementById("wishlist-button").classList.remove("outline-button");
      document.getElementById("wishlist-button").classList.add("full-button");
      document.getElementById("isOnWishlist").value = 1;
      alert('Success added into wishlist');
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
    
    if (jsonData['customerId'] == customerId) {
      document.getElementById("wishlist-button").classList.remove("full-button");
      document.getElementById("wishlist-button").classList.add("outline-button");
      document.getElementById("isOnWishlist").value = 0;
      alert('Success removed from wishlist');
    }
  };
}

function handleWishlist() {
  const bookSku = document.getElementById("bookSku").value;
  const isOnWishlist = document.getElementById("isOnWishlist").value;

  if (isOnWishlist == 1) {
    removeFromWishlist(bookSku);
  } else {
    addToWishlist(bookSku);
  }
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
      document.getElementById("cart-button").classList.remove("outline-button");
      document.getElementById("cart-button").classList.add("full-button");
      document.getElementById("isOnCart").value = 1;
      alert('Success added into cart');
    }
  };
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
    
    if (jsonData['customerId'] == customerId) {
      document.getElementById("cart-button").classList.remove("full-button");
      document.getElementById("cart-button").classList.add("outline-button");
      document.getElementById("isOnCart").value = 0;
      alert('Success removed from cart');
    }
  };
}

function handleCart() {
  const bookSku = document.getElementById("bookSku").value;
  const isOnCart = document.getElementById("isOnCart").value;

  if (isOnCart == 1) {
    removeFromCart(bookSku);
  } else {
    addToCart(bookSku);
  }
}

function isOnWishlist(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/wishlist/${bookSku}/check`;
  
  request.open("GET", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    if (request.response == "true") {
      document.getElementById("wishlist-button").classList.add("full-button");
      document.getElementById("isOnWishlist").value = 1;
    } else {
      document.getElementById("wishlist-button").classList.add("outline-button");
      document.getElementById("isOnWishlist").value = 0;
    }
  };
}

function isOnCart(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/cart/${bookSku}/check`;
  
  request.open("GET", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    if (request.response == "true") {
      document.getElementById("cart-button").classList.add("full-button");
      document.getElementById("isOnCart").value = 1;
    } else {
      document.getElementById("cart-button").classList.add("outline-button");
      document.getElementById("isOnCart").value = 0;
    }
  };
}

function isOnLibrary(bookSku) {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}/library/${bookSku}/check`;
  
  request.open("GET", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    if (request.response == "true") {
      document.getElementById("cart-button").style.display = "none";
      document.getElementById("wishlist-button").style.display = "none";
    } else {
      document.getElementById("view-button").style.display = "none";
    }
  };
}