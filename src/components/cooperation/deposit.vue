<template>
  <div id="order">
    <div class="order-list">
      <!-- <div class="top">
        <i class="iconfont icon-fanhui"></i>
        <h3>订金名称</h3>
      </div> -->
      <div class="center" v-for="(item, index) in depositList" :key="index">
        <ul>
          <li><span>订金名称：</span><p>{{ item.name ? item.name : '暂无数据' }}</p></li>
          <li><span>支付方式：</span><p>{{ Number(item.type) === 1 ? '现金' : Number(item.type) === 2 ? '支票' : Number(item.type) === 3 ? '银行承兑汇票' : Number(item.type) === 4 ? '商业承兑汇票' : Number(item.type) === 5 ? '信用证' : '' }}</p></li>
          <!-- "1": "现金";"2":"支票";"3":"银行承兑汇票";"4":"商业承兑汇票";"5":"信用证" ( -->
        </ul>
        <!-- 支付方式：支票 -->
        <ul v-if="Number(item.type) === 1">
          <li><span>金额(元)：</span><p>{{ item.amount ? $utils.$formatNumber(item.amount) : '暂无数据' }}</p></li>
          <li><span>支付日期：</span><p>{{ item.payDate ? item.payDate : '暂无数据' }}</p></li>
        </ul>
        <!-- 支付方式：支票 -->
        <ul v-if="Number(item.type) === 2">
          <li><span>金额(元)：</span><p>{{ item.amount ? $utils.$formatNumber(item.amount) : '暂无数据' }}</p></li>
          <li><span>支付日期：</span><p>{{ item.payDate ? item.payDate : '暂无数据' }}</p></li>
          <li><span>收款企业：</span><p>{{ item.receiveCompany ? item.receiveCompany : '暂无数据' }}</p></li>
          <li><span>付款企业：</span><p>{{ item.payCompany ? item.payCompany : '暂无数据' }}</p></li>
          <li><span>收款机构：</span><p>{{ item.receiveOrg ? item.receiveOrg : '暂无数据' }}</p></li>
          <li><span>付款机构：</span><p>{{ item.payOrg ? item.payOrg : '暂无数据' }}</p></li>
          <li><span>收款账号：</span><p>{{ item.receiveAccount ? item.receiveAccount : '暂无数据' }}</p></li>
          <li><span>付款账号：</span><p>{{ item.payAccount ? item.payAccount : '暂无数据' }}</p></li>
        </ul>
        <!-- 支付方式：汇票（银行承兑汇票） -->
        <ul v-if="Number(item.type) === 3 && Number(item.type) === 4 && Number(item.type) === 5">
          <li><span>票据金额(元)：</span><p>{{ item.amount ? $utils.$formatNumber(item.amount) : '暂无数据' }}</p></li>
          <li><span>出票日期：</span><p>{{ item.payDate ? item.payDate : '暂无数据' }}</p></li>
          <li><span>汇票到期日：</span><p>{{ item.draftExpiration ? item.draftExpiration : '暂无数据' }}</p></li>
          <li><span>收款企业：</span><p>{{ item.receiveCompany ? item.receiveCompany : '暂无数据' }}</p></li>
          <li><span>付款企业：</span><p>{{ item.payCompany ? item.payCompany : '暂无数据' }}</p></li>
          <li><span>收款机构：</span><p>{{ item.receiveOrg ? item.receiveOrg : '暂无数据' }}</p></li>
          <li><span>付款机构：</span><p>{{ item.payOrg ? item.payOrg : '暂无数据' }}</p></li>
          <li><span>收款账号：</span><p>{{ item.receiveAccount ? item.receiveAccount : '暂无数据' }}</p></li>
          <li><span>付款账号：</span><p>{{ item.payAccount ? item.payAccount : '暂无数据' }}</p></li>
        </ul>
        <div class="content_none" v-if="item.attas.length === 0">暂无数据</div>
        <div class="ul-title">经办人信息</div>
        <div class="jingbanren-name">
          <ul v-for="(agent, index1) in item.agents" :key="index1" v-if="item.agents.length !== 0">
            <li><span>经办人姓名：</span><p>{{ agent.name }}</p></li>
            <li><span>联系电话：</span><p>{{ agent.phone }}</p></li>
          </ul>
          <div class="content_none" v-if="item.agents.length === 0">暂无数据</div>
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
      <!-- <div class="bottom">
        <button class="cancel">拒绝</button>
        <button class="ok">接受</button>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'deposit',
  data: () => ({
    selIndex: 0,
    currentType: '',
    hasMore: false,
    page: 1,
    selType: 1,
    depositList: [],
    id: '',
    confirmId: '',
    token: '',
    URL: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '电子订金'
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  mounted () {
    const that = this
    this.handleAjax()
    that.URL = that.$utils.$url()
    that.id = that.$route.query.id
    that.confirmId = that.$route.query.confirmId
    that.token = localStorage.ns_token
    that.$ajax.get('/sw/chain/coconfirm/payment/detail/?token=' + that.token + '&paymentId=' + that.id + '&confirmId=' + that.confirmId).then(res => {
      if (res.data.code === 200) {
        that.depositList = res.data.data.items
      }
    })
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleSlide (index) {
      let position = (0.4 + index * 2.5) + 'rem'
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
  }
}
</script>
<style lang="scss" scoped>
@import './css/cooperation.scss';
#order {
  font-size: 28px; /*px*/
  padding-bottom: rem(20px);
  background: #fff;
  .top {
    height: $buttonHeight;
    background: $theme;
    i {
      float: left;
      margin-top: rem(12px);
      margin-left: rem(20px);
    }
    h3 {
      text-align: center;
      line-height: $buttonHeight;
      color: $bg;
    }
  }
  .order-list {
    .center {
      .jingbanren-name {
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
    }
    .bottom {
      button {
        @include buttonList;
        margin: rem(10px);
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
</style>
