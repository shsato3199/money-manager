<script setup>
// 現在のルート情報を取得
const route = useRoute();
</script>

<!-- ログイン後の共通レイアウトの設定 -->
<!-- ヘッダーやフッターなど、ログイン後の各画面で共通に出したいものを書きます。 -->
<template>
  <AppHeader />

  <main
    :style="{
      paddingBottom:
        route.path === '/' ? 'calc(90px + env(safe-area-inset-bottom))' : '0',
    }"
  >
    <slot />
  </main>

  <!-- ホーム画面のみフッターを表示 -->
  <AppFooter v-if="route.path === '/'" />
</template>
