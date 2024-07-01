const isEmail = (email) => {
  var p = /\s*\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\s*/;
  return p.test(email);
};

const setCookie = (cookieName, cookieValue, expireDays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expireDays);
  document.cookie =
    cookieName +
    "=" +
    escape(cookieValue) +
    (expireDays == null ? 1 : ";path=/; expires=" + exdate.toGMTString());
};

const getCookie = (name) => {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) {
    return unescape(arr[2]);
  }
  return null;
};

const deleteCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = this.getCookie(name);
  if (cval != null)
    document.cookie =
      name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
};

module.exports = {isEmail, setCookie, getCookie, deleteCookie}
