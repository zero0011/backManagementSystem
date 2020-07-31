<template>
  <div id="generalViewApp">
    <main class="main">
      <div class="block">
        <span class="demonstration"></span>
        <el-carousel autoplay="" :interval="autoPlayTime">
          <el-carousel-item v-for="(val, key) in picSourse" :key="key">
            <img :src="val" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
    </main>
    <div class="body">
      <div class="son" v-for="(val, key) in messageBox" :key="key">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ val.target }}</span>
          </div>
          <div class="text item">
            {{ val.introduction }}
          </div>
        </el-card>
        <div class="after"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      status: false,
      // 轮播图地址
      picSourse: [require('../assets/a.jpg'), require('../assets/b.jpg'), require('../assets/c.jpg')],
      autoPlayTime: 2000,
      // 简介说明
      messageBox: [
        {
          target: '测试管理',
          introduction: '可对测试团队的活动进程全程把控，从项目、案例、任务和缺陷等各个方面对测试数据进行质量化和分析，保证项目质量时刻处于可控状态，有效避免质量风险。'
        }, {
          target: '测试执行',
          introduction: '对测试各个阶段的执行数据进行采集和展示，并对测试流程各个节点的活动进行跟踪和汇总，测试人员可以对测试项目的质量情况进行量化，从而提升项目质量的数据化能力。'
        }, {
          target: '测试统计',
          introduction: '从多个维度对测试数据进行统计和展示，以直观的方式展示测试质量的趋势变化和走势情况，从而可以从更宏观的角度对测试活动进行管理。'
        }
      ]
    }
  }
}
</script>

<style>
#generalViewApp {
  width: 1190px;
  height: 802px;
  margin: 0 auto;
  overflow: hidden;
  position: relative
}
#generalViewApp > .main {
  width: 100%;
  display: flex;
  justify-content: center
}
#generalViewApp > .main > .block {
  width: 100%;
  height: 400px;
  background-color: rgba(204, 204, 204, .3);
}
#generalViewApp > .main > .block > .el-carousel {
  width: 100%;
  height: 100%
}
#generalViewApp > .main > .block > .el-carousel > .el-carousel__container {
  width: 100%;
  height: 100%
}
#generalViewApp > .main > .block > .el-carousel > .el-carousel__container > .el-carousel__item {
  width: 100%;
  height: 100%;
  text-align: center
}
#generalViewApp > .main > .block > .el-carousel > .el-carousel__container > .el-carousel__item > img {
  width: 1190px;
  height: 400px
}
#generalViewApp > .body {
  width: 100%;
  height: 400px;
  display: flex;
  padding: 50px 0px
}
#generalViewApp > .body > .son {
  flex: 1;
  height: 300px
}
#generalViewApp > .body > .son:nth-of-type(2) {
  display: flex;
  justify-content: center
}
#generalViewApp > .body > .son:nth-of-type(3) {
  display: flex;
  justify-content: flex-end
}
#generalViewApp > .body > .son > .box-card {
  width: 80%;
  height: 100%
}
</style>
