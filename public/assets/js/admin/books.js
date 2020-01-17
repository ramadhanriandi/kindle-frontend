window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }
  renderBooks();
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

function renderBooks() {
  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/books";
  
  request.open("GET", url, true);

  request.onload = function () {
    var bookResults = JSON.parse(request.response);
    let allBooks = '';
    
    for (let i = 0; i < bookResults["data"].length; i++) {
      let bookSku = bookResults["data"][i]["id"];
      let title = bookResults["data"][i]["attributes"]["title"];

      allBooks += `
        <div class="row">
          <div class="col-7 col-xs-7 col-md-7 col-lg-7 catalog-book-title">
            <span onclick='location.href="/admin/books/${bookSku}"'>${title}</span>
          </div>
          <div class="col-5 col-xs-5 col-md-5 col-lg-5">
            <div class="d-flex justify-content-around">
              <div class="edit-small-button" onclick='location.href="/admin/books/${bookSku}/edit"'>
                <span class="fa fa-pencil-square-o"></span>&nbsp; Edit
              </div>
              <div class="delete-small-button" onclick='deleteBook(${bookSku})'>
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
            </div>
          </div>
        </div>
        <hr class="top-boundary">
        `
    }
    document.getElementById("books-wrapper").innerHTML = allBooks;
  };

  request.send();
}

function deleteBook(bookSku) {
  if (confirm('Are you sure to delete this book?')) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;
    
    request.open("DELETE", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
    request.onload = function () {
      var deleteResponse = JSON.parse(request.response);

      if (deleteResponse["code"] == 200) {
        location.href = "/admin/books";
      } else {
        alert(request.response);
      }
    };
  }
}