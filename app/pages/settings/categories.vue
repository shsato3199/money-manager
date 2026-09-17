<script setup>
// ========================
// ① 状態
// ========================

// カテゴリ一覧
// 現在はAPI未接続なので仮データ
const categoryList = ref([
  {
    id: 1,
    name: "食費",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "日用品",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "交通費",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "趣味",
    displayOrder: 4,
  },
]);

// 編集モーダル
const isEditModalOpen = ref(false);
const editingCategory = ref(null);

// ========================
// ② 関数
// ========================

// 表示順で並び替える
const sortCategoryList = () => {
  categoryList.value.sort((a, b) => a.displayOrder - b.displayOrder);
};

// カテゴリ登録
const registerCategory = (newCategory) => {
  // 仮IDを採番
  const nextId =
    categoryList.value.length === 0
      ? 1
      : Math.max(...categoryList.value.map((category) => category.id)) + 1;

  // 新規登録は常に一番下
  const newDisplayOrder = categoryList.value.length + 1;

  categoryList.value.push({
    id: nextId,
    name: newCategory.name,
    displayOrder: newDisplayOrder,
  });

  sortCategoryList();
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
const updateCategory = (updatedCategory) => {
  const targetIndex = categoryList.value.findIndex(
    (category) => category.id === updatedCategory.id,
  );

  if (targetIndex === -1) {
    return;
  }

  const oldDisplayOrder = categoryList.value[targetIndex].displayOrder;

  const newDisplayOrder = updatedCategory.displayOrder;

  // 表示順を後ろへ移動
  if (oldDisplayOrder < newDisplayOrder) {
    categoryList.value.forEach((category) => {
      if (
        category.id !== updatedCategory.id &&
        category.displayOrder > oldDisplayOrder &&
        category.displayOrder <= newDisplayOrder
      ) {
        category.displayOrder -= 1;
      }
    });
  }

  // 表示順を前へ移動
  if (oldDisplayOrder > newDisplayOrder) {
    categoryList.value.forEach((category) => {
      if (
        category.id !== updatedCategory.id &&
        category.displayOrder >= newDisplayOrder &&
        category.displayOrder < oldDisplayOrder
      ) {
        category.displayOrder += 1;
      }
    });
  }

  categoryList.value[targetIndex] = {
    ...updatedCategory,
  };
  sortCategoryList();
  closeEditModal();
};

// カテゴリ削除
const deleteCategory = (categoryId) => {
  // カテゴリは最低1件残す
  if (categoryList.value.length <= 1) {
    return;
  }
  const targetIndex = categoryList.value.findIndex(
    (category) => category.id === categoryId,
  );
  if (targetIndex === -1) {
    return;
  }

  const deletedDisplayOrder = categoryList.value[targetIndex].displayOrder;
  // 今はAPI未接続なので配列から削除
  categoryList.value.splice(targetIndex, 1);
  // 削除したカテゴリより後ろを1つずつ繰り上げる
  categoryList.value.forEach((category) => {
    if (category.displayOrder > deletedDisplayOrder) {
      category.displayOrder -= 1;
    }
  });
  sortCategoryList();
  closeEditModal();
};
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

    <!-- 登録済みカテゴリ -->
    <CategorySettingTable :category-list="categoryList" @edit="openEditModal" />

    <!-- カテゴリ登録 -->
    <CategoryRegisterForm @register="registerCategory" />

    <!-- 編集モーダル -->
    <CategoryEditModal
      :is-open="isEditModalOpen"
      :category="editingCategory"
      :max-display-order="categoryList.length"
      @close="closeEditModal"
      @update="updateCategory"
      @delete="deleteCategory"
    />
  </main>
</template>
