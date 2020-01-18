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
      
    document.getElementById("bookSku").value = bookData["data"][0]["id"];
    document.getElementById("title").value = bookData["data"][0]["attributes"]["title"];
    document.getElementById("author").value = bookData["data"][0]["attributes"]["author"];
    document.getElementById("year").value = bookData["data"][0]["attributes"]["year"];
    document.getElementById("description").value = bookData["data"][0]["attributes"]["description"];
    document.getElementById("price").value = bookData["data"][0]["attributes"]["price"];
    document.getElementById("merchantId").value = bookData["data"][0]["relationships"]["merchant"]["data"][0]["id"];
    document.getElementById("variant").value = bookData["data"][0]["attributes"]["variant"];
    document.getElementById("url").value = bookData["data"][0]["attributes"]["url"];
    document.getElementById("categories").value = bookData["data"][0]["attributes"]["categories"];
    document.getElementById("file").src = bookData["data"][0]["attributes"]["document"];
    document.getElementById("document").innerHTML += bookData["data"][0]["attributes"]["document"].split('/')[2]; 
  };

  request.send();
}

function uploadToDirectory() {
  return new Promise(function (resolve, reject) {
    const formData = new FormData();
    formData.append("book_image", document.getElementById("book_image_field").files[0]);
    
    const url = `http://localhost:3000/upload-image`;
    const request = new XMLHttpRequest();
  
    request.open("POST", url, true);
    request.send(formData);
  
    request.onload = function () {
      const jsonData = JSON.parse(request.response);
  
      if (jsonData['success']) {
        resolve(jsonData['message']);
      } else {
        alert(jsonData['message']);
      }
    };
  })
}

async function uploadBookImage() {
  const uploadedImage = await uploadToDirectory();
  
  const bookSku = document.getElementById("bookSku").value; 
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);
  const description = document.getElementById("description").value;
  const price = parseInt(document.getElementById("price").value);
  const variant = document.getElementById("variant").value;
  const categories = document.getElementById("categories").value;
  const merchantId = parseInt(document.getElementById("merchantId").value);
  const url = document.getElementById("url").value;
  const imagePath = `/uploads/${uploadedImage}`;

  const request = new XMLHttpRequest();
  const requestUrl = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
  
  request.open("PUT", requestUrl, true);
  request.setRequestHeader("Content-Type", "application/json");

  const data = JSON.stringify({
    "title": title, 
    "author": author, 
    "year": year, 
    "description": description, 
    "price": price,
    "variant": variant,
    "merchantId": merchantId,
    "url": url,
    "document": imagePath,
    "categories": categories
  });

  request.send(data);

  request.onload = function () {
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      location.href = `/admin/books/${bookSku}/edit`;
    } else {
      alert(jsonData['message']);
    }
  };
} 