<template>
  <div id="settings">
    <ul>
      <li class="setting_item" v-for="(item, index) in settings" :key="index" @click="handleNavicate($event, item, index)">
        <span>{{item.name}}</span>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <button class="btn" @click="logout($event)">退出登录</button>
  </div>
</template>
<script>
export default {
  name: 'Account',
  data: () => ({
    settings: [
      // {name: '修改账号', url: '/account/auth_account?from=account'},
      {name: '修改密码', url: '/account/auth_account?from=password'},
      // {name: '经办人管理', url: '/account/agent'},
      // {name: '认证与变更', url: '/account/auth'},
      {name: '绑定微信账户'}
      // {name: '子账号管理', url: '/account/sub_account'}
      // {name: '消息管理', url: '/account/message'},
      // {name: '关于APP', url: '/account/about'}
    ]
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '账号管理'
  },
  methods: {
    logout () {
      const that = this
      this.$wechat.confirm('退出无法收到平台信息', {
        title: '确认退出？',
        buttons: [{
          label: '取消',
          type: 'default'
        }, {
          label: '确认',
          type: 'error',
          onClick: function () {
            localStorage.removeItem('id')
            localStorage.removeItem('ns_token')
            delete that.$ajax.defaults.headers['Auth-Token']
            that.$router.push('/login?from=logout')
          }
        }]
      })
    },
    handleNavicate (e, item, index) {
      const that = this
      e.target.style.background = 'rgba(255, 255, 255, .33)'
      setTimeout(() => {
        if (index !== 3) {
          that.$router.push(item.url)
        } else {
          // that.$wechat.toast('开发中...', function () {
          //   e.target.style.background = '#fff'
          // })
          that.$ajax(`/sw/login/config`).then(res => {
            if (res.data.code === 200) {
              let REDIRECT = encodeURIComponent('https://dev.ninstarscf.com/wx_web/wx_index.html#/signture')
              let baseURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.data.data.appid}&redirect_uri=${REDIRECT}&response_type=code&scope=${res.data.data.scope}&state=${res.data.data.state}#wechat_redirect`
              location.href = baseURL
            } else {
              that.$wechat.topTips(res.data.message)
            }
          })
        }
      }, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
#settings {
  font-size: 28px; /*px*/
  color: $theme-word;
  ul {
    padding: rem(30px) 0;
    li {
      padding: 0 rem(16px);
      height: $buttonHeight;
      line-height: $buttonHeight;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      background: #fff;
      margin-bottom: rem(20px);
      background: #fff;
      i {
        color: #999;
      }
    }
  }
  .btn {
    position: fixed;
    width: 100%;
    height: $bottomButtom;
    line-height: $bottomButtom;
    bottom: 0;
    border: none;
    text-align: center;
    color: #fff;
    background: $err;
    font-size: 32px; /*px*/
  }
}
</style>
