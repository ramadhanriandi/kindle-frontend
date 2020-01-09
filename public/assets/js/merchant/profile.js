window.onload = function () {
    if (!checkCookie("merchant")) {
        location.href = "/merchant/login";
    }
    renderProfile();
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

function renderProfile() {
    const request = new XMLHttpRequest();
    const merchantId = getMerchantId();
    const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;

    request.open("GET", url, true);

    request.onload = function () {
        const jsonData = JSON.parse(request.response);

        document.getElementById("email").value = jsonData['email'];
        document.getElementById("username").value = jsonData['username'];
        document.getElementById("password").value = jsonData['password'];
        document.getElementById("phone").value = jsonData['phone'];
        document.getElementById("description").value = jsonData['description'];
    };

    request.send();
}

function updateMerchant() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const description = document.getElementById("description").value;
    const phone = document.getElementById("phone").value;

    const request = new XMLHttpRequest();
    const merchantId = getMerchantId();
    const url = `http://localhost:8000/kindle-backend/api/merchants/${merchantId}`;

    if (!isEmpty(email) && !(isEmpty(username) && isEmpty(password))) {
        request.open("PUT", url, true);
        request.setRequestHeader("Content-Type", "application/json");

        const data = JSON.stringify({
            "email": email,
            "username": username,
            "password": password,
            "description": description,
            "phone": phone,
            "status": "Active"
        });

        request.send(data);

        request.onload = function () {
            const jsonData = JSON.parse(request.response);

            if (jsonData['code'] === 200) {
                console.log("helloooo there");
            } else {
                alert(jsonData['message']);
            }
        };
    }
}