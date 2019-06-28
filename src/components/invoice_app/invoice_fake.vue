<template>
  <div id="invoice_fake">
    <div class="img_wrap">
      <img src="../../assets/common/error.png" alt="">
      <p>发票查验结果为假</p>
    </div>
    <p class="tip">假发票违法国家法律，请自行销毁，任何制造，流通假发票行为触犯法律。</p>
    <p>{{count}}秒后离开</p>
  </div>
</template>
<script>
export default {
  name: 'InvoiceFake',
  data: () => ({
    count: 5
  }),
  created () {
    const that = this
    let s = that.count
    let timer = setInterval(() => {
      if (s !== 0) {
        s--
        that.count = s
      } else {
        that.$router.go(-1)
        clearInterval(timer)
      }
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
#invoice_fake {
  padding: rem(40px) rem(20px);
  font-size: 32px; /*px*/
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
  &>p:nth-child(2) {
    margin-top: rem(40px);
    color: #666;
    text-align: center;
    font-size: 28px; /*px*/
  }
   &>p:nth-child(3) {
     margin-top: rem(20px);
     color: #999;
     text-align: center;
     font-size: 28px; /*px*/
   }
}
</style>
