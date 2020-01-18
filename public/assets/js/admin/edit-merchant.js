window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let parsedUrl = url.split('/');
  let merchantId = parsedUrl[parsedUrl.length-2];

  renderMerchantDetail(merchantId);
};
  
function isEmpty(text) {
  if (text == "") {
    return true;
  }
  return false;
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

function renderMerchantDetail(merchantId) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const merchantData = JSON.parse(request.response);

    document.getElementById("merchantId").value = merchantData["data"][0]["id"];
    document.getElementById("username").value = merchantData["data"][0]["attributes"]["username"];
    document.getElementById("fullname").value = merchantData["data"][0]["attributes"]["fullname"];
    document.getElementById("email").value = merchantData["data"][0]["attributes"]["email"];
    document.getElementById("password").value = merchantData["data"][0]["attributes"]["password"];
    document.getElementById("phone").value = merchantData["data"][0]["attributes"]["phone"];
    document.getElementById("description").value = merchantData["data"][0]["attributes"]["description"];
    document.getElementById("status").value = merchantData["data"][0]["attributes"]["status"];
  };

  request.send();
}

function updateMerchant() {
  const merchantId = document.getElementById("merchantId").value; 
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const fullname = document.getElementById("fullname").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const description = document.getElementById("description").value;
  const status = document.getElementById("status").value;

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;
  
  if (!(isEmpty(username) || isEmpty(email) || isEmpty(password) || isEmpty(fullname) || isEmpty(phone) || isEmpty(description))) {
    request.open("PUT", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "email": email, 
      "username": username, 
      "fullname": fullname, 
      "phone": phone, 
      "description": description, 
      "password": password,
      "status": status
    });

    request.send(data);

    request.onload = function () {
      const jsonData = JSON.parse(request.response);

      if (jsonData['code'] === 200) {
        location.href = "/admin/merchants";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}