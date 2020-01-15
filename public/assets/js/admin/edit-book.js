window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }

  let url = window.location.href;
  let parsedUrl = url.split('/');
  let bookSku = parsedUrl[parsedUrl.length-2];

  renderBookDetail(bookSku);
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

function renderBookCategories() {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/categories`;
    
    request.open("GET", url, true);

    request.send();
    request.onload = function () {
      const jsonData = JSON.parse(request.response);
      let bookCategories = '';

      for(let i = 0; i < jsonData["data"].length; i++) {
        bookCategories += `
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="${jsonData["data"][i]["attributes"]['name']}" value="${jsonData["data"][i]["attributes"]['name']}">
            <label class="form-check-label" for="${jsonData["data"][i]["attributes"]['name']}">${jsonData["data"][i]["attributes"]['name']}</label>
          </div>
        `
      }
      document.getElementById("category").innerHTML = bookCategories;
      resolve(true);
    };

  })
}

async function renderBookDetail(bookSku) {
  const hasRenderedCategory = await renderBookCategories();

  if (hasRenderedCategory) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
    
    request.open("GET", url, true);
  
    request.onload = function () {
      const bookData = JSON.parse(request.response);
      
      document.getElementById("bookSku").value = bookData["data"][0]["id"];
      document.getElementById("merchantId").value = bookData["included"][0]["id"];
      document.getElementById("title").value = bookData["data"][0]["attributes"]["title"];
      document.getElementById("author").value = bookData["data"][0]["attributes"]["author"];
      document.getElementById("year").value = bookData["data"][0]["attributes"]["year"];
      document.getElementById("description").value = bookData["data"][0]["attributes"]["description"];
      document.getElementById("current-url").innerHTML += bookData["data"][0]["attributes"]["url"].split('/')[2];
      document.getElementById("url").value = bookData["data"][0]["attributes"]["url"];
      document.getElementById("price").value = bookData["data"][0]["attributes"]["price"];
      document.getElementById("variant").value = bookData["data"][0]["attributes"]["variant"];
      document.getElementById("merchant").value = bookData["included"][0]["attributes"]["fullname"];
      document.getElementById("current-document").innerHTML += bookData["data"][0]["attributes"]["document"].split('/')[2]; 
      document.getElementById("document").value = bookData["data"][0]["attributes"]["document"]; 

      const parsedCategories = bookData["data"][0]["attributes"]["categories"].split(';');

      for (let i = 0; i < parsedCategories.length; i++) {
        document.getElementById(`${parsedCategories[i]}`).checked =  true;
      }
    };
  
    request.send();
  }
}

function navigateUploadBookFile() {
  const bookSku = document.getElementById("bookSku").value;

  location.href = `/admin/books/${bookSku}/edit/upload-file`;
}

function navigateUploadBookImage() {
  const bookSku = document.getElementById("bookSku").value;

  location.href = `/admin/books/${bookSku}/edit/upload-image`;
}

function updateBook() {
  const bookSku = document.getElementById("bookSku").value; 
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const variant = document.getElementById("variant").value;
  const doc = document.getElementById("document").value;
  const url = document.getElementById("url").value;
  const merchantId = document.getElementById("merchantId").value;

  let categories = '';
  const checkedCategories = document.getElementsByClassName('form-check-input');
  for (let i = 0; i < checkedCategories.length; i++) {
    if (checkedCategories[i].checked) {
      categories += `${checkedCategories[i].value};`;
    }
  }
  if (categories.length !== 0) {
    categories = categories.substring(0, categories.length - 1);
  }

  const request = new XMLHttpRequest();
  const updateUrl = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
  
  if (!(isEmpty(title) || isEmpty(author) || isEmpty(year) || isEmpty(description) || isEmpty(price) || isEmpty(variant))) {
    request.open("PUT", updateUrl, true);
    request.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({
      "title": title, 
      "author": author, 
      "year": year, 
      "description": description, 
      "url": url, 
      "price": price,
      "variant": variant,
      "document": doc,
      "categories": categories,
      "merchantId": merchantId
    });

    request.send(data);

    request.onload = function () {
      const jsonData = JSON.parse(request.response);

      if (jsonData['code'] === 200) {
        location.href = "/admin/books";
      } else {
        alert(jsonData['message']);
      }
    };
  }
}