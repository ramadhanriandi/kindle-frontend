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
    const jsonData = JSON.parse(request.response);

    if (jsonData['code'] === 200) {
      let allBook = '';
      let total = 0;
      for (let i = 0; i < jsonData['data'].length; i++) {
        allBook += `
          <div class="d-flex flex-row justify-content-between payment-item">
            <div class="payment-title">
              ${jsonData['data'][i]['attributes']['title']}
            </div>
            <div class="payment-amount">
              IDR ${convertToCurrency(jsonData['data'][i]['attributes']['price'])}
            </div>              
          </div>
          `

          total += jsonData['data'][i]['attributes']['price'];
      }
      document.getElementById("payment-wrapper").innerHTML = allBook;
      document.getElementById("total").innerHTML = convertToCurrency(total);
      document.getElementById("transaction-total").value = total;
    } else {
      alert(jsonData['errors'][0]['detail']);
    }
  };

  request.send();
}

function getCart() {
  return new Promise(function (resolve, reject) {
    let transactionListData = [];
    const parsedCookie = document.cookie.split('|');
    const customerId = parsedCookie[parsedCookie.length-1];
    
    const cartRequest = new XMLHttpRequest();
    const cartUrl = `http://localhost:8000/kindle-backend/api/customers/${customerId}/cart`;
    cartRequest.open("GET", cartUrl, true);
    cartRequest.send();
    cartRequest.onload = function () {
      const jsonData = JSON.parse(cartRequest.response);

      if (jsonData['code'] === 200) {
        for (let i = 0; i < jsonData['data'].length; i++) {
          let tempTransactionList = {
            "bookSku": jsonData['data'][i]['id'],
            "merchantId": jsonData['data'][i]['relationships']['merchant']['data'][0]['id']
          }
          transactionListData.push(tempTransactionList);
        }
        resolve(transactionListData);
      } else {
        alert(jsonData['errors'][0]['detail']);
      }
    }
  })
}

function postTransaction() {
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
    transactionRequest.send(transactionData);
    transactionRequest.onload = function () {
      const jsonData = JSON.parse(transactionRequest.response);

      if (jsonData['code'] === 201) {
        document.getElementById("transaction-id").value = jsonData['data'][0]["id"];
        resolve(transactionRequest.response); 
      } else {
        alert(jsonData['errors'][0]['detail']);
      }
    }  
  })
}

async function postTransactionList() {
  const transactionListData = await getCart();
  const transactionData = await postTransaction();

  return new Promise(function (resolve, reject) {
    const parsedCookie = document.cookie.split('|');
    const customerId = parsedCookie[parsedCookie.length-1];

    let numberOfResponse = 0;

    for (let i = 0; i < transactionListData.length; i++) {
      let transactionListRequest = new XMLHttpRequest();
      let transactionListUrl = `http://localhost:8000/kindle-backend/api/transactionlists?customerId=${customerId}`;
      
      transactionListRequest.open("POST", transactionListUrl, true);
      transactionListRequest.setRequestHeader("Content-Type", "application/json");
      let transactionList = JSON.stringify({
        "bookSku": transactionListData[i]["bookSku"],
        "merchantId": transactionListData[i]["merchantId"], 
        "transactionId": JSON.parse(transactionData)['data'][0]["id"], 
      });
      transactionListRequest.send(transactionList);
      transactionListRequest.onload = function () {
        const jsonData = JSON.parse(transactionListRequest.response);

        if (jsonData['code'] === 201) {
          numberOfResponse++;
          if (transactionListData.length == numberOfResponse) {
            resolve(numberOfResponse)
          }
        } else {
          alert(jsonData['errors'][0]['detail']);
        }
      }
    }
  })
}

async function purchaseBooks() {
  const numberOfResponseTransactionList = await postTransactionList();

  if (numberOfResponseTransactionList) {
    alert("Success: Your book has been purchased!");
    location.href = "/orders";
  }
}
