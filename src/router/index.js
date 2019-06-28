import Vue from 'vue'
import Router from 'vue-router'

// 用户首页
import AppIndex from '@/components/app_index'
import InviteCode from '@/components/log_app/invite_code'
import Register from '@/components/log_app/register'
import Login from '@/components/log_app/login'
import ForgetPhone from '@/components/log_app/forget_phone'
import ChangePwd from '@/components/log_app/change_password'
import Success from '@/components/common/success'
// 微信登陆重定向页面
import signture from '@/components/log_app/signture'
// 用户
import UserInfo from '@/components/user_app/index'
// 我的账号
import Account from '@/components/account/index'
// 设置次级功能
import Agent from '@/components/account/agent/agent'
// 经办人次级功能
import AgentDetail from '@/components/account/agent/agent_detail'
// 添加经办人
import AddAgnet from '@/components/account/agent/agent_edit'
// 人脸识别
import FaceAuth from '@/components/account/agent/face_auth'
// 修改账户
import AuthAaccount from '@/components/account/change/auth_account'
// 修改登陆账号
import ChangeAccount from '@/components/account/change/change_account'
// 修改密码页面
import ChangePassword from '@/components/account/change/change_pwd'
// 子账号详情
import ChildrenDetail from '@/components/account/children/sub_detail'
// 子账号列表
import Children from '@/components/account/children/sub_list'
// 子账号列表
import ChildrenEdit from '@/components/account/children/sub_account_edit'
// 消息列表
import Message from '@/components/user_app/message/message'
// 消息详情
import MessageDetail from '@/components/user_app/message/message_detail'
// 钱包首页
import Wallet from '@/components/wallet_app/wallet_index'
// 钱包订单列表
import Order from '@/components/wallet_app/order'
// 钱包订单详情
import OrderDetail from '@/components/wallet_app/order_detail'
// 钱包发票列表
import Invoice from '@/components/wallet_app/invoice'
// 钱包订单详情
import InvoiceDetail from '@/components/wallet_app/invoice_detail'
// 钱包合同列表
import Contract from '@/components/wallet_app/contract'
// 钱包合同详情
import ContractDetail from '@/components/wallet_app/contract_detail'
// 充值
import Invest from '@/components/wallet_app/invest'
// 提现
import Drawback from '@/components/wallet_app/drawback'
// 消费记录
import Record from '@/components/wallet_app/record'
// 发票查验
import CheckInvoice from '@/components/invoice_app/invoice_index'
// 发票结果为真
import InvoiceReal from '@/components/invoice_app/invoice_real'
// 发票结果为假
import InvoiceFake from '@/components/invoice_app/invoice_fake'
// 博客
import ShowCard from '@/components/person_card/card_index'
// 协同确认列表
import Cooperation from '@/components/cooperation/cooperation_list'
// 单据列表
import ChargeList from '@/components/cooperation/charge_list'
// 协同确认 —— 合同
import CooContract from '@/components/cooperation/contract'
// 协同确认 —— 订单
import CooperationOrder from '@/components/cooperation/order'
// 协同确认 —— 结算
import Settlement from '@/components/cooperation/settlement'
// 协同确认 —— 发票
import Fainvoice from '@/components/cooperation/invoice'
// 协同确认 —— 支付
import Payment from '@/components/cooperation/payment'
// 协同确认 —— 定金
import CooperationDeposit from '@/components/cooperation/deposit'
// 协同确认 —— 出货单
import CooperationDelivery from '@/components/cooperation/delivery'
// 协同确认 —— 运单
import CooperationWaybill from '@/components/cooperation/waybill'
// 协同确认 —— 验收单
import Acceptance from '@/components/cooperation/acceptance'
// 协同确认 —— 订单列表
import CooOrderlist from '@/components/cooperation/order_list'
// 协议 —— 隐私权政策
import Privacy from '@/components/privacy/privacy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AppIndex',
      meta: {
        title: '我的九星',
        auth: true
      },
      component: AppIndex
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册',
        auth: false
      },
      component: Register
    },
    {
      path: '/success',
      meta: {
        title: '成功',
        auth: false
      },
      name: 'success',
      component: Success
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
        auth: false
      },
      component: Login
    },
    {
      path: '/invite_code',
      meta: {
        title: '邀请码',
        auth: false
      },
      name: 'InviteCode',
      component: InviteCode
    },
    {
      path: '/forget_phone',
      meta: {
        title: '忘记密码',
        auth: false
      },
      name: 'forgetPhone',
      component: ForgetPhone
    },
    // 微信登陆重定向
    {
      path: '/signture',
      meta: {
        title: '',
        auth: false
      },
      name: 'signture',
      component: signture
    },
    {
      path: '/change_password',
      meta: {
        title: '修改密码',
        auth: false
      },
      name: 'ChangePwd',
      component: ChangePwd
    },
    // 登录后
    {
      path: '/user_index',
      name: 'userInfo',
      meta: {
        title: '我的九星',
        auth: true
      },
      component: UserInfo
    },
    // 我的账号
    {
      path: '/account',
      meta: {
        title: '我的账户',
        auth: true
      },
      name: 'Account',
      component: Account
    },
    {
      path: '/account/agent',
      name: 'Agent',
      meta: {
        title: '经办人',
        auth: true
      },
      component: Agent
    },
    {
      path: '/account/agent_detail',
      name: 'AgentDetail',
      meta: {
        title: '经办人详情',
        auth: true
      },
      component: AgentDetail
    },
    // 人脸识别认证
    {
      path: '/account/face_auth',
      name: 'faceAuth',
      meta: {
        title: '人脸识别',
        auth: true
      },
      component: FaceAuth
    },
    {
      path: '/account/agent_edit',
      name: 'AddAgnet',
      meta: {
        title: '添加经办人',
        auth: true
      },
      component: AddAgnet
    },
    // 验证账户
    {
      path: '/account/auth_account',
      name: 'AuthAccount',
      meta: {
        title: '账号验证',
        auth: true
      },
      component: AuthAaccount
    },
    // 修改账号
    {
      path: '/account/change_account',
      meta: {
        title: '修改账号',
        auth: true
      },
      name: 'ChangeAccount',
      component: ChangeAccount
    },
    // 修改密码
    {
      path: '/account/change_password',
      meta: {
        title: '修改密码',
        auth: true
      },
      name: 'ChangePassword',
      component: ChangePassword
    },
    // 子账号列表
    {
      path: '/account/sub_account',
      name: 'Children',
      meta: {
        title: '我的子账号',
        auth: true
      },
      component: Children
    },
    // 子账号详情
    {
      path: '/account/sub_account/:id',
      name: 'ChildrenDetail',
      meta: {
        title: '子账号',
        auth: true
      },
      component: ChildrenDetail
    },
    {
      path: '/account/sub_account_edit',
      name: 'ChildrenEdit',
      meta: {
        title: '子账号编辑',
        auth: true
      },
      component: ChildrenEdit
    },
    // 消息
    {
      path: '/message',
      meta: {
        title: '我的消息',
        auth: true
      },
      name: 'Message',
      component: Message
    },
    // 消息详情
    {
      path: '/message/:id',
      name: 'MessageDetail',
      meta: {
        title: '消息详情',
        auth: true
      },
      component: MessageDetail
    },
    // 钱包首页
    {
      path: '/wallet',
      meta: {
        title: '我的钱包',
        auth: true
      },
      name: 'Wallet',
      component: Wallet
    },
    // 钱包订单列表
    {
      path: '/wallet/order',
      meta: {
        title: '我的订单',
        auth: true
      },
      name: 'Order',
      component: Order
    },
    // 钱包订单详情
    {
      path: '/wallet/order/:id',
      meta: {
        title: '订单详情',
        auth: true
      },
      name: 'OrderDetail',
      component: OrderDetail
    },
    // 钱包发票列表
    {
      path: '/wallet/invoice',
      name: 'Invoice',
      meta: {
        title: '我的发票',
        auth: true
      },
      component: Invoice
    },
    {
      path: '/wallet/invoice/:id',
      meta: {
        title: '发票详情',
        auth: true
      },
      name: 'InvoiceDetail',
      component: InvoiceDetail
    },
    // 钱包合同
    {
      path: '/wallet/contract',
      meta: {
        title: '我的合同',
        auth: true
      },
      name: 'Contract',
      component: Contract
    },
    {
      path: '/wallet/contract/:id',
      meta: {
        title: '合同详情',
        auth: true
      },
      name: 'ContractDetail',
      component: ContractDetail
    },
    // 充值
    {
      path: '/wallet/invest',
      meta: {
        title: '充值',
        auth: true
      },
      name: 'Invest',
      component: Invest
    },
    // 提现
    {
      path: '/wallet/drawback',
      name: 'Drawback',
      meta: {
        title: '提现',
        auth: true
      },
      component: Drawback
    },
    // 消费记录
    {
      path: '/wallet/record',
      name: 'Record',
      meta: {
        title: '消费记录',
        auth: true
      },
      component: Record
    },
    {
      path: '/check_invoice',
      name: 'CheckInvoice',
      meta: {
        title: '发票查验',
        auth: true
      },
      component: CheckInvoice
    },
    {
      path: '/check_invoice/real',
      name: 'InvoiceReal',
      meta: {
        title: '查验结果',
        auth: true
      },
      component: InvoiceReal
    },
    {
      path: '/check_invoice/fake',
      name: 'InvoiceFake',
      meta: {
        title: '查验结果',
        auth: true
      },
      component: InvoiceFake
    },
    {
      path: '/card',
      name: 'ShowCard',
      meta: {
        title: '名片',
        auth: true
      },
      component: ShowCard
    },
    {
      path: '/cooperation_list',
      name: 'Cooperation',
      meta: {
        title: '协同确认',
        auth: true
      },
      component: Cooperation
    },
    {
      path: '/cooperation/charge',
      name: 'ChargeList',
      meta: {
        title: '单据列表',
        auth: true
      },
      component: ChargeList
    },
    {
      path: '/cooperation/contract',
      name: 'CooContract',
      meta: {
        title: '合同',
        auth: true
      },
      component: CooContract
    },
    {
      path: '/cooperation/order_list',
      name: 'CooOrderlist',
      meta: {
        title: '订单列表',
        auth: true
      },
      component: CooOrderlist
    },
    {
      path: '/cooperation/order',
      name: 'CooperationOrder',
      meta: {
        title: '电子订单',
        auth: true
      },
      component: CooperationOrder
    },
    {
      path: '/cooperation/deposit',
      name: 'CooperationDeposit',
      meta: {
        title: '订金',
        auth: true
      },
      component: CooperationDeposit
    },
    {
      path: '/cooperation/delivery',
      name: 'CooperationDelivery',
      meta: {
        title: '电子出货单',
        auth: true
      },
      component: CooperationDelivery
    },
    {
      path: '/cooperation/waybill',
      name: 'CooperationWaybill',
      meta: {
        title: '运单',
        auth: true
      },
      component: CooperationWaybill
    },
    {
      path: '/cooperation/acceptance',
      name: 'Acceptance',
      meta: {
        title: '验收入库单',
        auth: true
      },
      component: Acceptance
    },
    {
      path: '/cooperation/settlement',
      name: 'Settlement',
      meta: {
        title: '结算',
        auth: true
      },
      component: Settlement
    },
    {
      path: '/cooperation/invoice',
      name: 'invoice',
      meta: {
        title: '发票',
        auth: true
      },
      component: Fainvoice
    },
    {
      path: '/cooperation/payment',
      name: 'payment',
      meta: {
        title: '发票',
        auth: true
      },
      component: Payment
    },
    {
      // 协议
      path: '/privacy',
      name: 'privacy',
      meta: {
        title: '隐私权政策',
        auth: true
      },
      component: Privacy
    }
  ]
})
