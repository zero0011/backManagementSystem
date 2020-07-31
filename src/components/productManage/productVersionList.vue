<template>
  <div class="productVersionList">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model.trim="versionName" placeholder="版本名称"></el-input>
      <el-input v-model.trim="createAccountName" placeholder="创建人域账号" :disabled="tabName === 'create'"></el-input>
      <div class="block">
        <el-date-picker v-model="searchTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="searchVersion" style="margin-left: 75px">查询</el-button>
      <el-button type="primary" @click="createVersion('create')" style="margin-left: 75px">创建版本</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="tableData" border style="margin-top: 20px">
      <el-table-column prop="versionName" label="版本名称" align="center" width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="versionDesc" label="版本描述"  align="center" width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center" width="99px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="99px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectName" label="所属项目" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creator" label="创建人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="testPeople" label="测试人员" align="center" width="77px" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="seeTestPeople(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="所属产品" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creationTime" label="创建时间" align="center" width="159px" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="jumpToCreateVersionForm(scope.row)" type="text" size="small">创建版本</el-button> -->
          <el-button @click="createVersion('edit', scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteVersion(scope.row)" type="text" size="small">删除</el-button>
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
    <!-- 查看测试人员 -->
    <el-dialog title="测试人员列表" :visible.sync="seeMoreUser" class="seeTestPeople">
      <el-table :data="seeTestPeopleData" style="width: 100%" border>
        <el-table-column prop="name" label="成员名称" style="width: 50%" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账号信息" style="width: 50%" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getProductVersionByParticipant, getProductVersionByCreator, getProductAllVersion, deleteVersionOfProduct, getVersionParticipantPower } from '../../api/api'
export default {
  props: {
    'tabName': {
      type: String,
      required: true
    }
  },
  data () {
    return {
      versionName: '',
      createAccountName: '',
      searchTime: ['', ''],
      canSearchTime: false,
      tableData: [
        // {
        //   id: 1001,
        //   versionName: '撒娇撒看见烧录卡介绍了喀军队卢卡斯的',
        //   versionDesc: '版本 v1.1的描述',
        //   projectName: '项目sasasasaSasaSasaSasASasa',
        //   productName: '产品111',
        //   accoutName: '张三(san.zhang)',
        //   startTime: '2019-08-01',
        //   endTime: '2019-08-20',
        //   creationTime: '2019-07-25 08:30:05'
        // }, {
        //   id: 1002,
        //   versionName: 'v1.2',
        //   versionDesc: '版本 v1.2的描述',
        //   projectName: '项目BBB',
        //   productName: '产品222',
        //   accoutName: '李四(si.li)',
        //   startTime: '2019-08-01',
        //   endTime: '2019-08-20',
        //   creationTime: '2019-07-25 08:30:05'
        // }
      ],
      range: 10,
      startNum: 1,
      total: 0,
      seeMoreUser: false,
      seeTestPeopleData: []
    }
  },
  methods: {
    seeTestPeople (rowData) {
      let data = {
        versionId: rowData.id
      }
      getVersionParticipantPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.seeTestPeopleData = res.data.participantList
            this.seeMoreUser = true
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    // tab栏切换清空所有数据
    clearSelection () {
      this.versionName = ''
      this.createAccountName = ''
      this.searchTime = ['', '']
      this.range = 10
      this.startNum = 1
      this.total = 0
    },
    dateChange (val) {
      if (val === null) {
        this.canSearchTime = true
      } else {
        this.canSearchTime = false
      }
    },
    startNumChange (val) {
      this.startNum = val
      this.initData()
    },
    rangeChange (val) {
      this.range = val
      this.startNum = 1
      this.initData()
    },
    deleteVersion (rowData) {
      this.$confirm('此操作将删除该产品的版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVersionOfProduct({
          versionId: rowData.id
        }).then(res => {
          if (res.state === 1000) {
            this.$message.success(res.message)
            setTimeout(() => {
              this.initData()
            })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除该产品的版本'
        })
      })
    },
    searchVersion () {
      this.startNum = 1
      this.initData()
    },
    createVersion (action, rowData) {
      if (action === 'edit') {
        this.$router.push({
          path: '/productCreateVersion',
          query: {
            action: '1',
            projectId: this.$route.query.projectId,
            projectName: this.$route.query.projectName,
            productName: rowData.productName,
            productId: this.$route.query.productId,
            startTime: rowData.startTime,
            endTime: rowData.endTime,
            versionId: rowData.id,
            versionName: rowData.versionName,
            versionDesc: rowData.versionDesc
          }
        })
      } else {
        this.$router.push({
          path: '/productCreateVersion',
          query: {
            action: '0',
            projectName: this.$route.query.projectName,
            projectId: this.$route.query.projectId,
            productName: this.$route.query.productName,
            productId: this.$route.query.productId
            // startTime: rowData.startTime,
            // endTime: rowData.endTime,
            // versionId: rowData.id,
            // versionName: rowData.versionName,
            // versionDesc: rowData.versionDesc
          }
        })
      }
    },
    initData () {
      let data = {}
      if (this.tabName === 'join') {
        if (this.canSearchTime) {
          data = {
            productId: this.$route.query.productId,
            accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            versionName: this.versionName,
            participantAccountName: this.createAccountName,
            startTime: '',
            endTime: '',
            startNum: this.startNum,
            range: this.range
          }
        } else {
          data = {
            productId: this.$route.query.productId,
            accountName: this.createAccountName,
            versionName: this.versionName,
            participantAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            startTime: this.searchTime[0],
            endTime: this.searchTime[1],
            startNum: this.startNum,
            range: this.range
          }
        }
        getProductVersionByParticipant(data)
          .then(res => {
            if (res.state === 1000) {
              this.tableData = res.data.versionList
              this.total = res.data.total
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误，请稍后再试！')
          })
      } else if (this.tabName === 'create') {
        if (this.canSearchTime) {
          data = {
            productId: this.$route.query.productId,
            creatorAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            versionName: this.versionName,
            // participantAccountName: this.createAccountName,
            startTime: '',
            endTime: '',
            startNum: this.startNum,
            range: this.range
          }
        } else {
          data = {
            productId: this.$route.query.productId,
            creatorAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            versionName: this.versionName,
            // participantAccountName: this.createAccountName,
            startTime: this.searchTime[0],
            endTime: this.searchTime[1],
            startNum: this.startNum,
            range: this.range
          }
        }
        getProductVersionByCreator(data)
          .then(res => {
            if (res.state === 1000) {
              this.tableData = res.data.versionList
              this.total = res.data.total
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误，请稍后再试！')
          })
      } else {
        if (this.canSearchTime) {
          data = {
            productId: this.$route.query.productId,
            // accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            versionName: this.versionName,
            accountName: this.createAccountName,
            startTime: '',
            endTime: '',
            startNum: this.startNum,
            range: this.range
          }
        } else {
          data = {
            productId: this.$route.query.productId,
            // accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            versionName: this.versionName,
            accountName: this.createAccountName,
            startTime: this.searchTime[0],
            endTime: this.searchTime[1],
            startNum: this.startNum,
            range: this.range
          }
        }
        getProductAllVersion(data)
          .then(res => {
            if (res.state === 1000) {
              this.tableData = res.data.versionList
              this.total = res.data.total
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误，请稍后再试！')
          })
      }
    }
  },
  created () {
    this.clearSelection()
    this.initData()
  }
  // watch: {
  //   tabName (newValue) {
  //     console.log(newValue)
  //   }
  // }
}
</script>

<style>
.productVersionList > .search {
  width: 100%
}
.productVersionList > .search > .el-input {
  width: 150px;
  margin-right: 50px
}
.productVersionList > .search > .block {
  display: inline-block;
  margin-right: 64px
}
</style>
