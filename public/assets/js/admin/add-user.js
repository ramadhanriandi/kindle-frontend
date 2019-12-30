window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }
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

function createCustomer() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status").value;

  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/customers";
  
  if (!(isEmpty(username) || isEmpty(email) || isEmpty(password))) {
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "email": email, 
      "username": username, 
      "password": password,
      "status": status
    });

    request.send(data);

    request.onload = function () {
      if (request.status == 200 && request.readyState == 4) {
        location.href = "/admin/users";
      }
    };
  }
}