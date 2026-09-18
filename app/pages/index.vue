<script setup>
// ========================
// ① 状態
// ========================

// 現在日時を取得する。
const now = new Date();

// 現在の年をリアクティブな値として保持する。
const year = ref(now.getFullYear());

// 現在の月をリアクティブな値として保持する。
// getMonth() は 0 始まりなので +1 する。
const month = ref(now.getMonth() + 1);

// 月間集計の仮データ。
// API実装後は月間集計APIから取得した値に置き換える。
const fixedExpenseTotal = ref(152000);
const variableExpenseTotal = ref(83400);

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

// 固定費支出一覧の仮データ。
const fixedExpenseList = ref([
  {
    id: 1,
    transactionDate: "2026-09-01",
    name: "家賃",
    categoryName: "住居費",
    paymentMethodName: "かんぽ",
    amount: 80000,
  },
  {
    id: 2,
    transactionDate: "2026-09-28",
    name: "Netflix",
    categoryName: "サブスクリプション",
    paymentMethodName: "楽天カード",
    amount: 990,
  },
  {
    id: 3,
    transactionDate: "2026-09-01",
    name: "駐車場代",
    categoryName: "住居費",
    paymentMethodName: "かんぽ",
    amount: 80000,
  },
  {
    id: 4,
    transactionDate: "2026-09-28",
    name: "Spotify",
    categoryName: "サブスクリプション",
    paymentMethodName: "楽天カード",
    amount: 990,
  },
  {
    id: 5,
    transactionDate: "2026-09-01",
    name: "Amazonプライム",
    categoryName: "住居費",
    paymentMethodName: "かんぽ",
    amount: 80000,
  },
  {
    id: 6,
    transactionDate: "2026-09-28",
    name: "保険代",
    categoryName: "サブスクリプション",
    paymentMethodName: "楽天カード",
    amount: 990,
  },
]);

// 変動費支出一覧の仮データ。
// API実装後は支出一覧APIから取得した値に置き換える。
const variableExpenseList = ref([
  {
    id: 7,
    transactionDate: "2026-09-05",
    name: "スーパー",
    categoryId: 1,
    categoryName: "食費",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    amount: 5400,
    shopName: "スーパー",
    memo: "",
  },
  {
    id: 8,
    transactionDate: "2026-09-10",
    name: "電車",
    categoryId: 3,
    categoryName: "交通費",
    paymentMethodId: 1,
    paymentMethodName: "現金",
    amount: 1200,
    shopName: "",
    memo: "",
  },
  {
    id: 9,
    transactionDate: "2026-09-12",
    name: "業務スーパー",
    categoryId: 1,
    categoryName: "食費",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    amount: 5400,
    shopName: "業務スーパー",
    memo: "",
  },
  {
    id: 10,
    transactionDate: "2026-09-13",
    name: "バス",
    categoryId: 3,
    categoryName: "交通費",
    paymentMethodId: 1,
    paymentMethodName: "現金",
    amount: 1200,
    shopName: "",
    memo: "",
  },
  {
    id: 11,
    transactionDate: "2026-09-15",
    name: "映画",
    categoryId: 4,
    categoryName: "趣味",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    amount: 2500,
    shopName: "",
    memo: "",
  },
  {
    id: 12,
    transactionDate: "2026-09-20",
    name: "スーパー",
    categoryId: 1,
    categoryName: "食費",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    amount: 5400,
    shopName: "スーパー",
    memo: "",
  },
  {
    id: 13,
    transactionDate: "2026-09-25",
    name: "バス",
    categoryId: 3,
    categoryName: "交通費",
    paymentMethodId: 1,
    paymentMethodName: "現金",
    amount: 1200,
    shopName: "",
    memo: "",
  },
]);

// 固定費・変動費のどちらを開いているか管理する。
// null     : 両方閉じる
// FIXED    : 固定費を開く
// VARIABLE : 変動費を開く
const openedExpenseType = ref(null);

// 支出登録・編集モーダルの開閉状態。
const isExpenseModalOpen = ref(false);

// 編集中の変動費。
// 新規登録時はnull。
const editingVariableExpense = ref(null);
// ========================
// ② computed
// ========================

// 画面表示用の「YYYY年MM月」を作る。
const displayYearMonth = computed(() => {
  return `${year.value}年${String(month.value).padStart(2, "0")}月`;
});

// 固定費と変動費の合計を総支出として計算する。
const totalExpense = computed(() => {
  return fixedExpenseTotal.value + variableExpenseTotal.value;
});

// ========================
// ③ 関数
// ========================

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

  // 現在は仮データなので、
  // カテゴリ名・支払元名はIDから取得する。
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
