<template>
  <div id="invite_code">
    <div class="form">
      <div class="img_wrap">
        <img src="../../assets/log_app/logo4.png" alt="">
      </div>
      <p class="code_title">邀请码验证</p>
      <div class="code_input">
        <i class="iconfont icon-yaoqingma"></i>
        <input type="text" name="" v-model="inviteCode">
      </div>
      <p class="err_msg">{{err_msg}}</p>
      <button type="button" name="invite" @click='handleCheck'>立即验证</button>
      <p class="info">
        <span>已有账号，</span>
        <router-link
        :to="{ name: 'login', params: { from: 'loguo'}}">马上登录</router-link>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InviteCode',
  data: () => ({
    err_msg: '',
    inviteCode: ''
  }),
  mounted () {
    let {inviteCode} = localStorage
    if (inviteCode) {
      this.$router.push('/register?history=1')
    }
  },
  methods: {
    // 提交邀请码
    handleCheck () {
      const that = this
      that.err_msg = ''
      if (!that.inviteCode) {
        that.err_msg = '请输入邀请码'
        // that.$wechat.topTips(
        //   '请输入邀请码', {
        //     duration: 1000,
        //     className: 'tool-err'
        //   }
        // )
      } else {
        let ld = that.$wechat.loading('校验中')
        // that.$ajax.post('/wx/invite_code', {code: that.inviteCode}).then(res => {
        //   ld.hide()
        //   if (res.data.code === 1) {
        //     // localStorage.inviteCode = JSON.stringify({code: that.inviteCode, update_time: new Date().getTime()})
        //     // ld.hide()
        //     that.$router.push('/register?history=0')
        //   } else {
        //     // ld.hide()
        //     // that.$wechat.topTips(res.data.err_msg)
        //     that.err_msg = res.data.err_msg
        //   }
        // })
        that.$ajax.get('/api/common/inviteCodeValidate?inviteCode=' + that.inviteCode).then(res => {
          ld.hide()
          if (res.data.result) {
            that.$router.push('/register?history=0')
          } else {
            that.err_msg = '验证码无效'
          }
        })
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
#invite_code {
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
    }
    p.info {
      text-align: right;
      a {
        color: $theme;
      }
    }
  }
}
.tool-err {
  opacity: .67;
}
</style>
