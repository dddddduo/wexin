<template>
  <div id="change_account">
    <p class="old_account">
      原账号：
      <span>{{oldAccount}}</span>
    </p>
    <div class="form_line">
      <i class="iconfont icon-icon_account"></i>
      <input type="text" placeholder="请输入新的账号" v-model="account">
    </div>
    <div class="form_section">
      <div class="code_section">
        <i class="iconfont icon-icon"></i>
        <input type="tel" v-model="innerCode" placeholder="请输入验证码" maxlength="6" @focus="showButton = false" @blur="showButton = true">
      </div>
      <div class="conut_line" @click="handleCode">
        {{count}}
      </div>
    </div>
    <div class="btn">
      <button type="button" @click="handleSubmit">提交</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChangeAccount',
  data: () => ({
    count: '获取验证码',
    account: '',
    innerCode: '',
    oldAccount: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '修改账号'
  },
  mounted () {
    this.oldAccount = this.$route.query.account
  },
  methods: {
    // 获取验证码并倒计时
    handleCode () {
      const that = this
      if (that.count === '获取验证码') {
        let regPhone = that.$store.state.reg.phone
        let regEmail = that.$store.state.reg.email
        if (regPhone.test(that.account)) {
          that.$ajax.get('/wx/get_code?phone=' + that.account).then(res => {
            if (res.data.code !== 0) {
              that.handleCount()
            } else {
              that.$wechat.topTips(res.data.err_msg)
            }
          })
        } else if (regEmail.test(that.account)) {
          that.$ajax.get('/wx/get_code?email=' + that.account).then(res => {
            if (res.data.code !== 0) {
              that.handleCount()
            } else {
              that.$wechat.topTips(res.data.err_msg)
            }
          })
        } else {
          that.$wechat.topTips('账号格式错误')
        }
      }
    },
    // 倒计时
    handleCount (num) {
      const that = this
      let n = num || 120
      that.count = n + 's'
      var timer = setInterval(function () {
        if (!n) {
          that.count = '获取验证码'
          // that.$forceUpdate()
          clearInterval(timer)
        } else {
          n--
          that.count = n + 's'
        }
      }, 1000)
    },
    handleSubmit () {
      const that = this
      let regPhone = that.$store.state.reg.phone
      let regEmail = that.$store.state.reg.email
      if (that.account !== that.oldAccount) {
        if (regPhone.test(that.account)) {
          if (!that.count) {
            that.$wechat.topTips('验证码错误')
          } else {
            console.log(that.innerCode)
            that.$ajax.put('/wx/account?code=' + that.innerCode + '&phone=' + that.account).then(res => {
              if (res.data.code !== 0) {
                that.$router.push({
                  path: '/success',
                  query: {
                    title: '修改成功',
                    info: res.data.err_msg,
                    operate: 'change_account'
                  }
                })
              } else {
                that.$wechat.topTips(res.data.err_msg)
              }
            })
          }
        } else if (regEmail.test(that.account)) {
          if (!that.innerCode) {
            that.$wechat.topTips('验证码错误')
          } else {
            that.$ajax.put('/wx/account?code=' + that.innerCode + 'email=' + that.account).then(res => {
              if (res.data.code !== 0) {
                that.$router.push({
                  path: '/success',
                  query: {
                    title: '修改成功',
                    info: res.data.err_msg,
                    operate: 'change_account'
                  }
                })
              } else {
                that.$wechat.topTips(res.data.err_msg)
              }
            })
          }
        } else {
          that.$wechat.topTips('账号格式错误')
        }
      } else {
        that.$wechat.topTips('与原账号相同')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin lineborder {
  border: 2px solid $theme-border; /*px*/
  border-radius: 4px; /*px*/
}
$lineHeight: rem(40px);
#change_account {
  padding: rem(80px) rem(20px);
  font-size: 32px; /*px*/
  color: $theme-word;
  .old_account {
    color: #666;
    line-height: rem(48px);
    span {
      color: $theme-word;
      font-weight: bold;
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
  .form_section {
    display: flex;
    margin-top: rem(20px);
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
    .conut_line {
      color: #999;
    }
  }
  .btn {
    margin-top: $lineHeight * 1.5;
    button {
      width: 100%;
      height: $lineHeight;
      line-height: $lineHeight;
      background: $theme;
      border-radius: 10px; /*px*/
      color: #fff;
      border: none;
      font-size: 32px; /*px*/
    }
  }
}
</style>
