<template>
  <div class="bill-detail">
    <Card>
      <p slot="title">商家信息</p>
      <div class="flex flex_align_item">
        <p>store name：{{ bill.storeName }}</p>
        <p>Bank account name：{{ bill.bankAccountName }}</p>
        <p>Bank account：{{ bill.bankAccountNumber }}</p>
        <p>Opening bank支行名称：{{ bill.bankName }}</p>
        <p>Branch bank number：{{ bill.bankCode }}</p>
      </div>
    </Card>
    <Card class="mt_10">
      <p slot="title">账单详细</p>

      <div class="tips-status">
        <span>账单state</span>

        <span class="theme_color">{{
          bill.billStatus | unixSellerBillStatus
        }}</span>

        <Button v-if="bill.billStatus == 'OUT'" size="mini" @click="reconciliation()" type="primary">对账</Button>
      </div>
      <table>
        <tbody>
          <tr v-for="(item,index) in data" :key="index">
            <td>{{item.name}}</td>
            <td>{{item.value}}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <h3 class="ml_10">结算详细</h3>
        <div class="bill-detail-price">
          <div class="flex bill-item">
            <span>
              <p>退单金额</p>
              <p class="theme_color">-{{bill.refundPrice || 0 | unitPrice('RM')}}</p>
            </span>
            <span>
              <p>平台收取佣金</p>
              <p class="theme_color">-{{bill.commissionPrice || 0 | unitPrice('RM')}}</p>
            </span>
            <span>
              <p>分销返现支出</p>
              <p class="theme_color">-{{bill.distributionCommission || 0  | unitPrice('RM')}}</p>
            </span>
            <span>
              <p>退单平台coupon补贴返还</p>
              <p class="theme_color">-{{bill.siteCouponRefundCommission || 0  | unitPrice('RM')}}</p>
            </span>
             </div>
            <div class="flex bill-item">
            <span>
              <p>平台coupon补贴</p>
              <p class="increase-color">+{{bill.siteCouponCommission || 0  | unitPrice('RM')}}</p>
            </span>
              <span>
        		    <p>退单产生退还佣金金额</p>
        		    <p class="increase-color">+{{bill.refundCommissionPrice || 0  | unitPrice('RM')}}</p>
        		  </span>
        		  <span>
        		    <p>退单分销返现返还</p>
        		    <p class="increase-color">+{{bill.distributionRefundCommission || 0  | unitPrice('RM')}}</p>
        		  </span>
            <span>
              <p>积分结算金额</p>
              <p class="increase-color">+{{bill.pointSettlementPrice || 0  | unitPrice('RM')}}</p>
            </span>
            <span>
              <p>砍价Goods结算金额</p>
              <p class="increase-color">+{{bill.kanjiaSettlementPrice || 0  | unitPrice('RM')}}</p>
            </span>
            </div>
          </div>
        </div>
    </Card>
    <Card class="mt_10">
      <Tabs active-key="tab" type="card" @on-click="clickTabs">
        <Tab-pane label="订单列表" name="order">
          <Table :loading="loading" border :columns="orderColumns" :data="orderData" ref="table"></Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page :current="orderParam.pageNumber" :total="orderTotal" :page-size="orderParam.pageSize" @on-change="orderChangePage" @on-page-size-change="orderChangePageSize" size="small" show-total
              show-elevator></Page>
          </Row>
        </Tab-pane>
        <Tab-pane label="退单列表" name="refund">
          <Table :loading="loading" border :columns="refundColumns" :data="refundData" ref="table"></Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page :current="refundParam.pageNumber" :total="refundTotal" :page-size="refundParam.pageSize" @on-change="refundChangePage" @on-page-size-change="refundChangePageSize" size="small"
              show-total show-elevator></Page>
          </Row>
        </Tab-pane>
        <Tab-pane label="分销费用列表" name="distribution">
          <Table :loading="loading" border :columns="distributionColumns" :data="distributionData" ref="table"></Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page :current="distributionParam.pageNumber" :total="distributionTotal" :page-size="distributionParam.pageSize" @on-change="distributionChangePage"
              @on-page-size-change="distributionChangePageSize" size="small" show-total show-elevator></Page>
          </Row>
        </Tab-pane>
      </Tabs>
    </Card>
  </div>
</template>
<script>
import * as filters from "@/utils/filters";
import * as API_Shop from "@/api/shops";
export default {
  name: "bill-detail",
  data() {
    return {
      loading: true,
      columns: [
        {
          title: "项目",
          key: "name",
          width: 250,
        },
        {
          title: "值",
          key: "value",
        },
      ],
      data: [
        // 账单数据
        {
          name: "计算中",
          value: 0,
        },
        {
          name: "计算中",
          value: 0,
        },
        {
          name: "计算中",
          value: 0,
        },
        {
          name: "计算中",
          value: 0,
        },
        {
          name: "计算中",
          value: 0,
        },
        {
          name: "计算中",
          value: 0,
        },

        {
          name: "计算公式",
          value: 0,
        },
        {
          name: "计算公式",
          value: 0,
        },
      ],
      id: "", // 账单id
      bill: {}, // 商家信息
      orderParam: {
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "id", // default排序字段
        order: "desc", // default排序方式
        flowType: "PAY",
      },
      orderColumns: [
        {
          title: "入账时间",
          key: "createTime",
        },
        {
          title: "订单编号",
          key: "orderSn",
        },
        {
          title: "Amount",
          key: "finalPrice",
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.finalPrice, "RM")
            );
          },
        },
        {
          title: "砍价Goods结算price",
          key: "kanjiaSettlementPrice",
          render: (h, params) => {
            if (params.row.kanjiaSettlementPrice) {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.kanjiaSettlementPrice,
                  "RM"
                )
              );
            } else {
              return h("div", "RM0.00");
            }
          },
        },
        {
          title: "积分Goods结算price",
          key: "pointSettlementPrice",
          render: (h, params) => {
            if (params.row.pointSettlementPrice) {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.pointSettlementPrice,
                  "RM"
                )
              );
            } else {
              return h("div", "RM0.00");
            }
          },
        },
        {
          title: "平台分佣",
          key: "commissionPrice",
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.commissionPrice, "RM")
            );
          },
        },
        {
          title: "平台coupon",
          key: "siteCouponPrice",
          render: (h, params) => {
            if (params.row.siteCouponPrice == null) {
              return h("div", "-");
            } else {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.siteCouponPrice,
                  "RM"
                )
              );
            }
          },
        },
		{
		  title: "平台coupon补贴金额",
		  key: "siteCouponCommission",
		  render: (h, params) => {
		    if(params.row.siteCouponCommission == null){
		      return h(
		        "div",
		        "-"
		      );
		    }else{
		      return h(
		        "div",
		        this.$options.filters.unitPrice(params.row.siteCouponCommission, "RM")
		      );
		    }

		  },
		},
        {
          title: "分销金额",
          key: "distributionRebate",
          render: (h, params) => {
            if (params.row.distributionRebate == null) {
              return h("div", "-");
            } else {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.distributionRebate,
                  "RM"
                )
              );
            }
          },
        },
        {
          title: "应结金额",
          key: "billPrice",
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.billPrice, "RM")
            );
          },
        },
      ],
      orderData: [], // 订单列表
      orderTotal: 0, // 订单Quantity
      //退单部分
      refundParam: {
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "id", // default排序字段
        order: "desc", // default排序方式
        flowType: "REFUND",
      },
      refundColumns: [
        {
          title: "refund时间",
          key: "createTime",
          minWidth: 120,
        },
        {
          title: "refund流水编号",
          key: "sn",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "订单编号",
          key: "orderSn",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "after sale编号",
          key: "refundSn",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "refund amount",
          key: "finalPrice",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.finalPrice, "RM")
            );
          },
        },
        {
          title: "退还佣金",
          key: "commissionPrice",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.commissionPrice) {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.commissionPrice,
                  "RM"
                )
              );
            } else {
              return h("div", this.$options.filters.unitPrice(0, "RM"));
            }
          },
        },

        {
          title: "退还平台coupon",
          key: "siteCouponCommission",
          minWidth: 140,
        },
        {
          title: "退还分销",
          key: "distributionRebate",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.distributionRebate == null) {
              return h("div", "-");
            } else {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.distributionRebate,
                  "RM"
                )
              );
            }
          },
        },

        {
          title: "合计金额",
          key: "billPrice",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.billPrice == null) {
              return h("div", "-");
            } else {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.billPrice, "RM")
              );
            }
          },
        },
      ],
      refundData: [], // 退单数据
      refundTotal: 0, // 退单Quantity
      //分销佣金部分
      distributionParam: {
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "id", // default排序字段
        order: "desc", // default排序方式
      },
      distributionColumns: [
        {
          title: "订单编号",
          key: "sn",
          minWidth: 120,
        },
        {
          title: "交易金额",
          key: "finalPrice",
          minWidth: 120,
        },
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "规格",
          key: "finalPrice",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.finalPrice, "RM")
            );
          },
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 120,
        },

        {
          title: "佣金",
          key: "distributionRebate",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.flowType === "refund") {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  "-" + params.row.distributionRebate,
                  "RM"
                )
              );
            } else {
              if (params.row.distributionRebate) {
                return h(
                  "div",
                  this.$options.filters.unitPrice(
                    params.row.distributionRebate,
                    "RM"
                  )
                );
              } else {
                return h("div", this.$options.filters.unitPrice(0, "RM"));
              }
            }
          },
        },
        {
          title: "时间",
          key: "createTime",
          minWidth: 120,
        },
      ],
      distributionData: [], // 分销数据
      distributionTotal: 0, // 分销总数
    };
  },
  watch: {
    "$route.query.id": function (val) {
      this.id = val;
      this.getBill();
    },
  },
  methods: {
    clickTabs(v) {
      if (v == "order") {
        this.orderParam.flowType = "PAY";
        this.getOrderList();
      } else if (v === "refund") {
        this.orderParam.flowType = "REFUND";
        this.getRefundList();
      } else {
        this.getDistributionList();
      }
    },
    //核对结算单
    reconciliation() {
      this.$Modal.confirm({
        title: "确认核对结算单",
        // 记得确认modify此处
        content: "您确认要核对此结算单么?",
        loading: true,
        onOk: () => {
          API_Shop.reconciliation(this.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("账单核对success");
              this.init();
            }
          });
        },
      });
    },

    init() {
      this.id = this.$route.query.id;
      this.getBill();
    },
    //订单列表部分
    orderChangePage(v) {
      this.orderParam.pageNumber = v;
      this.getOrderList();
    },
    orderChangePageSize(v) {
      this.orderParam.pageSize = v;
      this.getOrderList();
    },
    getOrderList() {
      API_Shop.getSellerFlow(this.id, this.orderParam).then((res) => {
        if (res.success) {
          this.loading = false;
          this.orderData = res.result.records;
          this.orderTotal = res.result.total;
        }
      });
    },
    //退单部分
    refundChangePage(v) {
      this.refundParam.pageNumber = v;
      this.getRefundList();
    },
    refundChangePageSize(v) {
      this.refundParam.pageSize = v;
      this.getRefundList();
    },
    getRefundList() {
      API_Shop.getSellerFlow(this.id, this.refundParam).then((res) => {
        this.loading = false;
        if (res.result) {
          this.refundData = res.result.records;
          this.refundTotal = res.result.total;
        }
      });
    },
    //分销费用列表
    distributionChangePage(v) {
      this.distributionParam.pageNumber = v;
      this.getDistributionList();
    },
    distributionChangePageSize(v) {
      this.distributionParam.pageSize = v;
      this.getDistributionList();
    },
    getDistributionList() {
      API_Shop.getDistributionFlow(this.id, this.distributionParam).then(
        (res) => {
          this.loading = false;
          if (res.result) {
            this.distributionData = res.result.records;
            this.distributionTotal = res.result.total;
          }
        }
      );
    },
    //获取结算单详细
    getBill() {
      API_Shop.getBillDetail(this.id).then((res) => {
        if (res.success) {
          this.bill = res.result;
          //初始化表格
          this.initTable();
          //初始化order information
          this.getOrderList();
        }
      });
    },
    // 账单详细
    initTable() {
      let bill = this.bill;
      this.data[0].name = "结算单号";
      this.data[0].value = bill.sn;

      this.data[1].name = "起止日期";
      this.data[1].value = bill.startTime + "~" + bill.endTime;

      this.data[2].name = "出帐日期";
      this.data[2].value = bill.createTime;

      this.data[3].name = "当前state";
      this.data[3].value = filters.unixSellerBillStatus(bill.billStatus);

      this.data[4].name = "当前店铺";
      this.data[4].value = bill.storeName;

      this.data[5].name = "平台打款时间";
      this.data[5].value = bill.payTime === null ? "Unpaid" : bill.payTime;

      this.data[6].name = "Order pay总金额";
      this.data[6].value = filters.unitPrice(
        bill.orderPrice ? bill.orderPrice : 0,
        "¥"
      );
      this.data[7].name = "结算金额";
      this.data[7].value = filters.unitPrice(
        bill.billPrice ? bill.billPrice : 0,
        "¥"
      );
    },
  },
  mounted() {
    this.init();
  },
  // 如果是从详情PageBack列表Page，modify列表PagekeepAlive为true，确保不刷新Page面
  beforeRouteLeave(to, from, next) {
    if (to.name === "accountStatementBill" || to.name === "storeBill") {
      to.meta.keepAlive = true;
    }
    next();
  },
};
</script>

<style scoped lang="scss">
.flex {
  justify-content: space-between;
  flex-wrap: wrap;
  > p {
    width: 50%;
    margin: 15px 0;
  }
}
.page {
  margin-top: 10px;
}
.tips-status {
  padding: 10px;
  font-size: 14px;
  > span {
    font-weight: bold;
    margin-right: 8px;
  }
  > span:nth-of-type(2) {
    color: $theme_color;
  }
}
table {
  font-size: 14px;
  margin-left: 20px;
  tr {
    height: 40px;
    padding: 10px;
    td:nth-child(1) {
      width: 120px;
    }
  }
}
.bill-detail-price {
  width: 1200px;
  margin: 10px 0;
  padding: 10px;
  /deep/ span {
    font-size: 14px;
    text-align: center;
    width: 200px;
    margin-bottom: 10px;
  }
  .theme_color {
    color: $theme_color;
  }
  .increase-color {
    color: green;
  }
  div{

  margin: 20px 0;
  }
}
.bill-item{
  justify-content: flex-start;
}
</style>
