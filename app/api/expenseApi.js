import { getCsrfToken } from "~/utils/csrf";
import { getApiBaseUrl } from "./apiConfig";

// 変動費一覧取得
export const fetchExpenses = async (year, month) => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/expenses`, {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// 変動費登録
export const createExpense = async (expense) => {
  const apiBaseUrl = getApiBaseUrl();
  const csrfToken = getCsrfToken();

  return await $fetch(`${apiBaseUrl}/api/expenses`, {
    method: "POST",
    body: expense,
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
    // Spring SecurityへCSRFトークンを送る。
    headers: csrfToken
      ? {
          "X-XSRF-TOKEN": csrfToken,
        }
      : {},
    // /loginへのリダイレクトなどを登録成功として扱わない。
    redirect: "error",
  });
};

// 変動費更新
export const updateExpense = async (id, expense) => {
  // PUT
};

// 変動費削除
export const deleteExpense = async (id) => {
  // DELETE
};