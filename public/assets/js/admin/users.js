window.onload = function() {
  if (!checkCookie("admin")) {
    location.href = "/admin/login";
  }
  renderUsers();
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

function renderUsers() {
  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/customers";
  
  request.open("GET", url, true);

  request.onload = function () {
    let allUser = '';
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let userId = JSON.parse(request.response)[i]["customerId"];
      let username = JSON.parse(request.response)[i]["username"];
      let status = JSON.parse(request.response)[i]["status"];

      allUser += `
        <div class="row">
          <div class="col-5 col-xs-5 col-md-5 col-lg-5 catalog-book-title">
            <span onclick='location.href="/admin/users/${userId}"'>${username}</span>
          </div>
          <div class="col-2 col-xs-2 col-md-2 col-lg-2 catalog-book-title">
            ${status}
          </div>
          <div class="col-5 col-xs-5 col-md-5 col-lg-5">
            <div class="d-flex justify-content-around">
              <div class="edit-small-button" onclick='location.href="/admin/users/${userId}/edit"'>
                <span class="fa fa-pencil-square-o"></span>&nbsp; Edit
              </div>
              <div class="delete-small-button">
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
            </div>
          </div>
        </div>
        <hr class="top-boundary">
        `
    }
    document.getElementById("users-wrapper").innerHTML = allUser;
  };

  request.send();
}