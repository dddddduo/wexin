<template>
  <div id="forget_phone">
    <div class="form">
      <div class="img_wrap">
        <img src="../../assets/log_app/logo4.png" alt="">
      </div>
      <p class="code_title">验证账号</p>
      <div class="code_input">
        <i class="iconfont icon-icon_account"></i>
        <input type="text" name="" v-model="account" placeholder="请输入手机号">
      </div>
      <p class="err_msg">{{err_msg}}</p>
      <button type="button" name="invite" @click='handleCheck'>立即验证</button>
      <!-- <p class="info">
        <span>已有账号，</span>
        <router-link
        :to="{ name: 'login', params: { from: 'loguo'}}">马上登录</router-link>
      </p> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'ForgetPhone',
  data: () => ({
    err_msg: '',
    account: '',
    forget: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '忘记密码'
  },
  methods: {
    // 提交邀请码
    handleCheck () {
      const that = this
      that.err_msg = ''
      let phoneReg = that.$store.state.reg.phone
      // let emailReg = that.$store.state.reg.email
      if (phoneReg.test(that.account)) {
        that.forget = {type: 'phone', account: that.account}
        that.handleInterface(that.forget)
      } else {
        that.err_msg = '账号格式错误'
      }
      // } else if (emailReg.test(that.account)) {
      //   that.forget = {type: 'email', account: that.account}
      //   that.handleInterface(that.forget)
      // } else {
      //   that.err_msg = '账号格式错误'
      // }
    },
    // 提交接口
    handleInterface (obj) {
      const that = this
      that.err_msg = ''
      that.$ajax.get('/sw/smallprogram/phonecode?userName=' + obj.account).then(res => {
        if (res.data.code === 200) {
          that.$router.push({
            path: '/change_password',
            query: {
              phone: obj.account
            }
          })
        } else {
          // that.handleCount()
          that.err_msg = '系统错误'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin lineborder {
  border: 2px solid $theme-border; /*px*/
  border-radius: 4px; /*px*/
}
#forget_phone {
  height: 100%;
  color: #353535;
  .form {
    padding: rem(50px) rem(20px);
    .img_wrap {
      text-align: center;
      img {
        margin: 0 auto;
        margin-bottom: rem(50px);
      }
    }
    .code_title {
      font-size: 32px; /*px*/
      line-height: rem(45px);
      color: #666;
    }
    .code_input {
      display: flex;
      background: #fff;
      align-items: center;
      justify-content: flex-start;
      padding: 0 rem(10px);
      @include lineborder;
      i {
        color: #999;
        font-size: 44px; /*px*/
      }
      input {
        width: calc(100% - 16px);
        height: rem(40px);
        border: none;
        padding: 0 rem(5px);
        outline: none;
      }
    }
    .err_msg {
      height: rem(30px);
      color: $err;
      line-height: rem(30px);
    }
    button[name=invite] {
      margin: 0 0 rem(30px) 0;
      border-radius: 10px; /*px*/
      width: 100%;
      height: $buttonHeight;
      background: $theme;
      color: #fff;
      border: none;
      font-size: 32px; /*px*/
    }
    p.info {
      text-align: right;
      a {
        color: $theme;
      }
    }
  }
}
</style>
