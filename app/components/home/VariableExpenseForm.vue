<script setup>
import {
  REQUIRED_MESSAGE,
  POSITIVE_INTEGER_MESSAGE,
  MAX_LENGTH_500_MESSAGE,
  isRequired,
  isPositiveInteger,
  isWithinMaxLength,
} from "~/utils/validation";

// ========================
// ① props
// ========================

// 編集する変動費。
// 新規登録時はnull。
const props = defineProps({
  expense: {
    type: Object,
    default: null,
  },
});

// ========================
// ② 状態
// ========================

// 変動費フォームの入力値。
const expenseDate = ref("");
const categoryId = ref("");
const amount = ref("");
const paymentMethodId = ref("");
const transactionName = ref("");
const shopName = ref("");
const memo = ref("");

// 入力チェックエラー。
const errors = ref({
  expenseDate: "",
  categoryId: "",
  amount: "",
  paymentMethodId: "",
  memo: "",
});

// 仮のカテゴリ一覧。
const categoryList = ref([
  { id: 1, name: "食費" },
  { id: 2, name: "日用品" },
  { id: 3, name: "交通費" },
  { id: 4, name: "趣味" },
]);

// 仮の支払元一覧。
const paymentMethodList = ref([
  { id: 1, name: "現金" },
  { id: 2, name: "楽天カード" },
  { id: 3, name: "かんぽ" },
]);

// ========================
// ③ watch
// ========================

// 編集対象が変更されたらフォームへ値を設定する。
watch(
  () => props.expense,
  (expense) => {
    setFormValues(expense);
  },
  {
    immediate: true,
  },
);

// 入力値が変更されたら、対象項目のエラーを消す。
watch(expenseDate, () => {
  errors.value.expenseDate = "";
});

watch(categoryId, () => {
  errors.value.categoryId = "";
});

watch(amount, () => {
  errors.value.amount = "";
});

watch(paymentMethodId, () => {
  errors.value.paymentMethodId = "";
});

watch(memo, () => {
  errors.value.memo = "";
});

// ========================
// ④ 関数
// ========================

// 編集対象の値をフォームへ設定する。
// 新規登録時は空欄にする。
function setFormValues(expense) {
  expenseDate.value = expense?.transactionDate ?? "";
  categoryId.value = expense?.categoryId ?? "";
  amount.value = expense?.amount ?? "";
  paymentMethodId.value = expense?.paymentMethodId ?? "";
  transactionName.value = expense?.name ?? "";
  shopName.value = expense?.shopName ?? "";
  memo.value = expense?.memo ?? "";

  // エラーも初期化する。
  errors.value = {
    expenseDate: "",
    categoryId: "",
    amount: "",
    paymentMethodId: "",
    memo: "",
  };
}

// 入力内容をチェックする。
const validate = () => {
  errors.value = {
    expenseDate: "",
    categoryId: "",
    amount: "",
    paymentMethodId: "",
    memo: "",
  };

  let isValid = true;

  // 支出日チェック。
  if (!isRequired(expenseDate.value)) {
    errors.value.expenseDate = REQUIRED_MESSAGE;
    isValid = false;
  }

  // カテゴリチェック。
  if (!isRequired(categoryId.value)) {
    errors.value.categoryId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 金額チェック。
  if (!isRequired(amount.value)) {
    errors.value.amount = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isPositiveInteger(amount.value)) {
    errors.value.amount = POSITIVE_INTEGER_MESSAGE;
    isValid = false;
  }

  // 支払元チェック。
  if (!isRequired(paymentMethodId.value)) {
    errors.value.paymentMethodId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // メモ文字数チェック。
  if (!isWithinMaxLength(memo.value, 500)) {
    errors.value.memo = MAX_LENGTH_500_MESSAGE;
    isValid = false;
  }

  return isValid;
};

// フォームの入力値を親コンポーネントへ返す。
const getFormData = () => {
  return {
    transactionDate: expenseDate.value,
    categoryId: Number(categoryId.value),
    amount: Number(amount.value),
    paymentMethodId: Number(paymentMethodId.value),
    name: transactionName.value,
    shopName: shopName.value,
    memo: memo.value,
  };
};

// 親コンポーネントから呼べるようにする。
defineExpose({
  validate,
  getFormData,
});
</script>

<template>
  <div>
    <div class="alert alert-info py-2 mb-3" role="alert">
      過去の支出や、支払日が決まっている今後の支出も登録できます。
    </div>

    <!-- 支出日 -->
    <div class="mb-3">
      <label for="variable-expense-date" class="form-label">
        支出日 <span class="text-danger">*</span>
      </label>

      <input
        id="variable-expense-date"
        v-model="expenseDate"
        type="date"
        class="form-control"
        :class="{ 'is-invalid': errors.expenseDate }"
      />

      <div v-if="errors.expenseDate" class="invalid-feedback">
        {{ errors.expenseDate }}
      </div>
    </div>

    <!-- カテゴリ -->
    <div class="mb-3">
      <label for="variable-category" class="form-label">
        カテゴリ <span class="text-danger">*</span>
      </label>

      <select
        id="variable-category"
        v-model="categoryId"
        class="form-select"
        :class="{ 'is-invalid': errors.categoryId }"
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

    <!-- 金額 -->
    <div class="mb-3">
      <label for="variable-amount" class="form-label">
        金額 <span class="text-danger">*</span>
      </label>

      <div class="input-group">
        <span class="input-group-text">¥</span>

        <input
          id="variable-amount"
          v-model.number="amount"
          type="number"
          min="1"
          step="1"
          class="form-control"
          :class="{ 'is-invalid': errors.amount }"
          placeholder="1200"
        />
      </div>

      <div v-if="errors.amount" class="text-danger small mt-1">
        {{ errors.amount }}
      </div>
    </div>

    <!-- 支払元 -->
    <div class="mb-3">
      <label for="variable-payment-method" class="form-label">
        支払元 <span class="text-danger">*</span>
      </label>

      <select
        id="variable-payment-method"
        v-model="paymentMethodId"
        class="form-select"
        :class="{ 'is-invalid': errors.paymentMethodId }"
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

    <!-- 内容 -->
    <div class="mb-3">
      <label for="variable-transaction-name" class="form-label"> 内容 </label>

      <input
        id="variable-transaction-name"
        v-model="transactionName"
        type="text"
        class="form-control"
        maxlength="255"
        placeholder="例：昼食、シャンプーなど"
      />
    </div>

    <!-- 店名 -->
    <div class="mb-3">
      <label for="variable-shop-name" class="form-label"> 店名 </label>

      <input
        id="variable-shop-name"
        v-model="shopName"
        type="text"
        class="form-control"
        maxlength="255"
        placeholder="例：○○スーパー"
      />
    </div>

    <!-- メモ -->
    <div class="mb-0">
      <label for="variable-memo" class="form-label"> メモ </label>

      <textarea
        id="variable-memo"
        v-model="memo"
        class="form-control"
        :class="{ 'is-invalid': errors.memo }"
        rows="3"
        maxlength="500"
        placeholder="補足情報があれば入力してください"
      ></textarea>

      <div v-if="errors.memo" class="invalid-feedback">
        {{ errors.memo }}
      </div>
    </div>
  </div>
</template>
