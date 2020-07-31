<template>
  <div class="tableCollapseApp">
    <div class="searchApp">
      <el-input placeholder="姓名" v-model.trim="userName" clearable></el-input>
      <el-input placeholder="账号" v-model.trim="accountName" clearable></el-input>
      <el-input placeholder="部门" v-model.trim="department" clearable></el-input>
      <el-button type="primary" @click="accordUserSearch">查询</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%"
              empty-text
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column prop="userId" label="用户ID" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="accountName" label="账号名" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="department" label="部门" width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="140" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="归属地" width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="60" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center" type="index" >
        <template slot-scope="scope">
          <el-button @click="editUserMessage(scope.row)" type="text" v-if="editButton">编辑</el-button>
          <el-button type="text" size="small" @click="changeStatus(scope.row, $event)" v-if="scope.row.status === '已启用' && disabledButton === true">账号禁用</el-button>
          <el-button type="text" size="small" @click="changeStatus(scope.row, $event)"  v-if="scope.row.status !== '已启用' && disabledButton === true">账号启用</el-button>
          <el-button type="text" size="small" @click="editUserRole(scope.row)" v-if="roleButton">角色</el-button>
          <el-button type="text" size="small" @click="editUserTeam(scope.row)" v-if="teamButton">用户组</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :current-page.sync="startNum"
                     :page-sizes="[5, 10, 20]"
                     :page-size="range"
                     :total="total"
                     layout="total, sizes, prev, pager, next"
                     @size-change="rangeChange"
                     @current-change="startNumChange">
      </el-pagination>
    </div>
    <!-- 编辑信息弹窗 -->
    <el-dialog title="编辑" :visible.sync="showDialogEditUser" :show-close="hide" :before-close="clickOther" class="editUser">
      <el-form label-position="right" label-width="80px" :model="showDialogEditUserData">
        <el-form-item label="用户ID">
          <el-input v-model="showDialogEditUserData.userId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="showDialogEditUserData.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号名">
          <el-input v-model="showDialogEditUserData.accountName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="showDialogEditUserData.department" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="showDialogEditUserData.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="归属地" prop="address">
          <el-input v-model.trim="showDialogEditUserData.address" required></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="showDialogEditUserData.status" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="showDialogEditUserData.createTime" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialog('confirm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定角色 -->
    <!-- <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople> -->
    <el-dialog :visible.sync="showDialogUser" :show-close="hide" :before-close="clickOther" class="bindUser">
      <div class="left">
        <h2>待绑定角色列表</h2>
        <el-tree :data="bindRole" @node-click="handleNodeClick" accordion empty-text node-key="id"></el-tree>
      </div>
      <div class="middle">
        <el-button type="primary" plain @click="addRole">> 添加</el-button>
      </div>
      <div class="right">
        <h2>已绑定角色列表</h2>
        <div class="table">
          <el-table :data="haveBindUser" empty-text>
            <el-table-column prop="role" label="角色" width="224" align="center"></el-table-column>
            <el-table-column label="操作" width="224" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteBindUser(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定用户组 -->
    <el-dialog :visible.sync="showDialogUserTeam" :show-close="hide" :before-close="clickOther" class="bindTeam">
      <div class="left">
        <h2>待选择用户组列表</h2>
        <el-tree :data="bindTeam" @node-click="handleNodeClickTeam" accordion empty-text node-key="id"></el-tree>
      </div>
      <div class="middle">
        <el-button type="primary" plain @click="addTeam">> 添加</el-button>
      </div>
      <div class="right">
        <h2>已选择用户组列表</h2>
        <div class="table">
          <el-table :data="haveBindTeam" empty-text>
            <el-table-column prop="userTeam" label="用户组名称" width="224" align="center"></el-table-column>
            <el-table-column label="操作" width="224" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteBindTeam(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindTeam('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindTeam('confirm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectPeople from '../components/selectPeople'
import { getUserPower, updateUserPower, getRoleListPower, getUserRoleRelationPower, updateUserRoleRelationPower, getGroupListPower, getUserGroupRelationPower, updateUserGroupRelationPower } from '../api/api'
export default {
  components: {
    SelectPeople
  },
  props: ['data1'],
  data () {
    return {
      editButton: false,
      disabledButton: false,
      roleButton: false,
      teamButton: false,
      loading: false,
      preAddRole: '',
      preAddTeam: '',
      showDialogEditUser: false,
      hide: false,
      userId: null,
      showDialogEditUserData: [],
      startNum: 1,
      showDialogUser: false,
      showDialogUserTeam: false,
      range: 10,
      total: 0,
      userName: '',
      accountName: '',
      department: '',
      bindRole: [],
      haveBindUser: [],
      haveBindUserTemp: [],
      tableData: [],
      bindTeam: [],
      haveBindTeam: [],
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: []
    }
  },
  methods: {
    getSearchFromComponent (val) {
      console.log(val)
    },
    searchFromComponent (val) {
      console.log(val)
    },
    commitBindPeople (val) {
      console.log(val)
    },
    changeShowSelectPeople (bol) {
      console.log(bol)
    },
    closeDialogBindTeam (action) {
      if (action === 'close') {
        this.showDialogUserTeam = false
      }
      if (action === 'confirm') {
        let arr = []
        this.haveBindTeam.forEach(ele => {
          arr.push(ele.userTeam)
        })
        updateUserGroupRelationPower({
          userId: this.userId,
          userGroupList: arr.join(',')
        }).then(res => {
          if (res.state === 1000) {
            this.showDialogUserTeam = false
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
      }
    },
    handleNodeClickTeam (data) {
      if (data.label !== '用户组信息') {
        this.preAddTeam = data.label
      }
    },
    addRole () {
      let tableDataArr = []
      this.haveBindUser.forEach(ele => {
        tableDataArr.push(ele.role)
      })
      if (tableDataArr.indexOf(this.preAddRole) === -1) {
        let data = {
          role: this.preAddRole
        }
        if (data.role !== '') {
          this.haveBindUser.push(data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
      }
    },
    addTeam () {
      let tableDataArr = []
      this.haveBindTeam.forEach(ele => {
        tableDataArr.push(ele.userTeam)
      })
      if (tableDataArr.indexOf(this.preAddTeam) === -1) {
        let data = {
          userTeam: this.preAddTeam
        }
        if (data.userTeam !== '') {
          this.haveBindTeam.push(data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
      }
    },
    deleteBindUser (index) {
      this.haveBindUser.splice(index, 1)
    },
    deleteBindTeam (index) {
      this.haveBindTeam.splice(index, 1)
    },
    initTableRoleData () {
      this.loading = true
      let data = {
        userName: this.userName,
        accountName: this.accountName,
        department: this.department,
        startNum: this.startNum,
        range: this.range
      }
      getUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.loading = false
            this.total = res.data.total
            this.tableData = res.data.userList
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
    },
    changeStatus (rowData, event) {
      let status = ''
      if (rowData.status === '已启用') {
        status = '已禁用'
      } else {
        status = '已启用'
      }
      let data = {
        accountName: rowData.accountName,
        address: rowData.address,
        status: status
      }
      updateUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            setTimeout(() => {
              this.initTableRoleData()
            }, 500)
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    editUserRole (rowData) {
      let data = {
        startNum: 1,
        range: 0
      }
      this.userId = rowData.userId
      getRoleListPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.showDialogUser = true
            let tempData = res.data.roleList
            let array = []
            for (var i = 0; i < tempData.length; i++) {
              array[i] = {label: ''}
            }
            for (let i = 0; i < tempData.length; i++) {
              array[i].label = tempData[i]
            }
            this.bindRole = [{
              label: '角色信息',
              children: array
            }]
            let data = {
              userId: rowData.userId
            }
            getUserRoleRelationPower(data)
              .then(res => {
                if (res.state === 1000) {
                  let tempData = res.data.roles
                  let arr = []
                  for (var i = 0; i < tempData.length; i++) {
                    arr[i] = {role: ''}
                  }
                  for (let i = 0; i < tempData.length; i++) {
                    arr[i].role = tempData[i]
                  }
                  this.haveBindUser = arr
                } else {
                  this.errorAjax()
                }
              }, rej => {
                this.errorAjax()
              })
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    handleNodeClick (data) {
      if (data.label !== '角色信息') {
        this.preAddRole = data.label
      }
    },
    error () {
      this.loading = false
      this.$message({
        type: 'error',
        message: '读取失败',
        duration: 1000
      })
    },
    rangeChange (val) {
      this.range = val
      this.initTableRoleData()
    },
    startNumChange (val) {
      this.startNum = val
      this.initTableRoleData()
    },
    accordUserSearch () {
      this.startNum = 1
      this.initTableRoleData()
    },
    editUserMessage (rowData) {
      this.showDialogEditUser = true
      this.showDialogEditUserData = rowData
    },
    clickOther (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    },
    closeDialog (action) {
      if (action === 'close') {
        this.showDialogEditUser = false
      }
      if (action === 'confirm') {
        let reg = /\S/
        if (reg.test(this.showDialogEditUserData.address)) {
          let data = {
            accountName: this.showDialogEditUserData.accountName,
            address: this.showDialogEditUserData.address,
            status: this.showDialogEditUserData.status
          }
          updateUserPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialogEditUser = false
                this.initTableRoleData()
              } else {
                this.showDialogEditUser = false
                this.errorAjax()
              }
            }, rej => {
              this.showDialogEditUser = false
              this.errorAjax()
            })
        } else {
          this.errorConfirm()
        }
      }
    },
    errorConfirm () {
      this.$message({
        type: 'error',
        message: '不能为空',
        duration: 1000
      })
    },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    },
    closeDialogBindUser (action) {
      if (action === 'close') {
        this.showDialogUser = false
      }
      if (action === 'confirm') {
        let arr = []
        this.haveBindUser.forEach((ele, index) => {
          arr[index] = ele.role
        })
        arr = arr.join(',')
        let data = {
          userId: this.userId,
          roleList: arr
        }
        updateUserRoleRelationPower(data)
          .then(res => {
            if (res.state === 1000) {
              this.showDialogUser = false
              this.initTableRoleData()
            } else {
              this.errorAjax()
              this.showDialogUser = false
            }
          }, rej => {
            this.errorAjax()
            this.showDialogUser = false
          })
      }
    },
    editUserTeam (rowData) {
      this.userId = rowData.userId
      getGroupListPower({startNum: 1, range: 0})
        .then(res => {
          if (res.state === 1000) {
            let tempData = res.data.userGroupList
            let array = []
            for (var i = 0; i < tempData.length; i++) {
              array[i] = {label: ''}
            }
            for (let i = 0; i < tempData.length; i++) {
              array[i].label = tempData[i]
            }
            this.bindTeam = [{
              label: '用户组信息',
              children: array
            }]
            this.showDialogUserTeam = true
            let data = {
              userId: rowData.userId
            }
            getUserGroupRelationPower(data)
              .then(res => {
                if (res.state === 1000) {
                  let tempData = res.data.group
                  let arr = []
                  for (var i = 0; i < tempData.length; i++) {
                    arr[i] = {userTeam: ''}
                  }
                  for (let i = 0; i < tempData.length; i++) {
                    arr[i].userTeam = tempData[i]
                  }
                  this.haveBindTeam = arr
                } else {
                  this.errorAjax()
                }
              }, rej => {
                this.errorAjax()
              })
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    }
  },
  created () {
    this.initTableRoleData()
  },
  watch: {
    data1 (val) {
      let arr = []
      val.forEach(ele => {
        arr.push(ele.elementId)
      })
      if (arr.indexOf(60025) > -1) {
        this.editButton = true
      } else {
        this.editButton = false
      }
      if (arr.indexOf(60026) > -1) {
        this.disabledButton = true
      } else {
        this.disabledButton = false
      }
      if (arr.indexOf(60027) > -1) {
        this.roleButton = true
      } else {
        this.roleButton = false
      }
      if (arr.indexOf(60028) > -1) {
        this.teamButton = true
      } else {
        this.teamButton = false
      }
    }
  }
}
</script>

<style>
.tableCollapseApp {
  width: 1040px
}
.tableCollapseApp > .searchApp {
  width: 1040px;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #EBEEF5
}
.tableCollapseApp > .searchApp > .el-input {
  display: inline-block;
  width: 150px;
  height: 30px;
  margin-left: 30px
}
.tableCollapseApp > .searchApp > .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px
}
.tableCollapseApp > .searchApp > .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
  margin-left: 100px
}
.tableCollapseApp > .el-table {
  border-left: 1px solid #EBEEF5
}
.tableCollapseApp > .el-table th, .tableCollapseApp > .el-table tr {
  background-color: rgb(56, 53, 53);
}
.tableCollapseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th{
  border-right: 1px solid #EBEEF5
}
.tableCollapseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th > div {
  color: rgb(245, 231, 231)
}
.tableCollapseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:nth-last-of-type(2) {
  border-right-width: 0px
}
.tableCollapseApp > .el-table > .el-table__body-wrapper {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr {
  height: 50px;
  border-bottom-width: 0px;
  cursor: pointer
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(odd) {
  background-color: #fff;
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(even) {
  background-color: rgba(231, 228, 228, 0.884);
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 0px;
  border-right: 1px solid #EBEEF5
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:last-of-type {
  border-right-width: 0px
}
.tableCollapseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td > div {
  padding: 0px
}
.tableCollapseApp > .pagination {
  margin-top: 20px
}
.tableCollapseApp > .bindUser > .el-dialog {
  width: 1000px;
  height: 600px
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 402px;
  overflow-y: auto
}
.tableCollapseApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}

.tableCollapseApp > .bindTeam > .el-dialog {
  width: 1000px;
  height: 600px
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 398px;
  overflow-y: auto
}
.tableCollapseApp > .bindTeam > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}
</style>
