<template>
  <div class="regularMemberManageApp">
    <main>
       
       <div class="top">

        <el-input v-model="realName" placeholder="请输入姓名"></el-input>
        <el-input v-model="account" placeholder="请输入域账号"></el-input>
        <!-- <el-input v-model="input" placeholder="请输入状态"></el-input> -->
        <el-select v-model="jobStatus.value">
          <el-option
            v-for="item in jobStatus.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="queryMember">查询</el-button>
      </div>

      <div class="container">
        <el-card class="box-card" v-for="(org,key) in orgs" :key="key" v-loading="loading">
                        <div slot="header" class="clearfix">
                            <span>{{org[0]}}</span>
                            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                        </div>
                        <div>
                            <el-table :data="org[2]" tooltip-effect="dark" style="width: 100%"  border="">
                                <el-table-column prop="realName" label="姓名" show-overflow-tooltip align="center"></el-table-column>
                                <el-table-column prop="accountName" label="账户名" show-overflow-tooltip  align="center"></el-table-column>
                                <el-table-column prop="department" label="部门" show-overflow-tooltip align="center" ></el-table-column>
                                <el-table-column prop="mail" label="邮箱" show-overflow-tooltip align="center" ></el-table-column>
                                <el-table-column prop="phone" label="手机" show-overflow-tooltip align="center" ></el-table-column>
                                <el-table-column prop="area" label="地区" show-overflow-tooltip align="center" ></el-table-column>
                                <el-table-column prop="entryTime" label="入职时间"  align="center" >
                                  <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.entryTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="submitEntryTime($event,scope.row.accountName)"></el-date-picker>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="dimissionTime" label="离职时间" align="center" >
                                  <template slot-scope="scope">
                                      <el-date-picker v-model="scope.row.dimissionTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="submitDimissionTime($event,scope.row)"></el-date-picker>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="status" label="在岗状态" show-overflow-tooltip align="center" ></el-table-column>
                            </el-table>
                            <!-- 分页 -->
                                <el-pagination :current-page.sync="org[3]"
                                            :page-sizes="[2,5, 10, 20]"
                                            :page-size="org[4]"
                                            :total="org[1]"
                                            layout="total, sizes, prev, pager, next"
                                            @size-change="rangeChange($event,org[0],key)"
                                            @current-change="startNumChange($event, org[0],key)">
                                </el-pagination>
                        </div>
                  </el-card>


      </div>
    </main>
  </div>
</template>

<script>
import { getRegularEmployeeByDepartment, getRegularEmployeeByProject, getRegularEmployeeByArea ,submitEmployJobTime} from '../../api/api'
export default {
  props: ['transData'],
  data () {
    return {
      //
      realName:'',
      account:'',
      departmentName:'',
      memeberTable:[],
      expectMemberTable:[
          {
              regular:'',
              partner:'',
              intern:''
          }
      ],
      multipleSelection: [],
      regularInput:'',
      partnerInput:'',
      internInput:'',

      //
      query:false,
      queryResult:[],
      orgs:[],

      //分页
      page:{},
      pages:[
        
      ],
      startNum: 1,
      range:10,
      total:null,

      //选择器
      jobStatus:{
        options: [{
          value: '1',
          label: '在职'
        }, {
          value: '2',
          label: '离职'
        }],
        value: '1'
      },
      orgType:'',
      loading:false
    }
  },
  methods: {
      queryMember(){
        
        let queryData = {
              realName:this.realName,
              accountName:this.account,
              status:this.jobStatus.value,
              departmentName:'',
              startNum:1,
              range:5
            }
        switch(this.orgType){
          case '1':
            this.getRegularEmployeeByDepartment(queryData)
            break
          case '2':
            this.getRegularEmployeeByProject(queryData)
            break
          case '3':
            this.getRegularEmployeeByArea(queryData)
            break
        }

      },
      // 点击第几页
      startNumChange (val,departmentName,index) {
            //this.startNum = val
            this.orgs[index][3] = val
            let queryData = {
              realName:this.realName,
              accountName:this.account,
              status:this.jobStatus.value,
              departmentName:departmentName,
              startNum:val,
              range:this.orgs[index][4]
            }

            this.getRegularEmployeeByDepartment(queryData)
      },
      
      // 选择每页展示多少条数据
      rangeChange (val,departmentName,index) {
            this.orgs[index][4] = val
            let queryData = {
              realName:this.realName,
              accountName:this.account,
              status:this.jobStatus.value,
              departmentName:departmentName,
              startNum:this.orgs[index][3],
              range:val
            }
            this.getRegularEmployeeByDepartment(queryData)
      },
      initCurrentMember(){

      },
      //按部门获取人员信息
      getRegularEmployeeByDepartment(queryData){

        // let queryData = {
        //   realName:this.realName,
        //   accountName:this.account,
        //   jobStatus:this.jobStatus.value,
        //   departmentName:this.departmentName,
        //   startNum:this.startNum,
        //   range:this.range
        // }
        
        //从后台获取数据
        getRegularEmployeeByDepartment(queryData)
            .then(res => {
                if (res.state === 1000) {
                  if(queryData.departmentName === ''){
                      this.orgs = res.data.resultData;
                      this.orgs.forEach(ele => {
                        //定义startNum
                        ele[3] = 1
                        //定义range
                        ele[4] = 5
                      })
                    }else{
                      this.orgs.forEach((ele,index) => {
                        if(ele[0] === queryData.departmentName){
                          let resultDataTemp = res.data.resultData[0]
                          resultDataTemp[3] = queryData.startNum
                          resultDataTemp[4] = queryData.range
                          this.orgs.splice(index,1,resultDataTemp)
                        }
                      })
                    }
                }else{
                      setTimeout(() => {
                      this.$message.error(res.message);
                      }, 100)
                  }}, rej => {
                        this.errorAjax()
                        }
                  )

      },
      //按项目获取人员信息
      getRegularEmployeeByProject(queryData){
         //从后台获取数据
        getRegularEmployeeByProject(queryData)
            .then(res => {
                if (res.state === 1000) {
                  if(queryData.departmentName === ''){
                      this.orgs = res.data.resultData;
                      this.orgs.forEach(ele => {
                        //定义startNum
                        ele[3] = 1
                        //定义range
                        ele[4] = 5
                      })
                    }else{
                      this.orgs.forEach((ele,index) => {
                        if(ele[0] === queryData.departmentName){
                          let resultDataTemp = res.data.resultData[0]
                          resultDataTemp[3] = queryData.startNum
                          resultDataTemp[4] = queryData.range
                          this.orgs.splice(index,1,resultDataTemp)
                        }
                      })
                    }
                }else{
                      setTimeout(() => {
                      this.$message.error(res.message);
                      }, 100)
                  }}, rej => {
                        this.errorAjax()
                        }
                  )
      },

      //按地区获取人员信息
      getRegularEmployeeByArea(queryData){
         //从后台获取数据
        getRegularEmployeeByArea(queryData)
            .then(res => {
                if (res.state === 1000) {
                  if(queryData.departmentName === ''){
                      this.orgs = res.data.resultData;
                      this.orgs.forEach(ele => {
                        //定义startNum
                        ele[3] = 1
                        //定义range
                        ele[4] = 5
                      })
                    }else{
                      this.orgs.forEach((ele,index) => {
                        if(ele[0] === queryData.departmentName){
                          let resultDataTemp = res.data.resultData[0]
                          resultDataTemp[3] = queryData.startNum
                          resultDataTemp[4] = queryData.range
                          this.orgs.splice(index,1,resultDataTemp)
                        }
                      })
                    }
                }else{
                      setTimeout(() => {
                      this.$message.error(res.message);
                      }, 100)
                  }}, rej => {
                        this.errorAjax()
                        }
                  )
      },
      //提交入职时间到后台
      submitEntryTime(time,accountName){
        let queryData = {
          accountName:accountName,
          entryTime:time,
          dimissionTime:'',
          entryOrDimission:1
        }

        submitEmployJobTime(queryData)
            .then(res => {
                if (res.state === 1000) {
                  this.$message.success("更新入职时间成功");
                }else{
                      setTimeout(() => {
                      this.$message.error(res.message);
                      }, 100)
                  }}, rej => {
                        this.errorAjax()
                        }
                  )

      },

      //提交离职时间到后台
      submitDimissionTime(time,row){
        let queryData = {
          accountName:row.accountName,
          entryTime:'',
          dimissionTime:time,
          entryOrDimission:2
        }

        submitEmployJobTime(queryData)
            .then(res => {
                if (res.state === 1000) {
                  let dateTime = new Date();
                  let currentTime = dateTime.getTime()

                  let dimissionTime = new Date(time).getTime()
                  //如果当前时间大于离职时间，修改用户在岗状态
                  if(currentTime >= dimissionTime){
                    row.status = '离职'
                  }else{
                    row.status = '在职'
                  }

                  this.$message.success("更新离职时间成功");
                }else{
                      setTimeout(() => {
                      this.$message.error(res.message);
                      }, 100)
                  }}, rej => {
                        this.errorAjax()
                        }
                  )

      }

  },
  
  created () {
    //this.orgType = '1'
    let queryData = {
          realName:'',
          accountName:'',
          status:1,
          departmentName:'',
          startNum:'',
          range:''
        }
    this.getRegularEmployeeByDepartment(queryData)
  },
  watch: {
    transData (val) {
      //console.log(val)
      
      this.orgType = val
      if(val == 1){
          //按部门查询数据
          let queryData = {
              realName:'',
              accountName:'',
              status:1,
              departmentName:'',
              startNum:'',
              range:''
            }
            this.getRegularEmployeeByDepartment(queryData)

        }else if(val == 2){
          //按项目查询数据
          let queryData = {
              realName:'',
              accountName:'',
              status:1,
              departmentName:'',
              startNum:'',
              range:''
            }
            this.getRegularEmployeeByProject(queryData)

        }else if(val == 3){
           //按地区查询数据
          let queryData = {
              realName:'',
              accountName:'',
              status:1,
              departmentName:'',
              startNum:'',
              range:''
            }
            this.getRegularEmployeeByArea(queryData)
        }
    }
  }
}
</script>

<style>
.regularMemberManageApp {
  width: 100%
}

.regularMemberManageApp > main > .top {
  margin-top: 20px;
  margin-bottom: 40px;
  position: relative
}
.regularMemberManageApp > main > .top > .el-input {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
}
.regularMemberManageApp > main > .top > .el-select {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
  height: 40px
}
.regularMemberManageApp > main > .top > .el-select > .el-input > .el-input__inner {
  height: 40px
}



.regularMemberManageApp > main {
  width: 1188px;
  margin: 10px auto;
  min-height: 100px
}

.regularMemberManageApp > main > .container > .el-card > .el-card__body > div > .el-pagination {
  padding-left: 0px;
  margin-top: 5px;
  /* padding: 0px 0px */
  /* background-color: yellow; */
}
.regularMemberManageApp > main > .container > .el-card > .el-card__body > div > .el-pagination .el-input{
  margin-left: 0px;
}

.regularMemberManageApp > main > .middle {
  margin-top: 80px;
  margin-bottom: 20px
}
.regularMemberManageApp > main > .middle > div > ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 20px
}
.regularMemberManageApp > main > .middle > div > ul > li {
  width: 1148px;
  background-color: #F2F6FC;
  font-size: 18px;
  padding: 3px 0px
}
.regularMemberManageApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
  padding: 8.5px 0px
}
.regularMemberManageApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden
}
.regularMemberManageApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 13px 0px
}
.regularMemberManageApp > main > .container {
  width: 1148px;
  margin: 10px 0 20px 20px;
  min-height: 200px
}
.regularMemberManageApp > main > .container > .el-card {
  margin-bottom: 20px
}
.regularMemberManageApp > main > .container > .el-card > .el-card__header {
  padding: 5px 20px
}
.regularMemberManageApp > main > .container > .el-card > .el-card__body > .el-table th {
  padding: 4px 0
}
.regularMemberManageApp > main > .container > .el-card > .el-card__body > .el-table td {
  padding: 4px 0
}
.regularMemberManageApp > main > .container > footer {
  text-align: center
}
.regularMemberManageApp > .canCases > .el-dialog > .el-dialog__body > .el-tree {
  max-height: 500px;
  overflow-x: auto;
  overflow-y: auto
}
.regularMemberManageApp > .canCases > .el-dialog > .el-dialog__body > footer {
  margin-top: 20px;
  height: 30px
}
.regularMemberManageApp > .canCases > .el-dialog > .el-dialog__body > footer > .el-button {
  float: right
}
</style>
