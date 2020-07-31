<template>
  <div class="resourcePool">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源管理池</el-breadcrumb-item>
        <el-breadcrumb-item >资源池</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
   
   <main>
     <!-- <input type="text" placeholder="输入内容" style="position: absolute;top: 0px;right: 10px;z-index: 99;height: 36px"> -->
     <el-select v-model="departmentValue"  @change="DepartmentTypeChange" style="position: absolute;top: 0px;right: 350px;z-index: 1;width:200px">
      <el-option
        v-for="item in departmentOption"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
         <el-select v-model="projectValue" @change="ProjectTypeChange" placeholder="请选择项目" style="position: absolute;top: 0px;right: 50px;z-index: 1;width:200px">
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
    <el-tab-pane label="轻度负载人员" name="first" >
      <lowResource :tabName="activeName" v-if="activeName === 'first'" :toChildrenValue="bindValue"></lowResource>
    </el-tab-pane>
    <el-tab-pane label="正常负载人员" name="second">
      <normalResource :tabName="activeName" v-if="activeName === 'second'" :toChildrenValue="bindValue"></normalResource>
    </el-tab-pane>
    <el-tab-pane label="重度负载人员" name="third">
      <heavyResource :tabName="activeName" v-if="activeName === 'third'" :toChildrenValue="bindValue"></heavyResource>
    </el-tab-pane>
    <el-tab-pane label="空闲人员" name="fourth">
      <idleResource :tabName="activeName" v-if="activeName === 'fourth'" :toChildrenValue="bindValue"></idleResource>
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
import lowResource from '../../components/resource/resource-low'
import heavyResource from '../../components/resource/resource-heavy'
import normalResource from '../../components/resource/resource-normal'
import idleResource from '../../components/resource/resource-idle'
import {getAllStaffLoad,getAllDepartment,getAllProjectList} from  '../../api/api'
export default {
  components: {
    lowResource,
    heavyResource,
    normalResource,
    idleResource
  },
  data() {
    return {
      name: '',
      yid: '',
      activeName: 'first',
      bindValue: 1,
      allProject:[],
      projectOption:[],
      projectValue: '',
      departmentOption:[],
      departmentValue: '测试部',
      departmentChat:''  //部门名和部门级别对应表
      

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
            console.log(this.projectOption)
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
            console.log(arr)
            //添加对应表
            let chat={}
            for(let i=0;i<arr.length;i++)
            {
              let temp=arr[i].value
              console.log(temp)
              chat[temp]=arr[i].level
            }

            this.departmentChat=chat
            this.departmentOption=arr
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
      //部门信息改变
      DepartmentTypeChange()
      {

      },
      //项目信息改变
      ProjectTypeChange()
      {

      }
    },
    created()
    {
      this.queryAllProject()
      this.queryAllDepartment()
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
</style>

