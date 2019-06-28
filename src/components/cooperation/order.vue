<template>
  <div id="order">
    <div class="order-list">
      <!-- <div class="top">
        <i class="iconfont icon-fanhui"></i>
        <h3>订单名称</h3>
      </div> -->
      <div class="center" v-for="(item, index) in orderList" :key="index">
        <ul>
          <li><span>订单名称：</span><p>{{ item.name ? item.name : '暂无数据' }}</p></li>
          <li><span>签订日期：</span><p>{{ item.signDate ? item.signDate : '暂无数据' }}</p></li>
          <li><span>出库日期：</span><p>{{ item.deliverDate ? item.deliverDate : '暂无数据' }}</p></li>
          <li><span>入库日期：</span><p>{{ item.acceptanceDate ? item.acceptanceDate : '暂无数据' }}</p></li>
          <li><span>运输日期：</span><p>{{ item.transportDate ? item.transportDate : '暂无数据' }}</p></li>
          <li><span>结算日期：</span><p>{{ item.settlementDate ? item.settlementDate : '暂无数据' }}</p></li>
        </ul>
        <div class="ul-title">商品信息</div>
        <ul v-for="(good, index1) in item.goods" :key="index1" v-if="item.goods.length > 0">
          <li><span>商品名称：</span><p>{{ good.name ? good.name : '暂无数据' }}</p></li>
          <li><span>单位：</span><p>{{ good.unit ? good.unit : '暂无数据' }}</p></li>
          <li><span>数量：</span><p>{{ good.number ? good.number : '暂无数据' }}</p></li>
          <li><span>合计(元)：</span><p>{{ good.sum ? $utils.$formatNumber(good.sum) : '暂无数据' }}</p></li>
        </ul>
        <div class="content_none" v-if="item.goods.length === 0">暂无数据</div>
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
  name: 'order',
  data: () => ({
    selIndex: 0,
    currentType: '',
    hasMore: false,
    page: 1,
    selType: 1,
    orderList: [],
    id: '',
    confirmId: '',
    token: '',
    URL: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '电子订单'
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
    that.$ajax.get('/sw/chain/coconfirm/order/detail/?token=' + that.token + '&orderId=' + that.id + '&confirmId=' + that.confirmId).then(res => {
      if (res.data.code === 200) {
        that.orderList = res.data.data.items
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
              // @include line;
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
