function customerLogout() {
  setCookie("email", "", -1);
  location.href = "/login";
}

function setCookie(variable, value, expiredDay) {
  const date = new Date();
  date.setTime(date.getTime() + (expiredDay * 24 * 60 * 60 * 1000));
  const expires = "expires="+ date.toUTCString();
  document.cookie = variable + "=" + value + ";" + expires + ";path=/";
}