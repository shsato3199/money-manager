// 全画面で実行される認証用ミドルウェア。
// 認証機能を実装するまでは、ログイン画面以外へのアクセスを /login に遷移させる。
export default defineNuxtRouteMiddleware((to) => {
  // TODO: Google認証実装時にここへ追加
  // /login 自身まで /login に飛ばすと無限リダイレクトになるため除外する。
  //  if (to.path !== "/login") {
  //  return navigateTo("/login");
  //}
});