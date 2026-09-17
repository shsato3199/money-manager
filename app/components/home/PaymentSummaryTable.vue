<script setup>
const props = defineProps({
  paymentMethods: {
    type: Array,
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
});

// 初期表示は閉じる。
const isOpen = ref(false);
// 開閉切り替え。
const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};

// 金額表示。
const formatAmount = (amount) => {
  // 金額を「¥xxx,xxx」の形式で表示する。
  return `¥${amount.toLocaleString()}`;
};
// 総支出を100%として割合を計算。
const getPaymentMethodRate = (amount) => {
  if (props.totalExpense === 0) {
    // 総支出が0円のときは、割合を0%として表示する。
    return 0;
  }
  // 総支出を100%として割合を計算する。
  return Math.min((amount / props.totalExpense) * 100, 100);
};
</script>
<!-- 支払元別集計サマリー -->
<template>
  <section class="container pb-1">
    <div class="border rounded bg-white">
      <!-- 見出し -->
      <button
        type="button"
        class="btn w-100 d-flex align-items-center justify-content-between border-bottom rounded-0 px-3 py-1 text-start"
        :aria-expanded="isOpen"
        @click="toggleAccordion"
      >
        <span class="fw-bold"> 支払元別集計 </span>

        <span class="d-flex align-items-center gap-2">
          <span class="small text-secondary"> 総支出を100%として表示 </span>

          <i
            class="bi"
            :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </span>
      </button>

      <!-- 開いているときだけ表示 -->
      <div v-if="isOpen">
        <div
          v-for="paymentMethod in paymentMethods"
          :key="paymentMethod.name"
          class="row align-items-center g-2 px-3 py-1 border-bottom"
        >
          <!-- 支払元名 -->
          <div class="col-4 col-md-3">
            <span class="small fw-semibold">
              {{ paymentMethod.name }}
            </span>
          </div>

          <!-- 横棒 -->
          <div class="col-5 col-md-6">
            <div
              class="progress"
              role="progressbar"
              :aria-label="`${paymentMethod.name}の支出割合`"
              :aria-valuenow="getPaymentMethodRate(paymentMethod.amount)"
              aria-valuemin="0"
              aria-valuemax="100"
              style="height: 8px"
            >
              <div
                class="progress-bar bg-secondary"
                :style="{
                  width: `${getPaymentMethodRate(paymentMethod.amount)}%`,
                }"
              ></div>
            </div>
          </div>

          <!-- 金額 -->
          <div class="col-3 text-end">
            <span class="small fw-bold">
              {{ formatAmount(paymentMethod.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
