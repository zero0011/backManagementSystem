<template>
<!-- 选择栏模块 -->
  <div class="resourceApp3">
    <div class="top">
      <el-input v-model="personRealName" placeholder="请输入姓名"  ></el-input>
      <el-input v-model="personAccountName" placeholder="请输入用户名"  ></el-input>
      <el-button type="primary" @click="queryRNAN">查询</el-button>
      <el-button type="primary" @click="getExcel" style="margin-left:120px;position:relative">导出</el-button>
      <el-button type="primary" @click="jumpToDepMes">部门人力明细</el-button>
      <el-button type="primary" class="queryProject" @click="queryHumanResource">项目人力汇总</el-button>
   </div >

<div class="container3"  v-loading="loading" element-loading-text="正在生成中">
  <template v-if="!query">
    <el-card class="box-card" v-if="!showtable">
      <span style=" margin-left:500px">暂无数据</span>
    </el-card>
    <el-card class="box-card" v-for="(item, index) in tableData" :key="index" style="margin-bottom: 20px">
        <span v-text="item.name"></span>
   <div class="tb">
   <br>

  <el-table 
    :data="item.details"
    border
    style="width: 100%"
    empty-text
    v-loading="loading"
    tooltip-effect="dark"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-table-column  label="姓名" width="150"  align="center" show-overflow-tooltip :render-header="renderHeader">
        <template slot-scope="scope">
        <div class="light" style="margin-left:35px">
              <span id="lowLoad" v-if="scope.row.manpowerVal >=0 && scope.row.manpowerVal <0.6"></span>
              <span id="normalLoad" v-if="scope.row.manpowerVal >= 0.6 && scope.row.manpowerVal < 1"></span>
              <span id="fullLoad" v-if="scope.row.manpowerVal >=1.0 && scope.row.manpowerVal <= 1.1"></span>
              <span id="heavyLoad" v-if="scope.row.manpowerVal > 1.1"></span>
              <span id="context">{{scope.row.personRealName}}</span>
        </div>
      </template>
      </el-table-column>
    <el-table-column prop="personAccountName" label="用户名"  width="158" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="orgName" label="部门" width="156" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="projectNames" label="所在项目" width="145" align="center" >
      <template slot-scope="scope" >
        <p  v-if="!showbutton(scope.row)" v-html="scope.row.projectNames"></p>
        <el-button v-if="showbutton(scope.row)" @click="showProject(scope.row)" type="text" >显示项目</el-button>
      </template>
      </el-table-column>
    <el-table-column prop="personType" label="人员类型" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="manpowerVal" label="总投入值" width="150" align="center" show-overflow-tooltip :render-header="renderHeader2">
      </el-table-column>
    <el-table-column prop="operating" label="操作" width="196" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
          <el-button v-if="showbutton(scope.row)" @click="projectManage(scope.row)" type="text" >管理项目</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 page-sizes显示列表有哪些值,page-size每页显示条目的个数,current-page.sync当前页-->
  <!-- handleSizeChange函数来改变range,handleCurrentChange函数来改变startNum -->
  <el-pagination :current-page.sync= item.startNum
    :page-sizes="[5, 10, 20]"
    :page-size= item.range
    style="margin-left: -10px;margin-right: 30px;"
    :total="item.total"
    layout="total, sizes, prev, pager, next"
    @size-change="handleSizeChange($event, index)"
    @current-change="handleCurrentChange($event, index)">
  </el-pagination>
  </div>
    </el-card>
  </template>
  </div>
  <!-- 项目管理模块 show-close是否显示关闭按钮-->
  <el-dialog :visible.sync="showDialogUserProject" :show-close="hide" :before-close="clickOther" class="bindProject">
    <div class="left">
      <h2>待选择项目列表</h2>
      <div class="query">
      <el-input v-model="inputProject" placeholder="请输入内容" size="medium"></el-input>
      <el-button type="primary" size="small" @click="queryProject">查询</el-button>
      </div>
      <el-tree :data="canSelectUser" show-checkbox @node-click="handleNodeClickProject" accordion empty-text node-key="id" @check-change="getSelectNode" ref="tree"></el-tree>
    </div>
    <div class="middle">
      <el-button type="primary" plain @click="addProject">> 添加</el-button>
    </div>
    <div class="right">
      <h2>已选择项目列表</h2>
      <div class="table">
        <el-table :data="haveBindProject" empty-text>
          <el-table-column prop="userProject" label="项目名称" width="224" align="center"></el-table-column>
          <el-table-column label="操作" width="224" align="center">
            <template slot-scope="scope">
              <el-button @click="deleteBindProject(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogBindProject('close')">取 消</el-button>
      <el-button type="primary" @click="closeDialogBindProject('confirm')">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 显示项目弹窗 -->
  <el-dialog :visible.sync="showDialogProject" width="52%" style="height:600px" class="projectDialog">
     <el-table :data="AllProjects" style="width: 80%;margin: 0 auto" >
      <el-table-column prop="projectName" label="项目名称" align="center"  >
      </el-table-column>
     </el-table>
  </el-dialog>

      <!-- 下载报告 -->
  <el-dialog title="下载报告" :visible.sync="dialogDownLoad" class="dialogDownLoad">
    <div style="text-align: center">
      <el-button type="primary"><a :href="downLoadPath" download="模板.xlsx" style="text-decoration: none;color: #fff">下载</a></el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import {getAllStaffLoad,getProjectList,getSelectedProjects,updateSelectedProjects,exportEmployeeResourceManage} from  '../../api/api'
export default {
    data() {
      return {
        loading: false,
        dialogDownLoad : false,
        downLoadPath: '',        
        showtable:true,
        prepareSelectUser:[],//待选择项目列表
        inputProject:'',//查询项目名变量
        userId:'',
        showDialogUserProject:false,
        haveBindProject: [],//根据域账号查询到的项目列表 每一个元素是{userProject:i}
        preAddProject:'',  //预添加的项目值
        canSelectUser: [],   //获取的全部项目数组每一个是一个对象[{label: '用户组信息',children: array([{label:aaa},{label:bbb}...])}]
        showDialogProjectManage:false,
        hide:false,
        calendardate: '',
        showcalendar:false,
        query: false,
        personAccountName: '',
        personRealName:'',
        loadType: '4',
        personName: '',
        CategoryType: 1,
        personAccount: '',
        orgName: '',
        projectName: '',
        PersonType: '',
        manpower: '',
        tableData: [

        ], //data.staffLoad
        PageData: [], //分页查询存放内容数据
        showDialogHistoryData: {},
        showDialogHistory: 'false',
        loading: false,
        CurrentDate: '',
        CurrentDate2: '',
        test:[{
          key:'2019-9-27',
          value: 0
        },
        {
          key:'2019-9-15',
          value: 1
        }],
        historyData: {},
        hisdata: [],
        //分页
      total:null,
      RequestName:'',
      ShowDate: new Date(),
      ProjectName: '',
      DepartmentName: '所有部门',
      DepartmentLevel: 1,
      AllProjects: [],//存的是全部项目名的数组
      showDialogProject: false,  //是否显示项目名弹窗
      startNum:1,
      range:5,
      presonChart:{
        1:'正式员工',
        2:'合作方员工',
        3:'实习员工'
      },
      }
    },

    props: ['toProjectName','toDepartmentName','toDepartmentLevel'],

    methods:{
      getExcel() {
        this.loading = true
        exportEmployeeResourceManage({
          jobStatus : 1
        }).then(res => {
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
      },      
      jumpToDepMes () {
        this.$router.push({
          path: '/departmentResourseDetails'
        })
      },
     //跳转页面
      queryHumanResource(){
        this.$router.push({
            path: '/projectHumanRosourceManagement',
        })
      },

      renderHeader2 (h, {column, $index}) {
        // return h('span', [
        //   h('span', column.label),
        //   h('i', {
        //     class: 'el-icon-question',
        //     style: 'color: red'
        //   })
        // ])
        return (
          <div>
            <span>总投入值</span>
            <el-popover placement="top-start" width="200" trigger="hover" content="如果是部门维度，则为人员参与所有项目的总投入；如果是项目维度，则为人员在此项目的投入">
              <i class="el-icon-question" slot="reference"></i>
            </el-popover>
          </div>
        )
      },
      renderHeader (h, {column, $index}) {
        // return h('span', [
        //   h('span', column.label),
        //   h('i', {
        //     class: 'el-icon-question',
        //     style: 'color: red'
        //   })
        // ])
        return (
          <div>
            <span>姓名</span>
            <el-popover placement="top-start" width="200" trigger="hover" content="红色：投入值大于1.1；绿色：投入值在0.6至1.0之间；黄色：投入值在1.0至1.1之间；蓝色：投入值在0至0.6">
              <i class="el-icon-question" slot="reference"></i>
            </el-popover>
          </div>
        )
      },

      //在进行总计处理的时候忽略显示项目等按钮
      showbutton(data)
      {
        let item=data.personRealName
        if(item==='总计')
        {
          return false
        }
        else{
          return true
        }
      },

      //val每页显示最大条数发生改变
      handleSizeChange(val,index) {
        this.$set(this.tableData[index], 'startNum', 1)
        this.$set(this.tableData[index], 'range', val)
        this.RequestName=this.tableData[index].name//获取请求的部门/项目名
        this.getPage(index)//查询
      },
      //val是当前显示的是哪页,重新查询出来一个数据.data.staffLoad存储进去，然后把这个数据替换掉tableData[index]
      handleCurrentChange(val,index) {
        // this.tableData[index].startNum=val //改变请求数据，这样会改变tableDate但是不会重新渲染
        this.RequestName=this.tableData[index].name
        this.$set(this.tableData[index], 'startNum', val)
      // alert(this.RequestName)
        this.getPage(index)
      },
      //根据姓名和域账号进行查询
      queryRNAN()
      {
        this.getLoadByData()
      },

      //按照指定信息查询数据
      getLoadByData()
      {
        let data={
          loadType:this.loadType,
          personRealName:this.personRealName,
          personAccountName:this.personAccountName,
          departmentName:this.DepartmentName,
          departmentLevel:this.DepartmentLevel,
          projectName:this.ProjectName,
          startNum:this.startNum,
          range:this.range
        }
        getAllStaffLoad(data)
        .then(res => {
          if (res.state === 1000) {
            // this.loading = false
            if(res.data.staffLoad.length==0)
            {
              this.showtable=false
            }
            else{
              this.showtable=true
            }
            this.tableData=[]
            res.data.staffLoad.forEach((item,index,array) =>
            {
              this.tableData.push(item)
            })
            //把所有人员提到最前面去
            this.tableData.forEach((ele,index,array) =>
            {
              if(ele.name=='所有人员')
              {
                let tempDate=ele
                array[index]=array[0]
                array[0]=tempDate
              }
            })
            //改变每个人员类型(把数字改成文字)
            this.tableData.forEach((ele,index,array) =>
            {
              //遍历每一个details
              ele.details.forEach((ele,index,array) =>
            {
              ele.personType=this.presonChart[ele.personType]
            })
            })
            //添加分页元素
            for(let index in this.tableData)
            {
              this.tableData[index].startNum=1
              this.tableData[index].range=5
            }
            //添加总计负载元素
            if(this.DepartmentLevel!='')
            {
            for(let index in this.tableData)
            {
              this.tableData[index].details.push({
                "personRealName":"总计",
                "personAccountName":"全部: "+this.tableData[index].total+"(人)",
                "orgName":"过度负载: "+this.tableData[index].summary.heavyLoad+"(人)",
              })
            }
            }


            if(this.CategoryType == 1)//按部门
            {

                 //修改总计的CSS样式，再选择项目的时候把它消失掉
                    this.$nextTick(() => {
                      var list= document.getElementsByTagName("tbody")
                    var arr=Array.prototype.slice.call( list )
                    arr.forEach((ele,index)=>{
                      if(ele.children.length>0)
                      {        
                        var temp=Array.prototype.slice.call(ele.getElementsByClassName("el-table__row"))
                        temp.forEach((ele,index)=>{
                          //先设置每一行的背景色为白色
                          ele.style.backgroundColor='white'
                          //再把每一行的每个元素设置为浅黑色
                          let Tdarr= Array.prototype.slice.call(ele.getElementsByTagName("td"))
                          Tdarr[0].style.fontWeight='500'
                          Tdarr[1].style.color='#606266'
                          Tdarr[2].style.color='#606266'
                        })
                      }

                    })
                    })

             this.$nextTick(() => {
                    var list= document.getElementsByTagName("tbody")
                    var arr=Array.prototype.slice.call( list )
                    arr.forEach((ele,index)=>{
                      if(ele.children.length>0)
                      {        
                        var temp=Array.prototype.slice.call(ele.getElementsByClassName("el-table__row"))
                        temp[temp.length-1].style.backgroundColor='#E4E7ED'
                        let Tdarr=Array.prototype.slice.call(temp[temp.length-1].getElementsByTagName("td"))
                        Tdarr[0].style.fontWeight='600'//字体
                        Tdarr[1].style.color='black'//黑
                        Tdarr[2].style.color='red'//红
                      }

                    })
             })
           
            }
            else{

                  //修改总计的CSS样式，再选择项目的时候把它消失掉
                  this.$nextTick(()=>{
                                        var list= document.getElementsByTagName("tbody")
                    var arr=Array.prototype.slice.call( list )
                    arr.forEach((ele,index)=>{
                      if(ele.children.length>0)
                      {        
                        var temp=Array.prototype.slice.call(ele.getElementsByClassName("el-table__row"))
                        temp.forEach((ele,index)=>{
                          //先设置每一行的背景色为白色
                          ele.style.backgroundColor='white'
                          //再把每一行的每个元素设置为浅黑色
                          let Tdarr= Array.prototype.slice.call(ele.getElementsByTagName("td"))
                          Tdarr[0].style.fontWeight='500'
                          Tdarr[1].style.color='#606266'
                          Tdarr[2].style.color='#606266'
                        })
                      }
                    })
                  })

            }

            
            
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
        //为了实现分页，点击每个卡片单独对卡片内容进行变化而写的函数
        getPage(index)
        {
        // this.loading = true
        // alert(11111)
        console.log(this.tableData[index].range)
        let data={}
        //按部门
        if(this.CategoryType == 1)
        {
          if(index==0)
          {
            data={
                loadType:this.loadType,
                personRealName:this.personRealName,
                personAccountName:this.personAccountName,
                departmentName:this.RequestName,
                departmentLevel:1,
                projectName:this.ProjectName,
                startNum:this.tableData[index].startNum,
                range:this.tableData[index].range
                }
          }
          else{
            data={
              loadType:this.loadType,
              personRealName:this.personRealName,
              personAccountName:this.personAccountName,
              departmentName:this.RequestName,
              departmentLevel:2,
              projectName:this.ProjectName,
              startNum:this.tableData[index].startNum,
              range:this.tableData[index].range
               }
          }
        }
        //按项目
        else{
          data={
          loadType:this.loadType,
          personRealName:this.personRealName,
          personAccountName:this.personAccountName,
          departmentName:'',
          departmentLevel:'',
          projectName:this.RequestName,
          startNum:this.tableData[index].startNum,
          range:this.tableData[index].range
           }
        }
       //  console.log(typeof this.CategoryType)
        getAllStaffLoad(data)
        .then(res => {
          if (res.state === 1000) {
            console.log(data)
            this.loading = false
            this.PageData = res.data.staffLoad
            //添加总计负载元素
            if(this.DepartmentLevel!='')
            {
              this.PageData[0].details.push({
                "personRealName":"总计",
                "personAccountName":"全部: "+this.tableData[index].total+"(人)",
                "orgName":"过度负载: "+this.tableData[index].summary.heavyLoad+"(人)",
              })
            }
            //改变每个人员类型
              //遍历每一个details
              this.PageData[0].details.forEach((ele,index,array) =>
            {
              ele.personType=this.presonChart[ele.personType]
            })
            this.PageData[0].startNum=this.tableData[index].startNum
            this.PageData[0].range=this.tableData[index].range

            
            this.$set(this.tableData,index,this.PageData[0])


            //分页以后也要重新渲染总计的颜色
            if(this.CategoryType == 1)//按部门
            {

                 //修改总计的CSS样式，再选择项目的时候把它消失掉
                    this.$nextTick(() => {
                      var list= document.getElementsByTagName("tbody")
                    var arr=Array.prototype.slice.call( list )
                    arr.forEach((ele,index)=>{
                      if(ele.children.length>0)
                      {        
                        var temp=Array.prototype.slice.call(ele.getElementsByClassName("el-table__row"))
                        temp.forEach((ele,index)=>{
                          //先设置每一行的背景色为白色
                          ele.style.backgroundColor='white'
                          //再把每一行的每个元素设置为浅黑色
                          let Tdarr= Array.prototype.slice.call(ele.getElementsByTagName("td"))
                          Tdarr[0].style.fontWeight='500'
                          Tdarr[1].style.color='#606266'
                          Tdarr[2].style.color='#606266'
                        })
                      }

                    })
                    })

             this.$nextTick(() => {
                    var list= document.getElementsByTagName("tbody")
                    var arr=Array.prototype.slice.call( list )
                    arr.forEach((ele,index)=>{
                      if(ele.children.length>0)
                      {        
                        var temp=Array.prototype.slice.call(ele.getElementsByClassName("el-table__row"))
                        temp[temp.length-1].style.backgroundColor='#E4E7ED'
                        let Tdarr=Array.prototype.slice.call(temp[temp.length-1].getElementsByTagName("td"))
                        Tdarr[0].style.fontWeight='600'//字体
                        Tdarr[1].style.color='black'//黑                
                        Tdarr[2].style.color='red'//红
                      }

                    })
             })
           
            }
            
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

        //点击显示项目按钮触发的函数
        showProject(rowData)
        {
          let data = {
                  accountName: rowData.personAccountName
                 }
          
          getSelectedProjects(data)
          .then(res => {
            if (res.state === 1000) {
              // this.AllProjects=array
                this.AllProjects.splice(0,this.AllProjects.length)
              let array = res.data.projectNameList
              if (array == null) {
                this.AllProjects.splice(0,this.AllProjects.length)
              }
              else{
                //先去除掉空的
                array.forEach((ele,index,array) =>{
                  if(ele=="")
                  {
                    array.splice(index,1)
                  }
                })
                console.log(array)

                if(array!==null)
                {
                array=array.map(ele =>{
                    return {projectName:ele}
                  })
                  this.AllProjects=array
                // this.AllProjects = array
                }
              }
            } else {
               this.$message.error(res.message);
            }
          }, rej => {
            this.errorAjax()
          })
          this.showDialogProject=true
        },

        //管理项目(点击管理项目按钮查询所有项目列表)
        projectManage(rowData)
        {
          //先获取这一行的域账号
          this.userId=rowData.personAccountName
          let data={
            projectName:''
          }
          //获取全部项目名
          getProjectList(data)
            .then(res => {
              if (res.state === 1000) {
                let array = res.data.projectNameList
                array=array.map(ele =>{
                  return {label:ele,type: 'project',disabled: false}
                })
                this.canSelectUser = [{
                  label: '所有项目',
                  children: array
                }]
                console.log(this.canSelectUser)
                this.showDialogUserProject = true
                //查询已选的项目
                let data = {
                  accountName: rowData.personAccountName
                }
                getSelectedProjects(data)
                  .then(res => {
                    if (res.state === 1000) {
                      let array = res.data.projectNameList

                      //先去除掉空的
                      array.forEach((ele,index,array) =>{
                        if(ele=="")
                        {
                          array.splice(index,1)
                        }
                      })

                      if(array!==null)
                      {
                       array=array.map(ele =>{
                          return {userProject:ele}
                        })
                      this.haveBindProject = array
                      }
                      else if(array===null)
                      {
                        this.haveBindProject=[]
                      }
                      this.stopSelect()
                    } else {
                       this.$message.error(res.message);
                    }
                  }, rej => {
                    this.errorAjax()
                  })
              } else {
                 this.$message.error(res.message);
              }
            }, rej => {
              this.errorAjax()
            })
        },
        //在显示全部项目之前，把那些已选的项目ban掉
        stopSelect () {
          this.haveBindProject.forEach(eleOne => {
            this.canSelectUser.map(eleTwo => {
              return {
                label: eleTwo.label,
                children: eleTwo.children.map(eleThree => {
                  if (eleOne.userProject === eleThree.label) {
                    this.$set(eleThree, 'disabled', true)
                  }
                })
              }
            })
          })
        },
          //查询项目
          queryProject(){
          let data={
               projectName:this.inputProject
              }
          getProjectList(data)
            .then(res => {
              if (res.state === 1000) {
                let array = res.data.projectNameList
                let arr=[]

                //先去除掉空的
                array.forEach((ele,index,array) =>{
                  if(ele=="")
                  {
                    array.splice(index,1)
                  }
                })

                arr=array
                arr=arr.map(ele =>{
                  return {label:ele,type: 'project',disabled: false}
                })
                this.canSelectUser = [{
                  label: '所有项目',
                  children: arr
                }]
                //把选择出来的项目名，根据已选的项目，重复的ban掉
                this.haveBindProject.forEach(eleOne=>{
                  this.canSelectUser[0].children.forEach(eleTwo=>{
                    if(eleOne.userProject==eleTwo.label){
                      this.$set(eleTwo,'disabled',true)
                    }
                  })
                })                
                console.log(this.canSelectUser)
                
                this.inputProject=''
              }
            })
        },
        //待选择用户数组
        getSelectNode () {
          this.prepareSelectUser = []
          //已选择的项目放在arr里
          let arr=[]
          arr= this.haveBindProject.map(ele => {
            return ele.userProject
          })
          //把勾选项目根据已选择的项目，把重复的排除
          this.$refs.tree.getCheckedNodes().forEach(ele => {
            if (ele.type === 'project') {
              if(arr.indexOf(ele.label) < 0)
              {
                this.prepareSelectUser.push(ele)
              }
            }
          })
        },
        //点击添加项目按钮
        addProject () {
        this.haveBindProject.push(...this.prepareSelectUser.map(ele => {
        return {
          userProject: ele.label
        }
        }))
        // 禁用已经选择的
        this.haveBindProject.forEach(eleOne => {
        this.canSelectUser.map(eleTwo => {
          return {
            label: eleTwo.label,
            children: eleTwo.children.map(eleThree => {
              if (eleOne.userProject === eleThree.label) {
                this.$set(eleThree, 'disabled', true)
              }
            })
          }
         })
        })

        this.prepareSelectUser={}
        },
        //确认关闭
        clickOther (done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done()
            })
        },
        //左边点击节点元素会触发函数，给preAddProject传值
        handleNodeClickProject (data) {
          // if (data.label !== '所有项目') {
          //  this.preAddProject = data.label
          // }
        },
        //点击删除按钮，移除haveBindProject数据
        deleteBindProject (index) {
        this.canSelectUser.map(eleTwo => {
          return {
            label: eleTwo.label,
            children: eleTwo.children.map(eleThree => {
              if (this.haveBindProject[index].userProject === eleThree.label) {
                this.$set(eleThree, 'disabled', false)
              }
            })
          }
         })
          this.haveBindProject.splice(index, 1)
        },
        //选完点击确定和取消按钮
        closeDialogBindProject (action) {
          if (action === 'close') {
            this.showDialogUserProject = false
          }
          if (action === 'confirm') {
            let arr = []
            this.haveBindProject.forEach(ele => {
              arr.push(ele.userProject)
            })
            let updatestr= arr.join(',')
            let data={
              updatedProjects: updatestr,
              accountName: this.userId
            }
            updateSelectedProjects(data).then(res => {
              if (res.state === 1000) {
                this.haveBindProject=[]
                this.showDialogUserProject = false
              } else {
                 this.$message.error(res.message);
              }
            }, rej => {
              this.errorAjax()
            })
          }
        },
        errorAjax () {
          this.$message({
            type: 'error',
            message: '失败',
            duration: 1000
          })
        },
        error()
        {
          this.$message({
          type: 'error',
          message: '网络异常',
          duration: 1000
        })
        },
        },
    created () {
         this.showDialogHistory = false
         this.getLoadByData()
      },
      watch: {
        toProjectName (val) {
          this.DepartmentName =''
          this.DepartmentLevel=''
          this.ProjectName = val
          this.CategoryType=0 //按项目
          if(val!=='')
          {
            this.getLoadByData()
          }
          if(val!=='')
          {
            this.getLoadByData()
          }
        },
        toDepartmentName(val) {
          this.ProjectName = ''
          this.DepartmentName =val
          this.DepartmentLevel=this.toDepartmentLevel
          if(val!=='')
          {
            this.getLoadByData()
          }

          
        }
      }

}
</script>

<style >
.resourceApp3{
  width: 1180px;
}
.resourceApp3 > .top {
  margin-top: 20px;
  margin-bottom: 40px;
  position: relative
}
.resourceApp3 > .top >.el-input {
    width: 150px;
    margin-right: 20px;
}
.resourceApp3 > .top >.el-button {
    margin-left: 30px;
}
.resourceApp3 > .top >.el-select {
    margin-left: 200px;
}
.resourceApp3 > .top > .el-button:nth-of-type(1) {
  margin-left: 100px
}
.resourceApp3 > .top > .el-button:nth-of-type(2) {
  margin-left: 280px
}
.resourceApp3 > .container3 {
width: 1148px;
  margin: 10px 0 20px 20px;
  min-height: 200px
}
.resourceApp3 > .top > .el-input {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
}
.resourceApp3 > .container3 > .tb > .el-pagination{
  float: left;
  margin-left: 10px;
  margin-right: 30px;
}
 .container3 .light #fullLoad {
  /* display: inline-block; */
  width: 12px;
  height: 12px;
  background:#E6A23C;
  border-radius: 50%;
  float: left;
  margin-top: 5px
}
 .container3 .light #normalLoad{
  /* display: inline-block; */
  width: 12px;
  height: 12px;
  background:#67C23A;
  border-radius: 50%;
  float: left;
  margin-top: 5px
}
 .container3 .light #lowLoad {
  /* display: inline-block; */
  width:12px;
  height:12px;
  background: #409EFF;
  border-radius: 50%;
  float: left;
  margin-top: 5px
}
 .container3 .light #heavyLoad {
  /* display: inline-block; */
  width: 12px;
  height: 12px;
  background:#F56C6C;
  border-radius: 50%;
  float: left;
  margin-top: 5px
}
.container3 .light #context {
float: left;
margin-left: 8px
}
.resourceApp3 > .projectDialog > .el-dialog > .el-dialog__body{
  height: 450px;
  overflow-y:auto
}
.resourceApp3 > .bindProject > .el-dialog{
  width: 1000px;
  height: 600px
}

.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left > .query{
  width: 100%;
  float: left;
  position: relative;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left > .query >.el-button{
  width: 23%;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left > .query >.el-input{
  width:75%;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 398px;
  overflow-y: auto
}
.resourceApp3 > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}



</style>