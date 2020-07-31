<template>
  <div class="resourcePool">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item >资源池</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
   
   <main>
     <!-- <input type="text" placeholder="输入内容" style="position: absolute;top: 0px;right: 10px;z-index: 99;height: 36px"> -->
     <el-select v-model="departmentValue"  @change="DepartmentTypeChange" class="department">
      <el-option
        v-for="item in departmentOption"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
     </el-select>
     <el-select v-model="projectValue" @change="ProjectTypeChange" class="project" placeholder="请选择项目" >
      <el-option
        v-for="item in projectOption"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!-- <el-button type="primary" style="position: absolute;top: 0px;right: 110px;z-index: 1" @click="seeTotalData">数据统计</el-button> -->
     <!-- activeName等于哪个的name就显示哪个 -->
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="所有人员" name="all" >
      <allResource :tabName="activeName" v-if="activeName === 'all'" :toProjectName="bindProject" :toDepartmentName="bindDepartment" :toDepartmentLevel="bindDepartmentLevel"></allResource>
    </el-tab-pane>
    <el-tab-pane label="普通负载人员" name="first" >
      <lowResource :tabName="activeName" v-if="activeName === 'first'" :toProjectName="bindProject" :toDepartmentName="bindDepartment" :toDepartmentLevel="bindDepartmentLevel"></lowResource>
    </el-tab-pane>
    <el-tab-pane label="满负载人员" name="second">
      <normalResource :tabName="activeName" v-if="activeName === 'second'" :toProjectName="bindProject" :toDepartmentName="bindDepartment" :toDepartmentLevel="bindDepartmentLevel"></normalResource>
    </el-tab-pane>
    <el-tab-pane label="过度负载人员" name="third">
      <heavyResource :tabName="activeName" v-if="activeName === 'third'" :toProjectName="bindProject" :toDepartmentName="bindDepartment" :toDepartmentLevel="bindDepartmentLevel"></heavyResource>
    </el-tab-pane>
    <el-tab-pane label="空闲负载人员" name="fourth">
      <idleResource :tabName="activeName" v-if="activeName === 'fourth'" :toProjectName="bindProject" :toDepartmentName="bindDepartment" :toDepartmentLevel="bindDepartmentLevel"></idleResource>
    </el-tab-pane>
    <!-- <el-tab-pane label="地平线" name="fifth">
      <lowResource :tabName="activeName" v-if="true">
        <input type="text">
      </lowResource>
    </el-tab-pane> -->
  </el-tabs>
   </main>
</div>
</template>

<script>
import allResource from '../../components/newResource/resource-all'
import lowResource from '../../components/newResource/resource-low'
import heavyResource from '../../components/newResource/resource-heavy'
import normalResource from '../../components/newResource/resource-normal'
import idleResource from '../../components/newResource/resource-idle'
import {getAllStaffLoad,getAllDepartment,getAllProjectList} from  '../../api/api'
export default {
  components: {
    lowResource,
    heavyResource,
    normalResource,
    idleResource,
    allResource
  },
  data() {
    return {
      name: '',
      yid: '',
      activeName: 'all',
      bindValue: 1,
      allProject:[],
      projectOption:[],
      projectValue: '',
      departmentOption:[],
      departmentValue: '所有部门',
      departmentChat:'' , //部门名和部门级别对应表
      bindDepartment:'',//bind三参数是传过去的数值
      bindDepartmentLevel:'',
      bindProject:''
      

    }
  },
   methods: {
      error()
        {
          this.$message({
          type: 'error',
          message: '网络异常',
          duration: 1000
        })
        },
     //原数据统计函数
    //  seeTotalData () {
    //    this.$router.replace('/resourseStatistics')
    //  },
     //
      handleClick(tab) {
        this.activeName = tab.name;
        this.departmentValue='所有部门'
        this.projectValue=''
        this.bindDepartment='所有部门'//给子组件传值
        this.bindDepartmentLevel=1//给子组件传值
        this.bindProject=''
      },

      //部门项目发生改变执行函数(调用子组件函数和参数)   现在已经不用
      // CategoryTypeChange(val)
      // {
      //   this.bindValue = val
      // },
      //查询所有项目信息
      queryAllProject()
      {
        let data={}
        getAllProjectList(data).then(res => {
          if (res.state === 1000) {
            this.allProject=res.data.projects
            let arr=[]
            arr.push({value:'所有项目',label:'所有项目'})
            this.allProject.forEach(ele => {
              arr.push({value: ele,label: ele})
            });
            this.projectOption=arr
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
            arr.push({value:'所有部门',label:'所有部门',level:1})
            department.forEach(ele => {
              arr.push({value:ele.name,label:ele.name,level:ele.level})
            })
            //添加对应表
            let chat={}
            for(let i=0;i<arr.length;i++)
            {
              let temp=arr[i].value
              chat[temp]=arr[i].level
            }

            this.departmentChat=chat
            this.departmentOption=arr
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
      //部门信息改变
      DepartmentTypeChange(val)
      {
        this.projectValue=''//显示的值更换
        this.bindProject=''
        this.bindDepartment=val
        this.bindDepartmentLevel=this.departmentChat[val]
      },
      //项目信息改变
      ProjectTypeChange(val)
      {
        this.bindDepartment=''
        this.bindDepartmentLevel=''
        this.departmentValue=''//显示的值更换
        this.bindProject=val
      }
    },
    created()
    {
      this.queryAllProject()
      this.queryAllDepartment()
      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      }
    },
    beforeDestroy () {
      window.sessionStorage.removeItem('bindDepartmentLevel')
      window.sessionStorage.removeItem('bindDepartment')
    }
}
</script>

<style>
.resourcePool{
  width: 100%;
}
.resourcePool > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
.resourcePool > .header > .breadcrumb {
    margin-left: 10px
  }

.resourcePool > main {
  width: 1190px;
  margin: 10px auto;
  border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    height: 1000px;
    position: relative
}

.resourcePool > main > .el-tabs > .el-tabs__header::after {
  content: '';
  display: block;
  width: 100px;
  height: 39px;
  /* background-color: yellow; */
  position: absolute;
  top: 0px;
  right: 20px
}
.resourcePool > main > .el-tabs > .input {
  position: absolute;
  top: 0px;
  right: 10px
}
.resourcePool > main > .department{
    position: absolute;
    top: 0px;
    right: 300px;
    height: 38px;
    z-index: 1;
    width: 200px;
}
.resourcePool > main > .department > .el-input > .el-input__inner{
    height: 30px;
    margin-top: 4px;
}
.resourcePool > main > .project{
    position: absolute;
    top: 0px;
    right: 75px;
    height: 38px;
    z-index: 1;
    width: 200px;
}
.resourcePool > main > .project > .el-input > .el-input__inner{
    height: 30px;
    margin-top: 4px;
}
</style>

