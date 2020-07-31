<template>
  <div class="annualProjectInvestment">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资源池管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!isHistory">年度项目投入</el-breadcrumb-item>
        <el-breadcrumb-item v-else>年度项目投入历史数据</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <!-- 标签页 -->
      <el-tabs type="border-card" @tab-click="selectTab" v-model="activeName">
          <el-tab-pane label="概览" name="rough">
            <span slot="label"><i class="el-icon-suitcase"></i> 概览</span>
            <Rough></Rough>
          </el-tab-pane>
          <el-tab-pane label="明细" name="detailed" v-if="!isHistory">
            <span slot="label"><i class="el-icon-suitcase-1"></i> 明细</span>
            <Detailed></Detailed>
          </el-tab-pane>
        </el-tabs>
    </main>
  </div>
</template>

<script>
import Rough from '../components/annualProjectInvestment/rough'
import Detailed from '../components/annualProjectInvestment/detailed'
export default {
  components: {
    Rough,
    Detailed
  },
  data () {
    return {
      activeName: 'rough',
      isHistory: false
    }
  },
  methods: {
    selectTab (activeName) {
      // console.log(activeName.label)
    }
  },
  created () {
    this.isHistory = this.$route.query.isHistory
  }
}
</script>

<style lang="scss">
.annualProjectInvestment {
  width: 100%;
  > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    > .breadcrumb {
      margin-left: 10px
    }
  }
  > main {
    width: 1190px;
    margin: 10px auto
  }
}
</style>
