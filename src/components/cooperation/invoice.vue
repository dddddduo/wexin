<template>
  <div id="invoice_wrapper">
    <!-- <div class="invoice_header">
      <h4>发票名称</h4>
    </div> -->
    <div class="invoice_block" v-for="(item,index) in invoList" :key="index" v-if="invoList.length > 0">
      <ul class="invoice_item">
        <li><b>发票名称：</b><span>{{item.name ? item.name : '暂无数据'}}</span></li>
        <li><b>发票类型：</b><span>{{ Number(item.type) === 1 ? '增值税普通发票' : Number(item.type) === 2 ? '增值税普通发票（卷式）' : Number(item.type) === 3 ? '增值税电子普通发票' : Number(item.type) === 4 ? '增值税专用发票' : Number(item.type) === 5 ? '通用机打发票' : Number(item.type) === 6 ? '增值税机动车发票' : Number(item.type) === 7 ? '二手车统一发票' : '其他' ? Number(item.type) === 8 : '暂无数据'}}</span></li>
        <!-- 1."增值税普通发票"; 2."增值税普通发票（卷式）"; 3."增值税电子普通发票"; 4."增值税专用发票"; 5."通用机打发票"; 6."增值税机动车发票"; 7."二手车统一发票"; 8."其他"; -->
        <li><b>发票代码：</b><span>{{item.code ? item.code : '暂无数据'}}</span></li>
        <li><b>发票号码：</b><span>{{item.number ? item.number  : '暂无数据'}}</span></li>
        <li><b>发票日期：</b><span>{{item.createDate ? item.createDate  : '暂无数据'}}</span></li>
        <li><b>发票金额：</b><span>{{item.amount ? $utils.$formatNumber(item.amount)  : '暂无数据'}}</span></li>
      </ul>
      <div class="content_none" v-if="invoList.length === 0">暂无数据</div>
      <div class="person_message">经办人信息</div>
      <div class="jingbanren-name" >
          <ul v-for="(agent, index1) in item.agents" :key="index1" v-if="item.agents.length !== 0">
            <li><span>经办人姓名：</span><p>{{ agent.name }}</p></li>
            <li><span>联系电话：</span><p>{{ agent.phone }}</p></li>
          </ul>
          <!-- <div class="content_none" v-if="item.agents.length !== 0">暂无数据</div> -->
          <div class="enclosure">
            <h3 class="ul-title">电子原件或扫描件</h3>
            <div v-for="(atta, index1) in item.attas" :key="index1" v-if="item.attas.length !== 0">
              <div class="img-list" v-if="atta.extend !== 'pdf'">
                <img :src="URL + atta.url" alt="">
              </div>
              <div class="pdf-list" v-else>
                <a>{{ atta.name }}</a>
              </div>
            </div>
            <div class="content_none" v-if="item.attas.length === 0">暂无数据</div>
            <div class="text-area">
              <h3 class="ul-title">备注</h3>
              <p>{{ item.remark ? item.remark : '暂无数据' }}</p>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'invoice_wrapper',
  data () {
    return {
      selIndex: 0,
      currentType: '',
      hasMore: false,
      page: 1,
      selType: 1,
      id: '',
      token: '',
      confirmId: '',
      invoList: [],
      URL: ''
    }
  },
  props: {},
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '发票'
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  mounted () {
    const that = this
    that.URL = that.$utils.$url()
    that.id = that.$route.query.id
    that.confirmId = that.$route.query.confirmId
    that.token = localStorage.ns_token
    that.$ajax.get('/sw/chain/coconfirm/invoice/detail/?invoiceId=' + that.id + '&confirmId=' + that.confirmId).then(res => {
      console.log(res.data.data)
      if (res.data.code === 200) {
        that.invoList = res.data.data.items
      }
    })
    this.handleAjax()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleSlide (index) {
      let position = 0.4 + index * 2.5 + 'rem'
      this.currentType = `left: ${position};`
      this.selType = index + 1
    },
    handleAjax (auth, type, page) {
      // const that = this
    },
    handleScroll: function () {
      // 设备/屏幕高度
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scrollTop = window.scrollY
      let scrollHeight = document.body.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
        if (this.hasMore) {
          setTimeout(() => {
            let auth = this.selIndex === 0 ? 0 : 1
            let type = this.selType <= 2 ? this.selType : 0
            this.handleAjax(auth, type, this.page)
          }, 200)
        }
      }
    }
  },
  components: {}
}
</script>

<style lang='scss' scoped>
@import "./css/cooperation.scss";
#invoice_wrapper {
  font-size: 28px; /*px*/
  background: #fff;
  .invoice_header {
    width: 100%;
    background: $theme-d;
    height: $buttonHeight;
    h4 {
      color: #fff;
      text-align: center;
      line-height: $buttonHeight;
    }
  }
  .invoice_block {
    width: 100%;
    .invoice_item {
      width: 100%;
      li {
        width: 100%;
        @include paddingLeftRight;
        display: flex;
        justify-content: space-between;
        align-items: center;
        b {
          color: #666;
        }
        span {
          color: #999;
          height: rem(36px);
          background: inherit;
          @include line;
        }
      }
    }
    .person_message {
      width: 100%;
      // @include paddingLeftRight;
      display: flex;
      flex-direction: column;
      padding:rem(7px) 0 rem(7px) rem(8px);
      color: #666;
      font-weight: bold;
    }
    .jingbanren-name {
      padding-bottom: rem(15px);
        .person-list {
          display: flex;
          flex: row;
          @include paddingLeftRight;
          p {
            flex: 1;
          }
        }
        .enclosure {
          .img-list {
            padding: 0 rem(20px);
            img {
              @include imgList;
            }
          }
          .pdf-list {
            padding: 0 rem(20px);
            a {
              @include pdfList;
            }
          }
          .text-area {
            p {
              line-height: rem(20px);
              font-size:28px; /*px*/
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(153,153,153,1);
              padding: 0 rem(20px);
              min-height: rem(60px);
            }
          }
        }
      }
      .ul-title {
        padding: 0 rem(20px) rem(5px) rem(8px);
        height: rem(40px);
        line-height: rem(40px);
        font-size:28px; /*px*/
        font-family:PingFang-SC-Medium;
        font-weight:bold;
        color:rgba(102,102,102,1);
      }
      ul {
        li {
          @include paddingLeftRight;
          span {
            float: left;
            font-size:28px; /*px*/
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(102,102,102,1);
          }
          p {
            float: right;
            color: #666;
            @include line;
            font-size:28px; /*px*/
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(153,153,153,1);
          }
        }
      }
      .content_none {
        line-height: rem(20px);
        font-size:28px; /*px*/
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(153,153,153,1);
        padding: 0 rem(20px);
        min-height: rem(40px);
    }
  }
}
</style>
