<template>
  <div id="memChart" style="width: 100%; height: 500px;"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'MemUsageChart',
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById('memChart'))
      const option = {
        title: {
          text: 'Docker 容器内存使用 (MiB)'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [
            '2025-09-14 19:16:04',
            '2025-09-14 19:24:04',
            '2025-09-14 19:32:03',
            '2025-09-14 19:40:04'
          ]
        },
        yAxis: {
          type: 'value',
          name: 'MiB'
        },
        series: [
          {
            name: '内存使用',
            type: 'line',
            smooth: true,
            data: [597.9, 597.9, 597.9, 597.9]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
