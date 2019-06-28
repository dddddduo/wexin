<template>
  <div id="invoice_result">
    <div class="img_wrap">
      <img src="../../assets/common/right.png" alt="">
      <p>发票查验结果为真</p>
    </div>
    <div class="form" v-if="iid">
      <div class="form_line">
        <span>发票号码</span>
        <span>{{detail.invoice_number}}</span>
      </div>
      <div class="form_line">
        <span>发票代码</span>
        <span>{{detail.invoice_code}}</span>
      </div>
      <div class="form_line">
        <span>发票金额</span>
        <span>{{detail.value}}</span>
      </div>
      <div class="form_line">
        <span>开票时间</span>
        <span>{{detail.show_time}}</span>
      </div>
      <div class="form_line">
        <span>开票单位</span>
        <span>{{detail.name}}</span>
      </div>
    </div>
    <div class="btn">
      <button @click="$router.go(-1)">返回</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InvoiceReal',
  data: () => ({
    iid: '',
    detail: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '查验结果'
  },
  mounted () {
    const that = this
    if (that.$route.query.id) {
      that.iid = that.$route.query.id
      that.$ajax.get('/wx/wallet_invoice/' + that.iid).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          that.detail = res.data.detail
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#invoice_result {
  .img_wrap {
    width: 100%;
    text-align: center;
    img {
      width: rem(100px);
      margin: rem(20px) auto;
    }
    p:nth-child(2) {
      font-size: 40px; /*px*/
      font-weight: bold;
      color: #333;
    }
  }
  .form {
    padding: 0 rem(20px);
    margin-top: rem(25px);
    font-size: 28px; /*px*/
    color: $theme-word;
    .form_line {
      display: flex;
      line-height: rem(50px);
      span:first-child {
        width: rem(120px);
        color: #666;
      }
      span:last-child {
        width: rem(375px - 40px -120px);
        @include muline(3);
      }
    }
  }
  .btn {
    margin-top: rem(20px);
    padding: rem(20px);
    button {
      width: 100%;
      height: $buttonHeight;
      background: $theme-b;
      font-size: 32px; /*px*/
      color: #fff;
      border: none;
      border-radius: 10px; /*px*/
    }
  }
}
</style>
