<template>
  <div class="static-pie-chart">
    <h3>静态饼图示例</h3>
    <pie-chart :chart-data="chartData" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

export default {
  name: 'StaticPieChart',
  components: {
    PieChart: Pie
  },
  data() {
    return {
      chartData: {
        labels: ['类别1', '类别2'],
        datasets: [{
          label: '测试数据',
          data: [30, 70],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverOffset: 4
        }]
      }
    };
  }
};
</script>

<style scoped>
.static-pie-chart {
  margin-bottom: 40px; /* 每个饼图之间的间距 */
}
</style>