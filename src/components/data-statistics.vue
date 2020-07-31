<template>
  <div class="dataStatistics">
    <div class="header">
      <el-switch v-model="modelType" active-text="宽屏显示" inactive-text="正常显示" active-color="#13ce66" inactive-color="#409EFF" @change="getModelType"></el-switch>
      <el-button type="primary"  class="historyDataDetails" @click="jump">历史数据明细</el-button>
      <!-- <div class="normalShow" @click="showType('normalShow')" ref="normalShow">正常显示</div>
      <div class="wideScreenShow"  @click="showType('wideScreenShow')"  ref="wideScreenShow">宽屏显示</div> -->
    </div>
    <div class="page1" v-show="!modelType">
      <!-- 上左 -->
      <div class="chunk">
        <!-- 标题 -->
        <div class="title">测试部人员总体分类情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffNumberByType">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 日期选择下拉框 -->
        <el-select v-model="value1" placeholder="请选择" @change="getChunkDate($event, 'first')">
          <el-option
            v-for="date in dateArrOne"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 左边的饼图 -->
        <div class="left">
          <div id="leftCircle" style="width: 100%;height:300px" v-show="showLeftCirclePic"></div>
          <img :src="srcPic" style="margin-top: 70px" v-show="!showLeftCirclePic">
          <span style="margin-top: 10px;display: block" v-show="!showLeftCirclePic">暂无数据</span>
        </div>
        <!-- 右边的饼图 -->
        <div class="right">
          <div id="rightCircle" style="width: 100%;height:300px" v-if="showRightCirclePic"></div>
          <img :src="srcPic" style="margin-top: 70px" v-show="!showRightCirclePic">
          <span style="margin-top: 10px;display: block" v-show="!showRightCirclePic">暂无数据</span>
        </div>
      </div>
      <!-- 上右 -->
      <div class="chunk">
        <!-- 标题 -->
        <div class="title">测试部人员数量情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffNumberByDepartment">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 切换控件 -->
        <div class="buttonLeft" @click="selectShow('firstDep')" ref="firstDep">测试部</div>
        <div class="buttonRight"  @click="selectShow('secondDep')"  ref="secondDep">二级部门</div>
        <!-- 日期选择下拉框 -->
        <el-select v-model="value2" placeholder="请选择" @change="getChunkDate($event, 'second')" v-if="!dep">
          <el-option
            v-for="date in dateArrTwo"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 部门选择 -->
        <div class="firstDep">
          <div id="firstDep" style="width: 100%;height:300px"></div>
        </div>
      </div>
      <!-- 下左 -->
      <div class="chunk">
        <div class="title">项目人员数量情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffGapByProject">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 项目选择 -->
        <el-select v-model="value3" placeholder="请选择" @change="getChunkDate($event, 'third')" class="projectSelect">
          <el-option
            v-for="date in dateArrThree"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 日期选择 -->
        <el-select v-model="value4" placeholder="请选择" @change="getChunkDate($event, 'fourth')" v-if="pjt">
          <el-option
            v-for="date in dateArrFour"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <div class="thirdEcharts" v-if="pjt">
          <div id="thirdEcharts" style="width: 100%;height:300px" ></div>
        </div>
        <div class="thirdEcharts"  v-else>
          <div id="thirdEchartsTwo" style="width: 100%;height:300px"></div>
        </div>
      </div>
      <!-- 下右 -->
      <div class="chunk">
        <div class="title">项目人力投入及需求情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getHrPutInByProject">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 项目选择 -->
        <el-select v-model="value5" placeholder="请选择" @change="getChunkDate($event, 'fifth')" class="projectSelect">
          <el-option
            v-for="date in dateArrFive"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 日期选择 -->
        <el-select v-model="value6" placeholder="请选择" @change="getChunkDate($event, 'sixth')" v-if="pjt2">
          <el-option
            v-for="date in dateArrSix"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <div class="fourthEcharts" v-if="pjt2">
          <div id="fourthEcharts" style="width: 100%;height:300px" ></div>
        </div>
        <div class="fourthEcharts"  v-else>
          <div id="fourthEchartsTwo" style="width: 100%;height:300px"></div>
        </div>
      </div>
    </div>
    <div class="page2" v-show="modelType">
      <!-- 测试部人员总体分类情况 -->
      <div class="element">
        <!-- 标题 -->
        <div class="title">测试部人员总体分类情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffNumberByType">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 日期选择下拉框 -->
        <el-select v-model="page2Value1" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherFirst')">
          <el-option
            v-for="date in dateArrOne"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <div class="picture">
          <div class="left">
            <div id="page2FirstPic1" style="width: 100%;height:300px" v-show="showPage2FirstPic1"></div>
            <img :src="srcPic" style="margin-top: 70px" v-show="!showPage2FirstPic1">
            <span style="margin-top: 10px;display: block" v-show="!showPage2FirstPic1">暂无数据</span>
          </div>
          <div class="right">
            <div id="page2FirstPic2" style="width: 100%;height:300px" v-if="showPage2FirstPic2"></div>
            <img :src="srcPic" style="margin-top: 70px" v-show="!showPage2FirstPic2">
            <span style="margin-top: 10px;display: block" v-show="!showPage2FirstPic2">暂无数据</span>
          </div>
        </div>
      </div>
      <!-- 测试部人员数量情况 -->
      <div class="element">
        <div class="title">测试部人员数量情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffNumberByDepartment">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 切换控件 -->
        <div class="buttonLeft" @click="selectFirstDep('firstDep')" ref="firstDep2">测试部</div>
        <div class="buttonRight"  @click="selectFirstDep('secondDep')"  ref="secondDep2">二级部门</div>
        <!-- 日期选择下拉框 -->
        <el-select v-model="page2Value2" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherSecond')" v-if="!page2Dep">
          <el-option
            v-for="date in dateArrTwo"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 部门选择 -->
        <div class="firstDep">
          <div id="page2SecondPic" style="width: 100%;height:300px"></div>
        </div>
      </div>
      <!-- 项目人力缺口情况 -->
      <div class="element">
        <div class="title">项目人员数量情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getStaffGapByProject">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 项目选择 -->
        <el-select v-model="page2Value3" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherThird')" class="projectSelect">
          <el-option
            v-for="date in dateArrThree"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 日期选择 -->
        <el-select v-model="page2Value4" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherFourth')" v-if="page2pjt">
          <el-option
            v-for="date in dateArrFour"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <div class="thirdEcharts" v-if="page2pjt">
          <div id="page2ThirdPic" style="width: 100%;height:300px" ></div>
        </div>
        <div class="thirdEcharts"  v-else>
          <div id="page2ThirdPicTwo" style="width: 100%;height:300px"></div>
        </div>
      </div>
      <!-- 项目人力投入情况 -->
      <div class="element">
        <div class="title">项目人力投入及需求情况</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="tipArr.getHrPutInByProject">
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
        <!-- 项目选择 -->
        <el-select v-model="page2Value5" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherFifth')" class="projectSelect">
          <el-option
            v-for="date in dateArrFive"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <!-- 日期选择 -->
        <el-select v-model="page2Value6" placeholder="请选择" @change="getPage2ChunkDate($event, 'anotherSixth')" v-if="page2pjt2">
          <el-option
            v-for="date in dateArrSix"
            :key="date.value"
            :label="date.label"
            :value="date.value">
          </el-option>
        </el-select>
        <div class="fourthEcharts" v-if="page2pjt2">
          <div id="page2FourthPic" style="width: 100%;height:300px" ></div>
        </div>
        <div class="fourthEcharts"  v-else>
          <div id="page2FourthPicTwo" style="width: 100%;height:300px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStaffNumberByType, getStaffNumberByDepartment, getStaffNumberByProject, getHrPutInAndExpectByProject, getReportWeekNumber, getHelpTips } from '../api/api'
export default {
  data () {
    return {
      dateArrOne: [],
      dateArrTwo: [],
      dateArrThree: [],
      dateArrFour: [],
      dateArrFive: [],
      dateArrSix: [],
      value1: '',
      value2: '',
      value3: 'All',
      value4: '',
      value5: 'All',
      value6: '',
      dep: true,
      pjt: true,
      pjt2: true,
      queryDateFirst: '',
      departmentType: 1,
      queryDateSecond: '',
      projectType: 1,
      projectName: '',
      queryDateThird: '',
      translateDate: [],
      projectType2: 1,
      projectName2: '',
      queryDateFourth: '',
      showLeftCirclePic: true,
      showRightCirclePic: true,
      srcPic: require('../assets/abnormal.png'),
      tipArr: [],
      // 正常显示还是全屏显示
      modelType: false,
      // 全屏显示的第一报表的日期选择
      page2Value1: '',
      page2Value2: '',
      page2Value3: '',
      page2Value4: '',
      page2Value5: '',
      page2Value6: '',
      pageQueryDateSecond: '',
      showPage2FirstPic1: true,
      showPage2FirstPic2: true,
      page2DepartmentType: 1,
      page2Dep: true,
      page2QueryDateSecond: '',
      page2pjt: true,
      page2pjt2: true,
      page2ProjectType: 1,
      page2ProjectName: 'All',
      page2QueryDateThird: '',
      tempPage2QueryDateThird: '',
      page2ProjectType2: 1,
      page2ProjectName2: 'All',
      page2QueryDateFourth: '',
      tempPage2QueryDateFourth: ''
    }
  },
  methods: {
    jump () {
      this.$router.push({
        path: '/historyDataDetails'
      })
    },
    // 图表二的测试部与二级部门按钮来回切换
    selectFirstDep (action) {
      if (action === 'firstDep') {
        this.$refs.firstDep2.style.backgroundColor = 'rgba(64,158,255,1)'
        this.$refs.firstDep2.style.color = 'rgba(255,255,255,1)'
        this.$refs.secondDep2.style.backgroundColor = 'rgba(255,255,255,1)'
        this.$refs.secondDep2.style.color = 'rgba(64,158,255,1)'
        this.page2Dep = true
        this.page2DepartmentType = 1
        this.page2QueryDateSecond = ''
        this.anotherSecond()
      } else {
        this.$refs.firstDep2.style.backgroundColor = 'rgba(255,255,255,1)'
        this.$refs.firstDep2.style.color = 'rgba(64,158,255,1)'
        this.$refs.secondDep2.style.backgroundColor = 'rgba(64,158,255,1)'
        this.$refs.secondDep2.style.color = 'rgba(255,255,255,1)'
        this.page2Dep = false
        this.page2DepartmentType = 2
        if (this.pageQueryDateSecond === '') {
          this.anotherSecond(this.translateDate[0].value)
        } else {
          this.anotherSecond(this.pageQueryDateSecond)
        }
      }
    },
    // 全屏：测试部人员总体分类情况右边
    getPage2FirstRight (res) {
      const _this = this
      const page2FirstPic2 = this.$echarts.init(document.getElementById('page2FirstPic2'))
      page2FirstPic2.off('click')
      const page2FirstPic2Option = {
        color: ['#409EFF', '#00D0BB', '#FFD33D', '#F56C6C'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          icon: 'circle',
          orient: 'horizontal',
          top: '40px',
          right: '10%',
          itemWidth: 9,
          itemHeight: 9,
          formatter: ' {name}',
          // data: ['空闲', '轻负载', '正常负载', '重负载']
          data: ['空闲负载', '普通负载', '满负载', '过度负载']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['45%', '60%'],
            data: [
              {
                value: res.data.hunmanPutIntoNumber.freeLoad,
                name: '空闲负载'
              }, {
                value: res.data.hunmanPutIntoNumber.lowLoad,
                name: '普通负载'
              }, {
                value: res.data.hunmanPutIntoNumber.normalLoad,
                name: '满负载'
              }, {
                value: res.data.hunmanPutIntoNumber.heavyLoad,
                name: '过度负载'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{c}' + '人'
            }
          }
        ]
      }
      page2FirstPic2.setOption(page2FirstPic2Option, true)
      page2FirstPic2.on('click', function (params) {
        const name = params.data.name
        switch (name) {
          case '空闲负载':
            _this.$router.push({
              path: '/resourseManagement',
              query: {
                activeName: 'fourth'
              }
            })
            break
          case '普通负载':
            _this.$router.push({
              path: '/resourseManagement',
              query: {
                activeName: 'first'
              }
            })
            break
          case '满负载':
            _this.$router.push({
              path: '/resourseManagement',
              query: {
                activeName: 'second'
              }
            })
            break
          case '过度负载':
            _this.$router.push({
              path: '/resourseManagement',
              query: {
                activeName: 'third'
              }
            })
            break
        }
      })
    },
    // 全屏：测试部人员总体分类情况左边
    getPage2FirstLeft (res) {
      const _this = this
      const page2FirstPic1 = this.$echarts.init(document.getElementById('page2FirstPic1'))
      page2FirstPic1.off('click')
      const page2FirstPic1Option = {
        color: ['#409EFF', '#FFD33D', '#00D0BB'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          icon: 'circle',
          orient: 'horizontal',
          top: '40px',
          right: '10%',
          itemWidth: 9,
          itemHeight: 9,
          formatter: ' {name}',
          data: ['正式', '合作方', '实习']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['45%', '60%'],
            data: [
              {
                value: res.data.departmentNumber.regular,
                name: '正式'
              }, {
                value: res.data.departmentNumber.partner,
                name: '合作方'
              }, {
                value: res.data.departmentNumber.intern,
                name: '实习'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{c}' + '人'
            }
          }
        ]
      }
      page2FirstPic1.setOption(page2FirstPic1Option, true)
      page2FirstPic1.on('click', function (params) {
        const name = params.data.name
        console.log(name)
        switch (name) {
          case '正式':
            _this.$router.push({
              path: '/staffManagement',
              query: {
                activeName: 'regular'
              }
            })
            break
          case '合作方':
            _this.$router.push({
              path: '/staffManagement',
              query: {
                activeName: 'partner'
              }
            })
            break
          case '实习':
            _this.$router.push({
              path: '/staffManagement',
              query: {
                activeName: 'intern'
              }
            })
            break
        }
      })
    },
    // 全屏显示的第四个报表
    anotherFourth () {
      getHrPutInAndExpectByProject({
        projectType: this.page2ProjectType2,
        projectName: this.page2ProjectName2,
        queryDate: this.page2QueryDateFourth
      }).then(res => {
        if (res.state === 1000) {
          if (this.page2pjt2) {
            this.dateArrFive = res.data.projectHRPutInAndExpect.map(ele => {
              return {
                label: ele.projectName,
                value: ele.projectName
              }
            })
            this.dateArrFive.unshift({
              label: 'All',
              value: 'All'
            })
            const page2FourthPic = this.$echarts.init(document.getElementById('page2FourthPic'))
            const page2FourthPicOption = {
              color: ['#6680FF', '#FFD33D'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}'
                // axisPointer: {
                //   type: 'cross',
                //   crossStyle: {
                //     color: '#999'
                //   }
                // }
              },
              // dataZoom: [
              //   {
              //     type: 'slider',
              //     show: true,
              //     realtime: true,
              //     start: 0,
              //     end: 100
              //   }
              // ],
              xAxis: {
                type: 'category',
                data: (res.data.projectHRPutInAndExpect.map(ele => ele.projectName)).reverse(),
                axisPointer: {
                  type: 'shadow'
                },
                axisLabel: {
                  rotate: -90
                }
              },
              grid: {
                bottom: 95
              },
              yAxis: {
                type: 'value',
                name: '人力投入'
              },
              legend: {
                icon: 'circle',
                orient: 'horizontal',
                top: '0px',
                left: '26%',
                itemWidth: 9,
                itemHeight: 9,
                formatter: ' {name}',
                data: ['项目人力的总投入', '项目期望投入']
              },
              series: [
                {
                  // barCategoryGap: '40%',
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrputIn)).reverse(),
                  type: 'bar',
                  name: '项目人力的总投入',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }, {
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrExpect)).reverse(),
                  type: 'line',
                  name: '项目期望投入',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              ]
            }
            page2FourthPic.setOption(page2FourthPicOption, true)
          } else {
            this.$nextTick(() => {
              const page2FourthPicTwo = this.$echarts.init(document.getElementById('page2FourthPicTwo'))
              const page2FourthPicTwoOption = {
                color: ['#6680FF', '#FFD33D'],
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b} : {c}'
                  // axisPointer: {
                  //   type: 'cross',
                  //   crossStyle: {
                  //     color: '#999'
                  //   }
                  // }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.date)).reverse()
                },
                yAxis: {
                  type: 'value',
                  name: '人力投入'
                },
                legend: {
                  icon: 'circle',
                  orient: 'horizontal',
                  top: '0px',
                  left: '26%',
                  itemWidth: 9,
                  itemHeight: 9,
                  formatter: ' {name}',
                  data: ['项目人力的总投入', '项目期望投入']
                },
                series: [
                  {
                  // barCategoryGap: '40%',
                    data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrputIn)).reverse(),
                    type: 'bar',
                    name: '项目人力的总投入',
                    barWidth: '50px',
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }, {
                    data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrExpect)).reverse(),
                    type: 'line',
                    name: '项目期望投入',
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }
                ]
              }
              page2FourthPicTwo.setOption(page2FourthPicTwoOption, true)
            })
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    // 全屏显示的第三个报表
    anotherThird () {
      getStaffNumberByProject({
        projectType: this.page2ProjectType,
        projectName: this.page2ProjectName,
        queryDate: this.page2QueryDateThird
      }).then(res => {
        if (res.state === 1000) {
          if (this.page2pjt) {
            this.dateArrThree = res.data.projectHunman.map(ele => {
              return {
                label: ele.projectName,
                value: ele.projectName
              }
            })
            this.dateArrThree.unshift({
              label: 'All',
              value: 'All'
            })
            const page2ThirdPic = this.$echarts.init(document.getElementById('page2ThirdPic'))
            const page2ThirdPicOption = {
              color: ['#409EFF', '#FFD33D'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}'
                // axisPointer: {
                //   type: 'cross',
                //   crossStyle: {
                //     color: '#999'
                //   }
                // }
              },
              legend: {
                icon: 'circle',
                orient: 'horizontal',
                top: '0px',
                left: '26%',
                itemWidth: 9,
                itemHeight: 9,
                formatter: ' {name}',
                data: ['项目当前人员数量', '项目期望人员数量']
              },
              xAxis: {
                type: 'category',
                data: res.data.projectHunman.map(ele => ele.projectName),
                axisPointer: {
                  type: 'shadow'
                },
                axisLabel: {
                  rotate: -90
                }
                // grid: {
                //   bottom: 95
                // },
              },
              grid: {
                bottom: 95
              },
              yAxis: {
                type: 'value',
                name: '人员数量'
              },
              series: [
                {
                  data: res.data.projectHunman.map(ele => ele.currentNumber),
                  type: 'bar',
                  name: '项目当前人员数量',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
                // {
                //   data: res.data.projectHunmanGap.map(ele => ele.expectNumber),
                //   type: 'line',
                //   name: '项目期望人员数量',
                //   label: {
                //     normal: {
                //       show: true,
                //       position: 'top'
                //     }
                //   }
                // }
              ]
            }
            page2ThirdPic.setOption(page2ThirdPicOption, true)
          } else {
            this.$nextTick(() => {
              const page2ThirdPicTwo = this.$echarts.init(document.getElementById('page2ThirdPicTwo'))
              const page2ThirdPicTwoOption = {
                color: ['#409EFF', '#FFD33D'],
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b} : {c}'
                  // axisPointer: {
                  //   type: 'cross',
                  //   crossStyle: {
                  //     color: '#999'
                  //   }
                  // }
                },
                legend: {
                  data: ['项目当前人员数量', '项目期望人员数量']
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: (res.data.projectHunman.map(ele => ele.date)).reverse()
                },
                yAxis: {
                  type: 'value',
                  name: '人员数量'
                },
                series: [
                  {
                    name: '项目当前人员数量',
                    type: 'line',
                    stack: '总量',
                    data: (res.data.projectHunman.map(ele => ele.currentNumber)).reverse(),
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }
                ]
              }
              page2ThirdPicTwo.setOption(page2ThirdPicTwoOption, true)
            })
          }
        }
      })
    },
    // 全屏显示的第二个报表
    anotherSecond (val = '') {
      getStaffNumberByDepartment({
        departmentType: this.page2DepartmentType,
        queryDate: val
      }).then(res => {
        if (res.state === 1000) {
          const page2SecondPic = this.$echarts.init(document.getElementById('page2SecondPic'))
          let oneArr = []
          // let twoArr = []
          // 遍历数组对象，转换为二元数组
          res.data.testerNumber.forEach((ele, index, array) => {
            oneArr[index] = [array.length - index - 1, array[index].staffNumber, array[index].date, array[index].weeks]
          })
          let page2SecondPicOption = {}
          if (this.page2Dep) {
            page2SecondPicOption = {
              color: ['#00D0BB'],
              tooltip: {
                trigger: 'axis',
                formatter: params => '第' + params[0].value[3] + '周（' + params[0].value[2] + '）:' + params[0].value[1]
              },
              // dataZoom: [
              //   {
              //     type: 'slider',
              //     show: true,
              //     realtime: true,
              //     start: 0,
              //     end: 100
              //   }
              // ],
              xAxis: {
                type: 'category',
                data: res.data.testerNumber.map(ele => '第' + ele.weeks + '周').reverse()
              },
              yAxis: {
                type: 'value'
                // interval: 20
              },
              series: [
                {
                  data: oneArr,
                  // data: (res.data.testerNumber.map(ele => ele.staffNumber)).reverse(),
                  type: 'line',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              ]
            }
          } else {
            page2SecondPicOption = {
              color: ['#00D0BB'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}',
                axisPointer: {
                  type: 'shadow'
                }
              },
              // 下拉框
              // dataZoom: [
              //   {
              //     type: 'inside',
              //     show: true,
              //     realtime: true,
              //     start: 0,
              //     end: 50,
              //     zoomLock: true
              //   }
              // ],
              xAxis: {
                type: 'category',
                data: res.data.testerNumber.map(ele => ele.departName),
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  rotate: -90
                }
              },
              grid: {
                bottom: 95
              },
              yAxis: {
                type: 'value',
                interval: 20
              },
              series: [
                {
                  data: res.data.testerNumber.map(ele => ele.staffNumber),
                  type: 'bar',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                  // barWidth: '150px',
                  // barGap: '5%'
                }
              ]
            }
          }
          page2SecondPic.setOption(page2SecondPicOption, true)
        }
      })
    },
    // 全屏显示的第一个报表
    anotherFirst (val = '') {
      getStaffNumberByType({queryDate: val})
        .then(res => {
          if (res.state === 1000) {
            if (res.data.departmentNumber === null) {
              this.showPage2FirstPic1 = false
            } else {
              this.showPage2FirstPic1 = true
              this.$nextTick(() => {
                this.getPage2FirstLeft(res)
              })
            }
            if (res.data.hunmanPutIntoNumber === null) {
              this.showPage2FirstPic2 = false
            } else {
              this.showPage2FirstPic2 = true
              this.$nextTick(() => {
                this.getPage2FirstRight(res)
              })
            }
            // res.data.departmentNumber === null && res.data.hunmanPutIntoNumber !== null
            // this.$nextTick(() => {
            // })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
      // console.log()
    },
    // 全屏显示的所有日期下拉框
    getPage2ChunkDate (val, location) {
      console.log(val)
      if (location === 'anotherFirst') {
        this.anotherFirst(val)
      }
      if (location === 'anotherSecond') {
        this.pageQueryDateSecond = val
        this.anotherSecond(val)
      }
      // 所有项目还是单个项目
      if (location === 'anotherThird') {
        if (val !== 'All') {
          this.page2pjt = false
          this.page2ProjectType = 2
          this.page2ProjectName = val
          this.page2QueryDateThird = ''
        } else {
          this.page2pjt = true
          this.page2ProjectType = 1
          this.page2ProjectName = val
          this.page2QueryDateThird = this.tempPage2QueryDateThird
        }
        this.anotherThird(val)
      }
      // 日期选择
      if (location === 'anotherFourth') {
        this.page2QueryDateThird = val
        this.tempPage2QueryDateThird = val
        this.anotherThird()
      }
      if (location === 'anotherFifth') {
        if (val !== 'All') {
          this.page2pjt2 = false
          this.page2ProjectType2 = 2
          this.page2ProjectName2 = val
          this.page2QueryDateFourth = ''
        } else {
          this.page2pjt2 = true
          this.page2ProjectType2 = 1
          this.page2ProjectName2 = val
          this.page2QueryDateFourth = this.tempPage2QueryDateFourth
        }
        this.anotherFourth()
        // this.page2QueryDateThird = val
        // this.tempPage2QueryDateThird = val
        // this.anotherThird()
      }
      if (location === 'anotherSixth') {
        // this.page2ProjectType2: 1,
        // this.page2ProjectName2: 'All',
        this.page2QueryDateFourth = val
        this.tempPage2QueryDateFourth = val
        this.anotherFourth()
      }
    },
    // 正常显示、宽屏显示的切换，false为正常显示，true为宽屏显示
    getModelType (type) {
      if (type) {
        this.$nextTick(() => {
          document.getElementsByClassName('el-switch__label')[0].style.color = '#000'
          document.getElementsByClassName('el-switch__label')[1].style.color = '#13ce66'
          // 测试部人员总体分类情况默认选择时间控件
          this.page2Value1 = this.translateDate[0].label
          this.page2Value2 = this.translateDate[0].label
          this.page2Value3 = 'All'
          this.page2Value4 = this.translateDate[0].label
          this.page2Value5 = 'All'
          this.page2Value6 = this.translateDate[0].label
          // this.page2ProjectType: 1
          // page2ProjectName = 'All'
          this.page2QueryDateThird = ''
          this.anotherFirst()
          this.anotherSecond()
          this.anotherThird()
          this.anotherFourth()
        })
      } else {
        this.$nextTick(() => {
          document.getElementsByClassName('el-switch__label')[0].style.color = '#409EFF'
          document.getElementsByClassName('el-switch__label')[1].style.color = '#000'
        })
      }
    },
    // 上左一级部门与二级部门的切换
    selectShow (name) {
      if (name === 'firstDep') {
        this.$refs.firstDep.style.backgroundColor = 'rgba(64,158,255,1)'
        this.$refs.firstDep.style.color = 'rgba(255,255,255,1)'
        this.$refs.secondDep.style.backgroundColor = 'rgba(255,255,255,1)'
        this.$refs.secondDep.style.color = 'rgba(64,158,255,1)'
        this.dep = true
        this.departmentType = 1
        this.queryDateSecond = ''
        this.initSecond()
      } else {
        // this.$nextTick(() => {
        //   this.$refs.firstDep.style.backgroundColor = 'rgba(255,255,255,1)'
        //   this.$refs.firstDep.style.color = 'rgba(64,158,255,1)'
        //   this.$refs.secondDep.style.backgroundColor = 'rgba(64,158,255,1)'
        //   this.$refs.secondDep.style.color = 'rgba(255,255,255,1)'
        //   this.dep = false
        //   this.departmentType = 2
        //   this.initSecond()
        // })
        this.$refs.firstDep.style.backgroundColor = 'rgba(255,255,255,1)'
        this.$refs.firstDep.style.color = 'rgba(64,158,255,1)'
        this.$refs.secondDep.style.backgroundColor = 'rgba(64,158,255,1)'
        this.$refs.secondDep.style.color = 'rgba(255,255,255,1)'
        this.dep = false
        this.departmentType = 2
        this.initSecond()
      }
    },
    initFirst () {
      getStaffNumberByType({queryDate: this.queryDateFirst})
        .then(res => {
          if (res.state === 1000) {
            const _this = this
            if (res.data.departmentNumber === null && res.data.hunmanPutIntoNumber !== null) {
              this.showLeftCirclePic = false
              this.showRightCirclePic = true
              this.$nextTick(() => {
                const rightCircle = this.$echarts.init(document.getElementById('rightCircle'))
                rightCircle.off('click')
                const rightCircleOption = {
                  // 设置表盘颜色
                  color: ['#409EFF', '#00D0BB', '#FFD33D', '#F56C6C'],
                  tooltip: {
                    // 提示框悬浮器,item用于饼图
                    trigger: 'item',
                    // 提示框浮层内容格式器
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  // 图标上面的几个静态选项
                  legend: {
                    icon: 'circle',
                    orient: 'horizontal',
                    top: '40px',
                    left: '13%',
                    itemWidth: 9,
                    itemHeight: 9,
                    formatter: ' {name}',
                    data: ['空闲负载', '普通负载', '满负载', '过度负载']
                  },
                  series: [
                    {
                      name: '',
                      // 设置为饼图
                      type: 'pie',
                      // 饼图的半径
                      radius: '55%',
                      // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
                      center: ['45%', '60%'],
                      data: [
                        {
                          value: res.data.hunmanPutIntoNumber.freeLoad,
                          name: '空闲负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.lowLoad,
                          name: '普通负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.normalLoad,
                          name: '满负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.heavyLoad,
                          name: '过度负载'
                        }
                      ],
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      },
                      label: {
                        show: true,
                        formatter: '{c}' + '人'
                      }
                    }
                  ]
                }
                rightCircle.setOption(rightCircleOption, true)
                rightCircle.on('click', function (params) {
                  const name = params.data.name
                  switch (name) {
                    case '空闲负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'fourth'
                        }
                      })
                      break
                    case '普通负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'first'
                        }
                      })
                      break
                    case '满负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'second'
                        }
                      })
                      break
                    case '过度负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'third'
                        }
                      })
                      break
                  }
                })
              })
            } else if (res.data.hunmanPutIntoNumber === null && res.data.departmentNumber !== null) {
              this.showRightCirclePic = false
              this.showLeftCirclePic = true
              this.$nextTick(() => {
                const leftCircle = this.$echarts.init(document.getElementById('leftCircle'))
                leftCircle.off('click')
                const leftCircleOption = {
                  color: ['#409EFF', '#FFD33D', '#00D0BB'],
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                    icon: 'circle',
                    orient: 'horizontal',
                    top: '40px',
                    left: '26%',
                    itemWidth: 9,
                    itemHeight: 9,
                    formatter: ' {name}',
                    data: ['正式', '合作方', '实习']
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      center: ['45%', '60%'],
                      data: [
                        {
                          value: res.data.departmentNumber.regular,
                          name: '正式'
                        }, {
                          value: res.data.departmentNumber.partner,
                          name: '合作方'
                        }, {
                          value: res.data.departmentNumber.intern,
                          name: '实习'
                        }
                      ],
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      },
                      label: {
                        show: true,
                        formatter: '{c}' + '人'
                      }
                    }
                  ]
                }
                leftCircle.setOption(leftCircleOption, true)
                leftCircle.on('click', function (params) {
                  const name = params.data.name
                  console.log(name)
                  switch (name) {
                    case '正式':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'regular'
                        }
                      })
                      break
                    case '合作方':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'partner'
                        }
                      })
                      break
                    case '实习':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'intern'
                        }
                      })
                      break
                  }
                })
              })
            } else if (res.data.departmentNumber === null && res.data.hunmanPutIntoNumber === null) {
              this.showLeftCirclePic = false
              this.showRightCirclePic = false
            } else {
              this.showLeftCirclePic = true
              this.showRightCirclePic = true
              this.$nextTick(() => {
                const leftCircle = this.$echarts.init(document.getElementById('leftCircle'))
                leftCircle.off('click')
                const leftCircleOption = {
                  color: ['#409EFF', '#FFD33D', '#00D0BB'],
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                    icon: 'circle',
                    orient: 'horizontal',
                    top: '40px',
                    left: '26%',
                    itemWidth: 9,
                    itemHeight: 9,
                    formatter: ' {name}',
                    data: ['正式', '合作方', '实习']
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      center: ['45%', '60%'],
                      data: [
                        {
                          value: res.data.departmentNumber.regular,
                          name: '正式'
                        }, {
                          value: res.data.departmentNumber.partner,
                          name: '合作方'
                        }, {
                          value: res.data.departmentNumber.intern,
                          name: '实习'
                        }
                      ],
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      },
                      label: {
                        show: true,
                        formatter: '{c}' + '人'
                      }
                    }
                  ]
                }
                leftCircle.setOption(leftCircleOption, true)
                leftCircle.on('click', function (params) {
                  const name = params.data.name
                  console.log(name)
                  switch (name) {
                    case '正式':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'regular'
                        }
                      })
                      break
                    case '合作方':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'partner'
                        }
                      })
                      break
                    case '实习':
                      _this.$router.push({
                        path: '/staffManagement',
                        query: {
                          activeName: 'intern'
                        }
                      })
                      break
                  }
                })
                const rightCircle = this.$echarts.init(document.getElementById('rightCircle'))
                rightCircle.off('click')
                const rightCircleOption = {
                  color: ['#409EFF', '#00D0BB', '#FFD33D', '#F56C6C'],
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                    icon: 'circle',
                    orient: 'horizontal',
                    top: '40px',
                    left: '13%',
                    itemWidth: 9,
                    itemHeight: 9,
                    formatter: ' {name}',
                    // data: ['空闲', '轻负载', '正常负载', '重负载']
                    // 黄，蓝，绿，红
                    data: ['空闲负载', '普通负载', '满负载', '过度负载']
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      center: ['45%', '60%'],
                      data: [
                        {
                          value: res.data.hunmanPutIntoNumber.freeLoad,
                          name: '空闲负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.lowLoad,
                          name: '普通负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.normalLoad,
                          name: '满负载'
                        }, {
                          value: res.data.hunmanPutIntoNumber.heavyLoad,
                          name: '过度负载'
                        }
                      ],
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      },
                      label: {
                        show: true,
                        formatter: '{c}' + '人'
                      }
                    }
                  ]
                }
                rightCircle.setOption(rightCircleOption, true)
                rightCircle.on('click', function (params) {
                  const name = params.data.name
                  switch (name) {
                    case '空闲负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'fourth'
                        }
                      })
                      break
                    case '普通负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'first'
                        }
                      })
                      break
                    case '满负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'second'
                        }
                      })
                      break
                    case '过度负载':
                      _this.$router.push({
                        path: '/resourseManagement',
                        query: {
                          activeName: 'third'
                        }
                      })
                      break
                  }
                })
              })
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试')
        })
    },
    initSecond () {
      getStaffNumberByDepartment({
        departmentType: this.departmentType,
        queryDate: this.queryDateSecond
      }).then(res => {
        if (res.state === 1000) {
          const firstDep = this.$echarts.init(document.getElementById('firstDep'))
          let oneArr = []
          // let twoArr = []
          // 遍历数组对象，转换为二元数组
          res.data.testerNumber.forEach((ele, index, array) => {
            oneArr[index] = [array.length - index - 1, array[index].staffNumber, array[index].date, array[index].weeks]
          })

          let firstDepOption = {}
          if (this.dep) {
            firstDepOption = {
              color: ['#00D0BB'],
              tooltip: {
                trigger: 'axis',
                // formatter: '{b} : {c}'
                formatter: params => '第' + params[0].value[3] + '周（' + params[0].value[2] + '）:' + params[0].value[1]
              },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
                }
              ],
              xAxis: {
                type: 'category',
                data: res.data.testerNumber.map(ele => '第' + ele.weeks + '周').reverse()
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: oneArr,
                  // data: [[0, 12, '2019-11-02', 44], [1, 80, '2019-11-02', 43], [2, 11, '2019-10-19', 42], [3, 12, '2019-10-12', 41], [4, 10, '2019-10-05', 40], [5, 13, '2019-09-28', 39]],
                  // data: res.data.testerNumber,
                  type: 'line',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              ]
            }
          } else {
            firstDepOption = {
              color: ['#00D0BB'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}',
                axisPointer: {
                  type: 'shadow'
                }
              },
              // 下拉框
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  // 拖动时，是否实时更新系列的视图
                  realtime: true,
                  start: 0,
                  end: 100
                }
              ],
              xAxis: {
                type: 'category',
                data: res.data.testerNumber.map(ele => ele.departName),
                axisTick: {
                  alignWithLabel: true
                }
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: res.data.testerNumber.map(ele => ele.staffNumber),
                  type: 'bar',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              ]
            }
          }
          firstDep.setOption(firstDepOption, true)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    initThird () {
      getStaffNumberByProject({
        projectType: this.projectType,
        projectName: this.projectName,
        queryDate: this.queryDateThird
      }).then(res => {
        if (res.state === 1000) {
          // console.log(res)
          if (this.pjt) {
            this.dateArrThree = res.data.projectHunman.map(ele => {
              return {
                label: ele.projectName,
                value: ele.projectName
              }
            })
            this.dateArrThree.unshift({
              label: 'All',
              value: 'All'
            })
            const thirdEcharts = this.$echarts.init(document.getElementById('thirdEcharts'))
            const thirdEchartsOption = {
              color: ['#409EFF', '#FFD33D'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}'
                // axisPointer: {
                //   type: 'cross',
                //   crossStyle: {
                //     color: '#999'
                //   }
                // }
              },
              // legend: {
              //   icon: 'circle',
              //   orient: 'horizontal',
              //   top: '0px',
              //   left: '26%',
              //   itemWidth: 9,
              //   itemHeight: 9,
              //   formatter: ' {name}',
              //   data: ['项目当前人员数量', '项目期望人员数量']
              // },
              xAxis: {
                type: 'category',
                data: res.data.projectHunman.map(ele => ele.projectName),
                axisPointer: {
                  type: 'shadow'
                }
              },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  // 拖动时，是否实时更新系列的视图
                  realtime: true,
                  start: 0,
                  end: 100
                }
              ],
              yAxis: {
                type: 'value',
                name: '人员数量'
              },
              series: [
                {
                  data: res.data.projectHunman.map(ele => ele.currentNumber),
                  type: 'bar',
                  name: '项目当前人员数量',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
                // {
                //   data: res.data.projectHunmanGap.map(ele => ele.currentNumber),
                //   type: 'bar',
                //   name: '项目当前人员数量',
                //   label: {
                //     normal: {
                //       show: true,
                //       position: 'top'
                //     }
                //   }
                // }, {
                //   data: res.data.projectHunmanGap.map(ele => ele.expectNumber),
                //   type: 'line',
                //   name: '项目期望人员数量',
                //   label: {
                //     normal: {
                //       show: true,
                //       position: 'top'
                //     }
                //   }
                // }
              ]
            }
            thirdEcharts.setOption(thirdEchartsOption, true)
          } else {
            // 选择单个项目
            this.$nextTick(() => {
              const thirdEchartsTwo = this.$echarts.init(document.getElementById('thirdEchartsTwo'))
              const thirdEchartsTwoOption = {
                color: ['#409EFF', '#FFD33D'],
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b} : {c}'
                  // axisPointer: {
                  //   type: 'cross',
                  //   crossStyle: {
                  //     color: '#999'
                  //   }
                  // }
                },
                legend: {
                  data: ['项目当前人员数量', '项目期望人员数量']
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: (res.data.projectHunman.map(ele => ele.date)).reverse()
                },
                yAxis: {
                  type: 'value',
                  name: '人员数量'
                },
                series: [
                  {
                    name: '项目当前人员数量',
                    type: 'line',
                    stack: '总量',
                    data: (res.data.projectHunman.map(ele => ele.currentNumber)).reverse(),
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }
                ]
              }
              thirdEchartsTwo.setOption(thirdEchartsTwoOption, true)
            })
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    initFourth () {
      getHrPutInAndExpectByProject({
        projectType: this.projectType2,
        projectName: this.projectName2,
        queryDate: this.queryDateFourth
      }).then(res => {
        if (res.state === 1000) {
          // console.log(res)
          if (this.pjt2) {
            this.dateArrFive = res.data.projectHRPutInAndExpect.map(ele => {
              return {
                label: ele.projectName,
                value: ele.projectName
              }
            })
            this.dateArrFive.unshift({
              label: 'All',
              value: 'All'
            })
            const fourthEcharts = this.$echarts.init(document.getElementById('fourthEcharts'))
            const fourthEchartsOption = {
              color: ['#6680FF', '#FFD33D'],
              tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}'
                // axisPointer: {
                //   type: 'cross',
                //   crossStyle: {
                //     color: '#999'
                //   }
                // }
              },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
                }
              ],
              xAxis: {
                type: 'category',
                data: (res.data.projectHRPutInAndExpect.map(ele => ele.projectName)).reverse(),
                axisPointer: {
                  type: 'shadow'
                }
              },
              yAxis: {
                type: 'value',
                name: '人力投入'
              },
              legend: {
                icon: 'circle',
                orient: 'horizontal',
                top: '0px',
                left: '26%',
                itemWidth: 9,
                itemHeight: 9,
                formatter: ' {name}',
                data: ['项目人力的总投入', '项目期望投入']
              },
              series: [
                {
                  // barCategoryGap: '40%',
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrputIn)).reverse(),
                  type: 'bar',
                  name: '项目人力的总投入',
                  barWidth: '50px',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }, {
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrExpect)).reverse(),
                  type: 'line',
                  name: '项目期望投入',
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              ]
            }
            fourthEcharts.setOption(fourthEchartsOption, true)
          } else {
            this.$nextTick(() => {
              const fourthEchartsTwo = this.$echarts.init(document.getElementById('fourthEchartsTwo'))
              const fourthEchartsTwoOption = {
                color: ['#6680FF', '#FFD33D'],
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b} : {c}'
                  // axisPointer: {
                  //   type: 'cross',
                  //   crossStyle: {
                  //     color: '#999'
                  //   }
                  // }
                },
                dataZoom: [
                  {
                    type: 'slider',
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                  }
                ],
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: (res.data.projectHRPutInAndExpect.map(ele => ele.date)).reverse()
                },
                yAxis: {
                  type: 'value',
                  name: '人力投入'
                },
                legend: {
                  icon: 'circle',
                  orient: 'horizontal',
                  top: '0px',
                  left: '26%',
                  itemWidth: 9,
                  itemHeight: 9,
                  formatter: ' {name}',
                  data: ['项目人力的总投入', '项目期望投入']
                },
                series: [
                  // {
                  //   // barCategoryGap: '40%',
                  //   name: '项目当前人员数量',
                  //   type: 'line',
                  //   stack: '总量',
                  //   data: (res.data.projectHunmanGap.map(ele => ele.hrputIn)).reverse(),
                  //   label: {
                  //     normal: {
                  //       show: true,
                  //       position: 'top'
                  //     }
                  //   }
                  // }
                  {
                  // barCategoryGap: '40%',
                    data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrputIn)).reverse(),
                    type: 'bar',
                    name: '项目人力的总投入',
                    barWidth: '50px',
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }, {
                    data: (res.data.projectHRPutInAndExpect.map(ele => ele.hrExpect)).reverse(),
                    type: 'line',
                    name: '项目期望投入',
                    label: {
                      normal: {
                        show: true,
                        position: 'top'
                      }
                    }
                  }
                ]
              }
              fourthEchartsTwo.setOption(fourthEchartsTwoOption, true)
            })
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    // 所有下拉框，根据action来判断具体是哪一个下拉框
    getChunkDate (date, action) {
      if (action === 'first') {
        this.queryDateFirst = date
        this.initFirst()
      }
      if (action === 'second') {
        this.queryDateSecond = date
        this.initSecond()
      }
      if (action === 'third') {
        if (date === 'All') {
          this.projectType = 1
          this.pjt = true
          this.projectName = ''
          this.value4 = this.translateDate[0].label
        } else {
          this.projectType = 2
          this.pjt = false
          this.projectName = date
          this.queryDateThird = ''
        }
        this.initThird()
      }
      if (action === 'fourth') {
        this.queryDateThird = date
        this.initThird()
      }
      if (action === 'fifth') {
        if (date === 'All') {
          this.projectType2 = 1
          this.pjt2 = true
          this.projectName2 = ''
          this.value5 = date
        } else {
          this.projectType2 = 2
          this.pjt2 = false
          this.projectName2 = date
          this.queryDateFourth = ''
        }
        this.initFourth()
      }
      if (action === 'sixth') {
        this.queryDateFourth = date
        this.initFourth()
      }
    }
  },
  created () {
    // console.log(new Date((Date.parse(new Date('2019-10-27')) - 1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date('2019-10-27')) - 1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date('2019-10-27')) - 1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0'))
    getHelpTips({})
      .then(res => {
        if (res.state === 1000) {
          // console.log(res)
          this.tipArr = res.data.helpTips
        }
      })
    getReportWeekNumber({})
      .then(res => {
        if (res.state === 1000) {
          this.translateDate = res.data.weekData.map(ele => {
            return {
              label: ele.weekNumber + '周' + ' ' + '(' + ele.startDate.split('-')[1] + '月' + ele.startDate.split('-')[2] + '日' + '-' + ele.endDate.split('-')[1] + '月' + ele.endDate.split('-')[2] + '日' + ')',
              // value: ele.endDate
              value: new Date((Date.parse(new Date(ele.endDate)) - 1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(ele.endDate)) - 1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(ele.endDate)) - 1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')
            }
          })
          this.dateArrOne = this.translateDate
          this.value1 = this.translateDate[0].label
          this.dateArrTwo = this.translateDate
          this.value2 = this.translateDate[0].label
          this.dateArrFour = this.translateDate
          this.value4 = this.translateDate[0].label
          this.dateArrSix = this.translateDate
          this.value6 = this.translateDate[0].label
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    // window.addEventListener('resize', () => {
    //   setTimeout(() => {
    //     this.$router.go(0)
    //   }, 0)
    // })
    this.$nextTick(() => {
      this.initFirst()
      this.initSecond()
      this.initThird()
      this.initFourth()
    })
  },
  mounted () {
    Array.from(document.getElementsByClassName('chunk')).forEach(ele => {
      if (document.documentElement.clientWidth < 1190) {
        ele.style.width = (1190 - 24 * 3) / 2 + 'px'
      } else {
        ele.style.width = (document.documentElement.clientWidth - 24 * 3) / 2 + 'px'
      }
    })
    // document.getElementsByClassName('el-switch__label')[0].style.color = '#13ce66'
  },
  watch: {
    // modelType (val) {
    //   if (val)
    // }
  }
}
</script>

<style>
@font-face {
  font-family: "alibabapuhuiti";
  src: url('../assets/font/Alibaba-PuHuiTi-Medium.otf');
}
.dataStatistics {
  width: 100%;
  background-color: rgba(245,247,250,1);
  min-width: 1190px;
  overflow-x: hidden
}
.dataStatistics > .header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  position: relative
}
.dataStatistics > .header > .historyDataDetails {
  height: 40px;
  position: absolute;
  margin-left: 77%;
  width: 123px;
}
.dataStatistics > .header > .normalShow {
  width: 70px;
  height: 25px;
  background: rgba(64,158,255,1);
  border-radius: 4px 0px 0px 4px;
  position: absolute;
  right: 94px;
  font-size: 12px;
  text-align: center;
  line-height: 23px;
  color: #fff;
  box-sizing: border-box;
  border: 1px solid  rgba(64,158,255,1)
}
.dataStatistics > .header > .normalShow:hover, .dataStatistics > .header > .wideScreenShow {
  cursor: pointer
}
.dataStatistics > .header > .wideScreenShow {
  width: 70px;
  height: 25px;
  background: rgba(255,255,255,1);
  border-radius: 0px 4px 4px 0px;
  border: 1px solid  rgba(64,158,255,1);
  position: absolute;
  right: 24px;
  color: rgba(64,158,255,1);
  font-size: 12px;
  text-align: center;
  line-height: 23px;
  box-sizing: border-box
}
.dataStatistics > .header > .el-switch {
  position: absolute;
  right: 24px
}
.dataStatistics > .page1 {
  width: 100%
}
.dataStatistics > .page1 > .chunk {
  height: 370px;
  background-color: rgba(255,255,255,1);
  margin: 0px 0px 24px 24px;
  float: left;
  border-radius:2px
}
.dataStatistics > .page1 > .chunk:nth-of-type(3), .dataStatistics > .page1 > .chunk:nth-of-type(4) {
  margin: 0px 0px 24px 24px
}
.dataStatistics > .page1 > .chunk:nth-of-type(1), .dataStatistics > .page1 > .chunk:nth-of-type(2), .dataStatistics > .page1 > .chunk:nth-of-type(3), .dataStatistics > .page1 > .chunk:nth-of-type(4) {
  position: relative
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .title, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .title, .dataStatistics > .page1 > .chunk:nth-of-type(3) > .title, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .title {
  position: absolute;
  width: 152px;
  height: 20px;
  font-size: 14px;
  font-family: "alibabapuhuiti";
  color: rgba(48,49,51,1);
  line-height: 20px;
  top: 16px;
  left: 24px
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .el-select, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .el-select, .dataStatistics > .page1 > .chunk:nth-of-type(3) > .el-select, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .el-select {
  position: absolute;
  top: 16px;
  right: 24px;
  height: 30px;
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .el-select > .el-input, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .el-select > .el-input, .dataStatistics > .page1 > .chunk:nth-of-type(3) > .el-select > .el-input, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .el-select > .el-input {
  height: 30px;
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .el-select > .el-input > .el-input__inner, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .el-select > .el-input > .el-input__inner, .dataStatistics > .page1 > .chunk:nth-of-type(3) > .el-select > .el-input > .el-input__inner, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .el-select > .el-input > .el-input__inner {
  height: 30px;
  color: #909399
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-input__icon, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-input__icon, .dataStatistics > .page1 > .chunk:nth-of-type(3) > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-input__icon, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-input__icon {
  line-height: 30px
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .left {
  position: absolute;
  top: 65px;
  width: 50%;
  height: 300px;
  text-align: center
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .none {
  position: absolute;
  top: 65px;
  width: 50%;
  height: 300px;
  text-align: center
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > .right {
  position: absolute;
  left: 50%;
  top: 65px;
  width: 50%;
  height: 300px;
  text-align: center
}
.dataStatistics > .page1 > .chunk:nth-of-type(2) > .buttonLeft {
  width: 70px;
  height: 30px;
  background: rgba(64,158,255,1);
  border-radius: 4px 0px 0px 4px;
  position: absolute;
  top: 16px;
  right: 327px;
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  color: #fff;
  box-sizing: border-box;
  border: 1px solid  rgba(64,158,255,1)
}
.dataStatistics > .page1 > .chunk:nth-of-type(2) > .buttonLeft:hover, .dataStatistics > .page1 > .chunk:nth-of-type(2) > .buttonRight {
  cursor: pointer
}
.dataStatistics > .page1 > .chunk:nth-of-type(2) > .buttonRight {
  width: 70px;
  height: 30px;
  background: rgba(255,255,255,1);
  border-radius: 0px 4px 4px 0px;
  border: 1px solid  rgba(64,158,255,1);
  position: absolute;
  top: 16px;
  right: 257px;
  color: rgba(64,158,255,1);
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  box-sizing: border-box
}
.dataStatistics > .page1 > .chunk:nth-of-type(2) > .firstDep {
  margin-top: 50px
}
.dataStatistics > .page1 > .chunk:nth-of-type(3) > .projectSelect, .dataStatistics > .page1 > .chunk:nth-of-type(4) > .projectSelect {
  right: 257px
}
.dataStatistics > .page1 > .chunk:nth-of-type(3) > .thirdEcharts {
  margin-top: 50px
}
.dataStatistics > .page1 > .chunk:nth-of-type(4) > .fourthEcharts {
  margin-top: 50px
}
.dataStatistics > .page1 > .chunk:nth-of-type(1) > span {
  position: relative;
  top: 14px;
  left: 178px
}
.dataStatistics > .page1 > .chunk:nth-of-type(2) > span {
  position: relative;
  top: 14px;
  left: 150px
}
.dataStatistics > .page1 > .chunk:nth-of-type(3) > span {
  position: relative;
  top: 14px;
  left: 137px
}
.dataStatistics > .page1 > .chunk:nth-of-type(4) > span {
  position: relative;
  top: 14px;
  left: 177px
}
.dataStatistics > .page1 > .chunk:nth-of-type(3) > .projectSelect > .el-input {
  width: 100px;
}
.dataStatistics > .page1 > .chunk:nth-of-type(4) > .projectSelect > .el-input {
  width: 100px;
}
.dataStatistics > .page2 {
  width: 100%;
  min-height: 370px;
  border-radius:2px;
  font-size: 14px;
  font-family: "alibabapuhuiti";
  color: rgba(48,49,51,1);
  box-sizing: border-box
}
.dataStatistics > .page2 > .element {
  width: 100%;
  height: 370px;
  background-color: #fff;
  position: relative;
  border-radius: 2px;
  margin-bottom: 10px
}
.dataStatistics > .page2 > .element > .title {
  position: absolute;
  top: 16px;
  left: 24px
}
.dataStatistics > .page2 > .element > .el-select {
  position: absolute;
  top: 16px;
  right: 24px;
  height: 30px;
}
.dataStatistics > .page2 > .element > .el-select > .el-input {
  height: 30px;
}
.dataStatistics > .page2 > .element > .el-select > .el-input > .el-input__inner {
  height: 30px;
}
.dataStatistics > .page2 > .element > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-input__icon {
  line-height: 30px
}
.dataStatistics > .page2 > .element:nth-of-type(1) > span {
  position: relative;
  top: 16px;
  left: 178px
}
.dataStatistics > .page2 > .element:nth-of-type(1) > .picture {
  width: 100%;
  height: 300px;
  margin-top: 40px
}
.dataStatistics > .page2 > .element:nth-of-type(1) > .picture > .left {
  width: 50%;
  height: 300px;
  float: left;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  display: flex;
  justify-content: center
}
.dataStatistics > .page2 > .element:nth-of-type(1) > .picture > .right {
  width: 50%;
  height: 300px;
  float: left;
  display: flex;
  justify-content: center
}
.dataStatistics > .page2 > .element:nth-of-type(2) > span {
  position: relative;
  top: 16px;
  left: 150px
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .picture {
  width: 100%;
  height: 300px;
  margin-top: 40px
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .picture > .left {
  width: 50%;
  height: 300px;
  float: left;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  display: flex;
  justify-content: center
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .picture > .right {
  width: 50%;
  height: 300px;
  float: left;
  display: flex;
  justify-content: center
}
.dataStatistics > .page2 > .element > .picture > .left {
  position: relative
}
.dataStatistics > .page2 > .element > .picture > .left > img {
  width: 194px;
  height: 160px;
  position: absolute;
  transform: translate((50%, 50%))
}
.dataStatistics > .page2 > .element > .picture > .left > span {
  position: absolute;
  top: 230px
}
.dataStatistics > .page2 > .element > .picture > .right {
  position: relative
}
.dataStatistics > .page2 > .element > .picture > .right > img {
  width: 194px;
  height: 160px;
  position: absolute;
  transform: translate((50%, 50%))
}
.dataStatistics > .page2 > .element > .picture > .right > span {
  position: absolute;
  top: 230px
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .buttonLeft {
  width: 70px;
  height: 30px;
  background: rgba(64,158,255,1);
  border-radius: 4px 0px 0px 4px;
  position: absolute;
  top: 16px;
  right: 327px;
  font-family: '微软雅黑';
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  color: #fff;
  box-sizing: border-box;
  border: 1px solid  rgba(64,158,255,1)
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .buttonLeft:hover, .dataStatistics > .page2 > .element:nth-of-type(2) > .buttonRight {
  cursor: pointer
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .buttonRight {
  width: 70px;
  height: 30px;
  background: rgba(255,255,255,1);
  border-radius: 0px 4px 4px 0px;
  border: 1px solid  rgba(64,158,255,1);
  position: absolute;
  top: 16px;
  right: 257px;
  color: rgba(64,158,255,1);
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  box-sizing: border-box;
  font-family: '微软雅黑'
}
.dataStatistics > .page2 > .element:nth-of-type(2) > .firstDep {
  margin-top: 20px
}
.dataStatistics > .page2 > .element:nth-of-type(3) > .thirdEcharts {
  margin-top: 20px
}
.dataStatistics > .page2 > .element:nth-of-type(4) > .fourthEcharts {
  margin-top: 20px
}
.dataStatistics > .page2 > .element:nth-of-type(3) > span {
  position: relative;
  top: 16px;
  left: 137px
}
.dataStatistics > .page2 > .element:nth-of-type(3) > .projectSelect {
  position: absolute;
  top: 16px;
  right: 280px;
  height: 30px;
}
.dataStatistics > .page2 > .element:nth-of-type(3) > .projectSelect > .el-input {
  width: 100px;
}
.dataStatistics > .page2 > .element:nth-of-type(4) > span {
  position: relative;
  top: 16px;
  left: 177px
}
.dataStatistics > .page2 > .element:nth-of-type(4) > .projectSelect {
  position: absolute;
  top: 16px;
  right: 280px;
  height: 30px;
}
.dataStatistics > .page2 > .element:nth-of-type(4) > .projectSelect > .el-input {
  width: 100px;
}
</style>
