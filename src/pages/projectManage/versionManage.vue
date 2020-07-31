<template>
  <div class="versionManageApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>版本列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card">
          <!-- 我参与的版本 -->
          <!-- <el-tab-pane label="我参与的版本" name="join">
            <VersionList :tabName="currentTab" v-if="currentTab === 'join'"></VersionList>
          </el-tab-pane> -->
          <!-- 我创建的版本 -->
          <!-- <el-tab-pane label="我创建的版本" name="create">
            <VersionList :tabName="currentTab" v-if="currentTab === 'create'"></VersionList>
          </el-tab-pane> -->
          <!-- 所有的版本 -->
          <el-tab-pane :label="currentTab + '的版本'" >
            <VersionList tabName="create" ></VersionList>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import VersionList from '../../components/projectManage/versionList'
import { getAllPowerByUserPower } from '../../api/api'
export default {
  components: {
    VersionList
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
    getAllPowerByUserPower({
      accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
      resourcePageId: 50008
    }).then(res => {
      // 收集返回的elementId,如果存在指定的elementId那么就显示
      let elementIdArr = res.data.power.map(ele => ele.elementId)
      if (elementIdArr.indexOf(60038) > -1) {
        this.allVersionShow = true
      }
    })
    this.currentTab = this.$route.query.projectName
  }
}
</script>

<style>
  .versionManageApp {
    width: 100%
  }
  .versionManageApp > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .versionManageApp > .header > .breadcrumb {
    margin-left: 10px
  }
  .versionManageApp > main {
    width: 1190px;
    margin: 10px auto
  }
</style>
