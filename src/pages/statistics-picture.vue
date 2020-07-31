<template>
  <div class="statisticsPicture">
    <body>
      <div class="echartsOne echarts">
        <div id="echartsOne" style="width: 100%;height:350px"></div>
      </div>
      <div class="echartsTwo echarts">
        <div id="echartsTwo" style="width: 100%;height:350px"></div>
      </div>
      <div class="echartsThr echarts">
        <div id="echartsThr" style="width: 100%;height:350px"></div>
      </div>
      <div class="echartsFou echarts">
        <div id="echartsFou" style="width: 100%;height:350px"></div>
      </div>
    </body>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // one
    let myChartOne = this.$echarts.init(document.getElementById('echartsOne'))
    const optionOne = {
      title: {
        text: '人员总体情况'
      },
      color: ['#2790B9'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: [
        {
          type: 'category',
          // x轴显示的内容
          data: ['测试平台开发部', 'AIoT测试项目管理部', 'AIoT平台方案测试项目管理部', 'Auto测试项目管理部', '测试数据管理部', '测试平台开发部', 'AIoT测试项目管理部', 'AIoT平台方案测试项目管理部', 'Auto测试项目管理部', '测试数据管理部'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: -90,
            show: true,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '人数',
          axisLabel: {
            formatter: '{value} 人'
          }
        }
      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          data: [6, 5, 3, 9, 6, 6, 5, 3, 9, 6],
          stack: 'people'
        }
      ]
    }
    myChartOne.setOption(optionOne)
    // two
    let myChartTwo = this.$echarts.init(document.getElementById('echartsTwo'))
    const optionTwo = {
      title: {
        text: '项目人力及缺口情况'
      },
      color: ['#2790B9', '#4E4ED5'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data:['项目人数', '人力需求']
      // },
      xAxis: [
        {
          type: 'category',
          // x轴显示的内容
          data: ['项目1', '项目2', '项目3', '项目4', '项目5', '项目1', '项目2', '项目3', '项目4', '项目5'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: -90,
            show: true,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '人数',
          axisLabel: {
            formatter: '{value} 人'
          }
        }
        // }, {
        //   type: 'value',
        //   name: '人力需求数',
        //   axisLabel: {
        //     formatter: '{value} 人'
        //   }
        // }
      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          data: [6, 5, 3, 9, 6, 6, 5, 3, 9, 6],
          stack: 'people'
        }, {
          name: '人力需求',
          type: 'line',
          data: [1, 2, 3, 4, 4, 1, 2, 3, 4, 4],
          // yAxisIndex: 1,
          stack: 'people'
        }
      ]
    }
    myChartTwo.setOption(optionTwo)
    // three
    let myChartThr = this.$echarts.init(document.getElementById('echartsThr'))
    const optionThr = {
      title: {
        text: '项目人力投入情况'
      },
      color: ['#4E4ED5'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data:['人力数值']
      // },
      xAxis: [
        {
          type: 'category',
          // x轴显示的内容
          data: ['项目1', '项目2', '项目3', '项目4', '项目5', '项目1', '项目2', '项目3', '项目4', '项目5'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: -90,
            show: true,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '人力投入值',
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '人力投入值',
          type: 'bar',
          data: [0.8, 1.2, 2.2, 9.1, 6.5, 6.2, 5.0, 3.0, 9.1, 6.3],
          stack: 'people'
        }
      ]
    }
    myChartThr.setOption(optionThr)
    // four
    let myChartFou = this.$echarts.init(document.getElementById('echartsFou'))
    const optionFou = {
      title: {
        text: '单项目人力投入情况'
      },
      color: ['#4E4ED5'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data:['人力数值']
      // },
      xAxis: [
        {
          type: 'category',
          // x轴显示的内容
          data: ['2019-10-08', '2019-10-09', '2019-10-10', '2019-10-11', '2019-10-12'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: -90,
            show: true,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '单项目人力需求值',
          axisLabel: {
            formatter: '{value} 人'
          }
        }
      ],
      series: [
        {
          name: '单项目人力需求值',
          type: 'line',
          data: [1, 3, 5, 2, 1],
          stack: 'people'
        }
      ]
    }
    myChartFou.setOption(optionFou)
  }
}
</script>

<style>
.statisticsPicture {
  width: 100%
}
.statisticsPicture > body {
  width: 100%;
  height: 800px;
  display: flex;
  flex-wrap: wrap
}
.statisticsPicture > body > .echarts {
  width: 50%;
  height: 400px;
  box-sizing: border-box
}
.statisticsPicture > body > .echarts:nth-of-type(1) {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.statisticsPicture > body > .echarts:nth-of-type(2) {
  border-bottom: 1px solid #ccc
}
.statisticsPicture > body > .echarts:nth-of-type(3) {
  border-right: 1px solid #ccc
}
</style>
