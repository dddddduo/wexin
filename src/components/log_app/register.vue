<template>
  <div id="register">
    <div class="form">
      <div class="img_wrap">
        <img src="../../assets/log_app/logo4.png" alt="">
      </div>
      <div class="input_line">
        <i class="iconfont icon-shouji"></i>
        <input type="tel" v-model="phone" placeholder="请输入手机号码" maxlength="11">
      </div>
      <div class="err_msg">{{errInfo.phone}}</div>
      <div class="code_line">
        <div class="code_section">
          <i class="iconfont icon-icon"></i>
          <input type="tel" v-model="innerCode" placeholder="请输入验证码" maxlength="6">
        </div>
        <div class="conut_line" @click="handleCode">
          {{conutNum}}
        </div>
      </div>
      <div class="err_msg">{{errInfo.code}}</div>
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="password" type="password" placeholder="请输入密码" maxlength="16">
      </div>
      <div class="err_msg">{{errInfo.pwd}}</div>
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="repassword" type="password" placeholder="确认密码" maxlength="16">
      </div>
      <div class="err_msg">{{errInfo.repwd}}</div>
      <!-- <div class="input_line">
        <i class="iconfont icon-dangan-"></i>
        <span :style="selType === 0 ? 'color: #999;' : ''" @click="handleSelect">{{types[selType].label}}</span>
      </div>
      <div class="err_msg">{{errInfo.type}}</div> -->
    </div>
    <div>
      <button type="button" name="register" @click="handleRegister">注册</button>
    </div>
  </div>
</template>
<script>
const sha512 = require('js-sha512')
export default {
  name: 'Register',
  data: () => ({
    conutNum: '获取验证码',
    phone: '',
    innerCode: '',
    password: '',
    repassword: '',
    types: [
      {
        label: '请选择注册类型',
        value: 0
      },
      {
        label: '企业',
        value: 1
      },
      {
        label: '金融机构',
        value: 2
      },
      {
        label: '促保贷/担保公司',
        value: 3
      }
    ],
    selType: 0,
    errInfo: {}
  }),
  methods: {
    // 获取验证码并倒计时
    handleCode () {
      const that = this
      if (that.conutNum === '获取验证码') {
        let reg = that.$store.state.reg.phone
        if (!(reg.test(that.phone))) {
          that.handleError('phone', '请输入正确格式的手机号码')
        } else {
          that.handleError('phone')
          that.$ajax.get('/sw/code/checkAccount?userName=' + that.phone).then(re => {
            console.log(re.data.data.result)
            if (!(re.data.data.result)) {
              that.$ajax('/sw/code/registerCode?userName=' + that.phone).then(res => {
                if (res.data.code === 200) {
                  that.handleCount()
                } else {
                  that.handleError('phone', res.data.message)
                }
              })
            } else {
              that.handleError('phone', '账号已存在')
            }
          })
        }
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
    // 选择类型
    handleSelect () {
      const that = this
      let arr = that.types.filter((val, index) => index)
      console.log(arr)
      that.$wechat.picker(arr, {
        defaultValue: [1],
        onConfirm: function (e) {
          that.selType = e[0].value
        }
      })
    },
    // 注册提交
    handleRegister () {
      const that = this
      that.errInfo = {}
      that.$forceUpdate()
      if (!(that.$store.state.reg.phone.test(that.phone))) {
        that.handleError('phone', '请输入正确的手机号码')
      } else {
        if (!that.innerCode) {
          that.handleError('code', '请输入验证码')
        } else {
          if (that.password.length < 6) {
            that.handleError('pwd', '密码长度6 - 16位')
          } else {
            if (that.repassword !== that.password) {
              that.handleError('repwd', '两次密码不同')
            } else {
              // if (!that.selType) {
              //   that.handleError('type', '请选择注册账号类型')
              // } else {
              // that.$ajax.post('/wx/register', {phone: that.phone, password: that.password, code: that.innerCode})
              that.$ajax({
                method: 'POST',
                url: '/sw/smallprogram/register',
                params: {
                  userName: that.phone,
                  pwd: sha512(that.password),
                  code: that.innerCode,
                  osType: '0'
                }
              }).then(res => {
                // console.log(res)
                that.$router.push({
                  path: '/success',
                  query: {
                    title: '您已注册成功',
                    info: '您的登陆账号为' + that.phone,
                    operate: 'login',
                    p: that.phone
                  }
                })
              })
              // }
            }
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
#register {
  color: #353535;
  padding: rem(50px) rem(20px);
  .img_wrap {
    text-align: center;
    img {
      margin: 0 auto;
      margin-bottom: rem(45px);
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
    input::placeholder {
      color: #999;
    }
    span {
      width: calc(100% - 16px);
      padding: 0 rem(5px);
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
      input::placeholder {
        color: #999;
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
  button[name=register] {
    font-size: 32px; /*px*/
    width: 100%;
    height: $buttonHeight;
    background: $theme;
    color: #fff;
    border: none;
    border-radius: 10px; /*px*/
  }
}
</style>
