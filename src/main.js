// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI, { Alert } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { noLoginAuthPower, getWebSocketPath } from './api/api.js'
import './assets/icon/iconfont.css'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Alert)
Vue.prototype.$echarts = echarts
/* eslint-disable no-new */
// 免登录、鉴权
// router.beforeEach((to, from, next) => {
router.beforeEach(function (to, from, next) {
  if (to.meta.requireAuth) {
    // 需要鉴权，去判断之前是否记住登陆账号并且获取token值
    if (window.localStorage.getItem('token') || window.sessionStorage.getItem('token')) {
      noLoginAuthPower({
        token: window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
      }).then((res) => {
        let userName
        if (window.localStorage.getItem('accountName')) {
          userName = window.localStorage.getItem('accountName')
        } else {
          userName = window.sessionStorage.getItem('accountName')
        }
        let websocket
        let path
        getWebSocketPath({})
          .then(res => {
            if (res.state === 1000) {
              path = res.data.webSocketPath
              websocket = new WebSocket(path + '?accountName=' + userName)
              websocket.addEventListener('open', evn => {
                // console.log('已经连接')
              })
              websocket.addEventListener('message', evn => {
                // console.log('已经接收')
                // 红色提示信息
                store.commit('bellRed', false)
                let obj = JSON.parse(evn.data)
                if (obj.state === 1000) {
                  Vue.prototype.$notify({
                    title: '成功',
                    message: '成功',
                    type: 'success'
                  })
                  store.commit('refreshData', true)
                }
                if (obj.state === 2028) {
                  Vue.prototype.$notify({
                    title: '错误',
                    message: obj.message,
                    type: 'error'
                  })
                }
              })
            }
          })
        if (res.state === 1000) {
          next()
        } else if (res.state === 2002) {
          window.localStorage.removeItem('token')
          window.sessionStorage.removeItem('token')
          store.commit('changeShowOneOrSeond', true)
          next({
            path: '/login'
          })
        } else if (res.state === 2022) {
          Vue.prototype.$alert('用户状态已停用', {
            confirmButtonText: '确定',
            callback: action => {
              window.localStorage.removeItem('token')
              window.sessionStorage.removeItem('token')
              window.localStorage.removeItem('userName')
              window.localStorage.removeItem('showSecondMenu')
              window.localStorage.removeItem('accountName')
              window.sessionStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('userName')
              window.sessionStorage.removeItem('activeName')
              window.sessionStorage.removeItem('accountName')
              window.sessionStorage.removeItem('menuIndex')
              store.commit('changeName', '')
              store.commit('changeShowOneOrSeond', true)
              next('/')
            }
          })
        } else if (res.state === 2013) {
          Vue.prototype.$alert('您的账号已过期，请重新登录', {
            confirmButtonText: '确定',
            callback: action => {
              window.localStorage.removeItem('token')
              window.sessionStorage.removeItem('token')
              window.localStorage.removeItem('userName')
              window.localStorage.removeItem('showSecondMenu')
              window.localStorage.removeItem('accountName')
              window.sessionStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('userName')
              window.sessionStorage.removeItem('activeName')
              window.sessionStorage.removeItem('accountName')
              window.sessionStorage.removeItem('menuIndex')
              store.commit('changeName', '')
              store.commit('changeShowOneOrSeond', true)
              next('/')
            }
          })
        }
      })
    } else {
      next({
        path: '/'
      })
    }
  } else {
    if (window.localStorage.getItem('token') || window.sessionStorage.getItem('token')) {
      noLoginAuthPower({
        token: window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
      }).then((res) => {
        if (res.state === 1000) {
          next()
        } else if (res.state === 2022) {
          Vue.prototype.$alert('用户状态已停用', {
            confirmButtonText: '确定',
            callback: action => {
              window.localStorage.removeItem('token')
              window.sessionStorage.removeItem('token')
              window.localStorage.removeItem('userName')
              window.localStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('userName')
              window.sessionStorage.removeItem('activeName')
              window.sessionStorage.removeItem('menuIndex')
              store.commit('changeName', '')
              store.commit('changeShowOneOrSeond', true)
              next('/')
            }
          })
        } else if (res.state === 2013) {
          Vue.prototype.$alert('您的账号已过期，请重新登录', {
            confirmButtonText: '确定',
            callback: action => {
              window.localStorage.removeItem('token')
              window.sessionStorage.removeItem('token')
              window.localStorage.removeItem('userName')
              window.localStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('showSecondMenu')
              window.sessionStorage.removeItem('userName')
              window.sessionStorage.removeItem('activeName')
              window.sessionStorage.removeItem('menuIndex')
              store.commit('changeName', '')
              store.commit('changeShowOneOrSeond', true)
              next('/')
            }
          })
        }
      })
    } else {
      next()
    }
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
