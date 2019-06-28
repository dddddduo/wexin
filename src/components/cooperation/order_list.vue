<template>
  <div id="order_list">
    <ul class="show_list">
      <li v-for="(item, index) in orderList" :key="index">
        <div class="show_section">
          <img :src="item.verifier ? pic.confirm : pic.unpass" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="icon_wrap">
          <i class="iconfont icon-qianwang"></i>
        </div>
      </li>
    </ul>
    <div class="btn">
      <button type="button" @click="handleModel(1)">拒绝</button>
      <button type="button" @click="handleModel(0)">同意</button>
    </div>
    <div class="model" v-if="model">
      <div class="window">
        <p class="window_title">{{model.title}}</p>
        <p class="window_content">{{model.content}}</p>
        <div class="window_text">
          <textarea v-if="model.key" v-model='refuseReason' placeholder="请输入拒绝理由"></textarea>
        </div>
        <div class="window_operation">
          <button @click="model = null">再想想</button>
          <button>确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CooOrderlist',
  data: () => ({
    orderList: [],
    pic: {
      confirm: require('../../assets/cooperation_app/nomal_confirm.png'),
      unpass: require('../../assets/cooperation_app/alert_unpass.png')
    },
    model: null,
    refuseReason: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.title
  },
  mounted () {
    const that = this
    that.$ajax.get(`/wx/contrac_order?id=${that.$route.query.id}&chain_id=${that.$route.query.chain_id}`).then(res => {
      console.log(res)
      if (res.data.code === 1) {
        that.orderList = res.data.list
      }
    })
  },
  methods: {
    handleModel (key) {
      // console.log()
      // this.$wechat.alert('123')
      let model = key ? {
        title: '同意本次协同确认',
        content: '本次协同确认同意后，当记账发生改变，可再次推送至您协同确认。',
        key
      } : {
        title: '拒绝本次协同确认',
        content: '本次协同确认拒绝后，当记账发生改变，可再次推送至您协同确认。',
        key
      }
      this.model = model
    }
  }
}
</script>
<style lang="scss" scoped>
#order_list {
  font-size: 28px; /*px*/
  .show_list {
    background: #fff;
    padding: 0 rem(20px);
    align-items: center;
    margin-bottom: $bottomButtom * 1.2;
    li {
      padding: 0 rem(5px);
      height: rem(46px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid $theme-border; /*px*/
      .show_section {
        width: rem(304px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: rem(20px);
          vertical-align: middle;
        }
        span {
          width: rem(290px);
          vertical-align: middle;
          margin-left: rem(5px);
          color: $theme-word;
          @include line;
        }
      }
      .icon_wrap {
        width: rem(20px);
        text-align: center;
        color: #999;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    button {
      width: 50%;
      height: $bottomButtom;
      line-height: $buttonHeight;
      font-size: 32px; /*px*/
      border: none;
      color: #fff;
    }
    button:first-child {
      background: $err;
    }
    button:last-child {
      background: $theme;
    }
  }
  .model {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 22;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: center;
    .window {
      background: #fff;
      width: rem(285px);
      padding-top: rem(16px);
      // border-radius: 10px; /*px*/
      .window_title {
        line-height: rem(32px);
        text-align: center;
        font-weight: bold;
      }
      .window_content {
        padding: 0 rem(15px);
        line-height: rem(24px);
      }
      .window_text {
        padding: 0 rem(15px);
        textarea {
          resize: none;
          width: 100%;
          height: rem(24 * 3px);
          padding: rem(3px);
          border: 2px solid $theme-border; /*px*/
        }
      }
      .window_operation {
        display: flex;
        border-top: 2px solid $theme-border; /*px*/
        margin-top: rem(15px);
        button {
          width: 50%;
          height: $buttonHeight * .8;
          line-height: $buttonHeight * .8;
          border: none;
          background: none;
        }
        button:first-child {
          color: #aaa;
          border-right: 2px solid $theme-border; /*px*/
        }
        button:last-child {
          color: $wechat-sucess;
        }
      }
    }
  }
}
</style>
