<template>
  <div id="change_password">
    <div class="form">
      <div class="img_wrap">
        <img src="../../assets/log_app/logo4.png" alt="">
      </div>
      <div class="show_line">
        <span>注册手机号：</span>
        <span>{{account}}</span>
      </div>
      <div class="code_line">
        <div class="code_section">
          <i class="iconfont icon-icon"></i>
          <input type="tel" v-model="innerCode" placeholder="请输入验证码" maxlength="6">
        </div>
        <!-- <div class="conut_line" @click="handleCode">
          {{conutNum}}
        </div> -->
      </div>
      <div class="err_msg">{{errInfo.code}}</div>
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="password" type="password" placeholder="请输入新密码" maxlength="16">
      </div>
      <div class="err_msg">{{errInfo.pwd}}</div>
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="repassword" type="password" placeholder="确认新密码" maxlength="16">
      </div>
    </div>
    <div class="err_msg">{{errInfo.repwd}}</div>
    <button type="button" name="submit" @click="handleSubmit">修改密码</button>
  </div>
</template>
<script>
export default {
  name: 'ChangePwd',
  data: () => ({
    conutNum: '获取验证码',
    account: '',
    innerCode: '',
    password: '',
    repassword: '',
    errInfo: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '修改密码'
  },
  mounted () {
    this.account = this.$route.query.account
    this.accountType = this.$route.query.type
  },
  methods: {
    // 获取验证码并倒计时
    handleCode () {
      const that = this
      if (that.conutNum === '获取验证码') {
        let str = that.accountType === 'phone' ? `phone=${that.account}` : `email=${that.account}`
        that.$ajax.get('/wx/get_code?' + str).then(res => {
          if (res.data.code !== 0) {
            that.handleCount()
          } else {
            that.handleError('phone', res.data.err_msg)
          }
        })
      }
    },
    // 异常处理
    handleError (key, info) {
      const that = this
      let { errInfo } = that
      info ? errInfo[key] = info : errInfo[key] = ''
      that.errInfo = errInfo
      that.$forceUpdate()
    },
    // 倒数
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
    // 注册提交
    handleSubmit () {
      const that = this
      that.errInfo = {}
      that.$forceUpdate()
      if (!that.innerCode) {
        that.handleError('code', '请输入验证码')
      } else {
        if (that.password.length < 6) {
          that.handleError('pwd', '密码长度6 - 16位')
        } else {
          if (that.repassword !== that.password) {
            that.handleError('repwd', '两次密码不同')
          } else {
            that.$ajax.put('/wx/reset_password', {account: that.account, password: that.password, code: that.innerCode}).then(res => {
              // console.log(res)
              that.$router.push({
                path: '/success',
                query: {
                  title: '您已修改密码',
                  info: '您的登录账号为' + that.account,
                  operate: 'login',
                  p: that.account
                }
              })
            })
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$lineHeight: rem(40px);
@mixin lineborder {
  border: 2px solid $theme-border; /*px*/
  border-radius: 4px; /*px*/
}
#change_password {
  padding: rem(50px) rem(20px);
  color: #353535;
  .img_wrap {
    text-align: center;
    img {
      margin: 0 auto;
      margin-bottom: rem(50px);
    }
  }
  .input_line {
    display: flex;
    background: #fff;
    align-items: center;
    justify-content: flex-start;
    height: $lineHeight;
    padding: 0 rem(10px);
    @include lineborder;
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
  .show_line {
    line-height: $lineHeight;
    font-size: 32px; /*px*/
    color: #666;
    span:last-child {
      color: #353535;
      font-weight: bold;
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
      // height: 100%;
      i {
        color: #999;
        font-size: 36px; /*px*/
      }
      input {
        width: rem(200px);
        border: none;
        padding: 0 rem(5px);
        outline: none;
        // font-size: 16px; /*px*/
      }
    }
    .conut_line {
      height: 100%;
      width: rem(80px);
      text-align: center;
      line-height: $lineHeight;
      color: #666;
      // padding: 0 rem(20px);
    }
  }
  .err_msg {
    height: rem(25px);
    color: $err;
    line-height: rem(25px);
  }
  button[name=submit] {
    border-radius: 10px; /*px*/
    width: 100%;
    height: $buttonHeight;
    background: $theme;
    color: #fff;
    border: none;
  }
}
</style>
