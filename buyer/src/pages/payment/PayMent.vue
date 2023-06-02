<template>
  <div class="wrapper">
    <BaseHeader></BaseHeader>
    <div class="wrapper-head">
      <div class="head-left">
        <div class="left-tips">Order Submit success，Please payment ！</div>
        <div class="left-tips-time">Please payment，otherwise the order will be automatic Cancel</div>
        <div class="left-tips-count-down">
          <mv-count-down :startTime="startTime" class="count-down"
            :endTime="endTime"
            :endText="endText"
            :dayTxt="'days'"
            :hourTxt="'hours'"
            :minutesTxt="'minutes'"
            :secondsTxt="'seconds'"
            :isStart="isStart"></mv-count-down>

        </div>
      </div>
      <div class="head-right">
        <div>Amount payable <span class="price">{{ payDetail.price | unitPrice }}</span>ringgit</div>
      </div>
    </div>
    <div class="wrapper-box">
      <div v-if="support.includes('ALIPAY')" class="-box-item" @click="handlePay('ALIPAY')">
        <img
          src="https://ss3.bdstatic.com/yrwDcj7w0QhBkMak8IuT_XF5ehU5bvGh7c50/logopic/a9936a369e82e0c6c42112674a5220e8_fullsize.jpg"
          alt="">
        <span>Alipay</span>
      </div>
      <div v-if="support.includes('WECHAT')" class="-box-item" @click="handlePay('WECHAT')">
        <img
          src="https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=3774939867,2826752539&fm=74&app=80&f=JPEG&size=f121,121?sec=1880279984&t=796e842a5ef2d16d9edc872d6f1147ef"
          alt="">
        <span>Wechat</span>
      </div>
      <div v-if="support.includes('WALLET') && $route.query.orderType !== 'RECHARGE'" class="-box-item" @click="handlePay('WALLET')">
        <Icon custom="icomoon icon-wallet" size="60"/>
        <span>Balance payment</span>
        <span>Current balance({{ walletValue | unitPrice('RM') }})</span>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>

import {tradeDetail, pay} from '@/api/pay.js';
import MvCountDown from 'mv-count-down'
import {Message} from 'view-design';

export default {
  components: {
    MvCountDown
  },
  data () {
    return {
      payDetail: {}, // 支付详情
      support: [], // 支持Distribution mode
      walletValue: 0, // 当前余额
      qrcode: '', // 支付二维码
      startTime: new Date().getTime(), // 开始时间（时间戳）
      endTime: 0, // 完成的时间（时间戳）
      endText: 'order has timed out cancel', // 倒计时完成的Tips文本
      isStart: false // 控制倒计时开始的时机（异步Please 求完成Opening）
    };
  },
  methods: {
    // 获取Order details
    getTradeDetail () {
      const params = this.$route.query;
      params.clientType = 'PC'
      tradeDetail(params).then(res => {
        if (res.success) {
          this.payDetail = res.result;
          this.endTime = this.payDetail.autoCancel
          this.isStart = true
          this.support = this.payDetail.support
          this.walletValue = this.payDetail.walletValue
        }
      });
    },
    // 支付
    handlePay (way) {
      // Balance payment则直接跳转
      if (way === 'WALLET') {
        // 如果待支付金额大于余额，则报错
        if (this.payDetail.price > this.walletValue) {
          Message.error('The balance is not enough to cover the current order. Please go to the Member Center if you need to recharge');
          return;
        }
      }
      const params = this.$route.query;
      params.paymentMethod = way;
      params.paymentClient = 'NATIVE';
      params.price = this.payDetail.price;
      if (way === 'WALLET') {
        this.$Modal.confirm({
          title: 'Payment confirmation',
          content: '<p>Confirm use balance payment？</p>',
          onOk: () => {
            pay(params).then(res => {
              if (res.success) {
                this.$Message.warning(res.message)
                this.$router.push('/payDone');
              } else {
                this.$Message.warning(res.message)
              }
            })
          }
        });
      } else {
        this.$router.push({path: '/qrpay', query: params});
      }
    }
  },
  mounted () {
    this.getTradeDetail();
  }
};
</script>
<style scoped lang="scss">
.head-left {
  font-weight: bold;
}

.left-tips {
  font-size: 21px;

}
.-box-item {
  display: flex;
  font-size: 18px;
  font-weight: bold;
  align-items: center;
  margin: 20px 20px;
  cursor: pointer;
  @include content_color($light_content_color);

  &:hover {
    color: $theme_color;
  }

  > span {
    margin-left: 15px;
  }

  > img {
    border-radius: 10px;
    width: 60px;
    height: 60px;
  }
}

.left-tips-time {
  font-size: 16px;
}

.left-tips-count-down {
  font-size: 10px;
  color: red;
}

.wrapper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.75;
}

.wrapper-head,
.wrapper-box {
  padding: 20px 40px;
  width: 1200px;
  margin: 20px auto;
}

.wrapper-box {
  @include white_background_color();
  height: auto;
}

.wrapper {
  width: 100%;
  height: 100%;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: $theme_color;
}

.head-right {
  font-weight: bold;
  font-size: 18px;
}
.count-down{
  font-size: 16px!important;
}
</style>
