import { getCsrfToken } from "~/utils/csrf";
import { getApiBaseUrl } from "./apiConfig";

// カテゴリ一覧取得
export const fetchCategories = async () => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/categories`, {
    credentials: "include",
  });
};

// カテゴリ登録
export const createCategory = async (category) => {
  const apiBaseUrl = getApiBaseUrl();
  const csrfToken = getCsrfToken();

  return await $fetch(`${apiBaseUrl}/api/categories`, {
    method: "POST",
    body: category,
    credentials: "include",
    headers: csrfToken
      ? {
          "X-XSRF-TOKEN": csrfToken,
        }
      : {},
    redirect: "error",
  });
};