<template>
  <div class="projectReport">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目报告</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <!-- 标签页 -->
        <el-tabs type="border-card">
          <el-tab-pane label="项目测试汇总">
            <!-- 任务基本信息 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>项目基本信息</span>
              </div>
              <table style="" class="table">
                <tr>
                  <td>项目名称</td>
                  <td :title="tableData.projectName">{{ tableData.projectName }}</td>
                  <td>项目编号</td>
                  <td :title="tableData.projectNumber">{{ tableData.projectNumber }}</td>
                </tr>
                <tr>
                  <td>开始时间</td>
                  <td>{{ tableData.startDate }}</td>
                  <td>结束时间</td>
                  <td>{{ tableData.endDate }}</td>
                </tr>
                <tr>
                  <td>项目经理</td>
                  <td>{{ tableData.projectManager }}</td>
                  <td>立项部门</td>
                  <td>{{ tableData.projectDepartment }}</td>
                </tr>
                <!-- <tr>
                  <td>版本信息</td>
                  <td>
                    <el-table :data="versionMesData" style="width: 100%" border class="versionMesData">
                      <el-table-column prop="version" label="版本" align="center"></el-table-column>
                    </el-table>
                  </td>
                  <td>任务信息</td>
                  <td>
                    <el-table :data="missionMesData" style="width: 100%" border class="missionMesData">
                      <el-table-column prop="versionName" label="版本名称" align="center" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip></el-table-column>
                    </el-table>
                  </td>
                </tr> -->
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
                <span>项目用例库</span>
              </div>
              <el-table :data="projectUseCaseData" border style="width: 100%" :header-cell-style="{background:'rgb(250, 250, 250)'}">
                <el-table-column prop="caseSuiteName" label="用例集名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="creator" label="创建人" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="regressRespCaseNumber" label="回归库用例数" align="center"></el-table-column>
                <el-table-column prop="versionRespCaseNumber" label="版本库用例数" align="center"></el-table-column>
                <el-table-column prop="totalCaseNumber" label="总用例数" align="center"></el-table-column>
                <el-table-column prop="distributePercentage" label="用例分配率" align="center"></el-table-column>
                <el-table-column prop="excutePercentage" label="用例执行率(%)" align="center"></el-table-column>
              </el-table>
            </el-card>
            <!-- 任务进度情况 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>项目任务执行情况</span>
              </div>
              <el-table :data="projectMissionExexuteData" border style="width: 100%" :span-method="objectSpanMethod" :header-cell-style="{background:'rgb(250, 250, 250)'}">
                <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button @click="jumpToMissionReport(scope.row)" type="text" size="small" v-if="scope.row.taskName !== '统计'">{{ scope.row.taskName }}</el-button>
                    <span v-else>{{ scope.row.taskName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="belongProduct" label="所属产品" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="belongVersion" label="所属版本" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cycleNumber" label="轮次" align="center"></el-table-column>
                <el-table-column prop="currentStatus" label="当前状态" align="center"></el-table-column>
                <el-table-column prop="assignedCaseSum" label="分配用例数" align="center" width="91"></el-table-column>
                <el-table-column prop="caseSumToExecute" label="未执行" align="center"></el-table-column>
                <el-table-column prop="excuted" label="已执行" align="center"></el-table-column>
                <el-table-column prop="executionRate" label="执行率(%)" align="center" width="87"></el-table-column>
                <el-table-column prop="passedCaseSum" label="成功" align="center" width="60"></el-table-column>
                <el-table-column prop="failedCaseSum" label="失败" align="center" width="60"></el-table-column>
                <el-table-column prop="skippedCaseSum" label="阻塞" align="center" width="60"></el-table-column>
                <el-table-column prop="blockedCaseSum" label="跳过" align="center" width="60"></el-table-column>
                <el-table-column prop="passRate" label="通过率(%)" align="center" width="87"></el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>

<script>
import { projectReport } from '../../api/api'
export default {
  data () {
    return {
      tableData: {},
      projectUseCaseData: [],
      projectMissionExexuteData: [],
      projectId: '',
      tempTaskExcuteInfo: [],
      versionMesData: [],
      missionMesData: []
    }
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 行信息
      // console.log(row)
      // 列信息
      // console.log(column)
      // 行索引
      // console.log(rowIndex)
      // 列索引
      // console.log(columnIndex)
      // 首先控制是哪一列
      if (columnIndex === 0) {
        // 其次控制哪一行，有名字就合并，长度为设置好得row.length，没名字就rowspan: 0,colspan: 0
        if (row.taskName !== '') {
          return {
            rowspan: row.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      // if (columnIndex === 1) {
      //   if (row.accountName !== '') {
      //     return {
      //       rowspan: row.length,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    },
    // 根据任务名去找相应的版本，遍历出每个版本的cycleNumber取最大值
    jumpToMissionReport (rowData) {
      let round
      let arr = []
      this.tempTaskExcuteInfo.forEach(ele => {
        if (ele.taskName === rowData.taskName) {
          ele.taskDetail.forEach(ele2 => arr.push(ele2.cycleNumber))
        }
      })
      round = Math.max(...arr)
      this.$router.push({
        path: '/missionReport',
        query: {
          taskId: rowData.taskId,
          taskName: rowData.taskName,
          round
        }
      })
    },
    initData () {
      projectReport({
        projectId: this.projectId
      }).then(res => {
        if (res.state === 1000) {
          this.versionMesData = res.data.projectBaseInfo.version.map(ele => {
            return {
              version: ele
            }
          })
          this.tableData = res.data.projectBaseInfo
          this.missionMesData = res.data.projectBaseInfo.task
          this.projectUseCaseData = res.data.projectCaseSuiteInfo
          this.tempTaskExcuteInfo = res.data.taskExcuteInfo
          let arr = []
          this.tempTaskExcuteInfo.forEach((ele, index) => {
            if (ele.taskDetail.length === 1) {
              arr.push({
                taskName: ele.taskName,
                taskId: ele.taskId,
                belongVersion: ele.taskDetail[0].belongVersion,
                belongProduct: ele.taskDetail[0].belongProduct,
                cycleNumber: ele.taskDetail[0].cycleNumber,
                currentStatus: ele.taskDetail[0].currentStatus,
                assignedCaseSum: ele.taskDetail[0].assignedCaseSum,
                caseSumToExecute: ele.taskDetail[0].caseSumToExecute,
                excuted: ele.taskDetail[0].excuted,
                executionRate: ele.taskDetail[0].executionRate,
                passedCaseSum: ele.taskDetail[0].passedCaseSum,
                failedCaseSum: ele.taskDetail[0].failedCaseSum,
                skippedCaseSum: ele.taskDetail[0].skippedCaseSum,
                blockedCaseSum: ele.taskDetail[0].blockedCaseSum,
                passRate: ele.taskDetail[0].passRate,
                length: 1
              })
            }
            if (ele.taskDetail.length > 1) {
              ele.taskDetail.forEach((ele2, index) => {
                if (index === 0) {
                  arr.push({
                    taskName: ele.taskName,
                    taskId: ele.taskId,
                    belongVersion: ele2.belongVersion,
                    belongProduct: ele2.belongProduct,
                    cycleNumber: ele2.cycleNumber,
                    currentStatus: ele2.currentStatus,
                    assignedCaseSum: ele2.assignedCaseSum,
                    caseSumToExecute: ele2.caseSumToExecute,
                    excuted: ele2.excuted,
                    executionRate: ele2.executionRate,
                    passedCaseSum: ele2.passedCaseSum,
                    failedCaseSum: ele2.failedCaseSum,
                    skippedCaseSum: ele2.skippedCaseSum,
                    blockedCaseSum: ele2.blockedCaseSum,
                    passRate: ele2.passRate,
                    length: ele.taskDetail.length
                  })
                } else {
                  arr.push({
                    taskName: '',
                    taskId: ele.taskId,
                    belongVersion: ele2.belongVersion,
                    belongProduct: ele2.belongProduct,
                    cycleNumber: ele2.cycleNumber,
                    currentStatus: ele2.currentStatus,
                    assignedCaseSum: ele2.assignedCaseSum,
                    caseSumToExecute: ele2.caseSumToExecute,
                    excuted: ele2.excuted,
                    executionRate: ele2.executionRate,
                    passedCaseSum: ele2.passedCaseSum,
                    failedCaseSum: ele2.failedCaseSum,
                    skippedCaseSum: ele2.skippedCaseSum,
                    blockedCaseSum: ele2.blockedCaseSum,
                    passRate: ele2.passRate
                  })
                }
              })
            }
          })
          let tempData = arr
          let obj = {
            taskName: '统计',
            belongVersion: '',
            cycleNumber: 0,
            currentStatus: '',
            assignedCaseSum: 0,
            caseSumToExecute: 0,
            excuted: 0,
            executionRate: 0,
            passedCaseSum: 0,
            failedCaseSum: 0,
            skippedCaseSum: 0,
            blockedCaseSum: 0,
            passRate: 0,
            length: 1
          }
          // let tempArr = []
          // console.log(tempData)
          // maxRound = 0
          tempData.forEach((ele, index, array) => {
            // if (ele.taskName !== '') {
            //   console.log(tempArr)
            //   tempArr = [0]
            //   tempArr.push(ele.cycleNumber)
            //   obj.cycleNumber += Math.max(...tempArr)
            // } else {
            //   tempArr.push(ele.cycleNumber)
            // }
            if (ele.length === 1) {
              obj.cycleNumber += ele.cycleNumber
            }
            // 如果长度大于1，那么取该长度的最后一轮
            if (ele.length > 1) {
              // for (var i = 0; i < ele.length; i++) {
              //   tempArr.push(array[index + i].cycleNumber)
              // }
              obj.cycleNumber += array[index + ele.length - 1].cycleNumber
            }
            // console.log(tempArr)
            // obj.cycleNumber += Math.max(...tempArr)
            // console.log(tempArr)
            // console.log(Math.max(...tempArr))
            // obj.cycleNumber += ele.cycleNumber
            // obj.cycleNumber += Math.max(...tempArr)
            obj.assignedCaseSum += ele.assignedCaseSum
            obj.caseSumToExecute += ele.caseSumToExecute
            obj.excuted += ele.excuted
            if (Number.isNaN(Math.floor(obj.excuted / obj.assignedCaseSum * 100))) {
              obj.executionRate = 0
            } else {
              obj.executionRate = Math.floor(obj.excuted / obj.assignedCaseSum * 100)
            }
            obj.passedCaseSum += ele.passedCaseSum
            obj.failedCaseSum += ele.failedCaseSum
            obj.blockedCaseSum += ele.blockedCaseSum
            obj.skippedCaseSum += ele.skippedCaseSum
            if (Number.isNaN(Math.floor(obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100))) {
              obj.passRate = 0
            } else {
              obj.passRate = Math.floor(obj.passedCaseSum / (obj.assignedCaseSum - obj.caseSumToExecute) * 100)
            }
          })
          tempData.push(obj)
          this.projectMissionExexuteData = tempData
          // tempData = res.data.taskExcuteInfo
          // this.projectMissionExexuteData = arr
        } else {
          this.$message.error(res.message)
          // this.tableData = {
          //   projectName: '项目名称',
          //   projectNumber: '项目编号',
          //   startDate: '2019-10-10',
          //   endDate: '2019-10-10',
          //   projectManager: '徐新宇',
          //   projectDepartment: '测试平台开发部',
          //   version: ['A版本', 'B版本'],
          //   task: [
          //     {
          //       versionName: 'A版本',
          //       taskName: 'A任务'
          //     }, {
          //       versionName: 'B版本',
          //       taskName: 'B任务'
          //     }
          //   ],
          //   creator: '徐新宇(xinyu.xu)',
          //   createTime: '2019-10-10 20:00:00'
          // }
          // this.versionMesData = this.tableData.version.map(ele => {
          //   return {
          //     version: ele
          //   }
          // })
          // this.missionMesData = this.tableData.task
          // this.projectUseCaseData = [
          //   {
          //     caseSuiteName: 'A用例集',
          //     creator: '徐新宇(xinyu.xu)',
          //     regressRespCaseNumber: 1000,
          //     versionRespCaseNumber: 1000,
          //     totalCaseNumber: 2000,
          //     distributePercentage: 10,
          //     excutePercentage: 10
          //   }, {
          //     caseSuiteName: 'A用例集',
          //     creator: '周午超(v-wuchao.zhou)',
          //     regressRespCaseNumber: 1000,
          //     versionRespCaseNumber: 1000,
          //     totalCaseNumber: 2000,
          //     distributePercentage: 10,
          //     excutePercentage: 10
          //   }
          // ]
          // this.tempTaskExcuteInfo = [
          //   {
          //     taskName: '任务1',
          //     taskId: 10001,
          //     taskDetail: [
          //       {
          //         belongVersion: '版本一',
          //         cycleNumber: 3,
          //         currentStatus: '未开始',
          //         assignedCaseSum: 10,
          //         caseSumToExecute: 10,
          //         excuted: 100,
          //         executionRate: 10,
          //         passedCaseSum: 10,
          //         failedCaseSum: 10,
          //         skippedCaseSum: 10,
          //         blockedCaseSum: 10,
          //         passRate: 10
          //       }, {
          //         belongVersion: '版本二',
          //         cycleNumber: 5,
          //         currentStatus: '未开始',
          //         assignedCaseSum: 10,
          //         caseSumToExecute: 10,
          //         excuted: 100,
          //         executionRate: 10,
          //         passedCaseSum: 10,
          //         failedCaseSum: 10,
          //         skippedCaseSum: 10,
          //         blockedCaseSum: 10,
          //         passRate: 10
          //       }, {
          //         belongVersion: '版本三',
          //         cycleNumber: 1,
          //         currentStatus: '未开始',
          //         assignedCaseSum: 10,
          //         caseSumToExecute: 10,
          //         excuted: 100,
          //         executionRate: 10,
          //         passedCaseSum: 10,
          //         failedCaseSum: 10,
          //         skippedCaseSum: 10,
          //         blockedCaseSum: 10,
          //         passRate: 10
          //       }
          //     ]
          //   }, {
          //     taskName: '任务2',
          //     taskId: 10002,
          //     taskDetail: [
          //       {
          //         belongVersion: '版本四',
          //         cycleNumber: 3,
          //         currentStatus: '未开始',
          //         assignedCaseSum: 10,
          //         caseSumToExecute: 10,
          //         excuted: 100,
          //         executionRate: 10,
          //         passedCaseSum: 10,
          //         failedCaseSum: 10,
          //         skippedCaseSum: 10,
          //         blockedCaseSum: 10,
          //         passRate: 10
          //       }, {
          //         belongVersion: '版本五',
          //         cycleNumber: 3,
          //         currentStatus: '未开始',
          //         assignedCaseSum: 10,
          //         caseSumToExecute: 10,
          //         excuted: 100,
          //         executionRate: 10,
          //         passedCaseSum: 10,
          //         failedCaseSum: 10,
          //         skippedCaseSum: 10,
          //         blockedCaseSum: 10,
          //         passRate: 10
          //       }
          //     ]
          //   }
          // ]
          // let arr = []
          // this.tempTaskExcuteInfo.forEach((ele, index) => {
          //   if (ele.taskDetail.length === 1) {
          //     arr.push({
          //       taskName: ele.taskName,
          //       taskId: ele.taskId,
          //       belongVersion: ele.taskDetail[0].belongVersion,
          //       cycleNumber: ele.taskDetail[0].cycleNumber,
          //       currentStatus: ele.taskDetail[0].currentStatus,
          //       assignedCaseSum: ele.taskDetail[0].assignedCaseSum,
          //       caseSumToExecute: ele.taskDetail[0].caseSumToExecute,
          //       excuted: ele.taskDetail[0].excuted,
          //       executionRate: ele.taskDetail[0].executionRate,
          //       passedCaseSum: ele.taskDetail[0].passedCaseSum,
          //       failedCaseSum: ele.taskDetail[0].failedCaseSum,
          //       skippedCaseSum: ele.taskDetail[0].skippedCaseSum,
          //       blockedCaseSum: ele.taskDetail[0].blockedCaseSum,
          //       passRate: ele.taskDetail[0].passRate,
          //       length: 1
          //     })
          //   }
          //   if (ele.taskDetail.length > 1) {
          //     ele.taskDetail.forEach((ele2, index) => {
          //       if (index === 0) {
          //         arr.push({
          //           taskName: ele.taskName,
          //           taskId: ele.taskId,
          //           belongVersion: ele2.belongVersion,
          //           cycleNumber: ele2.cycleNumber,
          //           currentStatus: ele2.currentStatus,
          //           assignedCaseSum: ele2.assignedCaseSum,
          //           caseSumToExecute: ele2.caseSumToExecute,
          //           excuted: ele2.excuted,
          //           executionRate: ele2.executionRate,
          //           passedCaseSum: ele2.passedCaseSum,
          //           failedCaseSum: ele2.failedCaseSum,
          //           skippedCaseSum: ele2.skippedCaseSum,
          //           blockedCaseSum: ele2.blockedCaseSum,
          //           passRate: ele2.passRate,
          //           length: ele.taskDetail.length
          //         })
          //       } else {
          //         arr.push({
          //           taskName: '',
          //           taskId: ele.taskId,
          //           belongVersion: ele2.belongVersion,
          //           cycleNumber: ele2.cycleNumber,
          //           currentStatus: ele2.currentStatus,
          //           assignedCaseSum: ele2.assignedCaseSum,
          //           caseSumToExecute: ele2.caseSumToExecute,
          //           excuted: ele2.excuted,
          //           executionRate: ele2.executionRate,
          //           passedCaseSum: ele2.passedCaseSum,
          //           failedCaseSum: ele2.failedCaseSum,
          //           skippedCaseSum: ele2.skippedCaseSum,
          //           blockedCaseSum: ele2.blockedCaseSum,
          //           passRate: ele2.passRate
          //         })
          //       }
          //     })
          //   }
          // })
          // this.projectMissionExexuteData = arr
          // this.projectMissionExexuteData = [
          //   {
          //     taskName: '任务一',
          //     belongVersion: '版本一',
          //     cycleNumber: 3,
          //     currentStatus: '未开始',
          //     assignedCaseSum: 10,
          //     caseSumToExecute: 10,
          //     excuted: 100,
          //     executionRate: 10,
          //     passedCaseSum: 10,
          //     failedCaseSum: 10,
          //     skippedCaseSum: 10,
          //     blockedCaseSum: 10,
          //     passRate: 10,
          //     length: 1
          //   }, {
          //     taskName: '任务二',
          //     belongVersion: '版本二',
          //     cycleNumber: 4,
          //     currentStatus: '未开始',
          //     assignedCaseSum: 10,
          //     caseSumToExecute: 10,
          //     excuted: 100,
          //     executionRate: 10,
          //     passedCaseSum: 10,
          //     failedCaseSum: 10,
          //     skippedCaseSum: 10,
          //     blockedCaseSum: 10,
          //     passRate: 10,
          //     length: 2
          //   }, {
          //     taskName: '',
          //     belongVersion: '版本三',
          //     cycleNumber: 4,
          //     currentStatus: '未开始',
          //     assignedCaseSum: 10,
          //     caseSumToExecute: 10,
          //     excuted: 100,
          //     executionRate: 10,
          //     passedCaseSum: 10,
          //     failedCaseSum: 10,
          //     skippedCaseSum: 10,
          //     blockedCaseSum: 10,
          //     passRate: 10
          //   }
          // ]
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
        // let tempData1 = [
        //   {
        //     qqqq
        //   }
        // ]
        // let obj1 = {
        //   caseSuiteName: '统计',
        //   assignedCaseSum: 0,
        //   caseSumToExecute: 0,
        //   finishCaseSum: 0,
        //   executionRate: 0,
        //   passedCaseSum: 0,
        //   failedCaseSum: 0,
        //   blockedCaseSum: 0,
        //   skippedCaseSum: 0,
        //   passRate: 0
        // }
      })
    }
  },
  created () {
    this.projectId = this.$route.query.projectId
    this.initData()
  }
}
</script>

<style>
.projectReport {
  width: 100%;
}
.projectReport > .header {
  width: 1188px;
  margin: 0 auto;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.projectReport > main {
  width: 1190px;
  margin: 10px auto
}
.projectReport > main > .body > .el-tabs > .el-tabs__content > .el-tab-pane > .el-card > .el-card__body > .table {
  width: 100%;
  border-collapse: collapse
}
.projectReport > main > .body .table > tr {
  width: 100%
}
.projectReport > main > .body .table > tr > td {
  text-align: center;
  min-height: 40px;
  box-sizing: border-box;
  /* border: 1px solid #ccc;
  margin-top: -1px;
  margin-left: -1px; */
  /* vertical-align: middle; */
  line-height: 40px;
  box-sizing: border-box;
  display: inline-block
}
.projectReport > main > .body .table > tr > td:nth-of-type(1), .projectReport > main > .body .table > tr > td:nth-of-type(3) {
  width: 100px;
}
.projectReport > main > .body .table > tr > td:nth-of-type(2), .projectReport > main > .body .table > tr > td:nth-of-type(4) {
  width: 457px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.projectReport > main > .body .table > tr > td:nth-of-type(2n - 1) {
  font-weight: 700;
  /* border: 1px solid #EBEEF5; */
  /* margin-top: -1px */
}
.projectReport > main > .body .table > tr {
  border: 1px solid #EBEEF5;
  box-sizing: border-box
}
.projectReport > main > .body .table > tr > td:nth-of-type(2) {
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
}
.projectReport > main > .body .table > tr > td:nth-of-type(4) {
  border-left: 1px solid #EBEEF5;
  /* border-right: 1px solid #EBEEF5; */
}
.projectReport .box-card {
  margin-top: 20px
}
.projectReport .versionMesData .el-table__header-wrapper {
  display: none
}
.projectReport .missionMesData .el-table__header-wrapper {
  display: none
}
</style>
