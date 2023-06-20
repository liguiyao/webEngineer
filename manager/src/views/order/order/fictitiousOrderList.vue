<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="Order number" prop="orderSn">
            <Input type="text" v-model="searchForm.orderSn" placeholder="Please enter Order number" clearable style="width: 200px" />
          </Form-item>
          <Form-item label="Member name" prop="buyerName">
            <Input type="text" v-model="searchForm.buyerName" placeholder="Please enter Member name" clearable style="width: 200px" />
          </Form-item>
          <Form-item label="Order status" prop="orderStatus">
            <Select v-model="searchForm.orderStatus" placeholder="Please select" clearable style="width: 200px">
              <Option value="NEW">New Order</Option>
              <Option value="CONFIRM">Confirm</Option>
              <Option value="TAKE">Verify</Option>
              <Option value="COMPLETE">completed</Option>
              <Option value="WAIT_PINTUAN">Wait</Option>
              <Option value="CANCELLED">Cancel</Option>
            </Select>
          </Form-item>
          <Form-item label="Time">
            <DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd" clearable
              @on-change="selectDateRange" placeholder="select start time" style="width: 200px"></DatePicker>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>

        </Form>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10" sortable="custom"
        @on-sort-change="changeSort"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
          @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small" show-total show-elevator
          show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import * as API_Order from "@/api/order";

export default {
  name: "fictitiousOrderList",
  data () {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "", // default排序字段
        order: "", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        orderType: "VIRTUAL",
        orderSn: "",
        buyerName: "",
        orderStatus: ""
      },

      selectDate: null, // Time
      columns: [
        {
          title: "Order number",
          key: "sn",
          minWidth: 230,
          tooltip: true
        },
        {
          title: "Time",
          key: "createTime",
          width: 200,
        },
        {
          title: "source",
          key: "clientType",
          width: 95,
          render: (h, params) => {
            if (params.row.clientType == "H5") {
              return h("div", {}, "移动端");
            } else if (params.row.clientType == "PC") {
              return h("div", {}, "PC");
            } else if (params.row.clientType == "WECHAT_MP") {
              return h("div", {}, "小程序端");
            } else if (params.row.clientType == "APP") {
              return h("div", {}, "移动应用端");
            } else {
              return h("div", {}, params.row.clientType);
            }
          },
        },
        {
          title: "Buyer",
          key: "memberName",
          width: 130,
        },
        {
          title: "Amount",
          key: "flowPrice",
          minWidth: 120,
          sortable: true,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.flowPrice, "RM")
            );
          },
        },

        {
          title: "Status",
          key: "orderStatus",
          width: 95,
          render: (h, params) => {
            if (params.row.orderStatus == "UNPAID") {
              return h("div", [h("tag", { props: { color: "magenta" } }, "Unpaid")]);
            } else if (params.row.orderStatus == "PAID") {
              return h("div", [h("tag", { props: { color: "blue" } }, "Paid")]);
            } else if (params.row.orderStatus == "COMPLETED") {
              return h("div", [h("tag", { props: { color: "green" } }, "completed")]);
            } else if (params.row.orderStatus == "TAKE") {
              return h("div", [h("tag", { props: { color: "volcano" } }, "待核验")]);
            } else if (params.row.orderStatus == "CANCELLED") {
              return h("div", [h("tag", { props: { color: "red" } }, "Cancel")]);
            }
          }
        },

        {
          title: "operation",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",

                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  attrs: {
                    disabled: params.row.orderStatus == "UNPAID" ? false : true,
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.confirmPrice(params.row);
                    },
                  },
                },
                "收款"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.detail(params.row);
                    },
                  },
                },
                "View"
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
    init () {
      this.getDataList();
    },
    // 分Page 改变Page码
    changePage (v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分Page 改变Page数
    changePageSize (v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch () {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // 列表排序
    changeSort (e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    // 起止时间从新赋值
    selectDateRange (v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取列表数据
    getDataList () {
      this.loading = true;
      API_Order.getOrderList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    //确认收款
    confirmPrice (v) {
      this.$Modal.confirm({
        title: "确认收款",
        content: "您Confirm要收款吗？",
        loading: true,
        onOk: () => {
          API_Order.orderPay(v.sn).then(res => {
            if (res.success) {
              this.$Message.success("收款success")
              this.getDataList()
            }
            this.$Modal.remove();
          })
        },
      });

    },
    // Order details
    detail (v) {
      console.log(v.orderType);
      let sn = v.sn;
      this.$router.push({
        name: "order-detail",
        query: { sn: sn, orderType: v.orderType },
      });

    },
  },
  mounted () {
    this.init();
  },
};
</script>
