<script setup>
// ========================
// ① import
// ========================

import { fetchCategories } from "~/api/categoryApi";

// ========================
// ② props / emits
// ========================

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },

  // 編集する変動費。
  // 新規登録時はnull。
  expense: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "register", "update"]);

// ========================
// ③ 状態
// ========================

// 変動費フォームのコンポーネント参照。
const variableExpenseFormRef = ref(null);

// 新規登録完了メッセージの表示状態。
const isRegisterSuccess = ref(false);

// カテゴリ一覧。
const categoryList = ref([]);

// カテゴリ一覧取得エラーメッセージ。
const categoryLoadError = ref("");

// ========================
// ④ computed
// ========================

// 編集対象がある場合は編集モード。
const isEditMode = computed(() => {
  return props.expense !== null;
});

// ========================
// ⑤ watch
// ========================

// モーダルが開いたタイミングでカテゴリ一覧を取得する。
watch(
  () => props.isOpen,
  async (isOpen) => {
    // モーダルを閉じた場合は取得しない。
    if (!isOpen) {
      return;
    }

    await fetchCategoryList();
  },
);

// ========================
// ⑥ API通信
// ========================

// カテゴリ一覧取得。
const fetchCategoryList = async () => {
  // 前回の取得エラーメッセージを初期化する。
  categoryLoadError.value = "";

  try {
    // カテゴリ一覧取得API。
    categoryList.value = await fetchCategories();
  } catch (error) {
    console.error("カテゴリ一覧の取得に失敗しました。", error);

    // 取得失敗時はカテゴリ一覧を空にする。
    categoryList.value = [];

    // エラーメッセージを設定する。
    categoryLoadError.value = "カテゴリ一覧の取得に失敗しました。";
  }
};

// ========================
// ⑦ 関数
// ========================

// モーダルを閉じる。
const closeModal = () => {
  // 次回モーダルを開いたときに登録完了メッセージが残らないようにする。
  isRegisterSuccess.value = false;

  emit("close");
};

// 登録・修正ボタン押下時。
const handleRegister = () => {
  // 入力チェックを実行する。
  const isValid = variableExpenseFormRef.value?.validate();

  // 入力エラーがある場合は終了。
  if (!isValid) {
    return;
  }

  // フォームの入力値を取得する。
  const formData = variableExpenseFormRef.value.getFormData();

  // 編集の場合。
  if (isEditMode.value) {
    emit("update", {
      ...props.expense,
      ...formData,
    });

    closeModal();
    return;
  }

  // 新規登録の場合。
  // API登録成功後に親コンポーネントから
  // フォーム初期化・登録完了表示を行うため、ここではモーダルを閉じない。
  emit("register", formData);
};

// 新規登録成功後の画面処理。
const handleRegisterSuccess = () => {
  // 入力フォームを初期化する。
  variableExpenseFormRef.value?.clearForm();

  // 登録完了メッセージを表示する。
  isRegisterSuccess.value = true;
};

// 登録完了メッセージを閉じる。
const closeRegisterSuccess = () => {
  isRegisterSuccess.value = false;
};

// 親コンポーネントから登録成功後の画面処理を呼べるようにする。
defineExpose({
  handleRegisterSuccess,
});
</script>
<template>
  <Teleport to="body">
    <template v-if="isOpen">
      <!-- モーダル -->
      <div
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        @click.self="closeModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content shadow">
            <!-- ヘッダー -->
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? "支出修正" : "支出登録" }}
              </h5>

              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>

            <!-- 本文 -->
            <div class="modal-body">
              <!-- カテゴリ一覧取得エラー -->
              <div
                v-if="categoryLoadError"
                class="alert alert-danger"
                role="alert"
              >
                {{ categoryLoadError }}
              </div>
              <!-- 登録完了メッセージ -->
              <div
                v-if="isRegisterSuccess"
                class="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                登録しました
                <button
                  type="button"
                  class="btn-close"
                  aria-label="閉じる"
                  @click="closeRegisterSuccess"
                ></button>
              </div>

              <HomeVariableExpenseForm
                ref="variableExpenseFormRef"
                :expense="expense"
                :category-list="categoryList"
              />
            </div>

            <!-- フッター -->
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" @click="closeModal">
                キャンセル
              </button>

              <button class="btn btn-primary" @click="handleRegister">
                {{ isEditMode ? "修正" : "登録" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 背景 -->
      <div class="modal-backdrop fade show"></div>
    </template>
  </Teleport>
</template>
