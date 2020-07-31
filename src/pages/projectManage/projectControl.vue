  <!-- 项目列表页 -->
  <template>
  <div class="projectListApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" @tab-click="selectTab" v-model="currentTab">
          <!-- 我参与的项目 -->
          <el-tab-pane label="我参与的项目" name="join">
            <Join></Join>
          </el-tab-pane>
          <!-- 我创建的项目 -->
          <el-tab-pane label="我创建的项目" name="create">
            <Create></Create>
          </el-tab-pane>
          <!-- 所有的项目 -->
          <el-tab-pane label="所有的项目" name="all" v-if="allProjectShow">
            <All></All>
          </el-tab-pane>
        </el-tabs>
        <footer></footer>
      </div>
    </main>
  </div>
</template>

<script>
import Join from '../../components/projectManagement/join'
import Create from '../../components/projectManagement/create'
import All from '../../components/projectManagement/all'
import { getAllPowerByUserPower } from '../../api/api'
export default {
  components: {
    Join,
    Create,
    All
  },
  data() {
    return {
      currentTab: '',
      allProjectShow: false
    }
  },
  methods: {
    selectTab(val) {
    }
  },
  mounted() {
    this.currentTab = this.$route.query.activeName
    if (typeof (this.currentTab) === 'undefined') {
      this.currentTab = 'join'
    }
  },
  created() {
    getAllPowerByUserPower({
      accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
      resourcePageId: 50007
    }).then(res => {
      // 收集返回的elementId,如果存在指定的elementId那么就显示
      let elementIdArr = res.data.power.map(ele => ele.elementId)
      if (elementIdArr.indexOf(60037) > -1) {
        this.allProjectShow = true
      }
    })
    // if (this.$route.query.to) {
    //   this.currentTab = this.$route.query.to
    // } else {
    //   this.currentTab = 'join'
    // }
  }
}
</script>

<style scoped>
.projectListApp {
  width: 100%;
}
.projectListApp > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.projectListApp > .header > .breadcrumb {
  margin-left: 10px;
}
.projectListApp > main {
  width: 1190px;
  margin: 0 auto;
  margin-top: 10px;
}
.el-table td{
  padding:15px 0;
}
</style>
