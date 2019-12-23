window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderOrder();
  renderOrderDetail();
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

function timeConverter(date){
  var monthNames = new Array("January", "February", "March", 
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December");

  var date = new Date(date);
  var cDate = date.getDate();
  var cMonth = date.getMonth();
  var cYear = date.getFullYear();

  var cHour = date.getHours();
  var cMin = date.getMinutes();
  var cSec = date.getSeconds();

  return ( monthNames[cMonth] + " " +cDate  + ", " +cYear + " " +cHour+ ":" + cMin+ ":" + cSec );
}

function renderOrder() {
  const request = new XMLHttpRequest();
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];
  const windowUrl = window.location.href;
  const transactionId = windowUrl.substring(windowUrl.lastIndexOf('/') + 1);
  const url = `http://localhost:8000/kindle-backend/api/transactions/${transactionId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const transactionData = JSON.parse(request.response);
    
    if (transactionData['customerId'] != customerId) {
      location.href = "/orders";
    } else {
      document.getElementById("order-detail-time").innerHTML = timeConverter(new Date(transactionData['date']));
      document.getElementById("order-detail-total").innerHTML = convertToCurrency(transactionData['total']);
    }
  };

  request.send();
}

function renderOrderDetail() {
  const request = new XMLHttpRequest();
  const windowUrl = window.location.href;
  const transactionId = windowUrl.substring(windowUrl.lastIndexOf('/') + 1);
  const url = `http://localhost:8000/kindle-backend/api/transactionlists?transactionId=${transactionId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const transactionListData = JSON.parse(request.response);
    
    let transactionListContent = '';
    for (let i = 0; i < transactionListData.length; i++) {
      let bookData = transactionListData[i]["bookData"];

      transactionListContent += `
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
                ${bookData['merchant']['fullname']}
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
              <div class="p-2 rounded-sm detail-button" onclick='location.href="/books/${bookData['bookSku']}"'>
                <span class="fa fa-th-list"></span>&nbsp; Details
              </div>
            </div>
          </div>
        </div>
        `
    };
    document.getElementById("order-detail-content").innerHTML = transactionListContent;
  };

  request.send();
}