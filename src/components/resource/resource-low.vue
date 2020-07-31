<template>
<!-- 选择栏模块 -->
  <div class="resourceApp">
    <div class="top">
      <el-input v-model="personRealName" placeholder="请输入姓名"  ></el-input>
      <el-input v-model="personAccountName" placeholder="请输入域账号"  ></el-input>
      <el-button type="primary" @click="queryRNAN">查询</el-button>
   </div >

<div class="container">
  <template v-if="!query">
    <el-card class="box-card" v-for="(item, index) in tableData" :key="index" style="margin-bottom: 20px">
        <span v-text="item.name"></span>
   <div class="tb">
   <br>
   <!-- 按项目 -->
    <el-table 
    v-if="CategoryType === 0"
    :data="item.details"
    border
    style="width: 100%"
    empty-text
    v-loading="loading"
    tooltip-effect="dark"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-table-column prop="personRealName" label="姓名" width="150" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
            <span id="lowLoad" v-if="scope.row.manpower <=3"></span>
            <span id="normalLoad" v-if="scope.row.manpower > 3 && scope.row.manpower < 5"></span>
            <span id="heavyLoad" v-if="scope.row.manpower >= 5"></span>
          </template>
      </el-table-column>
    <el-table-column prop="personAccount" label="域账号" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="orgName" label="部门"  align="center" width="160" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="projectName" label="所在项目"  align="center" width="150" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="personType" label="人员类型"  align="center" width="150" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="manpower" label="投入值"  align="center" width="150" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="operating" label="操作"  align="center" width="195" show-overflow-tooltip>
      <template slot-scope="scope">
          <el-button @click="findhistory(scope.row)" type="text" >历史记录</el-button>
        </template>
      </el-table-column>
  </el-table>

<!-- 按部门 -->
  <el-table 
    v-if="CategoryType === 1"
    :data="item.details"
    border
    style="width: 100%"
    empty-text
    v-loading="loading"
    tooltip-effect="dark"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-table-column prop="personRealName" label="姓名" width="150"  align="center" show-overflow-tooltip>
        <template slot-scope="scope">
        <span id="lowLoad" v-if="scope.row.totalManpower <=3"></span>
        <span id="normalLoad" v-if="scope.row.totalManpower > 3 && scope.row.manpower < 5"></span>
        <span id="heavyLoad" v-if="scope.row.totalManpower >= 5"></span>
        <span >{{scope.row.personRealName}}</span>
      </template>
      </el-table-column>
    <el-table-column prop="personAccount" label="域账号"  width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="orgName" label="部门" width="160" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="AllProject" label="所在项目" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="personType" label="人员类型" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="totalManpower" label="投入值" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
    <el-table-column prop="operating" label="操作" width="195" align="center" show-overflow-tooltip>
      <!-- <template slot-scope="scope">
          <el-button @click="findhistory(scope.row)" type="text" >历史记录</el-button>
      </template> -->
      <template slot-scope="scope">
          <el-button @click="projectManage(scope.row)" type="text" >管理项目</el-button>
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
  <!-- 查看历史记录的弹窗(日历模块) 已停用-->
    <el-dialog
    :before-close="handleClose"
    title="历史记录"
    :visible.sync="showDialogHistory"
    width="80%">
    <span>查看历史记录</span>
    <el-calendar :value='calendardate'>
      
    <!-- slot消失就没9-30而是30，而且勾勾也没了，slot-scope没了就啥都显示不了 -->
    <!-- scoped-slot 可以获取到 date（当前单元格的日期 -->
    <template
      slot="dateCell"
      slot-scope="{date, data}"
      >
      <p >
        {{ data.day.split('-').slice(2).join('-') }}
        <!-- {{data}} -->
        <!-- 好好学习 -->
      </p>
    </template>
  </el-calendar>
  </el-dialog>

  <!-- 项目管理模块 show-close是否显示关闭按钮-->
  <el-dialog :visible.sync="showDialogUserProject" :show-close="hide" :before-close="clickOther" class="bindProject">
    <div class="left">
      <h2>待选择项目列表</h2>
      <div class="query">
      <el-input v-model="inputProject" placeholder="请输入内容" size="medium"></el-input>
      <el-button type="primary" size="small" @click="queryProject">查询</el-button>
      </div>
      <el-tree :data="bindProject" @node-click="handleNodeClickProject" accordion empty-text node-key="id"></el-tree>
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

</div>
</template>

<script>
import {getStaffLoadByOrginzation,getStaffLoadByProject,getStaffHistoryLoad,getProjectList,getSelectedProjects,updateSelectedProjects} from  '../../api/api'
export default {
    data() {
      return {
        inputProject:'',//查询项目名变量
        userId:'',
        showDialogUserProject:false,
        haveBindProject: [],//根据域账号查询到的项目列表 每一个元素是{userProject:i}
        preAddProject:'',  //预添加的项目值
        bindProject: [],   //获取的全部项目数组每一个是一个对象[{label: '用户组信息',children: array}]
        showDialogProjectManage:false,
        hide:false,
        calendardate: '',
        showcalendar:false,
        query: false,
        personAccountName: '',
        personRealName:'',
        loadType: '1',
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
      ShowDate: new Date()
      }
    },

    props: ['toChildrenValue'],

    methods:{
      //val每页显示最大条数发生改变
      handleSizeChange(val,index) {
        console.log(val)
        //this.count = val
         this.tableData[index].startNum =1
        this.tableData[index].range=val
        console.log(this.tableData[index].range)
        this.RequestName=this.tableData[index].name//获取请求的部门/项目名
        this.getPage(index)//查询
      },
      //val是当前显示的是哪页,重新查询出来一个数据.data.staffLoad存储进去，然后把这个数据替换掉tableData[index]
      handleCurrentChange(val,index) {
        this.tableData[index].startNum=val //改变请求数据
        console.log(this.tableData[index].startNum)
        this.RequestName=this.tableData[index].name
        console.log(this.tableData[index].startNum)
      // alert(this.RequestName)
        this.getPage(index)
      },
      //根据姓名和域账号进行查询
      queryRNAN()
      {
        if(this.CategoryType==1)
        {
          this.initTableRoleData()//按部门查
        }
        else{
          this.getLoadByProject()//按项目查
        }
        
      },
      //按项目查找
        getLoadByProject()
        {
        this.tableData=[]
        this.loading = true
         let data = {
            loadType: this.loadType,
            personRealName: this.personRealName,
            personAccountName: this.personAccountName,
            startNum: 1,
            range:5
         }
        getStaffLoadByProject(data)
        .then(res => {
          if (res.state === 1000) {
            this.loading = false
            res.data.staffLoad.forEach((item,index,array) =>
            {
                this.tableData.push(item)
            })
            for(let index in this.tableData)
            {
              this.tableData[index].startNum=1
              this.tableData[index].range=5
            }
            console.log(this.tableData)
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })

      },
      //按部门查找信息
      initTableRoleData() {
      this.tableData=[]
      this.loading = true
      let data = {
        loadType: this.loadType,
        personRealName: this.personRealName,
        personAccountName: this.personAccountName,
        startNum: 1,
        range:5
      }
      getStaffLoadByOrginzation(data)
        .then(res => {
          if (res.state === 1000) {
            this.loading = false
            res.data.staffLoad.forEach((item,index,array) =>
            {
              this.tableData.push(item)
            })
            
            //tableDate添加AllProject元素
              this.tableData.forEach((item,index,array)=>
              {
                // console.log(typeof item)
                let tempArr=item.details
                tempArr.forEach((item,index,array) =>
                {
                  var tempstr=""
                  item.projects.forEach((item,index,array) =>{
                    tempstr+=item.projectName+','
                    let length=tempstr.length
                    tempstr=tempstr.slice(0,length-1)
                    
                  })
                   item.AllProject=tempstr
                })
              })

            //添加分页元素
            for(let index in this.tableData)
            {
              this.tableData[index].startNum=1
              this.tableData[index].range=5
            }
            //this.tableData = res.data.staffLoad
          } else {
            setTimeout(() => {
              this.error()
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
        this.loading = true
        let data={}
        if(this.CategoryType == 1)
        {
            data = {
            loadType: this.loadType,
            personRealName: this.personRealName,
            personAccountName: this.personAccountName,
            organizationName: this.RequestName,
            startNum: this.tableData[index].startNum,
            range: this.tableData[index].range
            }
        }
        else{
            data = {
            loadType: this.loadType,
            personRealName: this.personRealName,
            personAccountName: this.personAccountName,
            projectName: this.RequestName,
            startNum: this.tableData[index].startNum,
            range: this.tableData[index].range
            }
        }
       //  console.log(typeof this.CategoryType)
        if(this.CategoryType === 1)//1就是按部门
        {
        getStaffLoadByOrginzation(data)
        .then(res => {
          if (res.state === 1000) {
            this.loading = false
            this.PageData = res.data.staffLoad
            this.PageData[0].startNum=this.tableData[index].startNum
            this.PageData[0].range=this.tableData[index].range
            console.log(this.PageData)
            this.tableData[index]=this.PageData[0]
            //console.log(this.PageData)
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
        }
        else  //0就是按项目
        {
          //alert(1)
        getStaffLoadByProject(data)
        .then(res => {
          if (res.state === 1000) {
            this.loading = false
            this.PageData = res.data.staffLoad
            this.PageData[0].startNum=this.tableData[index].startNum
            this.PageData[0].range=this.tableData[index].range
            this.tableData[index]=this.PageData[0]
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
        }
        },




        //管理项目(点击管理项目按钮查询所有项目列表)
        projectManage(rowData)
        {
          //先获取这一行的域账号
          this.userId=rowData.accountName
          let data={
            projectName:''
          }
          //获取全部项目名
          getProjectList(data)
            .then(res => {
              if (res.state === 1000) {
                let array = res.data.projectNameList
                let arr=[]
                for (var i = 0; i < array.length; i++) {
                  arr[i] = {label: ''}
                }
                for(let i=0;i<array.length;i++)
                {
                  arr[i].label=array[i]
                }
                this.bindProject = [{
                  label: '所有项目',
                  children: arr
                }]
                console.log(this.bindProject)
                this.showDialogUserProject = true
                let data = {
                  accountName: rowData.personAccount
                }
                getSelectedProjects(data)
                  .then(res => {
                    if (res.state === 1000) {
                      let array = res.data.projectNameList
                      if(array!==null)
                      {
                       let arr=[]
                       for(let i=0;i<array.length;i++)
                       {
                        arr[i] = {userProject: ''}
                       }
                       for(let i=0;i<array.length;i++)
                       {
                         arr[i].userProject=array[i]
                       }
                      this.haveBindProject = arr
                      }
                      else if(array===null)
                      {
                        this.haveBindProject=[]
                      }
                    } else {
                      this.errorAjax()
                    }
                  }, rej => {
                    this.errorAjax()
                  })
              } else {
                this.errorAjax()
              }
            }, rej => {
              this.errorAjax()
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
                for (var i = 0; i < array.length; i++) {
                  arr[i] = {label: ''}
                }
                for(let i=0;i<array.length;i++)
                {
                  arr[i].label=array[i]
                }
                this.bindProject = [{
                  label: '所有项目',
                  children: arr
                }]
                this.inputProject=''
              }
            })
        },
        //点击添加项目按钮
        addProject () {
          let tableDataArr = []
          //把右边的查询到的项目haveBindProject的userProject放在一个新数组tableDataArr以至于临时添加或者删除
          this.haveBindProject.forEach(ele => {
            tableDataArr.push(ele.userProject)
          })
          //判断是否有重复
          if (tableDataArr.indexOf(this.preAddProject) === -1) {
            let data = {
              userProject: this.preAddProject
            }
            if (data.userProject !== '') {
              this.haveBindProject.push(data)
            }
          } else {
            this.$message({
              type: 'warning',
              message: '绑定角色重复',
              duration: 1000
            })
          }
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
          if (data.label !== '所有项目') {
           this.preAddProject = data.label
          }
        },
        //点击删除按钮，移除haveBindProject数据
        deleteBindProject (index) {
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
                this.errorAjax()
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




      //下述为查询历史记录所用函数，现在已经删除
            //获取当前里的日期（月份），获取全局变量的值，放在CurrentDate里
        getCurrentDate () {
        var nowdate =this.ShowDate //获取全局变量的值，放在CurrentDate里
        //console.log(nowdate.getMonth())  nowdate.getMonth()+1
        var year=nowdate.getFullYear()
        var mouth=function()
        {
          if(nowdate.getMonth()+1 <10)
          {
            return '0'+(nowdate.getMonth()+1)
          }
          else
          {
            return (nowdate.getMonth()+1)
          }
        }
        this.CurrentDate2=year+'-'+mouth()//给上月下月当天用的
        //console.log(typeof this.CurrentDate)
      },
      //关闭日历按钮触发函数
        handleClose()
        {
          this.CurrentDate2=this.ShowDate
          this.showDialogHistory=false
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
          //查询历史记录（点击历史记录按钮触发的函数）
        findhistory(rowData)
        { 
        var nowdate =this.ShowDate //获取全局变量的值，放在CurrentDate里
        //console.log(nowdate.getMonth())  nowdate.getMonth()+1
        var year=nowdate.getFullYear()
        var mouth=function()
        {
          if(nowdate.getMonth()+1 <10)
          {
            return '0'+(nowdate.getMonth()+1)
          }
          else
          {
            return (nowdate.getMonth()+1)
          }
        }
        this.CurrentDate=year+'-'+mouth()//给点击历史记录用的
        this.showDialogHistory = true
        this.showDialogHistoryData = rowData
        //console.log(rowData)
        this.queryHistory()
      },
      //查询历史负载信息（点击历史记录按钮）
        queryHistory()
        {
        let data = {
          personAccountName: this.showDialogHistoryData.personAccount,
          yearMonth: this.CurrentDate
        }
        getStaffHistoryLoad(data)
        .then(res => {
          if (res.state === 1000) {
            this.historyData = res.data
            console.log(this.historyData)
            //把日期都换成9，11，21的形式
            for(let index in this.historyData)
            {
             var newKey = parseInt(index.slice(8))  //将字符串转成数字2019-08-11换成newkey=11
            //  console.log(index)
            //  console.log(this.historyData[index])
             this.historyData[newKey] = this.historyData[index]
             delete this.historyData[index]
            }
          console.log(this.historyData)
          let curArr = document.getElementsByClassName('current')//获取当前current的标签集
          this.$nextTick(() => {
            //console.log(curArr)
            //console.log(Object.values(curArr))
            let newCurArr = Object.values(curArr)//将HTMLCollection转化成数组
            console.log(newCurArr)
            newCurArr.forEach((ele, index, array) => {
              ele.children[0].children[0].innerHTML=index+1
            })
            newCurArr.forEach((ele, index, array) => {
                            //console.log(ele.children[0].children[0].innerHTML)
              //  ele.children[0].children[0].innerHTML=ele.children[0].children[0].innerHTML.slice(0,2)
               
              // ele.innerHTML=ele.children[0].children[0].innerHTML
              if(typeof(this.historyData[index+1])!="undefined")
              {
                let arr=this.historyData[index+1].details //这是我们已经查取到的historyData内容细节
                // console.log(arr)
                let message = ''
                for(let index in arr)
                {
                  message+=(arr[index].projectName+':'+arr[index].manPowerValue+'</br>')//完成message
                }
                ele.children[0].children[0].innerHTML = ele.children[0].children[0].innerHTML + '</br>' + message
                ele.style.overflowY = 'hidden'
                let title=''
                for(let index in arr)
                {
                  title+=(arr[index].projectName+':'+arr[index].manPowerValue+';        ')//完成message
                }
                ele.setAttribute('title',title)
                // alert(message.length)
              }
              // console.log(this.historyData[index+1])
              // array[index].innerHTML = ele.innerHTML + this.historyData[index+1]
            })
          })
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
        },
      //查询历史记录，为（上下页）
        queryHistory2()
        {
          let data = {
          personAccountName: this.showDialogHistoryData.personAccount,
          yearMonth: this.CurrentDate2
        }
        getStaffHistoryLoad(data)
        .then(res => {
          if (res.state === 1000) {
            this.historyData = res.data
            console.log(this.historyData)
            //把日期都换成9，11，21的形式
            for(let index in this.historyData)
            {
             var newKey = parseInt(index.slice(8))  //将字符串转成数字2019-08-11换成newkey=11
            //  console.log(index)
            //  console.log(this.historyData[index])
             this.historyData[newKey] = this.historyData[index]
             delete this.historyData[index]
            }
          console.log(this.historyData)
          let curArr = document.getElementsByClassName('current')//获取当前current的标签集
          this.$nextTick(() => {
            //console.log(curArr)
            //console.log(Object.values(curArr))
            let newCurArr = Object.values(curArr)//将HTMLCollection转化成数组
            console.log(newCurArr)
            newCurArr.forEach((ele, index, array) => {
              ele.children[0].children[0].innerHTML=index+1
            })
            newCurArr.forEach((ele, index, array) => {
              //console.log(ele.children[0].children[0].innerHTML)
              //  ele.children[0].children[0].innerHTML=ele.children[0].children[0].innerHTML.slice(0,2)
               
              // ele.innerHTML=ele.children[0].children[0].innerHTML
              if(typeof(this.historyData[index+1])!="undefined")
              {
                let arr=this.historyData[index+1].details //这是我们已经查取到的historyData内容细节
                // console.log(arr)
                let message = ''
                for(let index in arr)
                {
                  message+=(arr[index].projectName+':'+arr[index].manPowerValue+'</br>')//完成message
                }
                ele.children[0].children[0].innerHTML = ele.children[0].children[0].innerHTML + '</br>' + message
                // alert(message.length)
              }
              // console.log(this.historyData[index+1])
              // array[index].innerHTML = ele.innerHTML + this.historyData[index+1]
            })
          })
          } else {
            setTimeout(() => {
              this.error()
            }, 100)
          }
        }, rej => {
          setTimeout(() => {
            this.error()
          }, 100)
        })
        },
    created () {
         this.CategoryType=this.toChildrenValue
         this.showDialogHistory = false
         if(this.CategoryType === 1)
         {
           this.initTableRoleData()
         }
         else
         {
           this.getLoadByProject()
         }
         //日历中的上个月下个月今天
         window.addEventListener('click', (evn) => {
           //console.log(evn.target.innerHTML.trim())
          if (evn.target.innerHTML.trim() === '上个月') {
            //alert('上个月')
            this.ShowDate.setMonth(this.ShowDate.getMonth()-1)
            //console.log(this.ShowDate.getMonth())
            if(this.ShowDate.getMonth()<0)//如果减到头
            {
              this.ShowDate.setFullYear(this.ShowDate.getFullYear-1)
              this.ShowDate.setMonth(11)
              
            }
            console.log(this.ShowDate.getMonth())
            this.getCurrentDate()//更新CurrentDate2的值
          }
          if (evn.target.innerHTML.trim() === '下个月') {
            //alert('下个月')
            this.ShowDate.setMonth(this.ShowDate.getMonth()+1)
            //console.log(this.ShowDate.getMonth())
            if(this.ShowDate.getMonth()>11)//如果减到头
            {
              this.ShowDate.setFullYear(this.ShowDate.getFullYear+1)
              this.ShowDate.setMonth(0)
            }
            console.log(this.ShowDate.getMonth())
            this.getCurrentDate()//更新CurrentDate2的值
          }
           if (evn.target.innerHTML.trim() === '今天')
           {
              this.ShowDate.setFullYear(new Date().getFullYear())
             this.ShowDate.setMonth(new Date().getMonth())
             //console.log(this.ShowDate.getMonth())
            this.getCurrentDate()//更新CurrentDate的值
           }
         })
      },
      watch: {
        toChildrenValue (val) {
          this.CategoryType = val
          if(this.CategoryType === 1)
          {
            this.initTableRoleData()  //按部门
          }
          else
          {
            this.getLoadByProject()   //按项目
          }
        },
        CurrentDate2 (val) {
          this.queryHistory2()
          this.calendardate=val
        }
      }

}
</script>

<style>
.resourceApp{
  width: 1180px;
}
.resourceApp > .top {
  margin-top: 20px;
  margin-bottom: 40px;
  position: relative
}
.resourceApp > .top >.el-input {
    width: 150px;
    margin-right: 20px;
}
.resourceApp > .top >.el-button {
    margin-left: 30px;
}
.resourceApp > .top >.el-select {
    margin-left: 200px;
}
.resourceApp > .container {
width: 1148px;
  margin: 10px 0 20px 20px;
  min-height: 200px
}
.resourceApp > .top > .el-input {
  float: left;
  margin-left: 20px;
  width: 150px;
  margin-right: 30px;
}
.resourceApp > .container > .tb > .el-pagination{
  float: left;
  margin-left: 10px;
  margin-right: 30px;
}
#lowLoad {
  display: inline-block;
  width: 12px;
  height: 12px;
  background:rgba(82,204,171,1);
  border-radius: 50%
}
#normalLoad {
  display: inline-block;
  width:12px;
  height:12px;
  background:rgb(90, 28, 214);
  border-radius: 50%
}
#heavyLoad {
  display: inline-block;
  width: 12px;
  height: 12px;
  background:rgb(238, 19, 19);
  border-radius: 50%
}
.resourceApp > .bindProject > .el-dialog{
  width: 1000px;
  height: 600px
}

.resourceApp > .bindProject > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left > .query{
  width: 100%;
  float: left;
  position: relative;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left > .query >.el-button{
  width: 23%;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left > .query >.el-input{
  width:75%;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 398px;
  overflow-y: auto
}
.resourceApp > .bindProject > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}
</style>