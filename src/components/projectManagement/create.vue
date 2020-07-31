<template>
  <div class="projectCreateApp">
    <!-- 搜索数据 -->
    <div class="search">
      <el-input v-model="serchForm.projectName" placeholder="项目名称"></el-input>
      <el-input v-model="serchForm.projectManager" placeholder="项目经理域账号"></el-input>
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
      <el-button type="primary" @click="createProject">创建项目</el-button>
    </div>
    <!-- 我创建的项目列表 -->
    <el-table :data="tableData" type="expand" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column type="expand" show-overflow-tooltip>
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
        align="center"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="projectManager"
        label="项目经理"
        align="center"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectMember"
        label="项目成员"
        align="center"
        width="100px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span @click="seeMembers(scope.row)" style="cursor: pointer">查看</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="caseNumbers" label="用例数"  align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stageInfo" label="项目阶段" align="center"></el-table-column>-->
      <el-table-column
        prop="projectType"
        label="项目类型"
        width="100px"
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
              <el-dropdown-item @click.native="transferCreator(scope.row)">转移</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToEditProjectForm(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToUseCaseLibraryTwo(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToManPowerManager(scope.row)">人力管理</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToProjectReport(scope.row)">报告</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToCase(scope.row)">用例集</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToMission(scope.row)">任务</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToProduct(scope.row)">产品</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToVersionList(scope.row)">版本</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.statistical == 0" @click.native="jumpToNeedStatistic(scope.row,true)">参与统计</el-dropdown-item>
              <el-dropdown-item v-else @click.native="jumpToNeedStatistic(scope.row,false)">不参与统计</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="jumpToCreateVersionForm(scope.row)" type="text" size="small">创建版本</el-button> -->
          <!-- <el-button @click="transferCreator(scope.row)" type="text" size="small">转移</el-button>
          <el-button @click="jumpToEditProjectForm(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="jumpToUseCaseLibraryTwo(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="jumpToManPowerManager(scope.row)" type="text" size="small">人力管理</el-button>
          <el-button @click="jumpToProjectReport(scope.row)" type="text" size="small">报告</el-button>
          <el-button @click="jumpToCase(scope.row)" type="text" size="small">用例集</el-button>
          <el-button @click="jumpToMission(scope.row)" type="text" size="small">任务</el-button>
          <el-button @click="jumpToProduct(scope.row)" type="text" size="small">产品</el-button>
          <el-button @click="jumpToVersionList(scope.row)" type="text" size="small">版本</el-button>
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
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="rangeChange"
      @current-change="startNumChange"
    ></el-pagination>
    <!-- 查看成员弹层 -->
    <el-dialog title="项目成员" :visible.sync="dialogTableVisible" :before-close="beforeclose">
      <el-table :data="dialogTableData">
        <el-table-column property="realName" label="成员姓名" width="150"></el-table-column>
        <el-table-column property="accountName" label="成员域账号" width="200"></el-table-column>
        <el-table-column property="department" label="部门" width="200"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page.sync="dialogStartNum "
        :page-sizes="[5, 10, 20]"
        :page-size="dialogRange"
        :total="dialogTotal"
        layout="total, sizes, prev, pager, next"
        @size-change="rangeChangeDialog"
        @current-change="startNumChangeDialog"
      ></el-pagination>
    </el-dialog>
    <!-- <SelectSingleUser :showSelectSingleUser="showSelectSingleUser"></SelectSingleUser> -->
    <!-- 选择用户（单选） -->
    <el-dialog
      title="选择用户"
      :visible.sync="showSelectSingleUser"
      :before-close="beforecloseSingleUser"
    >
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
import { getProjectByCreator, getPorjectParticipant, needStatistic, transferCreator, getUserListPower, deleteProject } from '../../api/api'
import SelectSingleUser from '../../components/select-single-user'
export default {
  components: {
    SelectSingleUser
  },
  data() {
    return {
      serchForm: {
        projectName: '',
        projectManager: '',
        searchTime: null,
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
      showSelectSingleUser: false,
      radio: 3,
      data2: [],
      trueName: '',
      transProjectId: ''
    }
  },
  methods: {
    // 跳转到产品列表
    jumpToProduct(rowData) {
      console.log(rowData)
      this.$router.push({
        path: '/productList',
        query: {
          projectName: rowData.projectName,
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
    // 点击删除项目按钮
    jumpToUseCaseLibraryTwo(rowData) {
      this.tableData.forEach(ele => {
        if (ele.projectName == rowData.projectName) {
          this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
    // 转移按钮弹层关闭前
    beforecloseSingleUser() {
      this.showSelectSingleUser = false
      setTimeout(() => {
        this.data2.splice(0, this.data2.length - 1)
      }, 300)
    },
    getCheckedAccountName() {
      let arr = document.getElementsByClassName('singleSelect')
      let newArr = Array.from(arr)
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
          }, 300)
        }
      })
    },
    transferCreator(rowData) {
      console.log(rowData)
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
          this.data2 = res.data.userList
        }
      })
      this.showSelectSingleUser = true
    },
    // 关闭查看项目成员触发的函数
    beforeclose() {
      this.dialogStartNum = 1
      this.dialogRange = 10
      this.dialogTableVisible = false
    },
    // 刷新页面表格数据
    initTableData() {
      let queryData = {
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.startNum,
        range: this.range,
        projectName: '',
        projectManager: '',
        startTime: '',
        endTime: ''
      }

      getProjectByCreator(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.projectList
            // 把projectType这个字段数字换成汉字
            // this.tableData.forEach(ele=>{
            //   ele.projectType=this.projectTypeList[ele.projectType]
            // })
            // 把projectType这个字段数字换成汉字
            let list = ['', 'PDT', 'TDT', 'LTC', 'LMT']
            this.tableData = this.tableData.map(ele => {
              if (ele.projectType !== null) {
                return {
                  belongBu: ele.belongBu,
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
                  caseNumbers: ele.caseNumbers,
                  testerLeader: ele.testerLeader
                }
              }
              if (ele.projectType === null) {
                return {
                  belongBu: ele.belongBu,
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
    // 创建项目
    createProject() {
      this.$router.push({
        path: '/createProject',
        query: {
          activeName: 'create',
          action: ''
        }
      })
    },

    // 点击跳转到版本列表
    jumpToVersionList(rowData) {
      this.$router.push({
        path: '/versionManage',
        query: {
          projectId: rowData.projectId,
          from: 'create',
          projectName: rowData.projectName
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
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },

    // 点击跳转到创建版本表单
    jumpToCreateVersionForm(rowData) {
      this.$router.push({
        path: '/createVersion',
        query: {
          projectId: rowData.projectId,
          from: 'create',
          action: '0',
          projectName: rowData.projectName
        }
      })
    },

    // 点击跳转到编辑界面
    jumpToEditProjectForm(rowData) {
      console.log(rowData)
      this.$router.push({
        path: '/createProject',
        query: {
          activeName: 'create',
          action: 'edit',
          projectId: rowData.projectId,
          projectForm: JSON.stringify({
            belongBu: rowData.belongBu,
            projectId: rowData.projectId,
            projectNumber: rowData.projectNumber,
            projectName: rowData.projectName,
            projectDesc: rowData.projectDesc,
            projectType: rowData.projectType,
            projectBelong: rowData.projectBelong,
            startTime: rowData.startTime,
            endTime: rowData.endTime,
            projectManager: rowData.projectManager,
            creator: rowData.creator,
            statistical: rowData.statistical,
            testerLeader: rowData.testerLeader
          })
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
        startTime: this.serchForm.trueSearchTime[0],
        endTime: this.serchForm.trueSearchTime[1]

      }
      getProjectByCreator(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.projectList

            // 把projectType这个字段数字换成汉字
            // this.tableData.forEach(ele=>{
            //   ele.projectType=this.projectTypeList[ele.projectType]
            // })
            // 把projectType这个字段数字换成汉字
            let list = ['', 'PDT', 'TDT', 'LTC', 'LMT']
            this.tableData = this.tableData.map(ele => {
              if (ele.projectType !== null) {
                return {
                  belongBu: ele.belongBu,
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
                  belongBu: ele.belongBu,
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
    // 点击成员弹层每页展示多少数据
    rangeChangeDialog(val) {
      this.dialogRange = val
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.dialogStartNum,
        range: this.dialogRange
      }
      getPorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.dialogTableData = res.data.projectMembers
            this.dialogTotal = res.data.total
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    // 点击成员弹层第几页
    startNumChangeDialog(val) {
      this.dialogStartNum = val
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.dialogStartNum,
        range: this.dialogRange
      }
      getPorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.dialogTableData = res.data.projectMembers
            this.dialogTotal = res.data.total
          } else {
            this.$message.error('加载数据失败！')
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    getTime(formatTimeArray) {
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
    // 点击跳转到人力管理界面
    jumpToManPowerManager(rowData) {
      this.$router.push({
        path: '/projectManPowerManagement',
        query: {
          projectId: rowData.projectId,
          projectName: rowData.projectName
        }
      })
    }
  },
  mounted() {
    this.initTableData()
    this.serchForm.projectName = ''
    this.serchForm.projectManager = ''
    this.serchForm.searchTime = null
  }
}
</script>

<style>
input[type='radio'] {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #999;
  outline: 0px solid transparent;
  /* background-color: rgb(32, 17, 235); */
}
input[type='radio']:hover {
  cursor: pointer;
}
input[type='radio']:checked {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #409eff;
}
/* input[type="radio"]:checked + label::before {
  background-color: rgb(32, 17, 235);
  background-clip: content-box;
  padding: 3px
} */
.projectCreateApp {
  width: 100%;
}
.projectCreateApp > .search {
  width: 100%;
}
.projectCreateApp > .search > .el-input {
  width: 230px;
  margin-right: 20px;
}
.projectCreateApp > .search > .block {
  display: inline-block;
  margin-right: 64px;
}
.projectCreateApp > .search > .el-button {
  margin-right: 10px;
}
.projectCreateApp > .search > .el-button:nth-of-type(3) {
  margin-right: 0px;
}
.projectCreateApp > .el-table {
  margin-top: 10px;
}
.projectCreateApp > .el-pagination {
  margin-top: 10px;
}

.projectCreateApp .table-expand {
  font-size: 0;
}
.projectCreateApp .table-expand label {
  width: 90px;
  color: #99a9bf;
}
.projectCreateApp .table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.projectCreateApp
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
.projectCreateApp > .el-table .el-form-item__content {
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
  padding: 15px 0;
}
</style>
