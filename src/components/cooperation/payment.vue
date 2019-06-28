<template>
  <div id="pay_wrapper">
    <!-- <div class="pay_header">
      <h4>支付名称</h4>
    </div> -->
    <div class="pay_block" v-for="(item,index) in payList" :key="index">
      <ul class="pay_item">
        <li><b>支付名称：</b><span>{{item.name ? item.name : '暂无数据'}}</span></li>
        <li><b>支付类型：</b><span>{{ Number(item.type) === 1 ? '现金' : Number(item.type) === 2 ? '支票' : Number(item.type) === 3 ? '银行承兑汇票' : Number(item.type) === 4 ? '商业承兑汇票' : Number(item.type) === 5 ? '信用证' : '' }}</span></li>
           <!-- 1."现金"; 2."支票"; 3."银行承兑汇票"; 4."商业承兑汇票"; 5."信用证"-->
      </ul>
      <!-- 支付方式 汇票 -->
      <ul class="pay_item" v-if="Number(item.type) === 1">
        <li><b>票据金额：</b><span>{{item.amount ? item.amount : '暂无数据'}}</span></li>
        <li><b>支付日期：</b><span>{{item.payDate ? item.payDate : '暂无数据'}}</span></li>
        <li><b>收款账号：</b><span>{{item.receiveAccount ? item.receiveAccount : '暂无数据'}}</span></li>
        <li><b>付款账号：</b><span>{{item.payAccount ? item.payAccount : '暂无数据'}}</span></li>
        <li><b>出票日期：</b><span>{{item.payDate ? item.payDate : '暂无数据'}}</span></li>
        <li><b>汇票到期日：</b><span>{{item.draftExpiration ? item.draftExpiration : '暂无数据'}}</span></li>
        <li><b>收款企业：</b><span>{{item.receiveCompany ? item.receiveCompany : '暂无数据'}}</span></li>
        <li><b>付款企业：</b><span>{{item.payCompany ? item.payCompany : '暂无数据'}}</span></li>
        <li><b>收款机构：</b><span>{{item.receiveOrg ? item.receiveOrg : '暂无数据'}}</span></li>
        <li><b>付款机构：</b><span>{{item.payOrg ? item.payOrg : '暂无数据'}}</span></li>
      </ul>
      <!-- 支付方式 现金-->
      <ul class="pay_item" v-if="Number(item.type) === 2">
        <li><b>金额:</b><span>{{item.amount ? item.payOrg : '暂无数据'}}</span></li>
        <li><b>支付日期: </b><span>{{item.payDate ? item.payOrg : '暂无数据'}}</span></li>
      </ul>
      <!-- 支付方式 支票 -->
      <ul class="pay_item" v-if="Number(item.type) === 3">
        <li><b>票据金额：</b><span>{{item.amount ? item.amount : '暂无数据'}}</span></li>
        <li><b>支付日期：</b><span>{{item.payDate ? item.payDate : '暂无数据'}}</span></li>
        <li><b>收款账号：</b><span>{{item.receiveAccount ? item.receiveAccount : '暂无数据'}}</span></li>
        <li><b>付款账号：</b><span>{{item.payAccount ? item.payAccount : '暂无数据'}}</span></li>
        <li><b>收款企业：</b><span>{{item.receiveCompany ? item.receiveCompany : '暂无数据'}}</span></li>
        <li><b>付款企业：</b><span>{{item.payCompany ? item.payCompany : '暂无数据'}}</span></li>
        <li><b>收款机构：</b><span>{{item.receiveOrg ? item.receiveOrg : '暂无数据'}}</span></li>
        <li><b>付款机构：</b><span>{{item.payOrg ? item.payOrg : '暂无数据'}}</span></li>
      </ul>
      <div class="content_none" v-if="payList.length === 0">暂无数据</div>
      <div class="person_message">经办人信息</div>
      <div class="jingbanren-name">
          <ul v-for="(agent, index1) in item.agents" :key="index1" v-if="item.agents.length !== 0">
            <li><span>经办人姓名：</span><p>{{ agent.name }}</p></li>
            <li><span>联系电话：</span><p>{{ agent.phone }}</p></li>
          </ul>
          <div class="content_none" v-if="item.attas.length === 0">暂无数据</div>
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
  name: 'pay_wrapper',
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
      payList: [],
      URL: ''
    }
  },
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '支付'
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
    that.$ajax.get('/sw/chain/coconfirm/settlementpay/detail?token=' + that.token + '&paymentId=' + that.id + '&confirmId=' + that.confirmId).then(res => {
      // console.log(res.data)
      if (res.data.code === 200) {
        that.payList = res.data.data.items
      }
    })
    this.handleAjax()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  props: {},
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
#pay_wrapper {
  font-size: 28px; /*px*/
  background: #fff;
  .pay_header {
    width: 100%;
    background: $theme-d;
    height: $buttonHeight;
    h4 {
      color: #fff;
      text-align: center;
      line-height: $buttonHeight;
    }
  }
  .pay_block {
    width: 100%;
    .pay_item {
      width: 100%;
      li {
        width: 100%;
        @include paddingLeftRight;
        display: flex;
        justify-content: space-between;
        align-items: center;
        b {
          color: #666;
          width: 28%;
        }
        span {
          color: #999;
          height: rem(36px);
          background: inherit;
          @include line;
        }
        &:nth-child(8){
          b{
            margin-right: rem(2px);
          }
        }
      }
    }
    .person_message {
      width: 100%;
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
    }
  .bottom {
      button {
        @include buttonList;
        margin: rem(10px);
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
