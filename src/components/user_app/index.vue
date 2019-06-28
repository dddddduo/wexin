<template>
  <div id="user_index">
    <div class="board">
      <div class="avatar_wrap">
        <img :src="userInfo.avatar ? '' : require('../../assets/user_app/boss.png')" alt="">
      </div>
      <div class="user_info">
        <p>{{userInfo.name}}</p>
        <p class="user_desc"><i class="iconfont icon-weizhi"></i>{{userInfo.address}}</p>
      </div>
      <!-- <div class="message">
        <i class="iconfont icon-xiaoxi"></i>
      </div> -->
    </div>
    <ul class="settings">
      <li v-for="(item, index) in settings" :key="index" @click="handleNavicate($event, item)">
        <span>{{item.name}}</span>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'UserIndex',
  data: () => ({
    userInfo: {},
    settings: [
      {name: '企业介绍', url: '/business_introduce', order: 1},
      {name: '联系方式', url: '/business_contact', order: 2},
      {name: '经办人管理', url: '/agent_managetment', order: 3},
      {name: '工商信息', url: '/business_info', order: 4},
      {name: '我的博客', url: '/my_blog', order: 5},
      {name: '企业相册', url: '/business_album', order: 6},
      {name: '自我评价', url: '/self_appraise', order: 7}
    ]
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '个人中心'
  },
  mounted () {
    const that = this
    let id = localStorage.id || '1'
    this.$ajax.get('/wx/business_info?id=' + id).then(res => {
      if (res.data.code === 1) {
        that.userInfo = res.data.detail
      } else {
        that.$wechat.topTips(res.data.err_msg, {}, function () {
          that.$router.push('/login')
        })
      }
    })
  },
  methods: {
    handleNavicate (e, item) {
      const that = this
      let dom = e.target
      dom.style.background = 'rgba(255, 255, 255, .33)'
      setTimeout(() => {
        dom.style.background = 'rgb(255, 255, 255)'
        that.$router.push({
          path: item.url,
          query: {
            title: encodeURIComponent(item.name)
          }
        })
      }, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
#user_index {
  color: $theme-word;
  .board {
    // height: 33%;
    background: linear-gradient(to right bottom, $theme 33%, $theme-d);
    padding: rem(36px) rem(20px);
    display: flex;
    position: relative;
    .avatar_wrap {
      width: 190px; /*px*/
      img {
        border-radius: 50%;
        width: rem(90px);
        height: rem(90px);
      }
    }
    .user_info {
      width: calc(100% - 190px); /*px*/
      padding: rem(10px);
      p:first-child {
        color: #fff;
        height: rem(60px);
        line-height: rem(30px);
        font-size: 30px; /*px*/
        font-weight: bold;
        @include muline(2);
      }
      p:last-child {
        @include line;
        line-height: rem(30px);
        color: rgba(255, 255, 255, .75);
        font-size: 28px; /*px*/
      }
    }
    .message {
      color: #fff;
      position: absolute;
      top: rem(8px);
      right: rem(20px);
      i {
        font-size: 52px; /*px*/
      }
    }
  }
  .settings {
    padding: rem(40px) 0 0 0;
    li {
      padding: 0 rem(16px);
      margin-bottom: rem(16px);
      height: $buttonHeight;
      line-height: $buttonHeight;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      font-size: 28px; /*px*/
      background: #fff;
      i {
        color: #9a9a9a;
        float: right;
      }
    }
  }
}
</style>
