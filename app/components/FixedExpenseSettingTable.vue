<script setup>
const props = defineProps({
  fixedExpenseList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["edit"]);

// 初期表示は閉じる。
const isOpen = ref(false);

// 開閉切り替え。
const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};

// 編集要求を親へ通知する。
const requestEdit = (fixedExpense) => {
  emit("edit", fixedExpense);
};
</script>

<template>
  <section class="card shadow-sm mb-4">
    <button
      type="button"
      class="card-header bg-white fw-bold w-100 d-flex align-items-center justify-content-between border-0 text-start"
      :aria-expanded="isOpen"
      @click="toggleAccordion"
    >
      <span>登録済み固定費</span>

      <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </button>

    <div v-if="isOpen" class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <!-- 編集アイコン -->
              <th class="text-center" style="width: 56px"></th>
              <th>固定費名</th>
              <th>金額</th>
              <th>カテゴリ</th>
              <th>支払元</th>
              <th class="text-center">支払日</th>
              <th class="text-center">表示順</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="fixedExpense in fixedExpenseList" :key="fixedExpense.id">
              <!-- 編集 -->
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-link text-dark p-0"
                  aria-label="固定費を編集"
                  title="編集"
                  @click="requestEdit(fixedExpense)"
                >
                  <i class="bi bi-pencil-square fs-5"></i>
                </button>
              </td>
              <td>
                {{ fixedExpense.fixedExpenseName }}
              </td>
              <td>¥{{ fixedExpense.amount.toLocaleString() }}</td>
              <td>
                {{ fixedExpense.categoryName }}
              </td>
              <td>
                {{ fixedExpense.paymentMethodName }}
              </td>
              <td class="text-center">{{ fixedExpense.paymentDay }}日</td>
              <td class="text-center">
                {{ fixedExpense.displayOrder }}
              </td>
            </tr>

            <tr v-if="fixedExpenseList.length === 0">
              <td colspan="7" class="text-center text-body-secondary py-4">
                固定費が登録されていません。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
