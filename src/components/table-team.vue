<template>
  <div class="tableTeamApp">
    <div class="searchTeamApp">
      <el-input placeholder="用户组名称" v-model.trim="userGroup" clearable></el-input>
      <el-input placeholder="用户域账号" v-model.trim="accountName" clearable></el-input>
      <el-button type="primary" @click="searchData">查询</el-button>
      <el-button type="primary" @click="addNewTeam" class="addnewteam" v-if="newButton">新增用户组</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%"
              empty-text
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              cell-click="aaa">
      <el-table-column prop="userGroupId" label="用户组ID" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="userGroup" label="用户组名称" width="120" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="userGroupDesc" label="用户组描述" width="115" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="userList" label="用户列表" width="194" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="openUserCol(scope.row)" type="text">查看用户列表</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="280" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button @click="editTeamMessage(scope.row)" type="text" v-if="editButton">编辑</el-button>
          <el-button type="text" size="small" @click="openDialogRole(scope.row)" v-if="roleButton">角色</el-button>
          <el-button type="text" size="small" @click="openDialogUser(scope.row)" v-if="userButton">用户</el-button>
          <el-button type="text" size="small" @click="deleteTeam(scope.row)" v-if="deleteButton">删除</el-button>
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
    <!-- 查看更多用户 -->
    <el-dialog title="用户列表" :visible.sync="seeMoreUser" class="moreUser" :before-close="clickOther">
      <el-table :data="seeTableData" style="width: 100%" border>
        <el-table-column prop="userName" label="用户名" style="width: 50%" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账号" style="width: 50%" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新建用户组或者编辑 -->
    <el-dialog :visible.sync="showDialogEditTeam.bol" :show-close="hide" :before-close="clickOther" class="createOrEdit">
      <el-form label-position="right" label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户组名称" prop="userGroup">
          <el-input v-model.trim="ruleForm.userGroup"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述" prop="userGroupDesc">
          <el-input v-model.trim="ruleForm.userGroupDesc"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="closeDialogAddOrEdit('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm1('ruleForm')" v-if="showDialogEditTeam.meta === 'new'">确 定</el-button>
          <el-button type="primary" @click="submitForm2('ruleForm')"  v-else>确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 绑定角色 -->
    <el-dialog :visible.sync="showDialogbindURole" :show-close="hide" :before-close="clickOther" class="bindRole">
      <div class="left">
        <h2>待选择角色列表</h2>
        <el-tree :data="bindRoleData" @node-click="roleNodeClick" accordion empty-text node-key="id"></el-tree>
      </div>
      <div class="middle">
        <el-button type="primary" plain @click="addRole">> 添加</el-button>
      </div>
      <div class="right">
        <h2>已选择角色列表</h2>
        <div class="table">
          <el-table :data="haveBindRoleData" empty-text>
            <el-table-column prop="role" label="角色" width="224" align="center"></el-table-column>
            <el-table-column label="操作" width="224" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteHaveBindRole(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogbindRole('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogbindRole('confirm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定用户 -->
    <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople>
    <!-- <el-dialog :visible.sync="showDialogBindUser" :show-close="hide" :before-close="clickOther" class="bindUser">
      <div class="left">
        <h2>待选择用户列表</h2>
        <el-tree :data="bindUserData" @node-click="handleNodeClick" accordion empty-text node-key="id" @node-expand="openList"></el-tree>
      </div>
      <div class="middle">
        <el-button type="primary" plain @click="addRBindUser">> 添加</el-button>
      </div>
      <div class="right">
        <h2>已绑定用户列表</h2>
        <div class="table">
          <el-table :data="havebindUserData" empty-text>
            <el-table-column prop="userName" label="用户名称" width="224" align="center"></el-table-column>
            <el-table-column label="操作" width="224" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteBindResourse(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getGroupPower, addGroupPower, updateGroupPower, deleteGroupPower, getGroupRoleListPower, getGroupRoleRelationPower, updateGroupRoleRelationPower, getUserListPower, getGroupUserRelationPower, updateGroupUserRelationPower, searchAndGetUsers } from '../api/api'
import SelectPeople from '../components/selectPeople'
export default {
  props: ['data2'],
  components: {
    SelectPeople
  },
  data () {
    return {
      // 控制选择用户列表的弹窗显示
      showSelectPeople: false,
      newButton: false,
      editButton: false,
      roleButton: false,
      userButton: false,
      deleteButton: false,
      ruleForm: {
        userGroupDesc: '',
        userGroup: ''
      },
      rules: {
        userGroup: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userGroupDesc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      showDialogBindUser: false,
      showDialogbindURole: false,
      bindRoleData: [],
      bindUserData: [],
      haveBindRoleData: [],
      havebindUserData: [],
      seeTableData: [],
      showDialogEditTeam: {
        bol: false
      },
      selectUserName: '',
      selectResourceType: '',
      isSelectUserName: false,
      loading: false,
      userGroupId: null,
      status: true,
      cut: true,
      hide: false,
      seeMoreUser: false,
      userGroup: '',
      accountName: '',
      startNum: 1,
      range: 10,
      total: 0,
      userList: [],
      seeMoreArray: [],
      powerIdArr: [],
      // 准备添加的角色
      preAddRole: '',
      tableData: [],
      sendSearch: []
    }
  },
  methods: {
    // 从子组件内传递的调用接口的必要参数
    getSearchFromComponent (mes) {
      // console.log(mes)
      searchAndGetUsers({
        userName: mes.userName,
        searchType: mes.searchType
      }).then(res => {
        if (res.state === 1000) {
          // console.log(res.data.userList)
          this.sendSearch = res.data.userList
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    // 点击确定获取已经添加的用户
    commitBindPeople (users) {
      console.log(users)
      updateGroupUserRelationPower({
        userGroupId: this.userGroupId,
        userList: users.map(ele => ele.fullName.split('(')[1].split(')')[0]).join(',')
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          let _this = this
          setTimeout(() => {
            _this.initTableData()
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    // 组件内关闭弹窗，修改父元素中的显示状态
    changeShowSelectPeople (bol) {
      this.showSelectPeople = false
    },
    deleteBindResourse (index) {
      this.havebindUserData.splice(index, 1)
    },
    // closeDialogBindUser (action) {
    //   if (action === 'close') {
    //     this.showDialogBindUser = false
    //   }
    //   if (action === 'confirm') {
    //     let arr = []
    //     this.havebindUserData.forEach(ele => {
    //       if (ele.accountName) {
    //         arr.push(ele.accountName)
    //       }
    //     })
    //     let userList = arr.concat(this.userList)
    //     userList = userList.join(',')
    //     updateGroupUserRelationPower({
    //       userGroupId: this.userGroupId,
    //       userList: userList
    //     }).then(res => {
    //       if (res.state === 1000) {
    //         this.userList = []
    //         this.showDialogBindUser = false
    //         setTimeout(() => {
    //           this.initTableRoleData()
    //         }, 500)
    //       } else {
    //         this.errorAjax()
    //       }
    //     }, rej => {
    //       this.errorAjax()
    //     })
    //   }
    // },
    // 添加用户
    addRBindUser () {
      if (this.selectUserName !== this.selectResourceType && this.selectUserName !== '' && this.selectResourceType !== '') {
        let arr = []
        this.havebindUserData.forEach(ele => {
          arr.push(ele.userName)
        })
        if (arr.indexOf(this.selectResourceType) === -1) {
          let result = this.bindUserData.find(ele => ele.label === this.selectUserName)
          let res = result.children.find(ele => ele.label === this.selectResourceType)
          this.userList.push(res.accountName)
          this.havebindUserData.push({
            userName: this.selectResourceType
          })
        }
      }
    },
    handleNodeClick (data) {
      if (this.isSelectUserName) {
        this.selectResourceType = data.label
      }
    },
    // 展开的用户列表
    openList (data) {
      this.selectUserName = data.label
      setTimeout(() => {
        this.isSelectUserName = true
      }, 100)
    },
    // 用户
    openDialogUser (rowData) {
      this.userGroupId = rowData.userGroupId
      this.showDialogBindUser = true
      let promise1 = getUserListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          // this.bindUserData = res.data.userList
          return res.data.userList
        } else {
          this.errorAjax()
        }
      }, rej => {
        this.errorAjax()
      })
      let promise2 = getGroupUserRelationPower({
        userGroupId: this.userGroupId
      }).then(res => {
        if (res.state === 1000) {
          // this.havebindUserData = res.data.userList
          // console.log(this.havebindUserData)
          return res.data.userList
        } else {
          this.errorAjax()
        }
      }, rej => {
        this.errorAjax()
      })
      Promise.all([promise1, promise2]).then((res) => {
        console.log(res[0])
        console.log(res[1])
        // 显示选择用户列表的组件
        this.bindUserData = res[0]
        this.havebindUserData = res[1]
        this.showSelectPeople = true
      })
    },
    // 点击角色列表选择要添加而角色
    roleNodeClick (data) {
      if (data.label !== '角色信息') {
        this.preAddRole = data.label
      }
    },
    // 添加角色到右边
    addRole () {
      let tableDataArr = []
      this.haveBindRoleData.forEach(ele => {
        tableDataArr.push(ele.role)
      })
      if (tableDataArr.indexOf(this.preAddRole) === -1) {
        let data = {
          role: this.preAddRole
        }
        if (data.role !== '') {
          this.haveBindRoleData.push(data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
      }
    },
    closeDialogbindRole (action) {
      if (action === 'close') {
        this.showDialogbindURole = false
      }
      if (action === 'confirm') {
        let arr = []
        this.haveBindRoleData.forEach(ele => {
          arr.push(ele.role)
        })
        let string = arr.join(',')
        updateGroupRoleRelationPower({
          userGroupId: this.userGroupId,
          roleList: string
        }).then(res => {
          if (res.state === 1000) {
            this.initTableData()
            this.showDialogbindURole = false
          } else {
            this.errorAjax()
            this.showDialogbindURole = false
          }
        }, rej => {
          this.errorAjax()
          this.showDialogbindURole = false
        })
      }
    },
    // 删除已经绑定的角色
    deleteHaveBindRole (index) {
      this.haveBindRoleData.splice(index, 1)
    },
    // 角色
    openDialogRole (rowData) {
      this.userGroupId = rowData.userGroupId
      getGroupRoleListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          this.showDialogbindURole = true
          let arr = []
          res.data.roleList.forEach(ele => {
            arr.push({label: ele})
          })
          this.bindRoleData = [
            {
              label: '角色信息',
              children: arr
            }
          ]
          getGroupRoleRelationPower({
            userGroupId: this.userGroupId
          }).then(res => {
            if (res.state === 1000) {
              let arr = []
              res.data.roles.forEach(ele => {
                arr.push({role: ele})
              })
              this.haveBindRoleData = arr
            }
          })
        } else {
          this.errorAjax()
        }
      }, rej => {
        this.errorAjax()
      })
    },
    // 弹框点击外部
    clickOther (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    },
    // 删除
    deleteTeam (rowData) {
      this.$confirm('这将会移除本组下所有用户的当前用户组权限, 是否继续?', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          userGroupId: rowData.userGroupId
        }
        deleteGroupPower(data)
          .then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initTableData()
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑确定
    submitForm2 (formName) {
      this.$refs[formName].validate(valid => {
        let _this = this
        if (valid) {
          let data = {
            userGroupId: this.userGroupId,
            userGroup: this.ruleForm.userGroup,
            userGroupDesc: this.ruleForm.userGroupDesc
          }
          updateGroupPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialogEditTeam = {
                  bol: false
                }
                this.ruleForm = {
                  userGroup: '',
                  userGroupDesc: ''
                }
                _this.$refs[formName].clearValidate()
                setTimeout(() => {
                  this.initTableData()
                }, 500)
              } else if (res.state === 3006) {
                this.$message.error('用户组已存在')
              } else {
                this.errorAjax()
              }
            }, rej => {
              this.errorAjax()
            })
        } else {
          return false
        }
      })
    },
    // 新增确定
    submitForm1 (formName) {
      this.$refs[formName].validate(valid => {
        let _this = this
        if (valid) {
          let data = {
            userGroup: this.ruleForm.userGroup,
            userGroupDesc: this.ruleForm.userGroupDesc
          }
          addGroupPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialogEditTeam = {
                  bol: false
                }
                this.ruleForm = {
                  userGroup: '',
                  userGroupDesc: ''
                }
                _this.$refs[formName].clearValidate()
                setTimeout(() => {
                  this.initTableData()
                }, 500)
              } else if (res.state === 3006) {
                this.$message.error('用户组已存在')
              } else {
                this.errorAjax()
              }
            }, rej => {
              this.errorAjax()
            })
        } else {
          return false
        }
      })
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
    // 编辑
    editTeamMessage (rowData) {
      this.userGroupId = rowData.userGroupId
      this.showDialogEditTeam = {
        bol: true,
        meta: 'edit'
      }
      this.ruleForm = {
        userGroup: rowData.userGroup,
        userGroupDesc: rowData.userGroupDesc
      }
    },
    // 关闭新增或者编辑
    closeDialogAddOrEdit (formName) {
      this.showDialogEditTeam = {
        bol: false
      }
      this.ruleForm = {
        userGroup: '',
        userGroupDesc: ''
      }
      this.$refs[formName].clearValidate()
    },
    // 新增用户组
    addNewTeam () {
      this.showDialogEditTeam.bol = true
      this.showDialogEditTeam.meta = 'new'
    },
    startNumChange (val) {
      this.startNum = val
      this.initTableData()
    },
    rangeChange (val) {
      this.range = val
      this.initTableData()
    },
    searchData () {
      this.startNum = 1
      this.initTableData()
    },
    initTableData () {
      let data = {
        userGroup: this.userGroup,
        accountName: this.accountName,
        startNum: this.startNum,
        range: this.range
      }
      getGroupPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.userGroupList
            this.total = res.data.total
          }
        })
    },
    openUserCol (rowData) {
      getGroupUserRelationPower({
        userGroupId: rowData.userGroupId
      }).then(res => {
        if (res.state === 1000) {
          this.seeMoreUser = true
          this.seeTableData = res.data.userList
        }
      })
    }
  },
  created () {
    this.initTableData()
  },
  watch: {
    data2 (val) {
      let arr = []
      val.forEach(ele => {
        arr.push(ele.elementId)
      })
      if (arr.indexOf(60020) > -1) {
        this.newButton = true
      } else {
        this.newButton = false
      }
      if (arr.indexOf(60021) > -1) {
        this.editButton = true
      } else {
        this.editButton = false
      }
      if (arr.indexOf(60022) > -1) {
        this.roleButton = true
      } else {
        this.roleButton = false
      }
      if (arr.indexOf(60023) > -1) {
        this.userButton = true
      } else {
        this.userButton = false
      }
      if (arr.indexOf(60024) > -1) {
        this.deleteButton = true
      } else {
        this.deleteButton = false
      }
    }
  }
}
</script>

<style>
.tableTeamApp {
  width: 1040px
}
.tableTeamApp > .searchTeamApp {
  width: 1040px;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #EBEEF5
}
.tableTeamApp > .searchTeamApp > .el-input {
  display: inline-block;
  width: 150px;
  height: 30px;
  margin-left: 30px
}
.tableTeamApp > .searchTeamApp > .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px
}
.tableTeamApp > .searchTeamApp > .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
  margin-left: 100px
}
.tableTeamApp > .searchTeamApp > .addnewteam {
  position: absolute;
  right: 20px;
  top: 13px
}
.tableTeamApp > .el-table {
  border-left: 1px solid #EBEEF5
}
.tableTeamApp > .el-table th, .tableCollapseApp > .el-table tr {
  background-color: rgb(56, 53, 53)
}
.tableTeamApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th{
  border-right: 1px solid #EBEEF5
}
.tableTeamApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th > div {
  color: rgb(245, 231, 231)
}
.tableTeamApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:nth-last-of-type(2) {
  border-right-width: 0px
}
.tableTeamApp > .el-table > .el-table__body-wrapper {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr {
  height: 50px;
  border-bottom-width: 0px;
  cursor: pointer
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(odd) {
  background-color: #fff
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(even) {
  background-color: rgba(231, 228, 228, 0.884)
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 0px;
  border-right: 1px solid #EBEEF5
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:last-of-type {
  border-right-width: 0px
}
.tableTeamApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td > div {
  padding: 0px
}
.tableTeamApp > .pagination {
  margin-top: 20px
}
.tableTeamApp > .moreUser {
  width: 100%;
  overflow: hidden;
  margin: 0 auto
}
.tableTeamApp > .moreUser > .el-dialog {
  width: 50%;
}
.tableTeamApp > .moreUser > .el-dialog > .el-dialog__body > .el-table {
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  margin-top: 20px
}
.tableTeamApp > .moreUser > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type {
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .moreUser > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .moreUser > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody {
  min-height: 144px;
  max-height: 480px;
  overflow-y: auto;
  overflow-x: hidden
}
.tableTeamApp > .bindRole > .el-dialog {
  width: 1000px;
  height: 600px
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 402px;
  overflow-y: auto
}
.tableTeamApp > .bindRole > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
}
.tableTeamApp > .bindUser > .el-dialog {
  width: 1000px;
  height: 600px
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 402px;
  overflow-y: auto
}
.tableTeamApp > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}
.tableTeamApp > .createOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item {
  margin-bottom: 40px
}
.tableTeamApp > .createOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-input {
  width: 395px
}
.tableTeamApp > .createOrEdit > .el-dialog {
  width: 550px;
  position: relative
}
.tableTeamApp > .createOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-button:nth-of-type(2) {
  position: absolute;
  right: 16px
}
.tableTeamApp > .createOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-button:nth-of-type(1) {
  position: absolute;
  right: 120px
}
</style>
