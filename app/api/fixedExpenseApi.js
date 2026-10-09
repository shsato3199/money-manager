import { getCsrfToken } from "~/utils/csrf";
import { getApiBaseUrl } from "./apiConfig";

// 固定費一覧取得(Home画面で表示するための固定費一覧ß)
export const fetchFixedExpenses = async (year, month) => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/fixed-expenses`, {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};
// 固定費設定一覧取得。
export const fetchFixedExpenseTemplates = async () => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/fixed-expenses/templates`, {
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};
// 固定費登録
export const createFixedExpense = async (fixedExpense) => {
  const apiBaseUrl = getApiBaseUrl();
  const csrfToken = getCsrfToken();

  return await $fetch(`${apiBaseUrl}/api/fixed-expenses`, {
    method: "POST",
    body: fixedExpense,
    credentials: "include",
    headers: csrfToken
      ? {
          "X-XSRF-TOKEN": csrfToken,
        }
      : {},
    redirect: "error",
  });
};

// 固定費更新
export const updateFixedExpense = async (id, fixedExpense) => {
  // PUT
};

// 固定費削除
export const deleteFixedExpense = async (id) => {
  // DELETE
};