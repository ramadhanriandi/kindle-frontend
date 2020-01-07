window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let bookSku = url.substring(url.lastIndexOf('/') + 1);

  renderBookDetail(bookSku);
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

function renderBookDetail(bookSku) {
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const bookData = JSON.parse(request.response);
    
    document.getElementById("title").value = bookData["title"];
    document.getElementById("author").value = bookData["author"];
    document.getElementById("year").value = bookData["year"];
    document.getElementById("description").value = bookData["description"];
    document.getElementById("link").value = bookData["url"].split('/')[2];
    document.getElementById("view").onclick = function() {
      window.open(bookData["url"], '_blank');
    }
    document.getElementById("price").value = bookData["price"];
    document.getElementById("variant").value = bookData["variant"];
    document.getElementById("merchant").value = bookData["merchant"]["fullname"];
    document.getElementById("file").src = bookData["document"];

    const parsedCategories = bookData["categories"].split(';');
    let categories = '';
    
    for (let i = 0; i < parsedCategories.length; i++) {
      categories += parsedCategories[i];
      if (i != parsedCategories.length - 1) {
        categories += ', ';
      }
    }
    document.getElementById("category").value = categories;
  };

  request.send();
}