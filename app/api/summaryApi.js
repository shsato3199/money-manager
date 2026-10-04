import { getApiBaseUrl } from "./apiConfig";

// 月間支出集計取得
export const fetchMonthlySummary = async (year, month) => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/summary/monthly`, {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// カテゴリ別月間支出集計取得
export const fetchCategorySummary = async (year, month) => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/summary/categories`, {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// 支払元別月間支出集計取得
export const fetchPaymentSummary = async (year, month) => {
  const apiBaseUrl = getApiBaseUrl();

  return await $fetch(`${apiBaseUrl}/api/summary/payment-methods`, {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};