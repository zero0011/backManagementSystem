<template>
  <div class="projectAllApp">
    <!-- 搜索数据 -->
    <div class="search">
      <el-input v-model="serchForm.projectName" placeholder="项目名称"></el-input>
      <el-input v-model="serchForm.projectManager" placeholder="项目经理域账号"></el-input>
      <el-input v-model="serchForm.creator" placeholder="创建人域账号"></el-input>
      <el-input v-model="serchForm.department" placeholder="所属部门"></el-input>
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
      <el-button type="primary" @click="searchProject">查询</el-button>
      <!-- <el-button type="primary" @click="seeData">统计</el-button> -->
    </div>
    <!-- 我创建的项目列表 -->
    <el-table :data="tableData" border class="table" :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column type="expand" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="项目描述">
              <span :title="scope.row.projectDesc">{{ scope.row.projectDesc }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ scope.row.creator }}</span>
            </el-form-item>
            <el-form-item label="所属部门">
              <span>{{ scope.row.department }}</span>
            </el-form-item>
            <el-form-item label="人力缺口">
              <span>{{ scope.row.humanGap }}</span>
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

      <el-table-column
        fixed
        prop="projectName"
        label="项目名称"
        align="center"
        show-overflow-tooltip
      >
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
        width="120px"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectMember"
        label="项目人员"
        align="center"
        width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span @click="seeMembers(scope.row)" style="cursor: pointer">查看</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="caseNumbers" label="用例数" width="90px"  align="center" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="department" label="所属部门" width="80" align="center" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="stageInfo" label="项目阶段"  align="center" width="90px"></el-table-column> -->
      <el-table-column
        prop="projectType"
        label="项目类型"
        align="center"
        width="80px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectBelong"
        label="立项部门"
        align="center"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="testerLeader"
        label="测试代表"
        align="center"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="160px"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="jumpToUseCaseLibraryTwo(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="transferCreator(scope.row)">转移</el-dropdown-item>
               <el-dropdown-item @click.native="jumpToManPowerManager(scope.row)">人力管理</el-dropdown-item>
               <el-dropdown-item @click.native="jumpToProjectReport(scope.row)">报告</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToCase(scope.row)">用例集</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToMission(scope.row)">任务</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.statistical == 0"
                @click.native="jumpToNeedStatistic(scope.row,true)"
              >参与统计</el-dropdown-item>
              <el-dropdown-item v-else @click.native="jumpToNeedStatistic(scope.row,false)">不参与统计</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="jumpToUseCaseLibraryTwo(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="transferCreator(scope.row)" type="text" size="small">转移</el-button>
          <el-button @click="jumpToManPowerManager(scope.row)" type="text" size="small">人力管理</el-button>
          <el-button @click="jumpToProjectReport(scope.row)" type="text" size="small">报告</el-button>
          <el-button @click="jumpToCase(scope.row)" type="text" size="small">用例集</el-button>
          <el-button @click="jumpToMission(scope.row)" type="text" size="small">任务</el-button>
          <el-button
            v-if="scope.row.statistical == 0"
            @click="jumpToNeedStatistic(scope.row,true)"
            type="text"
            size="small"
          >参与统计</el-button>
          <el-button
            v-else
            @click="jumpToNeedStatistic(scope.row,false)"
            type="text"
            size="small"
          >不参与统计</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 20]"
      :page-size="dialogRange"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="rangeChange"
      @current-change="startNumChange"
    ></el-pagination>
    <!-- 查看成员弹层 -->
    <el-dialog title="项目成员" :visible.sync="dialogTableVisible" :before-close="beforeclose">
      <el-table :data="dialogTableData">
        <el-table-column property="realName" label="成员姓名"></el-table-column>
        <el-table-column property="accountName" label="成员域账号"></el-table-column>
        <el-table-column property="department" label="部门"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page.sync="dialogStartNum"
        :page-sizes="[5, 10, 20]"
        :page-size="dialogRange"
        :total="dialogTotal"
        layout="total, sizes, prev, pager, next"
        @size-change="rangeChangeDialog"
        @current-change="startNumChangeDialog"
      ></el-pagination>
    </el-dialog>

    <!-- 选择用户（单选） -->
    <el-dialog title="选择用户" :visible.sync="showSelectSingleUser">
      <div class="content" style="height: 500px;overflow-y: auto">
        <div
          class="department"
          style="width: 100%;margin-bottom: 30px"
          v-for="(val, key) in data2"
          :key="key"
        >
          <div class="dep" style="font-size: 16px">{{ val.label }}</div>
          <div class="singleSel" style="width: 100%;display: flex;flex-wrap: wrap;margin-top: 10px">
            <div
              class="signle"
              style="display: inline-block;width: 25%;margin-bottom: 8px"
              v-for="(name, key2) in val.children"
              :key="key2"
            >
              <template v-if="name.label === trueName">
                <input
                  type="radio"
                  name="name"
                  class="singleSelect"
                  :accountName="name.label + '(' + name.accountName + ')'"
                  checked
                />
                &nbsp;{{ name.label + '(' + name.accountName + ')' }}
              </template>
              <template v-else>
                <input
                  type="radio"
                  name="name"
                  class="singleSelect"
                  :accountName="name.label + '(' + name.accountName + ')'"
                />
                &nbsp;{{ name.label + '(' + name.accountName + ')' }}
              </template>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;position: relative;height: 40px">
        <el-button
          type="primary"
          @click="getCheckedAccountName"
          style="position: absolute;right: 20px"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllProject, getPorjectParticipant, needStatistic, getUserListPower, transferCreator, deleteProject } from '../../api/api'
export default {
  data() {
    return {
      serchForm: {
        projectName: '',
        projectManager: '',
        searchTime: null,
        creator: '',
        department: '',
        trueSearchTime: ['', '']
      },
      startNum: 1,
      range: 10,
      total: null,
      tableData: [],
      dialogTableData: [],
      dialogTableVisible: false,
      dialogStartNum: 1,
      dialogRange: 10,
      dialogTotal: null,
      projectId: null,
      data2: [],
      showSelectSingleUser: false,
      transProjectId: ''
    }
  },
  methods: {
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
    // 操作栏的报告
    jumpToProjectReport(rowData) {
      this.$router.push({
        path: '/projectReport',
        query: {
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
    // 点击删除项目按钮
    jumpToUseCaseLibraryTwo(rowData) {
      // console.log(rowData.projectName)
      // console.log(this.tableData)
      this.tableData.forEach(ele => {
        if (ele.projectName == rowData.projectName) {
          this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // console.log(ele.projectId)
            let data = {
              projectId: ele.projectId
            }
            deleteProject(data)
              .then(res => {
                if (res.state === 1000) {
                  this.$message('项目删除成功')
                  this.initTableData()
                } else {
                  this.$message.error(res.message)
                }
              }, rej => {
                this.errorAjax()
              }
              )
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除该项目'
            })
          })
        }
      })
    },

    // 点击确认按钮
    getCheckedAccountName() {
      let arr = document.getElementsByClassName('singleSelect')
      // console.log(arr)
      let newArr = Array.from(arr)
      // console.log(newArr)
      let str = ''
      newArr.forEach(ele => {
        if (ele.checked) {
          str = ele.attributes[2].nodeValue.split('(')[1].split(')')[0]
        }
      })
      transferCreator({
        projectId: this.transProjectId,
        accountName: str
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectSingleUser = false
          setTimeout(() => {
            this.initTableData()
          }, 100)
        }
      })
    },

    // 点击转移按钮
    transferCreator(rowData) {
      this.transProjectId = rowData.projectId
      if (window.sessionStorage.getItem('userName')) {
        this.trueName = window.sessionStorage.getItem('userName')
      } else {
        this.trueName = window.localStorage.getItem('userName')
      }
      getUserListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          console.log(res)
          this.data2 = res.data.userList
        }
      })
      this.showSelectSingleUser = true
    },

    // 关闭显示项目成员弹窗关闭之前触发的函数
    beforeclose() {
      this.dialogStartNum = 1
      this.dialogRange = 10
      this.dialogTableVisible = false
    },
    seeData() {
      this.$router.push('/projectStatistics')
    },
    // 点击跳转到人力管理界面
    jumpToManPowerManager(rowData) {
      this.$router.push({
        path: '/projectManPowerManagement',
        query: {
          projectId: rowData.projectId,
          projectName: rowData.projectName
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
        department: '',
        startTime: '',
        endTime: '',
        projectTypeList: ['', 'PDT', 'TDT', 'LTC', 'LMT']
      }
      getAllProject(queryData)
        .then(res => {
          if (res.state === 1000) {
            // this.tableData = res.data.projectList
            // console.log(res)
            // console.log(typeof res.data.projectList[0].projectType)
            // 把projectType这个字段数字换成汉字
            let list = ['', 'PDT', 'TDT', 'LTC', 'LMT']
            this.tableData = res.data.projectList.map(ele => {
              if (ele.projectType !== null) {
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
                  projectType: list[ele.projectType],
                  // projectType: ele.projectType,
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
            })

            this.total = res.data.total

            // 去除项目编号为0的默认项目
            this.tableData.forEach((ele, index) => {
              if (ele.projectId == 0) {
                this.tableData.splice(index, 1)
              }
            })
            // console.log(res.data)
            this.total = res.data.total
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        })
    },

    // 点击跳转到版本列表
    jumpToVersionList(rowData) {
      console.log(rowData)
      this.$router.push({
        path: '/versionManage',
        query: {
          projectId: rowData.projectId,
          from: 'all'
        }
      })
    },

    // 点击查询项目成员
    seeMembers(rowData) {
      this.dialogTableVisible = true
      this.projectId = rowData.projectId
      let queryData = {
        projectId: rowData.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.dialogStartNum,
        range: this.dialogRange
      }
      getPorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.dialogTableData = res.data.projectMembers
            this.dialogTotal = res.data.total
            console.log(this.tableData)
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        }
        )
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
        department: this.serchForm.department.replace(/\s*/g, ''),
        startTime: this.serchForm.trueSearchTime[0],
        endTime: this.serchForm.trueSearchTime[1]

      }

      // console.log(data)
      getAllProject(queryData)
        .then(res => {
          if (res.state === 1000) {
            // 把projectType这个字段数字换成汉字
            let list = ['', 'PDT', 'TDT', 'LTC', 'LMT']
            this.tableData = res.data.projectList.map(ele => {
              if (ele.projectType !== null) {
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
                  projectType: list[ele.projectType],
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
            this.total = res.data.total
            console.log(this.total)
            // 去除项目编号为0的默认项目(不可删除)
            this.tableData.forEach((ele, index) => {
              if (ele.projectId == 0) {
                this.tableData.splice(index, 1)
              }
            })
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
    // 点击成员弹层显示多少条range
    rangeChangeDialog(val) {
      this.dialogRange = val
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: 1,
        range: val
      }
      getPorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.dialogTableData = res.data.projectMembers
            this.dialogTotal = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    // 点击选择到底是哪页   startNum
    startNumChangeDialog(val) {
      this.dialogStartNum = val
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: val,
        range: this.dialogRange
      }
      getPorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.dialogTableData = res.data.projectMembers
            this.dialogTotal = res.data.total
            console.log(this.tableData)
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        }
        )
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
    jumpToNeedStatistic(row, needS) {
      let queryData = {
        projectId: row.projectId,
        needStatistic: needS
      }

      needStatistic(queryData)
        .then(res => {
          if (res.state === 1000) {
            if (needS) {
              row.statistical = 1
              this.$message.success('项目将纳入报表统计')
            } else {
              row.statistical = 0
              this.$message.success('项目将不再纳入报表统计')
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    errorAjax() {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initTableData()
    })
    // this.$next(() => {
    //   this.initTableData()
    // })
  }
}
</script>

<style>
.projectAllApp {
  width: 100%;
}
.projectAllApp > .search {
  width: 100%;
}
.projectAllApp > .search > .el-input {
  width: 130px;
  margin-right: 20px;
}
.projectAllApp > .search > .block {
  display: inline-block;
  margin-right: 64px;
  width: 300px;
}
/* .projectAllApp > .search > .el-button {
  margin-right: 10px
}
.projectAllApp > .search > .el-button:nth-of-type(3) {
  margin-right: 0px
} */
.projectAllApp > .el-table {
  margin-top: 10px;
}
.projectAllApp > .el-pagination {
  margin-top: 10px;
}

.projectAllApp .table-expand {
  font-size: 0;
}
.projectAllApp .table-expand label {
  width: 90px;
  color: #99a9bf;
}
.projectAllApp .table-expand .el-form-item {
  margin-right: 0px;
  margin-bottom: 0px;
  width: 50%;
}
.projectAllApp
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
.projectAllApp > .el-table .el-form-item__content {
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
