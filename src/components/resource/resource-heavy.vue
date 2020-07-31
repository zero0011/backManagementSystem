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
      <template slot-scope="scope">
          <el-button @click="findhistory(scope.row)" type="text" >历史记录</el-button>
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
  <!-- 查看历史记录的弹窗(日历模块)-->
  <div>
  <el-dialog
  :before-close="handleClose"
  title="历史记录"
  :visible.sync="showDialogHistory"
  width="80%">
  <span>查看历史记录</span>
  <el-calendar :value='calendardate' >
    
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
  </div>
  </div>
</template>

<script>
import {getStaffLoadByOrginzation,getStaffLoadByProject,getStaffHistoryLoad} from  '../../api/api'
export default {
    data() {
      return {
        calendardate: '',
        showcalendar:false,
        query: false,
        personAccountName: '',
        personRealName:'',
        loadType: '3',
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
            console.log(this.tableData)
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
      }
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
            this.getCurrentDate()//更新CurrentDate的值

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
            this.getCurrentDate()//更新CurrentDate的值
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
          console.log(val)
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
          console.log(val)
          console.log(this.ShowDate)
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
</style>