window.onload = function () {
    if (!checkCookie("merchant")) {
        location.href = "/merchant/login";
    }
    else {
        renderBooks();
    }
};

function getMerchantId() {
    const emailCookie = getCookie("email");
    const parsedCookie = emailCookie.split('|');

    return parsedCookie[parsedCookie.length - 1]
}

function renderBooks(){
    const merchantId = getMerchantId();
    const listContainer = document.getElementById("list-container");

    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}/catalog`;
    request.open("GET", url, true);

    request.onload = function(){
        
        catalogData = JSON.parse(request.response);
        catalogData.forEach(bookData => {
            let itemTemplate = `
            <div class="d-flex catalog-item">
                <img src="${bookData["document"]}">
            </div>
            `
            listContainer.innerHTML += itemTemplate;
        });
        
    }

    request.send();
    
}