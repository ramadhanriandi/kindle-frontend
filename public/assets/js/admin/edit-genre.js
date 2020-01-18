window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let parsedUrl = url.split('/');
  let categoryId = parsedUrl[parsedUrl.length-2];

  renderGenreDetail(categoryId);
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

function renderGenreDetail(categoryId) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/categories/${categoryId}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const categoryData = JSON.parse(request.response);

    document.getElementById("categoryId").value = categoryData["data"][0]["id"];
    document.getElementById("name").value = categoryData["data"][0]["attributes"]["name"];
  };

  request.send();
}

function updateGenre() {
  const categoryId = document.getElementById("categoryId").value; 
  const name = document.getElementById("name").value;

  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/categories/${categoryId}`;
  
  if (!(isEmpty(name))) {
    request.open("PUT", url, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "name": name
    });

    request.send(data);

    request.onload = function () {
      const jsonData = JSON.parse(request.response);

      if (jsonData['code'] === 200) {
        location.href = "/admin/genres";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}