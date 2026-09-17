//支出登録API

export const useExpense = () => {
  const { request } = useApi();

  // 支出一覧取得
  const getExpenses = (yearMonth) => {
    return request("/api/expenses", {
      method: "GET",
      query: {
        yearMonth,
      },
    });
  };

  // 支出登録
  const createExpense = (expense) => {
    return request("/api/expenses", {
      method: "POST",
      body: expense,
    });
  };

  // 支出更新
  const updateExpense = (expenseId, expense) => {
    return request(`/api/expenses/${expenseId}`, {
      method: "PUT",
      body: expense,
    });
  };

  // 支出削除
  const deleteExpense = (expenseId) => {
    return request(`/api/expenses/${expenseId}`, {
      method: "DELETE",
    });
  };

  return {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};