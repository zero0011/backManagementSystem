<template>
  <div class="useCaseSetListApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用例管理</el-breadcrumb-item>
        <el-breadcrumb-item>用例集列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" @tab-click="selectTab" v-model="$store.state.activeName">
          <!-- 我参与的用例集 -->
          <el-tab-pane label="我参与的用例集" name="join">
            <Join></Join>
          </el-tab-pane>
          <!-- 我创建的用例集 -->
          <el-tab-pane label="我创建的用例集" name="create">
            <Create></Create>
          </el-tab-pane>
          <!-- 所有的用例集 -->
          <el-tab-pane label="所有的用例集" name="all" v-if="allProjectShow">
            <All></All>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import { getAllPowerByUserPower } from '../../api/api'
import Join from '../../components/useCaseManagement/join'
import Create from '../../components/useCaseManagement/create'
import All from '../../components/useCaseManagement/all'
export default {
  components: {
    Join,
    Create,
    All
  },
  data () {
    return {
      allProjectShow: false
      // activeName: 'join'
    }
  },
  methods: {
    selectTab (val) {
      // console.log(val.$options.propsData.name)
    }
  },
  created () {
    getAllPowerByUserPower({
      accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
      resourcePageId: 50010
    }).then(res => {
      // 收集返回的elementId,如果存在指定的elementId那么就显示
      // console.log('project中触发的')
      let elementIdArr = res.data.power.map(ele => ele.elementId)
      if (elementIdArr.indexOf(60040) > -1) {
        this.allProjectShow = true
      }
    })
    if (this.$route.query.activeName) {
      this.$store.commit('changeActiveName', this.$route.query.activeName)
    } else {
      this.$store.commit('changeActiveName', 'join')
    }
  }
}
</script>

<style scoped>
@import url('../../assets/css/use-case-set-list.css');
</style>
