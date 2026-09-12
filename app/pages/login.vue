<script setup>
definePageMeta({
  layout: "login",
});
</script>

<template>
  <!-- ログイン画面 -->
  <section
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3"
  >
    <div class="text-center w-100" style="max-width: 420px">
      <!-- レシートをイメージしたアイコン -->
      <div class="fs-1 mb-3" aria-hidden="true">
        <img
          src="/img/household-ledger.png"
          alt="レシートのアイコン"
          width="120"
          height="120"
        />
      </div>
      <!-- タイトル -->
      <h1 class="display-6 fw-bold mb-2">家計簿</h1>
      <!-- サブタイトル -->
      <p class="text-secondary mb-4">収支を記録して、暮らしをシンプルに</p>
      <!-- Googleログインボタン -->
      <button type="button" class="btn btn-dark w-100 py-3 fw-semibold">
        Googleでログイン
      </button>
      <!-- 補足 -->
      <p class="small text-secondary mt-4 mb-0">
        ログインすることで、利用規約および
        <NuxtLink to="/privacy" class="text-dark">
          プライバシーポリシー
        </NuxtLink>
        に同意したものとみなします。
      </p>
    </div>
  </section>
</template>
