<template>
  <div class="notReadMessage">
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
    <el-table :data="tableData" border style="width: 100%" @row-click="getRow" @cell-mouse-enter="mouseIn">
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
import { getAllMessage, changeMessageStatus } from '../../api/api'
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
      total: 0,
      // 获取表格的所有行元素
      rowArr: []
    }
  },
  methods: {
    // 初始化数据
    initData () {
      getAllMessage({
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        readType: 0,
        messageType: this.value1,
        messageSource: this.value2,
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.messages
          this.total = res.data.total
          this.$store.commit('changeNoRead', res.data.total)
          if (res.data.total) {
            // 主动给每一行数据绑定index
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].index = i
              // true表示未读信息
              this.tableData[i].status = true
            }
            // 渲染完毕数据后改变所有的样式
            this.changeColor()
          }
        }
      })
    },
    // 蓝色，加粗
    changeColor () {
      this.$nextTick(() => {
        this.rowArr = Array.from(document.getElementsByClassName('el-table__row'))
        this.rowArr.forEach(ele => {
          ele.style.color = '#409EFF'
          ele.style.fontWeight = '700'
        })
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
    // 点击当前行获取当前行的index值
    getRow (row) {
      // 如果状态为true表示未读，点击事件之后变为false表示已读
      if (row.status) {
        changeMessageStatus(row.messageId)
          .then(res => {
            if (res.state === 1000) {
              this.rowArr[row.index].style.color = '#000'
              this.rowArr[row.index].style.fontSize = 'normal'
              this.tableData[row.index].status = false
              this.$store.commit('miniusNoRead', this.tableData.length)
            }
          })
      }
    },
    // 鼠标进入表格内部
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
.notReadMessage {
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
