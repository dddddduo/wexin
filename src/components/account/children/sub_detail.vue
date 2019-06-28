<template>
  <div id="agent_detail">
    <h3><i :class="icon.name"></i>{{infoData.name}}</h3>
    <div class="info_line">
      <span><i :class="icon.phone"></i>手机号码</span>
      <span>
        <a :href="`tel:${infoData.phone}`">{{infoData.phone}}</a>
      </span>
    </div>
    <div class="info_line">
      <span><i :class="icon.id_card"></i>身份证号码</span>
      <span>{{infoData.id_card}}</span>
    </div>
    <ul class="pic_list">
      <li>
        <img :src="defaultPic" alt="">
        <p>身份证正面照</p>
      </li>
      <li>
        <img :src="defaultPic" alt="">
        <p>身份证反面照</p>
      </li>
      <li>
        <img :src="defaultPic" alt="">
        <p>手持身份证正面照</p>
      </li>
      <li>
        <img :src="defaultPic" alt="">
        <p>手持身份证正面照</p>
      </li>
    </ul>
    <div class="btn">
      <!-- <button type="button" name="auth" @click="handleAuth(null)">人脸识别认证</button> -->
      <!-- <button type="button" name="auth" @click="handleEdit">修改</button> -->
      <button type="button" name="auth" @click="handleDelete(infoData.name)">{{infoData.verified_LegalPerson === 1 ? '停用' : '启用'}}子账号</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AegentDetail',
  data: () => ({
    defaultPic: require('../../../assets/user_app/id_card.png'),
    icon: {
      name: 'iconfont icon-farendaibiao',
      phone: 'iconfont icon-shouji',
      id_card: 'iconfont icon-shenfenzheng-tianchong'
    },
    infoData: {}
  }),
  mounted () {
    const that = this
    this.$ajax.get(`/wx/agent/${that.$route.params.id}`).then(res => {
      // console.log(res)
      if (res.data.code === 1) {
        that.infoData = res.data.person
      }
    })
  },
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.name
  },
  methods: {
    // handleAuth (key) {
    //   const that = this
    //   if (!key) {
    //     this.$router.push({
    //       path: '/account/face_auth',
    //       query: {
    //         id: that.$route.query.id,
    //         name: that.infoData.name,
    //         from: 'detail'
    //       }
    //     })
    //   }
    // },
    // // 修改
    // handleEdit () {
    //   this.$router.push({
    //     path: '/account/agent_edit',
    //     query: {
    //       id: this.$route.query.id
    //     }
    //   })
    //   this.$forceUpdate()
    // },
    handleDelete (name) {
      const that = this
      that.$wechat.confirm(`您将${that.infoData.verified_LegalPerson === 1 ? '停用' : '启用'}子账号${name}`, {
        title: '确认删除？',
        buttons: [{
          label: '取消',
          type: 'default'
        }, {
          label: '确认',
          type: 'primary',
          onClick: function () {
            const loading = that.$wechat.loading('操作中...')
            that.$ajax.put('/wx/sub_account', {id: that.$route.params.id, ver: that.infoData.verified_LegalPerson === 1 ? 0 : 1}).then(res => {
              if (res.data.code === 1) {
                loading.hide()
                that.$wechat.toast(res.data.err_msg, {
                  duration: 400,
                  callback: function () {
                    // that.$router.push('/account/sub_account')
                    that.infoData.verified_LegalPerson = that.infoData.verified_LegalPerson === 1 ? 0 : 1
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
#agent_detail {
  font-size: 32px; /*px*/
  color: $theme-word;
  h3 {
    padding: rem(15px) rem(16px);
    font-size: 36px; /*px*/
    font-weight: bold;
    height: rem(80px);
    line-height: rem(60px);
    i {
      font-weight: normal;
      margin-right: rem(6px);
      color: #989898;
    }
    i:last-child {
      font-size: 56px; /*px*/
      margin-left: rem(6px);
      // font-weight: bold;
    }
  }
  &>p {
    padding: 0 rem(16px);
    margin-bottom: rem(15px);
    @include line;
    color: #666;
    i {
      color: #989898;
      margin-right: rem(6px);
      font-size: 40px; /*px*/
    }
  }
  .info_line {
    padding: rem(10px) rem(16px);
    display: flex;
    height: $buttonHeight * 1.2;
    align-items: center;
    span:first-child {
      width: 40%;
      color: #666;
      i {
        font-size: 36px; /*px*/
        margin-right: rem(6px);
        color: #989898;
      }
    }
    span:last-child {
      width: 60%;
      @include line;
      a {
        color: $theme-word;
        text-decoration: underline;
      }
    }
    a:last-child.null_line {
      color: #999;
      text-decoration: none;
    }
    span:last-child.null_line {
      color: #999;
      text-decoration: none;
    }
  }
  .pic_list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 rem(20px);
    li {
      width: 50%;
      padding: rem(20px) rem(10px);
      p {
        line-height: rem(32px);
        text-align: center;
      }
    }
  }
  .btn {
    width: 100%;
    // padding: rem(10px) rem(20px);
    position: fixed;
    bottom: 0;
    left: 0;
    button {
      font-size: 32px; /*px*/
      height: $bottomButtom;
      width: 100%;
      text-align: center;
      line-height: $bottomButtom;
      border: none;
      // border-radius: 10px; /*px*/
      background: $theme-b;
      color: #fff;
      outline: none;
    }
    // button:nth-child(2) {
    //   margin-top: rem(10px);
    // }
    // button:nth-child(3) {
    //   margin-top: rem(10px);
    //   background: $err;
    // }
  }
}
</style>
