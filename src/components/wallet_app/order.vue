<template>
  <div id="order">
    <ul>
      <li v-for="(item, index) in order" :key="index" @click="handleNavigate(item.id)">
        <div class="inner_detail">
          <p>
            <i class="iconfont icon-jine"></i>
            <span>{{item.value}}</span>
          </p>
          <p>
            <i class="iconfont icon-shijian1"></i>
            <span>{{item.show_time}}</span>
          </p>
        </div>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <p v-if="order.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p>
    <div class="null" v-if="order.length === 0">
      <img src="../../assets/common/null.png" alt="">
      <p>暂无消息</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Order',
  data: () => ({
    page: 1,
    pageSize: 9,
    order: [],
    hasMore: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '订单'
  },
  mounted: function () {
    this.handleAjax()
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
    handleScroll: function () {
      // 设备/屏幕高度
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scrollTop = window.scrollY
      let scrollHeight = document.body.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
        if (this.hasMore) {
          setTimeout(() => {
            this.handleAjax(this.page)
          }, 200)
        }
      }
    },
    handleNavigate (id) {
      this.$router.push('/wallet/order/' + id)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#order {
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
            font-size: 40px; /*px*/
          }
        }
        p:first-child {
          span {
            font-weight: bold;
            color: #333;
          }
        }
        p:last-child {
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
