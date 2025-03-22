<template>
  <div>
    <h2>出入库分析</h2>
    <div>
      <h3>出库图</h3>
      <el-card>
        <div ref="outboundChart" style="height: 400px;"></div>
      </el-card>
    </div>
    <div>
      <h3>入库图</h3>
      <el-card>
        <div ref="inboundChart" style="height: 400px;"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import api from '@/utils/api'; // 确保正确导入 api.js

export default {
  name: 'StockAnalysis',
  data() {
    return {
      outboundData: [], // 存储出库数据
      inboundData: [] // 存储入库数据
    };
  },
  mounted() {
    this.fetchTransferRecords(); // 组件挂载后获取转移记录
  },
  methods: {
    fetchTransferRecords() {
      api.transferRecord.fetchAllTransferRecords().then(response => {
        const records = response.data;
        this.processTransferRecords(records); // 处理转移记录
      }).catch(error => {
        console.error("获取转移记录失败:", error);
      });
    },
    processTransferRecords(records) {
      const outboundMap = {};
      const inboundMap = {};

      records.forEach(record => {
        const date = new Date(record.transferTime).toLocaleDateString(); // 获取日期
        const quantity = record.quantity;

        // 处理出库数据
        if (!outboundMap[record.fromWarehouseId]) {
          outboundMap[record.fromWarehouseId] = {};
        }
        if (!outboundMap[record.fromWarehouseId][date]) {
          outboundMap[record.fromWarehouseId][date] = 0;
        }
        outboundMap[record.fromWarehouseId][date] += quantity;

        // 处理入库数据
        if (!inboundMap[record.toWarehouseId]) {
          inboundMap[record.toWarehouseId] = {};
        }
        if (!inboundMap[record.toWarehouseId][date]) {
          inboundMap[record.toWarehouseId][date] = 0;
        }
        inboundMap[record.toWarehouseId][date] += quantity;
      });

      // 转换为数组格式
      this.outboundData = this.convertMapToArray(outboundMap);
      this.inboundData = this.convertMapToArray(inboundMap);

      // 绘制图表
      this.drawOutboundChart();
      this.drawInboundChart();
    },
    convertMapToArray(map) {
      return Object.keys(map).map(warehouseId => ({
        warehouseId,
        data: Object.keys(map[warehouseId]).map(date => ({
          date,
          quantity: map[warehouseId][date]
        }))
      }));
    },
    drawOutboundChart() {
      const chartDom = this.$refs.outboundChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '出库分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.outboundData.map(item => `仓库 ID: ${item.warehouseId}`)
        },
        xAxis: {
          type: 'category',
          data: this.getDates(this.outboundData)
        },
        yAxis: {
          type: 'value'
        },
        series: this.outboundData.map(item => ({
          name: `仓库 ID: ${item.warehouseId}`,
          type: 'line',
          data: this.getSeriesData(item.data)
        }))
      };
      myChart.setOption(option);
    },
    drawInboundChart() {
      const chartDom = this.$refs.inboundChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '入库分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.inboundData.map(item => `仓库 ID: ${item.warehouseId}`)
        },
        xAxis: {
          type: 'category',
          data: this.getDates(this.inboundData)
        },
        yAxis: {
          type: 'value'
        },
        series: this.inboundData.map(item => ({
          name: `仓库 ID: ${item.warehouseId}`,
          type: 'line',
          data: this.getSeriesData(item.data)
        }))
      };
      myChart.setOption(option);
    },
    getDates(data) {
      const allDates = new Set();
      data.forEach(item => {
        item.data.forEach(entry => {
          allDates.add(entry.date);
        });
      });
      return Array.from(allDates).sort(); // 返回排序后的日期数组
    },
    getSeriesData(data) {
      const seriesData = {};
      data.forEach(entry => {
        seriesData[entry.date] = entry.quantity;
      });
      return this.getDates(this.outboundData).map(date => seriesData[date] || 0); // 返回对应日期的数量
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
</style>