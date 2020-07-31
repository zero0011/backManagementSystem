<template>
  <div class="joinVersionApp">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model.trim="versionName" placeholder="版本名称"></el-input>
      <el-input v-model.trim="createAccountName" placeholder="创建人域账号" v-if="!(tabName === 'create')"></el-input>
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
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" @click="createVersion" v-if="!(tabName === 'all')">创建版本</el-button>
    </div>
    <!-- 列表宽度1157px，最大高度530px -->
    <el-table :data="tableData" border style="width: 100%" max-height="530" :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column prop="versionName" label="版本名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="versionDesc" label="版本描述" width="150" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectName" label="所属项目" width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creatorFullName" label="创建人" width="150" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="测试人员" width="80" align="center" show-overflow-tooltip v-if="tabName === 'create' || tabName === 'all'">
        <template slot-scope="scope">
          <el-button type="text" @click="seeTestPeople(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="277" align="center" sortable show-overflow-tooltip v-if="tabName === 'join'"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="177" align="center" sortable show-overflow-tooltip v-if="tabName === 'create' || tabName === 'all'"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
           <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editVersion(scope.row)" v-if="tabName === 'create' || tabName === 'all'">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteVersion(scope.row)" v-if="tabName === 'create' || tabName === 'all'">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="text" @click="editVersion(scope.row)" v-if="tabName === 'create' || tabName === 'all'">编辑</el-button>
          <el-button type="text" @click="deleteVersion(scope.row)" v-if="tabName === 'create' || tabName === 'all'">删除</el-button> -->
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
                   @current-change="startNumChange">
    </el-pagination>
    <!-- 查看测试人员 -->
    <el-dialog title="测试人员列表" :visible.sync="seeMoreUser" class="seeTestPeople">
      <el-table :data="seeTestPeopleData" style="width: 100%" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
        <el-table-column prop="name" label="成员名称" style="width: 50%" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账号信息" style="width: 50%" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getVersionByParticipantPower, getVersionByCreatorPower, getAllVersionPower, getVersionParticipantPower, deleteVersion } from '../../api/api'
export default {
  props: {
    'tabName': {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tableData: [],
      versionName: '',
      createAccountName: '',
      searchTime: '',
      startNum: 1,
      range: 10,
      total: 0,
      seeTestPeopleData: [],
      seeMoreUser: false
    }
  },
  methods: {

    deleteVersion (rowData) {
      console.log(rowData.versionId)
      this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          versionId: rowData.versionId
        }
        deleteVersion(data)
          .then(res => {
            if (res.state === 1000) {
              this.$message('版本删除成功')
              this.discriminate()
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除该版本'
        })
      })
    },

    discriminate () {
      if (this.searchTime === '') {
        this.searchTime = ['', '']
      }
      if (this.searchTime === null) {
        this.searchTime = ['', '']
      }
      this.initDataCreate({
        versionName: this.versionName,
        projectId: this.$route.query.projectId,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        startTime: this.searchTime[0],
        endTime: this.searchTime[1],
        startNum: this.startNum,
        range: this.range
      })
    },
    search () {
      this.startNum = 1
      this.discriminate()
    },
    createVersion () {
      this.$router.replace({
        path: '/createVersion',
        query: {
          from: this.tabName,
          action: '0',
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId
        }
      })
    },
    getTime (val) {
      if (val === null) {
        this.searchTime = ''
      } else {
        if (Date.parse(val[1]) - Date.parse(val[0]) > 3600 * 1000 * 24 * 90) {
          this.$message.error('时间范围不能超过三个月！')
          this.searchTime = ''
        } else {
          this.searchTime = val
        }
      }
    },
    seeTestPeople (rowData) {
      let data = {
        versionId: rowData.versionId
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
    editVersion (rowData) {
      this.$router.replace({
        path: '/createVersion',
        query: {
          from: this.tabName,
          action: '1',
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId,
          versionId: rowData.versionId,
          versionName: rowData.versionName,
          versionDesc: rowData.versionDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime
        }
      })
    },
    rangeChange (range) {
      this.range = range
      this.discriminate()
    },
    startNumChange (count) {
      this.startNum = count
      this.discriminate()
    },
    // 参与
    initDataJoin (data) {
      getVersionByParticipantPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.versionList
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    initDataCreate (data) {
      getVersionByCreatorPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.versionList
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    initDataAll (data) {
      getAllVersionPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.versionList
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    }
  },
  created () {
    this.discriminate()
  }
}
</script>

<style>
.joinVersionApp {
  width: 100%
}
.joinVersionApp > .search {
  width: 100%;
  position: relative
}
.joinVersionApp > .search > .el-input {
  width: 150px;
  margin-right: 20px
}
.joinVersionApp > .search > .block {
  display: inline-block;
  margin-right: 20px
}
.joinVersionApp > .search > .el-button:nth-last-of-type(2) {
  position: absolute;
  right: 118px
}
.joinVersionApp > .search > .el-button:nth-last-of-type(1) {
  position: absolute;
  right: 0px
}
.joinVersionApp > .el-table {
  margin-top: 10px
}
/* 标题 */
.joinVersionApp > .el-table > .el-table__header-wrapper > .el-table__header > .has-gutter > tr > th {
  padding: 8.5px 0px
}
.joinVersionApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 4.5px 0px
}
.joinVersionApp > .el-pagination {
  margin-top: 10px
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
  padding: 8.5px 0px
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 13px 0px
}
.el-dropdown{
  font-size: 24px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown-menu{
  width: 120px;
}
.el-table td{
  padding:15px 0;
}
</style>
