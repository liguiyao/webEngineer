<template>
  <div class="wrapper">
    <div class="shop">
      <h3>Order details</h3>
      <div class="shop-item">
        <div class="label-item">
          <span>订单来源</span>
          <span>{{ res.clientType | clientTypeWay }}</span>
        </div>
        <div class="label-item">
          <span>订单状态</span>
          <span>{{ orderStatusList[res.orderStatus] }}</span>
        </div>
        <div class="label-item">
          <span>付款状态</span>
          <span>{{
            res.payStatus == "UNPAID"
              ? "Unpaid"
              : res.payStatus == "PAID"
              ? "已付款"
              : ""
          }}</span>
        </div>
        <div class="label-item">
          <span>支付时间</span>
          <span>{{ res.paymentTime || "absent" }}</span>
        </div>
        <div class="label-item">
          <span>支付方式</span>
          <span
            >{{ res.paymentMethod == "ONLINE" ? "在线支付" : ""
            }}{{
              res.paymentMethod == "ALIPAY"
                ? "Alipay"
                : res.paymentMethod == "BANK_TRANSFER"
                ? "银行卡"
                : "" || "absent"
            }}</span
          >
        </div>
      </div>
      <div class="shop-item">
        <div class="label-item">
          <span>用户名</span>
          <span>{{ res.memberName }}</span>
        </div>
        <div class="label-item">
          <span>store name</span>
          <span>{{ res.storeName }}</span>
        </div>
        <div class="label-item">
          <span>Create time</span>
          <span>{{ res.createTime }}</span>
        </div>
      </div>
      <h3>Goods详情</h3>
      <div class="shop-item">
        <div
          class="goods-item"
          @click="handleClickGoods(item.goodsId)"
          v-for="(item, index) in res.orderItems"
          :key="index"
        >
          <div class="goods-img">
            <img class="img" :src="item.image" alt="" />
          </div>
          <div class="goods-title">
            <div>{{ item.name }}</div>
            <div>{{ "x" + item.num }}</div>
            <div class="goods-price">{{ res.flowPrice | unitPrice("RM") }}</div>
          </div>
        </div>
      </div>
      <div class="count-price">
        <div class="label-item">
          <span>总price</span>
          <span class="flowPrice">{{ res.flowPrice | unitPrice("RM") }}</span>
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
        // 订单状态
        UNDELIVERED: "待发货",
        UNPAID: "Unpaid",
        PAID: "已付款",
        DELIVERED: "已发货",
        CANCELLED: "已Cancel",
        COMPLETED: "completed",
        TAKE: "completed",
      },
    };
  },
  props: ["res"],
  methods: {
    handleClickGoods(id) {
      this.$router.push({
        query: { id },
        path: "/goods/goods-info/goodsDetail",
      });
    },
  },
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
  cursor: pointer;
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
  width: 33%;
  padding: 8px;
  align-items: center;
  font-weight: bold;
  display: flex;
  > span:nth-child(1) {
    width: 70px;
    color: #999;
  }
}
</style>
