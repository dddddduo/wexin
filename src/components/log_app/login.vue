<template>
  <div id="login">
    <div class="form">
      <div class="img_wrap">
        <img src="../../assets/log_app/logo4.png" alt="" @click='handleBug'>
      </div>
      <div class="form_line">
        <i class="iconfont icon-icon_account"></i>
        <input type="text" v-model="account" placeholder="请输入账号" @focus="showButton = false" @blur="handleBlur">
      </div>
      <p class="err_msg">{{errInfo.account}}</p>
      <div class="form_line" v-if='logType === "0"'>
        <i class="iconfont icon-mima"></i>
        <input type="password" v-model="password" placeholder="请输入密码" @focus="showButton = false" @blur="handleBlur">
      </div>
      <div class="code_line" v-if="logType === '2'">
        <div class="code_section">
          <i class="iconfont icon-icon"></i>
          <input type="tel" v-model="innerCode" placeholder="请输入验证码" maxlength="6" @focus="showButton = false" @blur="handleBlur">
        </div>
        <div class="conut_line" @click="handleCode">
          {{conutNum}}
        </div>
      </div>
      <p class="err_msg" v-if='logType !== "1"'>{{errInfo.password || errInfo.code}}</p>
      <div class="btn">
        <button type="button" name="button" @click="handleSubmit">{{logType !== '1' ? '立即登录' : '人脸识别登录'}}</button>
      </div>
      <div class="operation">
        <span @click="handleNav($event, 3)">快捷登陆</span>
        <span @click="handleType(0)" v-if='logType !== "0"'>账号密码登陆</span>
        <!-- <span @click="handleType(1)" v-if='logType !== "1"'>人脸识别登录</span> -->
        <span @click="handleType(2)" v-if='logType !== "2"'>微信绑定登陆</span>
        <span @click="handleSlide(1)" v-if='logType !== "1"'>更多</span>
      </div>
    </div>
    <p class='button_tip' v-if="showButton">
      登录即代表同意
      <router-link to="#">《服务条款》</router-link>
      和
      <router-link to="#">《隐私服务》</router-link>
    </p>
    <div class="modal" v-if="showModal" @click="handleSlide(null)">
      <ul class="button_menu" :class="slide" @click.stop="">
        <li @click="handleNav($event, 1)">找回密码</li>
        <li @click="handleNav($event, 2)">注册新账号</li>
        <!-- <li @click="handleNav($event, 3)">快捷登陆</li> -->
      </ul>
    </div>
    <div class="face_video" v-show="showVideo">
      <h4>{{infoTip}}</h4>
      <video src="" ref="video"></video>
    </div>
  </div>
</template>
<script>
const sha512 = require('js-sha512')
export default {
  name: 'login',
  data: () => ({
    logType: '0',
    errInfo: {},
    account: '',
    password: '',
    conutNum: '获取验证码',
    innerCode: '',
    showModal: false,
    slide: 'slide',
    showButton: true,
    showVideo: false,
    infoTip: ''
  }),
  mounted () {
    if (this.$route.query.phone) this.phone = this.$route.query.phone
    window.addEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    // 登陆方式选择
    handleType (e) {
      // console.log(e)
      const that = this
      that.errInfo = {}
      if (e === 0) {
        that.logType = '0'
      } else if (e === 1) {
        that.logType = '1'
      } else {
        // 获取openid
        that.$ajax(`/sw/login/config`).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            let REDIRECT = encodeURIComponent('https://dev.ninstarscf.com/wx_web/wx_index.html#/signture')
            let baseURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.data.data.appid}&redirect_uri=${REDIRECT}&response_type=code&scope=${res.data.data.scope}&state=${res.data.data.state}#wechat_redirect`
            location.href = baseURL
          } else {
            that.$wechat.topTips(res.data.message)
          }
        })

        // let getToken = (len, need) => {
        //   const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        //   let str = ''
        //   for (let i = 0; i <= len - 1; i++) {
        //     str += words[parseInt(Math.random() * 10000 % 36)]
        //     if ((i + 1) % 8 === 0 && need) str += '-'
        //   }
        //   return str.substring(0, str.length - 1)
        // }
        // let state = parseInt(Math.random() * 10000 % 9)
        // let code = getToken(8)
        // let baseURL = `#/signture?state=${state}&code=${code}`
      }
    },
    // 键盘登陆
    handleKeyboard (e) {
      if (e.keyCode === 13) {
        this.handleSubmit()
      }
    },
    // 取消聚焦
    handleBlur () {
      this.showButton = true
      window.scrollTo(0, 0)
    },
    // 后门程序
    handleBug () {
      // setTImeout(() => {}, 1000)
      localStorage.ns_token = '2426d66e476895b71b578b0142e3cce576d7d739'
      localStorage._au = 'true'
      this.$ajax.defaults.headers['Auth-Token'] = '2426d66e476895b71b578b0142e3cce576d7d739'
      this.$router.push('/')
    },
    // 获取验证码并倒计时
    handleCode () {
      const that = this
      if (that.conutNum === '获取验证码') {
        let regPhone = that.$store.state.reg.phone
        // let regEmail = that.$store.state.reg.email
        that.errInfo = {}
        if (regPhone.test(that.account)) {
          // that.$ajax.get('/wx/get_code?phone=' + that.account).then(res => {
          //   if (res.data.code !== 0) {
          //     that.handleCount()
          //   } else {
          //     that.handleError('phone', res.data.err_msg)
          //   }
          // })
          that.$ajax.get('/sw/smallprogram/phonecode?userName=' + that.account).then(res => {
            if (res.data.code === 400) {
              that.handleError('account', res.data.message)
            } else {
              that.handleCount()
            }
          })
        // } else if (regEmail.test(that.account)) {
        //   that.$ajax.get('/api/common/verifyCodeByAccount?userName=' + that.account).then(res => {
        //     console.log(res)
        //     if (res.data.code === 400) {
        //       that.handleError('account', res.data.message)
        //     } else {
        //       that.handleCount()
        //     }
        //   })
        // } else {
        } else {
          that.handleError('account', '账号格式错误')
        }
      }
    },
    // 异常验证
    handleError (key, info) {
      const that = this
      let { errInfo } = that
      info ? errInfo[key] = info : errInfo[key] = ''
      that.errInfo = errInfo
      that.$forceUpdate()
    },
    // 倒计时
    handleCount (num) {
      const that = this
      let n = num || 120
      that.conutNum = n + 's'
      var timer = setInterval(function () {
        if (!n) {
          that.conutNum = '获取验证码'
          // that.$forceUpdate()
          clearInterval(timer)
        } else {
          n--
          that.conutNum = n + 's'
        }
      }, 1000)
    },
    // 弹框
    handleSlide (e) {
      if (!e) {
        this.slide = 'down'
        var timer = setTimeout(() => {
          this.showModal = false
          clearTimeout(timer)
        }, 220)
      } else {
        this.slide = 'slide'
        this.showModal = true
      }
    },
    // 点击跳转导航
    handleNav (e, key) {
      const that = this
      let d = e.target
      d.style.background = 'rgba(0, 24, 8, .14)'
      d.style.color = '#666'
      let urls = ['', '/forget_phone', '/register']
      var timer = setTimeout(() => {
        d.style.background = 'rgba(0, 0, 0, 0)'
        d.style.color = '#353535'
        clearTimeout(timer)
        if (urls[key]) {
          that.$router.push({
            path: urls[key]
          })
        } else {
          that.logType = '2'
          that.handleSlide()
        }
      }, 20)
    },
    // 三种方式登陆
    handleSubmit () {
      const that = this
      that.errInfo = {}
      let regPhone = that.$store.state.reg.phone
      // let regEmail = that.$store.state.reg.email
      if (that.logType === '0') {
        if (regPhone.test(that.account)) {
          if (that.password === '') {
            that.handleError('password', '请输入密码')
          } else {
            that.handleInterface({userName: that.account, password: that.password})
          }
        } else {
          that.handleError('account', '账号格式错误')
        }
      } else if (that.logType === '1') {
        if (regPhone.test(that.account)) {
          that.handleAuth()
        } else {
          that.handleError('account', '账号格式错误')
        }
      } else if (that.logType === '2') {
        if (regPhone.test(that.account)) {
          if (that.innerCode === '') {
            that.handleError('code', '请输入验证码')
          } else {
            that.handleInterface({userName: that.account, code: that.innerCode, osType: 2})
          }
        } else {
          that.handleError('account', '账号格式错误')
        }
      }
    },
    // ajax 接口
    handleInterface (data) {
      const that = this
      if (that.logType === '2') {
        that.$ajax({
          method: 'POST',
          url: '/sw/smallprogram/RapidLanding',
          params: data
        }).then(res => {
          if (res.data.code === 400) {
            that.handleError('code', res.data.message)
          } else if (res.data.code === 200) {
            console.log(res)
            localStorage._au = res.data.data.auth
            localStorage._cfca = res.data.data.cfca
            localStorage._c = JSON.stringify({type: res.data.data.companyType, account: that.account})
            localStorage.im_sig = res.data.data.im_sig
            localStorage._key = res.data.data.key
            localStorage._name = res.data.data.name
            localStorage.ns_token = res.data.data.token
            that.$ajax.defaults.headers['Auth-Token'] = res.data.data.token
            localStorage.uid = JSON.stringify({id: res.data.data.uid, update_time: new Date().getTime()})
            that.$router.push('/')
          }
        })
      } else {
        if (data.userName) {
          that.$ajax({
            url: '/sw/smallprogram/login',
            params: {
              userName: data.userName,
              pwd: sha512(data.password)
            },
            method: 'POST'
          }).then(res => {
            console.log(res)
            if (res.data.code === 200) {
              localStorage._au = res.data.data.auth
              localStorage._cfca = res.data.data.cfca
              localStorage._c = JSON.stringify({type: res.data.data.companyType, account: that.account})
              localStorage.im_sig = res.data.data.im_sig
              localStorage._key = res.data.data.key
              localStorage._name = res.data.data.name
              localStorage.ns_token = res.data.data.token
              that.$ajax.defaults.headers['Auth-Token'] = res.data.data.token
              localStorage.uid = JSON.stringify({id: res.data.data.uid, update_time: new Date().getTime()})
              that.$router.push('/')
            } else {
              that.handleError('password', res.data.message)
            }
          })
        }
      }
    },
    // 人脸识别录制发送
    handleAuth () {
      const that = this
      if (navigator.mediaDevices) {
        const loading = this.$wechat.loading('启动中')
        navigator.mediaDevices.getUserMedia(
          {
            audio: false,
            video: {
              facingMode: 'user',
              width: window.screen.width,
              height: window.screen.height
            }
          }).then(um => {
          var video = document.querySelector('video')
          video.srcObject = um
          video.play()
          that.showVideo = true
          // 声明录制器
          let re = new window.MediaRecorder(um)
          re.blobs = []
          let chunks = []
          // 开始录制
          re.onstart = function () {
            loading.hide()
          }
          // 获取录制信息
          re.ondataavailable = function (e) {
            re.blobs.push(e.data)
            chunks.push(e.data)
          }
          // 停止录制，上传视频
          re.onstop = function (e) {
            that.recorderFile = new Blob(chunks, {'type': 'video/mp4'})
            let file = new File([that.recorderFile], 'msr-' + (new Date()).toISOString().replace(/:|\./g, '-') + '.mp4', {'type': 'video/mp4'})
            that.file = file
            that.handleUpload(file)
            // 关闭媒体流
            // that.handleCloseStream(um)
          }
          re.start()
          // 录制过程
          that.handleTimer(re)
        }).catch(() => {
          loading.hide()
          that.$wechat.topTips('网络错误')
        })
      } else {
        that.$wechat.topTips('设备或网络不支持智能识别')
      }
    },
    // 录制计时器
    handleTimer (re, s) {
      let i = s || 12
      const that = this
      that.infoTip = '请在明亮光源下进行'
      let timer = setInterval(() => {
        if (i === 10) {
          that.infoTip = '请转动眼睛'
        } else if (i === 5) {
          that.infoTip = '请张开嘴巴'
        } else if (i === 0) {
          // that.infoTip = '审核中'
          that.showVideo = false
          re.stop()
          clearInterval(timer)
        }
        i--
      }, 1000)
    },
    // 上传文件
    handleUpload (file) {
      const that = this
      let loading = that.$wechat.loading('认证中...')
      let data = new FormData()
      data.append('lv', file)
      data.append('userName', that.account)
      data.append('source', 'gzh')
      data.append('sign', that.$utils.$encode({source: 'gzh', userName: that.account}))
      that.$ajax({
        method: 'POST',
        url: '/api/login/live',
        data
      }).then(res => {
        loading.hide()
        if (res.data.code === 400) {
          that.handleError('account', '登陆失败，请选择其他方式登录')
        } else if (res.data.code === 200) {
          localStorage._au = res.data.data.auth
          localStorage._cfca = res.data.data.cfca
          localStorage._c = JSON.stringify({type: res.data.data.companyType, account: that.account})
          localStorage.im_sig = res.data.data.im_sig
          localStorage._key = res.data.data.key
          localStorage._name = res.data.data.name
          localStorage.ns_token = res.data.data.token
          localStorage.uid = JSON.stringify({id: res.data.data.uid, update_time: new Date().getTime()})
          that.$router.push('/')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleOpenId (state) {
      let urlNow = encodeURIComponent(window.location.href)
      let scope = 'snsapi_base' // 静默授权 用户无感知
      let appid = 'wx4cc5d5c123123123'
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
      window.location.replace(url)
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeyboard)
  }
}
</script>
<style lang="scss" scoped>
@mixin lineborder {
  border: 2px solid $theme-border; /*px*/
  border-radius: 4px; /*px*/
}
// 动画
@keyframes slideUp {
  from {bottom: -800px;}
  to {bottom: 0}
}
@keyframes slideDown {
  from {bottom: 0}
  to {bottom: -800px;}
}
$lineHeight: rem(40px);
.slide {
  animation: slideUp .42s ease-in-out;
}
.down {
  animation: slideDown .42s ease-in-out;
}
.face_video {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  video {
  }
  h4 {
    color: #38adff;
    font-size: 36px; /*px*/
    position: absolute;
    top: rem(50px);
    width: 100%;
    text-align: center;
    z-index: 3;
  }
}
#login {
  color: #353535;
  padding: rem(50px) rem(20px);
  .img_wrap {
    text-align: center;
    img {
      margin: 0 auto;
      margin-bottom: rem(50px);
    }
  }
  .form_line {
    display: flex;
    background: #fff;
    align-items: center;
    justify-content: flex-start;
    padding: 0 rem(10px);
    @include lineborder;
    height: $lineHeight;
    i {
      color: #999;
      font-size: 44px; /*px*/
    }
    input {
      width: calc(100% - 16px);
      border: none;
      padding: 0 rem(5px);
      outline: none;
    }
  }
  .code_line {
    display: flex;
    height: $lineHeight;
    background: #fff;
    align-items: center;
    justify-content: space-between;
    padding: 0 rem(10px);
    @include lineborder;
    .code_section {
      display: flex;
      background: #fff;
      align-items: center;
      justify-content: flex-start;
      i {
        color: #999;
        font-size: 36px; /*px*/
      }
      input {
        width: rem(200px);
        border: none;
        padding: 0 rem(5px);
        outline: none;
      }
    }
  }
  .err_msg {
    height: rem(36px);
    line-height: rem(36px);
    color: $err;
  }
  .btn {
    button {
      width: 100%;
      height: $buttonHeight;
      background: $theme;
      border: none;
      color: #fff;
      outline: none;
      border-radius: 10px; /*px*/
      font-size: 32px; /*px*/
    }
  }
  .operation {
    display: flex;
    height: rem(48px);
    color: #353535;
    line-height: rem(48px);
    justify-content: space-between;
  }
  .button_tip {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: rem(45px);
    line-height: rem(45px);
    text-align: center;
    color: #999;
    a {
      color: $theme-b;
    }
  }
  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .63);
    top: 0;
    left: 0;
    z-index: 9;
    ul {
      background: #fff;
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: rem(20px);
      font-size: 28px; /*px*/
      li {
        padding: rem(2px) rem(10px);
        line-height: rem(40px);
        // border-bottom: 2px solid #dedede; /*px*/
      }
    }
  }
}
</style>
