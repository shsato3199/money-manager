<script setup>
// ========================
// ① props / emits
// ========================

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// ========================
// ② 状態
// ========================

// 初期表示は変動費。
const selectedExpenseType = ref("VARIABLE");

// 変動費・固定費フォームのコンポーネント参照。
const variableExpenseFormRef = ref(null);
const fixedExpenseFormRef = ref(null);

// ========================
// ③ 関数
// ========================

// モーダルを閉じる。
const closeModal = () => {
  emit("close");
};

// 登録ボタン押下時。
const handleRegister = () => {
  const isValid =
    selectedExpenseType.value === "VARIABLE"
      ? variableExpenseFormRef.value?.validate()
      : fixedExpenseFormRef.value?.validate();

  // 入力エラーがある場合は終了。
  if (!isValid) {
    return;
  }

  // TODO:
  // API接続時に登録処理を書く。
  console.log("入力チェックOK");
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
              <h5 class="modal-title">支出登録</h5>

              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>

            <!-- 本文 -->
            <div class="modal-body">
              <div class="btn-group w-100 mb-3" role="group">
                <button
                  class="btn"
                  :class="
                    selectedExpenseType === 'VARIABLE'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="selectedExpenseType = 'VARIABLE'"
                >
                  変動費
                </button>

                <button
                  class="btn"
                  :class="
                    selectedExpenseType === 'FIXED'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="selectedExpenseType = 'FIXED'"
                >
                  固定費
                </button>
              </div>

              <HomeVariableExpenseForm
                v-if="selectedExpenseType === 'VARIABLE'"
                ref="variableExpenseFormRef"
              />

              <FixedExpensesFixedExpenseForm v-else ref="fixedExpenseFormRef" />
            </div>

            <!-- フッター -->
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" @click="closeModal">
                キャンセル
              </button>

              <button class="btn btn-primary" @click="handleRegister">
                登録
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
