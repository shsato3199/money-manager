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
      <p class="text-secondary mb-3">収支を記録して、暮らしをシンプルに</p>
      <!-- ログイン -->
      <div class="rounded-3 p-4">
        <button
          type="button"
          class="btn btn-outline-dark w-100 py-3 fw-semibold"
          @click="navigateTo('/')"
        >
          Googleでログイン
        </button>
        <p class="small text-secondary mt-4 mb-0">
          初回ログイン時はアカウントを自動で作成します。
        </p>
      </div>
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
