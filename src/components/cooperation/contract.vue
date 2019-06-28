<template>
  <div id="coo_contract">
    <div class="show_section">
      <p class="title_line">
        <span>项目名称：</span>
        <span>{{contract.projectName}}</span>
      </p>
      <p class="title_line">
        <span>采购方：</span>
        <span>{{contract.type === '1' ? contract.ownCompany : contract.involvedCompany}}</span>
      </p>
      <p class="title_line">
        <span>采购方法人：</span>
        <span>{{contract.type === '1' ? contract.ownPerson : contract.involvedPerson}}</span>
      </p>
      <p class="title_line">
        <span>销售方：</span>
        <span>{{contract.type === '1' ? contract.involvedCompany :  contract.ownCompany}}</span>
      </p>
      <p class="title_line">
        <span>销售方法人：</span>
        <span>{{contract.type === '1' ? contract.involvedPerson : contract.ownPerson}}</span>
      </p>
      <p class="title_section">
        根据《中国人民共和国合同法》及其他法律，法规的有关规定，甲、乙双方在平等互利的基础上，遵循平等、自愿、公平及诚信的原则，经友好协商，达成如下合同内容：
      </p>
      <p class="section_line">
        第一条：本合同有效期为 {{contract.begin}} 日至 {{contract.end}} ，甲方向乙方订购商品；
      </p>
      <p class="section_line">
        第二条：本合同有效期内甲方订购乙方商品不少于{{contract.less}}元；
      </p>
      <p class="section_line">
        第三条：本合同有效期内，由发起方通过九星电子商务平台邀请交易方在平台记录全程供应链数据，至少有一方记录全程数据。
      </p>
    </div>
    <!-- <div class="show_agent">
      <p>经办人</p>
      <ul class="agent">
        <li v-for="(val, index) in agent" :key='index'>
          <span>{{val.name}}</span>
          <span>{{val.phone}}</span>
        </li>
        <p class="inner_null" v-if="agent.length === 0">未添加经办人</p>
      </ul>
    </div>
    <div class="file_list">
      <p>原件上传</p>
      <ul class="file">
        <li v-for="(item, index) in files" :key='index'>
          <img :src="item.url" v-if="item.type !== 'pdf'" alt="">
          <span v-else>{{item.name + '.' + item.type}}</span>
        </li>
      </ul>
      <p class="inner_null" v-if="files.length === 0">未上传文件</p>
    </div> -->
    <div class="ul-title">经办人信息</div>
    <div class="jingbanren-name" v-if="contract.agents">
      <div class="person-list" v-for="(itemAgent, index1) in contract.agents" :key="index1">
        <p>{{itemAgent.name}}</p>
        <p>{{itemAgent.phone}}</p>
      </div>
      <p class="inner_null" v-if="contract.agents.length === 0">未添加经办人</p>
    </div>
    <h3 class="ul-title">电子原件或扫描件</h3>
    <div class="pdf-list" v-if="contract.attas">
      <div v-for="(itemPdf, index2) in contract.attas" :key='index2'>
        <a href="#" v-if="itemPdf.extend === 'pdf'">{{itemPdf.name}}</a>
        <img :src='_url + itemPdf.url' v-else>
      </div>
      <p class="inner_null" v-if="contract.attas.length === 0">未添加电子原件</p>
    </div>
    <span class="ul-title">备注</span>
    <div class="text-area">
      <p class="info" v-if="contract.remark">{{contract.remark}}</p>
      <p  class="inner_null" v-if="!contract.remark">未填写备注</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CooContract',
  data: () => ({
    contract: {},
    _url: ''
  }),
  beforeCreate () {
    document.getElementsByTagName('title')[0].innerText = this.$route.query.title
  },
  mounted () {
    const that = this
    this._url = this.$utils.$url()
    // that.$ajax.get('/wx/wallet_contract/' + that.$route.query.id).then(res => {
    //   if (res.data.code === 1) {
    //     that.contract = res.data.detail
    //     that.contract._name = localStorage._name
    //   }
    // })
    that.$ajax(`/sw/chain/coconfirm/contract/detail?contractId=${that.$route.query.id}&confirmId=${that.$route.query.confirmId}`).then(res => {
      if (res.data.code === 200) {
        that.contract = res.data.data.items[0]
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import './css/cooperation.scss';
#coo_contract {
  background: #fff;
  font-size: 28px; /*px*/
  padding: rem(20px) rem(10px);
  .show_section {
    .title_line {
      display: flex;
      line-height: rem(32px);
      span:first-child {
        width: rem(100px);
      }
      span:last-child {
        width: rem(375px - 100px - 20px);
        word-break: break-all;
      }
    }
    .title_section {
      line-height: rem(32px);
    }
    .section_line {
      line-height: rem(32px);
      padding: 0 rem(10px);
    }
  }
  .ul-title {
    padding: 0 rem(20px) rem(5px) rem(8px);
    height: rem(40px);
    line-height: rem(40px);
    font-size:28px; /*px*/
    font-family:PingFang-SC-Medium;
    font-weight:bold;
    color:rgba(102,102,102,1);
  }
  .show_agent, .file_list {
    margin-top: rem(15px);
    &>P {
      font-size: 30px; /*px*/
      font-weight: bold;
      line-height: rem(32px);
    }
    &>ul.agent {
      border: 2px solid $theme-border;
      li {
        display: flex;
        line-height: rem(30px);
        span {
          width: 50%;
          text-align: center;
        }
        span:first-child {
          color: #666;
        }
      }
    }
    &>ul.file {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        height: rem(170px);
        display: flex;
        justify-content: center;
        align-items: cneter;
        span {
          border: 2px solid $theme-border; /*px*/
          width: 100%;
          text-align: center;
          line-height: rem(170px);
        }
      }
    }
  }
  .person-list {
    display: flex;
    flex: row;
    @include paddingLeftRight;
    p {
      flex: 1;
    }
  }
  .text-area {
    p.info {
      min-height: rem(60px);
      line-height: rem(30px);
    }
  }
  .inner_null {
    line-height: rem(32px * 2);
    color: #999;
    text-align: center;
    font-weight: normal;
  }
}
</style>
