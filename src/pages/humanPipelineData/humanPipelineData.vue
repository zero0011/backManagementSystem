<template>
  <div class="HumanPipelineData">
      <header class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/staffManagement' }">资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员管道数据汇总</el-breadcrumb-item>
        </el-breadcrumb>
      </header>


      <main>
        <div class="container">
            <el-tabs  type="border-card" style="width: 1188px;margin:0 auto">
                <el-tab-pane label="所有人员" >

                    <div class="top">
                      <el-input v-model="departmentName" placeholder="部门名称"></el-input>
                      <el-button type="primary" @click="queryDepartment">查询</el-button>
                    </div>
                    <el-card class="box-card" v-if="!showtable">
                      <p style=" text-align:center">暂无数据</p>
                    </el-card>
                    <el-card class="box-card" style="margin-bottom: 20px" v-for="(item, index) in tableData" :key="index">


                      <span v-text="item.name" class="cardName"></span>
                      <el-checkbox-group v-model="item.statusList" size="medium" :min="1" :max="4" @change="statusChange(index)" style="display: flex;justify-content: flex-end">
                        <el-checkbox-button label="在职"></el-checkbox-button>
                        <el-checkbox-button label="待入职"></el-checkbox-button>
                        <el-checkbox-button label="待招"></el-checkbox-button>
                        <el-checkbox-button label="待离职" ></el-checkbox-button>
                      </el-checkbox-group>

                      <el-table :data="item.staff" tooltip-effect="dark" style="width: 100%;margin-top:20px"  border="" >
                          <el-table-column prop="name" fixed="left" label="部门名称" show-overflow-tooltip align="center" width="200px"></el-table-column>

                        <!-- <div v-for="(nextitem, index2) in item.staff" :key="index2"> -->
             {
                        <!-- <el-table-column :label="val.name" show-overflow-tooltip align="center" width="600px" v-for="(val, key) in vvb.trueData" :key="key">
                          <el-table-column :label="val2.city" show-overflow-tooltip align="center" width="150px" v-for="(val2, key2) in val.citys" :key="key2">{{ val2.count }}</el-table-column>
                        </el-table-column> -->
                        <!-- </div> -->
                          <el-table-column label="在职" show-overflow-tooltip align="center" width="750px" v-if="item.showOnJob">
                            <el-table-column label="北京" prop='onJob.beijing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="南京" prop='onJob.nanjing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="上海" prop='onJob.shanghai' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="深圳" prop='onJob.shenzhen' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="合计" prop='onJob.total' show-overflow-tooltip align="center" width="150px"></el-table-column>
                          </el-table-column>
                          <el-table-column label="待入职" show-overflow-tooltip align="center" width="750px" v-if="item.showWaitEntry">
                            <el-table-column label="北京" prop='waitEntry.beijing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="南京" prop='waitEntry.nanjing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="上海" prop='waitEntry.shanghai' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="深圳" prop='waitEntry.shenzhen' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="合计" prop='waitEntry.total' show-overflow-tooltip align="center" width="150px"></el-table-column>
                          </el-table-column>
                          <el-table-column label="待招" show-overflow-tooltip align="center" width="750px" v-if="item.showBeRecruited">
                            <el-table-column label="北京" prop='beRecruited.beijing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="南京" prop='beRecruited.nanjing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="上海" prop='beRecruited.shanghai' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="深圳" prop='beRecruited.shenzhen' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="合计" prop='beRecruited.total' show-overflow-tooltip align="center" width="150px"></el-table-column>
                          </el-table-column>
                          <el-table-column label="待离职" show-overflow-tooltip align="center" width="750px" v-if="item.showBeLeaving">
                            <el-table-column label="北京" prop='beLeaving.beijing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="南京" prop='beLeaving.nanjing' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="上海" prop='beLeaving.shanghai' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="深圳" prop='beLeaving.shenzhen' show-overflow-tooltip align="center" width="150px"></el-table-column>
                            <el-table-column label="合计" prop='beLeaving.total' show-overflow-tooltip align="center" width="150px"></el-table-column>
                          </el-table-column>

                        <el-table-column  label="操作" fixed="right" align="center" width="150px" >
                          <template slot-scope="scope">
                          <el-button type="text" @click="findHistory(index,scope.row.name)" v-if="showHistoryButton(scope.row.name)">历史记录</el-button>
                            <!-- <el-dialog :visible.sync="showHistory" class="bindDialog" style="text-align: left" >
                              <div class="history" >
                                <h2 style="padding-left: 22px;padding-bottom: 20px">历史记录</h2>
                                  <P v-if="noData" style="text-align:center">暂无数据</P>
                                  <el-timeline v-for="(item,index) in historyData" :key="index" >
                                    <el-timeline-item :timestamp="item.date" placement="top">
                                      <el-card>
                                        <p>{{item.context}}</p>
                                      </el-card>
                                    </el-timeline-item>
                                  </el-timeline>
                                <el-button type="more" icon="el-icon-caret-bottom" circle style="margin-left:46%" v-if="showButton" @click="findMoreHistory"></el-button>
                              </div>
                            </el-dialog> -->
                          </template>
                        </el-table-column>
                      </el-table>


                      <!-- 分页 -->
                      <el-pagination :current-page.sync= item.startNum
                        :page-sizes="[5, 10, 20]"
                        :page-size= item.range
                        style="margin-left: -10px;margin-right: 30px;"
                        :total="item.total"
                        layout="total, sizes, prev, pager, next"
                        @size-change="handleSizeChange($event, index)"
                        @current-change="handleCurrentChange($event, index)">
                      </el-pagination>
                    </el-card>
                            <el-dialog :visible.sync="showHistory" class="bindDialog" style="text-align: left" v-if="showDialog">
                              <div class="history" >
                                <h2 style="padding-left: 22px;padding-bottom: 20px">历史记录</h2>
                                  <P v-if="noData" style="text-align:center">暂无数据</P>
                                  <el-timeline v-for="(item,index) in historyData" :key="index" >

                                    <el-timeline-item :timestamp="item.date" placement="top">
                                      <el-card>
                                        <p>{{item.context}}</p>
                                      </el-card>
                                    </el-timeline-item>
                                  </el-timeline>

                                <el-button type="more" icon="el-icon-caret-bottom" circle style="margin-left:46%" v-if="showButton" @click="findMoreHistory"></el-button>
                              </div>
                            </el-dialog>                    
                </el-tab-pane>
            </el-tabs>
        </div>
      </main>
  </div>
</template>

<script>
import { gestaffStatistics,getstaffHistoryList} from '../../api/api'
export default {
  data(){
    return{
      showDialog:false,
       showtable:true,
       showButton:true,
       tableData: [],//显示数据
       tempData:[],//存放临时数据
       statusList:['在职'],
       departmentName:'',
       status:1,
       startNum:1,
       range:5,
       personType:['所有人员','正式人员','合作方人员','实习人员'],
       personTypeList:['allStaff','regularStaff','partnerStaff','interStaff'],
       historyData:[],
       noData:false,
       showHistory:false,
       buttonStartNum:2, //这个是为查询历史记录中的（查询更多按钮）服务的，它会记录需要请求多少数据，而且每次没有更多数据，后此参数初始化
       moreDepartmentName:'',
       morestaffType:'',
      //  showOnJob: false,
      //  showWaitEntry: false,
      //  showBeRecruited: false,
      //  showBeLeaving: false
    }


  },
  methods:{

 formatterBannerOs: function(row, column, cellValue) {
        if (cellValue == '00') {
          return '全平台'
        } else if (cellValue == '01') {
          return '安卓'
        } else if (cellValue == '02') {
          return ' IOS'
        }
      },



    //把合计那一行去除历史数据按钮
    showHistoryButton(name)
    {
      if(name=='总计')
      {
        return false
      }
      else
      {
        return true
      }
    },

    //按钮查询更多数据
    findMoreHistory()
    {
      let Data={
        staffType:this.morestaffType,
        departmentName:this.moreDepartmentName,
        startNum:this.buttonStartNum
      }

      getstaffHistoryList(Data)
      .then(res => {
            if (res.state === 1000) {
              this.historyData.push(...res.data.staffhistoryList)
              //控制按钮是否显示
              if(res.data.staffhistoryList.length<10)
              {
                this.showButton=false //更多按钮不再显示
                this.buttonStartNum=2 //请求的参数初始化
              }
              else{
                this.buttonStartNum+=1
              }
            } else {
              this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })
    },

    //查询历史记录
    findHistory(index,DepartmentName)
    {
      this.showDialog=true
      this.morestaffType = index
      this.moreDepartmentName = DepartmentName
      this.historyData.splice(0, this.historyData.length)
      // console.log(DepartmentName)
      // this.showHistory=true
      let Data={
        staffType:index,
        departmentName:DepartmentName,
        startNum:1
      }

      getstaffHistoryList(Data)
      .then(res => {
            if (res.state === 1000) {
              if(res.data.staffhistoryList.length==0)
              {
                this.noData=true
              }
              else{
                this.noData=false
              }

              //把数据一个一个推入

              //...遍历数组每一个元素
              this.historyData.push(...res.data.staffhistoryList)

              if (this.historyData.length == 10) {
                this.showButton = true
              } else {
                this.showButton = false
              }
              this.showHistory = true
              // res.data.staffhistoryList.forEach((ele,index)=>{
              //   this.historyData.push(ele)
              // })
              //控制按钮是否显示
              // if(res.data.staffhistoryList.length<10)
              // {
              //   this.showButton=false //更多按钮不再显示
              // }
              // else{
              //    this.showButton=true
              // }
              this.showHistory = true
            } else {
              this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })
    },


    //查询部门
    queryDepartment()
    {
      let Data={
        staffType: '',
        departmentName:this.departmentName,
        status:this.status,
        startNum:this.startNum,
        range:this.range,
      }
      this.getStaffLoad(Data)

    },
    //val每页显示最大条数发生改变
    handleSizeChange(val,index)
    {
        this.$set(this.tableData[index], 'startNum', 1)
        this.$set(this.tableData[index], 'range', val)
        this.getPage(index)//查询

    },
    //val是当前显示的是哪页
    handleCurrentChange(val,index)
    {
        this.$set(this.tableData[index], 'startNum', val)
        this.getPage(index)//查询
    },
    //分页
    getPage(index)
    {

      //先生成请求字符串
      let statusStr=''
      let tempStatusList=this.tableData[index].statusList //这是一个数组
      //生成status请求字符串

      this.tableData[index].statusList.forEach((ele,index)=>{
        if(ele=='在职')
        {
          statusStr+='1;'
        }
        if(ele=='待入职')
        {
          statusStr+='2;'
        }
        if(ele=='待招')
        {
          statusStr+='3;'
        }
        if(ele=='待离职')
        {
          statusStr+='4;'
        }
      })
      const newstatusStr = statusStr.slice(0,statusStr.length-1)//把最后的;去掉


      let Data={
      staffType: index,
      departmentName:this.departmentName,
      status:newstatusStr,
      startNum:this.tableData[index].startNum,
      range:this.tableData[index].range
      }

      gestaffStatistics(Data)
      .then(res => {
            if (res.state === 1000) {
              //请求完替换数据
              let tempPersonType=this.personTypeList[index]
              let total=res.data.staffStatistics[tempPersonType][0].total
              let length=res.data.staffStatistics[tempPersonType][0].statisticData.department.length
              let partData =
              {
                // staff:res.data.staffStatistics[tempPersonType],
                staff:[],
                name:this.personType[index],
                statusList:tempStatusList,
                startNum:this.tableData[index].startNum,
                range:this.tableData[index].range,
                total:this.tableData[index].total,
                showOnJob:false,
                showWaitEntry:false,
                showBeRecruited:false,
                showBeLeaving:false,

              }



             
              let tempDepart=[]
              for(let i=0;i<length;i++) {
                 let eachDepart={
                        name:res.data.staffStatistics[tempPersonType][0].statisticData.department[i].name

                  }
                  res.data.staffStatistics[tempPersonType].forEach(ele2=>{
                    //每个ele2代表在职离职
                         if(ele2.statisticData.userType=='在职')
                            {
                              partData.showOnJob=true
                              eachDepart.onJob={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待入职')
                            {
                              partData.showWaitEntry=true
                              eachDepart.waitEntry={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待招')
                            {
                              partData.showBeRecruited=true
                              eachDepart.beRecruited={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待离职')
                            {
                              partData.showBeLeaving=true
                              eachDepart.beLeaving={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }
                  })
                  tempDepart.push(eachDepart)

              }


              //这里加总计功能
              let summary={
                name:'总计'
              }
              res.data.staffStatistics[tempPersonType].forEach(ele2=>{
                if(ele2.statisticData.userType=='在职')
                            {
                              summary.onJob={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待入职')
                            {
                              summary.waitEntry={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待招')
                            {
                              summary.beRecruited={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待离职')
                            {
                              summary.beLeaving={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }
                     })
                     tempDepart.push(summary)






               partData.staff=tempDepart


              this.$set(this.tableData,index,partData)



            } else {
              this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })

    },




    //在职离职按钮改变
    statusChange(index){

      //先加载请求数据
      let statusStr=''
      let tempStatusList=this.tableData[index].statusList //这是一个数组

      //对字符串进行处理
      this.tableData[index].statusList.forEach((ele,index)=>{

        if(ele=='在职')
        {
          statusStr+='1;'
        }
        if(ele=='待入职')
        {
          statusStr+='2;'
        }
        if(ele=='待招')
        {
          statusStr+='3;'
        }
        if(ele=='待离职')
        {
          statusStr+='4;'
        }
      })
      const newstatusStr = statusStr.slice(0,statusStr.length-1)//把最后的;去掉



      //再进行请求
      let Data={
        staffType: index,
        departmentName:this.departmentName,
        status:newstatusStr,
        startNum:this.startNum,
        range:this.range
      }
      gestaffStatistics(Data)
      .then(res => {
            if (res.state === 1000) {

              //请求完替换数据
              let tempPersonType=this.personTypeList[index]

              let total= res.data.staffStatistics[tempPersonType][0].total
              let length=res.data.staffStatistics[tempPersonType][0].statisticData.department.length


              //先定义想替换数据的格式
              let partData =
              {
                staff:[],
                name:this.personType[index],
                statusList:tempStatusList,
                startNum:this.startNum,
                range:this.range,
                total:total,
                showOnJob:false,
                showWaitEntry:false,
                showBeRecruited:false,
                showBeLeaving:false
              }


              //res.data.staffStatistics[tempPersonType]
              let tempDepart=[]
              for(let i=0;i<length;i++) {
                 let eachDepart={
                        name:res.data.staffStatistics[tempPersonType][0].statisticData.department[i].name

                  }
                  res.data.staffStatistics[tempPersonType].forEach(ele2=>{
                    //每个ele2代表在职离职
                         if(ele2.statisticData.userType=='在职')
                            {
                              partData.showOnJob=true
                              eachDepart.onJob={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待入职')
                            {
                              partData.showWaitEntry=true
                              eachDepart.waitEntry={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待招')
                            {
                              partData.showBeRecruited=true
                              eachDepart.beRecruited={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待离职')
                            {
                              partData.showBeLeaving=true
                              eachDepart.beLeaving={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }
                  })
                  tempDepart.push(eachDepart)

              }



              //这里加总计功能，但是这个总计也要根据res.data.staffStatistics[tempPersonType](数组，分别对应的是在职，离职)，每一个元素都遍历，重装summary数据类型
              let summary={
                name:'总计'
              }
              res.data.staffStatistics[tempPersonType].forEach(ele2=>{
                if(ele2.statisticData.userType=='在职')
                            {
                              summary.onJob={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待入职')
                            {
                              summary.waitEntry={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待招')
                            {
                              summary.beRecruited={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }

                            if(ele2.statisticData.userType=='待离职')
                            {
                              summary.beLeaving={
                                    beijing:ele2.statisticData.summary.beijing,
                                    nanjing:ele2.statisticData.summary.nanjing,
                                    shanghai:ele2.statisticData.summary.shanghai,
                                    shenzhen:ele2.statisticData.summary.shenzhen,
                                    total:ele2.statisticData.summary.total
                              }
                            }
                     })
                     tempDepart.push(summary)


              partData.staff=tempDepart



              this.$nextTick(() => {
                this.$set(this.tableData,index,partData)
              })

            } else {
              this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })

    },

    errorAjax (res) {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    },


  //初始显示，加载数据
    getStaffLoad(Data){
      gestaffStatistics(Data)
      .then(res => {
            if (res.state === 1000) {

              if(res.data.staffStatistics==null)
              {
                this.showtable
              }
              //先把tableData置空
              this.tableData.splice(0)
              this.tempData.splice(0)

              if(res.data.staffStatistics.allStaff!==undefined)
              {
              this.tempData.push({staff:res.data.staffStatistics.allStaff,name:'所有人员'})
              }
               if(res.data.staffStatistics.regularStaff!==undefined)
              {
              this.tempData.push({staff:res.data.staffStatistics.regularStaff,name:'正式人员'})
              }
              if(res.data.staffStatistics.partnerStaff!==undefined)
              {
              this.tempData.push({staff:res.data.staffStatistics.partnerStaff,name:'合作人员'})
              }
              if(res.data.staffStatistics.interStaff!==undefined)
              {
              this.tempData.push({staff:res.data.staffStatistics.interStaff,name:'实习人员'})
              }

             this.tempData.forEach((ele,index)=>{
               //ele 代表全部，正式，实习，合作人员
               let total= ele.staff[0].total
               let length=ele.staff[0].statisticData.department.length


            let everyArr=[]//传入tableData里的每个元素
            for(let i=0;i<length;i++) //这层控制有几个部门
                 {

                    // 总体来说，就是为了创造动态的数据结构eachDepart,每次次进行部门操作，对于每一个ele(代表在职，待离职)，都进行遍历，
                    // 如果有(在职,待入职,待离职,待招)选项,eachDepart都会推入对应的数据，用i来控制推进去的是哪一个部门

                      let eachDepart={
                        name:ele.staff[0].statisticData.department[i].name
                      }

                      ele.staff.forEach(ele2=>{
                            if(ele2.statisticData.userType=='在职')
                            {
                              this.tempData[index].showOnJob=true
                              eachDepart.onJob={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待入职')
                            {
                              this.tempData[index].showWaitEntry=true
                              eachDepart.waitEntry={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待招')
                            {
                              this.tempData[index].showBeRecruited=true
                              eachDepart.beRecruited={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }

                            if(ele2.statisticData.userType=='待离职')
                            {
                              this.tempData[index].showBeLeaving=true
                              eachDepart.beLeaving={
                                    beijing:ele2.statisticData.department[i].detail.beijing,
                                    nanjing:ele2.statisticData.department[i].detail.nanjing,
                                    shanghai:ele2.statisticData.department[i].detail.shanghai,
                                    shenzhen:ele2.statisticData.department[i].detail.shenzhen,
                                    total:ele2.statisticData.department[i].detail.total
                              }
                            }
                      })
                      //把封装好的数据推入everyArr，每个everyArr分别代表全部，正式，合作，实习，有几个部门推几次
                      everyArr.push(eachDepart)
                 }
                 //在这里加总计数据，但是我这里写死了，默认初始是在职，其实如果想实现其他的可以遍历
 
                 everyArr.push({
                   name:'总计',
                   onJob:{
                        beijing:ele.staff[0].statisticData.summary.beijing,
                        nanjing:ele.staff[0].statisticData.summary.nanjing,
                        shanghai:ele.staff[0].statisticData.summary.shanghai,
                        shenzhen:ele.staff[0].statisticData.summary.shenzhen,
                        total:ele.staff[0].statisticData.summary.total,
                  }
                 })

                 this.tableData.push(
                   {
                   staff:everyArr,
                   startNum:1,
                   range:5,
                   total:total,
                   statusList:['在职'],
                   name:'',
                   showOnJob:true,
                   showWaitEntry:false,
                   showBeRecruited:false,
                   showBeLeaving:false
                   })


             })

                 this.tableData[0].name='所有人员'
                 this.tableData[1].name='正式人员'
                 this.tableData[2].name='合作方人员'
                 this.tableData[3].name='实习人员'


            } else {
              this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })

    },

  },
  created(){
    let Data={
      staffType: '',
      departmentName:'',
      status: 1,
      startNum:this.startNum,
      range:this.range
    }
    this.getStaffLoad(Data)

  }

}
</script>

<style>
      .HumanPipelineData > .header {
        width: 1188px;
        margin: 0 auto;
        height: 14px;
        padding: 10px 0px;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc
      }
      .HumanPipelineData > .header > .breadcrumb {
        margin-left: 10px
      }

      .HumanPipelineData > main{
        margin-left: 37px;
        margin-right: 38px;
        margin-top: 15px
        }
      .HumanPipelineData > main > .container  .top {
        margin-top: 20px;
        margin-bottom: 35px;
        position: relative
        }
    .HumanPipelineData > main > .container  .top > .el-input {
        float: left;
        margin-left: 15px;
        width: 200px;
        margin-right: 50px;
        }


    .HumanPipelineData > main > .container  .box-card {
        margin-top: 40px;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-right: 5px;
        }

    .HumanPipelineData > main > .container  .box-card .el-card__body .cardName{
        position:relative;
        margin-left: 50px;
        top: 26px
        }

    .HumanPipelineData > main > .container  .box-card > .el-card__header {
          padding: 5px 20px
        }
    .HumanPipelineData > main > .container  .box-card > .el-card__body > .el-table th {
          padding: 20px 0px
        }
    .HumanPipelineData > main > .container  .box-card > .el-card__body > .el-table td {
          padding: 20px 0px
        }
    /* 前面是上下,后面是左右 */


    .HumanPipelineData > main > .container  .box-card > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
      border-right: 1px solid #DCDFE6
    }
    .HumanPipelineData > main > .container  .box-card > .el-table > .el-table__body-wrapper {
      height: 398px;
      overflow-y: auto
    }
    .HumanPipelineData > main > .container  .box-card > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
      border-right: 1px solid #DCDFE6;
      height: 40px;
      padding: 3px 0;
    }
    .HumanPipelineData > main > .container .el-card__body > .el-table thead.is-group th
    {
      background: #ffffff
    }

    .HumanPipelineData .table-expand {
      font-size: 0;
    }
    .HumanPipelineData .table-expand label {
      width: 180px;
      color: #99a9bf;
      margin-left: 55px
    }
    .HumanPipelineData .table-expand .el-form-item {
      margin-right: 0px;
      margin-bottom: 0px;
      width: 50%
    }
</style>
