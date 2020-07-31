<template>
  <div class="productVersion">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="jumpToProductList">产品列表</el-breadcrumb-item>
        <el-breadcrumb-item>版本列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" >
          <!-- 我参与的项目 -->
          <!-- <el-tab-pane label="我参与的版本" name="join">
            <ProductVersionList :tabName="tabName" v-if="tabName === 'join'"></ProductVersionList>
          </el-tab-pane>
          <el-tab-pane label="我创建的版本" name="create">
            <ProductVersionList :tabName="tabName" v-if="tabName === 'create'"></ProductVersionList>
          </el-tab-pane> -->
          <el-tab-pane :label="productName+'的版本'" >
            <ProductVersionList :tabName="all" ></ProductVersionList>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import ProductVersionList from './productVersionList'
export default {
  data () {
    return {
      activeName: 'join',
      tabName: 'join',
      productName: this.$route.query.productName
    }
  },
  components: {
    ProductVersionList
  },
  methods: {
    handleClick (tab) {
      this.tabName = tab.name
      // console.log(tab.name)
    }
  },
  created () {
  }
}
</script>

<style>
.productVersion {
  width: 100%
}
.productVersion > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.productVersion > .header > .breadcrumb {
  margin-left: 10px
}
.productVersion > main {
  width: 1190px;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
