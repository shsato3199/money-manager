<template>
  <header class="bg-white border-bottom">
    <div class="container-fluid py-2">
      <div class="row align-items-center">
        <!-- タイトル -->
        <div class="col d-flex align-items-center gap-2">
          <img
            src="/img/household-ledger.png"
            alt="家計簿"
            width="28"
            height="28"
          />
          <span class="fw-bold">家計簿</span>
        </div>

        <!-- ユーザーアイコン・ログアウト -->
        <div
          class="col-auto d-flex justify-content-end align-items-center gap-2 flex-shrink-0"
        >
          <img
            src="/img/placeholder-user-icon.png"
            alt="ユーザーアイコン"
            width="28"
            height="28"
            class="rounded-circle object-fit-cover flex-shrink-0"
          />

          <button
            type="button"
            class="btn btn-link text-dark text-decoration-none p-0 border-0"
            aria-label="ログアウト"
            title="ログアウト"
            @click="navigateTo('/login')"
          >
            <i class="bi bi-box-arrow-right fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
