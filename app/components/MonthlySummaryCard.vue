<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Chart.jsでドーナツグラフを描画するために必要な機能を登録する。
ChartJS.register(ArcElement, Tooltip, Legend);

// index.vueから固定費合計・変動費合計を受け取る。
const props = defineProps({
  fixedExpenseTotal: {
    type: Number,
    required: true,
  },
  variableExpenseTotal: {
    type: Number,
    required: true,
  },
});

// 支出種別ごとの表示色。
// 色を変更するときは、ここだけ変更する。
const expenseColors = {
  fixed: "#5B8DEF",
  variable: "#FFB86B",
};

// 固定費と変動費の合計を総支出として計算する。
const totalExpense = computed(() => {
  return props.fixedExpenseTotal + props.variableExpenseTotal;
});

// 金額を「¥235,400」の形式で表示する。
const formatAmount = (amount) => {
  return `¥${amount.toLocaleString()}`;
};

// ドーナツグラフに表示するデータ。
const chartData = computed(() => ({
  labels: ["固定費", "変動費"],
  datasets: [
    {
      data: [props.fixedExpenseTotal, props.variableExpenseTotal],
      backgroundColor: [expenseColors.fixed, expenseColors.variable],
      borderWidth: 0,
    },
  ],
}));

// ドーナツグラフの表示設定。
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",

  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <section class="container pb-1">
    <div class="border rounded bg-white p-3">
      <div class="row align-items-center g-3">
        <!-- 総支出：ドーナツグラフ -->
        <div class="col-12 col-md-5 d-flex justify-content-center">
          <div class="position-relative" style="width: 180px; height: 180px">
            <Doughnut :data="chartData" :options="chartOptions" />

            <!-- ドーナツ中央 -->
            <div
              class="position-absolute top-50 start-50 translate-middle text-center"
            >
              <div class="small text-secondary">今月の総支出</div>

              <div class="fw-bold fs-5">
                {{ formatAmount(totalExpense) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 固定費・変動費 -->
        <div class="col-12 col-md-7">
          <div class="row g-2">
            <!-- 固定費 -->
            <div class="col-6">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span
                    class="rounded-circle flex-shrink-0"
                    :style="{
                      width: '12px',
                      height: '12px',
                      backgroundColor: expenseColors.fixed,
                    }"
                  ></span>

                  <span class="small fw-bold"> 固定費合計 </span>
                </div>

                <div class="fw-bold fs-5">
                  {{ formatAmount(fixedExpenseTotal) }}
                </div>
              </div>
            </div>

            <!-- 変動費 -->
            <div class="col-6">
              <div class="border rounded p-3 h-100">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span
                    class="rounded-circle flex-shrink-0"
                    :style="{
                      width: '12px',
                      height: '12px',
                      backgroundColor: expenseColors.variable,
                    }"
                  ></span>

                  <span class="small fw-bold"> 変動費合計 </span>
                </div>

                <div class="fw-bold fs-5">
                  {{ formatAmount(variableExpenseTotal) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
