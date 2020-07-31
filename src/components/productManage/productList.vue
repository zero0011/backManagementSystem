<template>
  <div class="productList">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card">
          <!-- 我参与的项目 -->
          <el-tab-pane :label="labelName + '项目的产品列表'">
            <div class="tableList">
              <!-- 搜索 -->
              <div class="search">
                <el-input v-model.trim="productName" placeholder="产品名称"></el-input>
                <el-input v-model.trim="productManager" placeholder="产品经理域账号"></el-input>
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
                <el-button type="primary" @click="searchProduct" style="margin-left: 75px">查询</el-button>
                <el-button type="primary" @click="createProduct('create')" style="margin-left: 75px">创建产品</el-button>
              </div>
              <!-- 列表 -->
              <el-table :data="tableData" border style="margin-top: 20px" :header-cell-style="{background:'rgb(250, 250, 250)'}">
                <el-table-column fixed prop="productName" label="产品名称" align="center" width="200px" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button @click="jumpToProductVersion(scope.row)" type="text" size="small">{{ scope.row.productName }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="productDesc" label="产品描述"  align="center" width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productManager" label="产品经理"  align="center" width="159px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="159px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="159px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="creationTime" label="创建时间" width="159px" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="jumpToProductCreateVersion(scope.row)" type="text" size="small">创建版本</el-button>
                    <el-button @click="createProduct('edit', scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteProduct(scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination :current-page.sync="startNum"
                             :page-sizes="[5, 10, 20]"
                             :page-size="range"
                             :total="total"
                             layout="total, sizes, prev, pager, next"
                             @size-change="rangeChange"
                             @current-change="startNumChange"
                             style="margin-top: 20px">
              </el-pagination>
              <!-- 弹窗创建产品 -->
              <el-dialog :title="title" :visible.sync="dialogFormVisible" :show-close="showClose">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="ruleForm.productName" placeholder="长度限制20个字符"></el-input>
                  </el-form-item>
                  <el-form-item label="产品描述" prop="productDesc">
                    <el-input v-model="ruleForm.productDesc"></el-input>
                  </el-form-item>
                  <el-form-item label="产品经理" prop="productManager">
                    <el-input v-model="ruleForm.productManager"></el-input>
                  </el-form-item>
                  <el-form-item label="时间选择" prop="dateRange">
                    <el-date-picker v-model="ruleForm.dateRange"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    @change="dateChange">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">{{ buttonName }}</el-button>
                    <el-button type="primary" @click="cancelForm('ruleForm')">取消</el-button>
                    <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                  </el-form-item>
                </el-form>
              </el-dialog>
            </div>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import { getProductList, addProduct, updateProduct, deleteproduct } from '../../api/api'
export default {
  data () {
    return {
      // 显示项目的名称
      labelName: '',
      productId: '',
      productName: '',
      productManager: '',
      searchTime: ['', ''],
      canSearchTime: false,
      range: 10,
      startNum: 1,
      total: 0,
      tableData: [],
      title: '',
      dialogFormVisible: false,
      ruleForm: {
        productName: '',
        productDesc: '',
        productManager: '',
        dateRange: ''
      },
      rules: {
        productName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个汉字', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      showClose: false,
      buttonName: '创建'
    }
  },
  methods: {
    // 操作的创建版本
    jumpToProductCreateVersion (rowData) {
      this.$router.push({
        path: '/productCreateVersion',
        query: {
          action: '0',
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId,
          productName: rowData.productName,
          productId: rowData.productId
        }
      })
    },
    // 产品名称
    jumpToProductVersion (rowData) {
      this.$router.push({
        path: '/productVersion',
        query: {
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId,
          productName: rowData.productName,
          productId: rowData.productId
        }
      })
    },
    cancelForm () {
      this.$refs.ruleForm.resetFields()
      setTimeout(() => {
        this.dialogFormVisible = false
      })
    },
    dateChange (val) {
      // console.log(val)
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    deleteProduct (rowData) {
      this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
        deleteproduct({
          productId: rowData.productId
        }).then(res => {
          if (res.state === 1000) {
            this.$message.success(res.message)
            setTimeout(() => {
              this.productName = ''
              this.productManager = ''
              this.searchTime = ['', '']
              this.range = 10
              this.startNum = 1
              this.total = 0
              this.initData()
            })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
      }).catch(() => {
      })
    },
    // 创建产品或者编辑
    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 创建成功后恢复回复初始值重新渲染列表数据
          if (this.buttonName === '创建') {
            addProduct({
              productName: this.ruleForm.productName,
              productDesc: this.ruleForm.productDesc,
              productManager: this.ruleForm.productManager,
              creatorAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              projectId: this.$route.query.projectId,
              startTime: this.ruleForm.dateRange[0],
              endTime: this.ruleForm.dateRange[1]
            }).then(res => {
              if (res.state === 1000) {
                this.$message.success(res.message)
                setTimeout(() => {
                  this.productName = ''
                  this.productManager = ''
                  this.searchTime = ['', '']
                  this.range = 10
                  this.startNum = 1
                  this.total = 0
                  this.initData()
                })
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误，请稍后再试！')
            })
          } else {
            updateProduct({
              id: this.productId,
              productName: this.ruleForm.productName,
              productDesc: this.ruleForm.productDesc,
              productManager: this.ruleForm.productManager,
              // creatorAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              // projectId: this.$route.query.projectId,
              startTime: this.ruleForm.dateRange[0],
              endTime: this.ruleForm.dateRange[1]
            }).then(res => {
              if (res.state === 1000) {
                this.$message.success(res.message)
                setTimeout(() => {
                  this.productId = ''
                  this.productName = ''
                  this.productManager = ''
                  this.searchTime = ['', '']
                  this.range = 10
                  this.startNum = 1
                  this.total = 0
                  this.initData()
                })
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误，请稍后再试！')
            })
          }
          this.$refs.ruleForm.resetFields()
          setTimeout(() => {
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    searchProduct () {
      this.initData()
    },
    rangeChange (val) {
      this.range = val
      this.startNum = 1
      this.initData()
    },
    startNumChange (val) {
      this.startNum = val
      this.initData()
    },
    createProduct (action, rowData) {
      if (action === 'create') {
        this.title = '创建产品'
        this.buttonName = '创建'
      } else {
        this.title = '编辑产品'
        this.buttonName = '更新'
        this.ruleForm = {
          productName: rowData.productName,
          productDesc: rowData.productDesc,
          productManager: rowData.productManager,
          dateRange: [rowData.startTime, rowData.endTime]
        }
        this.productId = rowData.productId
      }
      this.dialogFormVisible = true
    },
    getTime (val) {
      if (val === null) {
        this.canSearchTime = true
      } else {
        this.canSearchTime = false
      }
    },
    initData () {
      let data = {}
      if (this.canSearchTime) {
        data = {
          projectId: this.$route.query.projectId,
          productName: this.productName,
          productManager: this.productManager,
          startTime: '',
          endTime: '',
          startNum: this.startNum,
          range: this.range
        }
      } else {
        data = {
          projectId: this.$route.query.projectId,
          productName: this.productName,
          productManager: this.productManager,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          startNum: this.startNum,
          range: this.range
        }
      }
      getProductList(data)
        .then(res => {
          if (res.state === 1000) {
            this.total = res.data.total
            this.tableData = res.data.productList
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
    }
  },
  created () {
    this.labelName = this.$route.query.projectName
    this.initData()
  }
}
</script>

<style>
.productList {
  width: 100%
}
.productList > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.productList > .header > .breadcrumb {
  margin-left: 10px
}
.productList > main {
  width: 1190px;
  margin: 0 auto;
  margin-top: 10px;
}
.productList .tableList > .search {
  width: 100%
}
.productList .tableList > .search > .el-input {
  width: 150px;
  margin-right: 50px
}
.productList .tableList > .search > .block {
  display: inline-block;
  margin-right: 64px
}
</style>
