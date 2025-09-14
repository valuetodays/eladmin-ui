<template>
  <div id="memChart" style="width: 100%; height: 500px;"></div>
</template>

<script>
import echarts from 'echarts'
import dockerStatsApi from '@/api/dockerStats'

export default {
  name: 'MemUsageChart',
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      dockerStatsApi.chart({}).then(res => {
        const times = res.map(d => d.statDatetime)
        const values = res.map(d => d.memUsage2)
        this.chart = echarts.init(document.getElementById('memChart'))
        this.chart.setOption({
          title: {
            text: 'Docker 容器内存使用 (MB)'
          },
          tooltip: { trigger: 'axis'        },
          xAxis: { type: 'category', data: times },
          yAxis: { type: 'value', name: 'MB' },
          series: [{ type: 'line', name: '内存使用', smooth: true, data: values }]
        })
      });
    } // end of fetchData()

  } // end of methods:
}
</script>
