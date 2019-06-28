<template>
  <div id="drawback">
    <div class="board">
      <p>提现金额</p>
      <div class="inner_input">
        <div class="icon_warp">
          <i class="iconfont icon-iconmoney"></i>
        </div>
        <input type="number" v-model="value">
      </div>
      <p class="inner_tip">当前余额{{sum}}元，可提现余额{{(sum * .8).toFixed(2)}}元。</p>
    </div>
    <!-- <div class="invest_type">
      <p>充值方式</p>
      <ul>
        <li v-for="(item, index) in types" :key="index" @click="handleCheck(index)">
          <div class="checked">
            <i :class="item.checked ? 'iconfont icon-choose' : 'iconfont icon-unselected'"></i>
          </div>
          <div class="line_wrap">
            <div class="icon_wrap">
              <i :class="item.icon"></i>
            </div>
            <span>{{item.label}}</span>
          </div>
        </li>
      </ul>
    </div> -->
    <div class="btn">
      <button type="button" name="button" :style="canSub ? 'opacity: 1' : 'opacity: 0.54'" @click="handleSubmit()">预计两小时到账，确认提现</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Drawback',
  data: () => ({
    value: '',
    types: [],
    canSub: false,
    numberReg: '',
    sum: '0.00'
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '退款'
  },
  mounted () {
    this.types = this.$store.state.chargeType
    this.$store.commit('getNumberReg', 2)
    this.numberReg = this.$store.state.reg.number
    this.sum = localStorage.sum ? Number(localStorage.sum).toFixed(2) : '0.00'
    // this.sum = localStorage.sum  || '0.00'
  },
  methods: {
    // 选择支付方式
    // handleCheck (index) {
    //   this.types = this.types.map((val, i) => {
    //     if (i === index) {
    //       val.checked = true
    //     } else {
    //       val.checked = false
    //     }
    //     return val
    //   })
    // },
    // 提交支付
    handleSubmit () {
      const that = this
      if (!that.canSub) {
        that.$wechat.topTips('金额错误')
      } else {
        // let arr = that.types.filter(val => val.checked ? val : null)
        // console.log(arr)
        let type = '提现'
        that.$wechat.confirm(`您将通过充值方式提现${that.value}元`, {
          title: '确认提现',
          buttons: [{
            label: '取消',
            type: 'default'
          }, {
            label: '确认',
            onClick: function () {
              const l = that.$wechat.loading('提现中..')
              let { sum, chargeList } = localStorage
              if (sum) {
                sum = Number(sum) - Number(that.value)
              } else {
                sum = '0.00'
              }
              localStorage.sum = Number(sum)
              if (chargeList) {
                let arr = JSON.parse(chargeList)
                arr.push({type, value: '-' + that.value, update_time: new Date().getTime()})
                localStorage.chargeList = JSON.stringify(arr)
              } else {
                localStorage.chargeList = JSON.stringify([{type, value: '-' + that.value, update_time: new Date().getTime()}])
              }
              l.hide()
              that.value = ''
              that.$wechat.topTips('提现成功', {
                duration: 1000,
                className: 'weui-success',
                callback: function () {
                  that.$router.go(-1)
                }
              })
            }
          }]
        })
      }
    }
  },
  watch: {
    value: function () {
      const that = this
      if (!(that.numberReg.test(that.value)) || Number(that.value) === 0 || that.value > that.sum * 0.8) {
        that.canSub = false
      } else {
        that.canSub = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#drawback {
  color: $theme-word;
  font-size: 32px; /*px*/
  .board {
    background: #fff;
    border-bottom: 2px solid $theme-border; /*px*/
    &>p {
      padding: rem(34px) rem(20px) rem(10px);
      // font-size: 42px; /*px*/
    }
    .inner_input {
      margin: 0 rem(20px);
      padding-bottom: rem(10px);
      height: rem(42px);
      display: flex;
      .icon_warp {
        width: rem(30px);
        font-size: 60px; /*px*/
        text-align: center;
        line-height: rem(26px);
        i {
          vertical-align: bottom;
        }
      }
      input {
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        padding: 0 rem(5px);
        outline: none;
        caret-color: #333;
        font-size: 40px; /*px*/
      }
      // input:focus {
      //   border-bottom: 2px solid $theme-b; /*px*/
      // }
    }
    .inner_tip {
      padding: 0 rem(20px);
      line-height: rem(30px);
      font-size: 28px; /*px*/
      color: #999;
      border-top: 2px solid $theme-border; /*px*/
    }
  }
  .invest_type {
    margin-top: rem(20px);
    padding-bottom: rem(16px);
    background: #fff;
    border-bottom: 2px solid $theme-border; /*px*/
    border-top: 2px solid $theme-border; /*px*/
    p {
      padding: rem(24px) rem(20px) rem(10px);
    }
    ul {
      padding-left: rem(40px);
      li {
        display: flex;
        height: rem(56px);
        align-items: center;
        .checked {
          width: rem(50px);
          text-align: center;
          i{
            margin-right: rem(10px);
            color: $theme;
            font-size: 46px; /*px*/
          }
        }
        .line_wrap {
          height: 100%;
          width: rem(265px);
          display: flex;
          align-items: center;
          border-bottom: 2px solid $theme-border; /*px*/
          .icon_wrap {
            width: rem(50px);
            text-align: center;
            i {
              font-size: 48px; /*px*/
              margin-right: rem(6px);
            }
          }
          &>span:last-child {
            font-weight: bold;
            font-size: 28px; /*px*/
          }
        }
      }
      li:nth-child(1) {
        .icon_wrap i {
          color: $wechat-sucess;
          // font-size: 44px; /*px*/
        }
      }
      li:nth-child(2) {
        .icon_wrap i {
          color: $theme-b;
        }
      }
      li:nth-child(3) {
        .icon_wrap i {
          color: $theme-d;
        }
      }
    }
  }
  .btn {
    margin-top: rem(50px);
    padding: 0 rem(20px);
    button {
      height: $buttonHeight;
      background: $theme-b;
      color: #fff;
      font-size: 32px; /*px*/
      width: 100%;
      border: none;
      outline: none;
    }
  }
}
</style>
