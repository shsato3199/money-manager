<script setup>
// ========================
// ① import
// ========================

import { fetchCategories } from "~/api/categoryApi";
import {
  createFixedExpense,
  fetchFixedExpenseTemplates,
  updateFixedExpense as updateFixedExpenseApi,
  deleteFixedExpense as deleteFixedExpenseApi,
} from "~/api/fixedExpenseApi";
import { fetchPaymentMethods } from "~/api/paymentMethodApi";

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
// 固定費設定更新・削除エラーメッセージ。
const editErrorMessage = ref("");
// 固定費設定更新・削除成功メッセージ。
const editSuccessMessage = ref("");

// 編集モーダル
const isEditModalOpen = ref(false);
const editingFixedExpense = ref(null);

// DBから取得したカテゴリ一覧。
const categoryList = ref([]);
// カテゴリ一覧取得エラーメッセージ。
const categoryListErrorMessage = ref("");

// 支払元一覧。
const paymentMethodList = ref([]);

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
    return true;
  } catch (error) {
    console.error("固定費設定一覧の取得に失敗しました。", error);

    fixedExpenseListErrorMessage.value =
      "固定費設定一覧の取得に失敗しました。再読み込みしてください。";
    return false;
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

// 支払元一覧取得。
const fetchPaymentMethodList = async () => {
  try {
    // 支払元一覧取得API。
    paymentMethodList.value = await fetchPaymentMethods();
  } catch (error) {
    console.error("支払元一覧の取得に失敗しました。", error);

    paymentMethodList.value = [];
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

// 編集モーダルを開く。
const openEditModal = (fixedExpense) => {
  // 更新・削除結果メッセージを初期化する。
  editErrorMessage.value = "";
  editSuccessMessage.value = "";

  editingFixedExpense.value = {
    ...fixedExpense,
  };

  isEditModalOpen.value = true;
};

// 編集モーダルを閉じる。
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingFixedExpense.value = null;
  // 更新・削除エラーメッセージを初期化する。
  editErrorMessage.value = "";
};

// 固定費設定を更新する。
const updateFixedExpense = async (updatedFixedExpense) => {
  // 更新結果メッセージを初期化する。
  editErrorMessage.value = "";
  editSuccessMessage.value = "";

  // IDを除いたデータをAPIへ送信する。
  const { id, ...requestBody } = updatedFixedExpense;

  try {
    // 固定費設定更新APIを呼び出す。
    await updateFixedExpenseApi(id, requestBody);
  } catch (error) {
    console.error("固定費設定の更新に失敗しました。", error);

    editErrorMessage.value =
      "固定費設定の更新に失敗しました。入力内容をご確認ください。";
    return;
  }

  // 編集モーダルを閉じる。
  closeEditModal();

  // 更新成功メッセージを表示する。
  editSuccessMessage.value = "固定費設定を更新しました。";

  // 更新後の固定費設定一覧を再取得する。
  await fetchFixedExpenseSettingList();
};

// 固定費設定を論理削除する。
const deleteFixedExpense = async (fixedExpenseId) => {
  // 削除結果メッセージを初期化する。
  editErrorMessage.value = "";
  editSuccessMessage.value = "";

  try {
    // 固定費設定削除APIを呼び出す。
    await deleteFixedExpenseApi(fixedExpenseId);
  } catch (error) {
    console.error("固定費設定の削除に失敗しました。", error);

    editErrorMessage.value = "固定費設定の削除に失敗しました。";
    return;
  }

  // 編集モーダルを閉じる。
  closeEditModal();

  // 削除成功メッセージを表示する。
  editSuccessMessage.value = "固定費設定を削除しました。";

  // 削除後の固定費設定一覧を再取得する。
  await fetchFixedExpenseSettingList();
};
// ========================
// ⑤ ライフサイクル
// ========================

// 画面初期表示時にカテゴリ一覧・固定費設定一覧を取得する。
onMounted(async () => {
  await Promise.all([
    fetchCategoryList(),
    fetchFixedExpenseSettingList(),
    fetchPaymentMethodList(),
  ]);
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
    <!-- 固定費設定更新・削除成功メッセージ -->
    <div
      v-if="editSuccessMessage"
      class="alert alert-success mt-3"
      role="alert"
    >
      {{ editSuccessMessage }}
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
      :api-error-message="editErrorMessage"
      @close="closeEditModal"
      @update="updateFixedExpense"
      @delete="deleteFixedExpense"
    />
  </main>
</template>
