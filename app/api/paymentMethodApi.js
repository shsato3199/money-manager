import { getCsrfToken } from "~/utils/csrf";
import { getApiBaseUrl } from "./apiConfig";

// 支払元一覧取得。
export const fetchPaymentMethods = async () => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/payment-methods`, {
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// 支払元登録。
export const createPaymentMethod = async (paymentMethod) => {
  const apiBaseUrl = getApiBaseUrl();
  const csrfToken = getCsrfToken();

  return await $fetch(`${apiBaseUrl}/api/payment-methods`, {
    method: "POST",
    body: paymentMethod,
    credentials: "include",
    headers: csrfToken
      ? {
          "X-XSRF-TOKEN": csrfToken,
        }
      : {},
    redirect: "error",
  });
};