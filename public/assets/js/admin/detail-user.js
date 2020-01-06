window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let customerId = url.substring(url.lastIndexOf('/') + 1);

  renderUserDetail(customerId);
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

function renderUserDetail(customerId) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const customerData = JSON.parse(request.response);

    document.getElementById("username").value = customerData["username"];
    document.getElementById("email").value = customerData["email"];
    document.getElementById("password").value = customerData["password"];
    document.getElementById("status").value = customerData["status"];
  };

  request.send();
}