<script setup>
import { REQUIRED_MESSAGE, isRequired } from "~/utils/validation";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },

  paymentMethod: {
    type: Object,
    default: null,
  },

  paymentTypeList: {
    type: Array,
    required: true,
  },

  // 編集時に指定できる最大表示順。
  // 支払元が3件なら最大3。
  maxDisplayOrder: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "update", "delete"]);

// ========================
// ① 状態
// ========================

const paymentMethodName = ref("");
const paymentType = ref("");
const displayOrder = ref("");

// 確認モーダルの表示状態。
// null    : 非表示
// DELETE  : 削除確認
const confirmationType = ref(null);

const errors = ref({
  paymentMethodName: "",
  paymentType: "",
  displayOrder: "",
});

// ========================
// ② watch
// ========================

// 編集対象が変わったら入力値へ反映
watch(
  () => props.paymentMethod,
  (paymentMethod) => {
    if (!paymentMethod) {
      return;
    }

    paymentMethodName.value = paymentMethod.name;
    paymentType.value = paymentMethod.paymentType;
    displayOrder.value = paymentMethod.displayOrder;

    errors.value = {
      paymentMethodName: "",
      paymentType: "",
      displayOrder: "",
    };
  },
  {
    immediate: true,
  },
);

// 入力値変更時にエラー解除
watch(paymentMethodName, () => {
  errors.value.paymentMethodName = "";
});

watch(paymentType, () => {
  errors.value.paymentType = "";
});

watch(displayOrder, () => {
  errors.value.displayOrder = "";
});

// ========================
// ③ 関数
// ========================

// 編集時の表示順チェック。
// 現在3件なら1〜3まで。
const isValidDisplayOrder = (value) => {
  const order = Number(value);

  return (
    Number.isInteger(order) && order >= 1 && order <= props.maxDisplayOrder
  );
};

const validate = () => {
  errors.value = {
    paymentMethodName: "",
    paymentType: "",
    displayOrder: "",
  };

  let isValid = true;

  // 支払元名
  if (!isRequired(paymentMethodName.value)) {
    errors.value.paymentMethodName = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 種別
  if (!isRequired(paymentType.value)) {
    errors.value.paymentType = REQUIRED_MESSAGE;
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

// モーダルを閉じる
const closeModal = () => {
  confirmationType.value = null;
  emit("close");
};

// 削除確認モーダルを開く
const openDeleteConfirmation = () => {
  if (!props.paymentMethod) {
    return;
  }

  confirmationType.value = "DELETE";
};

// 確認モーダルを閉じる
const closeConfirmation = () => {
  confirmationType.value = null;
};

// 更新確定
const updatePaymentMethod = () => {
  if (!validate() || !props.paymentMethod) {
    return;
  }

  emit("update", {
    id: props.paymentMethod.id,
    name: paymentMethodName.value.trim(),
    paymentType: paymentType.value,
    displayOrder: Number(displayOrder.value),
  });
};

// 削除確定
const deletePaymentMethod = () => {
  if (!props.paymentMethod) {
    return;
  }

  emit("delete", props.paymentMethod.id);

  confirmationType.value = null;
};
</script>

<template>
  <Teleport to="body">
    <template v-if="isOpen">
      <!-- 支払元編集モーダル -->
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
            <!-- ヘッダー -->
            <div class="modal-header">
              <h5 class="modal-title">支払元編集</h5>

              <button
                type="button"
                class="btn-close"
                aria-label="閉じる"
                @click="closeModal"
              ></button>
            </div>

            <!-- 本文 -->
            <div class="modal-body">
              <!-- 支払元名 -->
              <div class="mb-3">
                <label for="edit-payment-method-name" class="form-label">
                  支払元名
                  <span class="text-danger">*</span>
                </label>

                <input
                  id="edit-payment-method-name"
                  v-model="paymentMethodName"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.paymentMethodName,
                  }"
                  maxlength="100"
                />

                <div v-if="errors.paymentMethodName" class="invalid-feedback">
                  {{ errors.paymentMethodName }}
                </div>
              </div>

              <!-- 種別 -->
              <div class="mb-3">
                <label for="edit-payment-type" class="form-label">
                  種別
                  <span class="text-danger">*</span>
                </label>

                <select
                  id="edit-payment-type"
                  v-model="paymentType"
                  class="form-select"
                  :class="{
                    'is-invalid': errors.paymentType,
                  }"
                >
                  <option value="" disabled>種別を選択してください</option>

                  <option
                    v-for="type in paymentTypeList"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>

                <div v-if="errors.paymentType" class="invalid-feedback">
                  {{ errors.paymentType }}
                </div>
              </div>

              <!-- 表示順 -->
              <div class="mb-0">
                <label for="edit-display-order" class="form-label">
                  表示順
                  <span class="text-danger">*</span>
                </label>

                <input
                  id="edit-display-order"
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

            <!-- フッター -->
            <div class="modal-footer d-flex justify-content-between">
              <!-- 左側：削除 -->
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="openDeleteConfirmation"
              >
                削除
              </button>

              <!-- 右側：キャンセル・更新 -->
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
                  @click="updatePaymentMethod"
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
                「{{ paymentMethodName }}」を削除しますか？
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
                @click="deletePaymentMethod"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 編集モーダル用の背景 -->
      <div class="modal-backdrop fade show"></div>

      <!--
        削除確認中は、
        編集モーダルの上からさらに背景を暗くする。
      -->
      <div
        v-if="confirmationType === 'DELETE'"
        class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style="z-index: 1060"
      ></div>
    </template>
  </Teleport>
</template>
