// 全画面共通：API呼び出し・共通エラー処理

export const useApi = () => {
  const config = useRuntimeConfig();

  // 共通APIリクエスト
  const request = async (url, options = {}) => {
    try {
      return await $fetch(url, {
        // Spring Boot APIのベースURL
        baseURL: config.public.apiBaseUrl,

        // CookieをAPIへ送信
        credentials: "include",

        ...options,
      });
    } catch (error) {
      // 未認証の場合はログイン画面へ遷移
      if (error?.response?.status === 401) {
        await navigateTo("/login");
      }

      // 呼び出し元でもエラーを処理できるように再throw
      throw error;
    }
  };

  return {
    request,
  };
};