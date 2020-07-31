<template>
  <header class="header-menu">
      <div class="left" @click="returnLogin">HTP</div>
      <div class="middle">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="menuSelect" background-color="#606266" text-color="#fff" active-text-color="#409EFF">
          <template v-if="$store.state.showOneOrSeond">
            <el-menu-item :index="key + 1 + ''" v-for="(val, key) in $store.state.menuData" :key="key">{{ val.menuName }}</el-menu-item>
          </template>
          <template v-else>
            <template v-for="(val, key) in $store.state.menuData">
              <el-menu-item :index="val.powerName"  :key="key" v-if="val.children.length === 0">{{ val.powerName }}</el-menu-item>
              <el-submenu :index="key + 1 + ''" v-else :key="key">
                <template slot="title">{{ val.powerName }}</template>
                <el-menu-item :index="secondVal.powerName" v-for="(secondVal, key2) in val.children" :key="key2">{{ secondVal.powerName }}</el-menu-item>
              </el-submenu>
            </template>
          </template>
        </el-menu>
      </div>
      <div class="right">
        <i class="el-icon-question" @click="jumpToDocument"></i>
        <!-- <i class="el-icon-bell"></i> -->
        <!-- 未读消息的小红点 -->
        <el-badge is-dot :hidden="$store.state.showRedDot" class="item">
          <i class="el-icon-bell" @click="jumpToMessagePage"></i>
          <!-- <el-button class="share-button" icon="el-icon-bell" type="primary"></el-button> -->
          <!-- <el-button class="share-button" icon="el-icon-share" type="primary"></el-button> -->
        </el-badge>
        <el-button type="primary" round class="workTable" v-if="!$store.state.showOneOrSeond" @click='goTOWorkTable'>工作台</el-button>
        <div class="button" v-if="$store.state.showOneOrSeond" v-cloak>
          <el-button type="primary" class="pleaseLogin" @click="pleaseLogin">请登录</el-button>
        </div>
        <el-dropdown v-else @command="getMenu" v-cloak>
          <el-button type="primary">
            {{ $store.state.userName }}
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personalCenter" v-if="per">{{ perName }}</el-dropdown-item>
            <el-dropdown-item command="controlCenter" v-if="con">{{ conName }}</el-dropdown-item>
            <el-dropdown-item command="logout">&nbsp;&nbsp;&nbsp;退出&nbsp;&nbsp;&nbsp;</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
</template>

<script>
import { getAllMenusPower } from '../api/api'
export default {
  props: ['headData'],
  data () {
    return {
      activeIndex: '0',
      // 一级菜单
      datalevel1: [],
      datalevel2: [],
      targetData: [],
      localToken: '',
      saveToken: '',
      controlArr: [],
      per: false,
      perName: '',
      con: false,
      conName: ''
      // showRedDot: false
    }
  },
  methods: {
    jumpToMessagePage () {
      this.$router.push({
        path: '/readMessage',
        query: {
          status: 'none'
        }
      })
    },
    jumpToDocument () {
      window.location.href = 'http://wiki.hobot.cc/pages/viewpage.action?pageId=70444744'
    },
    initMenu () {
      getAllMenusPower({})
        .then((res) => {
          if (res.state === 1000) {
            let data = res.data.data
            data.forEach((ele, index) => {
              if (ele.nodeLevel === 1) {
                this.datalevel1.push(ele)
              }
            })
            console.log(this.datalevel1)
            this.$store.commit('changeMenuData', this.datalevel1)
            this.$store.commit('changeName', window.localStorage.getItem('userName'))
            this.datalevel1 = []
          }
        })
    },
    returnLogin () {
      this.$router.push({
        path: '/'
      })
    },
    menuSelect (index) {
      // console.log(index)
      if (this.$store.state.showOneOrSeond) {
        this.$router.push({
          path: '/login'
        })
      } else {
        if (index === '项目管理') {
          this.$router.push('/projectControl')
        }
        if (index === '用例管理') {
          this.$router.push('/usecasesetlist')
        }
        if (index === '任务管理') {
          this.$router.push('/missionManage')
        }
        if (index === '人员管理') {
          this.$router.push('/staffManagement')
        }
        if (index === '资源管理') {
          this.$router.push('/resourseManagement')
        }
        if (index === '统计报表') {
          this.$router.push('/dataStatistics')
        }
        if (index === '项目人力查询') {
          this.$router.push('/projectHumanRosourceManagement')
        }
        if (index === '年度项目投入') {
          this.$router.push('/annualProjectInvestment')
        }
      }
    },
    pleaseLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    goTOWorkTable () {
      this.$router.push({
        path: '/workTable'
      })
    },
    getMenu (val) {
      if (val === 'logout') {
        window.localStorage.removeItem('token')
        window.sessionStorage.removeItem('token')
        window.localStorage.removeItem('userName')
        window.localStorage.removeItem('showSecondMenu')
        window.localStorage.removeItem('accountName')
        window.sessionStorage.removeItem('showSecondMenu')
        window.sessionStorage.removeItem('userName')
        window.sessionStorage.removeItem('activeName')
        window.sessionStorage.removeItem('menuIndex')
        window.sessionStorage.removeItem('accountName')
        this.$store.commit('changeName', '')
        this.$store.commit('changeShowOneOrSeond', true)
        this.$router.push({
          path: '/'
        })
        this.initMenu()
      }
      if (val === 'controlCenter') {
        this.$router.push({
          path: '/controlcenter'
        })
      }
    }
  },
  created () {
    if (window.localStorage.getItem('token') || window.sessionStorage.getItem('token')) {
    } else {
      this.initMenu()
    }
  },
  watch: {
    headData (val) {
      let arr = []
      val.forEach(ele => {
        arr.push(ele.elementId)
      })
      if (arr.indexOf(60018) > -1) {
        this.per = true
        this.perName = val[arr.indexOf(60018)].powerName
      } else {
        this.per = false
        this.perName = ''
      }
      if (arr.indexOf(60019) > -1) {
        this.con = true
        this.conName = val[arr.indexOf(60019)].powerName
      } else {
        this.con = false
        this.conName = ''
      }
    }
  }
}
</script>

<style>
[ v-cloak] {
  display: none
}
.header-menu {
  min-width: 1190px;
  margin: 0 auto;
  height: 60px;
  background-color: #606266;
  display: flex
}
.header-menu > .left {
  flex: 1;
  color: #fff;
  height: 60px;
  font-size: 24px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  font-family: "San Francisco UI", "微软雅黑", Arial
}
.header-menu > .middle {
  flex: 10
}
.header-menu > .middle > .el-menu-demo{
  width: 100%;
  display: flex;
  /* 刷新时会有横线 */
  border-bottom: 0px solid transparent;
  background-color: #606266;
}
.header-menu > .right {
  width: 320px;
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
  /* background-color: pink; */
}
.header-menu > .right > .el-icon-question {
  font-size: 28px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center
}
.header-menu > .right > .item:hover {
  cursor: pointer
}
.header-menu > .right > .item > .el-icon-bell {
  font-size: 28px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center
}
.header-menu > .right > .item > .el-badge__content {
  right: 13px;
  top: 4px
}
.header-menu > .right > .el-icon-question:hover, .header-menu > .right > .el-icon-bell:hover {
  cursor: pointer
}
.header-menu > .right > .workTable {
  width: 100px;
  height: 30px;
  padding: 0;
  position: absolute;
  left: 90px
}
.header-menu > .right > .button {
  width: 130px;
  height: 30px;
  text-align: center;
  position: absolute;
  left: 190px
}
.header-menu > .right > .button > .pleaseLogin {
  width: 100px;
  height: 30px;
  padding: 0;
}
.header-menu > .right > .el-dropdown {
  width: 130px;
  height: 30px;
  position: absolute;
  left: 190px;
  text-align: center
}
.header-menu > .right > .el-dropdown > .el-button {
  padding: 0;
  width: 100px;
  height: 30px;
}
.el-dropdown-menu {
  width: 130px;
}
</style>
