// カテゴリAPI

export const useCategory = () => {
  const { request } = useApi();

  // カテゴリ一覧取得
  const getCategories = () => {
    return request("/api/categories", {
      method: "GET",
    });
  };

  // カテゴリ登録
  const createCategory = (category) => {
    return request("/api/categories", {
      method: "POST",
      body: category,
    });
  };

  // カテゴリ更新
  const updateCategory = (categoryId, category) => {
    return request(`/api/categories/${categoryId}`, {
      method: "PUT",
      body: category,
    });
  };

  // カテゴリ削除
  const deleteCategory = (categoryId) => {
    return request(`/api/categories/${categoryId}`, {
      method: "DELETE",
    });
  };

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};