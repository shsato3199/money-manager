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

// 固定費フォームの入力値。
const fixedExpenseName = ref("");
const amount = ref("");
const categoryId = ref("");
const paymentMethodId = ref("");
const paymentDay = ref("");
const startYearMonth = ref("");
const endYearMonth = ref("");
const autoGenerate = ref(true);
const memo = ref("");

// 入力チェックエラー。
const errors = ref({
  fixedExpenseName: "",
  amount: "",
  categoryId: "",
  paymentMethodId: "",
  paymentDay: "",
  startYearMonth: "",
  endYearMonth: "",
  memo: "",
});

// 仮のカテゴリ一覧。
const categoryList = ref([
  { id: 1, name: "住居費" },
  { id: 2, name: "通信費" },
  { id: 3, name: "保険" },
  { id: 4, name: "サブスクリプション" },
]);

// 仮の支払元一覧。
const paymentMethodList = ref([
  { id: 1, name: "現金" },
  { id: 2, name: "楽天カード" },
  { id: 3, name: "かんぽ" },
]);

// 入力値が変更されたら、対象項目のエラーを消す。
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

// 入力内容をチェックする。
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
  };

  let isValid = true;

  // 固定費名チェック。
  if (!isRequired(fixedExpenseName.value)) {
    errors.value.fixedExpenseName = REQUIRED_MESSAGE;
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

  // カテゴリチェック。
  if (!isRequired(categoryId.value)) {
    errors.value.categoryId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 支払元チェック。
  if (!isRequired(paymentMethodId.value)) {
    errors.value.paymentMethodId = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 支払日チェック。
  if (!isRequired(paymentDay.value)) {
    errors.value.paymentDay = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isValidPaymentDay(paymentDay.value)) {
    errors.value.paymentDay = "支払日は1〜31の整数で入力してください。";
    isValid = false;
  }

  // 開始年月チェック。
  if (!isRequired(startYearMonth.value)) {
    errors.value.startYearMonth = REQUIRED_MESSAGE;
    isValid = false;
  }

  // 開始年月と終了年月の前後関係チェック。
  if (
    isRequired(startYearMonth.value) &&
    !isValidYearMonthRange(startYearMonth.value, endYearMonth.value)
  ) {
    errors.value.endYearMonth = "終了年月は開始年月以降を指定してください。";
    isValid = false;
  }

  // メモ文字数チェック。
  if (!isWithinMaxLength(memo.value, 500)) {
    errors.value.memo = MAX_LENGTH_500_MESSAGE;
    isValid = false;
  }

  return isValid;
};

// 親コンポーネントからvalidate()を呼べるようにする。
defineExpose({
  validate,
});
</script>

<template>
  <div>
    <!-- 固定費名 -->
    <div class="mb-3">
      <label for="fixed-expense-name" class="form-label">
        固定費名 <span class="text-danger">*</span>
      </label>

      <input
        id="fixed-expense-name"
        v-model="fixedExpenseName"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.fixedExpenseName }"
        maxlength="100"
        placeholder="例：家賃、Netflix、保険料"
      />

      <div v-if="errors.fixedExpenseName" class="invalid-feedback">
        {{ errors.fixedExpenseName }}
      </div>
    </div>

    <!-- 金額 -->
    <div class="mb-3">
      <label for="fixed-amount" class="form-label">
        金額 <span class="text-danger">*</span>
      </label>

      <div class="input-group">
        <span class="input-group-text">¥</span>

        <input
          id="fixed-amount"
          v-model.number="amount"
          type="number"
          min="1"
          step="1"
          class="form-control"
          :class="{ 'is-invalid': errors.amount }"
          placeholder="80000"
        />
      </div>

      <div v-if="errors.amount" class="text-danger small mt-1">
        {{ errors.amount }}
      </div>
    </div>

    <!-- カテゴリ -->
    <div class="mb-3">
      <label for="fixed-category" class="form-label">
        カテゴリ <span class="text-danger">*</span>
      </label>

      <select
        id="fixed-category"
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

    <!-- 支払元 -->
    <div class="mb-3">
      <label for="fixed-payment-method" class="form-label">
        支払元 <span class="text-danger">*</span>
      </label>

      <select
        id="fixed-payment-method"
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

    <!-- 支払日 -->
    <div class="mb-3">
      <label for="fixed-payment-day" class="form-label">
        支払日 <span class="text-danger">*</span>
      </label>

      <div class="input-group">
        <input
          id="fixed-payment-day"
          v-model.number="paymentDay"
          type="number"
          min="1"
          max="31"
          step="1"
          class="form-control"
          :class="{ 'is-invalid': errors.paymentDay }"
          placeholder="27"
        />

        <span class="input-group-text">日</span>
      </div>

      <div v-if="errors.paymentDay" class="text-danger small mt-1">
        {{ errors.paymentDay }}
      </div>
    </div>

    <!-- 開始年月 -->
    <div class="mb-3">
      <label for="fixed-start-year-month" class="form-label">
        開始年月 <span class="text-danger">*</span>
      </label>

      <input
        id="fixed-start-year-month"
        v-model="startYearMonth"
        type="month"
        class="form-control"
        :class="{ 'is-invalid': errors.startYearMonth }"
      />

      <div v-if="errors.startYearMonth" class="invalid-feedback">
        {{ errors.startYearMonth }}
      </div>
    </div>

    <!-- 終了年月 -->
    <div class="mb-3">
      <label for="fixed-end-year-month" class="form-label"> 終了年月 </label>

      <input
        id="fixed-end-year-month"
        v-model="endYearMonth"
        type="month"
        class="form-control"
        :class="{ 'is-invalid': errors.endYearMonth }"
      />

      <div v-if="errors.endYearMonth" class="invalid-feedback">
        {{ errors.endYearMonth }}
      </div>

      <div class="form-text">終了予定がない場合は未入力で構いません。</div>
    </div>

    <!-- 毎月自動生成 -->
    <div class="mb-3 form-check form-switch">
      <input
        id="fixed-auto-generate"
        v-model="autoGenerate"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />

      <label class="form-check-label" for="fixed-auto-generate">
        毎月自動生成する
      </label>
    </div>

    <!-- メモ -->
    <div class="mb-0">
      <label for="fixed-memo" class="form-label"> メモ </label>

      <textarea
        id="fixed-memo"
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
