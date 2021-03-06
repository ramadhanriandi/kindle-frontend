window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderOrder();
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
  const userId = parsedCookie[parsedCookie.length-1];
  const url = `http://localhost:8000/kindle-backend/api/transactions?customerId=${userId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      let allOrder = '';
      for (let i = 0; i < jsonData['data'].length; i++) {
        let transactionId = jsonData['data'][i]["id"];
        let date = jsonData['data'][i]['attributes']["date"];
        let total = jsonData['data'][i]['attributes']["total"];
        var parsedDate = new Date(date);
  
        allOrder += `
          <div class="wishlist-item w-100">
            <div class="d-flex flex-row">
              <div
                class="d-flex flex-column justify-content-between w-100"
              >
                <div class="d-flex flex-nowrap order-time">
                  ${timeConverter(parsedDate)} WIB
                </div>
                <div class="d-flex flex-nowrap order-price">
                  IDR ${convertToCurrency(total)}
                </div>
              </div>
              <div
                class="d-flex flex-column justify-content-end align-items-end"
              >
                <div class="p-2 rounded-sm detail-button" onclick='location.href="/orders/${transactionId}"'>
                  <span class="fa fa-th-list"></span>&nbsp; Details
                </div>
              </div>
            </div>
          </div>
          `
        }
        document.getElementById("order-wrapper").innerHTML = allOrder;
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
  };

  request.send();
}