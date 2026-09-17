<script setup>
import { REQUIRED_MESSAGE, isRequired } from "~/utils/validation";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },

  category: {
    type: Object,
    default: null,
  },

  maxDisplayOrder: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "update", "delete"]);

// ========================
// ① 状態
// ========================

const categoryName = ref("");
const displayOrder = ref("");
const deleteErrorMessage = ref("");
const confirmationType = ref(null);

const errors = ref({
  categoryName: "",
  displayOrder: "",
});

// ========================
// ② watch
// ========================

watch(
  () => props.category,
  (category) => {
    if (!category) {
      return;
    }

    categoryName.value = category.name;
    displayOrder.value = category.displayOrder;

    errors.value = {
      categoryName: "",
      displayOrder: "",
    };
  },
  {
    immediate: true,
  },
);

watch(categoryName, () => {
  errors.value.categoryName = "";
});

watch(displayOrder, () => {
  errors.value.displayOrder = "";
});

// ========================
// ③ 関数
// ========================

const isValidDisplayOrder = (value) => {
  const order = Number(value);

  return (
    Number.isInteger(order) && order >= 1 && order <= props.maxDisplayOrder
  );
};

const validate = () => {
  errors.value = {
    categoryName: "",
    displayOrder: "",
  };

  let isValid = true;

  // カテゴリ名
  if (!isRequired(categoryName.value)) {
    errors.value.categoryName = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 表示順
  if (!isRequired(displayOrder.value)) {
    errors.value.displayOrder = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isValidDisplayOrder(displayOrder.value)) {
    errors.value.displayOrder = `表示順は1〜${props.maxDisplayOrder}の整数で入力してください。`;

    isValid = false;
  }

  return isValid;
};

// 編集モーダルを閉じる

const closeModal = () => {
  confirmationType.value = null;
  deleteErrorMessage.value = "";
  emit("close");
};

// 削除確認
const openDeleteConfirmation = () => {
  // 最後の1件は削除不可
  if (props.maxDisplayOrder <= 1) {
    deleteErrorMessage.value =
      "カテゴリをすべて削除することはできません。名称の変更は可能です。";
    return;
  }
  deleteErrorMessage.value = "";
  confirmationType.value = "DELETE";
};

// 削除確認を閉じる
const closeConfirmation = () => {
  confirmationType.value = null;
};

// 更新
const updateCategory = () => {
  if (!validate() || !props.category) {
    return;
  }

  emit("update", {
    id: props.category.id,
    name: categoryName.value.trim(),
    displayOrder: Number(displayOrder.value),
  });
};

// 削除
const deleteCategory = () => {
  if (!props.category) {
    return;
  }

  emit("delete", props.category.id);

  confirmationType.value = null;
};
</script>

<template>
  <Teleport to="body">
    <template v-if="isOpen">
      <!-- 編集モーダル -->
      <div
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header">
              <h5 class="modal-title">カテゴリ編集</h5>

              <button
                type="button"
                class="btn-close"
                aria-label="閉じる"
                @click="closeModal"
              ></button>
            </div>

            <div class="modal-body">
              <!-- カテゴリ名 -->
              <div class="mb-3">
                <label for="edit-category-name" class="form-label">
                  カテゴリ名
                  <span class="text-danger">*</span>
                </label>

                <input
                  id="edit-category-name"
                  v-model="categoryName"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.categoryName,
                  }"
                  maxlength="100"
                />

                <div v-if="errors.categoryName" class="invalid-feedback">
                  {{ errors.categoryName }}
                </div>
              </div>

              <!-- 表示順 -->
              <div class="mb-0">
                <label for="edit-category-display-order" class="form-label">
                  表示順
                  <span class="text-danger">*</span>
                </label>

                <input
                  id="edit-category-display-order"
                  v-model.number="displayOrder"
                  type="number"
                  min="1"
                  :max="maxDisplayOrder"
                  step="1"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.displayOrder,
                  }"
                />

                <div v-if="errors.displayOrder" class="invalid-feedback">
                  {{ errors.displayOrder }}
                </div>
              </div>
            </div>

            <!-- ボタン -->
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="openDeleteConfirmation"
              >
                削除
              </button>
              <div v-if="deleteErrorMessage" class="text-danger small mt-2">
                {{ deleteErrorMessage }}
              </div>
              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="closeModal"
                >
                  キャンセル
                </button>

                <button
                  type="button"
                  class="btn btn-primary"
                  @click="updateCategory"
                >
                  更新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 削除確認モーダル -->
      <div
        v-if="confirmationType === 'DELETE'"
        class="modal fade show"
        style="display: block; z-index: 1070"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @click.self="closeConfirmation"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          style="max-width: 360px"
        >
          <div class="modal-content shadow border border-secondary">
            <div class="d-flex justify-content-end px-3 pt-3">
              <button
                type="button"
                class="btn-close"
                aria-label="閉じる"
                @click="closeConfirmation"
              ></button>
            </div>

            <div class="modal-body text-center pt-2 pb-4">
              <p class="mb-0 fw-semibold">
                「{{ categoryName }}」を削除しますか？
              </p>
            </div>

            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="closeConfirmation"
              >
                キャンセル
              </button>

              <button
                type="button"
                class="btn btn-danger"
                @click="deleteCategory"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 編集モーダル背景 -->
      <div class="modal-backdrop fade show"></div>

      <!-- 削除確認時にさらに暗くする -->
      <div
        v-if="confirmationType === 'DELETE'"
        class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style="z-index: 1060"
      ></div>
    </template>
  </Teleport>
</template>
