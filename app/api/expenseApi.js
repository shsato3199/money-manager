// 変動費一覧取得
export const fetchExpenses = async () => {
  return await $fetch("http://localhost:8080/api/expenses", {
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// 変動費登録
export const createExpense = async (expense) => {
  // POST
};

// 変動費更新
export const updateExpense = async (id, expense) => {
  // PUT
};

// 変動費削除
export const deleteExpense = async (id) => {
  // DELETE
};