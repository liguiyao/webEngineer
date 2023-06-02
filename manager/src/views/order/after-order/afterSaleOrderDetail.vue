<template>
  <div class="search">
    <Card>
      <div class="main-content">
        <div class="div-flow-left">
          <div class="div-form-default">
            <h3>Return goodsApply  </h3>
            <dl>
              <dt>Return goods状态</dt>
              <dd>{{ afterSaleInfo.serviceName }}</dd>
            </dl>
            <dl>
              <dt>Return goodsrefund编号</dt>
              <dd>{{ afterSaleInfo.sn }}</dd>
            </dl>
            <dl>
              <dt>Return goodsrefund原因</dt>
              <dd>{{ afterSaleInfo.reason }}</dd>
            </dl>
            <dl>
              <dt>Apply  refund amount</dt>
              <dd>RM{{ afterSaleInfo.applyRefundPrice | unitPrice }}</dd>
            </dl>
            <dl v-if="afterSaleInfo.actualRefundPrice">
              <dt>real refund amount</dt>
              <dd>RM{{ afterSaleInfo.actualRefundPrice | unitPrice }}</dd>
            </dl>
            <dl v-if="afterSaleInfo.refundPoint">
              <dt>退还积分</dt>
              <dd>{{ afterSaleInfo.refundPoint }}</dd>
            </dl>
            <dl>
              <dt>Return goodsQuantity</dt>
              <dd>{{ afterSaleInfo.num }}</dd>
            </dl>
            <dl>
              <dt>Problem description</dt>
              <dd>{{ afterSaleInfo.problemDesc }}</dd>
            </dl>
            <dl>
              <dt>凭证</dt>
              <dd v-if="afterSaleImage == ''">absent凭证</dd>
              <dd v-else>
                <div class="div-img" v-for="(item, index) in afterSaleImage" :key="index">
                  <img class="complain-img" :src="item" />
                </div>
              </dd>
            </dl>
          </div>

          <div class="div-form-default" v-if="afterSaleInfo.serviceStatus == 'APPLY'">
            <h3>处理意见</h3>
            <dl>
              <dt>商家</dt>
              <dd>
                <div class="div-content">
                  {{ afterSaleInfo.storeName }}
                </div>
              </dd>
            </dl>
            <dl>
              <dt>是否同意</dt>
              <dd>
                <div class="div-content">
                  <RadioGroup
                    type="button"
                    button-style="solid"
                    v-model="params.serviceStatus"
                  >
                    <Radio label="PASS">
                      <span>同意</span>
                    </Radio>
                    <Radio label="REFUSE">
                      <span>拒绝</span>
                    </Radio>
                  </RadioGroup>
                </div>
              </dd>
            </dl>
            <dl>
              <dt>Apply  refund amount</dt>
              <dd>{{ afterSaleInfo.applyRefundPrice | unitPrice("RM") }}</dd>
            </dl>
            <dl>
              <dt>real refund amount</dt>
              <dd>
                <InputNumber :min="0" v-model="params.actualRefundPrice" style="width: 260px" />
              </dd>
            </dl>
            <dl>
              <dt>备注信息</dt>
              <dd>
                <Input
                  v-model="params.remark"
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  clearable
                  style="width: 260px"
                />
              </dd>
            </dl>
            <dl>
              <dd>
                <div style="text-align: right; width: 45%; margin-top: 10px">
                  <Button
                    type="primary"
                    :loading="submitLoading"
                    @click="handleSubmit"
                    style="margin-left: 5px"
                  >
                    Confirm
                  </Button>
                </div>
              </dd>
            </dl>
          </div>
          <div class="div-form-default" v-if="afterSaleInfo.serviceStatus != 'APPLY'">
            <h3>商家处理</h3>
            <dl>
              <dt>商家</dt>
              <dd>
                <div class="div-content">
                  {{ afterSaleInfo.storeName }}
                </div>
              </dd>
            </dl>
            <!-- <dl>
              <dt>审核结果</dt>
              <dd>
                <div class="div-content">
                  <span v-if="params.serviceStatus=='PASS'">
                    审核通过
                  </span>
                  <span v-else>
                    审核拒绝
                  </span>
                </div>

              </dd>
            </dl> -->
            <dl>
              <dt>备注信息</dt>
              <dd>
                {{ afterSaleInfo.auditRemark || "absent备注信息" }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="div-flow-center"></div>
        <div class="div-flow-right">
          <div class="div-form-default">
            <h3>相关Goods交易信息</h3>
            <dl>
              <dt>
                <img :src="afterSaleInfo.goodsImage" height="60px" />
              </dt>
              <dd>
                <div class="div-zoom">
                  <a @click="linkTo(afterSaleInfo.goodsId, afterSaleInfo.skuId)">{{
                    afterSaleInfo.goodsName
                  }}</a>
                  <Poptip trigger="hover" title="扫码在手机中查看" transfer>
                    <div slot="content">
                      <vue-qr
                        :text="wapLinkTo(afterSaleInfo.goodsId, afterSaleInfo.skuId)"
                        :margin="0"
                        colorDark="#000"
                        colorLight="#fff"
                        :size="150"
                      ></vue-qr>
                    </div>
                    <img
                      src="../../../assets/qrcode.svg"
                      style="vertical-align: middle"
                      class="hover-pointer ml_10"
                      width="20"
                      height="20"
                      alt=""
                    />
                  </Poptip>
                </div>
                <div style="color: #999; font-size: 10px">
                  Quantity：x{{ afterSaleInfo.num }}
                </div>
              </dd>
            </dl>
          </div>
          <div class="div-form-default">
            <h3>订单相关信息</h3>
            <dl>
              <dt>订单编号</dt>
              <dd>
                {{ afterSaleInfo.orderSn }}
              </dd>
            </dl>
            <dl v-if="afterSaleInfo.bankDepositName">
              <dt>Bank of account</dt>
              <dd>
                {{ afterSaleInfo.bankDepositName }}
              </dd>
            </dl>
            <dl v-if="afterSaleInfo.bankAccountName">
              <dt>Bank account name</dt>
              <dd>
                {{ afterSaleInfo.bankAccountName }}
              </dd>
            </dl>
            <dl v-if="afterSaleInfo.bankAccountNumber">
              <dt>银行卡号</dt>
              <dd>
                {{ afterSaleInfo.bankAccountNumber }}
              </dd>
            </dl>
          </div>
          <div
            class="div-form-default"
            v-if="
              afterSaleInfo.afterSaleAllowOperationVO &&
              afterSaleInfo.afterSaleAllowOperationVO.refund
            "
          >
            <h3>平台refund</h3>
            <dl>
              <dt>Bank of account</dt>
              <dd>
                {{ afterSaleInfo.bankDepositName }}
              </dd>
            </dl>
            <dl>
              <dt>Bank account name</dt>
              <dd>
                {{ afterSaleInfo.bankAccountName }}
              </dd>
            </dl>
            <dl>
              <dt>银行卡号</dt>
              <dd>
                {{ afterSaleInfo.bankAccountNumber }}
              </dd>
            </dl>
            <dl>
              <dt>备注信息</dt>
              <dd>
                <Input
                  v-model="refundPriceForm.remark"
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  clearable
                  style="width: 260px"
                />
              </dd>
            </dl>
            <dl>
              <dt>operation</dt>
              <dd>
                <Button
                  type="primary"
                  :loading="submitLoading"
                  @click="refundPriceSubmit"
                  style="margin-left: 5px"
                >
                  refund
                </Button>
              </dd>
            </dl>
          </div>
          <div
            class="div-form-default"
            v-if="
              afterSaleInfo.showDelivery && afterSaleInfo.serviceType === 'RETURN_GOODS'
            "
          >
            <h3>logistics information</h3>
            <dl>
              <dt>收货商家</dt>
              <dd>{{ afterSaleInfo.storeName }}</dd>
            </dl>
            <dl>
              <dt>收货商家手机</dt>
              <dd>{{ storeMsg.salesConsigneeMobile }}</dd>
            </dl>
            <dl>
              <dt>Delivery address</dt>
              <dd>
                {{ storeMsg.salesConsigneeAddressPath }}
                {{ storeMsg.salesConsigneeDetail }}
              </dd>
            </dl>
            <dl>
              <dt>Logistics company </dt>
              <dd>{{ afterSaleInfo.mlogisticsName }}</dd>
            </dl>
            <dl>
              <dt>logistics number</dt>
              <dd>
                {{ afterSaleInfo.mlogisticsNo }}
              </dd>
            </dl>
            <dl>
              <dt>operation</dt>
              <dd>
                <Button
                  type="info"
                  :loading="submitLoading"
                  @click="logisticsSeller()"
                  style="margin-left: 5px"
                >
                  查询logistics
                </Button>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
    <!-- 查询logistics -->
    <Modal v-model="logisticsModal" width="40">
      <p slot="header">
        <span>查询logistics</span>
      </p>
      <div class="layui-layer-wrap">
        <dl>
          <dt>After-sales order number：</dt>
          <dd>
            <div class="text-box">{{ sn }}</div>
          </dd>
        </dl>
        <dl>
          <dt>Logistics company ：</dt>
          <dd>
            <div class="text-box">{{ afterSaleInfo.mlogisticsName }}</div>
          </dd>
        </dl>
        <dl>
          <dt>Tracking number：</dt>
          <dd>
            <div class="text-box">{{ afterSaleInfo.mlogisticsNo }}</div>
          </dd>
        </dl>
        <div class="div-express-log">
          <ul class="express-log">
            <template v-if="Object.keys(logisticsInfo).length">
              <li v-for="(item, index) in logisticsInfo.traces" :key="index">
                <span class="time">{{ item.AcceptTime }}</span>
                <span class="detail">{{ item.AcceptStation }}</span>
              </li>
            </template>
            <template v-else>
              <li style="text-align: center">absent logistics information</li>
            </template>
          </ul>
        </div>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="logisticsClose">Cancel</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import * as API_Order from "@/api/order";
import vueQr from "vue-qr";
export default {
  components: {
    "vue-qr": vueQr,
  },
  name: "orderDetail",
  data() {
    return {
      sn: "", // Order number
      logisticsModal: false, //查询logistics模态框

      logisticsInfo: {}, //logistics information
      afterSaleInfo: {}, // after sale信息
      afterSaleImage: [], //会员申诉图片
      submitLoading: false, // 添加或编辑Submit状态
      storeMsg: {}, // 商家address信息
      //商家处理意见
      params: {
        serviceStatus: "PASS",
        remark: "",
      },
      //平台refund
      refundPriceForm: {
        remark: "",
      },
      afterSaleStatusList: [
        // after sale状态列表
        {
          name: "Apply  中",
          status: "APPLY",
        },
        {
          name: "通过",
          status: "PASS",
        },
        {
          name: "拒绝",
          status: "REFUSE",
        },
        {
          name: "买家Return goods，待卖家收货",
          status: "BUYER_RETURN",
        },
        {
          name: "卖家Confirm receipt",
          status: "SELLER_CONFIRM",
        },
        {
          name: "卖家终止after sale",
          status: "SELLER_TERMINATION",
        },
        {
          name: "买家Cancelafter sale",
          status: "BUYER_CANCEL",
        },
        {
          name: "完成after sale",
          status: "COMPLETE",
        },
        {
          name: "等待平台refund",
          status: "WAIT_REFUND",
        },
      ],
    };
  },
  methods: {
    // 获取After-sale details
    getDetail() {
      this.loading = true;
      API_Order.getAfterSaleOrderDetail(this.sn).then((res) => {
        this.loading = false;
        if (res.success) {
          this.afterSaleInfo = res.result;
          this.afterSaleInfo.showDelivery = this.showDelivery(
            this.afterSaleInfo.serviceStatus
          );
          this.afterSaleInfo.serviceName = this.filterOrderStatus(
            this.afterSaleInfo.serviceStatus
          );
          this.afterSaleImage = (res.result.afterSaleImage || "").split(",");
          //Return goodsaddress去掉逗号
          if (this.afterSaleInfo.mconsigneeAddressPath)
            this.afterSaleInfo.mconsigneeAddressPath = this.afterSaleInfo.mconsigneeAddressPath.replaceAll(
              ",",
              " "
            );

          this.$set(
            this.params,
            "actualRefundPrice",
            this.afterSaleInfo.applyRefundPrice
          );
          // 如果显示logistics information，展示商家address
          if (this.afterSaleInfo.showDelivery) {
            API_Order.storeAddress(this.sn).then((resu) => {
              if (resu.success) {
                const obj = resu.result;
                obj.salesConsigneeAddressPath = obj.salesConsigneeAddressPath.replaceAll(
                  ",",
                  ""
                );
                this.storeMsg = obj;
              }
            });
          }
        }
      });
    },
    //平台refund
    refundPriceSubmit() {
      if (this.refundPriceForm.remark == "") {
        this.$Message.error("Please enter refund备注");
        return;
      }
      this.$Modal.confirm({
        title: "确认refund",
        content: "Please 确认refund？",
        loading: true,
        onOk: () => {
          API_Order.refundPrice(this.sn, this.refundPriceForm).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("收款success");
              this.getDetail();
            }
          });
        },
      });
    },
    //查询logistics
    logisticsSeller() {
      this.logisticsModal = true;
      API_Order.getAfterSaleTraces(this.sn).then((res) => {
        if (res.success && res.result != null) {
          this.logisticsInfo = res.result;
        }
      });
    },
    //Closelogistics弹出框
    logisticsClose() {
      this.logisticsModal = false;
    },
    //回复
    handleSubmit() {
      if (this.params.remark == "") {
        this.$Message.error("Please enter 备注信息");
        return;
      }
      if (this.params.actualRefundPrice == "") {
        this.$Message.error("Please enter refund amount");
        return;
      }
      API_Order.afterSaleSellerReview(this.sn, this.params).then((res) => {
        this.submitLoading = false;
        if (res.success) {
          this.$Message.success("审核success");
          this.params.remark = "";
          this.getDetail();
        }
      });
    },
    filterOrderStatus(status) {
      // 获取订单状态中文
      const ob = this.afterSaleStatusList.filter((e) => {
        return e.status === status;
      });
      return ob[0].name;
    },
    // 根据订单状态判断是否显示logistics information
    showDelivery(status) {
      let flag = false;
      this.afterSaleStatusList.forEach((e, index) => {
        // 订单为买家Return goods，待卖家收货之后的状态，并且不是买家Cancelafter sale，展示logistics information
        if (e.status === status && index >= 3 && index !== 6) {
          flag = true;
        }
      });
      return flag;
    },
  },
  mounted() {
    this.sn = this.$route.query.sn;
    this.getDetail();
  },
};
</script>
<style lang="scss">
.ivu-col {
  width: 100% !important;
}
.main-content {
  min-height: 600px;
  padding: 10px;
}

.div-flow-left {
  width: 49%;
  letter-spacing: normal;
  display: inline-block;
  border-right: solid #f5f5f5 1px;

  .div-form-default {
    width: 97%;

    h3 {
      font-weight: 600;
      line-height: 22px;
      background-color: #f5f5f5;
      padding: 6px 0 6px 12px;
      border-bottom: solid 1px #e7e7e7;
    }

    dl {
      font-size: 0;
      line-height: 30px;
      clear: both;
      padding: 0;
      margin: 0;
      border-bottom: dotted 1px #e6e6e6;
      overflow: hidden;
      display: flex;

      dt {
        flex: 2;
        vertical-align: top;
        text-align: right;
        padding: 15px 1% 15px 0;
        margin: 0;
        font-size: 12px;
      }

      dd {
        flex: 10;
        padding: 15px 0 15px 1%;
        margin: 0;
        border-left: 1px solid #f0f0f0;
        font-size: 12px;
      }
    }
  }
}

dl dt {
  width: 100px;
  text-align: right;
}

.div-express-log {
  max-height: 300px;
  border: solid 1px #e7e7e7;
  background: #fafafa;
  overflow-y: auto;
  overflow-x: auto;
}

.express-log {
  margin-right: -10px;
  margin: 5px;
  padding: 10px;
  list-style-type: none;

  .time {
    width: 30%;
    display: inline-block;
    float: left;
  }

  .detail {
    width: 60%;
    margin-left: 30px;
    display: inline-block;
  }

  li {
    line-height: 30px;
  }
}

.layui-layer-wrap {
  dl {
    border-top: solid 1px #f5f5f5;
    margin-top: -1px;
    overflow: hidden;

    dt {
      font-size: 14px;
      line-height: 28px;
      display: inline-block;
      padding: 8px 1% 8px 0;
      color: #999;
    }

    dd {
      font-size: 14px;
      line-height: 28px;
      display: inline-block;
      padding: 8px 0 8px 8px;
      border-left: solid 1px #f5f5f5;

      .text-box {
        line-height: 40px;
        color: #333;
        word-break: break-all;
      }
    }
  }
}

.div-img {
  width: 130px;
  height: 130px;
  text-align: center;
  float: left;
}

.div-flow-center {
  width: 2%;
  display: inline-block;
}

.div-flow-right {
  width: 49%;
  vertical-align: top;
  word-spacing: normal;
  display: inline-block;

  .div-form-default {
    width: 97%;

    h3 {
      font-weight: 600;
      line-height: 22px;
      background-color: #f5f5f5;
      padding: 6px 0 6px 12px;
      border-bottom: solid 1px #e7e7e7;
    }

    dl {
      font-size: 0;
      line-height: 30px;
      clear: both;
      padding: 0;
      margin: 0;
      border-bottom: dotted 1px #e6e6e6;
      overflow: hidden;
      display: flex;
      dt {
        display: inline-block;
        flex: 2;
        vertical-align: top;
        text-align: right;
        padding: 15px 1% 15px 0;
        margin: 0;
        font-size: 12px;
      }

      dd {
        display: inline-block;
        flex: 10;
        padding: 15px 0 15px 1%;
        margin: 0;
        border-left: 1px solid #f0f0f0;
        font-size: 12px;
      }
    }
  }
}

.complain-img {
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>
