<template>
  <div class="loginViewApp">
    <div class="bigBox">
      <div class="right">
        <div class="box">
          <el-input v-model="account" placeholder="用户名" class="account" prefix-icon="el-icon-user" @blur="checkAccount" clearable="" autocomplete="off" @keyup.enter.native="confirmEnter('account')"></el-input>
          <el-input placeholder="密码" v-model="password" show-password class="password" prefix-icon="el-icon-lock" clearable="" @blur="checkPassword" autocomplete="off" @keyup.enter.native="confirmEnter"></el-input>
          <el-checkbox v-model="checked" class="rember">记住账号</el-checkbox>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginPower, getAllPowerByUserPower } from '../api/api.js'
export default {
  data () {
    return {
      picPath: require('../assets/e312659bcf0a42018c7f3dc1571171daaaa.jpg'),
      account: '',
      password: '',
      checked: false,
      accountChecked: null,
      passwordChecked: null,
      datalevel11: [],
      datalevel2: [],
      jumpToDataStatistics: false
    }
  },
  methods: {
    // 校验邮箱（用户名）
    checkAccount (event) {
      if (this.account !== '') {
        this.accountChecked = true
        event.target.style.borderColor = '#DCDFE6'
      } else {
        this.accountChecked = false
        this.accountRed(this.accountChecked, event)
      }
    },
    accountRed (accbol, event) {
      if (!accbol) {
        let mess = this.$message({
          showClose: true,
          message: '用户名不能为空',
          type: 'warning'
        })
        setTimeout(() => {
          mess.close()
        }, 1000)
        event.target.style.borderColor = 'red'
      }
    },
    checkPassword (event) {
      if (this.password !== '') {
        this.passwordChecked = true
        event.target.style.borderColor = '#DCDFE6'
      } else {
        this.passwordChecked = false
        this.passwordRed(this.passwordChecked, event)
      }
    },
    passwordRed (pasbol, event) {
      if (!pasbol) {
        let mess = this.$message({
          showClose: true,
          message: '密码不能为空',
          type: 'warning'
        })
        setTimeout(() => {
          mess.close()
        }, 1000)
        event.target.style.borderColor = 'red'
      }
    },
    confirmEnter (ev) {
      this.login()
    },
    login () {
      if ((this.accountChecked && this.passwordChecked) || ((this.account !== '') && (this.password !== ''))) {
        loginPower({
          account: this.account,
          password: this.password
        }).then(res => {
          if (res.state === 1000) {
            if (window.localStorage.getItem('token') || window.sessionStorage.getItem('token')) {
              window.localStorage.removeItem('token')
              window.sessionStorage.removeItem('token')
              this.$store.commit('changeName', '')
              this.$store.commit('changeShowOneOrSeond', true)
            }
            // 判断是否勾选了记住账号
            if (this.checked) {
              window.localStorage.setItem('token', res.data.token)
              window.localStorage.setItem('showSecondMenu', 'true')
              window.localStorage.setItem('userName', res.data.realName)
              window.localStorage.setItem('accountName', this.account)
            } else {
              window.sessionStorage.setItem('token', res.data.token)
              window.sessionStorage.setItem('showSecondMenu', 'true')
              window.sessionStorage.setItem('userName', res.data.realName)
              window.sessionStorage.setItem('accountName', this.account)
            }
            this.$store.commit('changeName', res.data.realName)
            // this.$router.replace({
            //   path: '/worktable',
            //   query: {
            //     realName: res.data.realName
            //   }
            // })
            getAllPowerByUserPower({
              accountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
              resourcePageId: '50006'
            }).then(res => {
              if (res.state === 1000) {
                this.jumpToDataStatistics = res.data.power.some(ele => ele.powerName === '资源池管理')
                console.log(this.jumpToDataStatistics)
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
                // this.emitData(arrTem2)
                this.$store.commit('changeMenuData', arrTem2l1)
                this.$store.commit('changeMenuSideData', arrTem2)
                this.$store.commit('changeShowOneOrSeond', false)
                if (this.jumpToDataStatistics) {
                  this.$router.replace({
                    path: '/dataStatistics'
                  })
                } else {
                  this.$router.replace({
                    path: '/worktable',
                    query: {
                      realName: res.data.realName
                    }
                  })
                }
              } else {
                this.jumpToDataStatistics = false
                this.$router.replace({
                  path: '/worktable',
                  query: {
                    realName: res.data.realName
                  }
                })
              }
            }, rej => {
              this.jumpToDataStatistics = false
              this.$router.replace({
                path: '/worktable',
                query: {
                  realName: res.data.realName
                }
              })
            })
          } else if (res.state === 2002) {
            this.$message({
              showClose: true,
              message: '密码错误',
              type: 'warning'
            })
          } else if (res.state === 2006) {
            this.$message({
              showClose: true,
              message: '用户名错误',
              type: 'warning'
            })
          } else if (res.state === 2022) {
            this.$message({
              showClose: true,
              message: '用户状态停用',
              type: 'warning'
            })
          } else {
            this.$message({
              showClose: true,
              message: '网络错误，请稍后再试',
              type: 'warning'
            })
          }
        })
      } else {
        let mess = this.$message({
          showClose: true,
          message: '用户名和密码不能为空',
          type: 'warning'
        })
        setTimeout(() => {
          mess.close()
        }, 1000)
      }
    }
  },
  created () {
    console.log('log-view')
  }
}
</script>

<style>
.loginViewApp {
  width: 100%;
  height: 800px;
  background-color: #f2f2f2;
}
.loginViewApp > .bigBox {
  width: 1190px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center
}
.loginViewApp > .bigBox > .left {
  height: 640px;
  margin-left: 50px
}
.loginViewApp > .bigBox > .left > img {
  height: 640px
}
.loginViewApp > .bigBox > .right {
  flex: 1;
  height: 430px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0px
}
.loginViewApp > .bigBox > .right > .box {
  width: 450px;
  height: 400px;
  background-color: #f2f2f2;
  position: relative;
}
.loginViewApp > .bigBox > .right > .box > .account {
  width: 300px;
  position: absolute;
  top: 80px;
  left: 75px
}
.loginViewApp > .bigBox > .right > .box > .password {
  width: 300px;
  position: absolute;
  top: 150px;
  left: 75px
}
.loginViewApp > .bigBox > .right > .box > .rember {
  position: absolute;
  top: 220px;
  left: 75px
}
.loginViewApp > .bigBox > .right > .box > .el-button--primary {
  width: 300px;
  position: absolute;
  left: 75px;
  top: 300px;
}
</style>
