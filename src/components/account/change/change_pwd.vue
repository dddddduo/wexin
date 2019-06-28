<template>
  <div id="change_password">
    <div class="form">
      <div class="show_line">
        <span>账号：</span>
        <span>{{account}}</span>
      </div>
      <!-- <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input type="password" v-model="oldPwd" placeholder="请输入原密码" >
      </div> -->
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="password" type="password" placeholder="8 - 16位字母或数字" maxlength="16">
      </div>
      <div class="input_line">
        <i class="iconfont icon-mima"></i>
        <input v-model="repassword" type="password" placeholder="确认新密码" maxlength="16">
      </div>
    </div>
    <button type="button" name="submit" @click="handleSubmit">修改密码</button>
  </div>
</template>
<script>
let sha512 = require('js-sha512')
export default {
  name: 'ChangePassword',
  data: () => ({
    oldPwd: '',
    account: '',
    password: '',
    repassword: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '修改密码'
  },
  mounted () {
    this.account = this.$route.query.account
  },
  methods: {
    // 注册提交
    handleSubmit () {
      const that = this
      that.errInfo = {}
      that.$forceUpdate()
      let pwd = that.$store.state.reg.pwd
      if (!(pwd.test(that.password))) {
        that.$wechat.topTips('请输入8 - 16位数字或字母')
      } else {
        if (that.repassword !== that.password) {
          that.$wechat.topTips('两次密码不同')
        } else {
          let loading = that.$wechat.loading('修改中...')
          that.$ajax({
            method: 'POST',
            url: '/sw/smallprogram/resetPwdByCode',
            params: {userName: that.account, pwd: sha512(that.password), code: that.$route.query.code}
          }).then(res => {
            loading.hide()
            if (res.data.code === 400) {
              that.$wechat.topTips(res.data.message)
            } else if (res.data.code === 200) {
              delete that.$ajax.defaults.headers['Auth-Token']
              localStorage.removeItem('ns_token')
              that.$router.push({
                path: '/success',
                query: {
                  title: '您已修改密码',
                  info: '您的登录账号为' + that.account,
                  operate: 'login',
                  p: that.account
                }
              })
            }
            // console.log(res)
          })
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
  color: $theme-word;
  font-size: 32px; /*px*/
  .img_wrap {
    text-align: center;
    img {
      margin: 0 auto;
      margin-bottom: rem(50px);
    }
  }
  .show_line {
    color: #666;
    span:last-child {
      color: $theme-word;
      font-weight: bold;
    }
  }
  .input_line {
    margin-top: rem(20px);
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
  button[name=submit] {
    margin-top: rem(20px);
    border-radius: 10px; /*px*/
    width: 100%;
    height: $buttonHeight;
    background: $theme;
    color: #fff;
    border: none;
    font-size: 32px; /*px*/
    outline: none;
  }
}
</style>
