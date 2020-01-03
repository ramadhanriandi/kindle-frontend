window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let parsedUrl = url.split('/');
  let bookSku = parsedUrl[parsedUrl.length-3];

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
      
    document.getElementById("bookSku").value = bookData["bookSku"];
    document.getElementById("file").src = bookData["document"];
    document.getElementById("document").innerHTML += bookData["document"].split('/')[2]; 
  };

  request.send();
}

function uploadBookImage() {
  const formData = new FormData();
  formData.append("book_image", document.getElementById("book_image_field").files[0]);
  
  const url = `http://localhost:3000/upload-image`;
  const request = new XMLHttpRequest();

  request.open("POST", url, true);
  request.send(formData);

  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['success'] == "true") {
      alert(jsonData['message']);
    } else {
      alert(jsonData['message']);
    }
  };
}