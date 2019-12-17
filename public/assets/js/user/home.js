window.onload = function() {
  renderAllBook();
};

function renderAllBook() {
  const request = new XMLHttpRequest();
  const url = "http://localhost:8000/kindle-backend/api/books";
  
  request.open("GET", url, true);

  request.onload = function () {
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let sku = JSON.parse(request.response)[i]["bookSku"];
      let url = JSON.parse(request.response)[i]["document"];

      document.getElementById("book-wrapper-home").innerHTML += `
        <div
          class="p-2 col-4 col-xs-4 text-center" 
          onclick='location.href="/books/${sku}"'
        >
          <img src="${url}">
        </div>
        `
    }
  };

  request.send();
}