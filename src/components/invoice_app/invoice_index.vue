<template>
  <div id="check_invoice">
    <h4>九星发票查验系统</h4>
    <div class="class_wrap">
      <img src="../../assets/invoice_app/invoice.png" alt="">
    </div>
    <p class="tips">请输入<span>发票信息</span>进行查验，或者<span class="upload" @click="handleInner">上传发票原件<input type="file" multiple @change="handleUpload" ref='upload'></span>查验。</p>
    <div class="inner_line">
      <i class="iconfont icon-bianhao"></i>
      <input v-model="invoiceNumber" placeholder="请输入发票号码" @blur="handleTop">
    </div>
    <div class="inner_line">
      <i class="iconfont icon-mingxi"></i>
      <input v-model="invoiceCode" placeholder="请输入发票代码" @blur="handleTop">
    </div>
    <div class="inner_line">
      <i class="iconfont icon-bianhao1"></i>
      <input v-model="innerCode" placeholder="请输入效验码后6位" @blur="handleTop">
    </div>
    <div class="btn">
      <!-- <p>由CFCA提供技术支持</p> -->
      <button name="button" @click='handleSubmit'><i class="iconfont icon-gaokeji"></i>发票查验</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CheckInvoice',
  data: () => ({
    invoiceNumber: '',
    invoiceCode: '',
    innerCode: '',
    btn: true
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '发票查验'
  },
  methods: {
    handleInner () {
      this.$refs['upload'].click()
    },
    handleUpload (e) {
      const that = this
      let f = e.target.files[0]
      let data = new FormData()
      data.append('file', f)
      data.append('timestemp', new Date().getTime())
      data.append('key', 'invoice')
      const loading = that.$wechat.loading('上传中...')
      that.$ajax.post('/wx/file', data).then(res => {
        loading.hide()
        if (res.data.code === 1) {
          that.$router.push('/check_invoice/real?id=15')
        } else {
          that.$router.push('/check_invoice/fake')
        }
      })
    },
    handleTop () {
      window.scrollTo(0, 0)
    },
    // 查验发票
    handleSubmit () {
      const that = this
      if (!that.invoiceNumber) {
        that.$wechat.topTips('发票号码错误')
      } else if (!that.invoiceCode) {
        that.$wechat.topTips('发票代码错误')
      } else if (!that.innerCode) {
        that.$wechat.topTips('校验码后6位错误')
      } else {
        that.$ajax.put('/wx/check_invoice', {invoice_code: that.invoiceCode, invoice_number: that.invoiceNumber, check_code: that.innerCode}).then(res => {
          let url = res.data.code === 1 ? '/check_invoice/real?id=' + res.data.id : '/check_invoice/fake'
          that.$router.push(url)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#check_invoice {
  font-size: 32px; /*px*/
  color: $theme-word;
  h4 {
    font-size: 44px; /*px*/
    font-weight: bold;
    color: #333;
    padding-bottom: rem(20px);
    padding-top: rem(40px);
    text-align: center;
  }
  .class_wrap {
    padding: rem(5px) rem(40px) rem(10px);
  }
  .tips {
    padding: rem(0px) rem(20px);
    font-size: 28px; /*px*/
    color: #666;
    line-height: rem(28px);
    span {
      color: $theme-b;
    }
    .upload {
      text-decoration: underline;
      input {
        display: none;
      }
    }
  }
  .inner_line {
    height: rem(80px);
    padding: rem(20px) rem(20px) rem(10px);
    background: #fff;
    // display: flex;
    // align-items: flex-end;
    // justify-content: flex-start;
    i {
      color: $theme-b;
      font-size: 40px; /*px*/
      vertical-align: middle;
    }
    input {
      width: rem(375px - 80px);
      padding: rem(0px) rem(5px);
      border: none;
      outline: none;
      font-size: 32px; /*px*/
      vertical-align: middle;
      color: #333;
    }
  }
  .inner_line:nth-child(4) {
    margin-top: rem(20px);
    border-top: 2px solid $theme-border; /*px*/
  }
  .inner_line:nth-child(6) {
    border-bottom: 2px solid $theme-border; /*px*/
  }
  .btn {
    width: 100%;
    padding: 0 rem(20px);
    padding-top: rem(44px);
    // left: 0;
    // bottom: 0;
    p {
      line-height: rem(24px);
      font-size: 24px; /*px*/
      text-align: center;
      color: #bdbdbd;
    }
    button {
      width: 100%;
      background: $theme-word;
      color: #fff;
      height: $buttonHeight;
      border: none;
      border-radius: 10px; /*px*/
      font-size: 32px; /*px*/
      i {
        font-size: 48px; /*px*/
        vertical-align: middle;
      }
    }
  }
}
</style>
