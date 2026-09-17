<script setup>
// ========================
// ① 状態
// ========================

// 固定費設定一覧の仮データ。
// API実装後は固定費設定一覧APIから取得する。
const fixedExpenseList = ref([
  {
    id: 1,
    fixedExpenseName: "家賃",
    amount: 80000,
    categoryId: 1,
    categoryName: "住居費",
    paymentMethodId: 3,
    paymentMethodName: "横浜銀行",
    paymentDay: 27,
    startYearMonth: "2026-01",
    endYearMonth: "",
    autoGenerate: true,
    memo: "○○マンション",
    displayOrder: 1,
  },
  {
    id: 2,
    fixedExpenseName: "Netflix",
    amount: 990,
    categoryId: 2,
    categoryName: "サブスクリプション",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    paymentDay: 28,
    startYearMonth: "2026-08",
    endYearMonth: "",
    autoGenerate: true,
    memo: "",
    displayOrder: 2,
  },
  {
    id: 3,
    fixedExpenseName: "駐車場代",
    amount: 12000,
    categoryId: 1,
    categoryName: "住居費",
    paymentMethodId: 3,
    paymentMethodName: "横浜銀行",
    paymentDay: 27,
    startYearMonth: "2026-01",
    endYearMonth: "",
    autoGenerate: true,
    memo: "月極駐車場",
    displayOrder: 3,
  },
]);

// 編集モーダル
const isEditModalOpen = ref(false);
const editingFixedExpense = ref(null);

// 仮カテゴリ一覧。
const categoryList = [
  { id: 1, name: "住居費" },
  { id: 2, name: "サブスクリプション" },
  { id: 3, name: "通信費" },
  { id: 4, name: "保険" },
];

// 仮支払元一覧。
const paymentMethodList = [
  { id: 1, name: "現金" },
  { id: 2, name: "楽天カード" },
  { id: 3, name: "横浜銀行" },
];
// ========================
// ② 関数
// ========================
const registerFixedExpense = (newFixedExpense) => {
  const nextId =
    fixedExpenseList.value.length === 0
      ? 1
      : Math.max(...fixedExpenseList.value.map((item) => item.id)) + 1;

  // 新規登録時は常に末尾へ追加。
  const newDisplayOrder = fixedExpenseList.value.length + 1;

  fixedExpenseList.value.push({
    id: nextId,
    ...newFixedExpense,
    displayOrder: newDisplayOrder,
  });

  sortFixedExpenseList();
};
// 表示順で並び替える。
const sortFixedExpenseList = () => {
  fixedExpenseList.value.sort((a, b) => a.displayOrder - b.displayOrder);
};

// 編集モーダルを開く。
const openEditModal = (fixedExpense) => {
  editingFixedExpense.value = {
    ...fixedExpense,
  };

  isEditModalOpen.value = true;
};

// 編集モーダルを閉じる。
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingFixedExpense.value = null;
};

// 編集内容を一覧へ反映する。
const updateFixedExpense = (updatedFixedExpense) => {
  const targetIndex = fixedExpenseList.value.findIndex(
    (item) => item.id === updatedFixedExpense.id,
  );

  if (targetIndex === -1) {
    return;
  }

  const oldDisplayOrder = fixedExpenseList.value[targetIndex].displayOrder;

  const newDisplayOrder = updatedFixedExpense.displayOrder;

  // 後ろへ移動する場合。
  if (oldDisplayOrder < newDisplayOrder) {
    fixedExpenseList.value.forEach((item) => {
      if (
        item.id !== updatedFixedExpense.id &&
        item.displayOrder > oldDisplayOrder &&
        item.displayOrder <= newDisplayOrder
      ) {
        item.displayOrder -= 1;
      }
    });
  }

  // 前へ移動する場合。
  if (oldDisplayOrder > newDisplayOrder) {
    fixedExpenseList.value.forEach((item) => {
      if (
        item.id !== updatedFixedExpense.id &&
        item.displayOrder >= newDisplayOrder &&
        item.displayOrder < oldDisplayOrder
      ) {
        item.displayOrder += 1;
      }
    });
  }

  // カテゴリ名を取得。
  const category = categoryList.find(
    (item) => item.id === updatedFixedExpense.categoryId,
  );

  // 支払元名を取得。
  const paymentMethod = paymentMethodList.find(
    (item) => item.id === updatedFixedExpense.paymentMethodId,
  );

  fixedExpenseList.value[targetIndex] = {
    ...updatedFixedExpense,
    categoryName: category?.name ?? "",
    paymentMethodName: paymentMethod?.name ?? "",
  };

  sortFixedExpenseList();

  closeEditModal();
};

// 固定費設定を削除する。
const deleteFixedExpense = (fixedExpenseId) => {
  // 固定費は最低1件残す。
  if (fixedExpenseList.value.length <= 1) {
    return;
  }

  const targetIndex = fixedExpenseList.value.findIndex(
    (item) => item.id === fixedExpenseId,
  );

  if (targetIndex === -1) {
    return;
  }

  const deletedDisplayOrder = fixedExpenseList.value[targetIndex].displayOrder;

  // 仮実装なので配列から削除する。
  fixedExpenseList.value.splice(targetIndex, 1);

  // 削除した表示順より後ろを前へ詰める。
  fixedExpenseList.value.forEach((item) => {
    if (item.displayOrder > deletedDisplayOrder) {
      item.displayOrder -= 1;
    }
  });

  sortFixedExpenseList();

  closeEditModal();
};
</script>

<template>
  <main class="container py-4 pb-5 mb-5">
    <!-- 画面タイトル -->
    <div class="mb-4">
      <h1 class="h4 mb-1">固定費設定</h1>

      <p class="text-body-secondary mb-0">毎月発生する固定費を管理します。</p>
    </div>

    <!-- 固定費一覧 -->
    <FixedExpensesFixedExpenseSettingTable
      :fixed-expense-list="fixedExpenseList"
      @edit="openEditModal"
    />
    <!-- 固定費新規登録 -->
    <FixedExpensesFixedExpenseRegisterForm
      :category-list="categoryList"
      :payment-method-list="paymentMethodList"
      @register="registerFixedExpense"
    />
    <!-- 編集モーダル -->
    <FixedExpensesFixedExpenseSettingEditModal
      :is-open="isEditModalOpen"
      :fixed-expense="editingFixedExpense"
      :category-list="categoryList"
      :payment-method-list="paymentMethodList"
      :max-display-order="fixedExpenseList.length"
      @close="closeEditModal"
      @update="updateFixedExpense"
      @delete="deleteFixedExpense"
    />
  </main>
</template>
