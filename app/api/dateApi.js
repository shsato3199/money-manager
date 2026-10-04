import { getApiBaseUrl } from "./apiConfig";

// 現在日付取得
export const fetchCurrentDate = async () => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/current-date`, {
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};