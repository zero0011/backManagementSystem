<template>
  <div class="historyDataDetails">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/dataStatistics' }">资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>历史数据明细</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main class="body" v-loading="loading" element-loading-text="正在生成中">
        <!-- 标签页 -->
        <el-button type="primary"  class="confirm" @click="queryByTime">查询</el-button>
         <el-date-picker
            class="time1"
            v-model="endDate"
            @change="endDateChange"
            type="week"
            value-format="yyyy-MM-dd"
            format="yyyy 第 WW 周"
            unlink-panels
            placeholder="选择结束周">
         </el-date-picker>
         <el-date-picker
            class="time2"
            v-model="startDate"
            @change="startDateChange"
            type="week"
            value-format="yyyy-MM-dd"
            format="yyyy 第 WW 周"
            unlink-panels
            placeholder="选择开始周">
         </el-date-picker>
         <el-button type="primary"  class="out" @click="getExcel">导出</el-button>
        <el-tabs type="border-card">
         <el-tab-pane label="数据明细">
                <el-card class="box-card">

                  <el-table :data="tableData" border style="width: 100%" @filter-change="handleFilterChange" class="table">
                     <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                     <el-table-column prop="accountName" label="用户名" align="center" show-overflow-tooltip></el-table-column>
                     <el-table-column  label="参与项目" align="center" :filters="projectArr" :filter-multiple=false column-key="project" height:500px>
                        <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                           <p>全部项目: {{ scope.row.allProjectName }}</p>
                           <div slot="reference" class="name-wrapper">
                              <el-tag size="medium">{{ scope.row.projectName[0] }}</el-tag>
                           </div>
                        </el-popover>
                        </template>                       
                     </el-table-column>
                     <el-table-column prop="manPowerSum" label="投入值" align="center" :filters="manInPutArr" :filter-multiple=false column-key="manPowerSum"></el-table-column>
                     <el-table-column prop="department" label="部门" align="center" :filters="departmentArr" :filter-multiple=false column-key="department"></el-table-column>
                     <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                     <el-table-column prop="area" label="地区" align="center" :filters="areaArr" :filter-multiple=false column-key="area"></el-table-column>
                     <el-table-column prop="userTyPe" label="人员类型" align="center" :filters="userTypeArr" :filter-multiple=false column-key="userType"></el-table-column>
                     <el-table-column prop="staticTime" label="统计时间" align="center"></el-table-column>
                     <el-table-column prop="weeks" label="周数" align="center"></el-table-column>
                     <el-table-column prop="positionStatus" label="在岗状态" align="center"></el-table-column>
               </el-table>
              <!-- 分页 -->
              <el-pagination :current-page.sync="startNum"
              :page-sizes="[5, 10, 20]"
              :page-size= range
              :total= total
              layout="total, sizes, prev, pager, next"
              @size-change="rangeChange"
              @current-change="startNumChange">
              </el-pagination>

              <!-- 下载报告 -->
              <el-dialog title="下载报告" :visible.sync="dialogDownLoad" class="dialogDownLoad">
                <div style="text-align: center">
                  <el-button type="primary"><a :href="downLoadPath" download="模板.xlsx" style="text-decoration: none;color: #fff">下载</a></el-button>
                </div>
              </el-dialog>              
            </el-card>
          </el-tab-pane>
        </el-tabs>
    </main>



  </div>
</template>

<script>
import {getAllDepartment,getAllProjectList,getUserStaticsInfo,exportUserResource} from  '../api/api'
export default {
    data () {
        return {
            startDate: '',
            endDate: '',
            tableData: [],
            userTypeArr: [{text:'正式',value:'1'},{text:'实习',value:'3'},{text:'合作',value:'2'}],
            manInPutArr: [{text:'轻负载',value:'1'},{text:'普通负载',value:'2'},{text:'满负载',value:'3'},{text:'过度负载',value:'4'}],
            areaArr: [{text:'北京',value:'北京'},{text:'南京',value:'南京'},{text:'深圳',value:'深圳'},{text:'上海',value:'上海'}],
            departmentArr: [],
            projectArr: [],
            userType: '',
            manPowerSum: '',
            area: '',
            department: '',
            project: '',
            startNum: 1,
            range: 5,
            loading: false,
            dialogDownLoad : false,
            downLoadPath: '',
            total: 0

        }
    },
    methods: {
    dateChange(data) {
        var dateTime = new Date(data)
        if(dateTime.getDay() == 1){
            
           dateTime = new Date((Date.parse(new Date(dateTime)) + 5*1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 5*1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 5*1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }else if(dateTime.getDay() == 2){
            
           dateTime = new Date((Date.parse(new Date(dateTime)) + 4*1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 4*1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 4*1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }else if(dateTime.getDay() == 3){
            
           dateTime = new Date((Date.parse(new Date(dateTime)) + 3*1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 3*1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 3*1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }else if(dateTime.getDay() == 4){
            
           dateTime = new Date((Date.parse(new Date(dateTime)) + 2*1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 2*1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 2*1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }else if(dateTime.getDay() == 5){

           dateTime = new Date((Date.parse(new Date(dateTime)) + 1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) + 1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }else if(dateTime.getDay() == 7){
            
           dateTime = new Date((Date.parse(new Date(dateTime)) - 1000 * 60 * 60 * 24)).getFullYear() + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) - 1000 * 60 * 60 * 24)).getMonth()) + 1).toString().padStart(2, '0') + '-' + (Number.parseInt(new Date((Date.parse(new Date(dateTime)) - 1000 * 60 * 60 * 24)).getDate())).toString().padStart(2, '0')

        }
        return dateTime
    },

    endDateChange(){
      this.endDate = this.dateChange(this.endDate)
      console.log(this.endDate)
    },

    startDateChange() {
      this.startDate = this.dateChange(this.startDate)
      console.log(this.startDate)
    },

    // 根据时间查询
    queryByTime() {
      var dateTime = new Date()
      let startTime = new Date(this.startDate)
      let endTime = new Date(this.endDate)
      console.log(Date.parse(startTime))
      console.log(Date.parse(endTime))
      console.log(dateTime.getDay())
      console.log( ( Date.parse(dateTime) - (dateTime.getDay()) * 1000 * 60 * 60 * 24))
      if(this.startDate == null|| this.endDate == null){
        this.startDate = ''
        this.endDate = ''
      }else if(Date.parse(startTime) > Date.parse(endTime)){
        this.$message.error('起始时间不可以大于结束时间');
      }else if(Date.parse(startTime) < (Date.parse(dateTime) - 340 * 1000 * 60 * 60 * 24) ){
        this.$message.error('起始时间超出限制');
      }else if(Date.parse(endTime) > (Date.parse(dateTime) - (dateTime.getDay()) * 1000 * 60 * 60 * 24) ){
        this.$message.error('结束时间超出限制');
      }else {
        // 修改参数
        this.startNum = 1
        this.range = 5
        // 再发起请求
        let data = {
          startTime : this.startDate,
          endTime : this.endDate,
          area : this.area,
          projectName : this.project,
          manPowerSum : this.manPowerSum,
          department : this.department,
          userType : this.userType,
          startNum : 1,
          range : 5
        }
        this.getLoadByData(data)
      }

    },

    getLoadByData(data)
    {
      getUserStaticsInfo(data)
      .then(res => {
          if (res.state === 1000) {
            console.log(res)
            // this.loading = false
            this.tableData=res.data.UserInfoList
            this.total = res.data.total
            this.tableData.map(function(ele){
               let allProject = ele.projectName.join(',')
               ele.allProjectName = allProject
               return ele
            })
            console.log(this.tableData)
          } else {
            setTimeout(() => {
               this.$message.error(res.message);
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
          
        })
    },

    rangeChange(val) {
       this.range = val
       this.startNum = 1
       let data = {
          startTime : '',
          endTime : '',
          area : '',
          projectName : '',
          manPowerSum : '',
          department : '',
          userType : '',
          startNum : 1,
          range : val
       }
    this.getLoadByData(data)  

    },
    startNumChange(val) {
       this.startNum = val
       let data = {
          startTime : this.startDate,
          endTime : this.endDate,
          area : this.area,
          projectName : this.project,
          manPowerSum : this.manPowerSum,
          department : this.department,
          userType : this.userType,
          startNum : val,
          range : this.range,
          dialogDownLoad : false
       }
    this.getLoadByData(data)  
    },

    // 表格中的表头选择触发的函数
    handleFilterChange (value) {
      console.log(value)
      //  地区
      if(value.area !== undefined) {
        if (value.area.length === 0) {
          this.area = ''
        } else {
          this.area = value.area[0]
        }
      }

      //  人员类型
      if(value.userType !== undefined) {
        if (value.userType.length === 0) {
          this.userType = ''
        } else {
          this.userType = value.userType[0]
        }
      }

      //  参与项目
      console.log(11)
      if(value.project !== undefined) {
        if (value.project.length === 0) {
          this.project = ''
        } else {
          this.project = value.project[0]
        }
      }

      //  投入值
      if(value.manPowerSum !== undefined) {
        if (value.manPowerSum.length === 0) {
          this.manPowerSum = ''
        } else {
          this.manPowerSum = value.manPowerSum[0]
        }
      }

      //  部门
      if(value.department !== undefined) {
        if (value.department.length === 0) {
          this.department = ''
        } else {
          this.department = value.department[0]
        }
      }
      let data = {
          startTime : this.startDate,
          endTime : this.endDate,
          area : this.area,
          projectName : this.project,
          manPowerSum : this.manPowerSum,
          department : this.department,
          userType : this.userType,
          startNum : 1,
          range : 5
      }
      console.log(data)
      this.getLoadByData(data)
    },



      //查询所有项目信息
      queryAllProject()
      {
        let data={}
        getAllProjectList(data).then(res => {
          if (res.state === 1000) {
            this.allProject=res.data.projects
            let arr=[]
            this.allProject.forEach(ele => {
              arr.push({text: ele,value: ele})
            });
            this.projectArr=arr
            console.log(arr)
          } else {
            setTimeout(() => {
              this.$message.error(res.message);
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
      },
      //查询所有部门信息
      queryAllDepartment()
      {
        let data={}
        getAllDepartment(data).then(res => {
          if (res.state === 1000) {
            let department=res.data.departments
            let arr=[]
            console.log(department)
            department.forEach(ele => {
              arr.push({text: ele.name,value: ele.name})
            })
            this.departmentArr=arr
            console.log(arr)
          } else {
            setTimeout(() => {
             this.$message.error(res.message);
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
      },

      // 点击导出按钮
      getExcel() {
        this.loading = true
        exportUserResource().then(res => {
          if (res.state === 1000) {
            this.loading = false
            this.downLoadPath = 'http://' + res.data.ipAddress + ':' + res.data.port + res.data.pathName
            setTimeout(() => {
              this.dialogDownLoad = true
            }, 1000)
          } else {
            this.$message.error(res.message)
            setTimeout(() => {
              this.loading = false
            }, 1500)
          }
        }, rej => {
          this.loading = false
          this.$message.error('网络错误，请稍后再试！')
        })
      }

  },
   created () {
     this.queryAllProject()
     this.queryAllDepartment()

     //  要默认查询上周的数据
     let lastDate = new Date()
     lastDate.setDate(lastDate.getDate()-7)
     lastDate = this.dateChange(lastDate)
     console.log(lastDate)
     let data = {
          startTime : lastDate,
          endTime : lastDate,
          area : '',
          projectName : '',
          manPowerSum : '',
          department : '',
          userType : '',
          startNum : 1,
          range : 5
     }
     this.getLoadByData(data)

   }
}
</script>

<style>
.historyDataDetails {
  width: 100%;
}
.historyDataDetails > .header {
  width: 1188px;
  margin: 0 auto;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.historyDataDetails > main {
  width: 1190px;
  margin: 10px auto
}
.historyDataDetails .box-card {
  margin-top: 20px
}
.historyDataDetails > .body > .time1 {
  z-index: 1;
  float: right;
  margin-top: 0px;
  margin-right: 50px;
  width: 170px;
}
.historyDataDetails > .body > .time2 {
  z-index: 2;
  float: right;
  margin-top: 0px;
  margin-right: 30px;
  width: 170px;
}
.historyDataDetails > .body > .confirm {
  z-index: 111;
  float: right;
  margin-top: 0px;
  margin-right: 30px;
  position: relative;
}
.historyDataDetails > .body > .out {
  z-index: 111;
  float: right;
  margin-top: 0px;
  margin-right: 30px;
  position: relative;
}
 .el-table-filter  .el-table-filter__list {
  height: 150px;
  overflow: auto
}
</style>