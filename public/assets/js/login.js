window.onload = function() {
  if (checkCookie()) {
    location.href = "/";
  }
};

function isEmpty(text) {
  if (text == "") {
    return true;
  }
  return false;
}

function customerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/customers/login";
  
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
        setCookie("email", email, 1);
        location.href = "/";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}

function setCookie(variable, value, expiredDay) {
  const date = new Date();
  date.setTime(date.getTime() + (expiredDay * 24 * 60 * 60 * 1000));
  const expires = "expires="+ date.toUTCString();
  document.cookie = variable + "=" + value + ";" + expires + ";path=/";
}

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

function checkCookie() {
  const emailCookie = getCookie("email");
  if (emailCookie != "" && emailCookie != null) {
    return true;
  }
  return false;
}