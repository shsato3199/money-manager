<script setup>
const props = defineProps({
  categories: {
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
  return `¥${amount.toLocaleString()}`;
};
// 総支出を100%として割合を計算。
const getCategoryRate = (amount) => {
  if (props.totalExpense === 0) {
    // 総支出が0円のときは、割合を0%として表示する。
    return 0;
  }
  // 総支出を100%として割合を計算する。
  return Math.min((amount / props.totalExpense) * 100, 100);
};
</script>

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
        <span class="fw-bold"> カテゴリ別集計 </span>

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
          v-for="category in categories"
          :key="category.name"
          class="row align-items-center g-2 px-3 py-1 border-bottom"
        >
          <div class="col-4 col-md-3">
            <span class="small fw-semibold">
              {{ category.name }}
            </span>
          </div>

          <div class="col-5 col-md-6">
            <div
              class="progress"
              role="progressbar"
              :aria-valuenow="getCategoryRate(category.amount)"
              aria-valuemin="0"
              aria-valuemax="100"
              style="height: 8px"
            >
              <div
                class="progress-bar bg-dark"
                :style="{
                  width: `${getCategoryRate(category.amount)}%`,
                }"
              ></div>
            </div>
          </div>

          <div class="col-3 text-end">
            <span class="small fw-bold">
              {{ formatAmount(category.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
