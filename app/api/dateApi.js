// 現在日付取得
export const fetchCurrentDate = async () => {
  return await $fetch("http://localhost:8080/api/current-date", {
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};