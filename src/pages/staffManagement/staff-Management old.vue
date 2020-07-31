


<!-- 修改前 -->


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
        </el-select> -->
        <!-- <el-button type="primary" @click="seeAllMember">查询</el-button> -->
        <el-tabs type="border-card" @tab-click="selectTab" v-model="currentTab">
          <el-select v-model="value" @change="selectOrg">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" @click="dataStatistics">数据统计</el-button>
          <!-- 正式人员 -->
          <el-tab-pane label="正式人员" name="regular">
            <Regular :transData="translateToChild"></Regular>
          </el-tab-pane>
          <!-- 合作方人员 -->
          <el-tab-pane label="合作方人员" name="partner">
            <Partner :transData="translateToChild"></Partner>
          </el-tab-pane>
           <!-- 实习人员 -->
          <el-tab-pane label="实习人员" name="intern">
            <Intern :transData="translateToChild"></Intern>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
  </template>
  
  <script>
  import Regular from '../../components/StaffManage/regular'
  import Partner from '../../components/StaffManage/partner'
  import Intern from '../../components/StaffManage/intern'
  import { getAllPowerByUserPower } from '../../api/api'
  export default {
    components: {
    Regular,
    Partner,
     Intern
  },
  data () {
    return {
     currentTab: 'regular',
     options: [{
          value: '1',
          label: '按部门'
        }, {
          value: '2',
          label: '按项目'
        },{
          value: '3',
          label: '按归属地'
        }],
     value: '1',
     translateToChild: ''
    }
  },
  methods: {
    selectTab (val) {
    },
    dataStatistics(){
      this.$router.replace('/staffStatistics')
    },
    selectOrg(val){
      //console.log(val)
      this.translateToChild = val
    }
  },
  mounted (){
      this.translateToChild = '1'
  },
  created () {
    
  }
}
  </script>
  
  <style>
   .staffManagement {
    width: 100%
  }
  .staffManagement > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .staffManagement > .header > .breadcrumb {
    margin-left: 10px
  }
  .staffManagement > main {
    width: 1190px;
    margin: 0 auto;
    margin-top: 10px;
  }
  .staffManagement > main > .body {
    position: relative
  }
  .staffManagement > main > .body > .el-select {
    float: right
  }
  .staffManagement > main > .body > .el-tabs {
    position: relative
  }
  .staffManagement > main > .body > .el-tabs > .el-tabs__content {
    position: static
  }
  .staffManagement > main > .body > .el-tabs > .el-tabs__content > .el-select {
    position: absolute;
    top: 0px;
    right: 150px;
    height: 38px
  }
  .staffManagement > main > .body > .el-tabs > .el-tabs__content > .el-select > .el-input > .el-input__inner {
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