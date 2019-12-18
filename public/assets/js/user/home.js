window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderAllBook();
};

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

function checkCookie(role) {
  const emailCookie = getCookie("email");
  const parsedCookie = emailCookie.split('|');
  
  if (emailCookie != "" && emailCookie != null && parsedCookie[1] == role) {
    return true;
  }
  return false;
}

function renderAllBook() {
  document.getElementById("all").classList.add("active-tab");
  document.getElementById("download").classList.remove("active-tab");

  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/books";
  
  request.open("GET", url, true);

  request.onload = function () {
    let allBook = '';
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let sku = JSON.parse(request.response)[i]["bookSku"];
      let url = JSON.parse(request.response)[i]["document"];

      allBook += `
        <div
          class="p-2 col-4 col-xs-4 text-center" 
          onclick='location.href="/books/${sku}"'
        >
          <img src="${url}">
        </div>
        `
    }
    document.getElementById("book-wrapper-home").innerHTML = allBook;
  };

  request.send();
}

function renderDownloadedBook() {
  document.getElementById("all").classList.remove("active-tab");
  document.getElementById("download").classList.add("active-tab");

  const request = new XMLHttpRequest();
  const userId = document.cookie.substr(-1);
  const url = `http://localhost:8000/kindle-backend/api/merchants/${userId}/library`;
  
  request.open("GET", url, true);

  request.onload = function () {
    let allBook = '';
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let sku = JSON.parse(request.response)[i]["bookSku"];
      let url = JSON.parse(request.response)[i]["document"];

      allBook += `
        <div
          class="p-2 col-4 col-xs-4 text-center" 
          onclick='location.href="/books/${sku}"'
        >
          <img src="${url}">
        </div>
        `
    }
    document.getElementById("book-wrapper-home").innerHTML = allBook;
  };

  request.send();
}