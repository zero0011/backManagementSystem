<!-- 人员列表页 -->
  <template>
  <div class="staffManagement">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <!-- <el-select v-model="value">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
        <!-- <el-button type="primary" @click="seeAllMember">查询</el-button> -->
        <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
          <el-select v-model="departmentValue" @change="DepartmentTypeChange">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 全部人员 -->
          <el-tab-pane label="全部人员" name="all">
            <All
              :tabName="activeName"
              v-if="activeName === 'all'"
              :toDepartmentName="bindDepartment"
              :toDepartmentLevel="bindDepartmentLevel"
            ></All>
          </el-tab-pane>
          <!-- 正式人员 -->
          <el-tab-pane label="正式人员" name="regular">
            <Regular
              :tabName="activeName"
              v-if="activeName === 'regular'"
              :toDepartmentName="bindDepartment"
              :toDepartmentLevel="bindDepartmentLevel"
            ></Regular>
          </el-tab-pane>
          <!-- 合作方人员 -->
          <el-tab-pane label="合作方人员" name="partner">
            <Partner
              :tabName="activeName"
              v-if="activeName === 'partner'"
              :toDepartmentName="bindDepartment"
              :toDepartmentLevel="bindDepartmentLevel"
            ></Partner>
          </el-tab-pane>
          <!-- 实习人员 -->
          <el-tab-pane label="实习人员" name="intern">
            <Intern
              :tabName="activeName"
              v-if="activeName === 'intern'"
              :toDepartmentName="bindDepartment"
              :toDepartmentLevel="bindDepartmentLevel"
            ></Intern>
          </el-tab-pane>
        </el-tabs>
        <footer></footer>
      </div>
    </main>
  </div>
</template>

<script>
import All from '../../components/StaffManage/all'
import Regular from '../../components/StaffManage/regular'
import Partner from '../../components/StaffManage/partner'
import Intern from '../../components/StaffManage/intern'
import { getAllDepartment } from '../../api/api'
export default {
  components: {
    All,
    Regular,
    Partner,
    Intern
  },
  data() {
    return {
      activeName: 'all',
      translateToChild: '',
      departmentValue: '所有部门', // 点击部门变化按钮就会对应变化的值
      departmentChat: '', // 对应的表{key:value}
      departmentOption: [], // 所选部门
      bindDepartment: '所有部门',
      bindDepartmentLevel: 1

    }
  },
  methods: {
    getFatherValue() {
      console.log(this.bindDepartment)
      let temp = this.bindDepartment
      this.bindDepartment = ''
      this.bindDepartment = temp
    },
    handleClick(val) {
      this.activeName = val.name
      // window.sessionStorage.setItem('bindDepartment', )
    },
    dataStatistics() {
      this.$router.replace('/staffStatistics')
    },
    // 部门信息改变
    DepartmentTypeChange(val) {
      this.bindDepartment = val // 向子组件传递部门名参数
      this.bindDepartmentLevel = this.departmentChat[val] // 向子组件传递部门级别参数
      window.sessionStorage.setItem('bindDepartment', val)
      window.sessionStorage.setItem('bindDepartmentLevel', this.departmentChat[val])
      // alert(this.bindDepartmentLevel)
    },

    // 查询所有部门信息
    queryAllDepartment() {
      let data = {}
      getAllDepartment(data).then(res => {
        if (res.state === 1000) {
          let department = res.data.departments
          let arr = []
          arr.push({ value: '所有部门', label: '所有部门', level: 1 })
          department.forEach(ele => {
            arr.push({ value: ele.name, label: ele.name, level: ele.level })
          })
          // 添加对应表
          let chat = {}
          for (let i = 0; i < arr.length; i++) {
            let temp = arr[i].value
            chat[temp] = arr[i].level
          }

          this.departmentChat = chat
          this.departmentOption = arr
        } else {
          setTimeout(() => {
            this.$message.error(res.message)
          }, 100)
        }
      }, rej => {
        setTimeout(() => {
          this.error()
        }, 100)
      })
    },
    beforeunloadHandler(e) {
      e = e || window.event
      if (e) {
        console.log(11111111111)
        this.bindDepartment = '所有部门'
        this.bindDepartmentLevel = 1
      }
    }
  },
  mounted() {
    this.translateToChild = '1'
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    // 在页面刷新以后，重置主页面的部门和级别为所有部门，但是这个语句在刚加载的时候是无法触发的
    window.addEventListener('beforeunload', e => {
      this.bindDepartment = '所有部门'
      this.bindDepartmentLevel = 1
      console.log(this.bindDepartment)
      window.sessionStorage.setItem('bindDepartment', this.bindDepartment)
      window.sessionStorage.setItem('bindDepartmentLevel', this.bindDepartmentLevel)
    })
  },
  created() {
    this.queryAllDepartment()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  }
}
</script>

  <style>
.staffManagement {
  width: 100%;
}
.staffManagement > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.staffManagement > .header > .breadcrumb {
  margin-left: 10px;
}
.staffManagement > main {
  width: 1190px;
  margin: 0 auto;
  margin-top: 10px;
}
.staffManagement > main > .body {
  position: relative;
}
.staffManagement > main > .body > .el-select {
  float: right;
}
.staffManagement > main > .body > .el-tabs {
  position: relative;
}
.staffManagement > main > .body > .el-tabs > .el-tabs__content {
  position: static;
}
.staffManagement > main > .body > .el-tabs > .el-tabs__content > .el-select {
  position: absolute;
  top: 0px;
  right: 150px;
  height: 38px;
}
.staffManagement
  > main
  > .body
  > .el-tabs
  > .el-tabs__content
  > .el-select
  > .el-input
  > .el-input__inner {
  height: 30px;
  margin-top: 4px;
}
.staffManagement > main > .body > .el-tabs > .el-tabs__content > .el-button {
  position: absolute;
  top: 0px;
  right: 30px;
  margin-top: 4px;
}
/* .staffManagement > main > .body > .el-tabs > .el-tabs__header {
    z-index: 0
  }
  .staffManagement > main > .body > .el-tabs > .el-tabs__content {
    z-index: 99;
  }
  .staffManagement > main > .body > .el-tabs > .el-tabs__content > .el-select {
    position: absolute;
    top: -39px;
    right: 20px;
    z-index: 9999
  } */
</style>
