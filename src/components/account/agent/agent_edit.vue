<template>
  <div id="agent_detail">
    <div class="info_line">
      <span><i :class="icon.name"></i>姓名<i class="required">*</i></span>
      <input type="text" v-model="infoData.name" :class="isDisabled ? 'disabled' : ''" :disabled="isDisabled">
    </div>
    <div class="info_line">
      <span><i :class="icon.phone"></i>手机号码<i class="required">*</i></span>
      <input type="tel" maxlength="11" :class="isDisabled ? 'disabled' : ''" v-model="infoData.phone" :disabled="isDisabled">
    </div>
    <div class="info_line">
      <span><i :class="icon.email"></i>邮箱</span>
      <input type="text" v-model="infoData.email" :class="isDisabled ? 'disabled' : ''" :disabled="isDisabled">
    </div>
    <div class="info_line">
      <span><i :class="icon.office_phone"></i>办公室电话</span>
      <input type="tel" maxlength="11" :class="isDisabled ? 'disabled' : ''" :disabled="isDisabled" v-model="infoData.officePhone">
    </div>
    <div class="info_line">
      <span><i :class="icon.id_card"></i>身份证号码<i class="required">*</i></span>
      <input type="text" maxlength="18" :class="isDisabled ? 'disabled' : ''" v-model="infoData.iDnumber" :disabled="isDisabled">
    </div>
    <!-- <div class="info_line">
      <span><i :class="icon.role"></i>角色</span>
      <span>{{infoData.role}}</span>
    </div> -->
    <div class="info_line">
      <span><i :class="icon.qq"></i>QQ</span>
      <input type="number" v-model="infoData.qq" :class="isDisabled ? 'disabled' : ''" :disabled="isDisabled">
    </div>
    <div class="info_line">
      <span><i :class="icon.wechat"></i>微信</span>
      <input type="text" v-model="infoData.weChat" :class="isDisabled ? 'disabled' : ''" :disabled="isDisabled">
    </div>
    <ul class="pic_list">
      <li>
        <div class="upload_btn">
          <img  v-show="infoData.idcardFront" alt="" ref='idcardFront'>
          <input type="file" @change="handleUpload($event, 'idcardFront')" multiple>
          <div v-show="!infoData.idcardFront">+</div>
        </div>
        <p>身份证正面照</p>
      </li>
      <li>
        <div class="upload_btn">
          <img v-show="infoData.idcardBack" alt="" ref='idcardBack'>
          <input type="file" @change="handleUpload($event, 'idcardBack')" multiple>
          <div v-show="!infoData.idcardBack">+</div>
        </div>
        <p>身份证反面照</p>
      </li>
      <!-- <li>
        <div class="upload_btn">
          <input type="file" @change="handleUpload($event, 'id_3')" multiple>
          <div v-if="!infoData.legal_person_id_3" >+</div>
          <img v-show="infoData.legal_person_id_3" ref='id_3' src="" alt="">
        </div>
        <p>手持身份证正面照</p>
      </li>
      <li>
        <div class="upload_btn">
          <input type="file" @change="handleUpload($event, 'id_4')" multiple>
          <div v-if="!infoData.legal_person_id_4">+</div>
          <img v-show="infoData.legal_person_id_4" src="" alt="" ref='id_4'>
        </div>
        <p>手持身份证正面照</p>
      </li> -->
    </ul>
    <div class="break"></div>
    <div class="btn">
      <button type="button" name="auth" @click="handleAuth">提交</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddArnet',
  data () {
    return {
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
      infoData: {
        idcardFront: '',
        idcardBack: ''
      },
      isDisabled: false,
      URL: '',
      imgs: {}
    }
  },
  beforeCreate () {
    if (this.$route.query.name) {
      document.getElementsByTagName('title')[0].innerText = this.$route.query.name
    } else {
      document.getElementsByTagName('title')[0].innerText = '添加经办人'
    }
  },
  mounted () {
    const that = this
    that.URL = that.$utils.$url(`https://dev.ninstarscf.com`)
    that.isDisabled = Number(that.$route.query.status) === 1 ? !that.isDisabled : that.isDisabled
    if (this.$route.query.id) {
      that.$ajax.get('/sw/company/responsible/person?aId=' + that.$route.query.id).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          that.infoData = res.data.data.agentinfo
        }
      })
    }
  },
  methods: {
    getImgUrl (file) {
      var url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL) {
        url = window.createObjectURL(file)
      } else if (window.URL) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    handleAuth (key) {
      const that = this
      const loading = that.$wechat.loading('提交中...')
      let {infoData} = that
      if (Number(that.$route.query.status) === 1) {
        if (!(infoData.idcardFront && infoData.idcardBack)) {
          loading.hide()
          that.$wechat.topTips('请上传证件信息')
        }
      }
      if (!infoData.name) {
        loading.hide()
        that.$wechat.topTips('请输入经办人姓名')
      } else if (!(that.$store.state.reg.phone.test(infoData.phone))) {
        loading.hide()
        that.$wechat.topTips('请输入正确的经办人手机号码')
        loading.hide()
      } else if (!infoData.iDnumber) {
        loading.hide()
        that.$wechat.topTips('请输入正确的经办人身份证号码')
      } else {
        if (infoData.email) {
          if (!(that.$store.state.reg.email.test(infoData.email))) {
            that.$wechat.topTips('邮箱格式错误')
            loading.hide()
          } else {
            that.handleAjax(infoData, loading)
          }
        } else {
          that.handleAjax(infoData, loading)
        }
      }
    },
    submit (params, loading) {
      var that = this
      this.$ajax.post('/sw/company/responsible/person', JSON.stringify(params)).then(res => {
        if (res.data.code === 200) {
          that.uploadCardInfo(that.infoData)
          if (params.id || params.aId) {
            that.$wechat.toast(res.data.err_msg, {
              duration: 900,
              callback: function () {
                that.$router.push({
                  path: '/account/face_auth',
                  query: {
                    id: params.id || params.aId,
                    name: params.name
                  }
                })
              }
            })
          }
        } else {
          this.$wechat.topTips(res.data.message)
        }
        loading.hide()
      }).catch(() => {
        loading.hide()
      })
    },
    handleUpload (e, key) {
      const that = this
      let file = e.target.files[0]
      let fr = new FileReader()
      if (file && /\.(jpe?g|png|gif)$/i.test(file.name)) {
        if (file.size <= 5 * 1024 * 1024) { // 最大限制5M
          const loading = this.$wechat.loading('上传中...')
          fr.readAsDataURL(file)
          fr.onload = function (e) {
            let upload = new FormData()
            let timestamp = new Date().getTime()
            upload.append('file', file)
            upload.append('type', '经办人')
            upload.append('timestamp', timestamp)
            that.$ajax.post('/sw/file/upload', upload).then(res => {
              if (res.data.code === 200) {
                that.infoData[key] = res.data.data.fileUrl
              } else {
                that.$wechat.topTips(res.data.message)
              }
              loading.hide()
            })
          }
        } else {
          that.$wechat.topTips('文件最大限制5M')
        }
      } else {
        that.$wechat.topTips('文件格式不正确')
      }
    },
    handleAjax (data, loading) {
      const that = this
      let queryObj = {
        companyName: localStorage._name || '',
        email: data.email || '',
        identityNumber: data.iDnumber || '',
        jobRole: data.role || '操作员',
        name: data.name || '',
        officePhone: data.officePhone || '',
        phone: data.phone || '',
        qqAccount: data.qq || '',
        token: localStorage.ns_token || '',
        wxAccount: data.weChat || ''
      }
      if (that.$route.query.id) {
        queryObj.aId = that.$route.query.id
        if (Number(that.$route.query.status) === 1) {
          that.uploadCardInfo(that.infoData, loading)
        } else {
          this.submit(queryObj, loading, 'PUT')
        }
      } else {
        this.submit(data, loading)
      }
    },
    uploadCardInfo (data, loading) {
      let obj = {
        method: 'PUT',
        url: '/sw/company/responsible/person/card',
        params: {aId: data.id || data.aId, idFrontImg: data.idcardFront || '', idBackImg: data.idcardBack || ''}
      }
      this.$ajax(obj).then(res => {
        if (res.data.code === 200) {
          this.$router.push('/account/agent_detail?id=' + this.infoData.id + '&name=' + this.infoData.name)
        } else {
          this.$wechat.topTips(res.data.message)
        }
        loading.hide()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#agent_detail {
  font-size: 32px; /*px*/
  color: $theme-word;
  padding-top: $bottomButtom;
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
      width: rem(130px);
      color: #666;
      i {
        font-size: 36px; /*px*/
        margin-right: rem(6px);
        color: #989898;
      }
      i.required {
        color: $err;
      }
    }
    input:last-child {
      width: rem(200px);
      border: none;
      background: none;
      border-bottom: 2px solid #ececec; /*px*/
      outline: none;
      padding: rem(3px) rem(6px);
      transition:all .23s;
    }
    input:disabled {
      color: #999;
    }
    input:focus {
      border-bottom: 2px solid $theme-b; /*px*/
    }
  }
  .pic_list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 rem(20px);
    li {
      width: 50%;
      padding: rem(20px) rem(10px);
      .upload_btn {
        position: relative;
        width: rem(140px);
        height: rem(140px);
        margin: 0 auto;
        border: 2px solid $theme-border; /*px*/
        display: flex;
        align-items: center;
        img {
          width: 100%;
          height: 80%;
        }
        input {
          position: absolute;
          top: 0;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          outline: none;
          opacity: 0;
          background: none;
        }
        div {
          position: absolute;
          top: rem(52px);
          left: rem(52px);
          // z-index: -1;
          width: rem(36px);
          height: rem(36px);
          font-size: 72px; /*px*/
          text-align: center;
          color: #888;
          line-height: rem(40px);
          // background: #fff;
        }
      }
      p {
        line-height: rem(32px);
        text-align: center;
      }
    }
  }
  .break {
    height: $bottomButtom + rem(10px);
  }
  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;
    // padding: rem(10px) rem(20px);
    button {
      height: $bottomButtom;
      width: 100%;
      text-align: center;
      line-height: $buttonHeight;
      border: none;
      background: $theme;
      color: #fff;
      font-size: 32px; /*px*/
      outline: none;
    }
  }
}
</style>
