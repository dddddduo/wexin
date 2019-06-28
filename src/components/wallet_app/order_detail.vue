<template>
  <div id="order_detail">
    <div class="line_item">
      <span>订单名称：</span>
      <span>{{order.name}}</span>
    </div>
    <div class="line_item">
      <span>订单金额：</span>
      <span>{{order.value}}元</span>
    </div>
    <div class="line_item">
      <span>订单流水号：</span>
      <span
        v-clipboard:copy="order.CA_id"
        v-clipboard:success="handleCopy"
        v-clipboard:error="handleError">{{order.CA_id}}</span>
    </div>
    <div class="line_item">
      <span>下单时间：</span>
      <span>{{order.show_time}}</span>
    </div>
    <div class="line_item">
      <span>下单人：</span>
      <span>{{order.operator}}</span>
    </div>
    <div class="line_item">
      <span>购买服务：</span>
      <span>{{order.pdf_url || '续费'}}</span>
    </div>
    <div class="section_item">
      <span>备注：</span>
      <div :style="!order.note ? 'color: #999' : ''">{{order.note || '无备注'}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderDetail',
  data: () => ({
    order: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '订单详情'
  },
  mounted () {
    const that = this
    let id = that.$route.params.id
    that.$ajax.get('/wx/wallet_order/' + id).then(res => {
      if (res.data.code === 1) {
        that.order = res.data.detail
      }
    })
  },
  methods: {
    handleCopy () {
      this.$wechat.topTips('复制成功', {
        duration: 2000,
        className: 'weui-success'
      })
    },
    handleError () {
      this.$wechat.topTips('复制失败', {
        duration: 2000
        // className: 'weui-success'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#order_detail {
  font-size: 28px; /*px*/
  color: $theme-word;
  padding: rem(36px) rem(20px);
  .line_item, .section_item {
    min-height: rem(56px);
    display: flex;
    line-height: rem(28px);
    margin-bottom: rem(10px);
    span:first-child {
      width: rem(100px);
      color: #666;
    }
    span:nth-child(2) {
      width: rem(335px - 100px);
      word-break: break-all;
    }
    div:last-child {
      width: rem(335px - 100px);
      word-break: break-all;
    }
  }
}
</style>
