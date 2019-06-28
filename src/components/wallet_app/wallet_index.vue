<template>
  <div id="board">
    <div class="board">
      <p>账户余额</p>
      <div class="last_remain">
        <span>{{canIsee ? last + '': '**** '}}元</span>
        <i :class="canIsee ? 'iconfont icon-yanjing-bi' : 'iconfont icon-yanjing-zheng'" @click="canIsee = !canIsee"></i>
      </div>
      <div class="switch">
        <p v-if="useSwitch">可用预警阀值：
          <span>{{waringValue}}元</span>
          <span @click="handleModel(true)">修改</span>
        </p>
      </div>
    </div>
    <ul class="func">
      <li @click="handleNavicate(item.url)" v-for="(item, index) in service" :key='index'>
        <span>{{item.title}}</span>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <ul class="func">
      <li>
        <span>余额预警</span>
        <input class="weui-switch" :checked='useSwitch' type="checkbox" @change="handleSwitch($event)">
      </li>
      <li v-for="(item, index) in func" :key="index" @click="handleNavicate(item.url)">
        <span>{{item.title}}</span>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <div class="weui-mask" v-show="showModel">
      <div class="show_window" ref="modelWindow">
        <p>报警阀值设置</p>
        <p>当前的报警阀值为{{waringValue}}元</p>
        <div>
          <input type="text" v-model="newWarnValue" ref="inner_value" @blur="handleBlur">
        </div>
        <div class="show_button">
          <button type="button" @click="handleModel(false)">取消</button>
          <button type="button" @click="handleWarn">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Wallet',
  data: () => ({
    canIsee: true,
    last: '0.00',
    useSwitch: false,
    waringValue: '10000.00',
    newWarnValue: '',
    showModel: false,
    service: [
      {title: '充值', url: '/wallet/invest'},
      {title: '提现', url: '/wallet/drawback'},
      {title: '退款', url: '/wallet/widhdraw'},
      {title: '消费记录', url: '/wallet/record'}
    ],
    func: [
      {title: '订单', url: '/wallet/order'},
      {title: '发票', url: '/wallet/invoice'},
      {title: '合同', url: '/wallet/contract'}
    ]
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '我的钱包'
  },
  mounted () {
    const that = this
    let { sum, waringValue } = localStorage
    if (sum) {
      that.last = Number(sum).toFixed(2)
    } else {
      that.last = '0.00'
    }
    if (waringValue) {
      that.useSwitch = true
      that.waringValue = waringValue
    } else {
      that.useSwitch = false
    }
    // that.$ajax.get('/wx/get_last').then(res => {
    //   if (res.data.code === 1) {
    //     that.last = res.data.remain
    //     that.useSwitch = res.data.is_warn
    //     if (res.data.is_warn) {
    //       that.waringValue = res.data.waring_value
    //     }
    //   }
    // })
  },
  methods: {
    // switch 开关
    handleSwitch (e) {
      this.useSwitch = e.target.checked
      if (e.target.checked) {
        localStorage.waringValue = '10000.00'
        this.waringValue = '10000.00'
      } else {
        localStorage.removeItem('waringValue')
      }
    },
    // 显示 / 隐藏模态框
    handleModel (e) {
      const that = this
      if (e) {
        this.showModel = e
        setTimeout(() => {
          that.$refs.modelWindow.style.marginTop = '0'
        }, 100)
      } else {
        that.$refs.modelWindow.style.marginTop = '3.2rem'
        setTimeout(() => {
          that.showModel = e
        }, 100)
      }
    },
    // input 失焦调整键盘影响
    handleBlur () {
      window.scrollTo(0, 0)
    },
    // 提交预警金额
    handleWarn () {
      const that = this
      this.$store.commit('getNumberReg', 2)
      let numberReg = this.$store.state.reg.number
      if (numberReg.test(that.newWarnValue)) {
        // that.$ajax.put('/wx/get_last', {waring_value: that.newWarnValue}).then(res => {
        //   if (res.data.code === 1) {
        //     that.waringValue = Number(that.newWarnValue).toFixed(2)
        //     that.handleModel(false)
        //   }
        // })
        that.waringValue = Number(that.newWarnValue).toFixed(2)
        localStorage.waringValue = Number(that.newWarnValue).toFixed(2)
        that.handleModel(false)
      } else {
        that.$wechat.topTips('请输入正确金额')
      }
    },
    // 导航
    handleNavicate (url) {
      this.$router.push(url)
    }
  }
}
</script>
<style lang="scss" scoped>
#board {
  font-size: 32px; /*px*/
  color: $theme-word;
  .board {
    // height: rem(120px);
    background: $theme;
    color: #fff;
    &>p {
      padding: rem(24px) rem(20px) rem(10px);
      // font-size: 42px; /*px*/
    }
    .last_remain {
      // padding: 0 rem(36px);
      font-weight: bold;
      text-align: center;
      @include line;
      span {
        font-size: 50px; /*px*/
        // font-size: 42px; /*px*/
        vertical-align: bottom;
      }
      i {
        margin-left: rem(10px);
        font-size: 46px; /*px*/
      }
    }
    .switch {
      height: rem(40px);
      p {
        text-align: center;
        font-size: 28px; /*px*/
        line-height: rem(30px);
        span:last-child {
          text-decoration: underline;
        }
      }
    }
  }
  .func {
    margin-top: rem(20px);
    border-bottom: 2px solid $theme-border; /*px*/
    background: #fff;
    li {
      height: rem(45px);
      padding: 0 rem(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 2px solid $theme-border; /*px*/
      span {
        color: #theme-word;
      }
      i {
        color: #999;
      }
      input.weui-switch:checked {
        border-color:$theme;
        background-color:$theme;
      }
      // border-bottom: 2px solid $theme-border; /*px*/
    }
  }
  .weui-mask {
    // position: fixed;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background: rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: center;
    .show_window {
      margin-top: rem(120px);
      width: 75%;
      background: #fff;
      padding: rem(10px) rem(16px);
      border-radius: 6px; /*px*/
      transition: all .22s ease-out;
      p:first-child {
        // padding: rem(32px) rem(24px) rem(16px);
        padding-bottom: rem(10px);
        line-height: rem(30px);
        font-weight: bolder;
        color: #333;
      }
      p:nth-child(2) {
        padding-bottom: rem(10px);
        line-height: rem(26px);
        color: #666;
        word-break: break-all;
        font-size: 28px; /*px*/
      }
      div:nth-child(3) {
        input {
          height: rem(30px);
          width: 100%;
          padding: 0 rem(3px);
          outline: none;
          border: 1px solid #bdbdbd;
          border-radius: 0;
          background: none;
          -webkit-appearance:none;
        }
      }
      .show_button {
        margin-top: rem(20px);
        text-align: right;
        button {
          height: rem(30px);
          width: rem(56px);
          border: none;
          color: #fff;
          outline: none;
          font-size: 28px; /*px*/
        }
        button:first-child {
          background-color: #999;
          margin-right: rem(8px);
        }
        button:last-child {
          background-color: $theme-d;
        }
      }
    }
  }
}
</style>
