<template>
  <div id="agent">
    <ul v-if="agentList.length !== 0">
      <li v-for="(item, index) in agentList" :key="index" @click="handleDetail($event, item.id, item.name)">
        <p><i class="iconfont icon-xitongguanli"></i>{{item.name}}</p>
        <p>{{item.phone}}</p>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <p v-if="agentList.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p>
    <div class="null" v-if="agentList.length === 0">
      <img src="../../../assets/common/null.png" alt="">
      <p>暂未添加经办人</p>
    </div>
    <div class="add_agent" @click="handleAdd">添加经办人</div>
  </div>
</template>
<script>
export default {
  name: 'Agent',
  data: () => ({
    agentList: [],
    page: 1,
    hasMore: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '经办人'
  },
  mounted: function () {
    this.handleAjax(this.page)
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleDetail (e, id, name) {
      // e.target.style.background = 'rgba(255, 255, 255, .55)'
      this.$router.push('/account/agent_detail?id=' + id + '&name=' + name)
    },
    handleAjax (page) {
      const that = this
      // that.$ajax.get('/wx/agent?page=' + page + '&page_size=10').then(res => {
      //   // console.log(res)
      //   if (res.data.code === 1) {
      //     res.data.total > page * 10 ? that.hasMore = true : that.hasMore = false
      //     that.page += 1
      //     that.agentList = that.agentList.concat(res.data.agent_list)
      //   }
      // })
      that.$ajax.get('/sw/company/responsible/persons?page=' + that.page).then(res => {
        if (res.data.code === 200) {
          res.data.data.agentinfos.length > 8 ? that.hasMore = true : that.hasMore = false
          that.page += 1
          that.agentList = that.agentList.concat(res.data.data.agentinfos)
        }
      })
    },
    handleAdd () {
      this.$router.push('/account/agent_edit')
    },
    handleScroll: function () {
      // 设备/屏幕高度
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scrollTop = window.scrollY
      let scrollHeight = document.body.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
        setTimeout(() => {
          this.handleAjax(this.page)
        }, 200)
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#agent {
  background: $bg;
  ul {
    // padding: 0 rem(10px);
    background: #fff;
    // margin-bottom: $bottomButtom;
    li {
      margin: 0 rem(12px);
      padding: rem(5px) rem(10px);
      border-bottom: 1px solid #eee;
      position: relative;
      p:first-child {
        line-height: rem(36px);
        font-size: 32px; /*px*/
        color: $theme-word;
        font-weight: 400;
        i {
          font-size: 42px; /*px*/
          // vertical-align: middle;
          color: $theme;
          margin-right: rem(10px);
        }
      }
      p:nth-child(2) {
        font-size: 30px; /*px*/
        color: #666;
        line-height: rem(32px);
      }
      &>i {
        position: absolute;
        right: 0;
        top: calc(50% - 34px);
        color: #999;
      }
    }
    li:last-child {
      border: none;
    }
  }
  .more_info {
    height: $buttonHeight * 2;
    line-height: $buttonHeight;
    color: #999;
    text-align: center;
  }
  .add_agent {
    font-size: 32px; /*px*/
    width: 100%;
    height: $bottomButtom;
    position: fixed;
    bottom: 0;
    line-height: $bottomButtom;
    text-align: center;
    background: $theme;
    color: #fff;
  }
}
</style>
