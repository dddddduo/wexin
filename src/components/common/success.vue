<template>
  <div id="success">
    <div class="img_wrap">
      <img src="../../assets/log_app/logo4.png" alt="">
    </div>
    <p class="show_title">{{showTitle}}</p>
    <p class="show_info">{{shoInfo}}</p>
    <div class="opetate">
      <button type="button" @click='handleOperate'>{{operation.btn}}</button>
    </div>
    <p class="count">{{count}}秒后转至登陆页面</p>
  </div>
</template>
<script>
export default {
  name: 'Success',
  data: () => ({
    showTitle: '',
    shoInfo: '',
    operation: {},
    count: ''
  }),
  mounted () {
    const that = this
    that.operation = that.$store.state.operation[that.$route.query.operate]
    that.showTitle = that.$route.query.title
    that.shoInfo = that.$route.query.info
    that.handleCount(that.operation.count)
  },
  methods: {
    // 倒计时
    handleCount (num) {
      const that = this
      that.count = num
      let timer = setInterval(function () {
        if (num !== 0) {
          num--
          that.count = num
        } else {
          clearInterval(timer)
          // alert(123456)
          that.handleOperate()
        }
      }, 1000)
    },
    // 操作按钮
    handleOperate () {
      const that = this
      if (that.operation.url) {
        that.$router.push({
          path: that.operation.url,
          query: {
            from: 'register',
            phone: that.$route.query.p
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#success {
  padding: rem(50px) rem(20px);
  .img_wrap {
    text-align: center;
    img {
      margin: 0 auto;
      margin-bottom: rem(50px);
    }
  }
  .show_title {
    font-size: 36px; /*px*/
    font-weight: bolder;
    color: #333;
    text-align: center;
    margin-bottom: rem(25px)
  }
  .show_info {
    font-size: 32px; /*px*/
    text-align: center;
    margin-bottom: rem(40px);
    // font-weight: bold;
  }
  button {
    width: 100%;
    height: $buttonHeight;
    background: $theme;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 10px; /*px*/
  }
  .count {
    color: #666;
    line-height: rem(54px);
    font-size: 28px; /*px*/
    text-align: center;
  }
}
</style>
