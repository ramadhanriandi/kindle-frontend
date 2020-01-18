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

function renderCart() {
  const request = new XMLHttpRequest();
  const parsedCookie = document.cookie.split('|');
  const userId = parsedCookie[parsedCookie.length-1];
  const url = `http://localhost:8000/kindle-backend/api/customers/${userId}/cart`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      let allBook = '';
      let total = 0;
      for (let i = 0; i < jsonData['data'].length; i++) {
        let merchantFullname = '';
        for (let k = 0; k < jsonData['included'].length; k++) {
          if ((jsonData['included'][k]['id'] === jsonData['data'][i]['relationships']['merchant']['data'][0]['id'])
          && (jsonData['included'][k]['type'] === 'merchant')) {
            merchantFullname = jsonData['included'][k]['attributes']['fullname'];
            break;
          }
        }
  
        allBook += `
          <div class="wishlist-item w-100">
            <div class="d-flex flex-row">
              <div class="d-flex justify-content-start">
                <img class="book-image" src="${jsonData['data'][i]['attributes']['document']}" />
              </div>
              <div
                class="d-flex flex-column justify-content-between w-100 px-3"
              >
                <div class="d-flex flex-nowrap book-title">
                  ${jsonData['data'][i]['attributes']['title']}
                </div>
                <div class="d-flex flex-nowrap book-publisher">
                  ${merchantFullname}
                </div>
                <div class="d-flex flex-nowrap book-author">
                  ${jsonData['data'][i]['attributes']['author']}
                </div>
                <div class="d-flex flex-nowrap book-year">
                  ${jsonData['data'][i]['attributes']['year']}
                </div>
                <div class="d-flex flex-nowrap book-price">
                  IDR ${convertToCurrency(jsonData['data'][i]['attributes']['price'])}
                </div>
              </div>
              <div
                class="d-flex flex-column justify-content-end align-items-end"
              >
                <div 
                  class="p-2 rounded-sm detail-button"
                  onclick='location.href="/books/${jsonData['data'][i]['id']}"'
                >
                  <span class="fa fa-th-list"></span>&nbsp; Details
                </div>
                <div class="p-2 rounded-sm delete-button" onclick="removeFromCart(${jsonData['data'][i]['id']})">
                  <span class="fa fa-trash-o"></span>&nbsp; Delete
                </div>
              </div>
            </div>
          </div>
          `
  
          total += jsonData['data'][i]['attributes']['price'];
      }
      document.getElementById("cart-wrapper").innerHTML = allBook;
      document.getElementById("total").innerHTML = convertToCurrency(total);
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
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

    if (jsonData['code'] === 200) {
      alert('Success removed from cart');
      renderCart();
    } else {
      alert(jsonData['errors'][0]['detail'])
    }
  };
}