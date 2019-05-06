<template>
  <div>
    <com-crumb nm="数据"/>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 图表 -->
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入图标echarts
import echarts from 'echarts'
export default {
  mounted() {
    this.initEcharts()
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))

      // 获取数据
      var { data: dt } = await this.$http.get(`reports/type/1`)
      const option1 = dt.data
      //   console.log(dt)

      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }

      // 将两个结合到一起
      let option = { ...option1, ...option2 }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
