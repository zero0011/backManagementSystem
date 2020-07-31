<template>
  <div class="excuteMissionApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/missionManage' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务执行</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.query.taskName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" @tab-click="selectTab" v-model="currentTab">
          <!-- 待执行用例 -->
          <el-tab-pane label="待执行用例" name="zhunbei">
            <ExcuteMissionList :tabName="currentTab" v-if="currentTab === 'zhunbei'"></ExcuteMissionList>
          </el-tab-pane>
          <!-- 已执行用例 -->
          <el-tab-pane label="已执行用例" name="yijing">
            <ExcuteMissionList :tabName="currentTab" v-if="currentTab === 'yijing'"></ExcuteMissionList>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import ExcuteMissionList from '../../components/missionManage/excuteMissionList'
export default {
  components: {
    ExcuteMissionList
  },
  data () {
    return {
      projectId: '',
      currentTab: ''
    }
  },
  methods: {
    selectTab (tab) {
      this.currentTab = tab.name
    }
  },
  created () {
    if (!this.$route.query.from) {
      this.currentTab = 'zhunbei'
    } else {
      this.currentTab = this.$route.query.from
    }
  }
}
</script>

<style scoped>
  .excuteMissionApp {
    width: 100%
  }
  .excuteMissionApp > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .excuteMissionApp > .header > .breadcrumb {
    margin-left: 10px
  }
  .excuteMissionApp > main {
    width: 1190px;
    margin: 10px auto
  }
</style>
