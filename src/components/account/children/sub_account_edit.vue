<template>
  <div id="sub_detail">
    <div class="info_line">
      <span><i :class="icon.name"></i>姓名<i class="required">*</i></span>
      <input type="text" v-model="infoData.name">
    </div>
    <div class="info_line">
      <span><i :class="icon.phone"></i>手机号码<i class="required">*</i></span>
      <input type="tel" maxlength="16" v-model="infoData.phone">
    </div>
    <div class="info_line">
      <span><i :class="icon.id_card"></i>身份证号码<i class="required">*</i></span>
      <input type="text" v-model="infoData.id_card">
    </div>
    <!-- <div class="info_line">
      <span><i :class="icon.role"></i>角色</span>
      <span>{{infoData.role}}</span>
    </div> -->
    <ul class="pic_list">
      <li>
        <div class="upload_btn">
          <img  v-show="infoData.legal_person_id_1" src="" alt="" ref='id_1'>
          <input type="file" @change="handleUpload($event, 'id_1')" multiple>
          <div v-if="!infoData.legal_person_id_1">+</div>
        </div>
        <p>身份证正面照</p>
      </li>
      <li>
        <div class="upload_btn">
          <img v-show="infoData.legal_person_id_2" src="" alt="" ref='id_2'>
          <input type="file" @change="handleUpload($event, 'id_2')" multiple>
          <div v-if="!infoData.legal_person_id_2">+</div>
        </div>
        <p>身份证反面照</p>
      </li>
      <li>
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
      </li>
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
  data: () => ({
    icon: {
      name: 'iconfont icon-farendaibiao',
      business: 'iconfont icon-gongsi',
      phone: 'iconfont icon-shouji',
      id_card: 'iconfont icon-shenfenzheng-tianchong'
    },
    infoData: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '添加子账号'
  },
  mounted () {
    const that = this
    if (this.$route.query.id) {
      this.$ajax.get(`/wx/agent/${that.$route.query.id}`).then(res => {
        // console.log(res)
        if (res.data.code === 1) {
          that.infoData = res.data.person
          that.infoId = this.$route.query.id
        }
      })
    }
  },
  methods: {
    handleAuth (key) {
      const that = this
      const loading = that.$wechat.loading('提交中...')
      let {infoData} = that
      if (!infoData.name) {
        loading.hide()
        that.$wechat.topTips('请输入子账号姓名')
      } else if (!(that.$store.state.reg.phone.test(infoData.phone))) {
        loading.hide()
        that.$wechat.topTips('请输入正确的子账号手机号码')
        loading.hide()
      } else if (!infoData.id_card) {
        loading.hide()
        that.$wechat.topTips('请输入正确的子账号身份证号码')
      } else {
        that.handleAjax(infoData, loading)
      }
    },
    handleUpload (e, key) {
      const that = this
      const loading = this.$wechat.loading('上传中...')
      let f = e.target.files[0]
      let fr = new FileReader()
      fr.readAsDataURL(f)
      fr.onload = function (e) {
        that.$refs[key].src = e.target.result
      }
      // console.log(e)
      let id = localStorage.id
      let upload = new FormData()
      upload.append('file', f)
      upload.append('id', id)
      that.infoData['legal_person_' + key] = f
      this.$forceUpdate()
      loading.hide()
    },
    handleAjax (data, loading) {
      const that = this
      let obj = {
        method: 'POST',
        url: '/wx/agent',
        data: data
      }
      that.$ajax(obj).then(res => {
        // console.log(res)
        if (res.data.code === 1) {
          loading.hide()
          that.$wechat.toast(res.data.err_msg, {
            duration: 900,
            callback: function () {
              that.$router.push({
                path: '/account/sub_account',
                query: {
                  id: that.$route.query.id || res.data.iid,
                  name: data.name
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#sub_detail {
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
