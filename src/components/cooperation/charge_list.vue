<template>
  <div id="charge_list">
    <div class="show_line" @click="handleGo(contract)">
      <span>{{contract.name}}</span>
      <i class="iconfont icon-qianwang"></i>
    </div>
    <div class="show_wrap">
      <div v-for="(item, index) in tables" :key="index" class="show_section">
        <p @click="handleSlide($event, item.key, index)">{{item.title}} <i class="iconfont icon-qianwang"></i></p>
        <div class="show_item" :ref='item.key'>
          <ul>
            <li v-for="(tb, index1) in list[item.key]" :key="index1" @click="handleCheck($event, tb, item)">{{tb.name}}</li>
          </ul>
          <div v-if="list[item.key]">
            <div class="no_charge" v-if="list[item.key].length === 0"><i class='iconfont icon-shoucang-1'></i>暂无{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn" v-if="auth === '0'">
      <button type="button" @click="handleSubmit(1)">同意</button>
      <button type="button" @click="handleSubmit(0)">拒绝</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChargeList',
  data: () => ({
    contract: {},
    list: [],
    tables: [
      {key: 'order', title: '订单', url: '/cooperation/order'},
      {key: 'deposit', title: '订金', url: '/cooperation/deposit'},
      {key: 'warehouse', title: '出货单', url: '/cooperation/delivery'},
      {key: 'transport', title: '运输单', url: '/cooperation/waybill'},
      {key: 'acceptance', title: '验收单', url: '/cooperation/acceptance'},
      {key: 'settlement', title: '结算', url: '/cooperation/settlement'},
      {key: 'invoice', title: '发票', url: '/cooperation/invoice'},
      {key: 'payment', title: '支付', url: '/cooperation/payment'}
    ],
    auth: '1'
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.title
  },
  mounted () {
    const that = this
    // 预加载
    that.contract = {name: that.$route.query.title}
    const loading = that.$wechat.loading('获取中...')
    that.$ajax.get('/sw/chain/coconfirm/link?id=' + that.$route.query.id).then(res => {
      // if (res.data.code === 1) {
      //   that.contract = res.data.res.contract[0]
      //   that.list = res.data.res
      // }
      if (res.data.code === 200) {
        that.auth = res.data.data.detail.status
        that.contract = {id: res.data.data.detail.id, name: res.data.data.detail.name}
        let list = {
          order: [],
          deposit: [],
          warehouse: [],
          transport: [],
          acceptance: [],
          settlement: [],
          invoice: [],
          payment: []
        }
        res.data.data.detail.order.forEach(val => {
          list.order.push({name: val.value.name, id: val.value.orderId})
          list.deposit.push(...val.value.orderPays)
          list.warehouse.push(...val.value.warehouses)
          list.transport.push(...val.value.transports)
          list.acceptance.push(...val.value.acceptances)
          list.settlement.push(...val.value.settlements)
          list.invoice.push(...val.value.invoices)
          list.payment.push(...val.value.settlementPayments)
        })
        that.list = list
        loading.hide()
      }
    })
  },
  methods: {
    handleSlide (e, key, index) {
      const that = this
      let doms = document.getElementsByClassName('icon-qianwang')
      for (let i = 0; i <= doms.length - 1; i++) {
        if (i === index + 1) {
          doms[i].style.transform === 'rotate(90deg)' ? doms[i].style.transform = 'rotate(0deg)' : doms[i].style.transform = 'rotate(90deg)'
        } else {
          doms[i].style.transform = 'rotate(0)'
        }
      }
      let pointHeight = that.list[key].length !== 0 ? that.list[key].length * 40 + 'px' : '120px'
      for (let i in this.$refs) {
        if (i === key) {
          this.$refs[i][0].style.height === pointHeight ? this.$refs[i][0].style.height = '0px' : this.$refs[i][0].style.height = pointHeight
        } else {
          this.$refs[i][0].style.height = '0px'
        }
      }
    },
    handleCheck (e, item, sw) {
      const that = this
      // e.target.style.background = 'rgba(255, 255, 255)'
      setTimeout(() => {
        e.target.style.background = 'none'
        // this.$wechat.alert(`名称: ${item.name}, id: ${item.id}`, {
        //   title: sw.title
        // })
        this.$router.push({
          path: sw.url,
          query: {
            id: item.id,
            confirmId: that.$route.query.id
          }
        })
      }, 240)
    },
    handleGo (contract) {
      const that = this
      this.$router.push({
        path: '/cooperation/contract',
        query: {
          id: contract.id,
          title: contract.name,
          confirmId: that.$route.query.id
        }
      })
    },
    handleSubmit (e) {
      const that = this
      that.$wechat.confirm(`您将${e ? '同意' : '拒绝'}本次协同确认，操作后不可撤回`, {
        title: '协同确认',
        buttons: [
          {
            type: 'default',
            label: '取消'
          }, {
            type: 'primery',
            label: '确认',
            onClick: function () {
              const loading = that.$wechat.loading('提交中...')
              setTimeout(() => {
                let obj = {
                  method: 'PUT',
                  url: '/sw/chain/coconfirm/assurance',
                  params: {
                    id: that.$route.query.id,
                    status: e ? '1' : '2',
                    reason: ''
                  }
                }
                that.$ajax(obj).then(res => {
                  if (res.data.code === 200) {
                    that.$router.go(-1)
                  } else {
                    that.$wechat.topTips(res.data.message)
                  }
                })
                loading.hide()
              }, 200)
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$topline: rem(45px);
#charge_list {
  // padding: 0 rem(20px);
  font-size: 28px; /*px*/
  background: #fff;
  color: $theme-word;
  .show_line {
    margin: 0 rem(12px);
    padding: 0 rem(5px);
    display: flex;
    height: $topline;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #dcdcdc; /*px*/
    span {
      // font-weight: bold;
      width: rem(240px);
    }
    i {
      color: #bfbfbf;
      transition: all .3s ease-in;
    }
  }
  .show_wrap {
    .show_section {
      p {
        margin: 0 rem(12px);
        display: flex;
        height: $topline;
        align-items: center;
        justify-content: space-between;
        // font-weight: bold;
        border-bottom: 2px solid #dcdcdc; /*px*/
        padding: 0 rem(5px);
        i {
          color: #bfbfbf;
          transition: all .3s ease-in;
        }
      }
      .show_item {
        height: 0;
        overflow: hidden;
        transition: all .3s ease-in;
        background: $bg;
        ul {
          li {
            margin: 0 rem(25px);
            padding: 0 rem(5px);
            line-height: 80px; /*px*/
            border-bottom: 2px solid #dcdcdc; /*px*/
            color: #666;
            @include line;
          }
          li:last-child {
            border: none;
          }
        }
        div.no_charge {
          line-height: 240px; /*px*/
          text-align: center;
          color: #999;
          font-size: 32px; /*px*/
          i {
            font-size: 64px; /*px*/
            vertical-align: middle;
            margin-right: rem(5px);
            color: #aaa;
          }
        }
      }
    }
  .show_section:last-child p {
      border: none;
    }
  }
  .btn {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    button {
      width: 50%;
      height: $bottomButtom;
      border: none;
      background: none;
      color: #fff;
      font-size: 32px; /*px*/
    }
    button:first-child {
      background: $theme;
    }
    button:last-child {
      background: $err;
    }
  }
}
</style>
