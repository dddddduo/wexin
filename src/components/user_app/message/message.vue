<template>
  <div id="message">
    <ul>
      <li v-for="(item, index) in messageList" :key="index" @click="handleDetail(item)"
      :style="item.read ? 'background: #fff' : 'background: #fafafa'">
        <div class="item_wrap">
          <div>
            <p>{{item.title}}</p>
            <p>{{item.date}}</p>
          </div>
          <div class="pic_wrap">
            <i class="iconfont icon-qianwang"></i>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="messageList.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p>
    <div class="null" v-if="messageList.length === 0">
      <img src="../../../assets/common/null.png" alt="">
      <p>暂无消息</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  data: () => ({
    messageList: [],
    page: 1,
    hasMore: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '我的消息'
  },
  mounted: function () {
    this.handleAjax(1)
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    // handleAjax (page) {
    //   const that = this
    //   let pageSize = 15
    //   that.$ajax({
    //     method: 'GET',
    //     url: `/wx/message?page=${page}&page_size=${pageSize}`,
    //     headers: {id: '11'}
    //   }).then(res => {
    //     if (res.data.code === 1) {
    //       res.data.total > page * pageSize ? that.hasMore = true : that.hasMore = false
    //       that.messageList = that.messageList.concat(res.data.messageList)
    //       this.page++
    //     }
    //   })
    // },
    handleAjax (page) {
      const that = this
      that.$ajax({
        method: 'GET',
        url: `/sw/msg/list?page=` + page
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          res.data.data.msgs.length !== 0 ? that.hasMore = true : that.hasMore = false
          that.messageList = that.messageList.concat(res.data.data.msgs)
          this.page++
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
    handleDetail (item) {
      this.$router.push({
        path: `/message/${item.id}`,
        query: {
          name: item.title
        }
      })
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#message {
  font-size: 32px; /*px*/
  ul {
    li {
      height: rem(60px);
      padding: rem(5px) rem(20px);
      background: #fff;
      box-sizing: content-box;
      border-bottom: 2px solid $theme-border; /*px*/
      .item_wrap {
        display: flex;
        div:first-child {
          width: rem(305px);
          p {
            height: rem(30px);
            line-height: rem(30px);
            @include line
          }
          p:first-child {
            color: $theme-word;
            font-weight: bolder;
          }
          p:last-child {
            color: #999;
            font-size: 28px; /*px*/
          }
        }
        div.pic_wrap {
          width: rem(30px);
          text-align: center;
          color: #999;
          line-height: rem(60px);
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
