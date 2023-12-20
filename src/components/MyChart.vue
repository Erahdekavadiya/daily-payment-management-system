<template>
  <div>
    <!-- Your chart canvas -->
    <canvas ref="myChartCanvas"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import Chart from 'chart.js/auto';

export default defineComponent({
  props: {
    incomeData: {
      type: Array,
      default: () => [],
    },
    expenseData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const myChartCanvas = ref(null);
    let chartInstance = null;

    const updateChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (myChartCanvas.value) {
        const ctx = myChartCanvas.value.getContext('2d');
        const sortedIncomeData = props.incomeData.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        const sortedExpenseData = props.expenseData.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sortedIncomeData.map(item => item.date),
            datasets: [
              {
                label: 'Income',
                data: sortedIncomeData.map(item => item.amount),
                borderColor: 'rgba(56, 142, 60, 1)',
                backgroundColor: 'rgba(56, 142, 60, 0.2)',
                pointRadius: 5,
              },
              {
                label: 'Expenses',
                data: sortedExpenseData.map(item => item.amount),
                borderColor: 'rgba(211, 47, 47, 1)',
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                pointRadius: 5,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Amount',
                },
              },
            },
          },
        });
      }
    };

    watch(() => [props.incomeData, props.expenseData], () => {
      updateChart();
    });

    return { myChartCanvas, updateChart };
  },
});
</script>
