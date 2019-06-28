// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入图标文件
import './assets/font/iconfont.css'
// 引入样式重置文件
import './assets/common/reset.css'
// 配置rem文件
import 'lib-flexible/flexible'
// 全局加载axios
import axios from 'axios'
// vuex 文件
import store from './store/index.js'
// weui
import weui from 'weui.js'
// 剪贴板工具集
import VueClipboard from 'vue-clipboard2'
// 挂载配置文件
import {utils, progress} from '../manifest.js'
import 'weui'
// 顶部进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.$wechat = weui
Vue.prototype.$utils = utils
Vue.config.productionTip = false
axios.defaults.headers['Auth-Token'] = localStorage.ns_token
Vue.prototype.$ajax = axios

Vue.use(VueClipboard)
NProgress.configure(progress)

router.beforeEach((to, from, next) => {
  if (from.name) {
    NProgress.start()
  }
  if (to.meta.auth) {
    if (!localStorage.ns_token) {
      weui.alert('登陆过期，点击后重新登陆', {
        title: '登陆过期',
        buttons: [
          {
            label: '确认',
            type: 'primary',
            className: 'logout-confirm',
            onClick: function () {
              localStorage.removeItem('ns_token')
              window.location.href = '#/login'
            }
          }
        ]
      })
    }
  } else {
    if (localStorage.ns_token) {
      window.location.href = '/'
    }
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
