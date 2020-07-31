<template>
  <div class="roughHistory">
    <div class="top" v-if="!$route.query.isHistory">
      <el-button type="primary" class="button" @click="jumpToEditHistory">修改历史</el-button>
      <el-button type="primary" class="button" @click="canEdit">编辑数据</el-button>
      <el-button type="primary" class="button" @click="saveData" :disabled="saveButtonBol">保存数据</el-button>
      <div class="rectangleBox">
        <!-- 不显示清除按钮 -->
        <el-date-picker
          v-model="selectYear"
          type="year"
          placeholder="请选择年份"
          :picker-options="notSelectYear"
          :clearable="showClearable"
          @change="getChangeYear"
          class="rectangle">
        </el-date-picker>
        <!-- 项目 -->
        <el-select v-model="projectName" placeholder="请选择项目" class="rectangle" @change="changeProject">
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- 类别 -->
        <el-select v-model="peopleType" placeholder="请选择人员类别" class="rectangle" @change="changePeopleType">
          <el-option
            v-for="item in peopleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="body" v-loading="loading">
      <el-card class="box-card" v-for="(val, key) in totalTableData" :key="key">
        <div slot="header" class="clearfix">
          <span>{{ val.buName }}</span>
        </div>
        <el-table
          :data="val.details"
          style="width: 100%"
          row-key="projectId"
          border
          lazy
          :load="load"
          :span-method="arraySpanMethod"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="projectName" label="项目名称" width="180" align="left" show-overflow-tooltip></el-table-column>
          <!-- 一月 -->
          <el-table-column prop="jan" label="Jan" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jan.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jan.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 二月 -->
          <el-table-column prop="feb" label="Feb" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.feb.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.feb.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 三月 -->
          <el-table-column prop="mar" label="Mar" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mar.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mar.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 四月 -->
          <el-table-column prop="apr" label="Apr" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.apr.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.apr.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 五月 -->
          <el-table-column prop="may" label="May" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.may.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.may.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 六月 -->
          <el-table-column prop="jun" label="Jun" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jun.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jun.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 七月 -->
          <el-table-column prop="jul" label="Jul" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jul.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jul.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 八月 -->
          <el-table-column prop="aug" label="Aug" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.aug.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.aug.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 九月 -->
          <el-table-column prop="sep" label="Sep" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sep.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sep.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十月 -->
          <el-table-column prop="oct" label="Oct" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.oct.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.oct.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十一月 -->
          <el-table-column prop="nov" label="Nov" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.nov.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.nov.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十二 -->
          <el-table-column prop="dec" label="Dec" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dec.planVal" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dec.manVal" disabled></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column prop="jan" label="Jan" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.jan" disabled></el-input>
              <el-input v-else v-model="scope.row.jan" :disabled="disabledBol" @change="changeInputValue(scope.row, '01', key, $event)"></el-input>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="feb" label="Feb" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.feb" disabled></el-input>
              <el-input v-else v-model="scope.row.feb" :disabled="disabledBol" @change="changeInputValue(scope.row, '02', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="mar" label="Mar" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.mar" disabled></el-input>
              <el-input v-else v-model="scope.row.mar" :disabled="disabledBol" @change="changeInputValue(scope.row, '03', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="apr" label="Apr" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.apr" disabled></el-input>
              <el-input v-else v-model="scope.row.apr" :disabled="disabledBol" @change="changeInputValue(scope.row, '04', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="may" label="May" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.may" disabled></el-input>
              <el-input v-else v-model="scope.row.may" :disabled="disabledBol" @change="changeInputValue(scope.row, '05', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="jun" label="Jun" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.jun" disabled></el-input>
              <el-input v-else v-model="scope.row.jun" :disabled="disabledBol" @change="changeInputValue(scope.row, '06', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="jul" label="Jul" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.jul" disabled></el-input>
              <el-input v-else v-model="scope.row.jul" :disabled="disabledBol" @change="changeInputValue(scope.row, '07', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="aug" label="Aug" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.aug" disabled></el-input>
              <el-input v-else v-model="scope.row.aug" :disabled="disabledBol" @change="changeInputValue(scope.row, '08', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sep" label="Sep" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.sep" disabled></el-input>
              <el-input v-else v-model="scope.row.sep" :disabled="disabledBol" @change="changeInputValue(scope.row, '09', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="oct" label="Oct" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.oct" disabled></el-input>
              <el-input v-else v-model="scope.row.oct" :disabled="disabledBol" @change="changeInputValue(scope.row, '10', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="nov" label="Nov" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.nov" disabled></el-input>
              <el-input v-else v-model="scope.row.nov" :disabled="disabledBol" @change="changeInputValue(scope.row, '11', key, $event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="dec" label="Dec" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isproject" v-model="scope.row.dec" disabled></el-input>
              <el-input v-else v-model="scope.row.dec" :disabled="disabledBol" @change="changeInputValue(scope.row, '12', key, $event)"></el-input>
            </template>
          </el-table-column> -->
          <el-table-column prop="yearTotal" label="全年总投入" width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.yearTotal" disabled></el-input>
              <!-- <el-input v-if="scope.row.isproject" v-model="scope.row.yearTotal" disabled></el-input>
              <el-input v-else v-model="scope.row.yearTotal" :disabled="disabledBol" @change="changeInputValue(scope.row, '12', key, $event)"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="planYearTotal" label="人力需求" width="120" align="center">
            <template slot-scope="scope">
              <!-- 项目的人力需求可以改 -->
              <el-input v-model="scope.row.planYearTotal" :disabled="disabledBol" v-if="scope.row.isproject"  @change="changeInputValue(scope.row, '', key, $event)"></el-input>
              <span v-else>/</span>
              <!-- <el-input v-model="scope.row.planYearTotal" disabled v-else></el-input> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="addPerson(scope.row)" type="text" size="small" v-if="scope.row.isproject">管理人员</el-button>
              <span v-else>/</span>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <el-pagination :current-page.sync="val.startNum"
                       :page-sizes="[5, 20, 100]"
                       :page-size="val.range"
                       :total="val.total"
                       layout="total, sizes, prev, pager, next"
                       @size-change="rangeChange(key, $event)"
                       @current-change="startNumChange(key, $event)">
        </el-pagination> -->
      </el-card>
    </div>
    <!-- <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople> -->
    <!-- <div class="picture">
      <div id="main" style="width: 100%;height: 600px"></div>
    </div> -->
    <footer><el-button type="primary" @click="returnToLastPage">返回</el-button></footer>
  </div>
</template>

<script>
import SelectPeople from '../../components/selectPeople'
import { getAllProjectList, getProjectInputDataByYear, editInputData, saveInputData, getTrueHistoryInputData, getPersonInputDataByHistoryProject } from '../../api/api'
export default {
  components: {
    SelectPeople
  },
  data () {
    return {
      saveButtonBol: true,
      loading: true,
      selectYear: '',
      notSelectYear: {
        disabledDate (time) {
          // 只能选择从2020年开始到当前的年份
          return time.getFullYear() > new Date().getFullYear() || time.getFullYear() <= '1970'
        }
      },
      showClearable: false,
      projectName: '所有项目',
      projectOptions: [],
      peopleType: 0,
      peopleOptions: [
        {
          value: 0,
          label: '所有人员'
        }, {
          value: 1,
          label: '正式'
        }, {
          value: 2,
          label: '合作方'
        }, {
          value: 3,
          label: '实习'
        }
      ],
      totalTableData: [],
      // 控制表格月份输入框是否禁止输入
      disabledBol: true,
      bu: '',
      startNum: 1,
      range: 5,
      total: 0,
      showSelectPeople: false,
      normalOrHistory: false
    }
  },
  methods: {
    returnToLastPage () {
      this.$router.push({
        path: '/editHistory'
      })
    },
    // 初始化年份为当前年份
    initCurrentYear () {
      this.selectYear = (new Date().getFullYear()).toString()
    },
    getChangeYear (year) {
      if (year === null) {
        this.initCurrentYear()
      } else {
        this.selectYear = year.getFullYear().toString()
        this.initGetYearData()
      }
    },
    changeProject (projectName) {
      this.projectName = projectName
      this.loading = true
      this.initGetYearData()
    },
    changePeopleType (peopleType) {
      this.peopleType = peopleType
      this.loading = true
      this.initGetYearData()
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.projectName === '总人力') {
        if (columnIndex === 1) {
          return [1, 2]
        }
        if (columnIndex === 2) {
          return [1, 2]
        }
        if (columnIndex === 3) {
          return [1, 2]
        }
        if (columnIndex === 4) {
          return [1, 2]
        }
        if (columnIndex === 5) {
          return [1, 2]
        }
        if (columnIndex === 6) {
          return [1, 2]
        }
        if (columnIndex === 7) {
          return [1, 2]
        }
        if (columnIndex === 8) {
          return [1, 2]
        }
        if (columnIndex === 9) {
          return [1, 2]
        }
        if (columnIndex === 10) {
          return [1, 2]
        }
        if (columnIndex === 11) {
          return [1, 2]
        }
        if (columnIndex === 12) {
          return [1, 2]
        }
        if (columnIndex === 15) {
          return [0, 0]
        }
        if (columnIndex === 16) {
          return [0, 0]
        }
        if (columnIndex === 17) {
          return [0, 0]
        }
        if (columnIndex === 18) {
          return [0, 0]
        }
        if (columnIndex === 19) {
          return [0, 0]
        }
        if (columnIndex === 20) {
          return [0, 0]
        }
        if (columnIndex === 21) {
          return [0, 0]
        }
        if (columnIndex === 22) {
          return [0, 0]
        }
        if (columnIndex === 23) {
          return [0, 0]
        }
        if (columnIndex === 24) {
          return [0, 0]
        }
        if (columnIndex === 25) {
          return [0, 0]
        }
        if (columnIndex === 26) {
          return [0, 0]
        }
      }
    },
    // 获取所有项目名称
    getAllProjectNameList () {
      getAllProjectList({}).then(res => {
        if (res.state === 1000) {
          let tempData = res.data.projects
          tempData.unshift('所有项目')
          tempData.forEach(ele => {
            this.projectOptions.push({
              value: ele,
              label: ele
            })
          })
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    // 获取年度投入值
    initGetYearData () {
      getProjectInputDataByYear({
        projectName: this.projectName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range,
        bu: ''
      }).then(res => {
        if (res.state === 1000) {
          this.totalTableData = res.data.projectHumanResource
          console.log(this.totalTableData)
          this.handleData()
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
      getProjectInputDataByYear({
        projectName: '所有项目',
        userType: this.peopleType,
        year: this.selectYear,
        startNum: 1,
        range: 10000,
        bu: '所有项目'
      }).then(res => {
        if (res.state === 1000) {
          let projectNameArr = []
          let fullYearInputArr = []
          let needResourceArr = []
          res.data.projectHumanResource.forEach(ele => {
            if (ele.details.length) {
              ele.details.forEach(ele => {
                projectNameArr.push(ele.projectName)
                fullYearInputArr.push(ele.yearTotal)
                needResourceArr.push(ele.planYearTotal)
              })
            }
          })
          let myChartOne = this.$echarts.init(document.getElementById('main'))
          let option = {
            title: {
              text: '投入需求总计'
            },
            color: ['#409EFF', '#F56C6C'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: projectNameArr
            },
            series: [
              {
                name: '全年总投入',
                type: 'bar',
                barWidth: 20,
                data: fullYearInputArr
              }, {
                name: '人力需求',
                type: 'bar',
                barWidth: 20,
                data: needResourceArr
              }
            ]
          }
          myChartOne.setOption(option)
          // this.loading = false
        }
      })
    },
    handleData () {
      // let yAxisName = []
      // let dataValue = []
      // 部门绑定索引,项目绑定索引,便于后期鼠标单击可以直接知道该项目在当前部门的索引,当前部门在总数据的索引.expandBol用于判断是否有权向后端请求子数据
      this.totalTableData.map((ele, index) => {
        ele.range = 5
        ele.startNum = 1
        if (ele.details.length) {
          let timeTotal = ele.timeTotal
          timeTotal.projectName = '总计'
          // timeTotal.projectId = (1000001 + index).toString
          timeTotal.hasChildren = false
          timeTotal.isproject = true
          let manTotal = {
            jan: {
              planVal: '',
              manVal: ''
            },
            feb: {
              planVal: '',
              manVal: ''
            },
            mar: {
              planVal: '',
              manVal: ''
            },
            apr: {
              planVal: '',
              manVal: ''
            },
            may: {
              planVal: '',
              manVal: ''
            },
            jun: {
              planVal: '',
              manVal: ''
            },
            jul: {
              planVal: '',
              manVal: ''
            },
            aug: {
              planVal: '',
              manVal: ''
            },
            sep: {
              planVal: '',
              manVal: ''
            },
            oct: {
              planVal: '',
              manVal: ''
            },
            nov: {
              planVal: '',
              manVal: ''
            },
            dec: {
              planVal: '',
              manVal: ''
            },
            yearTotal: '/',
            planYearTotal: '/',
            projectName: '总人力',
            // projectId: (1000002 + index).toString,
            hasChildren: false,
            isproject: true
          }
          manTotal.jan.planVal = ele.manTotal.jan + '人'
          manTotal.jan.manVal = ele.manTotal.feb + '人'
          manTotal.feb.planVal = ele.manTotal.mar + '人'
          manTotal.feb.manVal = ele.manTotal.apr + '人'
          manTotal.mar.planVal = ele.manTotal.may + '人'
          manTotal.mar.manVal = ele.manTotal.jun + '人'
          manTotal.apr.planVal = ele.manTotal.jul + '人'
          manTotal.apr.manVal = ele.manTotal.aug + '人'
          manTotal.may.planVal = ele.manTotal.sep + '人'
          manTotal.may.manVal = ele.manTotal.oct + '人'
          manTotal.jun.planVal = ele.manTotal.nov + '人'
          manTotal.jun.manVal = ele.manTotal.dec + '人'
          // let obj = {
          //   jan: 0,
          //   feb: 0,
          //   mar: 0,
          //   apr: 0,
          //   may: 0,
          //   jun: 0,
          //   jul: 0,
          //   aug: 0,
          //   sep: 0,
          //   oct: 0,
          //   nov: 0,
          //   dec: 0,
          //   yearTotal: 0,
          //   planYearTotal: 0,
          //   hasChildren: false,
          //   isproject: true,
          //   projectName: '统计'
          // }
          // ele.details.forEach(ele => {
          //   obj.jan += Number.parseFloat(ele.jan)
          //   obj.feb += Number.parseFloat(ele.feb)
          //   obj.mar += Number.parseFloat(ele.mar)
          //   obj.apr += Number.parseFloat(ele.apr)
          //   obj.may += Number.parseFloat(ele.may)
          //   obj.jun += Number.parseFloat(ele.jun)
          //   obj.jul += Number.parseFloat(ele.jul)
          //   obj.aug += Number.parseFloat(ele.aug)
          //   obj.sep += Number.parseFloat(ele.sep)
          //   obj.oct += Number.parseFloat(ele.oct)
          //   obj.nov += Number.parseFloat(ele.nov)
          //   obj.dec += Number.parseFloat(ele.dec)
          //   obj.planYearTotal += Number.parseFloat(ele.planYearTotal)
          //   obj.yearTotal += Number.parseFloat(ele.yearTotal)
          // })
          ele.details.map((ele2, index2) => {
            ele2.projectIndex = index2
            ele2.expandBol = true
            ele2.isproject = true
            ele2.hasChildren = true
          })
          ele.details.push(...[timeTotal, manTotal])
        }
      })
      // let myChartOne = this.$echarts.init(document.getElementById('main'))
      // let option = {
      //   title: {
      //     text: '投入需求总计'
      //   },
      //   color: ['#409EFF', '#F56C6C'],
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'shadow'
      //     }
      //   },
      //   legend: {
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'value',
      //     boundaryGap: [0, 0.01]
      //   },
      //   yAxis: {
      //     type: 'category',
      //     data: yAxisName
      //   },
      //   series: [
      //     {
      //       type: 'bar',
      //       barWidth: 30,
      //       data: dataValue
      //     }
      //   ]
      // }
      // myChartOne.setOption(option)
      this.loading = false
    },
    initHistoryData () {
      getTrueHistoryInputData({
        historyId: this.$route.query.historyId
      }).then(res => {
        if (res.state === 1000) {
          this.totalTableData.push(res.data.projectHumanResource.find(ele => ele.buName === '所有项目'))
          console.log(this.totalTableData)
          this.handleData()
        }
      })
    },
    // 切换分页或者选择显示范围获取部分年度投入值
    getPartProjectInputDataByYear (key) {
      this.bu = this.totalTableData[key].buName
      getProjectInputDataByYear({
        projectName: this.projectName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range,
        bu: this.bu
      }).then(res => {
        if (res.state === 1000) {
          // 先清空数据,再填充数据
          this.totalTableData[key].details = []
          this.totalTableData[key].details = res.data.projectHumanResource[0].details
          // let obj = {
          //   jan: 0,
          //   feb: 0,
          //   mar: 0,
          //   apr: 0,
          //   may: 0,
          //   jun: 0,
          //   jul: 0,
          //   aug: 0,
          //   sep: 0,
          //   oct: 0,
          //   nov: 0,
          //   dec: 0,
          //   yearTotal: 0,
          //   planYearTotal: 0,
          //   hasChildren: false,
          //   isproject: true,
          //   projectName: '统计'
          // }
          // this.totalTableData[key].details.forEach(ele => {
          //   obj.jan += Number.parseFloat(ele.jan)
          //   obj.feb += Number.parseFloat(ele.feb)
          //   obj.mar += Number.parseFloat(ele.mar)
          //   obj.apr += Number.parseFloat(ele.apr)
          //   obj.may += Number.parseFloat(ele.may)
          //   obj.jun += Number.parseFloat(ele.jun)
          //   obj.jul += Number.parseFloat(ele.jul)
          //   obj.aug += Number.parseFloat(ele.aug)
          //   obj.sep += Number.parseFloat(ele.sep)
          //   obj.oct += Number.parseFloat(ele.oct)
          //   obj.nov += Number.parseFloat(ele.nov)
          //   obj.dec += Number.parseFloat(ele.dec)
          //   obj.planYearTotal += Number.parseFloat(ele.planYearTotal)
          //   obj.yearTotal += Number.parseFloat(ele.yearTotal)
          // })
          this.totalTableData[key].details.map((ele, index) => {
            ele.projectIndex = index
            ele.expandBol = true
            ele.isproject = true
            ele.hasChildren = true
          })
          // this.totalTableData[key].details.push(obj)
        }
      })
    },
    load (tree, treeNode, resolve) {
      getPersonInputDataByHistoryProject({
        projectId: tree.projectId
      // getAllPersonInputDataByProject({
      //   projectId: tree.projectId,
      //   userType: this.peopleType,
      //   year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.projectMemberInput.length === 0) {
            setTimeout(() => {
              resolve([])
              this.$message.info('该项目下没有绑定任何人员!')
            }, 1000)
          } else {
            setTimeout(() => {
              let tempData = []
              res.data.projectMemberInput.forEach((ele, index) => {
                // 转换属性名称（userName => projectName）以及增加属性（projectId），手动带上真实的projectId（trueProjectId）
                tempData.push({
                  // projectName: ele.userName,
                  projectName: ele.userName,
                  // projectId: ele.userId,
                  // 手动绑定一个虚拟的id
                  projectId: tree.projectId * 1000 + index,
                  trueProjectId: tree.projectId,
                  jan: ele.jan,
                  feb: ele.feb,
                  mar: ele.mar,
                  apr: ele.apr,
                  may: ele.may,
                  jun: ele.jun,
                  jul: ele.jul,
                  aug: ele.aug,
                  sep: ele.sep,
                  oct: ele.oct,
                  nov: ele.nov,
                  dec: ele.dec,
                  yearTotal: ele.yearTotal,
                  planYearTotal: '',
                  isproject: false
                })
              })
              resolve(tempData)
            })
          }
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    // 新增人员
    addPerson (rowData) {
      this.showSelectPeople = true
    },
    // 可以编辑数据
    canEdit () {
      this.disabledBol = false
      this.saveButtonBol = false
    },
    // 当前行数据，月份，当前部门的索引，修改后的值，如果是project那么projectId就是projectId这个字段，如果不是projectId就是trueProjectId这个字段
    changeInputValue (rowData, month, key, newValue) {
      let projectId = ''
      let userId = ''
      if (rowData.isproject) {
        projectId = rowData.projectId
      } else {
        projectId = rowData.trueProjectId
        userId = rowData.projectId
      }
      editInputData({
        projectId,
        userId,
        month,
        value: newValue,
        userAccount: window.sessionStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          // this.$message.success(res.message)
        } else {
          // this.$message.success(res.message)
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    saveData () {
      // this.disabledBol = true
      saveInputData({
        userAccount: window.sessionStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          this.$message.success(res.message)
          setTimeout(() => {
            // this.loading = true
            this.$router.go(0)
          }, 1000)
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    rangeChange (key, range) {
      this.range = range
      this.getPartProjectInputDataByYear(key)
    },
    startNumChange (key, startNum) {
      this.startNum = startNum
      this.getPartProjectInputDataByYear(key)
    },
    netError () {
      this.$message.error('网络错误!')
    },
    jumpToEditHistory() {
      this.$router.push({
        path: '/editHistory'
      })
    },
    changeShowSelectPeople (bol) {
      this.showSelectPeople = false
    }
  },
  created () {
    // this.$router.go(0)
    this.initCurrentYear()
    this.getAllProjectNameList()
    if (this.$route.query.isHistory) {
      this.normalOrHistory = true
      this.initHistoryData()
    } else {
      this.initGetYearData()
      this.normalOrHistory = false
    }
  }
}
</script>

<style lang="scss">
.roughHistory {
  width: 1188px;
  > .top::before {
    content: '';
    display: block;
    clear: both;
  }
  > .top::after {
    content: '';
    display: block;
    clear: both;
  }
  > .top {
    width: 100%;
    position: relative;
    .rectangleBox {
      float: right
    }
  }
  > .body {
    margin-top: 20px;
    > .box-card {
      margin-bottom: 20px;
      > .el-card__body {
        > .el-pagination {
          margin-top: 10px
        }
      }
    }
  }
  > .picture {
    width: 100%;
    // background-color: pink;
  }
  > footer {
    width: 1188px;
    margin: 20px auto;
    text-align: center;
  }
}
</style>
