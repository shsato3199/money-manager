<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Chart.jsでドーナツグラフを描画するために必要な機能を登録する。
ChartJS.register(ArcElement, Tooltip, Legend);

// 現在日時を取得する。
const now = new Date();
// 現在の年をリアクティブな値として保持する。
const year = ref(now.getFullYear());
// 現在の月をリアクティブな値として保持する。
// getMonth() は 0 始まりなので +1 する。
const month = ref(now.getMonth() + 1);

// 画面表示用の「YYYY年MM月」を作る。
const displayYearMonth = computed(() => {
  return `${year.value}年${String(month.value).padStart(2, "0")}月`;
});

// 月を移動する共通処理。
// 前月なら -1、翌月なら 1 を渡す。
const moveMonth = (offset) => {
  // Date が年またぎ・月またぎを自動で補正してくれる。
  const targetDate = new Date(year.value, month.value - 1 + offset, 1);
  // 補正後の年をセットする。
  year.value = targetDate.getFullYear();
  // getMonth() は 0 始まりなので +1 する。
  month.value = targetDate.getMonth() + 1;
};
// 前月へ移動する。
const movePreviousMonth = () => moveMonth(-1);
// 翌月へ移動する。
const moveNextMonth = () => moveMonth(1);

// 月間集計の仮データ。
// API実装後は月間集計APIから取得した値に置き換える。
const fixedExpenseTotal = ref(152000);
const variableExpenseTotal = ref(83400);

// 固定費と変動費の合計を総支出として計算する。
const totalExpense = computed(() => {
  return fixedExpenseTotal.value + variableExpenseTotal.value;
});

// 金額を「¥235,400」の形式で表示する。
const formatAmount = (amount) => {
  return `¥${amount.toLocaleString()}`;
};
// 支出種別ごとの表示色。
// 色を変更するときは、ここだけ変更する。
const expenseColors = {
  fixed: "#5B8DEF",
  variable: "#FFB86B",
};
// ドーナツグラフに表示するデータ。
const chartData = computed(() => ({
  labels: ["固定費", "変動費"],
  datasets: [
    {
      data: [fixedExpenseTotal.value, variableExpenseTotal.value],
      backgroundColor: [expenseColors.fixed, expenseColors.variable],
      // グラフの区切り線を消す。
      borderWidth: 0,
    },
  ],
}));

// ドーナツグラフの表示設定。
const chartOptions = {
  // 親要素のサイズに合わせてグラフを伸縮する。
  responsive: true,
  // Chart.js標準の縦横比を使用しない。
  maintainAspectRatio: false,
  // 中央の穴の大きさ。
  cutout: "65%",
  plugins: {
    // Chart.js標準の凡例は非表示にする。
    // 今回は右側の固定費・変動費カードで内容を表示するため。
    legend: {
      display: false,
    },
  },
};
</script>

<template>
  <section class="container py-3">
    <div class="border bg-white px-1 py-1">
      <div class="row align-items-center">
        <!-- 前月 -->
        <div class="col-3 text-start">
          <button
            type="button"
            class="btn btn-link btn-sm text-dark text-decoration-none p-0 text-nowrap"
            aria-label="前月"
            title="前月"
            @click="movePreviousMonth"
          >
            <i class="bi bi-caret-left-fill"></i>
            <span class="fw-bold">前月</span>
          </button>
        </div>

        <!-- 対象年月 -->
        <div class="col-6 text-center">
          <span class="fw-bold">
            {{ displayYearMonth }}
          </span>
        </div>

        <!-- 翌月 -->
        <div class="col-3 text-end">
          <button
            type="button"
            class="btn btn-link btn-sm text-dark text-decoration-none p-0 text-nowrap"
            aria-label="翌月"
            title="翌月"
            @click="moveNextMonth"
          >
            <span class="fw-bold">翌月</span>
            <i class="bi bi-caret-right-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
  <!-- 月間支出サマリー -->
  <section class="container pb-3">
    <div class="border rounded bg-white p-3">
      <div class="row align-items-center g-3">
        <!-- 総支出：ドーナツグラフ -->
        <div class="col-12 col-md-5 d-flex justify-content-center">
          <div class="position-relative" style="width: 180px; height: 180px">
            <!-- Chart.jsのドーナツグラフ -->
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
