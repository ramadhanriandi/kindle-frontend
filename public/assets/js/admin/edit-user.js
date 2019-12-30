window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let parsedUrl = url.split('/');
  let customerId = parsedUrl[parsedUrl.length-2];

  renderUserDetail(customerId);
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

function renderUserDetail(customerId) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const customerData = JSON.parse(request.response);

    document.getElementById("customerId").value = customerData["customerId"];
    document.getElementById("username").value = customerData["username"];
    document.getElementById("email").value = customerData["email"];
    document.getElementById("password").value = customerData["password"];
    document.getElementById("status").value = customerData["status"];
  };

  request.send();
}

function updateCustomer() {
  const customerId = document.getElementById("customerId").value; 
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status").value;

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}`;
  
  if (!(isEmpty(username) || isEmpty(email) || isEmpty(password))) {
    request.open("PUT", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "email": email, 
      "username": username, 
      "password": password,
      "status": status
    });

    request.send(data);

    request.onload = function () {
      const jsonData = JSON.parse(request.response);

      if (jsonData['code'] === 200) {
        location.href = "/admin/users";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}