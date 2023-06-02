<template>
  <div class="order-detail" v-if="order.order">
    <card _Title="Order details" :_Size="16"></card>
    <Card
      class="mb_10"
      v-if="
        order.allowOperationVO.pay ||
        order.allowOperationVO.rog ||
        order.allowOperationVO.cancel
      "
    >
      <Button
        type="success"
        @click="goPay(order.order.sn)"
        size="small"
        v-if="order.allowOperationVO.pay"
        >payment</Button
      >
      <Button
        type="info"
        @click="received(order.order.sn)"
        size="small"
        v-if="order.allowOperationVO.rog"
        >Confirm receipt</Button
      >
      <Button
        type="error"
        @click="handleCancelOrder(order.order.sn)"
        v-if="order.allowOperationVO.cancel"
        size="small"
        >Cancel order</Button
      >
    </Card>
    <p class="verificationCode" v-if="order.order.verificationCode">
      Check code：<span>{{ order.order.verificationCode }}</span>
    </p>
    <div class="order-card">
      <p class="global_color fontsize_18">{{ order.orderStatusValue }}</p>
      <p>Order number：{{ order.order.sn }}</p>
      <div style="color: #999" class="operation-time">
        Operating time：{{ order.order.updateTime || order.order.createTime }}
      </div>
      <Steps
        class="progress"
        :current="progressList.length"
        direction="vertical"
      >
        <Step
          :title="progress.message"
          :content="progress.createTime"
          v-for="(progress, index) in progressList"
          :key="index"
        ></Step>
      </Steps>
    </div>
    <div class="order-card" v-if="order.order.deliveryMethod == 'LOGISTICS'">
      <h3>Consignee info</h3>
      <p>receiver：{{ order.order.consigneeName }}</p>
      <p>Phone number：{{ order.order.consigneeMobile | secrecyMobile }}</p>
      <p>
        Delivery address：{{ order.order.consigneeAddressPath | unitAddress }}
        {{ order.order.consigneeDetail }}
      </p>
    </div>
    <div class="order-card" v-if="order.order.deliveryMethod == 'SELF_PICK_UP'">
      <h3>Self-extracting point information</h3>
      <p>name：{{ order.order.storeAddressPath }}</p>
      <p>contact：{{ order.order.storeAddressMobile }}</p>
    </div>
    <div class="order-card">
      <h3>Payment</h3>
      <p>Method：{{ order.paymentMethodValue }}</p>
      <p>State：{{ order.payStatusValue }}</p>
    </div>
    <div class="order-card" v-if="!order.order.verificationCode">
      <h3>Distribution</h3>
      <p>Mode：{{ order.deliveryMethodValue }}</p>
      <p v-if="order.order.deliveryMethod === 'LOGISTICS'">State：{{ order.deliverStatusValue }}</p>
      <p v-if="logistics">
        logistics information：{{ logistics.shipper || "absent logistics info" }}
      </p>
      <p v-if="logistics">
        logistics number：{{ logistics.logisticCode || "absent logistics number" }}
      </p>
      <div class="div-express-log" v-if="logistics">
        <div class="express-log">
          <p>Order log：</p>
          <div v-for="(item, index) in logistics.traces" :key="index">
            <span class="time">{{ item.AcceptTime }}</span>
            <span class="detail">{{ item.AcceptStation }}</span>
          </div>
        </div>
      </div>
    </div>
<!--    <div class="order-card" v-if="order.order.payStatus === 'PAID'">-->
<!--      <h3>发票信息</h3>-->
<!--      <template v-if="order.order.needReceipt">-->
<!--        <p>发票抬头：{{ order.receipt.receiptTitle }}</p>-->
<!--        <p>发票内容：{{ order.receipt.receiptContent }}</p>-->
<!--        <p v-if="order.receipt.taxpayerId">-->
<!--          纳税人识别号：{{ order.receipt.taxpayerId }}-->
<!--        </p>-->
<!--      </template>-->
<!--      <div v-else style="color: #999; margin-left: 5px">未开发票</div>-->
<!--    </div>-->
    <!-- 订单Goods -->
    <div class="goods">
      <div class="shop-name">
        <span @click="shopPage(order.order.storeId)">{{
          order.order.storeName
        }}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th width="40%">Goods</th>
            <th width="20%">Item number</th>
            <th width="10%">Unit price</th>
            <th width="10%">Quantity</th>
            <th width="10%">Subtotal</th>
            <th width="10%">Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(goods, goodsIndex) in order.orderItems" :key="goodsIndex">
            <td>
              <img
                @click="goodsDetail(goods.skuId, goods.goodsId)"
                :src="goods.image"
                alt=""
              />
              <div>
                <p
                  @click="goodsDetail(goods.skuId, goods.goodsId)"
                  class="hover-color"
                >
                  {{ goods.goodsName }}
                </p>
              </div>
            </td>
            <td>{{ goods.id }}</td>
            <td>{{ goods.goodsPrice | unitPrice("RM") }}</td>
            <td>{{ goods.num }}</td>
            <td>{{ (goods.goodsPrice * goods.num) | unitPrice("RM") }}</td>
            <td>
              <Button
                v-if="
                  goods.afterSaleStatus.includes('NOT_APPLIED') ||
                  goods.afterSaleStatus.includes('PART_AFTER_SALE')
                "
                @click="applyAfterSale(goods.sn)"
                type="info"
                size="small"
                class="mb_5"
                >Apply  after sale</Button
              >
              <Button
                v-if="goods.commentStatus == 'UNFINISHED'"
                @click="comment(order.order.sn, goodsIndex)"
                size="small"
                type="success"
                class="fontsize_12 mb_5"
                >Evaluate</Button
              >
              <Button
                v-if="goods.complainStatus == 'NO_APPLY'"
                @click="complain(order.order.sn, goodsIndex)"
                type="warning"
                class="fontsize_12"
                size="small"
                >Complaint</Button
              >
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 订单price -->
      <div class="order-price">
        <div>
          <span>Number：</span><span>{{ order.order.goodsNum }}件</span>
        </div>
        <div>
          <span>Total price：</span
          ><span>{{ order.order.goodsPrice | unitPrice("RM") }}</span
          ><br />
        </div>
        <div>
          <span>freight：</span
          ><span>+{{ order.order.freightPrice | unitPrice("RM") }}</span
          ><br />
        </div>
        <div v-if="order.order.priceDetailDTO.couponPrice">
          <span>coupon：</span
          ><span
            >-{{
              order.order.priceDetailDTO.couponPrice || 0 | unitPrice("RM")
            }}</span
          >
        </div>
        <div v-if="order.order.discountPrice">
          <span>discount：</span
          ><span>-{{ order.order.discountPrice | unitPrice("RM") }}</span>
        </div>
        <div>
          <span>Need pay：</span>
          <span class="actrual-price">{{
            order.order.flowPrice | unitPrice("RM")
          }}</span>
        </div>
      </div>
    </div>
    <Modal
      v-model="cancelAvail"
      title="Please selectCancel order reason"
      @on-ok="sureCancel"
      @on-cancel="cancelAvail = false"
    >
      <RadioGroup
        v-model="cancelParams.reason"
        vertical
        type="button"
        button-style="solid"
      >
        <Radio :label="item.reason" v-for="item in cancelReason" :key="item.id">
          {{ item.reason }}
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>
<script>
import {
  orderDetail,
  getTraces,
  sureReceived,
  cancelOrder,
} from "@/api/order.js";
import { afterSaleReason } from "@/api/member";
export default {
  name: "order-detail",
  data() {
    return {
      order: {}, // Order details数据
      progressList: [], // 订单流程
      logistics: "", // logistics数据
      cancelParams: {
        // Cancelafter sale参数
        orderSn: "",
        reason: "",
      },
      cancelAvail: false, // Cancel ordermodal控制
      cancelReason: [], // Cancel order reason
    };
  },
  methods: {
    goodsDetail(skuId, goodsId) {
      // 跳转Goods详情
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 跳转店铺首页
    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: { id: id },
      });
      window.open(routeUrl.href, "_blank");
    },
    getDetail() {
      // 获取Order details
      orderDetail(this.$route.query.sn).then((res) => {
        if (res.success) {
          this.order = res.result;
          this.progressList = res.result.orderLogs;
          if (this.order.order.deliveryMethod === 'LOGISTICS') {
            this.traces();
          }
        }
      });
    },
    traces() {
      // logistics information
      getTraces(this.$route.query.sn).then((res) => {
        if (res.success) {
          this.logistics = res.result;
        }
      });
    },
    received(sn) {
      // Confirm receipt
      sureReceived(sn).then((res) => {
        if (res.success) {
          this.$Message.success("Confirm receiptsuccess");
          this.getDetail();
        }
      });
    },
    goPay(sn) {
      // payment
      this.$router.push({
        path: "/payment",
        query: { orderType: "ORDER", sn },
      });
    },
    applyAfterSale(sn) {
      // Apply  after sale
      this.$router.push({ name: "ApplyAfterSale", query: { sn: sn } });
    },
    comment(sn, goodsIndex) {
      // Evaluate
      this.$router.push({
        path: "/home/addEval",
        query: { sn, index: goodsIndex },
      });
    },
    complain(sn, goodsIndex) {
      // Complaint
      this.$router.push({ name: "Complain", query: { sn, index: goodsIndex } });
    },
    handleCancelOrder(sn) {
      // Cancel order
      this.cancelParams.orderSn = sn;
      afterSaleReason("CANCEL").then((res) => {
        if (res.success) {
          this.cancelReason = res.result;
          this.cancelAvail = true;
          this.cancelParams.reason = this.cancelReason[0].reason;
        }
      });
    },
    sureCancel() {
      // ConfirmCancel
      cancelOrder(this.cancelParams).then((res) => {
        if (res.success) {
          this.$Message.success("Cancel ordersuccess");
          this.getDetail();
          this.cancelAvail = false;
        }
      });
    },
  },
  mounted() {
    this.getDetail();
  },
};
</script>
<style lang="scss" scoped>
.mb_10 {
  Button:nth-of-type(2) {
    margin-left: 10px;
  }
}

.mb_5 {
  margin-bottom: 5px;
}
.order-card {
  padding: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
  position: relative;
  .global_color {
    color: $theme_color;
  }
  p {
    color: #999;
    margin: 3px;
    margin-left: 5px;
  }
  h3 {
    font-weight: normal;
    font-size: 16px;
  }
  .operation-time {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
/** store name */
.shop-name {
  margin: 15px 0;
  span {
    color: #438cde;
    cursor: pointer;
    &:hover {
      color: $theme_color;
    }
  }
  .ivu-icon {
    color: #ff8f23;
    cursor: pointer;
    &:hover {
      color: $theme_color;
    }
  }
}
/** Goods列表 */
table {
  border: 1px solid #ddd;
  color: #999;
  border-collapse: collapse;
  width: 100%;
  tr {
    border-top: 1px solid #ddd;
  }
  thead > tr {
    height: 40px;
    background: #eee;
  }
  td {
    padding: 5px;
    text-align: center;
    &:first-child {
      text-align: left;
      display: flex;
      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    &:last-child {
      color: $theme_color;
    }
  }
}
/** 订单price */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 16px;
  color: #999;
  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }
  .actrual-price {
    color: $theme_color;
    font-weight: bold;
    font-size: 20px;
  }
}
.verificationCode {
  font-size: 20px;
  margin-bottom: 20px;
  color: rgb(65, 63, 63);
  font-weight: bold;
  text-align: center;
  span {
    color: $theme_color;
  }
}
/** 订单进度条 */
.progress {
  margin: 15px 0;
}
</style>
