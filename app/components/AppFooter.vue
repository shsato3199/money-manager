<script setup>
// 支出登録モーダルの開閉状態。
const isExpenseEntryModalOpen = ref(false);

// 支出登録モーダルを開く。
const openExpenseEntryModal = () => {
  isExpenseEntryModalOpen.value = true;
};

// 支出登録モーダルを閉じる。
const closeExpenseEntryModal = () => {
  isExpenseEntryModalOpen.value = false;
};
</script>
<template>
  <footer class="bg-white border-top fixed-bottom">
    <div class="container-fluid py-2">
      <div class="d-flex justify-content-around align-items-center text-center">
        <!-- ホーム -->
        <NuxtLink
          to="/"
          class="text-dark text-decoration-none d-flex flex-column align-items-center"
          aria-label="ホーム"
          title="ホーム"
        >
          <i class="bi bi-house-door fs-4"></i>
          <span class="small">ホーム</span>
        </NuxtLink>

        <!-- 固定費管理 -->
        <NuxtLink
          to="/fixed-expenses"
          class="text-dark text-decoration-none d-flex flex-column align-items-center"
          aria-label="固定費管理"
          title="固定費管理"
        >
          <i class="bi bi-calendar-check fs-4"></i>
          <span class="small">固定費</span>
        </NuxtLink>

        <!-- 支出登録 -->
        <button
          type="button"
          class="btn btn-link text-dark text-decoration-none d-flex flex-column align-items-center p-0"
          aria-label="支出登録"
          title="支出登録"
          @click="openExpenseEntryModal"
        >
          <i class="bi bi-plus-circle fs-4"></i>
          <span class="small">支出登録</span>
        </button>

        <!-- カテゴリ管理 -->
        <NuxtLink
          to="/settings/categories"
          class="text-dark text-decoration-none d-flex flex-column align-items-center"
          aria-label="カテゴリ管理"
          title="カテゴリ管理"
        >
          <i class="bi bi-tags fs-4"></i>
          <span class="small">カテゴリ</span>
        </NuxtLink>

        <!-- 支払元管理 -->
        <NuxtLink
          to="/settings/payment-methods"
          class="text-dark text-decoration-none d-flex flex-column align-items-center"
          aria-label="支払元管理"
          title="支払元管理"
        >
          <i class="bi bi-wallet2 fs-4"></i>
          <span class="small">支払元</span>
        </NuxtLink>
      </div>
    </div>
  </footer>

  <ExpenseEntryModal
    :is-open="isExpenseEntryModalOpen"
    @close="closeExpenseEntryModal"
  />
</template>
