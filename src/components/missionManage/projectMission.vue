<template>
  <div class="projectMission">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ fromProject }}</el-breadcrumb-item>
        <el-breadcrumb-item>任务</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <!-- 进行中的任务 -->
          <el-tab-pane :label="fromProject + '进行中的任务'" name="jinxing">
            <div class="searchDiv">
              <el-input placeholder="任务名称" v-model.trim="useCaseName"></el-input>
              <el-input placeholder="创建人域账号" v-model.trim="creator"></el-input>
              <div class="block">
                <el-date-picker v-model="searchTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                @change="getTime">
                </el-date-picker>
              </div>
              <el-button type="primary" @click="search">查询</el-button>
            </div>
            <template  v-if="activeName === 'jinxing'">
              <el-card class="box-card" style="margin-top: 20px" v-for="(val, key) in tableData" :key="key">
                <div slot="header" class="clearfix">
                  <span>{{ val.versionName }}</span>
                </div>
                <el-table :data="val.taskInfo" border style="width: 100%;margin-top: 20px" :header-cell-style="{background:'rgb(250, 250, 250)'}">
                  <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
                  <el-table-column prop="taskDesc" label="任务描述" align="center"></el-table-column>
                  <el-table-column prop="startTime" label="开始时间" align="center" sortable></el-table-column>
                  <el-table-column prop="endTime" label="结束时间" align="center" sortable></el-table-column>
                  <el-table-column prop="caseTotalNumber" label="统计信息" align="center">
                    <template slot-scope="scope">
                      <el-button @click="openDialogTableTotalMes(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
                  <el-table-column prop="belongProject" label="所属项目" align="center"></el-table-column>
                  <el-table-column prop="belongVersion" label="所属版本" align="center"></el-table-column>
                  <el-table-column prop="workpd" label="工作量(条/天)" align="center"></el-table-column>
                  <el-table-column prop="round" label="当前轮次" align="center"></el-table-column>
                  <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button @click="jumpToReport(scope.row)" type="text" size="small">报告</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </template>
          </el-tab-pane>
          <!-- 历史任务 -->
          <el-tab-pane :label="fromProject + '历史的任务'" name="lishi">
            <div class="searchDiv">
              <el-input placeholder="任务名称" v-model.trim="useCaseName"></el-input>
              <el-input placeholder="创建人域账号" v-model.trim="creator"></el-input>
              <div class="block">
                <el-date-picker v-model="searchTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                @change="getTime">
                </el-date-picker>
              </div>
              <el-button type="primary" @click="search">查询</el-button>
            </div>
            <template v-if="activeName === 'lishi'">
              <el-card class="box-card" style="margin-top: 20px" v-for="(val, key) in tableData" :key="key">
                <div slot="header" class="clearfix">
                  <span>{{ val.versionName }}</span>
                </div>
                <el-table :data="val.taskInfo" border style="width: 100%;margin-top: 20px" :header-cell-style="{background:'rgb(250, 250, 250)'}">
                  <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
                  <el-table-column prop="taskDesc" label="任务描述" align="center"></el-table-column>
                  <el-table-column prop="startTime" label="开始时间" align="center" sortable></el-table-column>
                  <el-table-column prop="endTime" label="结束时间" align="center" sortable></el-table-column>
                  <el-table-column prop="caseTotalNumber" label="统计信息" align="center">
                    <template slot-scope="scope">
                      <el-button @click="openDialogTableTotalMes(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
                  <el-table-column prop="belongProject" label="所属项目" align="center"></el-table-column>
                  <el-table-column prop="belongVersion" label="所属版本" align="center"></el-table-column>
                  <el-table-column prop="workpd" label="工作量(条/天)" align="center"></el-table-column>
                  <el-table-column prop="round" label="当前轮次" align="center"></el-table-column>
                  <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button @click="jumpToReport(scope.row)" type="text" size="small">报告</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
    <!-- 统计信息 -->
    <el-dialog title="统计信息" :visible.sync="dialogTableTotalMes">
      <el-table :data="gridData" :header-cell-style="{background:'rgb(250, 250, 250)'}">
        <el-table-column property="testerName" label="人员" align="center"></el-table-column>
        <el-table-column property="caseSum" label="总用例数" align="center"></el-table-column>
        <el-table-column property="assignedCaseSum" label="分配用例数" align="center"></el-table-column>
        <el-table-column property="caseSumToExecute" label="未执行" align="center"></el-table-column>
        <el-table-column property="finishCaseSum" label="已执行" align="center"></el-table-column>
        <el-table-column property="executionRate" label="执行率(%)" align="center"></el-table-column>
        <el-table-column property="passedCaseSum" label="成功" align="center"></el-table-column>
        <el-table-column property="failedCaseSum" label="失败" align="center"></el-table-column>
        <el-table-column property="blockedCaseSum" label="阻塞" align="center"></el-table-column>
        <el-table-column property="skippedCaseSum" label="跳过" align="center"></el-table-column>
        <el-table-column property="passRate" label="通过率(%)" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getTask } from '../../api/api'
export default {
  data () {
    return {
      // 用来接收是从哪个项目跳转过来的
      fromProject: '',
      useCaseName: '',
      creator: '',
      searchTime: ['', ''],
      tableData: [],
      projectId: '',
      startNum: 1,
      range: 10,
      total: 0,
      activeName: 'jinxing',
      status: 1,
      gridData: [],
      dialogTableTotalMes: false
    }
  },
  methods: {
    // 报告
    jumpToReport (rowData) {
      this.$router.push({
        path: '/missionReport',
        query: {
          taskId: rowData.taskId,
          taskName: rowData.taskName,
          round: rowData.round
        }
      })
    },
    // 查看
    openDialogTableTotalMes (rowData) {
      this.gridData = rowData.statisticsInfo
      this.dialogTableTotalMes = true
    },
    // tab页切换，进行中status为1，历史为2
    handleClick (val) {
      if (val.name === 'jinxing') {
        this.status = 1
      } else {
        this.status = 2
      }
      this.activeName = val.name
      this.useCaseName = ''
      this.creator = ''
      this.searchTime = ['', '']
      this.startNum = 1
      this.range = 10
      this.initData()
    },
    startNumChange (val) {
      this.startNum = val
    },
    rangeChange (val) {
      this.range = val
    },
    search () {
      this.range = 10
      this.startNum = 1
      this.initData()
    },
    getTime (val) {
      if (val === null) {
        this.searchTime = ['', '']
      }
    },
    initData () {
      getTask({
        projectId: this.projectId,
        status: this.status,
        taskName: this.useCaseName,
        createAccountName: this.creator,
        startTime: this.searchTime[0],
        endTime: this.searchTime[1]
      }).then(res => {
        if (res.state === 1000) {
          this.total = res.data.total
          this.tableData = res.data.taskList
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
        this.tableData = [
          {
            taskName: '任务一',
            taskInfo: [
              {
                belongProject: 'Compass(HTP)测试平台',
                creator: '徐新宇(xinyu.xu)',
                color: 'red',
                workpd: 2,
                taskDesc: '主要用例平台内部开发测试',
                versionId: 65571,
                round: 1,
                createTime: '2019-11-23 20:41:05',
                delayDays: 13,
                progress: '完成',
                belongVersion: 'v1.5.6',
                taskName: 'COMPASS平台内部迭代测试',
                startTime: '2019-11-18',
                endTime: '2019-11-23',
                projectId: 15552,
                taskId: 47113,
                status: 1,
                statisticsInfo: [
                  {
                    participant: '人员姓名',
                    totalCaseNum: 100,
                    distributeCaseNum: 10,
                    unexcute: 10,
                    excuted: 10,
                    excutePercentage: '10%',
                    success: 10,
                    failed: 10,
                    block: 10,
                    skip: 10,
                    successPercentage: '5%'
                  }
                ]
              }, {
                belongProject: 'Compass(HTP)测试平台',
                creator: '徐新宇(xinyu.xu)',
                color: 'red',
                workpd: 2,
                taskDesc: '主要用例平台内部开发测试',
                versionId: 65571,
                round: 1,
                createTime: '2019-11-23 20:41:05',
                delayDays: 13,
                progress: '完成',
                belongVersion: 'v1.5.6',
                taskName: 'COMPASS平台内部迭代测试',
                startTime: '2019-11-18',
                endTime: '2019-11-23',
                projectId: 15552,
                taskId: 47113,
                status: 1
              }
            ]
          }, {
            taskName: 'zzzzzzzzz',
            taskInfo: [
              {
                belongProject: 'Compass(HTP)测试平台',
                creator: '徐新宇(xinyu.xu)',
                color: 'red',
                workpd: 2,
                taskDesc: '主要用例平台内部开发测试',
                versionId: 65571,
                round: 1,
                createTime: '2019-11-23 20:41:05',
                delayDays: 13,
                progress: '完成',
                belongVersion: 'v1.5.6',
                taskName: 'COMPASS平台内部迭代测试',
                startTime: '2019-11-18',
                endTime: '2019-11-23',
                projectId: 15552,
                taskId: 47113,
                status: 1
              }, {
                belongProject: 'Compass(HTP)测试平台',
                creator: '徐新宇(xinyu.xu)',
                color: 'red',
                workpd: 2,
                taskDesc: '主要用例平台内部开发测试',
                versionId: 65571,
                round: 1,
                createTime: '2019-11-23 20:41:05',
                delayDays: 13,
                progress: '完成',
                belongVersion: 'v1.5.6',
                taskName: 'COMPASS平台内部迭代测试',
                startTime: '2019-11-18',
                endTime: '2019-11-23',
                projectId: 15552,
                taskId: 47113,
                status: 1
              }
            ]
          }
        ]
      })
    }
  },
  created () {
    this.fromProject = this.$route.query.name
    this.projectId = this.$route.query.projectId
    this.initData()
  }
}
</script>

<style>
.projectMission {
  width: 100%;
}
.projectMission > .header {
  width: 1188px;
  margin: 0 auto;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.projectMission > .header > .breadcrumb {
  margin-left: 10px
}
.projectMission > main {
  width: 1190px;
  margin: 10px auto
}
.projectMission > main .searchDiv > .el-input {
  width: 230px;
  margin-right: 70px
}
.projectMission > main .searchDiv > .block {
  display: inline-block;
  margin-right: 120px
}
</style>
