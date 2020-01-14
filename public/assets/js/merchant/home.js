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

function renderMerchantDetail(){
    return new Promise( function(resolve, reject){
        const merchantId = getMerchantId();
        const request = new XMLHttpRequest();
        const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;

        request.open("GET", url, true);

        request.send();

        request.onload = function(){
            const result = JSON.parse(request.response);
            
            console.log(result)

            document.getElementById("merchant-name").innerHTML = result["data"][0]["attributes"]["fullname"];
            document.getElementById("merchant-phone").innerHTML = result["data"][0]["attributes"]["phone"];
            document.getElementById("merchant-description").innerHTML = result["data"][0]["attributes"]["description"];
        
            resolve(true);
        };
    });
}

async function renderBooks(){
    const hasRenderedMerchantDetail = await renderMerchantDetail();

    const merchantId = getMerchantId();
    const listContainer = document.getElementById("list-container");

    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}/catalog`;
    request.open("GET", url, true);

    request.onload = function(){
        
        catalogData = JSON.parse(request.response)["data"];
        catalogData.forEach(bookData => {
            let itemTemplate = `
            <div class="d-flex catalog-item" onclick="viewBook(${bookData["id"]})">
                <img src="${bookData["attributes"]["document"]}">
            </div>
            `
            listContainer.innerHTML += itemTemplate;
        });
        
    }

    request.send();
    
}

function viewBook(bookId){
    location.href = `/merchant/books/${bookId}`
}