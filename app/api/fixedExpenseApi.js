// 固定費一覧取得
export const fetchFixedExpenses = async (year, month) => {
  return await $fetch("http://localhost:8080/api/fixed-expenses", {
    // 表示対象の年・月を検索条件として渡す。
    query: {
      year,
      month,
    },
    // Cookieなどの認証情報も一緒に送る指定。
    credentials: "include",
  });
};

// 固定費登録
export const createFixedExpense = async (fixedExpense) => {
  // POST
};

// 固定費更新
export const updateFixedExpense = async (id, fixedExpense) => {
  // PUT
};

// 固定費削除
export const deleteFixedExpense = async (id) => {
  // DELETE
};