<template>
  <div class="personManagement">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/resourseManagement' }">资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目人力汇总</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
        <div class="container">
          <el-tabs  type="border-card" style="width: 1188px;margin:0 auto">
            <el-tab-pane label="所有项目" >
              <div class="top">
                    <el-input v-model="projectName" placeholder="项目名称"></el-input>
                    <el-button type="primary" @click="queryMember">查询</el-button>
              </div>
              <el-card class="box-card" style="margin-bottom: 20px" >
                <el-table :data="tableData.details" tooltip-effect="dark" style="width: 100%;margin-top:20px"  border="" >

                      <el-table-column type="expand" width="0px">  
                        <template slot-scope="scope">
                          <el-form label-position="left" inline class="table-expand">
                          <el-form-item label="项目现有总人力投入">
                            <span>{{ scope.row.hrInput }}</span>
                          </el-form-item>
                          <el-form-item label="项目总需求人力">
                            <span>{{ scope.row.hrExpect }}</span>
                          </el-form-item>
                          <el-form-item label="项目总缺口人力">
                            <span>{{ scope.row.hrGap }}</span>
                          </el-form-item>
                        </el-form>
                        </template>
                    </el-table-column>

                    <el-table-column fixed prop="projectName" label="项目名称" show-overflow-tooltip align="center" width="205px">
                      <template slot-scope="scope">
                        <span >{{ scope.row.projectName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="currentNumber" label="现有人力资源(实时)" show-overflow-tooltip align="center" width="420px">
                        <el-table-column prop="currentNumber.regular" label="正式(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                        <el-table-column prop="currentNumber.partner" label="合作方(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                        <el-table-column prop="currentNumber.intern" label="实习(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="expectNumber" label="需求人力资源(实时)" show-overflow-tooltip align="center" width="420px">
                        <el-table-column prop="expectNumber.regular" label="正式(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                        <el-table-column prop="expectNumber.partner" label="合作方(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                        <el-table-column prop="expectNumber.intern" label="实习(人力)" show-overflow-tooltip align="center" width="140px"></el-table-column>
                    </el-table-column>
                </el-table>


                <!-- 分页 -->
                <el-pagination :current-page.sync="startNum"
                :page-sizes="[5, 10, 20]"
                :page-size= range
                :total="tableData.total"
                layout="total, sizes, prev, pager, next"
                @size-change="rangeChange"
                @current-change="startNumChange">
                </el-pagination>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </div>
    </main>
  </div>
</template>

<script>
import {getAllHumanResource} from  '../../api/api'
export default {
  data(){
    return{
      tableData :{},
      range:10,
      projectName:'',
      startNum:1,
      sumDate:{
        "projectName":"总计",
        "currentNumber":{
          "regular":0,
          "partner":0,
          "intern":0
        },
        "expectNumber":{
          "regular":0,
          "partner":0,
          "intern":0
        },
        "hrGap":0,
        "hrInput":0,
        "hrExpect":0
      },
    }
  },

  methods:{
    
    error()
    {
        this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },


    getLoadByData(data)
    {
      getAllHumanResource(data)
      .then(res => {
          if (res.state === 1000) {
            console.log(res)
            // this.loading = false
            this.tableData=res.data.humanResource //把这个数组
            //this.tableData = res.data.staffLoad

            //做合计处理
            console.log(this.tableData.details)
            let allProject=this.tableData.details

            this.sumDate={
                  "projectName":"总计",
                  "currentNumber":{
                    "regular":this.tableData.summary.currentNumber.regular*10/10,
                    "partner":this.tableData.summary.currentNumber.partner*10/10,
                    "intern":this.tableData.summary.currentNumber.intern*10/10
                  },
                  "expectNumber":{
                    "regular":this.tableData.summary.expectNumber.regular*10/10,
                    "partner":this.tableData.summary.expectNumber.partner*10/10,
                    "intern":this.tableData.summary.expectNumber.intern*10/10
                  },
                  "hrGap":this.tableData.summary.hrGap*10/10,
                  "hrInput":this.tableData.summary.hrInput*10/10,
                  "hrExpect":this.tableData.summary.hrExpect*10/10
                },
                console.log(this.sumDate)

            // allProject.forEach((ele,index) => {
            //   this.sumDate.currentNumber.regular +=(ele.currentNumber.regular*10)
            //   this.sumDate.currentNumber.partner +=(ele.currentNumber.partner*10 )
            //   this.sumDate.currentNumber.intern +=(ele.currentNumber.intern*10 )

            //   this.sumDate.expectNumber.intern +=(ele.expectNumber.intern*10 )
            //   this.sumDate.expectNumber.partner +=(ele.expectNumber.partner*10 )
            //   this.sumDate.expectNumber.regular +=(ele.expectNumber.regular*10 )

            //   this.sumDate.hrGap +=(ele.hrGap*10 )
            //   this.sumDate.hrInput +=(ele.hrInput*10)
            //   this.sumDate.hrExpect +=(ele.hrExpect*10)
            // });

            //解决浮点数
              // this.sumDate.currentNumber.regular/=10
              // this.sumDate.currentNumber.partner /=10
              // this.sumDate.currentNumber.intern /=10
              // this.sumDate.expectNumber.intern /=10
              // this.sumDate.expectNumber.partner /=10
              // this.sumDate.expectNumber.regular /=10
              // this.sumDate.hrGap /=10
              // this.sumDate.hrInput /=10
              // this.sumDate.hrExpect /=10
              // console.log(this.sumDate)

               //总计属性加进去
              this.tableData.details.push(this.sumDate)
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


    rangeChange(val)
    {
      this.startNum=1
      this.range=val
      let data={
        projectName:'',
        startNum:1,
        range:val
      }
      this.getLoadByData(data)
    },
    startNumChange(val)
    {
      this.startNum=val
      let data={
        projectName:'',
        startNum:val,
        range:this.range
      }
      this.getLoadByData(data)
    },

    queryMember()
    {
      let data={
        projectName:this.projectName,
        startNum:1,
        range:10
      }
      this.getLoadByData(data)
    }





  },
  created() {

    //渲染初始页面
    let data={
      projectName:'',
      startNum:1,
      range:10
    }
    this.getLoadByData(data)

  }

}
</script>

<style>
  .personManagement > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .personManagement > .header > .breadcrumb {
    margin-left: 10px
  }
  .personManagement > main{
    margin-left: 37px;
    margin-right: 38px;
    margin-top: 15px
  }
    .personManagement > main > .container  .top {
    margin-top: 20px;
    margin-bottom: 35px;
    position: relative
    }
    .personManagement > main > .container  .top > .el-input {
    float: left;
    margin-left: 15px;
    width: 200px;
    margin-right: 50px;
    }


    .personManagement > main > .container  .box-card {
      margin-top: 40px;
      margin-bottom: 20px;
      margin-left: 10px;
      margin-right: 5px;
    }
    .personManagement > main > .container  .box-card > .el-card__header {
      padding: 5px 20px
    }
    .personManagement > main > .container  .box-card > .el-card__body > .el-table th {
      padding: 20px 0px
    }
    .personManagement > main > .container  .box-card > .el-card__body > .el-table td {
      padding: 20px 0px
    }
    /* 前面是上下,后面是左右 */


    
    .personManagement > main > .container  .box-card > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
      border-right: 1px solid #DCDFE6
    }
    .personManagement > main > .container  .box-card > .el-table > .el-table__body-wrapper {
      height: 398px;
      overflow-y: auto
    }
    .personManagement > main > .container  .box-card > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
      border-right: 1px solid #DCDFE6;
      height: 40px;
      padding: 3px 0;
    }
    .personManagement > main > .container .el-card__body > .el-table thead.is-group th
    {
      background: #ffffff
    }

    .personManagement .table-expand {
      font-size: 0;
    }
    .personManagement .table-expand label {
      width: 180px;
      color: #99a9bf;
      margin-left: 55px
    }
    .personManagement .table-expand .el-form-item {
      margin-right: 0px;
      margin-bottom: 0px;
      width: 50%
    }
</style>