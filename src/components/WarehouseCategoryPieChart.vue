<template>
  <div>
    <h3>各仓库产品类别库存分布</h3>
    <div v-for="(products, warehouseId) in groupedProducts" :key="warehouseId" style="margin-bottom: 40px;">
      <h4>仓库 ID: {{ warehouseId }}</h4>
      <div ref="pieChart" :id="'pieChart-' + warehouseId" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'WarehouseCategoryPieChart',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      colorIndex: 0, // 颜色索引
      colors: [
        '#FF6384', // 红色
        '#36A2EB', // 蓝色
        '#FFCE56', // 黄色
        '#4BC0C0', // 青色
        '#9966FF', // 紫色
        '#FF9F40', // 橙色
        '#FF5733', // 深红色
        '#C70039', // 深粉色
        '#900C3F', // 深紫色
        '#581845'  // 深棕色
      ]
    };
  },
  computed: {
    groupedProducts() {
      // 根据 currentWarehouseId 分组产品
      return this.products.reduce((acc, product) => {
        const warehouseId = product.currentWarehouseId;
        if (!acc[warehouseId]) {
          acc[warehouseId] = [];
        }
        acc[warehouseId].push(product);
        return acc;
      }, {});
    }
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      // 为每个仓库绘制饼图
      for (const warehouseId in this.groupedProducts) {
        const chartDom = this.$refs.pieChart.find(chart => chart.id === 'pieChart-' + warehouseId);
        const myChart = echarts.init(chartDom);
        const option = this.getChartOptions(this.groupedProducts[warehouseId]);
        myChart.setOption(option);
      }
    },
    getChartOptions(products) {
      // 获取类别和库存数据
      const labels = [...new Set(products.map(product => product.category))];
      const data = labels.map(label => {
        return products
          .filter(product => product.category === label)
          .reduce((sum, product) => sum + product.stock, 0);
      });

      // 使用当前颜色索引
      const currentColors = labels.map((_, index) => {
        const color = this.colors[(this.colorIndex + index) % this.colors.length];
        return color;
      });

      // 更新颜色索引
      this.colorIndex += labels.length;

      return {
        title: {
          text: '产品库存分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: labels
        },
        series: [
          {
            name: '库存',
            type: 'pie',
            radius: '50%',
            data: labels.map((label, index) => ({
              value: data[index],
              name: label,
              itemStyle: {
                color: currentColors[index] // 使用当前饼图的颜色
              }
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.chart-container {
  margin-bottom: 40px; /* 每个饼图之间的间距 */
}
</style>