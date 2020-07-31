<template>
  <div class="missionManageApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" @tab-click="selectTab" v-model="currentTab">
          <!-- 我参与的任务 -->
          <el-tab-pane label="我参与的任务" name="join">
            <MissionList :tabName="currentTab" v-if="currentTab === 'join'"></MissionList>
          </el-tab-pane>
          <!-- 我创建的任务 -->
          <el-tab-pane label="我创建的任务" name="create">
            <MissionList :tabName="currentTab" v-if="currentTab === 'create'"></MissionList>
          </el-tab-pane>
          <!-- 已完成的任务 -->
          <el-tab-pane label="历史的任务" name="finish">
            <MissionList :tabName="currentTab" v-if="currentTab === 'finish'"></MissionList>
          </el-tab-pane>
          <!-- 所有的任务 -->
          <el-tab-pane label="所有的任务" name="all" v-if="allMissionShow">
            <MissionList :tabName="currentTab" v-if="currentTab === 'all'"></MissionList>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import MissionList from '../../components/missionManage/missionList'
import { getAllPowerByUserPower } from '../../api/api'
export default {
  components: {
    MissionList
  },
  data () {
    return {
      projectId: '',
      currentTab: '',
      allMissionShow: false
    }
  },
  methods: {
    selectTab (tab) {
      this.currentTab = tab.name
    }
  },
  created () {
    getAllPowerByUserPower({
      accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
      resourcePageId: 50009
    }).then(res => {
      // 收集返回的elementId,如果存在指定的elementId那么就显示
      let elementIdArr = res.data.power.map(ele => ele.elementId)
      if (elementIdArr.indexOf(60039) > -1) {
        this.allMissionShow = true
      }
    })
    if (!this.$route.query.from) {
      this.currentTab = 'join'
    } else {
      this.currentTab = this.$route.query.from
    }
  }
}
</script>

<style scoped>
  .missionManageApp {
    width: 100%
  }
  .missionManageApp > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .missionManageApp > .header > .breadcrumb {
    margin-left: 10px
  }
  .missionManageApp > main {
    width: 1190px;
    margin: 10px auto
  }
</style>
