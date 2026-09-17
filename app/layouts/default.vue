<!-- ログイン後の共通レイアウトの設定 -->
<!-- ヘッダーやフッターなど、ログイン後の各画面で共通に出したいものを書きます。 -->
<template>
  <CommonAppHeader />

  <main style="padding-bottom: calc(90px + env(safe-area-inset-bottom))">
    <slot />
  </main>

  <CommonAppFooter />
</template>
