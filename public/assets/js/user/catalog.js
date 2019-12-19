window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  let url = window.location.href;
  let merchant_id = url.substring(url.lastIndexOf('/') + 1);
  
  renderMerchantInfo(merchant_id);
  renderMerchantCatalog(merchant_id);
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

function renderMerchantInfo(merchant_id){
  var request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/merchants/"+merchant_id
  request.open("GET", url, true);

  request.onload = function(){
    response = JSON.parse(request.response);

    document.getElementById("merchant-name").innerHTML += response["fullname"];
    document.getElementById("merchant-phone").innerHTML += response["phone"];
    document.getElementById("merchant-description").innerHTML += response["description"];
  }

  request.send();
}

function renderMerchantCatalog(merchant_id){
  var catalogContainer = document.getElementById("catalog-container");
  
  var request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/merchants/"+merchant_id+"/catalog";
  request.open("GET", url, true);

  request.onload = function(){
    let response = JSON.parse(request.response);
    for(let i = 0; i < response.length; i++){
      let sku = response[i]["bookSku"];
      let imgURL = response[i]["document"];

      catalogContainer.innerHTML += `
      <div 
          class="d-flex catalog-item"
          onclick='location.href="/books/${sku}/detail"'
      >
          <img src="${imgURL}">
      </div>
      `
    }
  };

  request.send();
}