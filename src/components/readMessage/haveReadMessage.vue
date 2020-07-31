<template>
  <div class="haveReadMessage">
    <div class="search">
      <!-- 选项1 -->
      <el-select v-model="value1" clearable placeholder="请选择消息类型">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- 选项2 -->
      <el-select v-model="value2" clearable placeholder="请选择消息来源">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- 搜索 -->
      <el-button type="primary" @click="searchData">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" @cell-mouse-enter="mouseIn">
      <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
      <el-table-column prop="messageSource" label="消息来源" align="center"></el-table-column>
      <el-table-column prop="messageType" label="消息类型" align="center"></el-table-column>
      <el-table-column prop="context" label="消息内容" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page.sync="startNum"
                   :page-sizes="[5, 10, 20]"
                   :page-size="range"
                   :total="total"
                   layout="total, sizes, prev, pager, next"
                   @size-change="rangeChange"
                   @current-change="startNumChange">
    </el-pagination>
  </div>
</template>

<script>
import { getAllMessage } from '../../api/api'
export default {
  data () {
    return {
      value1: '',
      options1: [
        {
          label: '流程',
          value: 1
        }, {
          label: '错误',
          value: 2
        }, {
          label: '告警',
          value: 3
        }, {
          label: '私信',
          value: 4
        }
      ],
      value2: '',
      options2: [
        {
          label: '项目',
          value: 1
        }, {
          label: '版本',
          value: 2
        }, {
          label: '用例',
          value: 3
        }, {
          label: '任务',
          value: 4
        }, {
          label: '缺陷',
          value: 5
        }, {
          label: '系统',
          value: 6
        }, {
          label: '外源',
          value: 7
        }, {
          label: '人工',
          value: 8
        }
      ],
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0
    }
  },
  methods: {
    initData () {
      getAllMessage({
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        readType: 1,
        messageType: this.value1,
        messageSource: this.value2,
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.messages
          this.total = res.data.total
        }
      })
    },
    searchData () {
      this.initData()
    },
    rangeChange (range) {
      this.range = range
      this.startNum = 1
      this.initData()
    },
    startNumChange (startNum) {
      this.startNum = startNum
      this.initData()
    },
    mouseIn (row, column, cell) {
      cell.style.cursor = 'pointer'
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="scss">
.haveReadMessage {
  .search {
    position: relative;
    .el-select:nth-of-type(2) {
      margin-left: 50px
    }
    .el-button {
      position: absolute;
      right: 0px
    }
  }
  .el-table {
    margin-top: 20px
  }
  .el-pagination {
    margin-top: 20px
  }
}
</style>
