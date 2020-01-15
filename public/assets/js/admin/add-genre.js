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

function createGenre() {
  const name = document.getElementById("name").value;

  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/categories";
  
  if (!(isEmpty(name))) {
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "name": name 
    });

    request.send(data);

    request.onload = function () {
      var createResult = JSON.parse(request.response);
      
      if (createResult["code"] == 201 && request.readyState == 4) {
        location.href = "/admin/genres";
      }
    };
  }
}