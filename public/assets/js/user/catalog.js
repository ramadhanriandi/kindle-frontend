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
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/merchants/${merchant_id}`;
  request.open("GET", url, true);

  request.onload = function(){
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      document.getElementById("merchant-name").innerHTML += jsonData['data'][0]['attributes']["fullname"];
      document.getElementById("merchant-phone").innerHTML += jsonData['data'][0]['attributes']["phone"];
      document.getElementById("merchant-description").innerHTML += jsonData['data'][0]['attributes']["description"];
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
  }
  request.send();
}

function renderMerchantCatalog(merchant_id){
  var catalogContainer = document.getElementById("catalog-container");
  
  var request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/merchants/"+merchant_id+"/catalog";
  request.open("GET", url, true);

  request.onload = function() {
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      for (let i = 0; i < jsonData['data'].length; i++) {
        let sku = jsonData['data'][i]["id"];
        let url = jsonData['data'][i]['attributes']["document"];
  
        catalogContainer.innerHTML += `
        <div 
            class="p-2 col-4 col-xs-4 text-center"
            onclick='location.href="/books/${sku}"'
        >
            <img src="${url}">
        </div>
        `
      }
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
  };

  request.send();
}