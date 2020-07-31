<template>
  <div class="HumanPipelineDataNew">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管道数据汇总</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <!-- 主体 -->
    <main>
      <div class="container">
        <el-tabs  type="border-card" style="width: 1188px;margin:0 auto">
          <el-tab-pane label="所有人员">
            <div class="top">
              <el-input v-model="departmentName" placeholder="部门名称"></el-input>
              <el-button type="primary">查询</el-button>
            </div>
            <!-- 所有人员 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>所有人员</span>
                <div class="selectButton">
                  <el-checkbox-group v-model="checkboxGroup1" @change="getCheckboxArr($event, 'all')">
                    <el-checkbox-button v-for="sel in selArr" :label="sel" :key="sel">{{ sel }}</el-checkbox-button>
                  </el-checkbox-group>
                </div>
              </div>
              <el-table :data="tableData1" border style="width: 100%">
                <el-table-column fixed prop="department" label="部门名称" width="200" align="center"></el-table-column>
                <!-- 在职 -->
                <el-table-column label="在职" width="700" align="center" v-if="show1">
                  <el-table-column prop="zaizhinanjing" label="南京" width="140" align="center"></el-table-column>
                  <el-table-column prop="zaizhibeijing" label="北京" width="140" align="center"></el-table-column>
                  <el-table-column prop="zaizhishenzhen" label="深圳" width="140" align="center"></el-table-column>
                  <el-table-column prop="zaizhishanghai" label="上海" width="140" align="center"></el-table-column>
                  <el-table-column prop="zaizhitotal" label="统计" width="140" align="center"></el-table-column>
                </el-table-column>
                <!-- 待入职 -->
                <el-table-column label="待入职" width="700" align="center" v-if="show2">
                  <el-table-column prop="dairuzhinanjing" label="南京" width="140" align="center"></el-table-column>
                  <el-table-column prop="dairuzhibeijing" label="北京" width="140" align="center"></el-table-column>
                  <el-table-column prop="dairuzhishenzhen" label="深圳" width="140" align="center"></el-table-column>
                  <el-table-column prop="dairuzhishanghai" label="上海" width="140" align="center"></el-table-column>
                  <el-table-column prop="dairuzhitotal" label="统计" width="140" align="center"></el-table-column>
                </el-table-column>
                <!-- 待招 -->
                <el-table-column label="待招" width="700" align="center" v-if="show3">
                  <el-table-column prop="daizhaonanjing" label="南京" width="140" align="center"></el-table-column>
                  <el-table-column prop="daizhaobeijing" label="北京" width="140" align="center"></el-table-column>
                  <el-table-column prop="daizhaoshenzhen" label="深圳" width="140" align="center"></el-table-column>
                  <el-table-column prop="daizhaoshanghai" label="上海" width="140" align="center"></el-table-column>
                  <el-table-column prop="daizhaototal" label="统计" width="140" align="center"></el-table-column>
                </el-table-column>
                <!-- 待离职 -->
                <el-table-column label="待离职" width="700" align="center" v-if="show4">
                  <el-table-column prop="dailizhinanjing" label="南京" width="140" align="center"></el-table-column>
                  <el-table-column prop="dailizhibeijing" label="北京" width="140" align="center"></el-table-column>
                  <el-table-column prop="dailizhishenzhen" label="深圳" width="140" align="center"></el-table-column>
                  <el-table-column prop="dailizhishanghai" label="上海" width="140" align="center"></el-table-column>
                  <el-table-column prop="dailizhitotal" label="统计" width="140" align="center"></el-table-column>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">历史记录</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>
<script>
// import { gestaffStatistics, getstaffHistoryList } from '../../api/api'
import { gestaffStatistics } from '../../api/api'
export default {
  data () {
    return {
      departmentName: '',
      checkboxGroup1: ['在职'],
      tempCheckboxGroup1: '',
      selArr: ['在职', '待入职', '待招', '待离职'],
      tableData1: [],
      show1: true,
      show2: false,
      show3: false,
      show4: false,
      status1: '1'
    }
  },
  methods: {
    // 获取所有数据
    initAllStaffData () {
      gestaffStatistics({
        staffType: 0,
        departmentName: '',
        status: this.status1,
        startNum: 1,
        range: 10
      }).then(res => {
        if (res.state === 1000) {
          console.log(res)
          console.log(this.tableData1 = res.data.staffStatistics.allStaff[0].statisticData.department)
          let depArr = []
          this.tableData1 = res.data.staffStatistics.allStaff.forEach(ele => {
            depArr.push(ele.statisticData.userType)
          })
          console.log(depArr)
          const index1 = depArr.indexOf('在职')
          const index2 = depArr.indexOf('待入职')
          const index3 = depArr.indexOf('待招')
          const index4 = depArr.indexOf('待离职')
          // let arr = [index1, index2, index3, index4]
          console.log(index1)
          if (index1 >= 0) {
            this.show1 = true
          } else {
            this.show1 = false
          }
          if (index2 >= 0) {
            this.show2 = true
          } else {
            this.show2 = false
          }
          if (index3 >= 0) {
            this.show3 = true
          } else {
            this.show3 = false
          }
          if (index4 >= 0) {
            this.show4 = true
          } else {
            this.show4 = false
          }
          let tableDataArr = []
          tableDataArr = res.data.staffStatistics.allStaff[0].statisticData.department.map(ele => {
            return {
              department: ele.name
            }
          })
          console.log(tableDataArr)
          // tableDataArr[0].zaizhinanjing = 44
          console.log(res.data.staffStatistics.allStaff)
          res.data.staffStatistics.allStaff.forEach((ele, index) => {
            if (ele.statisticData.userType === '在职') {
              ele.statisticData.department.forEach((ele2, index2) => {
                tableDataArr[index2].zaizhinanjing = ele2.detail.nanjing
                tableDataArr[index2].zaizhibeijing = ele2.detail.beijing
                tableDataArr[index2].zaizhishenzhen = ele2.detail.shenzhen
                tableDataArr[index2].zaizhishanghai = ele2.detail.shanghai
                tableDataArr[index2].zaizhitotal = ele2.detail.total
              })
            }
            if (ele.statisticData.userType === '待入职') {
              ele.statisticData.department.forEach((ele2, index2) => {
                tableDataArr[index2].dairuzhinanjing = ele2.detail.nanjing
                tableDataArr[index2].dairuzhibeijing = ele2.detail.beijing
                tableDataArr[index2].dairuzhishenzhen = ele2.detail.shenzhen
                tableDataArr[index2].dairuzhishanghai = ele2.detail.shanghai
                tableDataArr[index2].dairuzhitotal = ele2.detail.total
              })
              // tableDataArr[index].dairuzhinanjing = ele.statisticData.department[index].detail.nanjing
              // tableDataArr[index].dairuzhibeijing = ele.statisticData.department[index].detail.beijing
              // tableDataArr[index].dairuzhishenzhen = ele.statisticData.department[index].detail.shenzhen
              // tableDataArr[index].dairuzhishanghai = ele.statisticData.department[index].detail.shanghai
              // tableDataArr[index].dairuzhitotal = ele.statisticData.department[index].detail.total
            }
            if (ele.statisticData.userType === '待招') {
              ele.statisticData.department.forEach((ele2, index2) => {
                tableDataArr[index2].daizhaonanjing = ele2.detail.nanjing
                tableDataArr[index2].daizhaobeijing = ele2.detail.beijing
                tableDataArr[index2].daizhaoshenzhen = ele2.detail.shenzhen
                tableDataArr[index2].daizhaoshanghai = ele2.detail.shanghai
                tableDataArr[index2].daizhaototal = ele2.detail.total
              })
              // tableDataArr[index].daizhaonanjing = ele.statisticData.department[index].detail.nanjing
              // tableDataArr[index].daizhaobeijing = ele.statisticData.department[index].detail.beijing
              // tableDataArr[index].daizhaoshenzhen = ele.statisticData.department[index].detail.shenzhen
              // tableDataArr[index].daizhaoshanghai = ele.statisticData.department[index].detail.shanghai
              // tableDataArr[index].daizhaototal = ele.statisticData.department[index].detail.total
            }
            if (ele.statisticData.userType === '待离职') {
              ele.statisticData.department.forEach((ele2, index2) => {
                tableDataArr[index2].dailizhinanjing = ele2.detail.nanjing
                tableDataArr[index2].dailizhibeijing = ele2.detail.beijing
                tableDataArr[index2].dailizhishenzhen = ele2.detail.shenzhen
                tableDataArr[index2].dailizhishanghai = ele2.detail.shanghai
                tableDataArr[index2].dailizhitotal = ele2.detail.total
              })
              // tableDataArr[index].dailizhinanjing = ele.statisticData.department[index].detail.nanjing
              // tableDataArr[index].dailizhibeijing = ele.statisticData.department[index].detail.beijing
              // tableDataArr[index].dailizhishenzhen = ele.statisticData.department[index].detail.shenzhen
              // tableDataArr[index].dailizhishanghai = ele.statisticData.department[index].detail.shanghai
              // tableDataArr[index].dailizhitotal = ele.statisticData.department[index].detail.total
            }
          })
          this.tableData1 = tableDataArr
          console.log(this.tableData1)
          // this.tableData1 = res.data.staffStatistics.allStaff[0].statisticData.department.map(ele => {
          //   return {
          //     department: ele.name,
          //     zaizhinanjing: 9,
          //     zaizhibeijing: 0,
          //     zaizhishenzhen: 3,
          //     zaizhishanghai: 2,
          //     zaizhitotal: 14,

          //     dairuzhinanjing: ele.detail.nanjing,
          //     dairuzhibeijing: ele.detail.beijing,
          //     dairuzhishenzhen: ele.detail.shenzhen,
          //     dairuzhishanghai: ele.detail.shanghai,
          //     dairuzhitotal: ele.detail.total,

          //     daizhaonanjing: ele.detail.nanjing,
          //     daizhaobeijing: ele.detail.beijing,
          //     daizhaoshenzhen: ele.detail.shenzhen,
          //     daizhaoshanghai: ele.detail.shanghai,
          //     daizhaototal: ele.detail.total,

          //     dailizhinanjing: ele.detail.nanjing,
          //     dailizhibeijing: ele.detail.beijing,
          //     dailizhishenzhen: ele.detail.shenzhen,
          //     dailizhishanghai: ele.detail.shanghai,
          //     dailizhitotal: ele.detail.total
          //   }
          // })
        }
      })
    },
    // 在职，待入职，待招，待离职
    getCheckboxArr (arr, str) {
      if (arr.length === 1) {
        this.tempCheckboxGroup1 = arr[0]
      }
      if (arr.length === 0) {
        this.checkboxGroup1.splice(0, this.checkboxGroup1.length - 1)
        this.checkboxGroup1.push(this.tempCheckboxGroup1)
      }
      console.log(arr)
      let tempArr = []
      arr.forEach(ele => {
        if (ele === '在职') {
          tempArr.push(1)
          // this.show1 = true
        } else {
          // this.show1 = false
        }
        if (ele === '待入职') {
          tempArr.push(2)
          // this.show2 = true
        } else {
          // this.show2 = false
        }
        if (ele === '待招') {
          tempArr.push(3)
          // this.show3 = true
        } else {
          // this.show3 = false
        }
        if (ele === '待离职') {
          tempArr.push(4)
          // this.show4 = true
        } else {
          // this.show4 = false
        }
      })
      console.log(tempArr.join(';'))
      this.status1 = tempArr.join(';')
      console.log(str)
      if (str === 'all') {
        this.initAllStaffData()
      }
      // arr.forEach(ele => {
      //   if ()
      // })
    }
  },
  created () {
    this.initAllStaffData()
  }
}
</script>
<style>
.HumanPipelineDataNew > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.HumanPipelineDataNew > .header > .breadcrumb {
  margin-left: 10px
}

.HumanPipelineDataNew > main{
  margin-left: 37px;
  margin-right: 38px;
  margin-top: 15px
}
.HumanPipelineDataNew > main > .container  .top {
  margin-top: 20px;
  margin-bottom: 35px;
  position: relative
}
.HumanPipelineDataNew > main > .container  .top > .el-input {
  float: left;
  margin-left: 15px;
  width: 200px;
  margin-right: 50px;
}
.HumanPipelineDataNew > main > .container  .box-card {
  margin-top: 40px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 5px;
}
.HumanPipelineDataNew > main > .container  .box-card .el-card__body .cardName{
  position:relative;
  margin-left: 50px;
  top: 26px
}
.HumanPipelineDataNew > main > .container  .box-card > .el-card__header {
  padding: 5px 20px
}
.HumanPipelineDataNew > main > .container  .box-card > .el-card__body > .el-table th {
  padding: 20px 0px
}
.HumanPipelineDataNew > main > .container  .box-card > .el-card__body > .el-table td {
  padding: 20px 0px
}
.HumanPipelineDataNew .container .box-card .clearfix {
  display: flex;
  position: relative
  /* justify-content: center */
}
.HumanPipelineDataNew .container .box-card .clearfix > span {
  display: inline-block;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center
}
.HumanPipelineDataNew .container .box-card .clearfix > .selectButton {
  position: absolute;
  right: 20px
}
</style>
