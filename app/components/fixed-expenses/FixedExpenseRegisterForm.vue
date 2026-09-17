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
  categoryList: {
    type: Array,
    required: true,
  },

  paymentMethodList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["register"]);

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

// ========================
// ② watch
// ========================

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

// ========================
// ③ 関数
// ========================

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
  return isValid;
};

// 登録
const registerFixedExpense = () => {
  if (!validate()) {
    return;
  }

  const category = props.categoryList.find(
    (item) => item.id === Number(categoryId.value),
  );

  const paymentMethod = props.paymentMethodList.find(
    (item) => item.id === Number(paymentMethodId.value),
  );

  emit("register", {
    fixedExpenseName: fixedExpenseName.value.trim(),
    amount: Number(amount.value),
    categoryId: Number(categoryId.value),
    categoryName: category?.name ?? "",
    paymentMethodId: Number(paymentMethodId.value),
    paymentMethodName: paymentMethod?.name ?? "",
    paymentDay: Number(paymentDay.value),
    startYearMonth: startYearMonth.value,
    endYearMonth: endYearMonth.value,
    autoGenerate: autoGenerate.value,
    memo: memo.value,
  });

  // 登録後に入力欄を初期化
  fixedExpenseName.value = "";
  amount.value = "";
  categoryId.value = "";
  paymentMethodId.value = "";
  paymentDay.value = "";
  startYearMonth.value = "";
  endYearMonth.value = "";
  autoGenerate.value = true;
  memo.value = "";
};
</script>

<template>
  <section class="card shadow-sm mt-4">
    <div class="card-header bg-white fw-bold">固定費を追加</div>

    <div class="card-body">
      <div class="row g-3">
        <!-- 固定費名 -->
        <div class="col-12 col-md-6">
          <label for="new-fixed-expense-name" class="form-label">
            固定費名
            <span class="text-danger">*</span>
          </label>

          <input
            id="new-fixed-expense-name"
            v-model="fixedExpenseName"
            type="text"
            class="form-control"
            :class="{
              'is-invalid': errors.fixedExpenseName,
            }"
            maxlength="100"
            placeholder="例：家賃"
          />

          <div v-if="errors.fixedExpenseName" class="invalid-feedback">
            {{ errors.fixedExpenseName }}
          </div>
        </div>

        <!-- 金額 -->
        <div class="col-12 col-md-6">
          <label for="new-fixed-amount" class="form-label">
            金額
            <span class="text-danger">*</span>
          </label>

          <div class="input-group">
            <span class="input-group-text"> ¥ </span>

            <input
              id="new-fixed-amount"
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
        <div class="col-12 col-md-6">
          <label for="new-fixed-category" class="form-label">
            カテゴリ
            <span class="text-danger">*</span>
          </label>

          <select
            id="new-fixed-category"
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
        <div class="col-12 col-md-6">
          <label for="new-fixed-payment-method" class="form-label">
            支払元
            <span class="text-danger">*</span>
          </label>

          <select
            id="new-fixed-payment-method"
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
        <div class="col-12 col-md-4">
          <label for="new-fixed-payment-day" class="form-label">
            支払日
            <span class="text-danger">*</span>
          </label>

          <div class="input-group">
            <input
              id="new-fixed-payment-day"
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
        <div class="col-12 col-md-4">
          <label for="new-fixed-start" class="form-label">
            開始年月
            <span class="text-danger">*</span>
          </label>

          <input
            id="new-fixed-start"
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
        <div class="col-12 col-md-4">
          <label for="new-fixed-end" class="form-label"> 終了年月 </label>

          <input
            id="new-fixed-end"
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
        </div>

        <!-- 毎月自動生成 -->
        <div class="col-12">
          <div class="form-check form-switch">
            <input
              id="new-fixed-auto-generate"
              v-model="autoGenerate"
              class="form-check-input"
              type="checkbox"
            />

            <label class="form-check-label" for="new-fixed-auto-generate">
              毎月自動生成する
            </label>
          </div>
        </div>

        <!-- メモ -->
        <div class="col-12">
          <label for="new-fixed-memo" class="form-label"> メモ </label>

          <textarea
            id="new-fixed-memo"
            v-model="memo"
            class="form-control"
            :class="{
              'is-invalid': errors.memo,
            }"
            rows="3"
            maxlength="500"
            placeholder="契約内容などの補足情報があれば入力してください"
          ></textarea>

          <div v-if="errors.memo" class="invalid-feedback">
            {{ errors.memo }}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button
          type="button"
          class="btn btn-primary"
          @click="registerFixedExpense"
        >
          登録
        </button>
      </div>
    </div>
  </section>
</template>
