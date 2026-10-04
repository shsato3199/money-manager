// Cookieから指定した値を取得する。
const getCookieValue = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.substring(name.length + 1));
};

// CSRFトークンを取得する。
export const getCsrfToken = () => {
  return getCookieValue("XSRF-TOKEN");
};