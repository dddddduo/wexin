<template>
  <div id="children">
    <ul v-if="children.length !== 0">
      <li v-for="(item, index) in children" :key="index" @click="handleDetail($event, item.id, item.name)">
        <p>{{item.name}}<span>{{item.status === 0 ? '(已停用)' : ''}}</span></p>
        <p>{{item.phone}}</p>
        <i class="iconfont icon-qianwang"></i>
      </li>
    </ul>
    <p v-if="children.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p>
    <div class="null" v-if="children.length === 0">
      <img src="../../../assets/common/null.png" alt="">
      <p>暂未添加子账号</p>
    </div>
    <div class="add_agent" @click="handleAdd">添加子账号</div>
  </div>
</template>
<script>
export default {
  name: 'Agent',
  data: () => ({
    children: [],
    page: 1,
    hasMore: false
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '子账号'
  },
  mounted: function () {
    this.handleAjax(this.page)
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleDetail (e, id, name) {
      this.$router.push('/account/sub_account/' + id + '?name=' + name)
    },
    handleAjax (page) {
      const that = this
      that.$ajax.get('/wx/agent?page=' + page + '&page_size=10').then(res => {
        // console.log(res)
        if (res.data.code === 1) {
          res.data.total > page * 10 ? that.hasMore = true : that.hasMore = false
          that.page += 1
          that.children = that.children.concat(res.data.agent_list)
        }
      })
    },
    handleAdd () {
      this.$router.push('/account/sub_account_edit')
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
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#children {
  background: $bg;
  ul {
    // padding: 0 rem(10px);
    background: #fff;
    // margin-bottom: $bottomButtom;
    li {
      margin: 0 rem(12px);
      padding: 0 rem(10px);
      border-bottom: 1px solid #eee;
      position: relative;
      p:first-child {
        line-height: rem(36px);
        font-size: 32px; /*px*/
        color: $theme-word;
        font-weight: 400;
        span {
          color: #999;
          margin-left: rem(10px);
        }
      }
      p:nth-child(2) {
        font-size: 28px; /*px*/
        color: #666;
        line-height: rem(32px);
      }
      i {
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
    font-size: 28px; /*px*/
    width: 100%;
    height: $bottomButtom;
    position: fixed;
    bottom: 0;
    line-height: $bottomButtom;
    text-align: center;
    background: $theme-b;
    color: #fff;
  }
}
</style>
