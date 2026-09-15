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

const emit = defineEmits(["close", "update"]);

// ========================
// ① 状態
// ========================

const paymentMethodName = ref("");
const paymentType = ref("");
const displayOrder = ref("");

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
  emit("close");
};

// 更新
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
</script>

<template>
  <Teleport to="body">
    <template v-if="isOpen">
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
                  <span class="text-danger"> * </span>
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
                  <span class="text-danger"> * </span>
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
                  <span class="text-danger"> * </span>
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
            <div class="modal-footer">
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

      <div class="modal-backdrop fade show"></div>
    </template>
  </Teleport>
</template>
