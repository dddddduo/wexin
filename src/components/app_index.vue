<template>
  <div id="app_index">
    <h3>{{infoData.name}}</h3>
    <!-- <div class="address" @click="handleMap">
      <i class="iconfont icon-dingwei"></i>
      {{infoData.address}}
    </div>
    <div class="phone">
      <i class="iconfont icon-dianhua"></i>
      <a :href="'tel:' + infoData.phone">{{infoData.phone}}</a>
    </div> -->
    <p class="auth">
      审核状态：
      <i :class='infoData.verified ? "iconfont icon-pass-1-copy" : "iconfont icon-notpass-1-copy"'></i>
    </p>
    <ul>
      <li v-for="(item, index) in appList" :key="index" :style="'background: '+ item.onlyColor" @click="handleNavigator(item, index)">
        <div class="item_icon">
          <div class="icon_wrap">
            <i :class="item.icon"></i>
          </div>
        </div>
        <p>
          <span>{{item.title}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'AppIndex',
  data () {
    let {appList} = this.$store.state
    return {
      appList,
      infoData: {
        name: '获取中'
      }
    }
  },
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '我的九星'
  },
  mounted () {
    this.infoData = {
      name: localStorage._name ? localStorage._name : '',
      verified: localStorage._au ? JSON.parse(localStorage._au) : ''
    }
    // const that = this
    // let id = JSON.parse(localStorage.id)
    // this.$ajax.get('/wx/business_info?id=' + id.id).then(res => {
    //   that.infoData = res.data.detail
    // })
  },
  methods: {
    handleMap () {
      this.$wechat.alert('地图查看地址')
    },
    handleNavigator (item) {
      const that = this
      if (that.infoData.verified) {
        let url = item.url
        if (item.order === 6) {
          that.$wechat.alert('联系客服')
        } else {
          if (url) {
            that.$router.push(url)
          } else {
            that.$wechat.toast('开发中')
          }
        }
      } else {
        that.$wechat.alert('您的企业还未进行认证，请前往认证。', {
          title: '未认证',
          buttons: [{
            label: '确认',
            type: 'default',
            onClick: function () {
              localStorage.removeItem('id')
              localStorage.removeItem('ns_token')
              that.$router.push('/login?from=logout')
            }
          }]
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#app_index {
  font-size: 32px; /*px*/
  color: $theme-word;
  h3 {
    font-weight: bolder;
    padding: rem(10px) rem(20px);
    font-size: 40px; /*px*/
    text-align: left;
  }
  .address {
    padding: 0 rem(20px);
    font-size: 28px; /*px*/
    color: #666;
    word-break: break-all;
  }
  .phone {
    padding: rem(10px) rem(20px);
    font-size: 28px; /*px*/
    color: #666;
    word-break: break-all;
    a {
      color: #666;
      text-decoration: none;
    }
  }
  &>p.auth {
    padding: rem(10px) rem(20px) 0;
    font-size: 28px; /*px*/
    i {
      color: $theme;
      font-size: 40px; /*px*/
      vertical-align: bottom;
    }
  }
  &>ul {
    padding: 0 rem(20px) rem(10px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 48%;
      margin-top: rem(20px);
      padding: rem(6px) rem(8px);
      border-radius: 10px; /*px*/
      .item_icon {
        line-height: rem(36px);
        .icon_wrap {
          width: rem(28px);
          height: rem(28px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #fff;
          i {
            font-size: 48px; /*px*/
            // font-weight: bold;
          }
        }
      }
      p:last-child {
        color: #fff;
        font-size: 28px; /*px*/
        line-height: rem(50px);
        // padding: 0 rem(10px);
        // text-align: right;
      }
    }
  }
}
</style>
