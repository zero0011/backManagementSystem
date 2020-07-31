<template>
  <div class="missionReport">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/missionManage' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务报告</el-breadcrumb-item>
        <el-breadcrumb-item>{{ fromMission }}</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body" v-loading="loading" element-loading-text="正在生成中">
        <!-- 下拉菜单 -->
        <el-select v-model="value" placeholder="请选择" @change="getCurrentRound">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="value2"
          placeholder="请选择"
          @change="getdoing"
          v-if="activeName === 'specific'"
        >
          <el-option
            v-for="item2 in options2"
            :key="item2.value"
            :label="item2.label"
            :value="item2.value"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="getExcel"
          v-if="activeName === 'execute'"
          class="derive"
        >导出</el-button>
        <!-- 标签页 -->
        <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
          <el-tab-pane label="任务执行汇总" name="execute">
            <!-- 任务基本信息 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>任务基本信息</span>
              </div>
              <table style="width: 100%" class="table">
                <tr>
                  <td>任务名称</td>
                  <td :title="tableData.taskName">{{ tableData.taskName }}</td>
                  <td>任务描述</td>
                  <td :title="tableData.taskDesc">{{ tableData.taskDesc }}</td>
                </tr>
                <tr>
                  <td>开始时间</td>
                  <td>{{ tableData.startDate }}</td>
                  <td>结束时间</td>
                  <td>{{ tableData.endDate }}</td>
                </tr>
                <tr>
                  <td>所属项目</td>
                  <td>{{ tableData.belongProject }}</td>
                  <td>所属版本</td>
                  <td>{{ tableData.belongVersion }}</td>
                </tr>
                <tr>
                  <td>创建人</td>
                  <td>{{ tableData.creator }}</td>
                  <td>创建时间</td>
                  <td>{{ tableData.createTime }}</td>
                </tr>
              </table>
            </el-card>
            <!-- 任务执行情况 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>任务进度情况</span>
              </div>
              <el-table
                :data="missionExecuteTableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
              >
                <el-table-column prop="participant" label="姓名" align="center"></el-table-column>
                <el-table-column prop="taskStatus" label="任务状态" align="center"></el-table-column>
                <el-table-column prop="delayDays" label="延期天数" align="center"></el-table-column>
                <el-table-column prop="workpd" label="工作量(条/天)" align="center"></el-table-column>
              </el-table>
            </el-card>
            <!-- 任务进度情况 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>任务执行情况</span>
              </div>
              <el-table
                :data="missionProgressTableData"
                border
                style="width: 100%"
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
              >
                <el-table-column prop="testerName" label="姓名" align="center" width="200"></el-table-column>
                <el-table-column prop="assignedCaseSum" label="分配用例数" align="center"></el-table-column>
                <el-table-column prop="caseSumToExecute" label="未执行" align="center"></el-table-column>
                <el-table-column prop="finishCaseSum" label="已执行" align="center"></el-table-column>
                <el-table-column prop="executionRate" label="执行率(%)" align="center" :render-header="renderHeader2"></el-table-column>
                <el-table-column prop="passedCaseSum" label="成功" align="center"></el-table-column>
                <el-table-column prop="failedCaseSum" label="失败" align="center"></el-table-column>
                <el-table-column prop="blockedCaseSum" label="阻塞" align="center"></el-table-column>
                <el-table-column prop="skippedCaseSum" label="跳过" align="center"></el-table-column>
                <el-table-column prop="passRate" label="通过率(%)" align="center" :render-header="renderHeader"></el-table-column>
                <!-- 成功 / （分配的用例数 - 未执行） -->
                <!-- 成功 / 已执行 -->
                <!-- obj.passRate = (obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100).toFixed(2) -->
              </el-table>
            </el-card>
            <!-- 最下面两个饼图 -->
            <el-card class="box-card circleBackground">
              <div class="chunk">
                <span class="title">执行结果统计</span>
                <!-- 项目选择 -->
                <el-select v-model="personValue" @change="getPersonValue" class="projectSelect">
                  <el-option
                    v-for="item in missionProgressTableData"
                    :key="item.testerName"
                    :label="item.testerName"
                    :value="item.testerName"
                  ></el-option>
                </el-select>
                <div id="leftCircle" style="width: 100%;height:300px"></div>
              </div>
              <div class="chunk chunkRight">
                <span class="title">人员统计</span>
                <!-- 项目选择 -->
                <el-select v-model="resultValue" @change="getResultValue" class="personRight">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div id="rightCircle" style="width: 100%;height:300px"></div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="任务明细汇总" name="specific">
            <!-- <span>人员选择：</span> -->
            <el-select v-model="person" placeholder="请选择" @change="getPerson">
              <el-option
                v-for="item in people"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-card class="box-card" v-for="(val, key) in specificData" :key="key">
              <div slot="header" class="clearfix">
                <span>{{ val.name }}</span>
                <!-- <el-switch v-model="val.value" active-text="已执行" inactive-text="未执行" @change="getSingleCheck(key, $event)" style="float: right" :key="key"></el-switch> -->
              </div>
              <el-table
                :data="val.list"
                tooltip-effect="dark"
                style="width: 1146px"
                @selection-change="handleSelectionChange($event, key)"
                border
                :header-cell-style="{background:'rgb(250, 250, 250)'}"
              >
                <el-table-column
                  prop="nodeName"
                  label="用例名称"
                  width="249"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="belongCaseSuite"
                  label="所属用例集"
                  width="200"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="belongRepository"
                  label="所属库"
                  show-overflow-tooltip
                  align="center"
                  width="145"
                ></el-table-column>
                <el-table-column
                  prop="caseId"
                  label="用例id"
                  show-overflow-tooltip
                  align="center"
                  width="145"
                ></el-table-column>
                <el-table-column label="用例详情" show-overflow-tooltip align="center">
                  <template slot-scope="scope">
                    <el-button @click="seeMoreData(scope.row)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="执行结果" show-overflow-tooltip align="center" width="145">
                  <template slot-scope="scope">
                    <!-- <el-button @click="deltestPeople(key, scope.$index, scope.row)" type="text" size="small">{{ scope.row.excuteResult }}</el-button> -->
                    <el-button
                      @click="seeAllStatus(scope.row)"
                      type="text"
                      size="small"
                      v-if="scope.row.excuteResult === 1"
                    >通过</el-button>
                    <el-button
                      @click="seeAllStatus(scope.row)"
                      type="text"
                      size="small"
                      v-else-if="scope.row.excuteResult === 2"
                    >失败</el-button>
                    <el-button
                      @click="seeAllStatus(scope.row)"
                      type="text"
                      size="small"
                      v-else-if="scope.row.excuteResult === 3"
                    >阻塞</el-button>
                    <el-button
                      @click="seeAllStatus(scope.row)"
                      type="text"
                      size="small"
                      v-else-if="scope.row.excuteResult === 4"
                    >跳过</el-button>
                    <el-button @click="seeAllStatus(scope.row)" type="text" size="small" v-else>未执行</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  show-overflow-tooltip
                  align="center"
                  width="145"
                ></el-table-column>
              </el-table>
              <el-pagination
                :current-page.sync="val.startNum"
                :page-sizes="[5, 10, 20, 100]"
                :page-size="val.range"
                :total="val.total"
                layout="total, sizes, prev, pager, next"
                @size-change="rangeChange(key, $event)"
                @current-change="startNumChange(key, $event)"
                style="margin-top: 20px"
              ></el-pagination>
            </el-card>
          </el-tab-pane>
          <div v-if="dataMore" style="text-align: center;margin-top: 20px;font-size: 24px">暂无数据</div>
        </el-tabs>
      </div>
    </main>
    <footer style="text-align: center">
      <el-button
        type="primary"
        @click="getMore"
        v-if="showMore && activeName === 'specific'"
        style="margin: 0 auto"
      >获取更多</el-button>
    </footer>
    <!-- 用例详情 -->
    <el-dialog title="用例详情" :visible.sync="showCaseMore" class="seeMoreCase">
      <ul>
        <li>
          <span>用例名称：</span>
          <span>{{ showCaseData.nodeName }}</span>
        </li>
        <li>
          <span>预置条件：</span>
          <span>{{ showCaseData.precondition }}</span>
        </li>
        <li>
          <span>测试数据：</span>
          <span>{{ showCaseData.caseData }}</span>
        </li>
        <li>
          <span>测试步骤：</span>
          <span>{{ showCaseData.caseStep }}</span>
        </li>
        <li>
          <span>预期结果：</span>
          <span>{{ showCaseData.exceptResult }}</span>
        </li>
      </ul>
    </el-dialog>
    <!-- 执行记录 -->
    <el-dialog title :visible.sync="seeAllUserStatus" class="allUserStatus">
      <el-table :data="gridData" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
        <el-table-column prop="result" label="执行结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.result === '通过'" style="color: #67C23A">{{ scope.row.result }}</span>
            <span
              v-if="scope.row.result === '失败' || scope.row.result === '阻塞'"
              style="color: #F56C6C"
            >{{ scope.row.result }}</span>
            <span v-if="scope.row.result === '跳过'">{{ scope.row.result }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="执行人" align="center"></el-table-column>
        <el-table-column prop="operateTime" label="执行时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 下载报告 -->
    <el-dialog title="下载报告" :visible.sync="dialogDownLoad" class="dialogDownLoad">
      <div style="text-align: center">
        <el-button type="primary">
          <a :href="downLoadPath" download="模板.xlsx" style="text-decoration: none;color: #fff">下载</a>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { taskreport, getAssignedCaseDetailByUser, getTaskStatisticInfoPower, getReportCaseExecuteResultHistory, exportCaseExecutedResultWithExcel } from '../../api/api'
export default {
  data() {
    return {
      fromMission: '',
      activeName: 'execute',
      tabPosition: 'left',
      options: [],
      // 第几轮
      value: '',
      value2: '',
      userId: '',
      tableData: {},
      missionProgressTableData: [],
      missionExecuteTableData: [],
      person: '',
      people: [],
      specificData: [
        // {
        //   path: '用例集1',
        //   details: [
        //     {
        //       caseId: 100611798,
        //       nodeName: '用例1',
        //       belongCaseSuite: '刘昂山测试合并',
        //       belongRepository: '版本库',
        //       caseNumber: 'TC20191204145042',
        //       precondition: 'xxx(预制条件1)',
        //       caseStep: 'xxx(测试步骤1)',
        //       exceptResult: 'xxx(预期结果1)',
        //       excuteResult: 'xxx(执行结果1)',
        //       remark: 'xxxxx(备注1)'
        //     }, {
        //       caseId: 100611799,
        //       nodeName: '用例2',
        //       belongCaseSuite: '周午超测试合并',
        //       belongRepository: '版本库',
        //       caseNumber: 'TC20191204145043',
        //       precondition: 'xxx(预制条件2)',
        //       caseStep: 'xxx(测试步骤2)',
        //       exceptResult: 'xxx(预期结果2)',
        //       excuteResult: 'xxx(执行结果2)',
        //       remark: 'xxxxx(备注2)'
        //     }
        //   ],
        //   value: true,
        //   total: 20,
        //   startNum: 1,
        //   range: 10
        // }, {
        //   path: '用例集2',
        //   details: [
        //     {
        //       caseId: 200611798,
        //       nodeName: '用例3',
        //       belongCaseSuite: '刘昂山测试合并',
        //       belongRepository: '版本库',
        //       caseNumber: 'TC20191204145042',
        //       precondition: 'xxx(预制条件1)',
        //       caseStep: 'xxx(测试步骤1)',
        //       exceptResult: 'xxx(预期结果1)',
        //       excuteResult: 'xxx(执行结果1)',
        //       remark: 'xxxxx(备注1)'
        //     }, {
        //       caseId: 200611799,
        //       nodeName: '用例4',
        //       belongCaseSuite: '周午超测试合并',
        //       belongRepository: '版本库',
        //       caseNumber: 'TC20191204145043',
        //       precondition: 'xxx(预制条件2)',
        //       caseStep: 'xxx(测试步骤2)',
        //       exceptResult: 'xxx(预期结果2)',
        //       excuteResult: 'xxx(执行结果2)',
        //       remark: 'xxxxx(备注2)'
        //     }
        //   ],
        //   value: true,
        //   total: 100,
        //   startNum: 1,
        //   range: 10
        // }
      ],
      startNum: 1,
      range: 10,
      sum: 1,
      excuted: 1,
      // tableIndex: 0,
      nodeName: '',
      showMore: true,
      dataMore: false,
      showCaseMore: false,
      seeAllUserStatus: false,
      showCaseData: {},
      gridData: [],
      loading: false,
      dialogDownLoad: false,
      downLoadPath: '',
      options2: [
        {
          label: '已执行',
          value: 1
        }, {
          label: '未执行',
          value: 0
        }
      ],
      options3: [
        { label: '成功', value: 'passedCaseSum' },
        { label: '失败', value: 'failedCaseSum' },
        { label: '阻塞', value: 'blockedCaseSum' },
        { label: '跳过', value: 'skippedCaseSum' },
        { label: '未执行', value: 'caseSumToExecute' },
        { label: '已执行', value: 'finishCaseSum' },
        { label: '分配用例数', value: 'assignedCaseSum' }],
      personValue: '统计',
      resultValue: 'passedCaseSum',
      rightCircleData: ''
    }
  },
  methods: {
    renderHeader (h, {column, $index}) {
      return (
        <div>
          <span>通过率</span>
          <el-popover placement="top-start" width="200" trigger="hover" content="通过率 = 成功 / 已执行">
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </div>
      )
    },
    renderHeader2 (h, {column, $index}) {
      return (
        <div>
          <span>执行率</span>
          <el-popover placement="top-start" width="200" trigger="hover" content="执行率 = 已执行 / 分配用例数">
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </div>
      )
    },
    getdoing(exc) {
      this.sum = 1
      console.log(exc)
      let bol
      if (exc) {
        bol = true
      } else {
        bol = false
      }
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: '',
        startNum: 1,
        range: 10,
        showNum: 10,
        turn: this.value,
        excuted: exc
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.assignedCases.length === 0) {
            this.dataMore = true
            this.specificData = []
          } else {
            this.specificData = res.data.assignedCases.map(ele => {
              return {
                name: ele.name,
                total: ele.total,
                list: ele.list,
                value: bol,
                startNum: 1,
                range: 10
              }
            })
            this.dataMore = false
            this.showMore = true
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    getExcel() {
      this.loading = true
      exportCaseExecutedResultWithExcel({
        taskId: this.$route.query.taskId,
        taskName: this.$route.query.taskName,
        currentTimes: this.$route.query.round,
        cycle: this.value
      }).then(res => {
        if (res.state === 1000) {
          this.loading = false
          // this.downLoadPath = 'http://' + res.data.ipAddress + ':' + res.data.port + res.data.pathName
          this.downLoadPath = res.data.taskReportFilePath
          setTimeout(() => {
            this.dialogDownLoad = true
          }, 1000)
        } else {
          this.$message.error(res.message)
          setTimeout(() => {
            this.loading = false
          }, 1500)
        }
      }, rej => {
        this.loading = false
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    getMore() {
      this.sum++
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: '',
        startNum: 1,
        range: 10,
        showNum: 10 * this.sum,
        turn: this.value,
        excuted: 1
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.assignedCases.length === 0) {
            this.$message.warning('暂无更多数据！')
            this.sum = null
            this.showMore = false
            // if (this.sum >= 1) {
            //   this.showMore = true
            // }
            // this.showMore = false
          } else {
            this.specificData.push(...res.data.assignedCases.map(ele => {
              return {
                name: ele.name,
                total: ele.total,
                list: ele.list,
                value: true,
                startNum: 1,
                range: 10
              }
            }))
            this.showMore = true
          }
          // this.specificData = res.data.assignedCases.map(ele => {
          //   return {
          //     name: ele.name,
          //     total: ele.total,
          //     list: ele.list,
          //     value: true,
          //     startNum: 1,
          //     range: 10
          //   }
          // })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    seeAllStatus(rowData) {
      getReportCaseExecuteResultHistory({
        taskId: this.$route.query.taskId,
        caseId: rowData.caseId,
        accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        turn: this.value
      }).then(res => {
        if (res.state === 1000) {
          this.gridData = res.data.history
          this.seeAllUserStatus = true
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误')
      })
    },
    // 查看用例详情
    seeMoreData(rowData) {
      this.showCaseData = []
      this.showCaseData = rowData
      this.showCaseMore = true
    },
    // 当前第几张表，当前表每页展示多少条数据
    rangeChange(tableIndex, tableRange) {
      if (this.specificData[tableIndex].value) {
        this.excuted = 1
      } else {
        this.excuted = 0
      }
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: this.specificData[tableIndex].name,
        startNum: this.specificData[tableIndex].startNum,
        range: tableRange,
        showNum: '',
        turn: this.value,
        excuted: this.excuted
      }).then(res => {
        if (res.state === 1000) {
          let tempData = []
          tempData = res.data.assignedCases.map(ele => {
            return {
              name: ele.name,
              total: ele.total,
              list: ele.list,
              value: this.specificData[tableIndex].value,
              startNum: this.specificData[tableIndex].startNum,
              range: tableRange
            }
          })
          this.specificData.splice(tableIndex, 1, ...tempData)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    // 当前第几张表，当前表的第几页
    startNumChange(tableIndex, pageIndex) {
      if (this.specificData[tableIndex].value) {
        this.excuted = 1
      } else {
        this.excuted = 0
      }
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: this.specificData[tableIndex].name,
        startNum: pageIndex,
        range: this.specificData[tableIndex].range,
        showNum: '',
        turn: this.value,
        excuted: this.excuted
      }).then(res => {
        if (res.state === 1000) {
          let tempData = []
          tempData = res.data.assignedCases.map(ele => {
            return {
              name: ele.name,
              total: ele.total,
              list: ele.list,
              value: this.specificData[tableIndex].value,
              startNum: pageIndex,
              range: this.specificData[tableIndex].range
            }
          })
          this.$set(this.specificData, tableIndex, ...tempData)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    // 当前第几张表，当前表的开关状态
    getSingleCheck(tableIndex, bol) {
      if (bol) {
        this.excuted = 1
      } else {
        this.excuted = 0
      }
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: this.specificData[tableIndex].name || '',
        startNum: this.specificData[tableIndex].startNum,
        range: this.specificData[tableIndex].range,
        showNum: 10,
        turn: this.value,
        excuted: this.excuted
      }).then(res => {
        if (res.state === 1000) {
          let tempData = []
          tempData.splice(0, tempData.length)
          tempData = res.data.assignedCases.map(ele => {
            return {
              name: ele.name,
              total: ele.total,
              list: ele.list,
              value: bol,
              startNum: 1,
              range: 10
            }
          })
          if (tempData.length === 0) {
            this.$message.warning('没有数据')
            setTimeout(() => {
              this.specificData[tableIndex].value = !bol
            }, 1000)
          } else {
            this.specificData.splice(tableIndex, 1, ...tempData)
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    // 人员
    getPerson(val) {
      this.userId = val
      this.value2 = '已执行'
      this.sum = 1
      this.getAnotherData()
    },
    // 任务执行汇总/任务明细汇总
    tabClick(tab) {
      this.value2 = '已执行'
      // console.log(tab.label)
      if (tab.label === '任务执行汇总') {
        this.dataMore = false
      }
      this.initGetData()
    },
    // 轮次
    getCurrentRound(round) {
      this.value = round
      this.value2 = '已执行'
      this.sum = 1
      this.initGetData()
    },
    // 任务明细汇总
    getAnotherData(exc = 1) {
      getAssignedCaseDetailByUser({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        nodeName: '',
        startNum: 1,
        range: 10,
        showNum: 10,
        turn: this.value,
        excuted: exc
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.assignedCases.length === 0) {
            this.showMore = false
            this.dataMore = true
            this.specificData = []
          } else {
            this.specificData = res.data.assignedCases.map(ele => {
              return {
                name: ele.name,
                total: ele.total,
                list: ele.list,
                value: true,
                startNum: 1,
                range: 10
              }
            })
            this.showMore = true
            this.dataMore = false
            this.addEventListenerScroll()
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    getPageHeight() {
      this.$nextTick(() => {
        // console.log(document.getElementsByClassName('missionReport')[0].scrollHeight)
        // console.log(document.body.clientHeight)
      })
      // console.log(document.body.scrollHeight)
      // console.log(document.body.clientHeight)
      // console.log(document.body.scrollHeight)
    },
    // 监听滚动的距离
    addEventListenerScroll() {
      if (this.activeName === 'specific') {
        // console.log(document.body.clientHeight)
        // let ch = document.body.clientHeight
        // console.log(typeof document.body.clientHeight)
        window.addEventListener('scroll', event => {
          // this.getPageHeight()
          // let currentPage = document.querySelector('.missionReport')
          // let ch = currentPage.clientHeight
          // console.log(currentPage.clientHeight)
          // console.log(currentPage.scrollTop)
          // console.log(currentPage.scrollHeight)
          // let ch = document.body.clientHeight
          // console.log(document.body.clientHeight)
          // console.log(document.body.scrollHeight)
          // console.log(document.body.clientHeight)
          // 滚动的高度
          // let scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
          // console.log(scrollTop)
          // console.log(document.body.scrollHeight)
          // console.log(typeof scrollTop)
          // if (scrollTop >= document.body.clientHeight) {
          //   alert(11111)
          // }
          // if (true) {
          // alert(1111)
          // }
        })
      }
    },
    initGetData() {
      // 任务执行明细
      if (this.activeName === 'execute') {
        taskreport({
          taskId: this.$route.query.taskId,
          currentCycle: this.value,
          taskName: this.$route.query.taskName
        }).then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.taskBaseInfo
            this.missionExecuteTableData = res.data.taskProgressInfo
            this.rightCircle('passedCaseSum', res.data.taskExcuteInfo)
            this.rightCircleData = res.data.taskExcuteInfo
            let tempData = []
            tempData = res.data.taskExcuteInfo
            // 遍历每一项统计
            let obj = {
              testerName: '统计',
              assignedCaseSum: 0,
              caseSumToExecute: 0,
              finishCaseSum: 0,
              executionRate: 0,
              passedCaseSum: 0,
              failedCaseSum: 0,
              blockedCaseSum: 0,
              skippedCaseSum: 0,
              passRate: 0
            }
            tempData.forEach(ele => {
              obj.assignedCaseSum += ele.assignedCaseSum
              obj.caseSumToExecute += ele.caseSumToExecute
              obj.finishCaseSum += ele.finishCaseSum
              if (Number.isNaN(Math.floor(obj.finishCaseSum / obj.assignedCaseSum * 100))) {
                obj.executionRate = 0
              } else {
                // obj.executionRate = Math.floor(obj.finishCaseSum / obj.assignedCaseSum * 100)
                obj.executionRate = (obj.finishCaseSum / obj.assignedCaseSum * 100).toFixed(2)
              }
              obj.passedCaseSum += ele.passedCaseSum
              obj.failedCaseSum += ele.failedCaseSum
              obj.blockedCaseSum += ele.blockedCaseSum
              obj.skippedCaseSum += ele.skippedCaseSum
              if (Number.isNaN(Math.floor(obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100))) {
                obj.passRate = 0
              } else {
                // obj.passRate = Math.floor(obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100)
                obj.passRate = (obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100).toFixed(2)
              }
            })
            tempData.push(obj)
            this.missionProgressTableData = tempData
            this.leftCircle(obj)
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
      } else {
        let promise = getTaskStatisticInfoPower({
          taskId: this.$route.query.taskId
        }).then(res => {
          if (res.state === 1000) {
            this.people = res.data.caseExecutionStatistic.map(ele => {
              return {
                value: ele.id,
                label: ele.testerName
              }
            })
            this.person = this.people[0].label
            this.userId = this.people[0].value
            return res.data.caseExecutionStatistic
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
        Promise.all([promise]).then(val => {
          // console.log(val)
          this.getAnotherData()
          // this.people = val[0].map(ele => {
          //   return {
          //     value: ele.id,
          //     label: ele.testerName
          //   }
          // })
          // this.person = this.people[0]
          // getAssignedCaseDetailByUser({
          //   taskId: this.$route.query.taskId,
          //   userId: this.userId,
          //   nodeName: '',
          //   startNum: '',
          //   range: '',
          //   showNum: '',
          //   turn: '',
          //   excuted: ''
          // }).then(res => {
          //   if (res.state === 1000) {
          //     console.log(res)
          //   } else {
          //     this.$message.error(res.message)
          //   }
          // }, rej => {
          //   this.$message.error('网络错误，请稍后再试！')
          // })
        })
      }
    },
    leftCircle(value) {
      const leftCircle = this.$echarts.init(document.getElementById('leftCircle'))
      const leftCircleOption = {
        color: ['#00D0BB', '#FFD33D', '#409EFF', '#F56C6C', '#0AA777', '#67C23A', '#E6A23C', '#909399'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          icon: 'circle',
          orient: 'vertical',
          top: '20px',
          left: '20px',
          itemWidth: 9,
          itemHeight: 9,
          formatter: ' {name}',
          data: ['成功', '失败', '阻塞', '跳过', '未执行']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['60%', '60%'],
            data: [
              {
                value: value.passedCaseSum,
                name: '成功'
              }, {
                value: value.failedCaseSum,
                name: '失败'
              }, {
                value: value.blockedCaseSum,
                name: '阻塞'
              },
              {
                value: value.skippedCaseSum,
                name: '跳过'
              },
              {
                value: value.caseSumToExecute,
                name: '未执行'
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
              formatter: '{c}' + '条'
            }
          }
        ]
      }
      leftCircle.setOption(leftCircleOption, true)
    },
    rightCircle(val, data) {
      const rightCircle = this.$echarts.init(document.getElementById('rightCircle'))
      const rightCircleOption = {
        color: ['#00D0BB', '#FFD33D', '#409EFF', '#F56C6C', '#0AA777', '#67C23A', '#E6A23C', '#909399'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          icon: 'circle',
          orient: 'vertical',
          top: '20px',
          left: '20px',
          itemWidth: 9,
          itemHeight: 9,
          formatter: ' {name}',
          data: data.map(item => item.testerName)
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['60%', '60%'],
            data: data.map(item => {
              return {
                name: item.testerName,
                value: item[val]

              }
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{c}' + '条'
            }
          }
        ]
      }
      rightCircle.setOption(rightCircleOption, true)
    },
    getPersonValue(val) {
      const data = this.missionProgressTableData.find(item => item.testerName === val)
      this.leftCircle(data)
    },
    getResultValue(val) {
      const data = this.rightCircleData.filter(item => item.testerName !== '统计')
      this.rightCircle(val, data)
    }
  },
  created() {
    window.addEventListener('scroll', event => {
      // console.log(document.getElementById('pane-specific').scrollTop)
    })
    this.fromMission = this.$route.query.taskName
    for (var i = 0; i < this.$route.query.round; i++) {
      this.options.push({
        value: i + 1,
        label: '第' + (i + 1) + '轮测试'
      })
    }
    this.value = this.options[this.options.length - 1].value
    this.activeName = 'execute'
    this.initGetData()
  }
}
</script>

<style>
@font-face {
  font-family: 'alibabapuhuiti';
  src: url('../../assets/font/Alibaba-PuHuiTi-Medium.otf');
}
.missionReport {
  width: 100%;
}
.missionReport > .header {
  width: 1188px;
  margin: 0 auto;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.missionReport > .header > .breadcrumb {
  margin-left: 10px;
}
.missionReport > main {
  width: 1190px;
  margin: 10px auto;
}
.missionReport
  > main
  > .body
  > .el-tabs
  > .el-tabs__content
  > .el-tab-pane
  > .el-card
  > .el-card__body
  > .table {
  width: 100%;
  border-collapse: collapse;
}
.missionReport > main > .body .table > tr {
  width: 100%;
  /* border: 1px solid #EBEEF5 */
}
.missionReport > main > .body .table > tr > td {
  text-align: center;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  display: inline-block;
  margin-top: -1px;
  margin-left: -1px;
  border: 1px solid #ebeef5;
  /* float: left; */
}
.missionReport > main > .body .table > tr > td:nth-of-type(1),
.missionReport > main > .body .table > tr > td:nth-of-type(3) {
  width: 100px;
}
.missionReport > main > .body .table > tr > td:nth-of-type(2),
.missionReport > main > .body .table > tr > td:nth-of-type(4) {
  width: 457.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.missionReport .body > .el-select {
  z-index: 100;
  float: right;
  margin-top: 5px;
  margin-right: 15px;
}
.missionReport .body > .derive {
  z-index: 100;
  float: right;
  position: relative;
  margin-top: 5px;
  margin-right: 50px;
}
.missionReport .body > .el-tabs .el-tabs__item {
  height: 50px;
  line-height: 50px;
}
.missionReport > main > .body .table > tr > td:nth-of-type(2n - 1) {
  font-weight: 700;
}
.missionReport .box-card {
  margin-top: 20px;
}
.missionReport .seeMoreCase ul {
  list-style: none;
  /* background-color: #ccc; */
}
.missionReport .seeMoreCase ul > li {
  font-size: 16px;
  margin-bottom: 20px;
  /* border-bottom: 1px solid #ccc */
}
.missionReport .seeMoreCase ul > li > span:nth-of-type(1) {
  font-weight: 600;
}
.missionReport
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header {
  width: 100%;
}
.missionReport
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > .has-gutter
  > tr
  > th {
  width: 50%;
}
.missionReport
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper {
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
}
.missionReport .el-loading-spinner {
  top: 30px;
}
.chunk {
  height: 370px;
  background-color: rgba(255, 255, 255, 1);
  float: left;
  border-radius: 2px;
  width: 48%;
  margin-bottom: 24px;
}
.circleBackground {
  background: #f5f7fa;
}
.chunkRight {
  margin-left: 33px;
}
.title {
  margin: 15px 0 0 15px;
  font-family: 'alibabapuhuiti';
  font-size: 14px;
}
.projectSelect {
  margin: 15px 0 0 180px;
}
.personRight {
  margin: 15px 0 0 210px;
}
.chunk .el-input {
  height: 30px;
}
.chunk .el-input > .el-input__inner {
  height: 30px;
}
.chunk
  .el-input
  > .el-input__suffix
  > .el-input__suffix-inner
  > .el-input__icon {
  line-height: 30px;
}
</style>
