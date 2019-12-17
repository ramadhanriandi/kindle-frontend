function adminLogout() {
  setCookie("", "", -1);
  location.href = "/admin/login";
}

function setCookie(email, role, expiredDay) {
  const date = new Date();
  date.setTime(date.getTime() + (expiredDay * 24 * 60 * 60 * 1000));
  const expires = "expires="+ date.toUTCString();
  document.cookie = "email=" + email + "|" + role + ";" + expires + ";path=/admin";
}