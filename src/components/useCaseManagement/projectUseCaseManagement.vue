<template>
  <div class="projectUseCaseManagment">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ fromProject }}</el-breadcrumb-item>
        <el-breadcrumb-item>用例集</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card">
          <!-- 我参与的任务 -->
          <el-tab-pane :label="fromProject + '的用例集'">
            <div class="searchDiv">
              <el-input placeholder="用例集名称" v-model.trim="useCaseName"></el-input>
              <el-input placeholder="创建人域账号" v-model.trim="creator"></el-input>
              <div class="block">
                <el-date-picker
                  v-model="searchTime"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  @change="getTime"
                ></el-date-picker>
              </div>
              <el-button type="primary" @click="search">查询</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%;margin-top: 20px" :header-cell-style="{background:'rgb(250, 250, 250)'}">
              <el-table-column
                prop="caseSuiteName"
                label="用例集名称"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    @click="jumpToUseCaseLibrary(scope.row)"
                    type="text"
                    size="small"
                  >{{ scope.row.caseSuiteName }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="caseSuiteDesc" label="用例集描述" align="center"></el-table-column>
              <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
              <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
              <el-table-column prop="caseTotalNumber" label="案例数" align="center"></el-table-column>
              <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
            </el-table>
            <!-- <el-pagination :current-page.sync="startNum"
                           :page-sizes="[10, 20]"
                           :page-size="range"
                           :total="total"
                           layout="total, sizes, prev, pager, next"
                           @size-change="rangeChange"
                           @current-change="startNumChange"
                           style="margin-top: 10px">
            </el-pagination>-->
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>

<script>
import { getCaseSuite } from '../../api/api'
export default {
  data() {
    return {
      // 用来接收是从哪个项目跳转过来的
      fromProject: '',
      useCaseName: '',
      creator: '',
      searchTime: ['', ''],
      tableData: [],
      projectId: '',
      startNum: 1,
      range: 10,
      total: 0
    }
  },
  methods: {
    jumpToUseCaseLibrary(rowData) {
      this.$router.push({
        path: '/usecaselibrary',
        query: {
          behaviour: 'see',
          label: rowData.caseSuiteName,
          caseSuiteId: rowData.caseSuiteId,
          caseSuiteDesc: rowData.caseSuiteDesc,
          startTime: rowData.startTime,
          endTime: rowData.startTime,
          from: ''
        }
      })
    },
    startNumChange(val) {
      this.startNum = val
    },
    rangeChange(val) {
      this.range = val
    },
    search() {
      this.range = 10
      this.startNum = 1
      this.initData()
    },
    getTime(val) {
      if (val === null) {
        this.searchTime = ['', '']
      }
    },
    initData() {
      getCaseSuite({
        projectId: this.projectId,
        caseSuiteName: this.useCaseName,
        createAccountName: this.creator,
        startTime: this.searchTime[0],
        endTime: this.searchTime[1]
      }).then(res => {
        if (res.state === 1000) {
          this.total = res.data.total
          this.tableData = res.data.caseSuiteList
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    }
  },
  created() {
    this.fromProject = this.$route.query.name
    this.projectId = this.$route.query.projectId
    this.initData()
  }
}
</script>

<style>
.projectUseCaseManagment {
  width: 100%;
}
.projectUseCaseManagment > .header {
  width: 1188px;
  margin: 0 auto;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.projectUseCaseManagment > .header > .breadcrumb {
  margin-left: 10px;
}
.projectUseCaseManagment > main {
  width: 1190px;
  margin: 10px auto;
}
.projectUseCaseManagment > main .searchDiv > .el-input {
  width: 230px;
  margin-right: 70px;
}
.projectUseCaseManagment > main .searchDiv > .block {
  display: inline-block;
  margin-right: 120px;
}
</style>
