<script setup>
// ========================
// ① import
// ========================

import { fetchCategories } from "~/api/categoryApi";
import {
  createFixedExpense,
  fetchFixedExpenseTemplates,
} from "~/api/fixedExpenseApi";

// ========================
// ② 状態
// ========================

// DBから取得した固定費設定一覧。
const fixedExpenseList = ref([]);
// 固定費設定一覧取得エラーメッセージ。
const fixedExpenseListErrorMessage = ref("");
// 登録済み固定費一覧のコンポーネント参照。
const fixedExpenseSettingTableRef = ref(null);
// 固定費登録エラーメッセージ。
const registerErrorMessage = ref("");
// 固定費登録成功メッセージ。
const registerSuccessMessage = ref("");

// 編集モーダル
const isEditModalOpen = ref(false);
const editingFixedExpense = ref(null);

// DBから取得したカテゴリ一覧。
const categoryList = ref([]);
// カテゴリ一覧取得エラーメッセージ。
const categoryListErrorMessage = ref("");

// 仮支払元一覧。
const paymentMethodList = [
  { id: 1, name: "現金" },
  { id: 2, name: "楽天カード" },
  { id: 3, name: "横浜銀行" },
];

// ========================
// ③ API通信
// ========================
// 固定費設定一覧取得。
const fetchFixedExpenseSettingList = async () => {
  // 一覧取得エラーメッセージを初期化する。
  fixedExpenseListErrorMessage.value = "";

  try {
    // 固定費設定一覧取得API。
    const fixedExpenseTemplates = await fetchFixedExpenseTemplates();

    // DBには表示順がないため、取得順に仮の表示順を設定する。
    fixedExpenseList.value = fixedExpenseTemplates.map(
      (fixedExpense, index) => ({
        ...fixedExpense,
        displayOrder: index + 1,
      }),
    );
  } catch (error) {
    console.error("固定費設定一覧の取得に失敗しました。", error);

    fixedExpenseListErrorMessage.value =
      "固定費設定一覧の取得に失敗しました。再読み込みしてください。";
  }
};

// カテゴリ一覧取得。
const fetchCategoryList = async () => {
  categoryListErrorMessage.value = "";

  try {
    categoryList.value = await fetchCategories();
  } catch (error) {
    console.error("カテゴリ一覧の取得に失敗しました。", error);

    categoryList.value = [];
    categoryListErrorMessage.value =
      "カテゴリ一覧の取得に失敗しました。再読み込みしてください。";
  }
};

// ========================
// ④ 関数
// ========================
// 固定費を登録する。
const registerFixedExpense = async (newFixedExpense) => {
  // 登録結果メッセージを初期化する。
  registerErrorMessage.value = "";
  registerSuccessMessage.value = "";

  try {
    // 固定費登録API。
    await createFixedExpense(newFixedExpense);
  } catch (error) {
    console.error("固定費登録に失敗しました。", error);

    registerErrorMessage.value = "固定費の登録に失敗しました。";
    return;
  }
  // 登録成功メッセージを表示する。
  registerSuccessMessage.value = "登録しました";
  // 登録済み固定費のアコーディオンを閉じる。
  fixedExpenseSettingTableRef.value?.closeAccordion();

  // 固定費設定一覧を再取得する。
  await fetchFixedExpenseSettingList();

  // 登録完了後、画面上部へスクロールする。
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
// ========================
// ⑤ ライフサイクル
// ========================

// 画面初期表示時にカテゴリ一覧・固定費設定一覧を取得する。
onMounted(async () => {
  await Promise.all([fetchCategoryList(), fetchFixedExpenseSettingList()]);
});
</script>

<template>
  <main class="container py-4 pb-5 mb-5">
    <!-- 固定費登録成功メッセージ -->
    <div
      v-if="registerSuccessMessage"
      class="alert alert-success mt-3"
      role="alert"
    >
      {{ registerSuccessMessage }}
    </div>
    <!-- 画面タイトル -->
    <div class="mb-4">
      <h1 class="h4 mb-1">固定費設定</h1>

      <p class="text-body-secondary mb-0">毎月発生する固定費を管理します。</p>
    </div>
    <!-- 固定費終了時の注意書き -->
    <div class="alert alert-info mb-1" role="alert">
      固定費が発生しなくなった場合は、編集画面から終了年月を登録してください。
    </div>
    <!-- 固定費一覧 -->
    <FixedExpensesFixedExpenseSettingTable
      ref="fixedExpenseSettingTableRef"
      :fixed-expense-list="fixedExpenseList"
      @edit="openEditModal"
    />
    <!-- 固定費設定一覧取得エラー -->
    <div
      v-if="fixedExpenseListErrorMessage"
      class="alert alert-danger"
      role="alert"
    >
      {{ fixedExpenseListErrorMessage }}
    </div>
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
