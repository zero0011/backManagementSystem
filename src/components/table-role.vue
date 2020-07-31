<template>
  <div class="tableRoleApp">
    <div class="searchRole">
      <el-input placeholder="角色名称" v-model.trim="roleName" clearable></el-input>
      <el-button type="primary" @click="accordRoleSearch">查询</el-button>
      <el-button type="primary" @click="addNewRole" class="addNewRole" v-if="addButton">新增角色</el-button>
    </div>
    <el-table :data="tableData"
              style="width: 100%"
              empty-text
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column prop="roleId" label="角色ID" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="资源" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="seeResourse(scope.row)" type="text">查看资源</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button @click="editRole(scope.row)" type="text" v-if="editButton">编辑</el-button>
          <el-button type="text" size="small" @click="showDialogRole(scope.row)" v-if="bindButton">绑定</el-button>
          <el-button type="text" size="small" @click="copyAndCreate(scope.row)" v-if="copyButton">复制</el-button>
          <el-button type="text" size="small" @click="deleteRole(scope.row)" v-if="deleteButton">删除</el-button>
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
    <!-- 新增角色 -->
    <el-dialog :title="title" :visible.sync="showDialog.bol" :show-close="hide" :before-close="clickOther" class="addRoleOrEdit">
      <el-form label-position="right" label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm1('ruleForm')" v-if="addOrEdit === 'new'">确 定</el-button>
        <el-button type="primary" @click="submitForm3('ruleForm')" v-if="addOrEdit === 'copy'">确 定</el-button>
        <el-button type="primary" @click="submitForm2('ruleForm')" v-if="addOrEdit === 'edit'">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看资源 -->
    <el-dialog :title="title1" :visible.sync="seeDialog.bol" width="50%" :before-close="clickOther" class="seeResourse">
      <div class="search">
        <el-input placeholder="资源名称" v-model.trim="powerName" clearable @keyup.enter.native="accordResourseSearch"></el-input>
        <el-button type="primary" @click="accordResourseSearch">查询</el-button>
      </div>
      <el-table :data="seeTableData" style="width: 100%">
        <el-table-column prop="powerName" label="资源名称" style="width: 50%" align="center"></el-table-column>
        <el-table-column prop="resourceTypeString" label="资源类型" style="width: 50%" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enter">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDialogResourse" :show-close="hide" :before-close="clickOther" class="bindResourse">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="bindResourseTab">
        <el-tab-pane :label="val.label" :name="val.label" v-for="(val, key) in bindResourse" :key="key">
          <div class="checkBoxTable">
            <div class="search">
              <el-input placeholder="请输入内容" v-model="input" clearable suffix-icon="el-icon-search" @keyup.enter.native="search"></el-input>
            </div>
            <div class="checkBox">
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedResourse" @change="handleCheckedCResourseChange">
                <el-checkbox v-for="(value, key2) in val.children" :label="value.label + '(' + value.powerDesc + ')'" :key="key2" :title="value.powerDesc" ref="elcheckbox" :id="'elcheckbox' + key2" class="elcheckboxbgc">{{ value.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="button">
        <el-button @click="cancelBindResourse">取消</el-button>
        <el-button type="primary" @click="submitBindResourse">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRolePower, addRolePower, getRoleResourceRelationPower, updateRolePower, deleteRolePower, getResourceListPower, updateRoleResourceRelationPower, copyRolePower } from '../api/api'
export default {
  props: ['data3'],
  data () {
    return {
      addButton: false,
      editButton: false,
      bindButton: false,
      copyButton: false,
      deleteButton: false,
      // 角色管理-绑定-弹窗-标签页
      iconPageName: [],
      resourseArr1: [],
      resourseArr2: [],
      resourseArr3: [],
      isIndeterminate: false,
      input: '',
      // 选中所有资源
      checkAll: [],
      // 选中的资源
      checkedResourse: [],
      activeName: '',
      ruleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          }
        ]
      },
      bindResourse: [],
      selectResourceName: '',
      selectResourceType: '',
      haveBindData: [],
      addOrEdit: '',
      userId: '',
      // 搜索条件
      roleName: '',
      // 默认分页第一页
      startNum: 1,
      range: 10,
      // 数据读取过渡动画
      loading: false,
      // 数据总量
      total: null,
      hide: false,
      powerIdArr: [],
      showDialog: {
        bol: false
      },
      seeDialog: {
        bol: false
      },
      // 资源绑定
      showDialogResourse: false,
      // 对话框标题
      title: '',
      title1: '',
      powerName: '',
      tableData: [],
      seeTableData: [],
      seeTableDataTemp: [],
      isSelectResourceName: false,
      fromRoleId: ''
    }
  },
  methods: {
    search () {
      Array.from(document.getElementsByClassName('elcheckboxbgc')).forEach(ele => {
        ele.children[1].style.backgroundColor = ''
      })
      let arr = []
      let name = ''
      if (this.activeName === '页面菜单') {
        this.bindResourse[0].children.forEach((ele, index) => {
          if (this.input === ele.label) {
            arr.push(index)
          }
        })
        name = '页面菜单'
      }
      if (this.activeName === '页面元素') {
        this.bindResourse[1].children.forEach((ele, index) => {
          if (this.input === ele.label) {
            arr.push(index)
          }
        })
        name = '页面元素'
      }
      if (this.activeName === '页面操作') {
        this.bindResourse[2].children.forEach((ele, index) => {
          if (this.input === ele.label) {
            arr.push(index)
          }
        })
        name = '页面操作'
      }
      let element = document.getElementById('pane-' + name)
      Array.from(element.children[0].children[1].children[1].children).forEach(ele => {
        ele.style.backgroundColor = ''
      })
      arr.forEach(ele => {
        element.children[0].children[1].children[1].children[ele].style.backgroundColor = '#ccc'
      })
    },
    clearAllResourseSelect () {
      this.iconPageName.forEach(ele => {
        let element = document.getElementById('pane-' + ele)
        Array.from(element.children[0].children[1].children[1].children).forEach(ele => {
          ele.style.backgroundColor = ''
        })
      })
    },
    submitForm3 (formName) {
      this.$refs[formName].validate(valid => {
        let _this = this
        if (valid) {
          let data = {
            fromRoleId: this.fromRoleId,
            toRoleName: this.ruleForm.roleName,
            toRoleDesc: this.ruleForm.roleDesc
          }
          copyRolePower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialog = {
                  bol: false
                }
                this.ruleForm = {
                  roleName: '',
                  roleDesc: ''
                }
                _this.$refs[formName].clearValidate()
                setTimeout(() => {
                  this.initTableRoleData()
                }, 500)
              } else if (res.state === 2023) {
                this.$message.error('角色名称已存在')
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
    // 复制资源
    copyAndCreate (rowData) {
      this.fromRoleId = rowData.roleId
      this.showDialog.bol = true
      this.addOrEdit = 'copy'
      this.title = '复制'
    },
    // 角色管理-绑定-确定
    submitBindResourse () {
      let arr1 = []
      let powerIdArr1 = []
      this.resourseArr1.forEach(ele => {
        arr1.push({
          label: ele.split('(')[0],
          powerDesc: ele.split('(')[1].split(')')[0]
        })
      })
      arr1.forEach(ele => {
        this.bindResourse[0].children.forEach(ele2 => {
          if (ele.label === ele2.label && ele.powerDesc === ele2.powerDesc) {
            powerIdArr1.push(ele2.powerId)
          }
        })
      })
      let arr2 = []
      let powerIdArr2 = []
      this.resourseArr2.forEach(ele => {
        arr2.push({
          label: ele.split('(')[0],
          powerDesc: ele.split('(')[1].split(')')[0]
        })
      })
      arr2.forEach(ele => {
        this.bindResourse[1].children.forEach(ele2 => {
          if (ele.label === ele2.label && ele.powerDesc === ele2.powerDesc) {
            powerIdArr2.push(ele2.powerId)
          }
        })
      })
      let arr3 = []
      let powerIdArr3 = []
      this.resourseArr3.forEach(ele => {
        arr3.push({
          label: ele.split('(')[0],
          powerDesc: ele.split('(')[1].split(')')[0]
        })
      })
      arr3.forEach(ele => {
        this.bindResourse[2].children.forEach(ele2 => {
          if (ele.label === ele2.label && ele.powerDesc === ele2.powerDesc) {
            powerIdArr3.push(ele2.powerId)
          }
        })
      })
      let powerId = powerIdArr1.concat(powerIdArr2, powerIdArr3)
      updateRoleResourceRelationPower({
        roleId: this.userId,
        powerIdList: powerId.join(',')
      }).then(res => {
        if (res.state === 1000) {
          powerId = []
          this.resourseArr1 = []
          this.resourseArr2 = []
          this.resourseArr3 = []
          this.showDialogResourse = false
          this.clearAllResourseSelect()
          this.input = ''
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
    // 角色管理-绑定-取消
    cancelBindResourse () {
      this.showDialogResourse = false
      this.clearAllResourseSelect()
      this.input = ''
      this.checkedResourse = []
    },
    // 选中的多选择框
    handleCheckedCResourseChange (val) {
      let num = this.iconPageName.indexOf(this.activeName)
      if (num === 0) {
        this.resourseArr1 = val
      }
      if (num === 1) {
        this.resourseArr2 = val
      }
      if (num === 2) {
        this.resourseArr3 = val
      }
    },
    filterResourse () {
    },
    handleCheckAllChange () {
    },
    // 页面菜单-页面按钮-页面操作切换
    handleClick (val) {
      this.activeName = val.$options.propsData.name
      if (this.activeName === '页面菜单') {
        this.checkedResourse = this.resourseArr1
      }
      if (this.activeName === '页面元素') {
        this.checkedResourse = this.resourseArr2
      }
      if (this.activeName === '页面操作') {
        this.checkedResourse = this.resourseArr3
      }
    },
    // 点击绑定
    showDialogRole (rowData) {
      this.userId = rowData.roleId
      let userId = rowData.roleId
      getResourceListPower({
        startNum: 1,
        range: 0
      })
        .then(res => {
          if (res.state === 1000) {
            this.bindResourse = res.data.resourceList
            let arr = []
            // 拿到页面菜单--页面按钮--页面操作
            this.bindResourse.forEach(ele => {
              arr.push(ele.label)
            })
            // 分页显示，默认显示第一个请求返回的第一类型作为默认显示的标签页
            this.iconPageName = arr
            // 默认激活第一标签栏,也就是页面菜单
            this.activeName = arr[0]
            this.showDialogResourse = true
            let data = {
              roleId: userId
            }
            getRoleResourceRelationPower(data)
              .then(res => {
                if (res.state === 1000) {
                  this.haveBindData = res.data.power
                  // 保存第一分页的已有权限
                  let arr1 = []
                  this.haveBindData.forEach(ele => {
                    if (ele.resourceTypeString === this.activeName) {
                      arr1.push(ele)
                    }
                  })
                  this.checkedResourse = []
                  arr1.forEach(ele => {
                    this.checkedResourse.push(ele.powerName + '(' + ele.powerDesc + ')')
                  })
                  this.resourseArr1 = []
                  this.resourseArr1 = this.checkedResourse
                  let arr2 = []
                  this.haveBindData.forEach(ele => {
                    if (ele.resourceTypeString === '页面元素') {
                      arr2.push(ele)
                    }
                  })
                  arr2.forEach(ele => {
                    this.resourseArr2.push(ele.powerName + '(' + ele.powerDesc + ')')
                  })

                  let arr3 = []
                  this.haveBindData.forEach(ele => {
                    if (ele.resourceTypeString === '页面操作') {
                      arr3.push(ele)
                    }
                  })
                  arr3.forEach(ele => {
                    this.resourseArr3.push(ele.powerName + '(' + ele.powerDesc + ')')
                  })
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
    closeDialogBindResourse (action) {
      if (action === 'close') {
        this.showDialogResourse = false
      }
      if (action === 'confirm') {
        let arr = []
        this.haveBindData.forEach(ele => {
          if (ele.powerId) {
            arr.push(ele.powerId)
          }
        })
        let powerIdList = arr.concat(this.powerIdArr)
        powerIdList = powerIdList.join(',')
        updateRoleResourceRelationPower({
          roleId: this.userId,
          powerIdList: powerIdList
        }).then(res => {
          if (res.state === 1000) {
            this.powerIdArr = []
            this.showDialogResourse = false
            setTimeout(() => {
              this.initTableRoleData()
            }, 500)
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
      }
    },
    handleNodeClick (data) {
      if (this.isSelectResourceName) {
        this.selectResourceType = data.label
      }
    },
    deleteBindResourse (index) {
      this.haveBindData.splice(index, 1)
    },
    openList (data) {
      this.selectResourceName = data.label
      setTimeout(() => {
        this.isSelectResourceName = true
      }, 100)
    },
    // 查询
    accordRoleSearch () {
      this.startNum = 1
      this.initTableRoleData()
    },
    addResourse () {
      if (this.selectResourceName !== this.selectResourceType && this.selectResourceName !== '' && this.selectResourceType !== '') {
        let arr = []
        this.haveBindData.forEach(ele => {
          arr.push(ele.powerName)
        })
        if (arr.indexOf(this.selectResourceType) === -1) {
          let result = this.bindResourse.find(ele => ele.label === this.selectResourceName)
          let res = result.children.find(ele => ele.label === this.selectResourceType)
          this.powerIdArr.push(res.powerId)
          this.haveBindData.push({
            powerName: this.selectResourceType,
            resourceTypeString: this.selectResourceName
          })
        } else {
          this.$message.error('已绑定该资源，请重新选择')
        }
      }
    },
    // 新增角色
    addNewRole () {
      this.showDialog.bol = true
      this.addOrEdit = 'new'
      this.title = '新增'
    },
    // 每页多少条
    rangeChange (val) {
      this.range = val
      this.initTableRoleData()
    },
    // 显示第几页数据
    startNumChange (val) {
      this.startNum = val
      this.initTableRoleData()
    },
    // 初始化列表
    initTableRoleData () {
      this.loading = true
      let _this = this
      let data = {
        roleName: this.roleName,
        startNum: this.startNum,
        range: this.range
      }
      getRolePower(data).then(res => {
        if (res.state === 1000) {
          _this.loading = false
          this.total = res.data.total
          this.tableData = res.data.role
        } else {
          setTimeout(() => {
            _this.error()
          }, 100)
        }
      }, rej => {
        setTimeout(() => {
          _this.error()
        }, 100)
      })
    },
    error () {
      this.loading = false
      this.$message({
        type: 'error',
        message: '读取失败',
        duration: 1000
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
    // 弹框时点击了灰色阴影处
    clickOther (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    },
    // 取消或者确定confirmEdit
    closeDialog (formName) {
      this.showDialog = {
        bol: false
      }
      this.ruleForm = {
        roleName: '',
        roleDesc: ''
      }
      this.$refs[formName].clearValidate()
    },
    // 新增资源确定
    submitForm1 (formName) {
      this.$refs[formName].validate(valid => {
        let _this = this
        if (valid) {
          let data = {
            roleName: this.ruleForm.roleName,
            roleDesc: this.ruleForm.roleDesc,
            roleState: 1
          }
          addRolePower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialog = {
                  bol: false
                }
                this.ruleForm = {
                  roleName: '',
                  roleDesc: ''
                }
                _this.$refs[formName].clearValidate()
                setTimeout(() => {
                  this.initTableRoleData()
                }, 500)
              } else if (res.state === 2023) {
                this.$message.error('角色名称已存在')
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
    // 编辑资源确定
    submitForm2 (formName) {
      this.$refs[formName].validate(valid => {
        let _this = this
        if (valid) {
          let data = {
            roleId: this.showDialog.roleId,
            roleName: this.ruleForm.roleName,
            roleDesc: this.ruleForm.roleDesc,
            roleState: 1
          }
          updateRolePower(data)
            .then(res => {
              if (res.state === 1000) {
                this.showDialog = {
                  bol: false
                }
                this.ruleForm = {
                  roleName: '',
                  roleDesc: ''
                }
                _this.$refs[formName].clearValidate()
                setTimeout(() => {
                  this.initTableRoleData()
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
    // 查看资源
    seeResourse (rowData) {
      getRoleResourceRelationPower({ roleId: rowData.roleId })
        .then(res => {
          if (res.state === 1000) {
            this.seeDialog.bol = true
            this.title1 = '已绑定资源'
            this.seeTableData = res.data.power
            this.seeTableDataTemp = this.seeTableData
          } else {
            this.error()
          }
        }, rej => {
          this.error()
        })
    },
    enter () {
      this.seeDialog.bol = false
      this.title1 = ''
    },
    accordResourseSearch () {
      if (this.powerName === '') {
        this.seeTableData = this.seeTableDataTemp
      } else {
        this.seeTableData = []
        this.seeTableDataTemp.forEach(ele => {
          if (ele.powerName === this.powerName) {
            this.seeTableData.push(ele)
          }
        })
      }
    },
    editRole (rowData) {
      this.addOrEdit = 'edit'
      this.showDialog = {
        bol: true,
        roleId: rowData.roleId
      }
      this.ruleForm = {
        roleName: rowData.roleName,
        roleDesc: rowData.roleDesc
      }
      this.title = '编辑'
    },
    deleteRole (rowData) {
      this.$confirm('这将移除当前角色对应用户的所有权限', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRolePower({
          roleId: rowData.roleId
        }).then(res => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initTableRoleData()
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
    }
  },
  created () {
    this.initTableRoleData()
  },
  watch: {
    data3 (val) {
      let arr = []
      val.forEach(ele => {
        arr.push(ele.elementId)
      })
      if (arr.indexOf(60029) > -1) {
        this.addButton = true
      } else {
        this.addButton = false
      }
      if (arr.indexOf(60030) > -1) {
        this.editButton = true
      } else {
        this.editButton = false
      }
      if (arr.indexOf(60031) > -1) {
        this.bindButton = true
      } else {
        this.bindButton = false
      }
      if (arr.indexOf(60032) > -1) {
        this.deleteButton = true
      } else {
        this.deleteButton = false
      }
      if (arr.indexOf(60036) > -1) {
        this.copyButton = true
      } else {
        this.copyButton = false
      }
    }
  }
}
</script>

<style scope>
.tableRoleApp {
  width: 1040px
}
.searchRole {
  width: 1040px;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #EBEEF5
}
.searchRole > .el-input {
  display: inline-block;
  width: 150px;
  height: 30px;
  margin-left: 30px
}
.searchRole > .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px
}
.searchRole > .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
  margin-left: 100px
}
.searchRole > .addNewRole {
  position: absolute;
  right: 20px;
  top: 13px
}
.tableRoleApp > .el-table {
  border-left: 1px solid #EBEEF5;
  width: 100%;
  height: 548px
}
.tableRoleApp > .el-table th, .tableRoleApp > .el-table tr {
  background-color: rgb(56, 53, 53);
}
.tableRoleApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th{
  border-right: 1px solid #EBEEF5
}
.tableRoleApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th > div {
  color: rgb(245, 231, 231)
}
.tableRoleApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:nth-last-of-type(2) {
  border-right-width: 0px
}
.tableRoleApp > .el-table > .el-table__body-wrapper {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr {
  height: 50px;
  border-bottom-width: 0px;
  cursor: pointer
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(odd) {
  background-color: #fff
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(even) {
  background-color: rgba(231, 228, 228, 0.884)
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 0px;
  border-right: 1px solid #EBEEF5
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:last-of-type {
  border-right-width: 0px
}
.tableRoleApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td > div {
  padding: 0px
}
.tableRoleApp > .pagination {
  margin-top: 20px
}
.tableRoleApp > .seeResourse {
  width: 100%;
  overflow: hidden;
  margin: 0 auto
}
.tableRoleApp > .seeResourse > .el-dialog {
  width: 100%;
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .search > .el-input {
  width: 150px;
  height: 30px
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .search > .el-input > .el-input__inner {
  line-height: 30px;
  height: 30px
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .search > .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
  margin-left: 50px
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .el-table {
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  margin-top: 20px;
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type {
  border-right: 1px solid #DCDFE6
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6
}
.tableRoleApp > .seeResourse > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper {
  min-height: 144px;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden
}
.tableRoleApp > .bindResourse > .el-dialog {
  width: 900px;
  height: 600px;
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body {
  width: 860px;
  padding: 0;
  margin: 0 auto
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab {
  width: 860px;
  height: 490px;
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__header{
  margin: 0
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content{
  width: 858px;
  height: 448px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden;
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane {
  width: 858px;
  height: 448px;
}

.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable {
  position: relative;
  width: 100%;
  height: 100%;
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable > .search {
  position: absolute;
  top: 30px
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable > .search > .el-input {
  width: 200px;
  margin-left: 50px
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable > .checkBox {
  position: absolute;
  top: 100px;
  left: 50px
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable > .checkBox > .el-checkbox-group {
  width: 808px;
  height: 310px;
  overflow-y: auto;
  overflow-x: hidden;
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .bindResourseTab > .el-tabs__content > .el-tab-pane > .checkBoxTable > .checkBox > .el-checkbox-group > .el-checkbox {
  width: 20%;
  margin-right: 30px;
  margin-bottom: 20px
}
.tableRoleApp > .bindResourse > .el-dialog > .el-dialog__body > .button {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end
}
.tableRoleApp > .addRoleOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item {
  margin-bottom: 40px
}
.tableRoleApp > .addRoleOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-input {
  width: 395px
}
.tableRoleApp > .addRoleOrEdit > .el-dialog {
  width: 550px;
  position: relative
}
.tableRoleApp > .addRoleOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-button:nth-of-type(2) {
  position: absolute;
  right: 16px
}
.tableRoleApp > .addRoleOrEdit > .el-dialog > .el-dialog__body > .el-form > .el-form-item > .el-form-item__content > .el-button:nth-of-type(1) {
  position: absolute;
  right: 120px
}
</style>
