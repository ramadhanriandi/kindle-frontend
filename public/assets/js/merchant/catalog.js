window.onload = function () {
    if (!checkCookie("merchant")) {
        location.href = "/merchant/login";
    }
    else {
        renderCatalog();
    }
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
    for (let i = 0; i < cookieData.length; i++) {
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

function getMerchantId() {
    const emailCookie = getCookie("email");
    const parsedCookie = emailCookie.split('|');

    return parsedCookie[parsedCookie.length - 1]
}

function renderCatalog(){
    const merchantId = getMerchantId();
    const listContainer = document.getElementById("list-container");

    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}/catalog`;
    request.open("GET", url, true);

    request.onload = function(){
        
        catalogData = JSON.parse(request.response);
        catalogData.forEach(bookData => {
            let itemTemplate = `
                <div class="row mb-3">
                    <div class="col-7 col-xs-7 col-md-7 col-lg-7 catalog-book-title">
                        ${bookData["title"]}
                    </div>
                    <div class="col-5 col-xs-5 col-md-5 col-lg-5">
                        <div class="d-flex justify-content-around">
                        <div class="edit-small-button" onclick="editBook(${bookData["bookSku"]})">
                            <span class="fa fa-pencil-square-o"></span>&nbsp; Edit
                        </div>
                        <div class="delete-small-button" onclick="deleteBook(${bookData["bookSku"]})">
                            <span class="fa fa-trash-o"></span>&nbsp; Delete
                        </div>
                        </div>
                    </div>
                </div>
            `
            listContainer.innerHTML += itemTemplate;
        });
        
    }

    request.send();
    
}

function editBook(bookSku){
    location.href = `/merchant/books/${bookSku}/edit`;
}

function deleteBook(bookSku){

}

function addBook(){
    
}