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
    var customerResult = JSON.parse(request.response);

    for (let i = 0; i < customerResult["data"].length; i++) {
      let userId = customerResult["data"][i]["id"];
      let username = customerResult["data"][i]["attributes"]["username"];
      let status = customerResult["data"][i]["attributes"]["status"];

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
              <div class="delete-small-button" onclick='deleteUser(${userId})'>
                <span class="fa fa-trash-o"></span>&nbsp; Delete
              </div>
            </div>
          </div>
        </div>
        <hr class="top-boundary">
        `
    }
    document.getElementById("users-wrapper").innerHTML += allUser;
  };

  request.send();
}

function addUser() {
  location.href = "/admin/users/add";
}

function deleteUser(customerId) {
  if (confirm('Are you sure to delete this user?')) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/customers/${customerId}`;
    
    request.open("DELETE", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
    request.onload = function () {
      deleteResult = JSON.parse(request.response)

      if (deleteResult["code"] == 200) {
        location.href = "/admin/users";
      } else {
        alert(request.response);
      }
    };
  }
}