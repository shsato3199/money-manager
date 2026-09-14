<script setup>
// 現在日時を取得する。
const now = new Date();
// 現在の年をリアクティブな値として保持する。
const year = ref(now.getFullYear());
// 現在の月をリアクティブな値として保持する。
// getMonth() は 0 始まりなので +1 する。
const month = ref(now.getMonth() + 1);

// 画面表示用の「YYYY年MM月」を作る。
const displayYearMonth = computed(() => {
  return `${year.value}年${String(month.value).padStart(2, "0")}月`;
});

// 月を移動する共通処理。
// 前月なら -1、翌月なら 1 を渡す。
const moveMonth = (offset) => {
  // Date が年またぎ・月またぎを自動で補正してくれる。
  const targetDate = new Date(year.value, month.value - 1 + offset, 1);
  // 補正後の年をセットする。
  year.value = targetDate.getFullYear();
  // getMonth() は 0 始まりなので +1 する。
  month.value = targetDate.getMonth() + 1;
};
// 前月へ移動する。
const movePreviousMonth = () => moveMonth(-1);
// 翌月へ移動する。
const moveNextMonth = () => moveMonth(1);

// 月間集計の仮データ。
// API実装後は月間集計APIから取得した値に置き換える。
const fixedExpenseTotal = ref(152000);
const variableExpenseTotal = ref(83400);
// 固定費と変動費の合計を総支出として計算する。
const totalExpense = computed(() => {
  return fixedExpenseTotal.value + variableExpenseTotal.value;
});
//カテゴリ別集計の仮データ
const categorySummaryList = ref([
  { name: "食費", amount: 83400 },
  { name: "交通費", amount: 12000 },
  { name: "趣味", amount: 25000 },
]);
//支払元別集計の仮データ
const paymentSummaryList = ref([
  { name: "楽天カード", amount: 102000 },
  { name: "かんぽ", amount: 83400 },
]);
</script>

<template>
  <section class="container py-1">
    <div class="border bg-white px-1 py-1">
      <div class="row align-items-center">
        <!-- 前月 -->
        <div class="col-3 text-start">
          <button
            type="button"
            class="btn btn-link btn-sm text-dark text-decoration-none p-0 text-nowrap"
            aria-label="前月"
            title="前月"
            @click="movePreviousMonth"
          >
            <i class="bi bi-caret-left-fill"></i>
            <span class="fw-bold">前月</span>
          </button>
        </div>

        <!-- 対象年月 -->
        <div class="col-6 text-center">
          <span class="fw-bold">
            {{ displayYearMonth }}
          </span>
        </div>

        <!-- 翌月 -->
        <div class="col-3 text-end">
          <button
            type="button"
            class="btn btn-link btn-sm text-dark text-decoration-none p-0 text-nowrap"
            aria-label="翌月"
            title="翌月"
            @click="moveNextMonth"
          >
            <span class="fw-bold">翌月</span>
            <i class="bi bi-caret-right-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
  <!-- 月間支出サマリー -->
  <MonthlySummaryCard
    :fixed-expense-total="fixedExpenseTotal"
    :variable-expense-total="variableExpenseTotal"
  />
  <!-- カテゴリ別集計サマリー -->
  <CategorySummaryTable
    :categories="categorySummaryList"
    :total-expense="totalExpense"
  />
  <!-- 支払元別集計サマリー -->
  <PaymentSummaryTable
    :payment-methods="paymentSummaryList"
    :total-expense="totalExpense"
  />
</template>
