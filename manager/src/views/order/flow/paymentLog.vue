<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="100" class="search-form">
          <Form-item label="Order number" prop="sn">
            <Input type="text" v-model="searchForm.sn" placeholder="订单/交易号" clearable style="width: 200px" />
          </Form-item>
          <Form-item label="Payment status" prop="orderStatus">
            <Select v-model="searchForm.payStatus" placeholder="Please select" clearable style="width: 200px">
              <Option value="UNPAID">non-payment</Option>
              <Option value="PAID">paid</Option>
            </Select>
          </Form-item>
          <Form-item label="Method of payment" prop="orderStatus">
            <Select v-model="searchForm.paymentMethod" placeholder="Please select" clearable style="width: 200px">
              <Option value="">All</Option>
              <Option value="WECHAT">Wechat</Option>
              <Option value="ALIPAY">Alipay</Option>
              <Option value="WALLET">Balance</Option>
              <Option value="BANK_TRANSFER">Transfer</Option>

            </Select>
          </Form-item>
          <Form-item label="Order Create time">
            <DatePicker v-model="times" type="datetimerange" format="yyyy-MM-dd HH:mm" clearable @on-change="changeDate" placeholder="select支付时间" style="width: 200px"></DatePicker>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
        </Form>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10"></Table>
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
  name: "paymentLog",
  data() {
    return {
      loading: true, // 表单加载状态
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        sn: "",
        payStatus: "",
        startDate: "", //订单Create time
        endDate: "", //订单结束时间
      },
      times: [], //订单Create time
      columns: [
        {
          title: "Order/Trade Number",
          key: "sn",
          minWidth: 180,
          tooltip: true,
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "Payment method",
          key: "paymentMethod",
          width: 120,
          align: "center",
          render: (h, params) => {
            if (params.row.paymentMethod === "WECHAT") {
              return h("div", [
                h("Tag", { props: { color: "green" } }, "Wechat"),
              ]);
            } else if (params.row.paymentMethod === "ALIPAY") {
              return h("div", [
                h("Tag", { props: { color: "blue" } }, "Alipay"),
              ]);
            } else if (params.row.paymentMethod === "WALLET") {
              return h("div", [
                h("Tag", { props: { color: "geekblue" } }, "Balance payment"),
              ]);
            } else if (params.row.paymentMethod === "BANK_TRANSFER") {
              return h("div", [
                h("Tag", { props: { color: "orange" } }, "Transfer"),
              ]);
            } else {
              return h("div", [h("Tag", {}, "暂Unpaid")]);
            }
          },
        },
        {
          title: "Third party flow",
          key: "receivableNo",
          minWidth: 130,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.receivableNo || "absent number"),
            ]);
          },
        },
        {
          title: "客户端",
          key: "clientType",
          width: 130,
          render: (h, params) => {
            if (
              params.row.clientType === "WECHAT_MP" ||
              params.row.clientType === "App"
            ) {
              return h("div", [h("span", {}, "小程序")]);
            } else if (params.row.clientType === "APP") {
              return h("div", [h("span", {}, "APP")]);
            } else if (params.row.clientType === "PC") {
              return h("div", [h("span", {}, "PC网页")]);
            } else if (
              params.row.clientType === "H5" ||
              params.row.clientType === "wap"
            ) {
              return h("div", [h("span", {}, "移动端")]);
            }
          },
        },
        {
          title: "Payment time",
          key: "paymentTime",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.paymentTime || "absent payment time"),
            ]);
          },
        },
        {
          title: "Order amount",
          fixed: "right",
          key: "flowPrice",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.flowPrice, "RM")
            );
          },
        },
        {
          title: "Payment status",
          key: "payStatus",
          width: 95,
          fixed: "right",
          render: (h, params) => {
            if (params.row.payStatus == "PAID") {
              return h("div", [h("Tag", {props:{color:'green'}}, "paid")]);
            } else {
              return h("div", [h("Tag", {props:{color:'red'}}, "non-payment")]);
            }
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
      this.getDataList();
    },
    // 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 改变页数
    changePageSize(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    changeDate(val) {
      // 改变日期格式
      this.searchForm.startDate = val[0];
      this.searchForm.endDate = val[1];
    },
    // 获取列表
    getDataList() {
      this.loading = true;
      API_Order.paymentLog(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

