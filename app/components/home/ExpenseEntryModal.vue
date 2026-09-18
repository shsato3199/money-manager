<script setup>
// ========================
// ① props / emits
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
// ② 状態
// ========================

// 変動費フォームのコンポーネント参照。
const variableExpenseFormRef = ref(null);

// ========================
// ③ computed
// ========================

// 編集対象がある場合は編集モード。
const isEditMode = computed(() => {
  return props.expense !== null;
});

// ========================
// ④ 関数
// ========================

// モーダルを閉じる。
const closeModal = () => {
  emit("close");
};

// 登録・修正ボタン押下時。
const handleRegister = () => {
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
  emit("register", formData);

  closeModal();
};
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
              <HomeVariableExpenseForm
                ref="variableExpenseFormRef"
                :expense="expense"
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
