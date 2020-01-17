//import cookie operational methods
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

//create window onload procedure
window.onload = function(){
    if(!checkCookie("merchant")){
        location.href = "/merchant/login";
    }
    else{
        renderOrders();
    }
};

//Main Functionalities

//Supporting function to parse date to WIB format
function timeConverter(date){
    var monthNames = new Array("January", "February", "March", 
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December");

    var date = new Date(date);
    var cDate = date.getDate();
    var cMonth = date.getMonth();
    var cYear = date.getFullYear();

    var cHour = date.getHours();
    var cMin = date.getMinutes();
    
    if(cMin < 10){
        cMin = "0" + cMin;
    }

    return ( monthNames[cMonth] + " " +cDate  + ", " +cYear + " at " +cHour+ ":" + cMin);
}

//function to go to specific book page
function seeBookDetail(bookId){
    location.href = `/merchant/books/${bookId}`;
}

//function to find detail in "included" part of response
function findInIncluded(includedArray, type, id){
    for(i = 0; i < includedArray.length; i++){
        var includedItem = includedArray[i];
        if ((includedItem["id"] == id) && (includedItem["type"] == type)){
            return includedItem;
        }
    }
}


//create function to create API call and dynamically render orders
function renderOrders(){

    const orderRequest = new XMLHttpRequest();
    const cookieData = document.cookie.split('|');
    const merchantId = cookieData[cookieData.length - 1];
    const orderURL = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}/orders`;

    orderRequest.open("GET", orderURL, true);

    orderRequest.onload = function(){
        console.log("allOrderJSON");
        var allOrderHTML = '';
        var allOrderJSON = JSON.parse(orderRequest.response);
        var includedArray = allOrderJSON["included"]

        for(let i = 0; i < allOrderJSON["data"].length; i++){
            let bookData = findInIncluded(includedArray, "book", allOrderJSON["data"][i]["relationships"]["book"]["data"][0]["id"]);
            let transactionData = findInIncluded(includedArray, "transaction", allOrderJSON["data"][i]["relationships"]["transaction"]["data"][0]["id"]);

            allOrderHTML += `
            <div class="merchant-order-item w-100">
                <div class="d-flex flex-row">
                <div
                    class="d-flex flex-column justify-content-between w-100"
                >
                    <div class="d-flex flex-nowrap order-time">
                        ${timeConverter(transactionData["attributes"]["date"])}
                    </div>
                    <div class="d-flex flex-nowrap order-user">
                        ${transactionData["attributes"]["customerName"]}
                    </div>
                    <div class="d-flex flex-nowrap order-title">
                        ${bookData["attributes"]["title"]}
                    </div>
                    <div class="d-flex flex-nowrap order-price">
                        IDR ${bookData["attributes"]["price"]}
                    </div>
                </div>
                <div
                    class="d-flex flex-column justify-content-end align-items-end"
                >
                    <div class="p-2 rounded-sm detail-button" onClick="seeBookDetail(${bookData["id"]})">
                    <span class="fa fa-th-list"></span>&nbsp; Details
                    </div>
                </div>
                </div>
            </div>
            `
        }   

        document.getElementById("order-container").innerHTML = allOrderHTML;
    };

    orderRequest.send();
}