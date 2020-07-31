<template>
  <div class="workTableViewApp">
    <header class="header">
      <span>我的工作台</span>
    </header>
    <el-divider></el-divider>
    <main class="main">
      <div class="left">
        <el-card class="box-card" v-for="(val, key) in workTableData" :key="key">
          <div slot="header" class="clearfix">
            <!-- <a href="#" v-for="(v, key) in val.content.children" :key="key">{{ v }}</a> -->
            <span>{{ val.target }}</span>
          </div>
          <div class="text item">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item :title="val2.speak" :name="val2.name" v-for="(val2, key2) in val.content" :key="key2">
                <!-- <div v-for="(v, key) in val2.children" :key="key">{{ v }}</div> -->
                <!-- <a href="" v-for="(v, key) in val2.children" :key="key" style="text-decoration: none;color: #409EFF;display: block">{{ v }}</a> -->
                <div v-for="(v, key) in val2.children" :key="key" style="color: #409EFF;font-size: 12px">{{ v }}</div>
                <div style="float: right;color: #409EFF;cursor: pointer;font-size: 12px" @click="jumpToWhere(val2.name)" v-if="Number.parseInt(val2.name) < 12">更多</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>动态信息</span>
          </div>
          <ul>
            <li v-for="(val, key) in liArr" :key="key"><a :href="val.url" style="color: #409EFF;text-decoration: none;margin-right: 10px" :title="val.title">{{ val.title }}</a><span style="color: #409EFF">{{ val.date }}</span></li>
            <!-- <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.6" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.6版本</a><span style="color: #409EFF">2019-11-23</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.5" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.5版本</a><span style="color: #409EFF">2019-11-18</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.4" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.4版本</a><span style="color: #409EFF">2019-11-13</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.3" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.3版本</a><span style="color: #409EFF">2019-11-08</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.2" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.2版本</a><span style="color: #409EFF">2019-11-01</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.1" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.1版本</a><span style="color: #409EFF">2019-10-16</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.5.0版本</a><span style="color: #409EFF">2019-10-10</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.4.1版本</a><span style="color: #409EFF">2019-09-24</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.4.0版本</a><span style="color: #409EFF">2019-09-05</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.3.1版本</a><span style="color: #409EFF">2019-08-15</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.3.0版本</a><span style="color: #409EFF">2019-08-09</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.2.2版本</a><span style="color: #409EFF">2019-07-15</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.2.1版本</a><span style="color: #409EFF">2019-07-05</span></li>
            <li><a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045#id-%E7%89%88%E6%9C%AC%E5%8F%8A%E5%8F%91%E5%B8%83-v1.5.0" style="color: #409EFF;text-decoration: none;margin-right: 10px">Compass(HTP)平台系统v1.2.0版本</a><span style="color: #409EFF">2019-06-29</span></li> -->
          </ul>
          <!-- <div v-for="o in 4" :key="o" class="text item">
          </div> -->
          <!-- <h3 style="text-align: center;margin-bottom: 10px;color: #000">Compass（HTP）平台系统v1.5.7版本发布通知</h3>
          <h4 style="margin-bottom: 10px;color: #000">版本更新特性：</h4> -->
          <!-- <ul>
            <li>【新增】</li>
            <li>1、资源池管理-资源管理-部门人力明细功能页面，以直观的方式对部门下的员工在项目中的投入情况进行展示</li>
            <li>2、全面支持以websocket的方式进行测试用例导入结果的推送提醒，提升导入的使用体验</li>
            <li>3、用例集支持和项目进行关联，为后续项目维度的测试用例统计提供关系支持</li>
            <li>4、测试用例树页面，可以以从测试用例的维度对执行的记录进行查询</li>
          </ul>
          <ul>
            <li>【优化】</li>
            <li>1、测试用例集新增/编辑页面的人员选择弹层，支持按照部分分类，并进一步优化人员查询功能</li>
            <li>2、资源池管理-资源管理-项目人力汇总页面，提供了总结相关的累加数据</li>
            <li>3、测试用例导入增加一个弹层，并提供一些导入的帮助性提示语</li>
          </ul>
          <ul>
            <li>【修复】</li>
            <li>...</li>
          </ul> -->
          <!-- <a href="http://wiki.hobot.cc/pages/viewpage.action?pageId=75977045">点击查看更多版本特性</a> -->
        </el-card>
      </div>
    </main>
  </div>
</template>

<script>
import { getAllPowerByUserPower, getProjectByParticipant, getProjectByCreator, getCaseSuiteByParticipantPower, getCaseSuiteByCreatorPower, getTaskByParticipantPower, getTaskByCreatorPower, getWorkPadNews } from '../api/api.js'
export default {
  data () {
    return {
      workTableData: [
        {
          target: '与我有关的项目',
          content: [
            {
              speak: '我参与的项目',
              name: '1',
              children: ['aaaaaa', 'bbbbbbbb']
            }, {
              speak: '我创建的项目',
              name: '2',
              children: ''
            }
          ]
        }, {
          target: '与我有关的用例集',
          content: [
            {
              speak: '我参与的用例集',
              name: '5',
              children: ''
            }, {
              speak: '我创建的用例集',
              name: '6',
              children: ''
            }
          ]
        }, {
          target: '与我有关的任务',
          content: [
            {
              speak: '我参与的任务',
              name: '9',
              children: ''
            }, {
              speak: '我创建的任务',
              name: '10',
              children: ''
            }
          ]
        }, {
          target: '与我有关的缺陷',
          content: [
            {
              speak: '我参与的缺陷',
              name: '13',
              children: ''
            }, {
              speak: '我创建的缺陷',
              name: '14',
              children: ''
            }
          ]
        }
      ],
      //   与我有关的任务手风琴效果默认显示第一个
      missionActive: '0',
      missionActive2: '0',
      mission: [
        {
          title: '分配给我的任务',
          data: [
            '分配任务一',
            '分配任务二',
            '分配任务三'
          ]
        }, {
          title: '我创建的任务',
          data: [
            '创建任务一'
          ]
        }, {
          title: '我正在执行的任务'
        }, {
          title: '所有的任务'
        }
      ],
      error: [
        {
          title: '缺陷1'
        }
      ],
      datalevel1: [],
      datalevel2: [],
      activeNames: ['1', '5', '9'],
      accountName: '',
      liArr: []
    }
  },
  methods: {
    // 获取要展示的动态信息
    getMessage () {
      getWorkPadNews({})
        .then(res => {
          if (res.state === 1000) {
            console.log(res)
            this.liArr.splice(0, this.liArr.length)
            this.liArr = res.data.newsInfo
            console.log(this.liArr)
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试')
        })
    },
    jumpToWhere (where) {
      // 我参与的项目
      if (where === '1') {
        this.$router.push({
          path: '/projectControl'
        })
      }
      // 我创建的任务
      if (where === '2') {
        this.$router.push({
          path: '/projectControl',
          query: {
            activeName: 'create'
          }
        })
      }
      // 我参与的用例集
      if (where === '5') {
        this.$router.push({
          path: '/usecasesetlist'
        })
      }
      // 我创建的用例集
      if (where === '6') {
        this.$router.push({
          path: '/usecasesetlist',
          query: {
            activeName: 'create'
          }
        })
      }
      // 我参与的任务
      if (where === '9') {
        this.$router.push({
          path: '/missionManage'
        })
      }
      // 我创建的任务
      if (where === '10') {
        this.$router.push({
          path: '/missionManage',
          query: {
            from: 'create'
          }
        })
      }
    },
    // 获取创建的任务
    getCreateTask () {
      // let createname3 = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getTaskByCreatorPower({
        accountName: this.accountName,
        taskName: '',
        startTime: '',
        endTime: '',
        startNumber: 1,
        range: 10
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[2].content[1], 'children', res.data.taskData.map(ele => ele.taskName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取参与的任务
    getJoinTask () {
      // let joinname3 = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getTaskByParticipantPower({
        accountName: this.accountName,
        taskName: '',
        creator: '',
        startTime: '',
        endTime: '',
        startNumber: 1,
        range: 10
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[2].content[0], 'children', res.data.taskData.map(ele => ele.taskName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取创建的用例集
    getCreateCase () {
      // let createname2 = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getCaseSuiteByCreatorPower({
        accountName: this.accountName,
        startNum: 1,
        range: 10,
        caseSuiteName: '',
        startTime: '',
        endTime: ''
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[1].content[1], 'children', res.data.caseSuiteList.map(ele => ele.caseSuiteName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取参与的用例集
    getJoinCase () {
      // let joinname2 = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getCaseSuiteByParticipantPower({
        accountName: this.accountName,
        startNum: 1,
        range: 10,
        caseSuiteName: '',
        createAccountName: '',
        startTime: '',
        endTime: ''
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[1].content[0], 'children', res.data.caseSuiteList.map(ele => ele.caseSuiteName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取创建的任务
    getCreateProject () {
      // let createname = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getProjectByCreator({
        accountName: this.accountName,
        startNum: 1,
        range: 10,
        projectName: '',
        projectManager: '',
        startTime: '',
        endTime: ''
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[0].content[1], 'children', res.data.projectList.map(ele => ele.projectName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取参与的项目
    getJoinProject () {
      // let joinname = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      getProjectByParticipant({
        accountName: this.accountName,
        startNum: 1,
        range: 10,
        projectName: '',
        projectManager: '',
        creator: '',
        startTime: '',
        endTime: ''
      }).then(res => {
        if (res.state === 1000) {
          this.$set(this.workTableData[0].content[0], 'children', res.data.projectList.map(ele => ele.projectName).splice(0, 3))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleChange (val) {
      // console.log(val)
    },
    emitData (data) {
      this.$emit('slideData', data)
    },
    initPersonalMenu () {
      // alert(1)
      // let res = await getAllPowerByUserPower({
      //   accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
      //   resourcePageId: '50001'
      // }).then(res => {
      //   if (res.state === 1000) {
      //     if (res.data.power.some(ele => ele.powerName === '资源池管理')) {
      //       this.$router.replace('/dataStatistics')
      //     }
      //     return res
      //   } else {
      //     console.log()
      //   }
      // })
      // console.log(res)
      getAllPowerByUserPower({
        accountName: this.accountName,
        resourcePageId: '50001'
      }).then((res) => {
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
          this.$store.commit('changeMenuData', arrTem2l1)
          this.$store.commit('changeMenuSideData', arrTem2)
          this.$store.commit('changeShowOneOrSeond', false)
          // if (res.data.power.some(ele => ele.powerName === '资源池管理')) {
          //   this.$router.replace('/dataStatistics')
          // } else {
          //   this.showWorkTable = true
          // }
        } else if (res.data.state === 2013) {
          this.showWorkTable = true
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userName')
          this.$store.commit('changeName', '')
          this.$message({
            showClose: true,
            message: ' 用户数据过期，请重新登录',
            type: 'warning'
          })
          setTimeout(() => {
            this.$router.replace({
              path: '/'
            })
          }, 1500)
        } else {
        }
      }, rej => {
        this.showWorkTable = true
        this.$store.commit('changeMenuData', [])
      }).catch(e => {
      })
    },
    createNewProgram (val) {
      alert(val)
    },
    stopPropagation () {
    }
  },
  created () {
    this.accountName = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
    this.getMessage()
    this.initPersonalMenu()
    this.getJoinProject()
    this.getCreateProject()
    this.getJoinCase()
    this.getCreateCase()
    this.getJoinTask()
    this.getCreateTask()
  }
}
</script>

<style>
.workTableViewApp {
  width: 1190px;
}
.workTableViewApp > .header {
  width: 1188px;
  margin: 0 auto;
  height: 50px;
  font-size: 24px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc
}
.workTableViewApp > .header > span {
  display: inline-block;
  height: 50px;
  width: 120px;
  line-height: 50px;
  margin-left: 35px
}
.workTableViewApp > .el-divider {
  margin: 0px
}
.workTableViewApp > .main {
  width: 100%;
  display: flex;
  min-height: 700px
}
.workTableViewApp > .main > .left {
  flex: 4;
  position: relative
}
.workTableViewApp > .main > .left > .box-card {
  width: 48%;
  display: inline-block;
  height: 350px;
  color: #409EFF;
  font-family: "San Francisco UI", "微软雅黑", Arial
}
.workTableViewApp > .main > .left > .box-card:nth-of-type(1) {
  position: absolute;
  top: 33.3333333333333px
}
.workTableViewApp > .main > .left > .box-card:nth-of-type(2) {
  position: absolute;
  left: 50%;
  top: 33.3333333333333px
}
.workTableViewApp > .main > .left > .box-card:nth-of-type(3) {
  position: absolute;
  top: 399.999999999999px
}
.workTableViewApp > .main > .left > .box-card:nth-of-type(4) {
  position: absolute;
  left: 50%;
  top: 399.999999999999px
}
.workTableViewApp > .main > .left > .box-card > .el-card__body {
  min-height: 240px;
}
.workTableViewApp > .main > .right {
  flex: 2;
  height: 716.66666666px;
  padding-top: 33.333333333px
}
.workTableViewApp > .main > .right > .box-card {
  height: 100%;
  color: #409EFF;
  font-family: "San Francisco UI", "微软雅黑", Arial
}
.workTableViewApp > .main > .right ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
  margin-bottom: 10px;
  color: #000
}
.workTableViewApp > .main > .right ul > li {
  margin-bottom: 18px
}
.workTableViewApp > .main > .right ul > li > a{
  display: inline-block;
  width: 255px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden
}
.workTableViewApp > .main > .right ul > li > span {
  display: inline-block;
  vertical-align: top
}
.workTableViewApp > .main > .right a {
  text-decoration: none;
  color: red
}
</style>
