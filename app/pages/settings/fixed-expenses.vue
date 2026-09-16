<script setup>
// ========================
// ① 状態
// ========================
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

// 固定費新規登録フォーム
const newFixedExpenseName = ref("");
const newAmount = ref("");
const newCategoryId = ref("");
const newPaymentMethodId = ref("");
const newPaymentDay = ref("");
const newStartYearMonth = ref("");
const newEndYearMonth = ref("");
const newAutoGenerate = ref(true);
const newMemo = ref("");

const registerErrors = ref({
  fixedExpenseName: "",
  amount: "",
  categoryId: "",
  paymentMethodId: "",
  paymentDay: "",
  startYearMonth: "",
  endYearMonth: "",
  memo: "",
});
// 固定費設定一覧の仮データ。
// API実装後は固定費設定一覧APIから取得する。
const fixedExpenseList = ref([
  {
    id: 1,
    fixedExpenseName: "家賃",
    amount: 80000,
    categoryId: 1,
    categoryName: "住居費",
    paymentMethodId: 3,
    paymentMethodName: "横浜銀行",
    paymentDay: 27,
    startYearMonth: "2026-01",
    endYearMonth: "",
    autoGenerate: true,
    memo: "○○マンション",
    displayOrder: 1,
  },
  {
    id: 2,
    fixedExpenseName: "Netflix",
    amount: 990,
    categoryId: 2,
    categoryName: "サブスクリプション",
    paymentMethodId: 2,
    paymentMethodName: "楽天カード",
    paymentDay: 28,
    startYearMonth: "2026-08",
    endYearMonth: "",
    autoGenerate: true,
    memo: "",
    displayOrder: 2,
  },
  {
    id: 3,
    fixedExpenseName: "駐車場代",
    amount: 12000,
    categoryId: 1,
    categoryName: "住居費",
    paymentMethodId: 3,
    paymentMethodName: "横浜銀行",
    paymentDay: 27,
    startYearMonth: "2026-01",
    endYearMonth: "",
    autoGenerate: true,
    memo: "月極駐車場",
    displayOrder: 3,
  },
]);

// 編集モーダル
const isEditModalOpen = ref(false);
const editingFixedExpense = ref(null);

// 仮カテゴリ一覧。
const categoryList = [
  { id: 1, name: "住居費" },
  { id: 2, name: "サブスクリプション" },
  { id: 3, name: "通信費" },
  { id: 4, name: "保険" },
];

// 仮支払元一覧。
const paymentMethodList = [
  { id: 1, name: "現金" },
  { id: 2, name: "楽天カード" },
  { id: 3, name: "横浜銀行" },
];
// ========================
// ② watch
// ========================
watch(newFixedExpenseName, () => {
  registerErrors.value.fixedExpenseName = "";
});

watch(newAmount, () => {
  registerErrors.value.amount = "";
});

watch(newCategoryId, () => {
  registerErrors.value.categoryId = "";
});

watch(newPaymentMethodId, () => {
  registerErrors.value.paymentMethodId = "";
});

watch(newPaymentDay, () => {
  registerErrors.value.paymentDay = "";
});

watch(newStartYearMonth, () => {
  registerErrors.value.startYearMonth = "";
});

watch(newEndYearMonth, () => {
  registerErrors.value.endYearMonth = "";
});

watch(newMemo, () => {
  registerErrors.value.memo = "";
});

// ========================
// ③ 関数
// ========================
const validateRegister = () => {
  registerErrors.value = {
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

  if (!isRequired(newFixedExpenseName.value)) {
    registerErrors.value.fixedExpenseName = REQUIRED_MESSAGE;
    isValid = false;
  }

  if (!isRequired(newAmount.value)) {
    registerErrors.value.amount = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isPositiveInteger(newAmount.value)) {
    registerErrors.value.amount = POSITIVE_INTEGER_MESSAGE;
    isValid = false;
  }

  if (!isRequired(newCategoryId.value)) {
    registerErrors.value.categoryId = REQUIRED_MESSAGE;
    isValid = false;
  }

  if (!isRequired(newPaymentMethodId.value)) {
    registerErrors.value.paymentMethodId = REQUIRED_MESSAGE;
    isValid = false;
  }

  if (!isRequired(newPaymentDay.value)) {
    registerErrors.value.paymentDay = REQUIRED_MESSAGE;
    isValid = false;
  } else if (!isValidPaymentDay(newPaymentDay.value)) {
    registerErrors.value.paymentDay = "支払日は1〜31の整数で入力してください。";
    isValid = false;
  }

  if (!isRequired(newStartYearMonth.value)) {
    registerErrors.value.startYearMonth = REQUIRED_MESSAGE;
    isValid = false;
  }

  if (
    isRequired(newStartYearMonth.value) &&
    !isValidYearMonthRange(newStartYearMonth.value, newEndYearMonth.value)
  ) {
    registerErrors.value.endYearMonth =
      "終了年月は開始年月以降を指定してください。";
    isValid = false;
  }

  if (!isWithinMaxLength(newMemo.value, 500)) {
    registerErrors.value.memo = MAX_LENGTH_500_MESSAGE;
    isValid = false;
  }

  return isValid;
};
const registerFixedExpense = () => {
  if (!validateRegister()) {
    return;
  }

  const category = categoryList.find(
    (item) => item.id === Number(newCategoryId.value),
  );

  const paymentMethod = paymentMethodList.find(
    (item) => item.id === Number(newPaymentMethodId.value),
  );

  const nextId =
    fixedExpenseList.value.length === 0
      ? 1
      : Math.max(...fixedExpenseList.value.map((item) => item.id)) + 1;

  // 新規登録時は表示順をユーザーに入力させず、
  // 常に一覧の一番下へ追加する。
  const newDisplayOrder = fixedExpenseList.value.length + 1;

  fixedExpenseList.value.push({
    id: nextId,
    fixedExpenseName: newFixedExpenseName.value.trim(),
    amount: Number(newAmount.value),
    categoryId: Number(newCategoryId.value),
    categoryName: category?.name ?? "",
    paymentMethodId: Number(newPaymentMethodId.value),
    paymentMethodName: paymentMethod?.name ?? "",
    paymentDay: Number(newPaymentDay.value),
    startYearMonth: newStartYearMonth.value,
    endYearMonth: newEndYearMonth.value,
    autoGenerate: newAutoGenerate.value,
    memo: newMemo.value,
    displayOrder: newDisplayOrder,
  });

  sortFixedExpenseList();

  // 登録後に入力欄を初期化
  newFixedExpenseName.value = "";
  newAmount.value = "";
  newCategoryId.value = "";
  newPaymentMethodId.value = "";
  newPaymentDay.value = "";
  newStartYearMonth.value = "";
  newEndYearMonth.value = "";
  newAutoGenerate.value = true;
  newMemo.value = "";
};
// 表示順で並び替える。
const sortFixedExpenseList = () => {
  fixedExpenseList.value.sort((a, b) => a.displayOrder - b.displayOrder);
};

// 編集モーダルを開く。
const openEditModal = (fixedExpense) => {
  editingFixedExpense.value = {
    ...fixedExpense,
  };

  isEditModalOpen.value = true;
};

// 編集モーダルを閉じる。
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingFixedExpense.value = null;
};

// 編集内容を一覧へ反映する。
const updateFixedExpense = (updatedFixedExpense) => {
  const targetIndex = fixedExpenseList.value.findIndex(
    (item) => item.id === updatedFixedExpense.id,
  );

  if (targetIndex === -1) {
    return;
  }

  const oldDisplayOrder = fixedExpenseList.value[targetIndex].displayOrder;

  const newDisplayOrder = updatedFixedExpense.displayOrder;

  // 後ろへ移動する場合。
  if (oldDisplayOrder < newDisplayOrder) {
    fixedExpenseList.value.forEach((item) => {
      if (
        item.id !== updatedFixedExpense.id &&
        item.displayOrder > oldDisplayOrder &&
        item.displayOrder <= newDisplayOrder
      ) {
        item.displayOrder -= 1;
      }
    });
  }

  // 前へ移動する場合。
  if (oldDisplayOrder > newDisplayOrder) {
    fixedExpenseList.value.forEach((item) => {
      if (
        item.id !== updatedFixedExpense.id &&
        item.displayOrder >= newDisplayOrder &&
        item.displayOrder < oldDisplayOrder
      ) {
        item.displayOrder += 1;
      }
    });
  }

  // カテゴリ名を取得。
  const category = categoryList.find(
    (item) => item.id === updatedFixedExpense.categoryId,
  );

  // 支払元名を取得。
  const paymentMethod = paymentMethodList.find(
    (item) => item.id === updatedFixedExpense.paymentMethodId,
  );

  fixedExpenseList.value[targetIndex] = {
    ...updatedFixedExpense,
    categoryName: category?.name ?? "",
    paymentMethodName: paymentMethod?.name ?? "",
  };

  sortFixedExpenseList();

  closeEditModal();
};

// 固定費設定を削除する。
const deleteFixedExpense = (fixedExpenseId) => {
  const targetIndex = fixedExpenseList.value.findIndex(
    (item) => item.id === fixedExpenseId,
  );

  if (targetIndex === -1) {
    return;
  }

  const deletedDisplayOrder = fixedExpenseList.value[targetIndex].displayOrder;

  // 仮実装なので配列から削除する。
  fixedExpenseList.value.splice(targetIndex, 1);

  // 削除した表示順より後ろを前へ詰める。
  fixedExpenseList.value.forEach((item) => {
    if (item.displayOrder > deletedDisplayOrder) {
      item.displayOrder -= 1;
    }
  });

  sortFixedExpenseList();

  closeEditModal();
};
</script>

<template>
  <main class="container py-4 pb-5 mb-5">
    <!-- 画面タイトル -->
    <div class="mb-4">
      <h1 class="h4 mb-1">固定費設定</h1>

      <p class="text-body-secondary mb-0">毎月発生する固定費を管理します。</p>
    </div>

    <!-- 固定費一覧 -->
    <FixedExpenseSettingTable
      :fixed-expense-list="fixedExpenseList"
      @edit="openEditModal"
    />
    <!-- 固定費新規登録 -->
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
              v-model="newFixedExpenseName"
              type="text"
              class="form-control"
              :class="{
                'is-invalid': registerErrors.fixedExpenseName,
              }"
              maxlength="100"
              placeholder="例：家賃"
            />

            <div
              v-if="registerErrors.fixedExpenseName"
              class="invalid-feedback"
            >
              {{ registerErrors.fixedExpenseName }}
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
                v-model="newAmount"
                type="number"
                min="1"
                class="form-control"
                :class="{
                  'is-invalid': registerErrors.amount,
                }"
              />

              <div v-if="registerErrors.amount" class="invalid-feedback">
                {{ registerErrors.amount }}
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
              v-model="newCategoryId"
              class="form-select"
              :class="{
                'is-invalid': registerErrors.categoryId,
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

            <div v-if="registerErrors.categoryId" class="invalid-feedback">
              {{ registerErrors.categoryId }}
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
              v-model="newPaymentMethodId"
              class="form-select"
              :class="{
                'is-invalid': registerErrors.paymentMethodId,
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

            <div v-if="registerErrors.paymentMethodId" class="invalid-feedback">
              {{ registerErrors.paymentMethodId }}
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
                v-model="newPaymentDay"
                type="number"
                min="1"
                max="31"
                class="form-control"
                :class="{
                  'is-invalid': registerErrors.paymentDay,
                }"
              />

              <span class="input-group-text"> 日 </span>

              <div v-if="registerErrors.paymentDay" class="invalid-feedback">
                {{ registerErrors.paymentDay }}
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
              v-model="newStartYearMonth"
              type="month"
              class="form-control"
              :class="{
                'is-invalid': registerErrors.startYearMonth,
              }"
            />

            <div v-if="registerErrors.startYearMonth" class="invalid-feedback">
              {{ registerErrors.startYearMonth }}
            </div>
          </div>

          <!-- 終了年月 -->
          <div class="col-12 col-md-4">
            <label for="new-fixed-end" class="form-label"> 終了年月 </label>

            <input
              id="new-fixed-end"
              v-model="newEndYearMonth"
              type="month"
              class="form-control"
              :class="{
                'is-invalid': registerErrors.endYearMonth,
              }"
            />

            <div v-if="registerErrors.endYearMonth" class="invalid-feedback">
              {{ registerErrors.endYearMonth }}
            </div>
          </div>

          <!-- 毎月自動生成 -->
          <div class="col-12">
            <div class="form-check form-switch">
              <input
                id="new-fixed-auto-generate"
                v-model="newAutoGenerate"
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
              v-model="newMemo"
              class="form-control"
              :class="{
                'is-invalid': registerErrors.memo,
              }"
              rows="3"
              maxlength="500"
              placeholder="契約内容などの補足情報があれば入力してください"
            ></textarea>

            <div v-if="registerErrors.memo" class="invalid-feedback">
              {{ registerErrors.memo }}
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
    <!-- 編集モーダル -->
    <FixedExpenseSettingEditModal
      :is-open="isEditModalOpen"
      :fixed-expense="editingFixedExpense"
      :category-list="categoryList"
      :payment-method-list="paymentMethodList"
      :max-display-order="fixedExpenseList.length"
      @close="closeEditModal"
      @update="updateFixedExpense"
      @delete="deleteFixedExpense"
    />
  </main>
</template>
