<template>
  <div class="staffStatistics">
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
        <div class="all smallBox" v-for="(val, key) in contentBox" :key="key" v-show="showEcharts">
          <span>{{ val.name }}</span>
          <span><span style="font-size: 36px;color: blue">{{ val.total }}</span>人</span>
        </div>
      </div>
      <!-- 图表数据 -->
      <div class="echarts">
        <div id="testEcharts" style="width: 100%;height: 550px" v-show="showEcharts"></div>
        <div style="width: 100%;height: 550px;text-align: center;box-sizing: border-box;padding: 200px" v-show="!showEcharts">
          <img :src="picSrc" style="display: block;margin: 0 auto">
          <span style="display: block">没有数据，无法显示</span>
        </div>
        <i class="el-icon-arrow-left leftArrow" @click="rightRemove" v-if="showX"></i>
        <div class="coordinate">
          <div class="canSelectWeek clearFix" ref="canSelectWeek">
            <div class="selectCircle" ref="selectCircle"></div>
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
import { getEmployeeReportByProject, getEmployeeReportByDepartment, getEmployeeReportByArea, getReportWeekNumber } from '../../api/api'
export default {
  data () {
    return {
      options: [
        {
          value: 'project',
          label: '项目'
        }, {
          value: 'department',
          label: '部门'
        }, {
          value: 'aera',
          label: '归属地'
        }
      ],
      value: 'project',
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
      contentBox: [],
      showEcharts: true,
      picSrc: require('../../assets/abnormal.png')
    }
  },
  methods: {
    getSelect (val) {
      console.log(val)
      this.value = val
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
    pictureEcharts (nameArr, regularEmployeeArr, cooperateEmployeeArr, practiceEmployeeArr, entryArr, quitArr) {
      let myChart = this.$echarts.init(document.getElementById('testEcharts'))
      let option = {
        title: {
          // text: this.titleText
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
          data: ['正式', '合作方', '实习', '离职', '入职']
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
            name: '离职/入职',
            axisLabel: {
              formatter: '{value} 人'
            }
          }
        ],
        series: [
          {
            name: '正式',
            type: 'bar',
            data: regularEmployeeArr,
            stack: 'people'
          }, {
            name: '合作方',
            type: 'bar',
            data: cooperateEmployeeArr,
            stack: 'people'
          }, {
            name: '实习',
            type: 'bar',
            data: practiceEmployeeArr,
            stack: 'people'
          }, {
            name: '离职',
            type: 'line',
            data: quitArr,
            yAxisIndex: 1
          }, {
            name: '入职',
            type: 'line',
            data: entryArr,
            yAxisIndex: 1
          }
        ]
      }
      myChart.setOption(option)
    },
    getRightData (getData) {
      let nameArr = []
      let totalPeopleArr = []
      let regularEmployeeArr = []
      let cooperateEmployeeArr = []
      let practiceEmployeeArr = []
      let entryArr = []
      let quitArr = []
      getData.forEach(ele => {
        nameArr.push(ele[0])
        totalPeopleArr.push(ele[1])
        regularEmployeeArr.push(ele[2])
        cooperateEmployeeArr.push(ele[3])
        practiceEmployeeArr.push(ele[4])
        entryArr.push(ele[5])
        quitArr.push(ele[6])
      })
      this.contentBox = nameArr.map((ele, index) => {
        return {
          name: ele,
          total: totalPeopleArr[index]
        }
      })
      this.pictureEcharts(nameArr, regularEmployeeArr, cooperateEmployeeArr, practiceEmployeeArr, entryArr, quitArr)
    },
    // 初始化图标，向后端获取图表数据
    initData () {
      if (this.value === 'project') {
        getEmployeeReportByProject({
          endDate: this.endDate
        }).then(res => {
          if (res.state === 1000) {
            if (res.data.resultData.length === 0) {
              this.$nextTick(() => {
                this.showEcharts = false
              })
            } else {
              this.showEcharts = true
              this.getRightData(res.data.resultData)
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      } else if (this.value === 'department') {
        getEmployeeReportByDepartment({
          endDate: this.endDate
        }).then(res => {
          if (res.state === 1000) {
            // this.getRightData(res.data.resultData)
            if (res.data.resultData.length === 0) {
              this.$nextTick(() => {
                this.showEcharts = false
              })
            } else {
              this.showEcharts = true
              this.getRightData(res.data.resultData)
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      } else {
        getEmployeeReportByArea({
          endDate: this.endDate
        }).then(res => {
          if (res.state === 1000) {
            // this.getRightData(res.data.resultData)
            if (res.data.resultData.length === 0) {
              this.$nextTick(() => {
                this.showEcharts = false
              })
            } else {
              this.showEcharts = true
              this.getRightData(res.data.resultData)
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      }
    }
  },
  created () {
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
            // console.log(this.arr)
            this.endDate = this.arr[this.arr.length - 1].timeRange.split('~')[1]
            this.initData()
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网路错误！')
      })
  }
}
</script>

<style>
.staffStatistics {
  width: 100%
}
.staffStatistics > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.staffStatistics > .header > .breadcrumb {
  margin-left: 10px
}
.staffStatistics > body {
  width: 1188px;
  min-height: 100px;
  border: 1px solid #ccc;
  margin: 20px auto 0px auto
}
.staffStatistics > body > .selectType {
  margin: 20px 0px 0px 20px
}
.staffStatistics > body > .box {
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
  padding: 20px 0px;
  flex-wrap: wrap
}
.staffStatistics > body > .box > .smallBox {
  width: 248px;
  height: 98px;
  border: 1px solid #ccc;
  vertical-align: center;
  margin-bottom: 30px;
  margin-left: 37.6px;
  background-color: #E1FFFF
}
.staffStatistics > body > .box > .smallBox > span {
  text-align: center;
  display: inline-block;
  width: 100%;
  padding-top: 20px
}
.staffStatistics > body > .box > .smallBox > span:nth-of-type(2) {
  padding-top: 5px
}
.staffStatistics > body > .echarts {
  position: relative
}
.staffStatistics > body > .echarts > .leftArrow {
  position: absolute;
  top: 555px;
  left: 100px;
  font-size: 60px
}
.staffStatistics > body > .echarts > .leftArrow:hover, .staffStatistics > body > .echarts > .rightArrow:hover {
  cursor: pointer;
  color: red
}
.staffStatistics > body > .echarts > .rightArrow {
  position: absolute;
  top: 555px;
  font-size: 60px;
  right: 100px
}
.staffStatistics > body > .echarts > #testEcharts {
  display: block
}
.staffStatistics > body > .echarts > .coordinate {
  max-width: 760px;
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
  position: relative
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek {
  margin: 20px auto;
  display: inline-block;
  padding: 10px 15px;
  width: 999%;
  position: absolute;
  height: 40px;
  position: relative
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block {
  width: 90px;
  height: 100%;
  float: left;
  position: relative
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block:nth-last-of-type(1) {
  width: 10px
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box {
  width: 10px;
  height: 40px;
  float: left
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #000
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .circle:hover {
  cursor: pointer;
  background-color: purple;
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .box > .character {
  display: inline-block;
  width: 50px;
  text-align: center;
  margin-left: -20px
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block > .line {
  width: 80px;
  height: 2px;
  background-color: #000;
  position: absolute;
  top: 4px;
  left: 10px
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .block:nth-last-of-type(1) > .line {
  width: 0px;
  height: 0px;
  background-color: #fff;
}
.staffStatistics > body > .echarts > .coordinate > .canSelectWeek > .selectCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 5px
}
</style>
