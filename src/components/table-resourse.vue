<template>
  <div class="tableResourseApp">
    <div class="searchResourseApp">
      <el-input placeholder="资源名称" v-model.trim="resourseName" clearable></el-input>
      <el-input placeholder="资源类型" v-model.trim="resourseType" clearable></el-input>
      <el-button type="primary" @click="getsearch">查询</el-button>
      <el-button type="primary" @click="addNewResourse" class="addnewteam" v-if="addButton">新增资源</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" empty-text cell-click="aaa" class="aaa">
      <el-table-column prop="powerId" label="资源ID" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="powerName" label="资源名称" width="100" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="resourceTypeString" label="资源权限类型" width="200" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="powerDesc" label="资源描述" width="200" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="190" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="editPower(scope.row)" type="text" v-if="editButton">编辑</el-button>
          <el-button type="text" size="small" @click="deletePower(scope.row.powerId)" v-if="deleteButton">删除</el-button>
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
    <!-- 资源弹层 -->
    <el-dialog :title="showDialog.dialogName" :visible.sync="showDialog.bol">
      <el-form v-if="showDialog.bol" label-width="100px" :rules="rules" ref="ruleForm" :model="showDialog.data">
        <el-form-item label="资源名称" :label-width="showDialog.formLabelWidth"  prop="powerName">
          <el-input v-model="showDialog.data.powerName" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源描述" :label-width="showDialog.formLabelWidth">
          <el-input v-model="showDialog.data.powerDesc" placeholder="请输入资源描述"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceType">
          <el-select v-model="showDialog.data.resourceType" placeholder="请选择资源类型">
            <el-option label="页面菜单" value="1"></el-option>
            <el-option label="页面元素" value="2"></el-option>
            <el-option label="页面操作" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面ID" :label-width="showDialog.formLabelWidth" prop="resourcePageId">
          <el-input v-model="showDialog.data.resourcePageId" placeholder="请输入页面ID"></el-input>
        </el-form-item>
        <el-form-item label="元素ID" :label-width="showDialog.formLabelWidth" prop="elementId">
          <el-input v-model="showDialog.data.elementId" placeholder="请输入元素ID"></el-input>
        </el-form-item>
        <el-form-item label="区域ID" :label-width="showDialog.formLabelWidth" prop="areaId">
          <el-input v-model="showDialog.data.areaId" placeholder="请输入区域ID"></el-input>
        </el-form-item>
        <el-form-item label="资源级别" :label-width="showDialog.formLabelWidth" prop="resourceLevel">
          <el-select v-model="showDialog.data.resourceLevel" placeholder="请选择资源级别">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单ID" :label-width="showDialog.formLabelWidth"  prop="fatherId">
          <el-input v-model="showDialog.data.fatherId" placeholder="请输入父级菜单ID"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialog('close')">取 消</el-button>
        <el-button type="primary" @click="submitDialog('update','ruleForm')" v-if="showDialog.editConfirm">确 定</el-button>
        <el-button type="primary" @click="submitDialog('submit','ruleForm')" v-if="showDialog.newConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getPowerPower, addPower, updatePower, deletePower } from '../api/api'
export default {
  props: ['data4'],
  data () {
    return {
      addButton: false,
      editButton: false,
      deleteButton: false,
      startNum: 1,
      range: 10,
      total: 0,
      status: true,
      cut: true,
      resourseName: '',
      resourseType: '',
      showDialog: {
        bol: false,
        editConfirm: false,
        newConfirm: false,
        dialogName:'资源',
        formLabelWidth: '100px',
        data: {
          powerName: '',
          powerDesc: '',
          resourceType: '',
          resourcePageId: '',
          elementId: '',
          areaId: '',
          resourceLevel: '',
          fatherId: ''
        }
      },
      rules: {
        powerName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 1, max: 8, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        resourcePageId: [
          { required: true, message: '请输入页面id', trigger: 'blur'},
          { min: 1, max: 8, message: '输入字符长度不合法', trigger: 'blur'}
        ],
        elementId: [
          { required: true, message: '请输入元素id', trigger: 'blur' },
          { min: 1, max: 8, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请输入区域id', trigger: 'blur' },
          { min: 1, max: 8, message: '输入字符长度不合法', trigger: 'blur'}
        ],
        resourceLevel: [
          { required: true, message: '请选择资源级别', trigger: 'change' }
        ],
        fatherId: [
          { min: 1, max: 8, message: '输入字符长度不合法', trigger: 'blur'}
        ]
      },
      tableData: []
    }
  },
  methods: {
    // 删除
    showDialogUserTeam () {
    },
    // 点击第几页
    startNumChange (val) {
      this.startNum = val
      this.initTableData()
    },
    // 选择每页展示多少条数据
    rangeChange (val) {
      this.range = val
      this.initTableData()
    },
    // 点击查询获得查询的条件
    getsearch () {
      this.startNum = 1
      this.initTableData()
    },
    // 点击新增资源
    addNewResourse () {
      this.showDialog.bol = true
      this.showDialog.dialogName = '新增资源'
      this.showDialog.newConfirm = true
      this.showDialog.editConfirm = false
      this.showDialog.data = {
        powerName: '',
        powerDesc: '',
        resourceType: '',
        resourcePageId: '',
        elementId: '',
        areaId: '',
        resourceLevel: '',
        fatherId: ''
        }
    },
    // 点击dialog上的按钮
    submitDialog (action, ruleForm) {
      if (action === 'close') {
        this.showDialog.bol = false
      }
      if (action === 'submit') {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let param = this.showDialog.data
            addPower(param).then(res => {
              if (res.state === 1000) {
                this.$message.success('新增资源成功')
                this.showDialog.bol = false
                setTimeout(() => {
                  this.initTableData()
                }, 100)
              }else if(res.state === 4014){
                this.$message.error('参数值 fatherId 不能为空')
              } else if(res.state === 4019){
                this.$message.error(res.message)
              } else {
                this.$message.error('系统内部错误')
              }
              }, rej => {
                this.$message.error('请求超时');
              }).catch(() => {

                this.$message({
                  type:'info',
                  message:'处理不成功，已取消新增'
                })
              })
          } else {
            return false
          }
        })
      }
      if (action === 'update') {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let param = this.showDialog.data
            updatePower(param).then(res => {
              if (res.state === 1000) {
                this.$message.success('更新资源成功')
                this.showDialog.bol = false
                setTimeout(() => {
                  this.initTableData()
                }, 100)
              }else if(res.state === 4014){
                this.$message.error('参数值 fatherId 不能为空')
              }  else if(res.state === 4019){
                this.$message.error(res.message)
              } else {
                this.$message.error('系统内部错误')
              }
              }, rej => {
                this.$message.error('请求超时');
              }).catch(() => {

                this.$message({
                type: 'info',
                message: '处理不成功，已取消编辑'
                })
              })
          } else {
            return false
          }
        })
      }
    },

    initTableData () {
      let data = {
        powerName: this.resourseName,
        resourceTypeString: this.resourseType,
        startNum: this.startNum,
        range: this.range
      }
      getPowerPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.total = res.data.total
            this.tableData = res.data.power
          }
        })
    },
    editPower (rowData) {
      this.showDialog.newConfirm = false
      this.showDialog.editConfirm = true
      this.showDialog.dialogName = '编辑资源'

      this.showDialog.bol = true
      this.showDialog.data = {
        powerId: rowData.powerId,
        powerName: rowData.powerName,
        powerDesc: rowData.powerDesc,
        resourceType: rowData.resourceType + '',
        resourcePageId: rowData.resourcePageId + '',
        elementId: rowData.elementId + '',
        areaId: rowData.areaId + '',
        resourceLevel: rowData.resourceLevel + '',
        fatherId: rowData.fatherId + ''
      }
    },
    deletePower (powerId) {
      this.$confirm('这将移除所有绑定该资源的角色的权限', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePower({
          powerId: powerId
        }).then(res => {
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
          message: '处理不成功，已取消删除'
        })
      })
    }
  },
  created () {
    this.initTableData()
  },
  watch: {
    data4 (val) {
      let arr = []
      val.forEach(ele => {
        arr.push(ele.elementId)
      })
      if (arr.indexOf(60033) > -1) {
        this.addButton = true
      } else {
        this.addButton = false
      }
      if (arr.indexOf(60034) > -1) {
        this.editButton = true
      } else {
        this.editButton = false
      }
      if (arr.indexOf(60035) > -1) {
        this.deleteButton = true
      } else {
        this.deleteButton = false
      }
    }
  }
}
</script>

<style>
.tableResourseApp {
  width: 1040px;
}
.tableResourseApp > .searchResourseApp {
  width: 1040px;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #EBEEF5
}
.tableResourseApp > .searchResourseApp > .el-input {
  display: inline-block;
  width: 150px;
  height: 30px;
  margin-left: 30px
}
.tableResourseApp > .searchResourseApp > .el-input > .el-input__inner {
  height: 30px;
  line-height: 30px
}
.tableResourseApp > .searchResourseApp > .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
  margin-left: 100px
}
.tableResourseApp > .searchResourseApp > .addnewteam {
  position: absolute;
  right: 20px;
  top: 13px
}
.tableResourseApp > .el-table {
  border-left: 1px solid #EBEEF5
}
.tableResourseApp > .el-table th, .tableResourseApp > .el-table tr {
  background-color: rgb(56, 53, 53)
}
.tableResourseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th{
  border-right: 1px solid #EBEEF5
}
.tableResourseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th > div {
  color: rgb(245, 231, 231)
}
.tableResourseApp > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:nth-last-of-type(2) {
  border-right-width: 0px
}
.tableResourseApp > .el-table > .el-table__body-wrapper {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr {
  height: 50px;
  border-bottom-width: 0px;
  cursor: pointer
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(odd) {
  background-color: #fff
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr:nth-of-type(even) {
  background-color: rgba(231, 228, 228, 0.884)
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 0px;
  border-right: 1px solid #EBEEF5
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:last-of-type {
  border-right-width: 0px
}
.tableResourseApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td > div {
  padding: 0px
}
.tableResourseApp > .pagination {
  margin-top: 20px
}
</style>
