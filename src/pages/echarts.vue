<template>
  <div class="echarts">
    <div id="testEcharts" style="width: 900px;height:600px"></div>
    <div class="canSelectWeek">
      <div class="selectCircle" ref="selectCircle"></div>
      <div class="block" v-for="(val, key) in arr" :key="key">
        <div class="box">
          <div class="circle" :title="val.timeRange" @click="selectWeek($event, key)"></div>
          <span style="font-size: 12px" class="character">{{ val.name }}</span>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      arr: [
        {
          timeRange: '20190902 - 20190908',
          name: '第一周'
        }, {
          timeRange: '20190909 - 20190915',
          name: '第二周'
        }, {
          timeRange: '20190916 - 20190922',
          name: '第三周'
        }, {
          timeRange: '20190923 - 20190929',
          name: '第四周'
        }, {
          timeRange: '20190930 - 20191006',
          name: '第五周'
        }, {
          timeRange: '20191007 - 20191013',
          name: '第六周'
        }, {
          timeRange: '20191014 - 20191020',
          name: '第七周'
        }, {
          timeRange: '20191021 - 20191027',
          name: '第八周'
        }
      ],
      currentIndex: 0
    }
  },
  methods: {
    selectWeek (event, index) {
      // console.log(event)
      // console.log(index)
      // console.log(this.$refs.selectCircle.offsetLeft)
      // let compareZero
      let speed = 8
      let clearIn = null
      if (index - this.currentIndex > 0) {
        let result = (index - this.currentIndex) * 90 + this.$refs.selectCircle.offsetLeft
        // console.log(result)
        clearIn = setInterval(() => {
          this.$refs.selectCircle.style.left = this.$refs.selectCircle.offsetLeft + speed + 'px'
          // console.log(this.$refs.selectCircle.offsetLeft)
          if (Number.parseInt(this.$refs.selectCircle.style.left) >= result) {
            this.$refs.selectCircle.style.left = result + 'px'
            clearInterval(clearIn)
            this.currentIndex = index
          }
        }, 5)
      } else {
        let result = (index - this.currentIndex) * 90 + this.$refs.selectCircle.offsetLeft
        // console.log(result)
        clearIn = setInterval(() => {
          this.$refs.selectCircle.style.left = this.$refs.selectCircle.offsetLeft - speed + 'px'
          // console.log(this.$refs.selectCircle.offsetLeft)
          if (Number.parseInt(this.$refs.selectCircle.style.left) <= result) {
            this.$refs.selectCircle.style.left = result + 'px'
            clearInterval(clearIn)
            this.currentIndex = index
          }
        }, 5)
      }
      // let multipleNumber = (index - this.currentIndex > 0) ? 1 : -1
      // let speed = 8
      // let result = multipleNumber * (index - this.currentIndex) * 90 + this.$refs.selectCircle.offsetLeft
      // let clearIn = setInterval(() => {
      //   this.$refs.selectCircle.style.left = this.$refs.selectCircle.offsetLeft + speed * multipleNumber + 'px'
      //   if (this.$refs.selectCircle.offsetLeft >= result) {
      //     this.$refs.selectCircle.style.left = result + 'px'
      //     clearInterval(clearIn)
      //     this.currentIndex = index
      //     console.log(this.currentIndex)
      //   }
      // }, 5)
    },
    initData () {
      // console.log(document.getElementById('testEcharts'))
      let myChart = this.$echarts.init(document.getElementById('testEcharts'))
      // console.log(myChart)
      let option = {
        color: ['#409eFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            // dataView: {show: true, readOnly: false},
            // magicType: {show: true, type: ['line', 'bar']},
            // restore: {show: true},
            // saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['正式员工', '实习生', '合作方', '离职人数', '入职人数']
        },
        xAxis: [
          {
            type: 'category',
            data: ['AIoT测试项目管理部', 'AIoT平台方案测试项目管理部', 'Auto测试项目管理部', '测试平台开发部', '测试数据管理部', '车系统测试部', '仿真测试部', '算法测试部', '系统软件测试部', '应用软件测试部', '硬件测试与认证部', '云服务测试部'],
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
        grid: {
          bottom: 120
        },
        yAxis: [
          {
            type: 'value',
            name: '人数',
            axisLabel: {
              formatter: '{value} 人'
            }
          }, {
            type: 'value',
            name: '入职/离职',
            axisLabel: {
              formatter: '{value} 人'
            }
          }
          // {
          //   type: 'value',
          //   name: '水量',
          //   min: 0,
          //   max: 250,
          //   interval: 50,
          //   axisLabel: {
          //     formatter: '{value} ml'
          //   }
          // }, {
          //   type: 'value',
          //   name: '温度',
          //   min: 0,
          //   max: 25,
          //   interval: 5,
          //   axisLabel: {
          //     formatter: '{value} °C'
          //   }
          // }
        ],
        series: [
          {
            name: '正式员工',
            type: 'bar',
            data: [20, 8, 11, 14, 22, 5, 8, 4, 13, 22, 3, 6],
            stack: 'people'
          }, {
            name: '实习生',
            type: 'bar',
            data: [3, 4, 7, 1, 2, 5, 13, 4, 8, 9, 12, 3],
            stack: 'people'
          }, {
            name: '合作方',
            type: 'bar',
            data: [5, 1, 8, 14, 22, 18, 9, 2, 9, 10, 11, 2],
            stack: 'people'
          }, {
            name: '离职人数',
            type: 'line',
            data: [1, 2, 3, 0, 2, 1, 3, 1, 0, 0, 1, 2],
            yAxisIndex: 1
          }, {
            name: '入职人数',
            type: 'line',
            data: [1, 0, 1, 2, 3, 0, 1, 2, 3, 2, 2, 2],
            yAxisIndex: 1
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  created () {
    this.$nextTick(() => {
      this.initData()
    })
  }
}
</script>

<style>
.echarts > .canSelectWeek {
  margin: 40px auto;
  width: 800px;
  background-color: pink;
  height: 40px;
  position: relative
}
.echarts > .canSelectWeek > .block {
  width: 90px;
  height: 100%;
  float: left;
  position: relative
}
.echarts > .canSelectWeek > .block > .box {
  width: 50px;
  height: 40px;
  float: left
}
.echarts > .canSelectWeek > .block > .box > .circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #000
}
.echarts > .canSelectWeek > .block > .box > .circle:hover {
  cursor: pointer;
  background-color: purple;
}
.echarts > .canSelectWeek > .block > .box > .character {
  display: inline-block;
  width: 50px;
  text-align: center;
  margin-left: -20px
}
.echarts > .canSelectWeek > .block > .line {
  width: 80px;
  height: 2px;
  background-color: #000;
  position: absolute;
  top: 4px;
  left: 10px
}
.echarts > .canSelectWeek > .block:nth-last-of-type(1) > .line {
  width: 0px;
  height: 0px;
  background-color: #fff;
}
.echarts > .canSelectWeek > .selectCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  left: -5px;
  top: -5px
}
</style>
