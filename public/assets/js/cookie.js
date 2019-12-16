window.onload = function() {
  if (!checkCookie()) {
    location.href = "/login";
  }
};

function getCookie(variable) {
  const name = variable + "=";
  const cookieData = document.cookie.split(';');
  for(let i = 0; i < cookieData.length; i++) {
    const cookieString = cookieData[i];
    while (cookieString.charAt(0) === ' ') {
      cookieString = cookieString.substring(1);
    }
    if (cookieString.indexOf(name) === 0) {
      return cookieString.substring(name.length, cookieString.length);
    }
  }
  return "";
}

function checkCookie() {
  const emailCookie = getCookie("email");
  if (emailCookie != "" && emailCookie != null) {
    return true;
  }
  return false;
}