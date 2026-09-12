<!-- ログイン後の共通レイアウトの設定 -->
<!--ヘッダーやフッターなど、ログイン後の各画面で共通に出したいものを書きます。-->
<template>
  <AppHeader />

  <main>
    <slot />
  </main>

  <AppFooter />
</template>
