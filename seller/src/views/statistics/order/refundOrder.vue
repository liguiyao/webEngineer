<template>
  <div>
    <div class="shop">
      <h3>After-sale details</h3>
      <div class="shop-item">
        <div class="label-item">
          <span>after sale类型</span>
          <span>{{serviceTypeList[res.serviceType]}}</span>
        </div>
        <div class="label-item">
          <span>after sale单状态</span>
          <span>{{serviceStatusList[res.serviceStatus]}}</span>
        </div>

        <div class="label-item">
          <span>refund时间</span>
          <span>{{res.refundTime || 'absent'}}</span>
        </div>
        <div class="label-item">
          <span>Apply  refund amount</span>
          <span>{{res.applyRefundPrice || '0'}}</span>
        </div>
        <div class="label-item">
          <span>商家备注</span>
          <span>{{res.auditRemark || 'absent'}}</span>
        </div>
        <div class="label-item">
          <span>Apply  原因</span>
          <span>{{res.reason || 'absent'}}</span>
        </div>

      </div>
      <div class="shop-item">
        <div class="label-item">
          <span>用户名</span>
          <span>{{res.memberName}}</span>
        </div>
        <div class="label-item">
          <span>store name</span>
          <span>{{res.sellerName}}</span>
        </div>
        <div class="label-item">
          <span>Create time</span>
          <span>{{res.createTime}}</span>
        </div>

      </div>
      <h3>Goods详情</h3>
      <div class="shop-item">

        <div class="goods-item">
          <div class="goods-img">
            <img class="img" :src="res.goodsImage" alt="">
          </div>
          <div class="goods-title">
            <div>{{res.goodsName}}</div>
            <div>{{'x'+res.num}}</div>
            <div class="goods-price">{{res.flowPrice |  unitPrice('RM')}}</div>

          </div>

        </div>
      </div>
      <div class="count-price">
        <div class="label-item">
          <span>real refund amount</span>
          <span class="flowPrice">{{res.flowPrice | unitPrice('RM')}}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      orderStatusList: {
        UNDELIVERED: "待发货",
        UNPAID: "Unpaid",
        PAID: "已付款",
        DELIVERED: "已发货",
        CANCELLED: "已Cancel",
        COMPLETED: "completed",
        TAKE: "completed",
      },
      // after sale类型
      serviceTypeList: {
        CANCEL: "Cancel",
        RETURN_GOODS: "Return goods",
        EXCHANGE_GOODS: "换货",
        RETURN_MONEY: "refund",
      },
      serviceStatusList: {
        APPLY: "Apply  after sale",
        PASS: "通过after sale",
        REFUSE: "拒绝after sale",
        BUYER_RETURN: "买家Return goods，待卖家收货",
        SELLER_RE_DELIVERY: "商家换货/补发",
        SELLER_CONFIRM: "卖家Confirm receipt",
        SELLER_TERMINATION: "卖家终止after sale",
        BUYER_CONFIRM: "买家Confirm receipt",
        BUYER_CANCEL: "买家Cancelafter sale",
        WAIT_REFUND: "等待平台refund",
        COMPLETE: "完成after sale",
      },
    };
  },
  props: ["res"],
};
</script>
<style lang="scss" scoped>
.shop {
  padding: 10px 0;
  background: #fff;
}
.shop-item {
  display: flex;

  flex-wrap: wrap;
}
h3 {
  margin: 20px 16px;
  font-size: 18px;
}
.goods-price {
  font-size: 18px;
  color: red;
}
.goods-item {
  display: flex;
  width: 100%;
  margin: 16px;
}
.count-price {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.flowPrice {
  font-size: 24px;
  color: red;
}
.goods-title {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
}
.img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.label-item {
  margin: 10px 0;
  width: 20%;
  padding: 8px;
  align-items: center;
  font-weight: bold;
  display: flex;
  > span {
    padding: 8px;
  }
}
</style>
