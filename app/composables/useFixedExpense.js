//固定費API

export const useFixedExpense = () => {
  const { request } = useApi();

  // 固定費設定一覧取得
  const getFixedExpenses = () => {
    return request("/api/fixed-expenses", {
      method: "GET",
    });
  };

  // 固定費設定登録
  const createFixedExpense = (fixedExpense) => {
    return request("/api/fixed-expenses", {
      method: "POST",
      body: fixedExpense,
    });
  };

  // 固定費設定更新
  const updateFixedExpense = (fixedExpenseId, fixedExpense) => {
    return request(`/api/fixed-expenses/${fixedExpenseId}`, {
      method: "PUT",
      body: fixedExpense,
    });
  };

  // 固定費設定削除
  const deleteFixedExpense = (fixedExpenseId) => {
    return request(`/api/fixed-expenses/${fixedExpenseId}`, {
      method: "DELETE",
    });
  };

  return {
    getFixedExpenses,
    createFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
  };
};