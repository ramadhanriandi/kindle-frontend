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

      for(let i = 0; i < jsonData.length; i++) {
        bookCategories += `
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="${jsonData[i]['name']}" value="fiction">
            <label class="form-check-label" for="${jsonData[i]['name']}">${jsonData[i]['name']}</label>
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
    const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}/detail`;
    
    request.open("GET", url, true);
  
    request.onload = function () {
      const jsonData = JSON.parse(request.response);
      
      if (jsonData["code"] == 200) {
        const bookData = jsonData["bookData"];
        
        document.getElementById("bookSku").value = bookData["bookSku"];
        document.getElementById("title").value = bookData["title"];
        document.getElementById("author").value = bookData["author"];
        document.getElementById("year").value = bookData["year"];
        document.getElementById("description").value = bookData["description"];
        document.getElementById("url").innerHTML += bookData["url"].split('/')[2];
        document.getElementById("price").value = bookData["price"];
        document.getElementById("variant").value = bookData["variant"];
        document.getElementById("merchant").value = jsonData["merchant"];
        document.getElementById("document").innerHTML += bookData["document"].split('/')[2]; 
  
        for (let i = 0; i < jsonData["categories"].length; i++) {
          document.getElementById(`${jsonData["categories"][i]["name"]}`).checked =  true;
        }
      } else {
        alert(jsonData["message"]);
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
  // const bookSku = document.getElementById("bookSku").value; 
  // const title = document.getElementById("title").value;
  // const author = document.getElementById("author").value;
  // const year = document.getElementById("year").value;
  // const description = document.getElementById("description").value;
  // const price = document.getElementById("price").value;
  // const variant = document.getElementById("variant").value;
  // //category, document, url

  // const request = new XMLHttpRequest();
  // const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
  
  // if (!(isEmpty(username) || isEmpty(email) || isEmpty(password) || isEmpty(fullname) || isEmpty(phone) || isEmpty(description))) {
  //   request.open("PUT", url, true);
  //   request.setRequestHeader("Content-Type", "application/json");

  //   const data = JSON.stringify({
  //     "title": title, 
  //     "author": author, 
  //     "year": year, 
  //     "description": description, 
  //     "url": url, 
  //     "price": price,
  //     "variant": variant,
  //     "document": doc
  //   });

  //   request.send(data);

  //   request.onload = function () {
  //     const jsonData = JSON.parse(request.response);

  //     if (jsonData['code'] === 200) {
  //       location.href = "/admin/books";
  //     } else {
  //       alert(jsonData['message']);
  //     }
  //   };
  // }
}