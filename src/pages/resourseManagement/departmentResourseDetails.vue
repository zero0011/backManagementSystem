<template>
  <div class="departmentResDet">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/resourseManagement' }">资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门人力明细</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <body>
      <el-select v-model="value" placeholder="请选择" @change='getDepartment'>
        <el-option
          v-for="dep in deps"
          :key="dep.value"
          :label="dep.label"
          :value="dep.value">
        </el-option>
      </el-select>
      <el-tabs type="border-card">
        <el-tab-pane label="部门人力明细">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ depName }}</span>
            </div>
            <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
              <el-table-column prop="userName" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="accountName" label="域账户名" align="center" width="220"></el-table-column>
              <el-table-column prop="amount1" label="参与项目" align="center"></el-table-column>
              <el-table-column prop="amount2" label="人力值" align="center" width="80"></el-table-column>
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
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </body>
  </div>
</template>

<script>
import { getAllDepartment, getParticipantProjectDetailByDepartment } from '../../api/api'
export default {
  data () {
    return {
      deps: [],
      value: '',
      tableData: [
        // {
        //   userName: '周午超',
        //   accountName: 'wuchao.zhou',
        //   amount1: 'IPC-Turnkey',
        //   amount2: '0.2',
        //   length: 4
        // }, {
        //   userName: '',
        //   accountName: '',
        //   amount1: '韩国ADT CAPS销售项目',
        //   amount2: '0.1'
        // }, {
        //   userName: '',
        //   accountName: '',
        //   amount1: '小米智能摄像头',
        //   amount2: '0.4'
        // }, {
        //   userName: '',
        //   accountName: '',
        //   amount1: 'SKT TView Integration销售项目',
        //   amount2: '0.5'
        // }, {
        //   userName: '徐新宇',
        //   accountName: 'xinyu.xu',
        //   amount1: 'X2J2平台方案',
        //   amount2: '0.5',
        //   length: 2
        // }, {
        //   userName: '',
        //   accountName: '',
        //   amount1: 'X2AJ2A',
        //   amount2: '0.5'
        // }
      ],
      depName: '',
      startNum: 1,
      total: 0,
      range: 10
    }
  },
  methods: {
    startNumChange (startNum) {
      // console.log(startNum)
      this.startNum = startNum
      this.getStaffProject(this.depName)
    },
    rangeChange (range) {
      // console.log(range)
      this.range = range
      this.getStaffProject(this.depName)
    },
    getDepartment (val) {
      this.depName = val
      this.startNum = 1
      this.getStaffProject(val)
      // console.log(val)
      // getAllStaffLoad({
      //   loadType: 1,
      //   personRealName: '',
      //   personAccountName: '',
      //   departmentName: val,
      //   departmentLevel: 2,
      //   projectName: '',
      //   startNum: 1,
      //   range: 5
      // }).then(res => {
      //   if (res.state === 1000) {
      //     this.depName = val
      //     console.log(res)
      //   }
      // })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 行信息
      console.log(row)
      // 列信息
      console.log(column)
      // 行索引
      console.log(rowIndex)
      // 列索引
      console.log(columnIndex)
      // 首先控制是哪一列
      if (columnIndex === 0) {
        // 其次控制哪一行，有名字就合并，长度为设置好得row.length，没名字就rowspan: 0,colspan: 0
        if (row.userName !== '') {
          return {
            rowspan: row.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 1) {
        if (row.accountName !== '') {
          return {
            rowspan: row.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getStaffProject (depName) {
      getParticipantProjectDetailByDepartment({
        // loadType: 1,
        // personRealName: '',
        // personAccountName: '',
        departmentName: depName,
        departmentLevel: 2,
        // projectName: '',
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.depName = depName
          let arr = []
          // console.log(res.data.staffLoad[0].details)
          this.total = res.data.staffLoad[0].total
          res.data.staffLoad[0].details.forEach(ele => {
            if (ele.projectNames.length > 1) {
              ele.projectNames.forEach((ele2, index) => {
                if (index === 0) {
                  arr.push({
                    userName: ele.personRealName,
                    accountName: ele.personAccountName,
                    amount1: ele2.name,
                    amount2: ele2.manpowerVal,
                    length: ele.projectNames.length
                  })
                } else {
                  arr.push({
                    userName: '',
                    accountName: '',
                    amount1: ele2.name,
                    amount2: ele2.manpowerVal
                  })
                }
              })
            } else if (ele.projectNames.length === 1) {
              arr.push({
                userName: ele.personRealName,
                accountName: ele.personAccountName,
                amount1: ele.projectNames[0].name,
                amount2: ele.projectNames[0].manpowerVal,
                length: 1
              })
            } else {
              arr.push({
                userName: ele.personRealName,
                accountName: ele.personAccountName,
                amount1: '',
                amount2: '',
                length: 1
              })
            }
          })
          // console.log(arr)
          this.tableData = arr
        }
      })
    },
    // getDefaultDep () {
    //   console.log()
    // },
    getAllDep () {
      getAllDepartment({})
        .then(res => {
          this.deps = res.data.departments.map(ele => {
            return {
              value: ele.name,
              label: ele.name
            }
          })
          this.value = this.deps[0].value
          this.getStaffProject(this.deps[0].value)
          // this.depName = this.deps[0].value
        })
    }
  },
  created () {
    this.getAllDep()
    // this.getDefaultDep()
  }
}
</script>

<style>
.departmentResDet {
  width: 100%;
}
.departmentResDet > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.departmentResDet > .header > .breadcrumb {
  margin-left: 10px
}
.departmentResDet > body {
  width: 1190px;
  margin: 10px auto;
  position: relative
}
.departmentResDet > body > .el-select {
  z-index: 9999;
  float: right;
  margin-top: 5px;
  margin-right: 15px
}
.departmentResDet > body > .el-tabs .el-tabs__item {
  height: 50px;
  line-height: 50px
}
.departmentResDet .pagination {
  margin-top: 10px
}
.departmentResDet .pagination > .el-pagination {
  padding-left: 0px
}
</style>
