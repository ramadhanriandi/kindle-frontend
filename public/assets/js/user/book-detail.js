window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  let url = window.location.href;
  let book_sku = url.substring(url.lastIndexOf('/') + 1);
  
  renderBookDetail(book_sku);
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

function convertToCurrency(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderBookDetail(book_sku){
  const request = new XMLHttpRequest();
  const url = `http://localhost:8000/kindle-backend/api/books/${book_sku}/detail`

  request.open("GET", url, true);
  request.onload = function(){
    if (JSON.parse(request.response)["code"] == 200) {
      const bookData = JSON.parse(request.response)["bookData"];
      const merchantData = JSON.parse(request.response)["merchant"];
      const categoryData = JSON.parse(request.response)["categories"];
      let categories = '';

      for (let i = 0; i < categoryData.length; i++) {
        if (i !== 0) {
          categories += ", ";
        }
        categories += categoryData[i]["name"];
      }
  
      document.getElementById("bookSku").value = bookData["bookSku"];
      document.getElementById("image").innerHTML = `<img class="book-detail-image" src="${bookData["document"]}" />`;
      document.getElementById("title").innerHTML = bookData["title"];
      document.getElementById("author").innerHTML = bookData["author"];
      document.getElementById("year").innerHTML = bookData["year"];
      document.getElementById("variant").innerHTML = bookData["variant"];
      document.getElementById("price").innerHTML = "IDR " + convertToCurrency(bookData["price"]);
      document.getElementById("description").innerHTML = bookData["description"];
      document.getElementById("merchant").innerHTML = merchantData;
      document.getElementById("merchant").onclick = function() {
        location.href=`/merchants/${bookData['merchantId']}`
      }
      document.getElementById("categories").innerHTML = categories;
    } else {
      alert(JSON.parse(request.response)["message"]);
    } 
  }
  request.send();
}