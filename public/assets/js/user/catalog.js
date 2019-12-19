window.onload = function() {
    let url = window.location.href;
    let merchant_id = url.substring(url.lastIndexOf('/') + 1);
    renderMerchantCatalog(merchant_id);
}

function renderMerchantCatalog(merchant_id){
    var catalogContainer = document.getElementById("catalog-container");
    
    var request = new XMLHttpRequest();
    const url = "http://localhost:8000/kindle-backend/api/merchants/"+merchant_id+"/catalog";
    request.open("GET", url, true);

    request.onload = function(){
        let response = JSON.parse(request.response);
        for(let i = 0; i < response.length; i++){
            let sku = response[i]["bookSku"];
            let imgURL = response[i]["document"];

            catalogContainer.innerHTML += `
            <div 
                class="d-flex catalog-item"
                onclick='location.href="/books/${sku}"'
            >
                <img src="${imgURL}">
            </div>
            `
        }
    };

    request.send();
}