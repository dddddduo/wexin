// 项目相关配置

const md5 = require('md5')
const qrcode = require('qrcode-svg')

module.exports = {
  appId: 'wx8572f5646a413906',
  api: 'https://dev.ninstarscf.com/api/sw',
  appList: [
    {
      title: '账号管理',
      url: '/account',
      order: 1,
      icon: 'iconfont icon-zhanghaoguanli',
      color: 'linear-gradient(to top right, #eb6100 37%, #fff);',
      onlyColor: '#eb6100'
    },
    {
      title: '我的审核',
      url: '/cooperation_list',
      rder: 2,
      icon: 'iconfont icon-shenhetongguo',
      color: 'linear-gradient(to top right, #0f439c 37%, #fff);',
      onlyColor: '#0f439c'
    },
    // {
    //   title: '我的账户',
    //   url: '/wallet',
    //   order: 3,
    //   icon: 'iconfont icon-zhanghuchongzhi-copy',
    //   color: 'linear-gradient(to top right, #00937f 37%,#fff);',
    //   onlyColor: '#00937f'
    // },
    {
      title: '经办人管理',
      url: '/account/agent',
      icon: 'iconfont icon-jiaoseguanli',
      color: 'linear-gradient(to top right, #eb9700 37%, #993f00);',
      onlyColor: '#00937f'
    },
    {
      title: '我的消息',
      url: '/message',
      order: 4,
      icon: 'iconfont icon-xiaoxi3',
      color: 'linear-gradient(to top right, #eb9700 37%, #fff);',
      onlyColor: '#eb9700'
    },
    // {
    //   title: '发票查验',
    //   url: '/check_invoice',
    //   order: 5,
    //   icon: 'iconfont icon-fapiao',
    //   color: 'linear-gradient(to top right, #eb9700 37%, #343434);',
    //   onlyColor: '#343434'
    // },
    // {
    //   title: '客户服务',
    //   url: null,
    //   order: 6,
    //   icon: 'iconfont icon-kefu',
    //   color: 'linear-gradient(to top right, #eb9700 37%, #993f00);',
    //   onlyColor: '#993f00'
    // },
    // {
    //   title: '我的名片',
    //   url: '/card',
    //   order: 7,
    //   icon: 'iconfont icon-mingpian',
    //   color: 'linear-gradient(to top right, #eb9700 37%, #38adff);',
    //   onlyColor: '#38adff'
    // }
  ],
  // 成功页面操作列表
  operation: {
    'login': {
      btn: '立即登录',
      count: 5,
      url: '/login'
    },
    'change_account': {
      btn: '回到首页',
      count: 5,
      url: '/'
    }
  },
  progress: {
    speed: 800,
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.3
  },
  evn: {
    https: true
  },
  utils: {
    $time: (time, type) => {
      var t = new Date(time)
      var yyyy = t.getFullYear()
      if (isNaN(yyyy)) {
        return false
      } else {
        var MM = t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1
        var dd = t.getDate() < 10 ? '0' + t.getDate() : t.getDate()
        var hh = t.getHours() < 10 ? '0' + t.getHours() : t.getHours()
        var mm = t.getMinutes() + 1 < 10 ? '0' + t.getMinutes() : t.getMinutes()
        var ss = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds()
        if (type === 1) {
          return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
        } else if (type === 2) {
          return yyyy + '-' + MM + '-' + dd
        } else {
          return hh + '-' + mm + '-' + ss
        }
      }
    },
    $encode: (params) => {
      if (typeof params === 'string') {
        return md5(params + localStorage._key)
      } else if (typeof params === 'object') {
        let str = ''
        for (let i in params) {
          str += `${i}=${params[i]}&`
        }
        // todo charCodeAt() 排序
        str = str.substring(0, str.length - 1) + localStorage._key
        return md5(str)
      }
    },
    $url: (url) => {
      if (url) {
        return url
      } else {
        return location.protocol + location.host
      }
    },
    $qrcode: (info) => {
      if (typeof info === 'object') {
        if (info.content) {
          let qr = new qrcode({
            content: info.content,
            padding: info.padding || 1,
            width: info.width || 256,
            heigth: info.height || 256,
            color: info.color || '#333333',
            background: info.background || '#ffffff',
            ecl: 'M'
          }).svg()
          return qr
        } else {
          return false
        }
      } else if (typeof info === 'string') {
        return new qrcode({
          content: info,
          padding: 1,
          color: '#333333',
          background: '#ffffff',
          width: 200,
          height: 200
        }).svg()
      } else {
        return false
      }
    },
    $formatNumber: (number) => {
      var num = Number(number || 0).toFixed(2).toString()
      var tail = num.slice(-3)
      var realNumber = num.substring(0, num.indexOf('.'))
      var result = ''
      while (realNumber.length > 3) {
        result = ',' + realNumber.slice(-3) + result
        realNumber = realNumber.slice(0, realNumber.length - 3)
      }
      if (realNumber) { result = realNumber + result }
      return result + tail
    }
  }
}
