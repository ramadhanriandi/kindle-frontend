window.onload = function () {
    if (!checkCookie("merchant")) {
        location.href = "/merchant/login";
    }
    else {
        //check if this is really the book of the merchant

        let bookSku = getBookSku();
        let merchantId = getMerchantId();

        if (validateBookMerchant(merchantId, bookSku)) {
            renderBookDetail(bookSku);
        }
        else {
            location.href = "/merchant/books";
        }
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

function getBookSku() {
    let url = window.location.href;
    let parsedUrl = url.split('/');
    return parsedUrl[parsedUrl.length - 2];
}

function validateBookMerchant(merchantId, bookSku) {
    const request = new XMLHttpRequest();
    const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;

    request.open("GET", url, false);
    request.send();

    let result = JSON.parse(request.response);
    return result["merchantId"] == merchantId;
}

function renderBookCategories() {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        const url = `http://localhost:8000/kindle-backend/api/categories`;

        request.open("GET", url, true);

        request.send();
        request.onload = function () {
            const jsonData = JSON.parse(request.response);
            let bookCategories = '';

            for (let i = 0; i < jsonData.length; i++) {
                bookCategories += `
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="${jsonData[i]['name']}" value="${jsonData[i]['name']}">
              <label class="form-check-label" for="${jsonData[i]['name']}">${jsonData[i]['name']}</label>
            </div>
          `
            }
            document.getElementById("category").innerHTML = bookCategories;
            resolve(true);
        };

    })
}

async function renderBookDetail(bookSku) {
    const hasRenderedCategory = await renderBookCategories();

    if (hasRenderedCategory) {
        const request = new XMLHttpRequest();
        const url = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;

        request.open("GET", url, true);

        request.onload = function () {
            const bookData = JSON.parse(request.response);

            document.getElementById("bookSku").value = bookData["bookSku"];
            document.getElementById("title").value = bookData["title"];
            document.getElementById("author").value = bookData["author"];
            document.getElementById("year").value = bookData["year"];
            document.getElementById("description").value = bookData["description"];
            document.getElementById("current-url").innerHTML += bookData["url"].split('/')[2];
            document.getElementById("url").value = bookData["url"];
            document.getElementById("price").value = bookData["price"];
            document.getElementById("variant").value = bookData["variant"];
            document.getElementById("merchant").value = bookData["merchant"]["fullname"];
            document.getElementById("merchantId").value = bookData["merchantId"];
            document.getElementById("current-document").innerHTML += bookData["document"].split('/')[2];
            document.getElementById("document").value = bookData["document"];

            const parsedCategories = bookData["categories"].split(';');

            for (let i = 0; i < parsedCategories.length; i++) {
                document.getElementById(`${parsedCategories[i]}`).checked = true;
            }
        };

        request.send();
    }
}

function navigateUploadBookFile() {
    const bookSku = document.getElementById("bookSku").value;

    location.href = `/admin/books/${bookSku}/edit/upload-file`;
}

function navigateUploadBookImage() {
    const bookSku = document.getElementById("bookSku").value;

    location.href = `/admin/books/${bookSku}/edit/upload-image`;
}

function updateBook() {
    const bookSku = getBookSku();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const variant = document.getElementById("variant").value;
    const doc = document.getElementById("document").value;
    const url = document.getElementById("url").value;
    const merchantId = document.getElementById("merchantId").value;

    let categories = '';
    const checkedCategories = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkedCategories.length; i++) {
        if (checkedCategories[i].checked) {
            categories += `${checkedCategories[i].value};`;
        }
    }
    if (categories.length !== 0) {
        categories = categories.substring(0, categories.length - 1);
    }

    const request = new XMLHttpRequest();
    const updateUrl = `http://localhost:8000/kindle-backend/api/books/${bookSku}`;

    if (!(isEmpty(title) || isEmpty(author) || isEmpty(year) || isEmpty(description) || isEmpty(price) || isEmpty(variant))) {
        request.open("PUT", updateUrl, true);
        request.setRequestHeader("Content-Type", "application/json");

        const data = JSON.stringify({
            "title": title,
            "author": author,
            "year": year,
            "description": description,
            "url": url,
            "price": price,
            "variant": variant,
            "document": doc,
            "categories": categories,
            "merchantId": merchantId
        });

        request.send(data);

        request.onload = function () {
            const jsonData = JSON.parse(request.response);

            if (jsonData['code'] === 200) {
                location.href = "/merchant";
            } else {
                alert(jsonData['message']);
            }
        };
    }
}