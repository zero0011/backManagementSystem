<template>
  <div class="regularMemberManageApp">
    <main>
      <div class="top">
        <el-input v-model="realName" placeholder="请输入姓名"></el-input>
        <el-input v-model="account" placeholder="请输入用户名"></el-input>
        <!-- <el-input v-model="input" placeholder="请输入状态"></el-input> -->
        <el-select v-model="jobStatus.value">
          <el-option
            v-for="item in jobStatus.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="queryMember">查询</el-button>
        <el-button type="primary" @click="getExcel" style="margin-left:20px;position:relative">导出</el-button>
        <el-button
          type="primary"
          class="humanPipelineData"
          @click="queryHumanPipe"
          style="margin-left:200px"
        >人员管道数据汇总</el-button>
      </div>

      <div class="container" v-loading="loading" element-loading-text="正在生成中">
        <el-card class="box-card" v-if="!showtable">
          <p style=" text-align:center">暂无数据</p>
        </el-card>
        <el-card class="box-card" v-for="(org,key) in orgs" :key="key" v-loading="loading">
          <div slot="header" class="clearfix">
            <span>{{org.name}}</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <el-table :data="org.details" tooltip-effect="dark" style="width: 100%" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
              <el-table-column
                prop="realName"
                label="姓名"
                show-overflow-tooltip
                align="center"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="accountName"
                label="用户名"
                show-overflow-tooltip
                align="center"
                width="105"
              ></el-table-column>
              <el-table-column
                prop="department"
                label="部门"
                show-overflow-tooltip
                align="center"
                width="140"
              ></el-table-column>
              <el-table-column
                prop="mail"
                label="邮箱"
                show-overflow-tooltip
                align="center"
                width="110"
              ></el-table-column>
              <!-- <el-table-column prop="phone" label="手机" show-overflow-tooltip align="center" width="100"></el-table-column> -->
              <el-table-column
                prop="area"
                label="地区"
                show-overflow-tooltip
                align="center"
                width="130"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.area"
                    placeholder
                    @change="areaChange(scope.row.accountName,$event)"
                    v-if="showOption(scope.row.realName)"
                  >
                    <el-option
                      v-for="item in areaoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 1 :正式   2:合作方   3:实习 -->
              <el-table-column label="人员类型" show-overflow-tooltip align="center" width="120">
                <template slot-scope="scope">
                  <!-- <p v-if="scope.row.userType==1">正式</p>
                        <p v-if="scope.row.userType==2">合作方</p>
                  <p v-if="scope.row.userType==3">实习</p>-->
                  <el-select
                    v-model="userTypeTable[scope.row.userType]"
                    placeholder
                    @change="typeChange(scope.row.accountName,$event)"
                    v-if="showOption(scope.row.realName)"
                  >
                    <el-option
                      v-for="item in typeoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="entryTime" label="入职时间" align="center" width="120">
                <!-- <template slot-scope="scope" >
                        <el-date-picker v-if="showbutton(scope.row)" v-model="scope.row.entryTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="submitEntryTime($event,scope.row.accountName)" style="width:135px"></el-date-picker>
                </template>-->
              </el-table-column>
              <el-table-column prop="dimissionTime" label="离职时间" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-if="showbutton(scope.row)"
                    v-model="scope.row.dimissionTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    @change="submitDimissionTime($event,scope.row)"
                    style="width:135px"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="在岗状态"
                show-overflow-tooltip
                align="center"
                width="100"
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              :current-page.sync="org.startNum"
              :page-sizes="[1,5, 10, 20]"
              :page-size="org.range"
              :total="org.total"
              layout="total, sizes, prev, pager, next"
              @size-change="rangeChange($event,org.name,key)"
              @current-change="startNumChange($event, org.name,key)"
            ></el-pagination>

            <el-dialog title="下载报告" :visible.sync="dialogDownLoad" class="dialogDownLoad">
              <div style="text-align: center">
                <el-button type="primary">
                  <a
                    :href="downLoadPath"
                    download="模板.xlsx"
                    style="text-decoration: none;color: #fff"
                  >下载</a>
                </el-button>
              </div>
            </el-dialog>
          </div>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script>
import { getRegularEmployeeByDepartment, getRegularEmployeeByProject, getRegularEmployeeByArea, submitEmployJobTime, getAllStaffManagementLoad, updateStaffArea, updateStaffType, exportEmployeeResourceManage } from '../../api/api'
export default {
  props: ['toDepartmentName', 'toDepartmentLevel'],
  data() {
    return {
      loading: false,
      dialogDownLoad: false,
      downLoadPath: '',
      userTypeTable: {
        1: '正式',
        2: '合作方',
        3: '实习'
      },
      showtable: true,
      //
      staffType: 1,
      realName: '',
      account: '',
      departmentName: '',
      memeberTable: [],
      expectMemberTable: [
        {
          regular: '',
          partner: '',
          intern: ''
        }
      ],
      multipleSelection: [],
      regularInput: '',
      partnerInput: '',
      internInput: '',

      //
      query: false,
      queryResult: [],
      orgs: [],

      // 分页
      page: {},
      pages: [

      ],
      startNum: 1,
      range: 5,
      total: null,

      // 选择器
      jobStatus: {
        options: [{
          value: '1',
          label: '在职(含待离职)'
        }, {
          value: '2',
          label: '离职'
        }, {
          value: '4',
          label: '待离职'
        }],
        value: '1'
      },
      orgType: '',
      loading: false,
      DepartmentName: '',
      DepartmentLevel: '',
      areaoptions: [{
        value: '北京',
        label: '北京'
      }, {
        value: '南京',
        label: '南京'
      }, {
        value: '上海',
        label: '上海'
      }, {
        value: '深圳',
        label: '深圳'
      }],

      typeoptions: [
        {
          value: 1,
          label: '正式员工'
        }, {
          value: 2,
          label: '合作方员工'
        }, {
          value: 3,
          label: '实习员工'
        }
      ]
    }
  },
  methods: {

    // 点击导出按钮
    getExcel() {
      this.loading = true
      exportEmployeeResourceManage({
        jobStatus: this.jobStatus.value
      }).then(res => {
        if (res.state === 1000) {
          this.loading = false
          this.downLoadPath = 'http://' + res.data.ipAddress + ':' + res.data.port + res.data.pathName
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
    // 去除总计栏里的按钮
    showOption(name) {
      if (name == '总计') {
        return false
      } else {
        return true
      }
    },
    // 类型的改变
    typeChange(accountName, val) {
      let Data = {
        accountName: accountName,
        staffType: val
      }
      updateStaffType(Data)
        .then(res => {
          if (res.state === 1000) {
            this.$message('修改成功')
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    // 人员的地区改变
    areaChange(accountName, val) {
      let Data = {
        accountName: accountName,
        address: val
      }
      updateStaffArea(Data)
        .then(res => {
          if (res.state === 1000) {
            this.$message('修改成功')
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
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
    },
    // 页面跳转
    queryHumanPipe() {
      this.$router.push({
        path: '/humanPipelineData'
      })
    },

    // 在进行总计处理的时候忽略显示项目等按钮
    showbutton(data) {
      let item = data.realName
      if (item === '总计') {
        return false
      } else {
        return true
      }
    },

    // 点击查询按钮
    queryMember() {
      let Data = {
        staffType: this.staffType,
        personRealName: this.realName,
        personAccountName: this.account,
        departmentName: this.DepartmentName,
        departmentLevel: this.DepartmentLevel,
        status: this.jobStatus.value,
        startNum: this.startNum,
        range: this.range
      }
      this.getStaffManagementLoad(Data)
    },

    // 点击第几页
    startNumChange(val, departmentName, index) {
      // this.startNum = val
      this.orgs[index].startNum = val
      let Data = {}
      if (index == 0) {
        Data = {
          staffType: this.staffType,
          personRealName: this.realName,
          personAccountName: this.account,
          departmentName: departmentName,
          departmentLevel: 1,
          status: this.jobStatus.value,
          startNum: val,
          range: this.orgs[index].range
        }
      } else {
        Data = {
          staffType: this.staffType,
          personRealName: this.realName,
          personAccountName: this.account,
          departmentName: departmentName,
          departmentLevel: 2,
          status: this.jobStatus.value,
          startNum: val,
          range: this.orgs[index].range
        }
      }
      console.log(Data)

      this.getPage(Data)
    },

    // 选择每页展示多少条数据
    rangeChange(val, departmentName, index) {
      this.orgs[index].startNum = 1
      this.orgs[index].range = val
      let Data = {}
      if (index == 0) {
        Data = {
          staffType: this.staffType,
          personRealName: this.realName,
          personAccountName: this.account,
          departmentName: departmentName,
          departmentLevel: 1,
          status: this.jobStatus.value,
          startNum: this.orgs[index].startNum,
          range: this.orgs[index].range
        }
      } else {
        Data = {
          staffType: this.staffType,
          personRealName: this.realName,
          personAccountName: this.account,
          departmentName: departmentName,
          departmentLevel: 2,
          status: this.jobStatus.value,
          startNum: this.orgs[index].startNum,
          range: this.orgs[index].range
        }
      }
      this.getPage(Data)
    },

    // 全局查都用这个方法
    getStaffManagementLoad(data) {
      getAllStaffManagementLoad(data).then(res => {
        if (res.state === 1000) {
          if (res.data.department.length == 0) {
            this.showtable = false
          } else {
            this.showtable = true
          }
          // 如果不是分页查询
          this.orgs = res.data.department
          // 给每个元素添加分页属性
          this.orgs.forEach((ele, index, Array) => {
            ele.range = 5
            ele.startNum = 1
          })

          // 添加总计负载元素
          for (let index in this.orgs) {
            this.orgs[index].details.push({
              'realName': '总计',
              'accountName': '正式: ' + this.orgs[index].summary.regular + '(人)'
            })
          }
        } else {
          setTimeout(() => {
            this.$message.error(res.message)
          }, 100)
        }
      }, rej => {
        this.errorAjax()
      }
      )
    },
    // 分页查询
    getPage(data) {
      getAllStaffManagementLoad(data).then(res => {
        if (res.state === 1000) {
          this.orgs.forEach((ele, index) => {
            if (ele.name === data.departmentName) {
              let resultDataTemp = res.data.department[0]
              // 添加分页元素
              resultDataTemp.startNum = data.startNum
              resultDataTemp.range = data.range
              // 添加总计负载元素
              resultDataTemp.details.push({
                'realName': '总计',
                'accountName': '正式: ' + this.orgs[index].summary.regular + '(人)'
              })
              // 把orgs[index]里的元素替换成resultDataTemp
              this.orgs.splice(index, 1, resultDataTemp)
            }
          })
        } else {
          setTimeout(() => {
            this.$message.error(res.message)
          }, 100)
        }
      }, rej => {
        this.errorAjax()
      }
      )
    },

    // 提交入职时间到后台
    submitEntryTime(time, accountName) {
      let queryData = {
        accountName: accountName,
        entryTime: time,
        dimissionTime: '',
        entryOrDimission: 1
      }

      submitEmployJobTime(queryData)
        .then(res => {
          if (res.state === 1000) {
            this.$message.success('更新入职时间成功')
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },

    // 提交离职时间到后台
    submitDimissionTime(time, row) {
      let queryData = {
        accountName: row.accountName,
        entryTime: '',
        dimissionTime: time,
        entryOrDimission: 2,
        department: row.department,
        realName: row.realName,
        userType: row.userType
      }

      submitEmployJobTime(queryData)
        .then(res => {
          if (res.state === 1000) {
            let dateTime = new Date()
            let currentTime = dateTime.getTime()

            let dimissionTime = new Date(time).getTime()
            // 如果当前时间大于离职时间，修改用户在岗状态
            if (dimissionTime == null) {
              row.status = '在职'
            } else if (currentTime >= dimissionTime) {
              row.status = '离职'
            } else if (currentTime < dimissionTime) {
              row.status = '待离职'
            } else {
              row.status = '在职'
            }

            this.$message.success('更新离职时间成功')
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    }

  },

  created() {
    this.DepartmentName = window.sessionStorage.getItem('bindDepartment')
    this.DepartmentLevel = window.sessionStorage.getItem('bindDepartmentLevel')
    if (this.DepartmentName == null) {
      this.DepartmentName = '所有部门'
      this.DepartmentLevel = 1
    }
    //  window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    let Data = {
      staffType: this.staffType,
      personRealName: this.realName,
      personAccountName: this.account,
      departmentName: this.DepartmentName,
      departmentLevel: this.DepartmentLevel,
      status: this.jobStatus.value,
      startNum: this.startNum,
      range: this.range
    }
    this.getStaffManagementLoad(Data)
  },
  mounted() {

  },

  watch: {
    toDepartmentName(val) {
      this.DepartmentName = val
      this.DepartmentLevel = this.toDepartmentLevel
      let Data = {
        staffType: this.staffType,
        personRealName: this.realName,
        personAccountName: this.account,
        departmentName: this.DepartmentName,
        departmentLevel: this.DepartmentLevel,
        status: this.jobStatus.value,
        startNum: this.startNum,
        range: this.range
      }
      this.getStaffManagementLoad(Data)
    },
    toDepartmentLevel(val) {
      this.DepartmentLevel = val
    }
  }
}
</script>

<style>
.regularMemberManageApp {
  width: 100%;
}

.regularMemberManageApp > main > .top {
  margin-top: 20px;
  margin-bottom: 40px;
  position: relative;
}
.regularMemberManageApp > main > .top > .el-input {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
}
.regularMemberManageApp > main > .top > .el-select {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
  height: 40px;
}
.regularMemberManageApp
  > main
  > .top
  > .el-select
  > .el-input
  > .el-input__inner {
  height: 40px;
}

.regularMemberManageApp > main {
  width: 1188px;
  margin: 10px auto;
  min-height: 100px;
}

.regularMemberManageApp
  > main
  > .container
  > .el-card
  > .el-card__body
  > div
  > .el-pagination {
  padding-left: 0px;
  margin-top: 5px;
  /* padding: 0px 0px */
  /* background-color: yellow; */
}
.regularMemberManageApp
  > main
  > .container
  > .el-card
  > .el-card__body
  > div
  > .el-pagination
  .el-input {
  margin-left: 0px;
}

.regularMemberManageApp > main > .middle {
  margin-top: 80px;
  margin-bottom: 20px;
}
.regularMemberManageApp > main > .middle > div > ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 20px;
}
.regularMemberManageApp > main > .middle > div > ul > li {
  width: 1148px;
  background-color: #f2f6fc;
  font-size: 18px;
  padding: 3px 0px;
}
.regularMemberManageApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > thead
  > tr
  > th {
  padding: 8.5px 0px;
}
.regularMemberManageApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}
.regularMemberManageApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper
  > .el-table__body
  > tbody
  > tr
  > td {
  padding: 13px 0px;
}
.regularMemberManageApp > main > .container {
  width: 1148px;
  margin: 10px 0 20px 20px;
  min-height: 200px;
}
.regularMemberManageApp > main > .container > .el-card {
  margin-bottom: 20px;
}
.regularMemberManageApp > main > .container > .el-card > .el-card__header {
  padding: 5px 20px;
}
.regularMemberManageApp
  > main
  > .container
  > .el-card
  > .el-card__body
  > .el-table
  th {
  padding: 4px 0;
}
.regularMemberManageApp
  > main
  > .container
  > .el-card
  > .el-card__body
  > .el-table
  td {
  padding: 4px 0;
}
.regularMemberManageApp > main > .container > footer {
  text-align: center;
}
.regularMemberManageApp > .canCases > .el-dialog > .el-dialog__body > .el-tree {
  max-height: 500px;
  overflow-x: auto;
  overflow-y: auto;
}
.regularMemberManageApp > .canCases > .el-dialog > .el-dialog__body > footer {
  margin-top: 20px;
  height: 30px;
}
.regularMemberManageApp
  > .canCases
  > .el-dialog
  > .el-dialog__body
  > footer
  > .el-button {
  float: right;
}

.regularMemberManageApp > main .el-table tbody tr:last-of-type {
  background-color: #e4e7ed;
}

.regularMemberManageApp > main .el-table tbody tr:last-of-type:hover > td {
  background-color: #e4e7ed;
}
.regularMemberManageApp
  > main
  .el-table
  tbody
  tr:last-of-type:hover
  > td:nth-of-type(1) {
  font-weight: 600;
}
.regularMemberManageApp
  > main
  .el-table
  tbody
  tr:last-of-type
  > td:nth-of-type(1) {
  font-weight: 600;
}

.regularMemberManageApp
  > main
  .el-table
  tbody
  tr:last-of-type:hover
  > td:nth-of-type(2) {
  color: #409eff;
}
.regularMemberManageApp
  > main
  .el-table
  tbody
  tr:last-of-type
  > td:nth-of-type(2) {
  color: #409eff;
}
</style>
