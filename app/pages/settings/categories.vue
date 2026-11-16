<script setup>
// ========================
// ① import
// ========================
import {
  fetchCategories,
  createCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "~/api/categoryApi";

// ========================
// ② 状態
// ========================

// カテゴリ一覧
const categoryList = ref([]);
// 登録エラーメッセージ
const registerErrorMessage = ref("");
// 登録成功メッセージ
const registerSuccessMessage = ref("");
// 一覧取得エラーメッセージ
const listErrorMessage = ref("");
// 編集・削除エラーメッセージ
const editErrorMessage = ref("");
// 編集・削除成功メッセージ
const editSuccessMessage = ref("");
// 登録フォームの参照
const categoryRegisterFormRef = ref(null);
// 編集モーダル
const isEditModalOpen = ref(false);
const editingCategory = ref(null);

// ========================
// ③ 関数
// ========================

// 表示順で並び替える
const sortCategoryList = () => {
  categoryList.value.sort((a, b) => a.displayOrder - b.displayOrder);
};

// カテゴリ一覧取得
const fetchCategoryList = async () => {
  // 一覧取得エラーメッセージを初期化する。
  listErrorMessage.value = "";
  try {
    // カテゴリ一覧取得API
    categoryList.value = await fetchCategories();
  } catch (error) {
    console.error("カテゴリ一覧の取得に失敗しました。", error);

    // 一覧取得失敗時のエラーメッセージを設定する。
    listErrorMessage.value =
      "カテゴリ一覧の取得に失敗しました。再読み込みしてください。";
  }
};

// カテゴリ登録
const registerCategory = async (newCategory) => {
  // 登録結果のメッセージを初期化する。
  registerErrorMessage.value = "";
  registerSuccessMessage.value = "";

  // ========================
  // カテゴリ登録
  // ========================
  try {
    // カテゴリ登録API
    await createCategory(newCategory);
  } catch (error) {
    console.error("カテゴリ登録に失敗しました。", error);
    // カテゴリ名が重複している場合。
    if (error.response?.status === 409) {
      registerErrorMessage.value = "同じ名前のカテゴリが既に登録されています。";
    } else {
      registerErrorMessage.value = "カテゴリの登録に失敗しました。";
    }
    // 登録に失敗した場合は、以降の処理を実行しない。
    return;
  }
  // ========================
  // 登録成功後の処理
  // ========================
  // 登録成功後にフォームを初期化する。
  categoryRegisterFormRef.value?.handleRegisterSuccess();
  // 登録成功メッセージを表示する。
  registerSuccessMessage.value = "登録しました";
  // カテゴリ一覧を再取得する。
  // 一覧取得に失敗した場合はfetchCategoryList()内でエラーを処理する。
  await fetchCategoryList();
};

// 編集モーダルを開く
const openEditModal = (category) => {
  editingCategory.value = {
    ...category,
  };

  isEditModalOpen.value = true;
};

// 編集モーダルを閉じる
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingCategory.value = null;
};

// カテゴリ更新
const updateCategory = async (updatedCategory) => {
  // メッセージを初期化する。
  editErrorMessage.value = "";
  editSuccessMessage.value = "";

  try {
    // カテゴリ更新API
    await updateCategoryApi(updatedCategory.id, {
      name: updatedCategory.name,
      displayOrder: updatedCategory.displayOrder,
    });

    // 更新成功後に編集モーダルを閉じる。
    closeEditModal();

    // 更新成功メッセージを表示する。
    editSuccessMessage.value = "更新しました";

    // カテゴリ一覧を再取得する。
    await fetchCategoryList();
  } catch (error) {
    console.error("カテゴリの更新に失敗しました。", error);

    // カテゴリ名が重複している場合。
    if (error.response?.status === 409) {
      editErrorMessage.value = "同じ名前のカテゴリが既に登録されています。";
    } else {
      editErrorMessage.value = "カテゴリの更新に失敗しました。";
    }
  }
};

// カテゴリ論理削除
const deleteCategory = async (categoryId) => {
  // メッセージを初期化する。
  editErrorMessage.value = "";
  editSuccessMessage.value = "";

  // カテゴリは最低1件残す。
  if (categoryList.value.length <= 1) {
    editErrorMessage.value = "カテゴリをすべて削除することはできません。";
    return;
  }

  try {
    // カテゴリ削除API
    await deleteCategoryApi(categoryId);

    // 削除成功後に編集モーダルを閉じる。
    closeEditModal();

    // 削除成功メッセージを表示する。
    editSuccessMessage.value = "削除しました";

    // カテゴリ一覧を再取得する。
    await fetchCategoryList();
  } catch (error) {
    console.error("カテゴリの削除に失敗しました。", error);

    editErrorMessage.value = "カテゴリの削除に失敗しました。";
  }
};

onMounted(async () => {
  await fetchCategoryList();
});
</script>

<template>
  <main class="container py-4 pb-5 mb-5">
    <!-- タイトル -->
    <div class="mb-4">
      <h1 class="h4 mb-1">カテゴリ管理</h1>

      <p class="text-body-secondary mb-0">
        支出登録時に使用するカテゴリを管理します。
      </p>
    </div>
    <!-- カテゴリ一覧取得エラー -->
    <div v-if="listErrorMessage" class="alert alert-danger" role="alert">
      {{ listErrorMessage }}
    </div>

    <!-- カテゴリ登録エラー -->
    <div v-if="registerErrorMessage" class="alert alert-danger" role="alert">
      {{ registerErrorMessage }}
    </div>

    <!-- カテゴリ登録成功 -->
    <div
      v-if="registerSuccessMessage"
      class="alert alert-success"
      role="status"
    >
      {{ registerSuccessMessage }}
    </div>

    <!-- 編集・削除エラーメッセージ -->
    <div v-if="editErrorMessage" class="alert alert-danger" role="alert">
      {{ editErrorMessage }}
    </div>

    <!-- 編集・削除成功メッセージ -->
    <div v-if="editSuccessMessage" class="alert alert-success" role="status">
      {{ editSuccessMessage }}
    </div>

    <!-- 登録済みカテゴリ -->
    <CategoriesCategorySettingTable
      :category-list="categoryList"
      @edit="openEditModal"
    />

    <!-- カテゴリ登録 -->
    <CategoriesCategoryRegisterForm
      ref="categoryRegisterFormRef"
      @register="registerCategory"
    />

    <!-- 編集モーダル -->
    <CategoriesCategoryEditModal
      :is-open="isEditModalOpen"
      :category="editingCategory"
      :max-display-order="categoryList.length"
      @close="closeEditModal"
      @update="updateCategory"
      @delete="deleteCategory"
    />
  </main>
</template>
