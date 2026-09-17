// ログイン状態取得
// 認証API

export const useAuth = () => {
  const { request } = useApi();

  // ログインユーザー情報取得
  const getCurrentUser = () => {
    return request("/api/users/me", {
      method: "GET",
    });
  };

  // Googleログイン開始
  const loginWithGoogle = () => {
    const config = useRuntimeConfig();

    window.location.href =
      `${config.public.apiBaseUrl}/oauth2/authorization/google`;
  };

  // ログアウト
  const logout = () => {
    return request("/api/logout", {
      method: "POST",
    });
  };

  return {
    getCurrentUser,
    loginWithGoogle,
    logout,
  };
};