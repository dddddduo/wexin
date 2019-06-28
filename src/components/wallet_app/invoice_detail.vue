<template>
  <div id="invoice_detail">
    <div class="line_item">
      <span>发票名称：</span>
      <span>{{invoice.name}}</span>
    </div>
    <div class="line_item">
      <span>发票金额：</span>
      <span>{{invoice.value}}元</span>
    </div>
    <div class="line_item">
      <span>发票号码：</span>
      <span
        v-clipboard:copy="invoice.invoice_number"
        v-clipboard:success="handleCopy"
        v-clipboard:error="handleError">{{invoice.invoice_number}}</span>
    </div>
    <div class="line_item">
      <span>发票代码：</span>
      <span>{{invoice.invoice_code}}</span>
    </div>
    <div class="line_item">
      <span>发票效验码：</span>
      <span>{{invoice.check_code}}</span>
    </div>
    <div class="line_item">
      <span>开票时间：</span>
      <span>{{invoice.show_time}}</span>
    </div>
    <div class="section_item">
      <span>备注：</span>
      <div :style="!invoice.note ? 'color: #999' : ''">{{invoice.note || '无备注'}}</div>
    </div>
    <div class="btn" v-if="!paid">
      <button type="button" name="button" @click="handleInvoceApply">申请纸质发票</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InvoiceDetail',
  data: () => ({
    invoice: {},
    paid: true
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '发票详情'
  },
  mounted () {
    const that = this
    let id = that.$route.params.id
    that.$ajax.get('/wx/wallet_invoice/' + id).then(res => {
      if (res.data.code === 1) {
        that.invoice = res.data.detail
        that.paid = res.data.detail.paid
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
    },
    handleInvoceApply () {
      const that = this
      const l = that.$wechat.loading('申请中...')
      that.$ajax.put('/wx/wallet_invoice', {id: that.$route.params.id}).then(res => {
        l.hide()
        if (res.data.code === 1) {
          that.paid = true
          this.$wechat.topTips(res.data.err_msg, {
            duration: 4000,
            className: 'weui-success'
          })
        } else {
          this.$wechat.topTips(res.data.err_msg, {
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#invoice_detail {
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
  .btn {
    height: $bottomButtom;
    width: 100%;
    margin-top: $bottomButtom;
    position: fixed;
    bottom: 0;
    left: 0;
    button {
      width: 100%;
      height: 100%;
      text-align: center;
      background: $theme-g;
      color: #fff;
      border: none;
      outline: none;
      font-size: 32px; /*px*/
    }
    p {
      color: #666;
      text-align: center;
      line-height: $bottomButtom;
      font-size: 28px; /*px*/
    }
  }
}
</style>
