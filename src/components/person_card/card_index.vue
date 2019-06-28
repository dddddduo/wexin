<template>
  <div id="show_card" v-if="infoData.id">
    <h3>{{infoData.name}}</h3>
    <div class="info" v-html="infoData.company_profile"></div>
    <div class="icon_line">
      <i class="iconfont icon-dingwei"></i>
      {{infoData.address}}
    </div>
    <div class="icon_line">
      <i class="iconfont icon-tubiao210"></i>
      <a :href="'tel:' + infoData.phone">{{infoData.phone}}</a>
    </div>
    <div class="icon_line">
      <i class="iconfont icon-youxiang-"></i>
      <a :href="'mailto:' + infoData.email" v-if="infoData.email">{{infoData.email}}</a>
      <span v-else style="color: #999;">未填写</span>
    </div>
    <div class="inner_line">
      <span>所在行业</span>
      <span :class="infoData.trade ? '' : 'line_null'">{{infoData.trade || '未填写'}}</span>
    </div>
    <div class="inner_line">
      <span>成立时间</span>
      <span :class="infoData.year_founded ? '' : 'line_null'">{{infoData.year_founded || '未填写'}}</span>
    </div>
    <div class="inner_line">
      <span>加入时间</span>
      <span :class="infoData.date_joined ? '' : 'line_null'">{{handleJoin(infoData.date_joined)}}</span>
    </div>
    <div class="legal_person" v-if="legalPerson.id">
      <p class="sec_title">法人信息</p>
      <div class="icon_line">
        <i class="iconfont icon-farendaibiao"></i>
        {{legalPerson.legal_person_name}}
      </div>
      <div class="icon_line">
        <i class="iconfont icon-tubiao210"></i>
        {{legalPerson.phone}}
      </div>
      <div class="icon_line">
        <i class="iconfont icon-farenshenfenzheng" style="font-size: 26px;"></i>
        {{legalPerson.legal_person_card_id}}
      </div>
    </div>
  </div>
  <div v-else class="err_word">
    <p class="err">查找的企业不存在</p>
    <!-- <img src="../../assets/common/warning.png" alt=""> -->
    <i class="iconfont icon-dangan-1"></i>
    <div class="btn">
      <button type="button" @click="$router.go(-1)">返回</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShowCard',
  data: () => ({
    infoData: {},
    legalPerson: {}
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = '名片'
  },
  mounted () {
    let that = this
    // if (that.$route.query.id) {}
    let id = '6'
    // let id = that.$route.query.id || JSON.parse(localStorage.uid)['id']
    console.log(id)
    this.$ajax.get('/wx/business_info?legal_person=1&id=' + id).then(res => {
      that.infoData = res.data.detail || {}
      that.legalPerson = res.data.legal_person || {}
    })
  },
  methods: {
    handleJoin (s) {
      if (!s) return '未填写'
      return s.substring(0, s.indexOf('T'))
    }
  }
}
</script>
<style lang="scss" scoped>
.line_null {
  color: #999 !important;
}
.err_word {
  font-size: 32px; /*px*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .err {
    padding-top: rem(120px);
    line-height: rem(60px);
    font-size: 40px;  /*px*/
    color: #999;
  }
  img {
    margin: rem(20px) 0;
  }
  i {
    font-size: 200px; /*px*/
    color: #999;
  }
  .btn {
    width: 100%;
    margin-top: rem(30px);
    padding: 0 rem(20px);
    button {
      width: 100%;
      line-height: $buttonHeight;
      border: none;
      background: $theme-b;
      color: #fff;
      border-radius: 10px; /*px*/
    }
  }
}
#show_card {
  h3 {
    padding: rem(10px) rem(10px);
    font-size: 40px; /*px*/
    color: #333;
    font-weight: bold;
    word-break: break-all;
  }
  .info {
    padding: 0 rem(20px);
    margin: 0 rem(5px) rem(5px);
    font-size: 28px; /*px*/
    color: #666;
    line-height: rem(30px);
  }
  .icon_line {
    padding: rem(5px) rem(20px);
    min-height: rem(42px);
    font-size: 28px; /*px*/
    word-break: break-all;
    color: $theme-word;
    vertical-align: middle;
    i {
      margin-right: rem(5px);
      color: $theme;
      font-size: 40px; /*px*/
      vertical-align: middle;
    }
    a {
      color: $theme-word;
      text-decoration: none;
      vertical-align: middle;
    }
  }
  .inner_line {
    padding: rem(5px) rem(20px);
    min-height: rem(42px);
    font-size: 28px; /*px*/
    display: flex;
    align-items: center;
    span:first-child {
      color: #666;
      width: rem(100px);
    }
    span:last-child {
      width: rem(235px);
      color: $theme-word;
    }
  }
  .sec_title {
    // line-height: rem(50px);
    margin: rem(10px) rem(10px);
    padding: 0 rem(10px);
    font-size: 32px; /*px*/
    border-left: 16px solid $theme-b;
  }
}
</style>
