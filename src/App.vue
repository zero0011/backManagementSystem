<template>
  <div id="app">
    <headMenu :headData="menuData"></headMenu>
    <!-- <transition name="routeranimation"> -->
    <router-view class="view clearfix" @saveToken='doNotDeleteToken' @slideData='getSlideData'></router-view>
    <!-- </transition> -->
    <footCompany class="footcompany"></footCompany>
  </div>
</template>

<script>
// import { getAllMenusPower, getAllPowerByUserPower } from './api/api.js'
import { getAllPowerByUserPower } from './api/api.js'
import headMenu from './components/head-menu.vue'
import footCompany from './components/foot-company.vue'
export default {
  name: 'App',
  components: {
    headMenu,
    footCompany
  },
  data () {
    return {
      activeIndex: '0',
      // 一级菜单
      datalevel1: [],
      datalevel2: [],
      targetData: [],
      localToken: '',
      saveToken: '',
      menuData: []
    }
  },
  created () {
    if (window.localStorage.getItem('showSecondMenu') === 'true' || window.sessionStorage.getItem('showSecondMenu') === 'true') {
      this.$store.commit('changeShowOneOrSeond', false)
    }
    window.addEventListener('load', () => {
      if (window.localStorage.getItem('userName') && window.localStorage.getItem('userName') !== '') {
        this.$store.commit('changeName', window.localStorage.getItem('userName'))
        this.initPersonalMenu()
      }
      if (window.sessionStorage.getItem('userName') && window.sessionStorage.getItem('userName') !== '') {
        this.$store.commit('changeName', window.sessionStorage.getItem('userName'))
        this.initPersonalMenu()
      }
      if (window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName')) {
        getAllPowerByUserPower({
          accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
          resourcePageId: '50006'
        }).then(res => {
          if (res.state === 1000) {
            let temData = res.data.power
            let arrTem1 = []
            let arrTem2 = []
            // 模块1-菜单栏
            temData.forEach(ele => {
              if (ele.areaId === 1) {
                arrTem1.push(ele)
              }
            })
            // 模块2-个人中心&&管理中心
            temData.forEach(ele => {
              if (ele.areaId === 2) {
                arrTem2.push(ele)
              }
            })
            let arrTem2l1 = []
            let arrTem2l2 = []
            arrTem1.forEach(ele => {
              if (ele.resourceLevel === 1) {
                ele.children = []
                arrTem2l1.push(ele)
              }
              if (ele.resourceLevel === 2) {
                arrTem2l2.push(ele)
              }
            })
            arrTem2l1.forEach((ele, index) => {
              arrTem2l2.forEach((ele2, index2) => {
                if (ele2.fatherId === ele.powerId) {
                  ele.children.push(ele2)
                }
              })
            })
            this.emitData(arrTem2)
            this.$store.commit('changeMenuData', arrTem2l1, this)
          }
        })
      }
    })
  },
  methods: {
    emitData (data) {
      this.menuData = data
    },
    getSlideData (data) {
      this.menuData = data
    },
    initPersonalMenu () {
    },
    doNotDeleteToken (mes) {
      this.saveToken = mes
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none
}
* { padding: 0;margin: 0 }
.clearfix::before, .clearfix::after {
  content: '';
  display: block;
  clear: both
}
#app {
  width: 100%;
}
/* 个人中心&&退出居中显示 */
.el-dropdown-menu > .el-dropdown-menu__item {
  text-align: center
}
/* .routeranimation-leave-active {
  transition: all .2s ease
}
.routeranimation-leave {
  transform: translate(0px)
}
.routeranimation-leave-to {
  transform: translate(-100%)
}
.routeranimation-enter-active {
  transition: all .5s ease
}
.routeranimation-enter {
  transform: translate(100%)
}
.routeranimation-enter-to {
  transform: translate(0)
} */
#app > .view {
  /* min-width: 1190px; */
  min-width: 1280px;
  margin: 0 auto;
}
#app > .footcompany {
  margin-top: 10px
}
</style>
