// 支払元API
export const usePaymentMethod = () => {
  const { request } = useApi();

  // 支払元一覧取得
  const getPaymentMethods = () => {
    return request("/api/payment-methods", {
      method: "GET",
    });
  };

  // 支払元登録
  const createPaymentMethod = (paymentMethod) => {
    return request("/api/payment-methods", {
      method: "POST",
      body: paymentMethod,
    });
  };

  // 支払元更新
  const updatePaymentMethod = (paymentMethodId, paymentMethod) => {
    return request(`/api/payment-methods/${paymentMethodId}`, {
      method: "PUT",
      body: paymentMethod,
    });
  };

  // 支払元削除
  const deletePaymentMethod = (paymentMethodId) => {
    return request(`/api/payment-methods/${paymentMethodId}`, {
      method: "DELETE",
    });
  };

  return {
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
};