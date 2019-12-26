window.onload = function() {
  if (!checkCookie("customer")) {
    location.href = "/login";
  }
  renderPaymentDetail();
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

function convertToCurrency(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderPaymentDetail() {
  const request = new XMLHttpRequest();
  const parsedCookie = document.cookie.split('|');
  const userId = parsedCookie[parsedCookie.length-1];
  const url = `http://localhost:8000/kindle-backend/api/customers/${userId}/cart`;
  
  request.open("GET", url, true);

  request.onload = function () {
    let allBook = '';
    let total = 0;
    for (let i = 0; i < JSON.parse(request.response).length; i++) {
      let bookData = JSON.parse(request.response)[i]["bookData"];

      allBook += `
        <div class="d-flex flex-row justify-content-between payment-item">
          <div class="payment-title">
            ${bookData['title']}
          </div>
          <div class="payment-amount">
            IDR ${convertToCurrency(bookData['price'])}
          </div>              
        </div>
        `

        total += bookData['price'];
    }
    document.getElementById("payment-wrapper").innerHTML = allBook;
    document.getElementById("total").innerHTML = convertToCurrency(total);
    document.getElementById("transaction-total").value = total;
  };

  request.send();
}

function postTransactionList() {
  return new Promise(function (resolve, reject) {
    const parsedCookie = document.cookie.split('|');
    const customerId = parsedCookie[parsedCookie.length-1];

    const total = document.getElementById("transaction-total").value;
    const transactionRequest = new XMLHttpRequest();
    const transactionUrl = "http://localhost:8000/kindle-backend/api/transactions";
    transactionRequest.open("POST", transactionUrl, true);
    transactionRequest.setRequestHeader("Content-Type", "application/json");
    const transactionData = JSON.stringify({
      "total": total,
      "customerId": customerId, 
    });
    transactionRequest.onreadystatechange = function () {
      if (transactionRequest.readyState === 4 && transactionRequest.status === 200) {
        const transactionJsonData = JSON.parse(transactionRequest.response);
        document.getElementById("transaction-id").value = transactionJsonData["transactionId"];
        resolve(transactionRequest.response); 
      }
    }  
    transactionRequest.send(transactionData);
  })
}

async function purchaseBooks() {
  const parsedCookie = document.cookie.split('|');
  const customerId = parsedCookie[parsedCookie.length-1];

  try {
    const transactionData = await postTransactionList();
    let transactionListData = [];
    
    const cartRequest = new XMLHttpRequest();
    const cartUrl = `http://localhost:8000/kindle-backend/api/customers/${customerId}/cart`;
    cartRequest.open("GET", cartUrl, true);
    cartRequest.send();
    cartRequest.onreadystatechange = function () {
      if (cartRequest.readyState === 4 && cartRequest.status === 200) {
        const cartJsonData = JSON.parse(cartRequest.response);
        for (let i = 0; i < cartJsonData.length; i++) {
          let tempTransactionList = {
            "bookSku": cartJsonData[i]["bookData"]["bookSku"],
            "merchantId": cartJsonData[i]["bookData"]["merchantId"]
          }
          transactionListData.push(tempTransactionList);
        }
  
        let count = 0;
        for (let i = 0; i < transactionListData.length; i++) {
          let transactionListRequest = new XMLHttpRequest();
          let transactionListUrl = "http://localhost:8000/kindle-backend/api/transactionlists";
          
          transactionListRequest.open("POST", transactionListUrl, true);
          transactionListRequest.setRequestHeader("Content-Type", "application/json");
          let transactionList = JSON.stringify({
            "bookSku": transactionListData[i]["bookSku"],
            "merchantId": transactionListData[i]["merchantId"], 
            "transactionId": JSON.parse(transactionData)["transactionId"], 
          });
          transactionListRequest.send(transactionList);
          transactionListRequest.onreadystatechange = function () {
            if (transactionListRequest.readyState === 4 && transactionListRequest.status === 200) {
              count++;
              if (count == transactionListData.length) {
                alert("Success: Your book has been purchased!");
                location.href = "/orders";
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}