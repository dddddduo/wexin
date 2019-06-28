import Vue from 'vue'
import Vuex from 'vuex'
const APPConfig = require('../../manifest.js')

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    ...APPConfig,
    reg: {
      phone: /^1[23456789]\d{9}$/,
      email: /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      pwd: /^([a-zA-Z0-9]){8,16}$/
    },
    chargeType: [
      {label: '微信支付', value: 0, checked: true, icon: 'iconfont icon-zhifupingtai-weixin', color: '#1aad19'},
      {label: '线下支付', value: 1, checked: false, icon: 'iconfont icon-xinyongzhifu', color: '#0f4397'},
      {label: '中金支付', value: 2, checked: false, icon: 'iconfont icon-icon1', color: '#f5a66e'}
    ]
  },
  mutations: {
    getNumberReg (state, num) {
      let len = num || 2
      let regStr = `^-?\\d+\\.?\\d{0,${len}}$`
      state.reg.number = new RegExp(regStr)
    }
  },
  actions: {},
  getters: {}
})
