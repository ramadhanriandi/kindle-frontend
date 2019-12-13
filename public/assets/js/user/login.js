function submitLoginForm() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var request = new XMLHttpRequest();
  var url = "http://localhost:8080/kindle-backend/api/customers/login";
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var jsonData = JSON.parse(request.response);
      console.log(jsonData);
    }
  };

  var data = JSON.stringify({
    "email": email, 
    "password": password
  });

  request.send(data);

  // if (email && password) {
  //   location.href = "/";
  // }
}