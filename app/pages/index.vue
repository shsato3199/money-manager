<script setup>
import { fetchCurrentDate } from "../api/dateApi";
import { fetchMonthlySummary } from "../api/summaryApi";
import { fetchExpenses } from "../api/expenseApi";
import { fetchFixedExpenses } from "../api/fixedExpenseApi";

// ========================
// ① 状態
// ========================
// 画面に表示する対象年・月を保持する。
// 初期表示時は現在日付取得APIから取得した年・月を設定する。
const year = ref(null);
const month = ref(null);

// 月間集計APIから取得した固定費合計・変動費合計・総支出を保持する。
const fixedExpenseTotal = ref(0);
const variableExpenseTotal = ref(0);
const totalExpense = ref(0);

// カテゴリ別集計の仮データ。
const categorySummaryList = ref([
  { name: "食費", amount: 83400 },
  { name: "交通費", amount: 12000 },
  { name: "趣味", amount: 25000 },
]);

// 支払元別集計の仮データ。
const paymentSummaryList = ref([
  { name: "楽天カード", amount: 102000 },
  { name: "かんぽ", amount: 83400 },
]);

// 固定費支出一覧。
// 固定費一覧APIから取得したデータを保持する。
const fixedExpenseList = ref([]);

// 変動費支出一覧。
// 支出一覧APIから取得したデータを保持する。
const variableExpenseList = ref([]);

// 固定費・変動費のどちらを開いているか管理する。
// null     : 両方閉じる
// FIXED    : 固定費を開く
// VARIABLE : 変動費を開く
const openedExpenseType = ref(null);

// 支出登録・編集モーダルの開閉状態。
const isExpenseModalOpen = ref(false);

// 編集中の変動費。
// 新規登録時は null。
const editingVariableExpense = ref(null);

// ========================
// ② computed
// ========================

// 画面表示用の「YYYY年MM月」を作る。
const displayYearMonth = computed(() => {
  return `${year.value}年${String(month.value).padStart(2, "0")}月`;
});

// ========================
// ③ API通信
// ========================

// 現在日付を取得し、画面の初期表示年月を設定する。
const fetchCurrentDateData = async () => {
  try {
    const currentDate = await fetchCurrentDate();

    year.value = currentDate.year;
    month.value = currentDate.month;
  } catch (error) {
    console.error("現在日付の取得に失敗しました。", error);
  }
};

// 指定年月の固定費合計・変動費合計・総支出を取得する。
const fetchMonthlySummaryData = async () => {
  try {
    const monthlySummary = await fetchMonthlySummary(year.value, month.value);

    fixedExpenseTotal.value = monthlySummary.fixedExpenseTotal;
    variableExpenseTotal.value = monthlySummary.variableExpenseTotal;
    totalExpense.value = monthlySummary.totalExpense;
  } catch (error) {
    console.error("月間支出集計の取得に失敗しました。", error);
  }
};

// 固定費支出一覧を取得する。
const fetchFixedExpenseList = async () => {
  try {
    fixedExpenseList.value = await fetchFixedExpenses(year.value, month.value);
  } catch (error) {
    console.error("固定費支出一覧の取得に失敗しました。", error);
  }
};

// 変動費支出一覧を取得する。
const fetchVariableExpenses = async () => {
  try {
    variableExpenseList.value = await fetchExpenses(year.value, month.value);
  } catch (error) {
    console.error("変動費支出一覧の取得に失敗しました。", error);
  }
};

// ========================
// ④ 画面操作
// ========================

// 月を移動する共通処理。
// 前月なら -1、翌月なら 1 を渡す。
const moveMonth = (offset) => {
  // Date が年またぎ・月またぎを自動で補正してくれる。
  const targetDate = new Date(year.value, month.value - 1 + offset, 1);

  // 補正後の年・月をセットする。
  year.value = targetDate.getFullYear();
  month.value = targetDate.getMonth() + 1;

  // 移動後の年月を条件に月間支出集計を再取得する。
  fetchMonthlySummaryData();

  // 移動後の年月を条件に固定費・変動費一覧を再取得する。
  fetchFixedExpenseList();
  fetchVariableExpenses();
};

// 前月へ移動する。
const movePreviousMonth = () => moveMonth(-1);

// 翌月へ移動する。
const moveNextMonth = () => moveMonth(1);

// 支出一覧の開閉を切り替える。
const toggleExpenseList = (expenseType) => {
  // すでに開いている一覧を押した場合は閉じる。
  if (openedExpenseType.value === expenseType) {
    openedExpenseType.value = null;
    return;
  }

  // 別の一覧を押した場合は、そちらを開く。
  openedExpenseType.value = expenseType;
};

// 変動費編集モーダルを開く。
const openVariableExpenseEditModal = (expense) => {
  editingVariableExpense.value = {
    ...expense,
  };

  isExpenseModalOpen.value = true;
};

// 支出登録・編集モーダルを閉じる。
const closeExpenseModal = () => {
  isExpenseModalOpen.value = false;
  editingVariableExpense.value = null;
};

// 変動費の編集内容を一覧へ反映する。
const updateVariableExpense = (updatedExpense) => {
  const targetIndex = variableExpenseList.value.findIndex(
    (item) => item.id === updatedExpense.id,
  );

  if (targetIndex === -1) {
    return;
  }

  // 現在は仮データなので、カテゴリ名・支払元名はIDから取得する。
  const categoryList = [
    { id: 1, name: "食費" },
    { id: 2, name: "日用品" },
    { id: 3, name: "交通費" },
    { id: 4, name: "趣味" },
  ];

  const paymentMethodList = [
    { id: 1, name: "現金" },
    { id: 2, name: "楽天カード" },
    { id: 3, name: "かんぽ" },
  ];

  const category = categoryList.find(
    (item) => item.id === updatedExpense.categoryId,
  );

  const paymentMethod = paymentMethodList.find(
    (item) => item.id === updatedExpense.paymentMethodId,
  );

  variableExpenseList.value[targetIndex] = {
    ...updatedExpense,
    categoryName: category?.name ?? "",
    paymentMethodName: paymentMethod?.name ?? "",
  };

  closeExpenseModal();
};

// ========================
// ⑤ ライフサイクル
// ========================
//初期表示時
onMounted(async () => {
  // 現在日付を取得して表示対象年月を設定する。
  await fetchCurrentDateData();
  // 画面表示時に月間支出集計を取得する。
  fetchMonthlySummaryData();
  // 画面表示時に固定費支出一覧を取得する。
  fetchFixedExpenseList();
  // 画面表示時に変動費支出一覧を取得する。
  fetchVariableExpenses();
});
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
  <HomeMonthlySummaryCard
    :fixed-expense-total="fixedExpenseTotal"
    :variable-expense-total="variableExpenseTotal"
    :total-expense="totalExpense"
  />
  <!-- カテゴリ別集計サマリー -->
  <HomeCategorySummaryTable
    :categories="categorySummaryList"
    :total-expense="totalExpense"
  />
  <!-- 支払元別集計サマリー -->
  <HomePaymentSummaryTable
    :payment-methods="paymentSummaryList"
    :total-expense="totalExpense"
  />
  <!-- 固定費一覧 -->
  <HomeExpenseTable
    title="固定費一覧"
    :expenses="fixedExpenseList"
    :is-open="openedExpenseType === 'FIXED'"
    @toggle="toggleExpenseList('FIXED')"
  />

  <!-- 変動費一覧 -->
  <HomeExpenseTable
    title="変動費一覧"
    :expenses="variableExpenseList"
    :is-open="openedExpenseType === 'VARIABLE'"
    @toggle="toggleExpenseList('VARIABLE')"
    @edit="openVariableExpenseEditModal"
  />

  <!-- 変動費登録・編集モーダル -->
  <HomeExpenseEntryModal
    :is-open="isExpenseModalOpen"
    :expense="editingVariableExpense"
    @close="closeExpenseModal"
    @update="updateVariableExpense"
  />
</template>
