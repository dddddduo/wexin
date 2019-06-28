<template>
  <div id="record">
    <ul>
      <li v-for="(item, index) in record" :key="index" @click="handleNavigate(index)">
        <div class="inner_detail">
          <p>
            <i class="iconfont icon-jine"></i>
            <span>{{item.show_value}}</span>
          </p>
          <p>
            <i class="iconfont icon-shenhe"></i>
            <span v-if="item.value > 0">充值方式：{{item.type}}</span>
            <span v-else>操作：{{item.type}}</span>
          </p>
          <p>
            <i class="iconfont icon-shijian1"></i>
            <span>{{item.show_time}}</span>
          </p>
        </div>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <p v-if="record.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p>
    <div class="null" v-if="record.length === 0">
      <img src="../../assets/common/null.png" alt="">
      <p>暂无消息</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Record',
  data: () => ({
    page: 1,
    pageSize: 6,
    record: [],
    hasMore: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '订单'
  },
  mounted: function () {
    // this.handleAjax()
    this.handleLajax()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleAjax (page) {
      const that = this
      that.$ajax.get('/wx/wallet_order?page_size=' + that.pageSize + '&page=' + (page || 1)).then(res => {
        if (res.data.code === 1) {
          that.order = that.order.concat(res.data.order)
          that.page++
          res.data.total > that.page * that.pageSize ? that.hasMore = true : that.hasMore = false
        }
      })
    },
    handleLajax (page) {
      const that = this
      let { chargeList } = localStorage
      let p = page || 1
      if (chargeList) {
        let arr = JSON.parse(chargeList).reverse()
        let ps = that.pageSize
        arr.length > p * ps ? that.hasMore = true : that.hasMore = false
        let con = arr.filter((val, index) => index >= (p - 1) * ps && index <= p * ps - 1)
        that.record = that.record.concat(con.map(val => {
          return {
            ...val,
            show_value: val.value > 0 ? '+' + Number(val.value).toFixed(2) : Number(val.value).toFixed(2),
            show_time: that.$utils.$time(val.update_time, 1)
          }
        }))
        that.page++
      } else {
        that.record = []
        that.hasMore = false
      }
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
            // this.handleAjax(this.page)
            this.handleLajax(this.page)
          }, 200)
        }
      }
    },
    handleNavigate (id) {
      this.$router.push('/wallet/record/' + id)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#record {
  ul {
    background: #fff;
    font-size: 32px; /*px*/
    li {
      padding: 0 rem(20px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid $theme-border;
      &>i {
        color: #999;
      }
      .inner_detail {
        p {
          line-height: rem(40px);
          vertical-align: middle;
          i {
            color: #999;
            font-size: 28px; /*px*/
          }
        }
        p:first-child {
          span {
            font-weight: bold;
            color: #333;
          }
        }
        p:nth-child(2) {
          color: #666;
        }+
        p:nth-child(3) {
          line-height: rem(36px);
          color: #333;
          span {
            color: #999;
          }
        }
      }
    }
  }
  .more_info {
    height: $buttonHeight;
    line-height: $buttonHeight;
    color: #999;
    text-align: center;
  }
}
</style>
