<template>
  <div class="editHistory">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>年度项目投入修改历史</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="version" label="版本" align="center"></el-table-column>
        <el-table-column prop="user" label="操作人员" align="center"></el-table-column>
        <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
        <el-table-column prop="action" label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="primary" @click="recoverRecord(scope.row)">恢复</el-button> -->
            <el-button type="primary" @click="seeRecord(scope.row)">查看</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <footer><el-button type="primary" @click="returnToLastPage">返回</el-button></footer>
  </div>
</template>

<script>
import { getHistoryInputData, recoverHistory } from '../api/api'
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    initData () {
      // this.tableData = [
      //   {
      //     historyId: 1000,
      //     version: 'v1',
      //     user: '周午超',
      //     createTime: '2020-04-23 12:00:00'
      //   }, {
      //     historyId: 1001,
      //     version: 'v2',
      //     user: '徐新宇',
      //     createTime: '2020-04-23 12:00:00'
      //   }, {
      //     historyId: 1002,
      //     version: 'v3',
      //     user: '鲍玲',
      //     createTime: '2020-04-23 12:00:00'
      //   }
      // ]
      getHistoryInputData({}).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.history
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    netError () {
      this.$message.error('网络错误!')
    },
    recoverRecord (rowData) {
      recoverHistory({
        historyId: rowData.historyId
      }).then(res => {
        if (res.state === 1000) {
          this.$message.success('恢复成功')
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    seeRecord (rowData) {
      this.$router.push({
        // path: '/annualProjectInvestment',
        path: '/roughHistory',
        query: {
          historyId: rowData.historyId,
          isHistory: true
        }
      })
    },
    returnToLastPage () {
      this.$router.push({
        path: '/annualProjectInvestment'
      })
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="scss">
.editHistory {
  width: 100%;
  > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    > .breadcrumb {
      margin-left: 10px
    }
  }
  > .body {
    width: 1188px;
    margin: 20px auto
  }
  > footer {
    width: 1188px;
    margin: 20px auto;
    text-align: center;
  }
}
</style>
