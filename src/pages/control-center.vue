<template>
  <div class="personalCenterApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理中心</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="left">
      <el-row class="tac">
        <el-col :span="5">
          <el-menu :default-active="menuIndex" class="el-menu-vertical-demo" @select="clickMenuIndex">
            <el-menu-item :index="key + 1 + ''" v-for="(val, key) in menu" :key="key">
              <i :class="val.icon"></i>
              <span slot="title">{{ val.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="right">
      <el-tabs v-model="activeName" type="card" v-if="menuIndex === '1'" @tab-click="tabClick">
        <el-tab-pane label="用户" name="first">
          <TableCollapse :data1="soursefiveTwo"></TableCollapse>
        </el-tab-pane>
        <el-tab-pane label="用户组" name="second">
          <TableTeam :data2="soursefiveThree"></TableTeam>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName" type="card" v-if="menuIndex === '2'">
        <el-tab-pane label="角色" name="first">
          <TableRole :data3="soursefiveFour"></TableRole>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName" type="card" v-if="menuIndex === '3'">
        <el-tab-pane label="资源" name="first">
          <TableResourse :data4="soursefiveFive"></TableResourse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getAllPowerByUserPower } from '../api/api'
import TableRole from '../components/table-role'
import TableCollapse from '../components/table-collapse'
import TableTeam from '../components/table-team'
import TableResourse from '../components/table-resourse'
export default {
  components: {
    TableRole,
    TableCollapse,
    TableTeam,
    TableResourse
  },
  data () {
    return {
      resourcePageId: 50002,
      menuIndex: '',
      activeName: '',
      menu: [
        {
          name: '用户管理',
          icon: 'el-icon-user-solid'
        }, {
          name: '角色管理',
          icon: 'el-icon-user'
        }, {
          name: '资源管理',
          icon: 'el-icon-s-help'
        }
      ],
      soursefiveTwo: [],
      soursefiveThree: [],
      soursefiveFour: [],
      soursefiveFive: []
    }
  },
  methods: {
    emitData (data) {
      this.$emit('slideData', data)
    },
    initPowerByUser () {
      if (this.menuIndex === '1' && this.activeName === 'first') {
        this.resourcePageId = 50002
      }
      if (this.menuIndex === '1' && this.activeName === 'second') {
        this.resourcePageId = 50003
      }
      if (this.menuIndex === '2') {
        this.resourcePageId = 50004
      }
      if (this.menuIndex === '3') {
        this.resourcePageId = 50005
      }
      getAllPowerByUserPower({
        accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
        resourcePageId: this.resourcePageId
      }).then(res => {
        let temData = res.data.power
        let arrTem1 = []
        let arrTem2 = []
        let arrTem3 = []
        // 菜单
        temData.forEach(ele => {
          if (ele.areaId === 1) {
            arrTem1.push(ele)
          }
        })
        // 管理中心
        temData.forEach(ele => {
          if (ele.areaId === 2) {
            arrTem2.push(ele)
          }
        })
        // 元素
        temData.forEach(ele => {
          if (ele.areaId === 3) {
            arrTem3.push(ele)
          }
        })
        if (this.resourcePageId === 50002) {
          this.soursefiveTwo = arrTem3
        }
        if (this.resourcePageId === 50003) {
          this.soursefiveThree = arrTem3
        }
        if (this.resourcePageId === 50004) {
          this.soursefiveFour = arrTem3
        }
        if (this.resourcePageId === 50005) {
          this.soursefiveFive = arrTem3
        }
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
        this.$store.commit('changeMenuData', arrTem2l1)
        this.$store.commit('changeMenuSideData', arrTem2)
        this.emitData(arrTem2)
      }, rej => {
      })
    },
    clickMenuIndex (index) {
      this.menuIndex = index
      window.sessionStorage.setItem('menuIndex', this.menuIndex)
      this.activeName = 'first'
      window.sessionStorage.setItem('activeName', 'first')
      this.initPowerByUser()
    },
    tabClick (val) {
      window.sessionStorage.setItem('menuIndex', this.menuIndex)
      window.sessionStorage.setItem('activeName', val.$options.propsData.name)
      if (val.$options.propsData.name === 'second' && this.menuIndex === '1') {
        this.resourcePageId = 50003
      } else {
        this.resourcePageId = 50002
      }
      this.initPowerByUser()
    }
  },
  created () {
    if (window.sessionStorage.getItem('activeName')) {
      this.activeName = window.sessionStorage.getItem('activeName')
    } else {
      this.activeName = 'first'
    }
    if (window.sessionStorage.getItem('menuIndex')) {
      this.menuIndex = window.sessionStorage.getItem('menuIndex')
    } else {
      this.menuIndex = '1'
    }
    this.initPowerByUser()
  }
}
</script>

<style>
.personalCenterApp {
  width: 1190px;
  height: 802px;
  margin: 0 auto;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap
}
.personalCenterApp > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.personalCenterApp > .header > .breadcrumb {
  margin-left: 10px
}
.personalCenterApp > .left {
  float: left;
  border-left: 1px solid #EBEEF5;
  margin-top: -20px
}
.personalCenterApp > .left > .tac {
  width: 150px;
  display: inline-block
}
.personalCenterApp > .left > .tac > .el-col {
  width: 100%;
}
.personalCenterApp > .left > .tac > .el-col > div{
  width: 150px;
  height: 51px;
  line-height: 51px;
  text-align: center;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5
}
.personalCenterApp > .left > .tac > .el-col > .el-menu-vertical-demo {
  border-width: 0px
}
.personalCenterApp > .left > .tac > .el-col > .el-menu-vertical-demo > .el-menu-item{
  border-bottom: 1px solid #EBEEF5
}
.personalCenterApp > .left > .tac > .el-col > .el-menu-vertical-demo > .el-menu-item:first-of-type {
  width: 151px;
  border-right: 1px solid #EBEEF5;
  border-top: 1px solid #EBEEF5
}
.personalCenterApp > .left > .tac > .el-col > .el-menu-vertical-demo > .el-menu-item:nth-of-type(2) {
  width: 151px;
  border-right: 1px solid #EBEEF5
}
.personalCenterApp > .left > .tac > .el-col > .el-menu-vertical-demo > .el-menu-item > i {
  margin-left: 8px
}
.personalCenterApp > .right {
  float: left;
  width: 1038px;
  border-right: 1px solid #EBEEF5;
  margin-top: -20px
}
.personalCenterApp > .right > .el-tabs {
  width: 1039px;
}
.personalCenterApp > .right > .el-tabs > .el-tabs__header {
  margin: 0px 0px 0px 0px;
  height: 55px
}
.personalCenterApp > .right > .el-tabs > .el-tabs__header > .el-tabs__nav-wrap {
  width: 100%;
  height: 55px;
}
.personalCenterApp > .right > .el-tabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-scroll > .el-tabs__nav {
  width: 100%;
  border-left-width: 0px;
  border-right-width: 0px
}
.personalCenterApp > .right > .el-tabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-scroll > .el-tabs__nav > .el-tabs__item:nth-of-type(1) {
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  height: 54px;
  line-height: 54px
}
.personalCenterApp > .right > .el-tabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-scroll > .el-tabs__nav > .el-tabs__item:nth-of-type(2) {
  vertical-align: top;
  border-right: 1px solid #EBEEF5;
  border-left-width: 0px;
  height: 54px;
  line-height:  54px
}
.personalCenterApp > #pane-first {
  height: 688px;
  width: 1040px;
}
.personalCenterApp > #pane-first > .tableCollapseApp {
  overflow: auto;
}
.personalCenterApp #pane-second {
  height: 662px;
}
</style>
