<template>
  <div id="cooperation">
    <div class="show_nav">
      <ul class="slide_nav">
        <li>
          <span :style="selIndex === 0 ? 'border-bottom: 0.05rem solid #fff;': ''" @click="selIndex = 0">未确认</span>
        </li>
        <li>
          <span :style="selIndex === 1 ? 'border-bottom: 0.05rem solid #fff;': ''" @click="selIndex = 1">已确认</span>
        </li>
      </ul>
      <div class="type_nav">
        <ul>
          <li v-for="(type, index) in types" :key="index" @click="handleSlide(index)" :style="index === selType ? 'color: #eb6100' : ''">{{type.title}}</li>
        </ul>
        <div class="sel_line" :style="currentType"></div>
      </div>
    </div>
    <div class="show_section">
      <ul>
        <li v-for="(item, index) in showList" :key="index" @click="handleDetail(item, index)">
          <div class="show_wrap">
            <p><i class="iconfont icon-hetong"></i>{{item.chainName}}</p>
            <p><i class="iconfont icon-webicon306"></i>{{item.companyName}}</p>
            <p><i class="iconfont icon-shijian1"></i>{{item.date}}</p>
          </div>
          <div class="icon_wrap">
            <i class="iconfont icon-qianwang"></i>
          </div>
        </li>
      </ul>
      <!-- <p v-if="showList.length !== 0" class="more_info">{{hasMore ? '正在加载' : '到底了'}}</p> -->
      <div class="null" v-if="showList.length === 0">
        <img src="../../assets/common/null.png" alt="">
        <p>暂无协同邀请</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Cooperation',
  data: () => ({
    selIndex: 0,
    types: [
      {title: '全部'},
      {title: '销售确认'},
      {title: '采购确认'},
      {title: '债务确认'},
      {title: '债权确认'}
    ],
    currentType: '',
    showList: [],
    hasMore: false,
    page: 1,
    selType: 0
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '协同确认'
  },
  mounted () {
    this.handleAjax(0, 0)
    // window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleSlide (index) {
      let position = (0.227 + index * 2) + 'rem'
      this.currentType = `left: ${position};`
      this.selType = index
    },
    handleAjax (auth, type, page) {
      const that = this
      // that.$ajax.get(`/wx/auth_contrct?auth=${auth || 0}&id=20&type=${type || 0}&page=${page || 1}`).then(res => {
      //   if (res.data.code === 1) {
      //     if (page === 1) {
      //       that.showList = res.data.list
      //     } else {
      //       that.showList = that.showList.concat(res.data.list)
      //     }
      //     res.data.total > that.page * 5 ? that.hasMore = true : that.hasMore = false
      //     that.page++
      //   }
      // })
      // that.$ajax.get(`/sw/chain/coconfirms?type=${auth}&contractType=${type !== 0 ? type : ''}`).then(res => {
      //   console.log(res)
      // })
      that.$ajax.get(`/sw/chain/coconfirms?type=${auth}&contractType=${type !== 0 ? type : ''}`).then(res => {
        if (res.data.code === 200) {
          that.showList = res.data.data.list
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
            let auth = this.selIndex === 0 ? 0 : 1
            let type = this.selType <= 2 ? this.selType : 0
            this.handleAjax(auth, type, this.page)
          }, 200)
        }
      }
    },
    // 查看单据
    handleDetail (item) {
      const that = this
      this.$router.push({
        path: '/cooperation/charge',
        query: {
          chain_id: item.chain_id,
          id: item.id,
          title: item.chainName,
          auth: that.selIndex
        }
      })
    }
  },
  watch: {
    selIndex: function (sel) {
      window.scrollTo(0, 0)
      const that = this
      this.page = 1
      that.handleAjax(sel, this.selType, this.page)
    },
    selType: function (sel) {
      window.scrollTo(0, 0)
      // console.log(sel)
      const that = this
      if (sel > 4) {
        that.showList = []
      } else {
        that.page = 1
        that.handleAjax(this.selIndex, sel, this.page)
      }
    }
  },
  destroyed () {
    // window.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss" scoped>
#cooperation {
  font-size: 28px; /*px*/
  .show_nav {
    position: fixed;
    top: 0;
    width: 100%;
    border-bottom: 2px solid $theme-border; /*px*/
    .slide_nav {
      display: flex;
      height: $buttonHeight * 1.2;
      align-items: center;
      background: $theme;
      color: #fff;
      li {
        width: 50%;
        text-align: center;
        span {
          padding: rem(6px) rem(5px);
        }
      }
    }
    .type_nav {
      position: relative;
      // border-top: 2px solid $theme-d; /*px*/
      ul {
        display: flex;
        height: $buttonHeight;
        align-items: center;
        background: #fff;
        color: #666;
        li {
          width: 25%;
          text-align: center;
        }
      }
      .sel_line {
        width: rem(56px);
        height: rem(2px);
        background: #fff;
        position: absolute;
        top: rem(36px);
        left: rem(11px);
        transition: all .15s ease-in-out;
        background: $theme;
      }
    }
  }
  .show_section {
    padding-top: $buttonHeight * 2.2;
    ul {
      padding: 0 rem(10px);
      background: #fff;
      li {
        display: flex;
        align-items: center;
        border-bottom: 2px solid $theme-border; /*px*/
        padding: rem(5px) rem(10px);
        .show_wrap {
          width: rem(375px - 80px);
          p {
            line-height: rem(36px);
            font-size: 28px; /*px*/
            color: $theme-word;
            font-weight: bold;
            i {
              font-size: 40px; /*px*/
              color: $theme;
              margin-right: rem(5px);
              vertical-align: middle;
            }
          }
          p:nth-child(2) {
            color: #666;
            font-weight: normal;
          }
          p:last-child {
            color: #999;
            font-weight: normal;
            i {
              color: #999;
            }
          }
        }
        .icon_wrap {
          width: rem(40px);
          text-align: right;
          color: #999;
        }
      }
      li:last-child {
        border: none;
      }
    }
    .more_info {
      background: $bg;
      height: $buttonHeight;
      line-height: $buttonHeight;
      color: #999;
      text-align: center;
    }
  }
}
</style>
