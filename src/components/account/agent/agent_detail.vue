<template>
  <div id="agent_detail">
    <h3><i :class="icon.name"></i>{{infoData.name}}<i @click="handleAuth(infoData.videoAuth)" :class='icon.face' :style="infoData.videoAuth === 3 ? 'color: #eb6100' : 'color: #999;'"></i>
      <span class="agent_tips">{{auth(infoData)}}</span>
    </h3>
    <p><i :class="icon.business"></i>{{infoData.company}}</p>
    <div class="info_line">
      <span><i :class="icon.phone"></i>手机号码</span>
      <span>
        <a :href="`tel:${infoData.phone}`">{{infoData.phone}}</a>
      </span>
    </div>
    <div class="info_line">
      <span><i :class="icon.email"></i>邮箱</span>
      <span>
        <a :href="infoData.email ? `mailto:${infoData.email}` : 'javascript:;'" :class="!infoData.email ? 'null_line' : ''">{{infoData.email || '未填写'}}</a>
      </span>
    </div>
    <div class="info_line">
      <span><i :class="icon.office_phone"></i>办公室电话</span>
      <span :class="!infoData.officePhone ? 'null_line' : ''">{{infoData.officePhone || '未填写'}}</span>
    </div>
    <div class="info_line">
      <span><i :class="icon.id_card"></i>身份证号码</span>
      <span>{{infoData.iDnumber}}</span>
    </div>
    <div class="info_line">
      <span><i :class="icon.role"></i>角色</span>
      <span :class="!infoData.role ? 'null_line' : ''">{{infoData.role || '未填写'}}</span>
    </div>
    <div class="info_line">
      <span><i :class="icon.qq"></i>QQ</span>
      <span :class="!infoData.qq ? 'null_line' : ''">{{infoData.qq || '未填写'}}</span>
    </div>
    <div class="info_line">
      <span><i :class="icon.wechat"></i>微信</span>
      <span :class="!infoData.weChat ? 'null_line' : ''">{{infoData.weChat || '未填写'}}</span>
    </div>
    <ul class="pic_list">
      <li>
        <img :src="infoData.idcardFront ? URL + infoData.idcardFront : defaultPic" alt="">
        <p>身份证正面照</p>
      </li>
      <li>
        <img :src="infoData.idcardBack ? URL + infoData.idcardBack : defaultPic" alt="">
        <p>身份证反面照</p>
      </li>
      <!-- <li>
        <img :src="infoData.legal_person_id_3 || defaultPic" alt="">
        <p>手持身份证正面照</p>
      </li>
      <li>
        <img :src="infoData.legal_person_id_4 || defaultPic" alt="">
        <p>手持身份证正面照</p>
      </li> -->
    </ul>
    <div class="btn" v-if="infoData.videoAuth !== 2 && infoData.videoAuth !== 3">
      <button type="button" name="auth" @click="handleAuth(null)">人脸识别认证</button>
      <button type="button" name="auth" @click="handleEdit">修改</button>
      <!-- <button type="button" name="auth" @click="handleDelete(infoData.name)">删除</button> -->
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
      business: 'iconfont icon-gongsi',
      phone: 'iconfont icon-shouji',
      id_card: 'iconfont icon-shenfenzheng-tianchong',
      email: 'iconfont icon-youxiang-',
      office_phone: 'iconfont icon-dianhua',
      role: 'iconfont icon-jiaoseguanli',
      qq: 'iconfont icon-qq',
      face: 'iconfont icon-renlianshibie_o',
      wechat: 'iconfont icon-weixin'
    },
    infoData: {},
    URL: '',
    videoAuth: {
      1: '请重新进行视频认证'
    },
    cardAuth: {
      1: '请上传证件信息',
      2: '证件审核中',
      4: '未通过'
    }
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.name
  },
  mounted () {
    const that = this
    that.URL = that.$utils.$url(`https://dev.ninstarscf.com`)
    that.$ajax.get('/sw/company/responsible/person?aId=' + that.$route.query.id).then(res => {
      if (res.data.code === 200) {
        that.infoData = res.data.data.agentinfo
      }
    })
  },
  methods: {
    auth (info) {
      let result = ''
      if (info.cardAuth === 1) {
        result = this.cardAuth[info.cardAuth]
      } else if (info.cardAuth === 2) {
        result = this.cardAuth[info.cardAuth]
      } else if (info.cardAuth === 4) {
        result = this.cardAuth[info.cardAuth]
      } else if (info.cardAuth === 3) {
        if (info.videoAuth === 1) {
          result = this.videoAuth[info.videoAuth]
        } else if (info.videoAuth === 2) {
          result = this.videoAuth[info.videoAuth]
        } else if (info.videoAuth === 4) {
          result = this.videoAuth[info.videoAuth]
        }
      }
      return result
    },
    handleAuth (key) {
      const that = this
      if (!key) {
        this.$router.push({
          path: '/account/face_auth',
          query: {
            id: that.$route.query.id,
            name: that.infoData.name,
            from: 'detail'
          }
        })
      }
    },
    // 修改
    handleEdit () {
      this.$router.push({
        path: '/account/agent_edit',
        query: {
          id: this.$route.query.id,
          status: this.infoData.videoAuth
        }
      })
      this.$forceUpdate()
    },
    handleDelete (name) {
      const that = this
      that.$wechat.confirm(`您将删除经办人${name}`, {
        title: '确认删除？',
        buttons: [{
          label: '取消',
          type: 'default'
        }, {
          label: '确认',
          type: 'primary',
          onClick: function () {
            const loading = that.$wechat.loading('删除中...')
            that.$ajax.delete('/wx/agent?id=' + that.$route.query.id).then(res => {
              if (res.data.code === 1) {
                loading.hide()
                that.$wechat.toast(res.data.err_msg, {
                  duration: 800,
                  callback: function () {
                    that.$router.push('/account/agent')
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
    .agent_tips {
      font-size: 28px; /*px*/
      color: #f20f0b
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
    padding: rem(10px) rem(20px);
    button {
      font-size: 32px; /*px*/
      height: $buttonHeight;
      width: 100%;
      text-align: center;
      line-height: $buttonHeight;
      border: none;
      border-radius: 10px; /*px*/
      background: $theme;
      color: #fff;
      outline: none;
    }
    button:nth-child(2) {
      margin-top: rem(10px);
    }
    button:nth-child(3) {
      margin-top: rem(10px);
      // background: $err;
    }
  }
}
</style>
