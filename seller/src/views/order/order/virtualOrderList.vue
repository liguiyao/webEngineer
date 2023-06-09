<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="订单编号" prop="orderSn">
          <Input type="text" v-model="searchForm.orderSn" clearable placeholder="Please enter 订单编号" style="width: 160px" />
        </Form-item>
        <Form-item label="Member name" prop="buyerName">
          <Input type="text" v-model="searchForm.buyerName" clearable placeholder="Please enter Member name" style="width: 160px" />
        </Form-item>
        <Form-item label="Status" prop="orderStatus">
          <Select v-model="searchForm.orderStatus" placeholder="Please select" clearable style="width: 160px">
            <Option value="UNPAID">Unpaid</Option>
            <Option value="PAID">Paid</Option>
            <Option value="COMPLETED">completed</Option>
            <Option value="TAKE">待核验</Option>
            <Option value="CANCELLED">Cancel</Option>
          </Select>
        </Form-item>
        <Form-item label="Time">
          <DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="select start time" style="width: 160px"></DatePicker>
        </Form-item>
        <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
        <Button @click="handleReset" class="search-btn">reset</Button>
      </Form>
      <div>
        <Poptip @keydown.enter.native="orderVerification" placement="bottom-start" width="400">
          <Button class="export">
            核验订单
          </Button>
          <div class="api" slot="content">
            <h2>核验码</h2>
            <div style="margin:10px 0;">
              <Input v-model="orderCode" style="width:300px; margin-right:10px;" />
              <Button style="primary" @click="orderVerification">核验</Button>
            </div>
          </div>
        </Poptip>

      </div>
      <Table class="mt_10" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small"
          show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import * as API_Order from "@/api/order";
import { verificationCode } from "@/api/order";
export default {
  name: "virtualOrderList",
  data() {
    return {
      orderCode: "", // 核验码
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        orderSn: "",
        buyerName: "",
        orderStatus: "",
        orderType: "VIRTUAL",
      },
      selectDate: null,
      columns: [
        {
          title: "Order number",
          key: "sn",
          minWidth: 240,
          tooltip: true,
        },
        {
          title: "source",
          key: "clientType",
          width: 120,
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
          minWidth: 130,
          tooltip: true,
        },
        {
          title: "Amount",
          key: "flowPrice",
          minWidth: 100,
          tooltip: true,
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
          minWidth: 100,
          render: (h, params) => {
            if (params.row.orderStatus == "UNPAID") {
              return h("div", [h("tag", {props: {color: "magenta"}}, "Unpaid")]);
            } else if (params.row.orderStatus == "PAID") {
              return h("div", [h("tag", {props: {color: "blue"}}, "Paid")]);
            } else if (params.row.orderStatus == "UNDELIVERED") {
              return h("div", [h("tag", {props: {color: "geekblue"}}, "待发货")]);
            } else if (params.row.orderStatus == "DELIVERED") {
              return h("div", [h("tag", {props: {color: "cyan"}}, "已发货")]);
            } else if (params.row.orderStatus == "COMPLETED") {
              return h("div", [h("tag", {props: {color: "green"}}, "completed")]);
            } else if (params.row.orderStatus == "TAKE") {
              return h("div", [h("tag", {props: {color: "volcano"}}, "待核验")]);
            } else if (params.row.orderStatus == "CANCELLED") {
              return h("div", [h("tag", {props: {color: "red"}}, "Cancel")]);
            }
          },
        },
        {
          title: "Time",
          key: "createTime",
          width: 170,
          sortable: true,
          sortType: "desc",
        },

        {
          title: "operation",
          key: "action",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
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
    /**
     * 核验订单
     */
    async orderVerification() {
      let result = await verificationCode(this.orderCode);

      if (result.success) {
        this.$router.push({
          name: "order-detail",
          query: { sn: result.result.sn || this.orderCode },
        });
      }
    },
    // 初始化数据
    init() {
      this.getDataList();
    },
    // 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 改变Page数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // reset
    handleReset() {
      this.searchForm = {};
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.orderType = "VIRTUAL";
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      // 重新加载数据
      this.getDataList();
    },
    // 表格排序
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    // 时间段重新赋值
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取Goods列表
    getDataList() {
      this.loading = true;
      API_Order.getOrderList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // 跳转详情
    detail(v) {
      let sn = v.sn;
      this.$router.push({
        name: "order-detail",
        query: { sn: sn },
      });
    },
  },
  mounted() {
    this.init();
  },
  // Page面缓存处理，从该Page面离开时，modifyKeepAlive为false，保证进入该Page面是刷新
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false
    next()
  }
};
</script>
<style lang="scss">
// 建议引入通用样式 可delete下面样式代码
@import "@/styles/table-common.scss";
.export {
  margin: 10px 20px 10px 0;
}
</style>
