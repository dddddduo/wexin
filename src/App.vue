<template>
  <div id="app">
    <!-- <div class="header" v-show="!wechat">
      <div @click="handleBack" v-if="back">
        <i class="iconfont icon-qianwang"></i>
      </div>
      <p>{{title}}</p>
    </div>
    <div class="inner_header" v-show="!wechat"></div> -->
    <router-view/>
  </div>
</template>

<script>
// import wx from 'weixin-js-sdk'
export default {
  name: 'App',
  data () {
    return {
      title: '我的九星',
      back: false,
      wechat: true,
      transitionName: 'fade'
    }
  },
  mounted () {
    if (this.$route.name === 'AppIndex') {
      this.back = false
      this.title = '我的九星'
    } else {
      this.title = this.$route.meta.title
      this.back = true
    }
    // // console.log(wx)
    // const that = this
    // // 配置公众号
    // that.$ajax.get('/wx/init').then(res => {
    //   console.log(res)
    //   wx.config({
    //     debug: true,
    //     appId: res.data.appid,
    //     timestamp: res.data.timestamp,
    //     nonceStr: res.data.noncestr,
    //     signature: res.data.signature,
    //     jsApiList: []
    //   })
    // })
    // wx.ready(function () {
    // })
    // wx.error(function (err) {
    //   console.log(err)
    // })
  },
  methods: {
    handleBack () {
      this.$router.go(-1)
    }
  },
  watch: {
    '$route': function (to, from) {
      console.log(this.$ajax.defaults.headers)
      if (!this.$ajax.defaults.headers) {
        delete this.$ajax.defaults.headers['Auth-Token']
      }
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      if (to.name === 'AppIndex') {
        this.back = false
        this.title = '我的九星'
      } else {
        this.title = to.meta.title || '九星供应链交易大数据增信平台'
        this.back = true
      }
      if (from.name === 'login') {
        window.addEventListener('popstate', function () {
          history.pushState(null, null, document.URL)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
*{
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color:transparent;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
  background: $bg;
  // .inner_header {
  //   height: $header;
  // }
  // .header {
  //   height: $header;
  //   margin-bottom: $header;
  //   position: fixed;
  //   width: 100%;
  //   top: 0;
  //   background-color: $theme;
  //   p {
  //     line-height: $header;
  //     text-align: center;
  //     color: #fff;
  //     font-size: 36px; /*px*/
  //   }
  //   div {
  //     position: absolute;
  //     width: $header * .8;
  //     height: $header;
  //     line-height: $header;
  //     text-align: center;
  //     transform:rotateZ(180deg);
  //     color: #fff;
  //     i {
  //       color: #fff;
  //       font-size: 50px; /*px*/
  //     }
  //   }
  // }
}
</style>
