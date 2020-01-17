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
  const url = `http://localhost:8000/kindle-backend/api/books/${book_sku}`

  request.open("GET", url, true);
  request.onload = function(){
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      const parsedCategories = jsonData['data'][0]['attributes']["categories"].split(';');
      let categories = '';
      
      for (let i = 0; i < parsedCategories.length; i++) {
        categories += parsedCategories[i];
        if (i != parsedCategories.length - 1) {
          categories += ', ';
        }
      }
  
      document.getElementById("bookSku").value = jsonData['data'][0]['id'];
      document.getElementById("image").innerHTML = `<img class="book-detail-image" src="${jsonData['data'][0]['attributes']["document"]}" />`;
      document.getElementById("title").innerHTML = jsonData['data'][0]['attributes']["title"];
      document.getElementById("author").innerHTML = jsonData['data'][0]['attributes']["author"];
      document.getElementById("year").innerHTML = jsonData['data'][0]['attributes']["year"];
      document.getElementById("variant").innerHTML = jsonData['data'][0]['attributes']["variant"];
      document.getElementById("price").innerHTML = "IDR " + convertToCurrency(jsonData['data'][0]['attributes']["price"]);
      document.getElementById("description").innerHTML = jsonData['data'][0]['attributes']["description"];
      document.getElementById("merchant").innerHTML = jsonData["included"][0]["attributes"]["fullname"];
      document.getElementById("merchant").onclick = function() {
        location.href=`/merchants/${jsonData['included'][0]['id']}`
      }
      document.getElementById("categories").innerHTML = categories;
    } else {
      alert(jsonData['errors'][0]['detail']);
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

    if (jsonData['code'] === 201) {
      document.getElementById("wishlist-button").classList.remove("outline-button");
      document.getElementById("wishlist-button").classList.add("full-button");
      document.getElementById("isOnWishlist").value = 1;
      alert('Success added into wishlist');
    } else {
      alert(jsonData['errors'][0]['detail']);
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
    
    if (jsonData['code'] === 200) {
      document.getElementById("wishlist-button").classList.remove("full-button");
      document.getElementById("wishlist-button").classList.add("outline-button");
      document.getElementById("isOnWishlist").value = 0;
      alert('Success removed from wishlist');
    } else {
      alert(jsonData['errors'][0]['detail'])
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

    if (jsonData['code'] === 201) {
      document.getElementById("cart-button").classList.remove("outline-button");
      document.getElementById("cart-button").classList.add("full-button");
      document.getElementById("isOnCart").value = 1;
      alert('Success added into cart');
    } else {
      alert(jsonData['errors'][0]['detail']);
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
    
    if (jsonData['code'] === 200) {
      document.getElementById("cart-button").classList.remove("full-button");
      document.getElementById("cart-button").classList.add("outline-button");
      document.getElementById("isOnCart").value = 0;
      alert('Success removed from cart');
    } else {
      alert(jsonData['errors'][0]['detail']);
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
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
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
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
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
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      document.getElementById("cart-button").style.display = "none";
      document.getElementById("wishlist-button").style.display = "none";
    } else {
      document.getElementById("view-button").style.display = "none";
    }
  };
}

function handleView() {
  const bookSku = document.getElementById("bookSku").value;
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`

  request.open("GET", url, true);
  request.send();
  request.onload = function(){
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      const fileUrl = jsonData['data'][0]['attributes']['url'];
      console.log(jsonData['data'][0]['attributes']);
      window.open(fileUrl, '_blank');
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
  }
}