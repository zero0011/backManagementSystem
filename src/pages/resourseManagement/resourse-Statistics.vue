<template>
  <div class="resourseStatistics">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>报表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <body>
      <!-- 选择展示的报表类型 -->
      <div class="selectType">
        <span>下拉选择要展示的内容：</span>
        <el-select v-model="value" placeholder="请选择" class="selectShow" @change="getSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 方框数据 -->
      <div class="box">
        <div class="all smallBox">
          <span>空闲无负载：</span>
          <span><span style="font-size: 36px;color: blue">{{ tempData.staffSumInIdleLoad }}</span>人</span>
        </div>
        <div class="current2 smallBox">
          <span>轻度负载：</span>
          <span><span style="font-size: 36px;color: green">{{ tempData.staffSumInLightLoad }}</span>人</span>
        </div>
        <div class="want smallBox">
          <span>正常负载：</span>
          <span><span style="font-size: 36px;color: purple">{{ tempData.staffSumInNormalLoad }}</span>人</span>
        </div>
        <div class="need smallBox">
          <span>重度负载：</span>
          <span><span style="font-size: 36px;color: red">{{ tempData.staffSumInHeavyLoad }}</span>人</span>
        </div>
      </div>
      <!-- 图表数据 -->
      <div class="echarts">
        <div id="testEcharts" style="width: 100%;height: 550px" v-show="showEcharts"></div>
        <div style="width: 100%;height: 550px;text-align: center;box-sizing: border-box;padding: 200px" v-show="!showEcharts">
          <img :src="picSrc" style="display: block;margin: 0 auto">
          <span style="display: block">没有数据，无法显示</span>
        </div>
        <!-- <img :src="picSrc" v-else style="height: 150px;margin: 0 auto"> -->
        <i class="el-icon-arrow-left leftArrow" @click="rightRemove" v-if="showX"></i>
        <div class="coordinate">
          <div class="canSelectWeek clearFix" ref="canSelectWeek">
            <div class="selectCircle" ref="selectCircle" v-if="showX"></div>
            <div class="block" v-for="(val, key) in arr" :key="key">
              <div class="box">
                <div class="circle" :title="val.timeRange" @click="selectWeek($event, key, val.timeRange)"></div>
                <span style="font-size: 12px" class="character">第{{ val.name }}周</span>
              </div>
              <div class="line"></div>
            </div>
          </div>
        </div>
        <i class="el-icon-arrow-right rightArrow" @click="leftRemove" v-if="showX"></i>
      </div>
    </body>
  </div>
</template>

<script>
import { getHRReport, getReportWeekNumber } from '../../api/api'
export default {
  data () {
    return {
      options: [
        {
          value: 0,
          label: '项目'
        }, {
          value: 1,
          label: '部门'
        }
      ],
      value: 0,
      // 人数
      tempData: {},
      // 时间轴数组
      arr: [],
      // 时间轴的索引
      currentIndex: 0,
      // 存放周数信息
      weekData: [],
      // 图标的标题
      titleText: '',
      endDate: '',
      showX: false,
      showEcharts: true,
      picSrc: require('../../assets/abnormal.png')
    }
  },
  methods: {
    getSelect (val) {
      if (val === '') {
        this.value = val
      }
      this.initData()
    },
    // 点击左边实际向右移动
    rightRemove () {
      if (this.$refs.canSelectWeek.offsetLeft < 0) {
        let speed = 1
        let clearIn = null
        let result = this.$refs.canSelectWeek.offsetLeft + 90
        clearIn = setInterval(() => {
          this.$refs.canSelectWeek.style.left = this.$refs.canSelectWeek.offsetLeft + speed + 'px'
          if (Number.parseInt(this.$refs.canSelectWeek.style.left) >= result) {
            this.$refs.canSelectWeek.style.left = result + 'px'
            clearInterval(clearIn)
          }
        }, 5)
      }
    },
    // 点击向右实际向左移动
    leftRemove () {
      if (this.$refs.canSelectWeek.offsetLeft > (this.weekData.length - 1 - 8) * 90 * -1) {
        let speed = 1
        let clearIn = null
        let result = this.$refs.canSelectWeek.offsetLeft - 90
        clearIn = setInterval(() => {
          this.$refs.canSelectWeek.style.left = this.$refs.canSelectWeek.offsetLeft - speed + 'px'
          if (Number.parseInt(this.$refs.canSelectWeek.style.left) <= result) {
            this.$refs.canSelectWeek.style.left = result + 'px'
            clearInterval(clearIn)
          }
        }, 5)
      }
    },
    // 选择第几周
    selectWeek (event, index, date) {
      // console.log(index)
      // console.log(this.arr[index].name)
      // this.titleText = this.arr[index].name
      if (this.endDate !== date.split('~')[1]) {
        this.endDate = date.split('~')[1]
        this.initData()
      }
      let speed = 16
      let clearIn = null
      if (index - this.currentIndex > 0) {
        let result = (index - this.currentIndex) * 90 + this.$refs.selectCircle.offsetLeft
        clearIn = setInterval(() => {
          this.$refs.selectCircle.style.left = this.$refs.selectCircle.offsetLeft + speed + 'px'
          if (Number.parseInt(this.$refs.selectCircle.style.left) >= result) {
            this.$refs.selectCircle.style.left = result + 'px'
            clearInterval(clearIn)
            this.currentIndex = index
          }
        }, 5)
      } else {
        let result = (index - this.currentIndex) * 90 + this.$refs.selectCircle.offsetLeft
        clearIn = setInterval(() => {
          this.$refs.selectCircle.style.left = this.$refs.selectCircle.offsetLeft - speed + 'px'
          if (Number.parseInt(this.$refs.selectCircle.style.left) <= result) {
            this.$refs.selectCircle.style.left = result + 'px'
            clearInterval(clearIn)
            this.currentIndex = index
          }
        }, 5)
      }
    },
    pictureEcharts (nameArr, HRSumInIdleLoadArr, HRSumInLightLoadArr, HRSumInNormalLoadArr, HRSumInHeavyLoadArr, OverallHRSumArr) {
      let myChart = this.$echarts.init(document.getElementById('testEcharts'))
      let option = {
        title: {
          // text: '第' + this.titleText + '周'
        },
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
        legend: {
          data: ['空闲无负载', '轻度负载', '正常负载', '重度负载', '项目总的人力投入值']
        },
        xAxis: [
          {
            type: 'category',
            // x轴显示的内容
            data: nameArr,
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
            name: '项目总的人力投入值',
            axisLabel: {
              formatter: '{value} 人'
            }
          }
        ],
        series: [
          {
            name: '空闲无负载',
            type: 'bar',
            data: HRSumInIdleLoadArr,
            stack: 'people'
          }, {
            name: '轻度负载',
            type: 'bar',
            data: HRSumInLightLoadArr,
            stack: 'people'
          }, {
            name: '正常负载',
            type: 'bar',
            data: HRSumInNormalLoadArr,
            stack: 'people'
          }, {
            name: '重度负载',
            type: 'bar',
            data: HRSumInHeavyLoadArr,
            stack: 'people'
          }, {
            name: '项目总的人力投入值',
            type: 'line',
            data: OverallHRSumArr,
            yAxisIndex: 1
          }
        ]
      }
      myChart.setOption(option)
    },
    // 初始化图标，向后端获取图表数据
    initData () {
      getHRReport({
        queryDate: this.endDate,
        categoryType: this.value
      }).then(res => {
        if (res.state === 1000) {
          let nameArr = []
          let HRSumInIdleLoadArr = []
          let HRSumInLightLoadArr = []
          let HRSumInNormalLoadArr = []
          let HRSumInHeavyLoadArr = []
          let OverallHRSumArr = []
          this.tempData = res.data
          if (res.data.details.length === 0) {
            this.$nextTick(() => {
              this.showEcharts = false
            })
          } else {
            this.showEcharts = true
            res.data.details.forEach(ele => {
              nameArr.push(ele.name)
              HRSumInIdleLoadArr.push(ele.loadDetails.staffSumInIdleLoad)
              HRSumInLightLoadArr.push(ele.loadDetails.staffSumInLightLoad)
              HRSumInNormalLoadArr.push(ele.loadDetails.staffSumInNormalLoad)
              HRSumInHeavyLoadArr.push(ele.loadDetails.staffSumInHeavyLoad)
              OverallHRSumArr.push(ele.loadDetails.manpowerSum)
            })
            this.pictureEcharts(nameArr, HRSumInIdleLoadArr, HRSumInLightLoadArr, HRSumInNormalLoadArr, HRSumInHeavyLoadArr, OverallHRSumArr)
          }
          // res.data.details.forEach(ele => {
          //   nameArr.push(ele.name)
          //   HRSumInIdleLoadArr.push(ele.loadDetails.staffSumInIdleLoad)
          //   HRSumInLightLoadArr.push(ele.loadDetails.staffSumInLightLoad)
          //   HRSumInNormalLoadArr.push(ele.loadDetails.staffSumInNormalLoad)
          //   HRSumInHeavyLoadArr.push(ele.loadDetails.staffSumInHeavyLoad)
          //   OverallHRSumArr.push(ele.loadDetails.manpowerSum)
          // })
          // this.pictureEcharts(nameArr, HRSumInIdleLoadArr, HRSumInLightLoadArr, HRSumInNormalLoadArr, HRSumInHeavyLoadArr, OverallHRSumArr)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误')
      })
    }
  },
  mounted () {
    // 获取周数时间轴
    getReportWeekNumber({})
      .then(res => {
        if (res.state === 1000) {
          this.showX = true
          this.$nextTick(() => {
            this.weekData = res.data.weekData
            this.$refs.selectCircle.style.left = (this.weekData.length - 1) * 90 + this.$refs.selectCircle.offsetLeft + 'px'
            this.$refs.canSelectWeek.style.left = (this.weekData.length - 1 - 8) * 90 * -1 + 'px'
            this.currentIndex = this.weekData.length - 1
            this.arr = this.weekData.reverse().map(ele => {
              return {
                timeRange: ele.startDate + '~' + ele.endDate,
                name: ele.weekNumber
              }
            })
            this.endDate = this.arr[this.arr.length - 1].timeRange.split('~')[1]
            this.initData()
            // this.titleText = this.arr[this.arr.length - 1].name
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误！')
      })
  }
}
</script>

<style>
.resourseStatistics {
  width: 100%
}
.resourseStatistics > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.resourseStatistics > .header > .breadcrumb {
  margin-left: 10px
}
.resourseStatistics > body {
  width: 1188px;
  min-height: 100px;
  border: 1px solid #ccc;
  margin: 20px auto 0px auto
}
.resourseStatistics > body > .selectType {
  margin: 20px 0px 0px 20px;
}
.resourseStatistics > body > .box {
  width: 100%;
  height: 100px;
  display: flex;
  /* justify-content: space-around; */
  align-items: center;
  padding: 20px 0px
}
.resourseStatistics > body > .box > .smallBox {
  width: 248px;
  height: 98px;
  border: 1px solid #ccc;
  margin-left: 37.6px;
  vertical-align: center
}
.resourseStatistics > body > .box > .smallBox:nth-of-type(1) {
  background-color: #E1FFFF
}
.resourseStatistics > body > .box > .smallBox:nth-of-type(2) {
  background-color: #E1FFFF
}
.resourseStatistics > body > .box > .smallBox:nth-of-type(3) {
  background-color: #E1FFFF
}
.resourseStatistics > body > .box > .smallBox:nth-of-type(4) {
  background-color: #E1FFFF
}
.resourseStatistics > body > .box > .smallBox > span {
  text-align: center;
  display: inline-block;
  width: 100%;
  padding-top: 20px
}
.resourseStatistics > body > .box > .smallBox > span:nth-of-type(2) {
  padding-top: 5px
}
.resourseStatistics > body > .echarts {
  position: relative
}
.resourseStatistics > body > .echarts > .leftArrow {
  position: absolute;
  top: 555px;
  left: 100px;
  font-size: 60px
}
.resourseStatistics > body > .echarts > .leftArrow:hover, .resourseStatistics > body > .echarts > .rightArrow:hover {
  cursor: pointer;
  color: red
}
.resourseStatistics > body > .echarts > .rightArrow {
  position: absolute;
  top: 555px;
  font-size: 60px;
  right: 100px
}
.resourseStatistics > body > .echarts > #testEcharts {
  display: block
}
.resourseStatistics > body > .echarts > .coordinate {
  max-width: 760px;
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
  position: relative
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek {
  margin: 20px auto;
  display: inline-block;
  padding: 10px 15px;
  width: 999%;
  position: absolute;
  height: 40px;
  position: relative
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block {
  width: 90px;
  height: 100%;
  float: left;
  position: relative
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block:nth-last-of-type(1) {
  width: 10px
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box {
  width: 10px;
  height: 40px;
  float: left
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #000
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .circle:hover {
  cursor: pointer;
  background-color: purple;
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .character {
  display: inline-block;
  width: 50px;
  text-align: center;
  margin-left: -20px
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .line {
  width: 80px;
  height: 2px;
  background-color: #000;
  position: absolute;
  top: 4px;
  left: 10px
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .block:nth-last-of-type(1) > .line {
  width: 0px;
  height: 0px;
  background-color: #fff;
}
.resourseStatistics > body > .echarts > .coordinate > .canSelectWeek > .selectCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 5px
}
</style>
