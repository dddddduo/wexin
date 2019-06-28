<template>
  <div id="auth_account">
    <p class='auth_title' v-if="account">当前账号：<span>{{account}}</span></p>
    <p class='auth_info'>已发送验证码，请输入验证码继续操作。</p>
    <p class="auth_tip" v-if="count !== '获取验证码'">请输入验证码({{count}}s)</p>
    <p class="auth_tip" v-else></p>
    <ul>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 0)' ref='code0'>
      </li>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 1)' ref='code1'>
      </li>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 2)' ref='code2'>
      </li>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 3)' ref='code3'>
      </li>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 4)' ref='code4'>
      </li>
      <li>
        <input type="tel" maxlength="1" @input='handleInput($event, 5)' ref='code5'>
      </li>
    </ul>
    <div class="btn">
      <button type="button" v-if="count === '获取验证码'" @click="handleCode">获取验证码</button>
      <button type="button" v-if="count !== '获取验证码'" @click="handleSubmit">提交</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AuthAccount',
  data: () => ({
    account: '',
    count: '获取验证码'
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '账号验证'
  },
  mounted () {
    const that = this
    // that.account = localStorage.account
    that.account = localStorage._c ? JSON.parse(localStorage._c).account : null
    that.$ajax.get('/sw/smallprogram/phonecode?userName=' + that.account).then(res => {
      // console.log(res)
      if (res.data.code === 200) {
        this.handleCount()
      }
    })
  },
  methods: {
    handleCount () {
      const that = this
      let count = 120
      that.count = count
      setInterval(() => {
        if (count === 0) {
          that.count = '获取验证码'
        } else {
          that.count = --count
        }
      }, 1000)
    },
    handleInput (e, order) {
      e.target.value = e.target.value.trim()
      if (order !== 5) {
        if (e.target.value.length === 1) {
          this.$refs['code' + (order + 1)].focus()
        }
      }
    },
    handleSubmit () {
      const that = this
      let valueArr = [that.$refs['code0'], that.$refs['code1'], that.$refs['code2'], that.$refs['code3'], that.$refs['code4'], that.$refs['code5']]
      let code = ''
      for (let i = 0; i <= valueArr.length - 1; i++) {
        // console.dir(valueArr[i].value)
        if (valueArr[i].value) {
          code += valueArr[i].value
        }
      }
      if (code.length === valueArr.length) {
        // const loading = that.$wechat.loading('验证中...')
        let path = that.$route.query.from === 'account' ? '/account/change_account' : '/account/change_password'
        that.$router.push({path, query: {account: that.account, code}})
        // that.$ajax.post('/wx/forget_phone', {account: that.account, code, type: 'phone'}).then(res => {
        //   loading.hide()
        //   if (res.data.code === 1) {
        //
        //   } else {
        //     that.$wechat.topTips(res.data.err_msg)
        //   }
        // })
      } else {
        that.$wechat.topTips('验证码错误')
      }
    },
    handleCode () {
      const that = this
      that.$ajax('/sw/code/verifyCodeByAccount?userName=' + that.account).then(res => {
        if (res.data.code === 200) {
          that.count = '120'
          that.handleCount()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#auth_account {
  padding: rem(30px) rem(20px);
  font-size: 32px; /*px*/
  color: $theme-word;
  .auth_title {
    padding: rem(15px) 0;
    span {
      color: $theme-b;
      font-weight: bold;
    }
  }
  .auth_info {
    font-size: 28px; /*px*/
    coor: #666;
    line-height: rem(32px);
  }
  .auth_tip {
    height: rem(32px);
    margin: rem(20px) 0;
    font-size: 28px; /*px*/
    color: #999;
    line-height: rem(32px);
  }
  ul {
    display: flex;
    justify-content: space-between;
    li {
      width: rem(40px);
      height: rem(40px);
      input {
        width: 100%;
        height: 100%;
        padding: rem(6px) rem(8px);
        outline: none;
        border: 2px solid $theme-border; /*px*/
        -webkit-appearance: none;
        text-align: center;
        border-radius: 10px; /*px*/
        font-size: 32px; /*px*/
      }
      input:focus {
        border: 2px solid $theme-b; /*px*/
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    button {
      font-size: 32px; /*px*/
      width: 100%;
      height: $bottomButtom;
      line-height: $bottomButtom;
      background: $theme-b;
      text-align: center;
      border: none;
      color: #fff;
      outline: none;
    }
  }
}
</style>
