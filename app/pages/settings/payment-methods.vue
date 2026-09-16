<script setup>
import { REQUIRED_MESSAGE, isRequired } from "~/utils/validation";

// ========================
// ① 状態
// ========================

// 支払元一覧の仮データ。
const paymentMethodList = ref([
  {
    id: 1,
    name: "現金",
    paymentType: "CASH",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "楽天カード",
    paymentType: "CREDIT_CARD",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "横浜銀行",
    paymentType: "BANK",
    displayOrder: 3,
  },
]);

// 新規登録フォーム
const paymentMethodName = ref("");
const paymentType = ref("");

const errors = ref({
  paymentMethodName: "",
  paymentType: "",
});

// 編集モーダル
const isEditModalOpen = ref(false);
const editingPaymentMethod = ref(null);

// 支払種別
const paymentTypeList = [
  { value: "CASH", label: "現金" },
  { value: "BANK", label: "銀行口座" },
  {
    value: "CREDIT_CARD",
    label: "クレジットカード",
  },
  { value: "OTHER", label: "その他" },
];

// ========================
// ② watch
// ========================

watch(paymentMethodName, () => {
  errors.value.paymentMethodName = "";
});

watch(paymentType, () => {
  errors.value.paymentType = "";
});

// ========================
// ③ 関数
// ========================

// 新規登録入力チェック
const validateRegister = () => {
  errors.value = {
    paymentMethodName: "",
    paymentType: "",
  };

  let isValid = true;

  if (!isRequired(paymentMethodName.value)) {
    errors.value.paymentMethodName = REQUIRED_MESSAGE;
    isValid = false;
  }

  if (!isRequired(paymentType.value)) {
    errors.value.paymentType = REQUIRED_MESSAGE;
    isValid = false;
  }

  return isValid;
};

// 表示順で並び替える
const sortPaymentMethodList = () => {
  paymentMethodList.value.sort((a, b) => a.displayOrder - b.displayOrder);
};

// 新規登録
const registerPaymentMethod = () => {
  if (!validateRegister()) {
    return;
  }

  const nextId =
    paymentMethodList.value.length === 0
      ? 1
      : Math.max(...paymentMethodList.value.map((item) => item.id)) + 1;
  // 新規登録時は常に現在の一覧の末尾へ追加する。
  const newDisplayOrder = paymentMethodList.value.length + 1;

  paymentMethodList.value.push({
    id: nextId,
    name: paymentMethodName.value.trim(),
    paymentType: paymentType.value,
    displayOrder: newDisplayOrder,
  });

  // 念のため表示順で並び替える。
  sortPaymentMethodList();

  // 登録後は入力欄を初期化
  paymentMethodName.value = "";
  paymentType.value = "";
};

// 編集モーダルを開く
const openEditModal = (paymentMethod) => {
  editingPaymentMethod.value = {
    ...paymentMethod,
  };
  isEditModalOpen.value = true;
};

// 編集モーダルを閉じる
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingPaymentMethod.value = null;
};

// 編集内容を一覧へ反映
const updatePaymentMethod = (updatedPaymentMethod) => {
  const targetIndex = paymentMethodList.value.findIndex(
    (item) => item.id === updatedPaymentMethod.id,
  );

  if (targetIndex === -1) {
    return;
  }

  const oldDisplayOrder = paymentMethodList.value[targetIndex].displayOrder;
  const newDisplayOrder = updatedPaymentMethod.displayOrder;

  // 後ろへ移動する場合
  if (oldDisplayOrder < newDisplayOrder) {
    paymentMethodList.value.forEach((item) => {
      if (
        item.id !== updatedPaymentMethod.id &&
        item.displayOrder > oldDisplayOrder &&
        item.displayOrder <= newDisplayOrder
      ) {
        item.displayOrder -= 1;
      }
    });
  }

  // 前へ移動する場合
  if (oldDisplayOrder > newDisplayOrder) {
    paymentMethodList.value.forEach((item) => {
      if (
        item.id !== updatedPaymentMethod.id &&
        item.displayOrder >= newDisplayOrder &&
        item.displayOrder < oldDisplayOrder
      ) {
        item.displayOrder += 1;
      }
    });
  }

  // 編集対象を更新
  paymentMethodList.value[targetIndex] = {
    ...updatedPaymentMethod,
  };
  sortPaymentMethodList();
  closeEditModal();
};
// 支払元を削除する。
const deletePaymentMethod = (paymentMethodId) => {
  const targetIndex = paymentMethodList.value.findIndex(
    (item) => item.id === paymentMethodId,
  );

  if (targetIndex === -1) {
    return;
  }

  const deletedDisplayOrder = paymentMethodList.value[targetIndex].displayOrder;

  // 対象データを一覧から削除する。
  paymentMethodList.value.splice(targetIndex, 1);

  // 削除した表示順より後ろのデータを
  // 1つずつ前へ詰める。
  paymentMethodList.value.forEach((item) => {
    if (item.displayOrder > deletedDisplayOrder) {
      item.displayOrder -= 1;
    }
  });

  sortPaymentMethodList();

  closeEditModal();
};
</script>

<template>
  <main class="container py-4 pb-5 mb-5">
    <!-- 画面タイトル -->
    <div class="mb-4">
      <h1 class="h4 mb-1">支払元管理</h1>

      <p class="text-body-secondary mb-0">
        支出登録時に使用する支払元を管理します。
      </p>
    </div>

    <!-- 支払元一覧 -->
    <PaymentMethodTable
      :payment-method-list="paymentMethodList"
      :payment-type-list="paymentTypeList"
      @edit="openEditModal"
    />

    <!-- 新規登録 -->
    <PaymentMethodRegisterForm
      v-model:payment-method-name="paymentMethodName"
      v-model:payment-type="paymentType"
      :errors="errors"
      :payment-type-list="paymentTypeList"
      @register="registerPaymentMethod"
    />
  </main>

  <!-- 編集モーダル -->
  <PaymentMethodEditModal
    :is-open="isEditModalOpen"
    :payment-method="editingPaymentMethod"
    :payment-type-list="paymentTypeList"
    :max-display-order="paymentMethodList.length"
    @close="closeEditModal"
    @update="updatePaymentMethod"
    @delete="deletePaymentMethod"
  />
</template>
