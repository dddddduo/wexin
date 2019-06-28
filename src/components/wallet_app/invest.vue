<template>
  <div id="invest">
    <div class="board">
      <p>充值金额</p>
      <div class="inner_input">
        <div class="icon_warp">
          <i class="iconfont icon-iconmoney"></i>
        </div>
        <input type="number" v-model="value">
      </div>
    </div>
    <div class="invest_type">
      <p>充值方式</p>
      <!-- <span @click="handlePiceker">{{selType.label}}</span> -->
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
    </div>
    <div class="btn">
      <button type="button" name="button" :style="canSub ? 'background: #eb6100;' : 'background: #f5a66e'" @click="handleSubmit()">充值</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Invest',
  data: () => ({
    value: '',
    types: [],
    canSub: false,
    numberReg: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '充值'
  },
  mounted () {
    this.types = this.$store.state.chargeType
    this.$store.commit('getNumberReg', 2)
    this.numberReg = this.$store.state.reg.number
  },
  methods: {
    handlePiceker () {
      const that = this
      let arr = that.types.map((val, index) => {
        return {label: val, value: index}
      })
      this.$wechat.picker(arr, {
        class: 'wechat-picker',
        defaultValue: [0],
        onConfirm: function (e) {
          that.selType = e[0]
        }
      })
    },
    // 选择支付方式
    handleCheck (index) {
      this.types = this.types.map((val, i) => {
        if (i === index) {
          val.checked = true
        } else {
          val.checked = false
        }
        return val
      })
    },
    // 提交支付
    handleSubmit () {
      const that = this
      if (!that.canSub) {
        that.$wechat.topTips('请输入正确的金额')
      } else {
        let arr = that.types.filter(val => val.checked ? val : null)
        // console.log(arr)
        let type = arr[0].label
        that.$wechat.confirm(`您将通过${type}方式充值${that.value}元`, {
          title: '确认充值',
          buttons: [{
            label: '取消',
            type: 'default'
          }, {
            label: '确认',
            onClick: function () {
              const l = that.$wechat.loading('支付中..')
              let { sum, chargeList } = localStorage
              if (sum) {
                sum = Number(that.value) + Number(sum)
              } else {
                sum = that.value
              }
              localStorage.sum = Number(sum)
              if (chargeList) {
                let arr = JSON.parse(chargeList)
                arr.push({type, value: '+' + that.value, update_time: new Date().getTime()})
                localStorage.chargeList = JSON.stringify(arr)
              } else {
                localStorage.chargeList = JSON.stringify([{type, value: '+' + that.value, update_time: new Date().getTime()}])
              }
              l.hide()
              that.value = ''
              that.$wechat.topTips('充值成功', {
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
      if (!(that.numberReg.test(that.value)) || Number(that.value) === 0) {
        that.canSub = false
      } else {
        that.canSub = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#invest {
  color: $theme-word;
  font-size: 32px; /*px*/
  .board {
    background: #fff;
    padding-bottom: rem(16px);
    border-bottom: 2px solid $theme-border; /*px*/
    &>p {
      padding: rem(34px) rem(20px) rem(10px);
      // font-size: 42px; /*px*/
    }
    .inner_input {
      margin: 0 rem(20px);
      height: rem(32px);
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
      color: #fff;
      font-size: 32px; /*px*/
      width: 100%;
      border: none;
      outline: none;
    }
  }
}
</style>
