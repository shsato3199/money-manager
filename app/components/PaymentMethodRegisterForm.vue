<script setup>
const props = defineProps({
  paymentMethodName: {
    type: String,
    required: true,
  },

  paymentType: {
    type: String,
    required: true,
  },

  displayOrder: {
    type: [String, Number],
    required: true,
  },

  errors: {
    type: Object,
    required: true,
  },

  paymentTypeList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "update:paymentMethodName",
  "update:paymentType",
  "update:displayOrder",
  "register",
]);
</script>

<template>
  <section class="card shadow-sm">
    <div class="card-header bg-white fw-bold">支払元を追加</div>

    <div class="card-body">
      <div class="row g-3">
        <!-- 支払元名 -->
        <div class="col-12 col-md-5">
          <label for="payment-method-name" class="form-label">
            支払元名
            <span class="text-danger">*</span>
          </label>

          <input
            id="payment-method-name"
            :value="paymentMethodName"
            type="text"
            class="form-control"
            :class="{
              'is-invalid': errors.paymentMethodName,
            }"
            maxlength="100"
            placeholder="例：楽天カード"
            @input="emit('update:paymentMethodName', $event.target.value)"
          />

          <div v-if="errors.paymentMethodName" class="invalid-feedback">
            {{ errors.paymentMethodName }}
          </div>
        </div>

        <!-- 種別 -->
        <div class="col-12 col-md-4">
          <label for="payment-type" class="form-label">
            種別
            <span class="text-danger">*</span>
          </label>

          <select
            id="payment-type"
            :value="paymentType"
            class="form-select"
            :class="{
              'is-invalid': errors.paymentType,
            }"
            @change="emit('update:paymentType', $event.target.value)"
          >
            <option value="" disabled>種別を選択してください</option>

            <option
              v-for="type in paymentTypeList"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>

          <div v-if="errors.paymentType" class="invalid-feedback">
            {{ errors.paymentType }}
          </div>
        </div>

        <!-- 表示順 -->
        <div class="col-12 col-md-3">
          <label for="display-order" class="form-label">
            表示順
            <span class="text-danger">*</span>
          </label>

          <input
            id="display-order"
            :value="displayOrder"
            type="number"
            min="1"
            step="1"
            class="form-control"
            :class="{
              'is-invalid': errors.displayOrder,
            }"
            placeholder="1"
            @input="emit('update:displayOrder', $event.target.value)"
          />

          <div v-if="errors.displayOrder" class="invalid-feedback">
            {{ errors.displayOrder }}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn btn-primary" @click="emit('register')">
          登録
        </button>
      </div>
    </div>
  </section>
</template>
