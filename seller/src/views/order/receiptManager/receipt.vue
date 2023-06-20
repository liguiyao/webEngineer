<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="订单编号" prop="orderSn">
          <Input type="text" v-model="searchForm.orderSn" clearable placeholder="Please enter 订单编号" style="width: 200px" />
        </Form-item>
        <Form-item label="Member name" prop="memberName">
          <Input type="text" v-model="searchForm.memberName" clearable placeholder="Please enter Member name" style="width: 200px" />
        </Form-item>
        <Form-item label="发票抬头" prop="receiptTitle">
          <Input type="text" v-model="searchForm.receiptTitle" clearable placeholder="Please enter 发票抬头" style="width: 200px" />
        </Form-item>
        <Form-item label="state" prop="receiptStatus">
          <Select v-model="searchForm.receiptStatus" placeholder="Please select" clearable style="width: 200px">
            <Option :value="0">未开票</Option>
            <Option :value="1">已开票</Option>
          </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
        <Button @click="handleReset" class="search-btn">reset</Button>
      </Form>
      <Table class="mt_10" :loading="loading" border :columns="columns" :data="data" ref="table">
        <!-- Order details格式化 -->
        <template slot="orderSlot" slot-scope="scope">
          <a @click="$router.push({name: 'order-detail',query: {sn: scope.row.orderSn}})">{{scope.row.orderSn}}</a>
        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small"
          show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import * as API_Order from "@/api/order";

export default {
  name: "receipt",
  data() {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        receiptStatus: "", // 发票state
      },
      columns: [
        {
          title: "Order number",
          key: "orderSn",
          minWidth: 120,
          slot: "orderSlot",
        },
        {
          title: "Member name",
          key: "memberName",
          minWidth: 90,
          tooltip: true,
        },

        {
          title: "发票抬头",
          key: "receiptTitle",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h("div", params.row.receiptTitle || "暂未enter ");
          },
        },
        {
          title: "纳税人识别号",
          key: "taxpayerId",
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            return h("div", params.row.taxpayerId || "暂未enter ");
          },
        },
        {
          title: "发票内容",
          key: "receiptContent",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h("div", params.row.receiptContent || "暂未enter ");
          },
        },
        {
          title: "发票金额",
          key: "billPrice",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.receiptPrice, "RM")
            );
          },
        },
        {
          title: "发票state",
          key: "receiptStatus",
          width: 100,
          tooltip: true,
          render: (h, params) => {
            if (params.row.receiptStatus === 0) {
              return h("div", [
                h("tag", { props: { color: "volcano" } }, "未开票"),
              ]);
            } else {
              return h("div", [
                h("tag", { props: { color: "green" } }, "已开票"),
              ]);
            }
          },
        },
        {
          title: "Status",
          key: "orderStatus",
          width: 100,
          render: (h, params) => {
            if (params.row.orderStatus == "UNPAID") {
              return h("div", [
                h("tag", { props: { color: "magenta" } }, "Unpaid"),
              ]);
            } else if (params.row.orderStatus == "PAID") {
              return h("div", [
                h("tag", { props: { color: "blue" } }, "Paid"),
              ]);
            } else if (params.row.orderStatus == "UNDELIVERED") {
              return h("div", [
                h("tag", { props: { color: "geekblue" } }, "待发货"),
              ]);
            } else if (params.row.orderStatus == "DELIVERED") {
              return h("div", [
                h("tag", { props: { color: "cyan" } }, "已发货"),
              ]);
            } else if (params.row.orderStatus == "COMPLETED") {
              return h("div", [
                h("tag", { props: { color: "green" } }, "completed"),
              ]);
            } else if (params.row.orderStatus == "TAKE") {
              return h("div", [
                h("tag", { props: { color: "volcano" } }, "待核验"),
              ]);
            } else if (params.row.orderStatus == "CANCELLED") {
              return h("div", [
                h("tag", { props: { color: "red" } }, "Cancel"),
              ]);
            }
          },
        },

        {
          title: "operation",
          key: "action",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  attrs: {
                    disabled:
                      !(
                        (params.row.orderStatus === "COMPLETED"
                          ||params.row.orderStatus === "DELIVERED")

                        &&
                        params.row.receiptStatus === 0),
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.invoicing(params.row);
                    },
                  },
                },
                "开票"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getData();
    },
    // 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getData();
    },
    // 改变Page数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getData();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getData();
    },
    // resetsearchitems件
    handleReset() {
      this.searchForm = {};
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getData();
    },
    // 时间段从新赋值
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取数据
    getData() {
      this.loading = true;
      API_Order.getReceiptPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    //开发票
    invoicing(params) {
      this.$Modal.confirm({
        title: "确认开票",
        content: "您确认已经开具发票 ?",
        loading: true,
        onOk: () => {
          API_Order.invoicing(params.id).then((res) => {
            if (res.success) {
              this.$Message.success("开票success");
            }
            this.$Modal.remove();
            this.getData();
          });
        },
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss">
// 建议引入通用样式 可delete下面样式代码
@import "@/styles/table-common.scss";
</style>
