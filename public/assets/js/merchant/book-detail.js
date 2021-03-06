window.onload = function() {
    if (!checkCookie("merchant")) {
      location.href = "/merchant/login";
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
    const url = `http://localhost:8000/kindle-backend/api/books/${book_sku}`
  
    request.open("GET", url, true);
    request.onload = function(){
      const bookData = JSON.parse(request.response);
  
      const parsedCategories = bookData["data"][0]["attributes"]["categories"].split(';');
      let categories = '';
      
      for (let i = 0; i < parsedCategories.length; i++) {
        categories += parsedCategories[i];
        if (i != parsedCategories.length - 1) {
          categories += ', ';
        }
      }
  
      document.getElementById("bookSku").value = bookData["data"][0]["attributes"]["bookSku"];
      document.getElementById("image").innerHTML = `<img class="book-detail-image" src="${bookData["data"][0]["attributes"]["document"]}" />`;
      document.getElementById("title").innerHTML = bookData["data"][0]["attributes"]["title"];
      document.getElementById("author").innerHTML = bookData["data"][0]["attributes"]["author"];
      document.getElementById("year").innerHTML = bookData["data"][0]["attributes"]["year"];
      document.getElementById("variant").innerHTML = bookData["data"][0]["attributes"]["variant"];
      document.getElementById("price").innerHTML = "IDR " + convertToCurrency(bookData["data"][0]["attributes"]["price"]);
      document.getElementById("description").innerHTML = bookData["data"][0]["attributes"]["description"];
      document.getElementById("merchant").innerHTML = bookData["included"][0]["attributes"]["fullname"];
      document.getElementById("categories").innerHTML = categories;
    }
    request.send();
  }
  
  function editBook(){
    let url = window.location.href;
    let book_sku = url.substring(url.lastIndexOf('/') + 1);
    location.href = `/merchant/books/${book_sku}/edit`;
  }