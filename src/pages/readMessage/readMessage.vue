<template>
  <div class="readMessage">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="body">
        <el-tabs type="border-card" @tab-click="selectTab" v-model="activeName">
          <!-- 未读 -->
          <el-tab-pane :label="'未读消息' + '(' + $store.state.noRead + ')'" name="none">
            <NotRead v-if="activeName === 'none'"></NotRead>
          </el-tab-pane>
          <!-- 已读 -->
          <el-tab-pane label="已读消息" name="have">
            <HaveRead v-if="activeName === 'have'"></HaveRead>
          </el-tab-pane>
        </el-tabs>
        <footer>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import HaveRead from '../../components/readMessage/haveReadMessage.vue'
import NotRead from '../../components/readMessage/notReadMessage.vue'
export default {
  components: {
    HaveRead,
    NotRead
  },
  data () {
    return {
      activeName: 'none'
    }
  },
  methods: {
    // 切换消息栏显示相应的内容
    selectTab (tab) {
      if (tab.name === 'none') {
        this.$router.push({
          path: '/readMessage',
          query: {
            status: 'none'
          }
        })
      } else {
        this.$router.push({
          path: '/readMessage',
          query: {
            status: 'have'
          }
        })
      }
    }
  }
}
</script>
<style>
.readMessage {
  width: 100%
}
.readMessage .color {
  color: #409EFF;
  cursor: pointer
}
.readMessage > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.readMessage > .header > .breadcrumb {
  margin-left: 10px
}
.readMessage > main {
  width: 1190px;
  margin: 0 auto;
  margin-top: 10px
}
.readMessage > main > .top{
  width: 1190px
}
.el-table td, .el-table th {
  padding: 8.5px 0px
}
</style>
