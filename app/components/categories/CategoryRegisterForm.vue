<script setup>
// ========================
// ① import
// ========================
import { REQUIRED_MESSAGE, isRequired } from "~/utils/validation";

// ========================
// ② 状態
// ========================

const categoryName = ref("");

const errors = ref({
  categoryName: "",
});

// ========================
// ③ watch
// ========================

// 入力されたらエラーを解除
watch(categoryName, () => {
  errors.value.categoryName = "";
});

// ========================
// ④ emits
// ========================
const emit = defineEmits(["register"]);

// ========================
// ⑤ 関数
// ========================

const validate = () => {
  errors.value = {
    categoryName: "",
  };

  let isValid = true;

  if (!isRequired(categoryName.value)) {
    errors.value.categoryName = REQUIRED_MESSAGE;
    isValid = false;
  }

  return isValid;
};

const registerCategory = () => {
  if (!validate()) {
    return;
  }

  emit("register", {
    name: categoryName.value.trim(),
  });
};

// 登録成功後にフォームを初期化する。
const handleRegisterSuccess = () => {
  categoryName.value = "";

  errors.value = {
    categoryName: "",
  };
};

// 親コンポーネントから呼び出せるようにする。
defineExpose({
  handleRegisterSuccess,
});
</script>

<template>
  <section class="card shadow-sm mb-4">
    <div class="card-header bg-white fw-bold">カテゴリを追加</div>

    <div class="card-body">
      <div class="row g-3">
        <div class="col-12">
          <label for="category-name" class="form-label">
            カテゴリ名
            <span class="text-danger">*</span>
          </label>

          <input
            id="category-name"
            v-model="categoryName"
            type="text"
            class="form-control"
            :class="{
              'is-invalid': errors.categoryName,
            }"
            maxlength="100"
            placeholder="例：食費"
          />

          <div v-if="errors.categoryName" class="invalid-feedback">
            {{ errors.categoryName }}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn btn-primary" @click="registerCategory">
          登録
        </button>
      </div>
    </div>
  </section>
</template>
