<script setup>
// index.vueから一覧タイトル、支出データ、開閉状態を受け取る。
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  expenses: {
    type: Array,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

// 親コンポーネント(index.vue)へ通知する。
const emit = defineEmits(["toggle", "edit"]);

// 金額を「¥xx,xxx」の形式で表示する。
const formatAmount = (amount) => {
  return `¥${amount.toLocaleString()}`;
};
</script>

<!-- 固定費/変動費一覧 -->
<template>
  <section class="container pb-1">
    <div class="border rounded bg-white">
      <!-- 見出し -->
      <button
        type="button"
        class="btn w-100 d-flex align-items-center justify-content-between border-bottom rounded-0 px-3 py-2 text-start"
        :aria-expanded="isOpen"
        @click="emit('toggle')"
      >
        <span class="fw-bold">
          {{ title }}
        </span>

        <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>

      <!-- 開いているときだけ一覧表示 -->
      <div v-if="isOpen">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          class="row align-items-center g-2 px-2 py-2 border-bottom"
        >
          <!-- 変動費のみ左側に編集ボタンを表示 -->
          <div v-if="title === '変動費一覧'" class="col-1 text-start">
            <button
              type="button"
              class="btn btn-link btn-sm text-secondary p-0"
              aria-label="支出を編集"
              title="編集"
              @click="emit('edit', expense)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </div>

          <!-- 支出日 -->
          <div class="col-3 col-md-2">
            <span class="small text-secondary">
              {{ expense.transactionDate }}
            </span>
          </div>

          <!-- 支出内容 -->
          <div
            :class="
              title === '変動費一覧' ? 'col-5 col-md-6' : 'col-5 col-md-6'
            "
          >
            <div class="fw-semibold small">
              {{ expense.name }}
            </div>

            <div class="text-secondary" style="font-size: 0.75rem">
              {{ expense.categoryName }}
              /
              {{ expense.paymentMethodName }}
            </div>
          </div>

          <!-- 金額 -->
          <div
            :class="
              title === '変動費一覧' ? 'col-3 text-end' : 'col-4 text-end'
            "
          >
            <span class="fw-bold">
              {{ formatAmount(expense.amount) }}
            </span>
          </div>
        </div>

        <!-- データがない場合 -->
        <div
          v-if="expenses.length === 0"
          class="text-center text-secondary small py-3"
        >
          支出データはありません。
        </div>
      </div>
    </div>
  </section>
</template>
