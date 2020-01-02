window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let merchantId = url.substring(url.lastIndexOf('/') + 1);

  renderMerchantDetail(merchantId);
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

function renderMerchantDetail(merchantId) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const merchantData = JSON.parse(request.response);

    document.getElementById("username").value = merchantData["username"];
    document.getElementById("email").value = merchantData["email"];
    document.getElementById("password").value = merchantData["password"];
    document.getElementById("description").value = merchantData["description"];
    document.getElementById("fullname").value = merchantData["fullname"];
    document.getElementById("phone").value = merchantData["phone"];
    document.getElementById("status").value = merchantData["status"];
  };

  request.send();
}