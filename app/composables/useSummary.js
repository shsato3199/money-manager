// ホーム画面集計API

export const useSummary = () => {
  const { request } = useApi();

  // 月次サマリー取得
  const getMonthlySummary = (yearMonth) => {
    return request("/api/summary/monthly", {
      method: "GET",
      query: {
        yearMonth,
      },
    });
  };

  // カテゴリ別集計取得
  const getCategorySummary = (yearMonth) => {
    return request("/api/summary/categories", {
      method: "GET",
      query: {
        yearMonth,
      },
    });
  };

  // 支払元別集計取得
  const getPaymentMethodSummary = (yearMonth) => {
    return request("/api/summary/payment-methods", {
      method: "GET",
      query: {
        yearMonth,
      },
    });
  };

  return {
    getMonthlySummary,
    getCategorySummary,
    getPaymentMethodSummary,
  };
};