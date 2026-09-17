// ログインユーザー情報を管理するStore

export const useAuthStore = defineStore("auth", () => {
  // ========================
  // ① 状態
  // ========================

  const user = ref(null);

  // ========================
  // ② computed
  // ========================

  // ログイン状態
  const isLoggedIn = computed(() => user.value !== null);

  // ========================
  // ③ 関数
  // ========================

  // ログインユーザーを設定
  const setUser = (loginUser) => {
    user.value = loginUser;
  };

  // ログインユーザーをクリア
  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
  };
});