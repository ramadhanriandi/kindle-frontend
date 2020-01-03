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
  const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}/detail`;
  
  request.open("GET", url, true);

  request.onload = function () {
    const jsonData = JSON.parse(request.response);
    
    if (jsonData["code"] == 200) {
      const bookData = jsonData["bookData"];
      let categories = '';
      
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
      document.getElementById("merchant").value = jsonData["merchant"];
      document.getElementById("file").src = bookData["document"];
      
      for (let i = 0; i < jsonData["categories"].length; i++) {
        categories += jsonData["categories"][i]["name"];
        if (i != jsonData["categories"].length - 1) {
          categories += ', ';
        }
      }
      document.getElementById("category").value = categories;
    } else {
      alert(jsonData["message"]);
    }
  };

  request.send();
}