<script setup>
defineProps({
  categoryList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["edit"]);

// ========================
// ① 状態
// ========================

// 初期表示は閉じる
const isOpen = ref(false);

// ========================
// ② 関数
// ========================

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <section class="card shadow-sm mb-4">
    <!-- 見出し -->
    <button
      type="button"
      class="card-header bg-white border-0 w-100 d-flex align-items-center justify-content-between text-start"
      :aria-expanded="isOpen"
      @click="toggleAccordion"
    >
      <span class="fw-bold"> 登録済みカテゴリ </span>

      <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </button>

    <!-- 一覧 -->
    <div v-if="isOpen" class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 56px"></th>

              <th>カテゴリ名</th>

              <th style="width: 100px">表示順</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="category in categoryList" :key="category.id">
              <!-- 編集 -->
              <td>
                <button
                  type="button"
                  class="btn btn-link text-dark p-0"
                  aria-label="編集"
                  title="編集"
                  @click="emit('edit', category)"
                >
                  <i class="bi bi-pencil-square fs-5"></i>
                </button>
              </td>

              <!-- カテゴリ名 -->
              <td>
                {{ category.name }}
              </td>

              <!-- 表示順 -->
              <td>
                {{ category.displayOrder }}
              </td>
            </tr>

            <!-- 0件 -->
            <tr v-if="categoryList.length === 0">
              <td colspan="3" class="text-center text-body-secondary py-4">
                登録されているカテゴリはありません。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
