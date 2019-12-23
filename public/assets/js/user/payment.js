window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderPaymentDetail();
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

function renderPaymentDetail() {
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

      allBook += `
        <div class="d-flex flex-row justify-content-between payment-item">
          <div class="payment-title">
            ${bookData['title']}
          </div>
          <div class="payment-amount">
            IDR ${convertToCurrency(bookData['price'])}
          </div>              
        </div>
        `

        total += bookData['price'];
    }
    document.getElementById("payment-wrapper").innerHTML = allBook;
    document.getElementById("total").innerHTML = convertToCurrency(total);
  };

  request.send();
}