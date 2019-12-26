window.onload = function() {
  if (checkCookie("admin")) {
    location.href = "/admin";
  }
};

function isEmpty(text) {
  if (text == "") {
    return true;
  }
  return false;
}

function adminLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/admins/login";
  
  if (!(isEmpty(email) || isEmpty(password))) {
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "email": email, 
      "password": password
    });

    request.send(data);

    request.onload = function () {
      const jsonData = JSON.parse(request.response);

      if (jsonData['code'] === 200) {
        setCookie(email, "admin", jsonData['userId'], 1);
        location.href = "/admin";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}

function setCookie(email, role, userId, expiredDay) {
  const date = new Date();
  date.setTime(date.getTime() + (expiredDay * 24 * 60 * 60 * 1000));
  const expires = "expires="+ date.toUTCString();
  document.cookie = "email=" + email + "|" + role + "|" + userId + ";" + expires + ";path=/";
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