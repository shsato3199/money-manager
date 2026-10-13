<script setup>
import { REQUIRED_MESSAGE, isRequired } from "~/utils/validation";
import {
  fetchPaymentMethods,
  createPaymentMethod,
} from "~/api/paymentMethodApi";
// ========================
// ① 状態
// ========================

// 支払元一覧。
const paymentMethodList = ref([]);
// 支払元一覧テーブルの参照。
const paymentMethodSettingTableRef = ref(null);

// 登録エラーメッセージ。
const registerErrorMessage = ref("");
// 登録成功メッセージ。
const registerSuccessMessage = ref("");

// 一覧取得エラーメッセージ。
const listErrorMessage = ref("");

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
  { value: "BANK_ACCOUNT", label: "銀行口座" },
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
// ③ API通信
// ========================

// 支払元一覧取得。
const fetchPaymentMethodList = async () => {
  // 一覧取得エラーメッセージを初期化する。
  listErrorMessage.value = "";

  try {
    // 支払元一覧取得API。
    paymentMethodList.value = await fetchPaymentMethods();
  } catch (error) {
    console.error("支払元一覧の取得に失敗しました。", error);

    // 取得失敗時は一覧を空にする。
    paymentMethodList.value = [];

    // エラーメッセージを設定する。
    listErrorMessage.value =
      "支払元一覧の取得に失敗しました。再読み込みしてください。";
  }
};
// 支払元登録。
const registerPaymentMethod = async () => {
  // 入力チェック。
  if (!validateRegister()) {
    return;
  }

  // 登録結果のメッセージを初期化する。
  registerErrorMessage.value = "";
  registerSuccessMessage.value = "";

  try {
    // 支払元登録API。
    await createPaymentMethod({
      name: paymentMethodName.value.trim(),
      paymentType: paymentType.value,
    });
  } catch (error) {
    console.error("支払元登録に失敗しました。", error);

    // 支払元名が重複している場合。
    if (error.response?.status === 409) {
      registerErrorMessage.value = "同じ名前の支払元が既に登録されています。";
    } else {
      registerErrorMessage.value = "支払元の登録に失敗しました。";
    }

    // 登録失敗時は以降の処理を実行しない。
    return;
  }

  // 入力欄を初期化する。
  paymentMethodName.value = "";
  paymentType.value = "";

  // 登録成功メッセージを表示する。
  registerSuccessMessage.value = "登録しました";

  // 登録成功後は支払元一覧を閉じる。
  paymentMethodSettingTableRef.value?.closeAccordion();

  // 支払元一覧を再取得する。
  await fetchPaymentMethodList();
  // 登録成功後は画面の一番上へスクロールする。

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// ========================
// ④ 関数
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
  // 支払元は最低1件残す。
  if (paymentMethodList.value.length <= 1) {
    return;
  }

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
// ========================
// ⑤ ライフサイクル
// ========================
// 初期表示時に支払元一覧を取得する。
onMounted(async () => {
  await fetchPaymentMethodList();
});
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

    <!-- 一覧取得エラーメッセージ -->
    <div v-if="listErrorMessage" class="alert alert-danger">
      {{ listErrorMessage }}
    </div>
    <!-- 登録エラーメッセージ -->
    <div v-if="registerErrorMessage" class="alert alert-danger">
      {{ registerErrorMessage }}
    </div>
    <!-- 登録成功メッセージ -->
    <div v-if="registerSuccessMessage" class="alert alert-success">
      {{ registerSuccessMessage }}
    </div>

    <!-- 支払元一覧 -->
    <PaymentMethodsPaymentMethodSettingTable
      ref="paymentMethodSettingTableRef"
      :payment-method-list="paymentMethodList"
      :payment-type-list="paymentTypeList"
      @edit="openEditModal"
    />

    <!-- 新規登録 -->
    <PaymentMethodsPaymentMethodRegisterForm
      v-model:payment-method-name="paymentMethodName"
      v-model:payment-type="paymentType"
      :errors="errors"
      :payment-type-list="paymentTypeList"
      @register="registerPaymentMethod"
    />
  </main>

  <!-- 編集モーダル -->
  <PaymentMethodsPaymentMethodEditModal
    :is-open="isEditModalOpen"
    :payment-method="editingPaymentMethod"
    :payment-type-list="paymentTypeList"
    :max-display-order="paymentMethodList.length"
    @close="closeEditModal"
    @update="updatePaymentMethod"
    @delete="deletePaymentMethod"
  />
</template>
