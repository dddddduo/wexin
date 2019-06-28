<template>
  <div id="message_detail">
    <h3 class="inner_title">{{innerDetail.title}}</h3>
    <p class="inner_sender"><i class="iconfont icon-fasong"></i>{{innerDetail.sender}}</p>
    <p class="inner_time"><i class="iconfont icon-shijian"></i>{{innerDetail.date}}</p>
    <p class="inner_body">{{innerDetail.content}}</p>
    <!-- <div class="btn">
      <button type="button" @click="handleDelete">删除消息</button>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'MessageDetail',
  data: () => ({
    id: '',
    innerDetail: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.name
  },
  mounted () {
    const that = this
    // this.$ajax.get(`/wx/message/${this.$route.params.id}`).then(res => {
    //   // console.log(res)
    //   if (res.data.code === 1) {
    //     that.innerDetail = res.data.detail
    //   }
    // })
    let data = {
      messageId: that.$route.params.id,
      token: localStorage.ns_token
    }
    this.$ajax({
      method: 'get',
      url: '/sw/msg/one',
      params: {...data, sign: that.$utils.$encode(data)}
    }).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        that.innerDetail = res.data.data.msg
      }
    })
  },
  methods: {
    handleDelete () {
      const that = this
      that.$wechat.confirm('确认删除本条消息？', {
        title: '确认删除？',
        buttons: [{
          label: '取消',
          type: 'default'
        }, {
          label: '确认',
          type: 'primary',
          onClick: function () {
            const loading = that.$wechat.loading('删除中...')
            that.$ajax.delete('/wx/message?id=' + that.$route.params.id).then(res => {
              if (res.data.code === 1) {
                loading.hide()
                that.$wechat.toast(res.data.err_msg, {
                  duration: 800,
                  callback: function () {
                    that.$router.push('/settings/message')
                  }
                })
              }
            })
          }
        }]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#message_detail {
  font-size: 32px; /*px*/
  padding: 0 rem(20px);
  .inner_title {
    padding-top: rem(5px);
    line-height: rem(40px);
    font-weight: bold;
  }
  .inner_sender {
    margin-top: rem(10px);
    color: #666;
    font-size: 28px; /*px*/
    i {
      font-size: 36px; /*px*/
      margin-right: rem(6px);
    }
  }
  .inner_time {
    margin-top: rem(10px);
    color: #999;
    font-size: 28px; /*px*/
    i {
      font-size: 36px; /*px*/
      margin-right: rem(6px);
    }
  }
  .inner_body {
    color: $theme-word;
    margin-top: rem(10px);
    padding: rem(5px);
    border: 2px solid $theme-border; /*px*/
    line-height: rem(32px);
    min-height: rem(36px) * 10;
    word-break: break-all;
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    // padding: 0 rem(20px);
    button {
      width: 100%;
      height: $bottomButtom;
      line-height: $bottomButtom;
      color: #fff;
      background: $err;
      text-align: center;
      border: none;
      outline: none;
      font-size: 32px; /*px*/
    }
  }
}
</style>
