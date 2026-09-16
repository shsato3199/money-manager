<script setup>
const props = defineProps({
  paymentMethodList: {
    type: Array,
    required: true,
  },
  paymentTypeList: {
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

const getPaymentTypeLabel = (value) => {
  return (
    props.paymentTypeList.find((type) => type.value === value)?.label ?? ""
  );
};

const requestEdit = (paymentMethod) => {
  emit("edit", paymentMethod);
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
      <span>登録済み支払元</span>
      <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </button>

    <div v-if="isOpen" class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <!-- 編集アイコン列 -->
              <th class="text-center" style="width: 56px"></th>

              <th>支払元名</th>

              <th>種別</th>

              <th class="text-center">表示順</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="paymentMethod in paymentMethodList"
              :key="paymentMethod.id"
            >
              <!-- 編集 -->
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-link text-dark p-0"
                  aria-label="支払元を編集"
                  title="編集"
                  @click="requestEdit(paymentMethod)"
                >
                  <i class="bi bi-pencil-square fs-5"></i>
                </button>
              </td>

              <td>
                {{ paymentMethod.name }}
              </td>

              <td>
                {{ getPaymentTypeLabel(paymentMethod.paymentType) }}
              </td>

              <td class="text-center">
                {{ paymentMethod.displayOrder }}
              </td>
            </tr>

            <tr v-if="paymentMethodList.length === 0">
              <td colspan="4" class="text-center text-body-secondary py-4">
                支払元が登録されていません。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
