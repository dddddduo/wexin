<template>
  <div id="settlement_wrapper">
    <!-- <div class="settlement_header">
      <h4>结算名称</h4>
    </div> -->
    <div class="settlement_block" v-for="(item,index) in selList" :key="index">
      <ul class="settlement_item">
        <li><b>结算单标题：</b><span>{{item.name ? item.name : '暂无数据'}}</span></li>
        <li><b>出货日期：</b><span>{{item.createDate ? item.createDate : '暂无数据'}}</span></li>
        <li><b>结算金额：</b><span>{{item.amount ?  $utils.$formatNumber(item.amount) : '暂无数据'}}</span></li>
        <li><b>关联电子账单：</b><span>{{item.orderNames ? item.orderNames : '暂无数据'}}</span></li>
      </ul>
      <div class="person_message" >订单结算信息</div>
      <ul class="settlement_item" v-for="(order,index1) in item.orderInfos" :key="index1" v-if="item.orderInfos.length > 0">
        <li><b>单位：</b><span>{{order.unit ? order.unit : '暂无数据'}}</span></li>
        <li><b>数量：</b><span>{{order.number ?  $utils.$formatNumber(order.number) : '暂无数据'}}</span></li>
        <li><b>合计(元)：</b><span>{{order.value ?  $utils.$formatNumber(order.value) : '暂无数据'}}</span></li>
      </ul>
      <div class="content_none" v-if="item.orderInfos.length === 0">暂无数据</div>
      <div class="person_message">经办人信息</div>
      <div class="jingbanren-name">
          <ul v-for="(agent, index1) in item.agents" :key="index1" v-if="item.agents.length !== 0">
            <li><span>经办人姓名：</span><p>{{ agent.name}}</p></li>
            <li><span>联系电话：</span><p>{{ agent.phone}}</p></li>
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
  </div>
</template>

<script>
export default {
  name: 'settlement_wrapper',
  data () {
    return {
      selIndex: 0,
      currentType: '',
      hasMore: false,
      page: 1,
      selType: 1,
      id: '',
      confirmId: '',
      token: '',
      selList: [],
      URL: ''
    }
  },
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '结算'
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
    that.$ajax.get('/sw/chain/coconfirm/settlement/detail/?token=' + that.token + '&settlementId=' + that.id + '&confirmId=' + that.confirmId).then(res => {
      // console.log(res.data.data)
      if (res.data.code === 200) {
        that.selList = res.data.data.items
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
#settlement_wrapper {
  font-size: 28px; /*px*/
  background: #fff;
  .settlement_header {
    width: 100%;
    background: $theme-d;
    height: $buttonHeight;
    h4 {
      color: #fff;
      text-align: center;
      line-height: $buttonHeight;
    }
  }
  .settlement_block {
    width: 100%;
    .settlement_item {
      width: 100%;
      li {
        width: 100%;
        @include paddingLeftRight;
        display: flex;
        align-items: center;
        justify-content:space-between;
        b {
          display: inline-block;
          color: #666;
        }
        span {
          color: #666;
          height: rem(37px);
          background: inherit;
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
