<template>
  <div class="projectJoinApp">
    <!-- 搜索数据 -->
    <div class="search">
      <el-input v-model="serchForm.projectName" placeholder="项目名称"></el-input>
      <el-input v-model="serchForm.projectManager" placeholder="项目经理域账号"></el-input>
      <el-input v-model="serchForm.creator" placeholder="创建人域账号"></el-input>
      <div class="block">
        <el-date-picker
          v-model="serchForm.searchTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getTime"
        ></el-date-picker>
      </div>
      <el-button type="primary" @click="searchProject" style="margin-right: 0px;">查询</el-button>
      <el-button type="primary" @click="createProject" style="margin-right: 0px;">创建项目</el-button>
    </div>
    <!-- 我参与的项目列表 -->
    <el-table :data="tableData" type="expand" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item :title="scope.row.projectDesc" label="项目描述">
              <span>{{ scope.row.projectDesc }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ scope.row.creator }}</span>
            </el-form-item>
            <el-form-item label="所属部门">
              <span>{{ scope.row.department }}</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item label="项目阶段">
              <span>{{ scope.row.stageInfo }}</span>
            </el-form-item>
            <el-form-item label="用例数">
              <span>{{ scope.row.caseNumbers }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column fixed prop="projectName" label="项目名称" align="center" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          <el-button @click="jumpToVersionList(scope.row)" type="text" size="small">{{ scope.row.projectName }}</el-button>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="projectNumber"
        label="项目编号"
        width="120px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="projectManager"
        label="项目经理"
        width="160px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="caseNumbers" label="用例数" width="90px"  align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stageInfo" label="项目阶段" width="110px" align="center"></el-table-column>-->
      <el-table-column
        prop="projectType"
        label="项目类型"
        width="120px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectBelong"
        label="立项部门"
        width="120px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="testerLeader"
        label="测试代表"
        width="120px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
        align="center"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="jumpToProjectReport(scope.row)">报告</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToCase(scope.row)">用例集</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToMission(scope.row)">任务</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="jumpToUseCaseLibraryTwo(scope.row)" type="text" size="small">版本查看</el-button> -->
          <!-- <el-button @click="jumpToProjectReport(scope.row)" type="text" size="small">报告</el-button>
          <el-button @click="jumpToCase(scope.row)" type="text" size="small">用例集</el-button>
          <el-button @click="jumpToMission(scope.row)" type="text" size="small">任务</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 20]"
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="rangeChange"
      @current-change="startNumChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getProjectByParticipant } from '../../api/api'
export default {
  data() {
    return {
      serchForm: {
        projectName: '',
        projectManager: '',
        creator: '',
        searchTime: null,
        trueSearchTime: ['', '']
      },
      startNum: 1,
      total: null,
      range: 10,
      tableData: []
    }
  },
  methods: {
    // 操作栏的报告
    jumpToProjectReport(rowData) {
      this.$router.push({
        path: '/projectReport',
        query: {
          projectId: rowData.projectId
        }
      })
    },
    // 操作栏的任务
    jumpToMission(rowData) {
      this.$router.push({
        path: '/projectMission',
        query: {
          name: rowData.projectName,
          projectId: rowData.projectId
        }
      })
    },
    // 操作栏的用例集
    jumpToCase(rowData) {
      this.$router.push({
        path: '/projectUseCaseManagment',
        query: {
          name: rowData.projectName,
          projectId: rowData.projectId
        }
      })
    },
    // 刷新页面表格数据
    initTableData() {
      let queryData = {
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.startNum,
        range: this.range,
        projectName: '',
        projectManager: '',
        creator: '',
        startTime: '',
        endTime: ''
      }

      getProjectByParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.projectList

            // 把projectType这个字段数字换成汉字
            // this.tableData.forEach(ele=>{
            //   ele.projectType=this.projectTypeList[ele.projectType]
            // })
            // 把projectType这个字段数字换成汉字
            this.tableData = this.tableData.map(ele => {
              if (ele.projectType === 1) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'PDT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              if (ele.projectType === 2) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'TDT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              if (ele.projectType === 3) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'LTC',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              if (ele.projectType === 4) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'LMT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              if (ele.projectType === null) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: '',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              // console.log(ele)
              // console.log(ele.projectType)
              // if(ele.projectType==null)
              // {
              //   ele.type=' '
              // }
              // else{
              //   ele.type=this.projectTypeList[ele.projectType]
              // }
              // ele.projectType=this.projectTypeList[ele.projectType]
            })
            this.total = res.data.total
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        })
    },

    // 创建项目
    createProject() {
      this.$router.push({
        path: '/createProject',
        query: {
          activeName: 'join',
          action: ''
        }
      })
    },

    // 点击跳转到版本列表
    jumpToVersionList(rowData) {
      console.log(rowData)
      this.$router.push({
        path: '/versionManage',
        query: {
          projectId: rowData.projectId,
          action: 'join',
          projectName: rowData.projectName
        }
      })
    },
    // 执行查询
    searchProject() {
      let queryData = {
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.startNum,
        range: this.range,
        projectName: this.serchForm.projectName.replace(/\s*/g, ''),
        projectManager: this.serchForm.projectManager.replace(/\s*/g, ''),
        creator: this.serchForm.creator.replace(/\s*/g, ''),
        startTime: this.serchForm.trueSearchTime[0],
        endTime: this.serchForm.trueSearchTime[1]
      }
      // console.log(data)
      getProjectByParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.projectList
            // 把projectType这个字段数字换成汉字
            this.tableData = this.tableData.map(ele => {
              if (ele.projectType === 1) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'PDT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers
                }
              }
              if (ele.projectType === 2) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'TDT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers
                }
              }
              if (ele.projectType === 3) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'LTC',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers
                }
              }
              if (ele.projectType === 4) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: 'LMT',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers
                }
              }
              if (ele.projectType === null) {
                return {
                  createTime: ele.createTime,
                  creator: ele.creator,
                  department: ele.department,
                  endTime: ele.endTime,
                  humanGap: ele.humanGap,
                  projectBelong: ele.projectBelong,
                  projectDesc: ele.projectDesc,
                  projectId: ele.projectId,
                  projectManager: ele.projectManager,
                  projectName: ele.projectName,
                  projectNumber: ele.projectNumber,
                  projectType: '',
                  stageInfo: ele.stageInfo,
                  startTime: ele.startTime,
                  statistical: ele.statistical,
                  caseNumbers: ele.caseNumbers
                }
              }
            })
            // console.log(res.data.total)
            this.total = res.data.total
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        })
    },

    // 点击第几页
    startNumChange(val) {
      this.startNum = val
      this.searchProject()
    },
    // 选择每页展示多少条数据
    rangeChange(val) {
      this.range = val
      this.searchProject()
    },

    getTime(formatTimeArray) {
      // console.log(formatTimeArray)
      // console.log(new Date(Object.values(formatTimeArray)[1]).getMonth() - new Date(Object.values(formatTimeArray)[0]).getMonth())
      // console.log(new Date(Object.values(formatTimeArray)[1]).getFullYear())
      if (formatTimeArray === null) {
        this.serchForm.searchTime = ['', '']
        this.serchForm.trueSearchTime = ['', '']
      } else {
        // 如果年份相同
        if (new Date(Object.values(formatTimeArray)[1]).getFullYear() === new Date(Object.values(formatTimeArray)[0]).getFullYear()) {
          if (new Date(Object.values(formatTimeArray)[1]).getMonth() - new Date(Object.values(formatTimeArray)[0]).getMonth() > 3) {
            this.$message({
              type: 'error',
              message: '日期范围三个月内',
              duration: 2000
            })
            this.serchForm.searchTime = ['', '']
          } else {
            this.serchForm.trueSearchTime = []
            for (var k in formatTimeArray) {
              this.serchForm.trueSearchTime.push(formatTimeArray[k])
            }
          }
        } else {
          if (new Date(Object.values(formatTimeArray)[1]).getFullYear() - new Date(Object.values(formatTimeArray)[0]).getFullYear() >= 2) {
            this.$message({
              type: 'error',
              message: '日期范围三个月内',
              duration: 2000
            })
            this.serchForm.searchTime = ['', '']
          } else {
            if (new Date(Object.values(formatTimeArray)[1]).getMonth() - new Date(Object.values(formatTimeArray)[0]).getMonth() + 12 > 3) {
              this.$message({
                type: 'error',
                message: '日期范围三个月内',
                duration: 2000
              })
              this.serchForm.searchTime = ['', '']
            } else {
              this.serchForm.trueSearchTime = []
              for (var l in formatTimeArray) {
                this.serchForm.trueSearchTime.push(formatTimeArray[l])
              }
            }
          }
        }
      }
    },
    jumpToUseCaseLibraryTwo() { },
    errorAjax() {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    }
  },
  mounted() {
    this.initTableData()
    this.serchForm.projectName = ''
    this.serchForm.projectManager = ''
    this.serchForm.creator = ''
    this.serchForm.searchTime = null
  }
}
</script>

<style>
.projectJoinApp {
  width: 100%;
}
.projectJoinApp > .search {
  width: 100%;
}
.projectJoinApp > .search > .el-input {
  width: 150px;
  margin-right: 20px;
}
.projectJoinApp > .search > .block {
  display: inline-block;
  margin-right: 64px;
}
.projectJoinApp > .el-table {
  margin-top: 10px;
}
.projectJoinApp > .el-pagination {
  margin-top: 10px;
}
.projectJoinApp .table-expand {
  font-size: 0;
}
.projectJoinApp .table-expand label {
  width: 90px;
  color: #99a9bf;
}
.projectJoinApp .table-expand .el-form-item {
  margin-right: 0px;
  margin-bottom: 0px;
  width: 50%;
}
.projectJoinApp
  > .el-table
  > .el-table__body-wrapper
  > .el-table__body
  > tbody
  > tr
  > .el-table__expanded-cell
  > .el-form--inline
  > .el-form-item {
  margin-right: 0px;
}
.projectJoinApp > .el-table .el-form-item__content {
  width: 280px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-dropdown{
  font-size: 24px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown-menu{
  width: 120px;
}
.el-table td{
  padding:15px 0;
}
</style>
