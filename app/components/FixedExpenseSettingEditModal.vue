<script setup>
import {
  REQUIRED_MESSAGE,
  POSITIVE_INTEGER_MESSAGE,
  MAX_LENGTH_500_MESSAGE,
  isRequired,
  isPositiveInteger,
  isValidPaymentDay,
  isValidYearMonthRange,
  isWithinMaxLength,
} from "~/utils/validation";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },

  fixedExpense: {
    type: Object,
    default: null,
  },

  categoryList: {
    type: Array,
    required: true,
  },

  paymentMethodList: {
    type: Array,
    required: true,
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

const fixedExpenseName = ref("");
const amount = ref("");
const categoryId = ref("");
const paymentMethodId = ref("");
const paymentDay = ref("");
const startYearMonth = ref("");
const endYearMonth = ref("");
const autoGenerate = ref(true);
const memo = ref("");
const displayOrder = ref("");

// 確認モーダル
// null   : 非表示
// DELETE : 削除確認
const confirmationType = ref(null);

const errors = ref({
  fixedExpenseName: "",
  amount: "",
  categoryId: "",
  paymentMethodId: "",
  paymentDay: "",
  startYearMonth: "",
  endYearMonth: "",
  memo: "",
  displayOrder: "",
});

// ========================
// ② watch
// ========================

// 編集対象をフォームへ設定する。
watch(
  () => props.fixedExpense,
  (fixedExpense) => {
    if (!fixedExpense) {
      return;
    }

    fixedExpenseName.value = fixedExpense.fixedExpenseName;
    amount.value = fixedExpense.amount;
    categoryId.value = fixedExpense.categoryId;
    paymentMethodId.value = fixedExpense.paymentMethodId;
    paymentDay.value = fixedExpense.paymentDay;
    startYearMonth.value = fixedExpense.startYearMonth;
    endYearMonth.value = fixedExpense.endYearMonth ?? "";
    autoGenerate.value = fixedExpense.autoGenerate;
    memo.value = fixedExpense.memo ?? "";
    displayOrder.value = fixedExpense.displayOrder;

    errors.value = {
      fixedExpenseName: "",
      amount: "",
      categoryId: "",
      paymentMethodId: "",
      paymentDay: "",
      startYearMonth: "",
      endYearMonth: "",
      memo: "",
      displayOrder: "",
    };
    confirmationType.value = null;
  },
  {
    immediate: true,
  },
);

// 入力値変更時にエラー解除。
watch(fixedExpenseName, () => {
  errors.value.fixedExpenseName = "";
});

watch(amount, () => {
  errors.value.amount = "";
});

watch(categoryId, () => {
  errors.value.categoryId = "";
});

watch(paymentMethodId, () => {
  errors.value.paymentMethodId = "";
});

watch(paymentDay, () => {
  errors.value.paymentDay = "";
});

watch(startYearMonth, () => {
  errors.value.startYearMonth = "";
});

watch(endYearMonth, () => {
  errors.value.endYearMonth = "";
});

watch(memo, () => {
  errors.value.memo = "";
});

watch(displayOrder, () => {
  errors.value.displayOrder = "";
});

// ========================
// ③ 関数
// ========================

// 表示順チェック。
const isValidDisplayOrder = (value) => {
  const order = Number(value);

  return (
    Number.isInteger(order) && order >= 1 && order <= props.maxDisplayOrder
  );
};

// 入力チェック。
const validate = () => {
  errors.value = {
    fixedExpenseName: "",
    amount: "",
    categoryId: "",
    paymentMethodId: "",
    paymentDay: "",
    startYearMonth: "",
    endYearMonth: "",
    memo: "",
    displayOrder: "",
  };

  let isValid = true;

  // 固定費名
  if (!isRequired(fixedExpenseName.value)) {
    errors.value.fixedExpenseName = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 金額
  if (!isRequired(amount.value)) {
    errors.value.amount = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isPositiveInteger(amount.value)) {
    errors.value.amount = POSITIVE_INTEGER_MESSAGE;
    isValid = false;
  }

  // カテゴリ
  if (!isRequired(categoryId.value)) {
    errors.value.categoryId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 支払元
  if (!isRequired(paymentMethodId.value)) {
    errors.value.paymentMethodId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 支払日
  if (!isRequired(paymentDay.value)) {
    errors.value.paymentDay = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isValidPaymentDay(paymentDay.value)) {
    errors.value.paymentDay = "支払日は1〜31の整数で入力してください。";
    isValid = false;
  }

  // 開始年月
  if (!isRequired(startYearMonth.value)) {
    errors.value.startYearMonth = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 終了年月
  if (
    isRequired(startYearMonth.value) &&
    !isValidYearMonthRange(startYearMonth.value, endYearMonth.value)
  ) {
    errors.value.endYearMonth = "終了年月は開始年月以降を指定してください。";
    isValid = false;
  }

  // メモ
  if (!isWithinMaxLength(memo.value, 500)) {
    errors.value.memo = MAX_LENGTH_500_MESSAGE;
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

// 編集モーダルを閉じる。
const closeModal = () => {
  confirmationType.value = null;
  emit("close");
};

// 削除確認。
const openDeleteConfirmation = () => {
  if (!props.fixedExpense) {
    return;
  }
  confirmationType.value = "DELETE";
};

// 確認モーダルを閉じる。
const closeConfirmation = () => {
  confirmationType.value = null;
};

// 更新確定。
const updateFixedExpense = () => {
  if (!validate() || !props.fixedExpense) {
    return;
  }

  emit("update", {
    id: props.fixedExpense.id,
    fixedExpenseName: fixedExpenseName.value.trim(),
    amount: Number(amount.value),
    categoryId: Number(categoryId.value),
    paymentMethodId: Number(paymentMethodId.value),
    paymentDay: Number(paymentDay.value),
    startYearMonth: startYearMonth.value,
    endYearMonth: endYearMonth.value,
    autoGenerate: autoGenerate.value,
    memo: memo.value,
    displayOrder: Number(displayOrder.value),
  });
};

// 削除確定。
const deleteFixedExpense = () => {
  if (!props.fixedExpense) {
    return;
  }
  emit("delete", props.fixedExpense.id);
  confirmationType.value = null;
};
</script>

<template>
  <Teleport to="body">
    <template v-if="isOpen">
      <!-- 固定費編集モーダル -->
      <div
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content shadow">
            <!-- ヘッダー -->
            <div class="modal-header">
              <h5 class="modal-title">固定費編集</h5>

              <button
                type="button"
                class="btn-close"
                aria-label="閉じる"
                @click="closeModal"
              ></button>
            </div>

            <!-- 本文 -->
            <div class="modal-body">
              <!-- 固定費名 -->
              <div class="mb-3">
                <label for="edit-fixed-expense-name" class="form-label">
                  固定費名
                  <span class="text-danger"> * </span>
                </label>

                <input
                  id="edit-fixed-expense-name"
                  v-model="fixedExpenseName"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.fixedExpenseName,
                  }"
                  maxlength="100"
                />

                <div v-if="errors.fixedExpenseName" class="invalid-feedback">
                  {{ errors.fixedExpenseName }}
                </div>
              </div>

              <!-- 金額 -->
              <div class="mb-3">
                <label for="edit-fixed-amount" class="form-label">
                  金額
                  <span class="text-danger"> * </span>
                </label>

                <div class="input-group">
                  <span class="input-group-text"> ¥ </span>

                  <input
                    id="edit-fixed-amount"
                    v-model="amount"
                    type="number"
                    min="1"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.amount,
                    }"
                  />

                  <div v-if="errors.amount" class="invalid-feedback">
                    {{ errors.amount }}
                  </div>
                </div>
              </div>

              <!-- カテゴリ -->
              <div class="mb-3">
                <label for="edit-fixed-category" class="form-label">
                  カテゴリ
                  <span class="text-danger"> * </span>
                </label>

                <select
                  id="edit-fixed-category"
                  v-model="categoryId"
                  class="form-select"
                  :class="{
                    'is-invalid': errors.categoryId,
                  }"
                >
                  <option value="" disabled>カテゴリを選択してください</option>

                  <option
                    v-for="category in categoryList"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>

                <div v-if="errors.categoryId" class="invalid-feedback">
                  {{ errors.categoryId }}
                </div>
              </div>

              <!-- 支払元 -->
              <div class="mb-3">
                <label for="edit-fixed-payment-method" class="form-label">
                  支払元
                  <span class="text-danger"> * </span>
                </label>

                <select
                  id="edit-fixed-payment-method"
                  v-model="paymentMethodId"
                  class="form-select"
                  :class="{
                    'is-invalid': errors.paymentMethodId,
                  }"
                >
                  <option value="" disabled>支払元を選択してください</option>

                  <option
                    v-for="paymentMethod in paymentMethodList"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                  >
                    {{ paymentMethod.name }}
                  </option>
                </select>

                <div v-if="errors.paymentMethodId" class="invalid-feedback">
                  {{ errors.paymentMethodId }}
                </div>
              </div>

              <!-- 支払日 -->
              <div class="mb-3">
                <label for="edit-fixed-payment-day" class="form-label">
                  支払日
                  <span class="text-danger"> * </span>
                </label>

                <div class="input-group">
                  <input
                    id="edit-fixed-payment-day"
                    v-model="paymentDay"
                    type="number"
                    min="1"
                    max="31"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.paymentDay,
                    }"
                  />

                  <span class="input-group-text"> 日 </span>

                  <div v-if="errors.paymentDay" class="invalid-feedback">
                    {{ errors.paymentDay }}
                  </div>
                </div>
              </div>

              <!-- 開始年月 -->
              <div class="mb-3">
                <label for="edit-fixed-start" class="form-label">
                  開始年月
                  <span class="text-danger"> * </span>
                </label>

                <input
                  id="edit-fixed-start"
                  v-model="startYearMonth"
                  type="month"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.startYearMonth,
                  }"
                />

                <div v-if="errors.startYearMonth" class="invalid-feedback">
                  {{ errors.startYearMonth }}
                </div>
              </div>

              <!-- 終了年月 -->
              <div class="mb-3">
                <label for="edit-fixed-end" class="form-label">
                  終了年月
                </label>

                <input
                  id="edit-fixed-end"
                  v-model="endYearMonth"
                  type="month"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.endYearMonth,
                  }"
                />

                <div v-if="errors.endYearMonth" class="invalid-feedback">
                  {{ errors.endYearMonth }}
                </div>

                <div class="form-text">
                  終了予定がない場合は未入力で構いません。
                </div>
              </div>

              <!-- 毎月自動生成 -->
              <div class="form-check form-switch mb-3">
                <input
                  id="edit-fixed-auto-generate"
                  v-model="autoGenerate"
                  class="form-check-input"
                  type="checkbox"
                />

                <label class="form-check-label" for="edit-fixed-auto-generate">
                  毎月自動生成する
                </label>
              </div>

              <!-- メモ -->
              <div class="mb-3">
                <label for="edit-fixed-memo" class="form-label"> メモ </label>

                <textarea
                  id="edit-fixed-memo"
                  v-model="memo"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.memo,
                  }"
                  rows="3"
                  maxlength="500"
                ></textarea>

                <div v-if="errors.memo" class="invalid-feedback">
                  {{ errors.memo }}
                </div>
              </div>

              <!-- 表示順 -->
              <div class="mb-0">
                <label for="edit-fixed-display-order" class="form-label">
                  表示順
                  <span class="text-danger"> * </span>
                </label>

                <input
                  id="edit-fixed-display-order"
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
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="openDeleteConfirmation"
              >
                削除
              </button>

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
                  @click="updateFixedExpense"
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
                「{{ fixedExpenseName }}」を削除しますか？
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
                @click="deleteFixedExpense"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 編集モーダル背景 -->
      <div class="modal-backdrop fade show"></div>

      <!-- 削除確認中はさらに暗くする -->
      <div
        v-if="confirmationType === 'DELETE'"
        class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style="z-index: 1060"
      ></div>
    </template>
  </Teleport>
</template>
