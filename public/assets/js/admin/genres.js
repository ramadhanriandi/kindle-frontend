window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }
  renderGenres();
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

function renderGenres() {
  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/categories";
  
  request.open("GET", url, true);

  request.onload = function () {
    let allCategories = '';
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let categoryId = JSON.parse(request.response)[i]["categoryId"];
      let name = JSON.parse(request.response)[i]["name"];

      allCategories += `
        <div class="row">
          <div class="col-7 col-xs-7 col-md-7 col-lg-7 catalog-book-title">
            ${name}
          </div>
          <div class="col-5 col-xs-5 col-md-5 col-lg-5">
            <div class="d-flex justify-content-around">
              <div class="edit-small-button" onclick='location.href="/admin/genres/${categoryId}/edit"'>
                <span class="fa fa-pencil-square-o"></span>&nbsp; Edit
              </div>
              <div class="delete-small-button" onclick='deleteGenre(${categoryId})'>
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
            </div>
          </div>
        </div>
        <hr class="top-boundary">
        `
    }
    document.getElementById("genres-wrapper").innerHTML = allCategories;
  };

  request.send();
}

function addGenre() {
  location.href = "/admin/genres/add";
}

function deleteGenre(categoryId) {
  if (confirm('Are you sure to delete this genre?')) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/categories/${categoryId}`;
    
    request.open("DELETE", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
    request.onload = function () {
      if (request.response == "true") {
        location.href = "/admin/genres";
      } else {
        alert(request.response);
      }
    };
  }
}