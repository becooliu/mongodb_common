const isEmail = (email) => {
  var p = /\s*\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\s*/;
  return p.test(email);
};

const areAllEmpty = () => {
  for(let i = 0, len = arguments.length; i < len; i++) {
    if(arguments[i] !== null && arguments[i] !== 'undefined' && arguments[i] !== '') {
      return false
    }
  }
  return true
}

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

module.exports = {isEmail, areAllEmpty, setCookie, getCookie, deleteCookie}
