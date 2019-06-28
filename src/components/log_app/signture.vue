<template>
  <div id="signture">
    <div class="show_code" v-if="code && state">
      <div class="bind_phone" v-if="!bindPhone">
        <p>绑定成功</p>
        <p>微信账号绑定成功，请填写手机号用作平台账号。</p>
        <div class="input_line">
          <input type="tel" maxlength='11' v-model='phone' placeholder="请输入手机号">
        </div>
        <div class="code_line">
          <div class="code_section">
            <input type="tel" v-model="innerCode" placeholder="请输入验证码" maxlength="6">
          </div>
          <div class="conut_line" @click="handleCode">
            {{conutNum}}
          </div>
        </div>
        <div class="btn">
          <button type="button" @click="handleBind">绑定</button>
        </div>
      </div>
      <div class="bind_phone" v-if="bindPhone">
        <p>您已绑定手机</p>
        <p>即将登陆，跳转中。。。</p>
      </div>
    </div>
    <div class="show_code no_code" v-else>
      <div class="bind_phone">
        <p>绑定失败</p>
        <p>微信账号绑定失败，请返回并选择其他方式登录。</p>
        <div class="btn">
          <button type="button" name="button" @click="$router.push('/login')">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'signture',
  data: () => ({
    code: '',
    state: '',
    bindPhone: true,
    phone: '',
    openid: '',
    conutNum: '获取验证码',
    innerCode: ''
  }),
  mounted () {
    const that = this
    console.log(location.search)
    let strData = location.search.substring('1', location.search.length)
    let arr = strData.split('&')
    const dataArr = arr.map(val => val.split('='))
    let wx = {}
    dataArr.forEach(val => {
      wx[val[0]] = val[1]
    })
    console.log(wx)
    let {code, state} = wx
    if (code && state) {
      that.code = code
      that.state = state
      console.log(state)
      that.$ajax({
        method: 'POST',
        url: '/sw/login/validate',
        params: {
          code, state
        }
      }).then(res => {
        if (res.data.code === 200) {
          that.bindPhone = res.data.phone
          if (res.data.phone) that.handleLogin({userName: that.phone, state: that.state, usercode: this.uesrcode})
          that.openid = res.data.open_id
        }
      })
    }
  },
  methods: {
    handleLogin (params) {
      const that = this
      that.$ajax({
        method: 'POST',
        url: '/wx/we_chat_login',
        params
      }).then(res => {
        if (res.data.code === 400) {
          that.$wechat.topTips(res.data.message)
        } else if (res.data.code === 200) {
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
    },
    handleCode () {
      console.log('code')
      const that = this
      if (!(that.$store.state.reg.phone.test(that.phone))) {
        that.$wechat.topTips('请输入正确格式的手机号')
      } else {
        that.$ajax.get('/sw/smallprogram/operatorcode?userName=' + that.phone).then(res => {
          if (res.data.code === 200) {
            that.handleCount()
          } else {
            that.$wechat.topTips(res.data.message)
          }
        })
      }
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
    handleBind () {
      const that = this
      let {phone, openid} = that
      if (!(that.$store.state.reg.phone.test(that.phone))) {
        that.$wechat.topTips('请输入正确格式的手机号')
      } else {
        that.$ajax.post('/wx/bind_phone', {phone, openid}).then(res => {
          // console.log(res)
          if (res.data.code === 1) {
            that.bindPhone = 1
            that.handleLogin({userName: that.phone, state: that.state, usercode: that.usecode})
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#signture {
  font-size: 32px; /*px*/
  .show_code {
    .bind_phone {
      p:first-child {
        font-size: 40px; /*px*/
        padding: rem(45px) 0;
        text-align: center;
        font-weight: bold;
        color: #333;
      }
      p:nth-child(2) {
        padding: 0 rem(36px);
        line-height: rem(36px);
        color: #666;
      }
      .input_line {
        padding: 0 rem(20px);
        margin:rem(30px) 0;
        input {
          width: 100%;
          height: rem(40px);
          padding: rem(8px);
          // border: none;
          border: 2px solid $theme-border; /*px*/
          outline: none;
        }
      }
      .code_line {
        display: flex;
        height: rem(40px);
        background: #fff;
        align-items: center;
        justify-content: space-between;
        padding: 0 rem(10px);
        margin:rem(30px) rem(20px);
        border: 2px solid $theme-border; /*px*/
        .conut_line {
          color: #999;
          text-align: center;
        }
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
      .btn {
        padding: 0 rem(20px);
        margin-top: rem(36px);
        button {
          width: 100%;
          height: $buttonHeight;
          line-height: $buttonHeight;
          background: $theme;
          color: #fff;
          outline: none;
          font-size: 32px; /*px*/
          border: none;
        }
      }
    }
  }
}
</style>
