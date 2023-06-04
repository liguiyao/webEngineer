<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form
          ref="searchForm"
          :model="searchForm"
          inline
          :label-width="70"
          class="search-form"
        >
          <Form-item label="Order number" prop="orderSn">
            <Input
              type="text"
              v-model="searchForm.orderSn"
              placeholder="订单/交易号"
              clearable
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="refund状态">
            <Select
              v-model="searchForm.isRefund"
              placeholder="Please select"
              clearable
              style="width: 200px"
            >
              <Option value="false">未refund</Option>
              <Option value="true">已refund</Option>
            </Select>
          </Form-item>
          <Form-item label="refund时间">
            <DatePicker
              v-model="selectDate"
              type="datetimerange"
              format="yyyy-MM-dd"
              clearable
              @on-change="selectDateRange"
              placeholder="select start time"
              style="width: 200px"
            ></DatePicker>
          </Form-item>
          <Button
            @click="handleSearch"
            type="primary"
            icon="ios-search"
            class="search-btn"
            >search</Button
          >
        </Form>
      </Row>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        class="mt_10"
      >
        <template slot-scope="{ row, index }" slot="actions">

          <Tag color="green" v-if="row.isRefund">已refund</Tag>
          <div v-if="!row.isRefund">
            <Tag v-if="!row.errorMessage" color="red">未refund</Tag>
            <Tooltip v-else placement="left">
              <Tag color="red">未refund<Icon type="md-help" /></Tag>
              <div
                slot="content"
                style="white-space: normal"
                v-if="row.paymentName == 'WECHAT'"
              >
                {{
                  row.errorMessage ? JSON.parse(row.errorMessage).message : ""
                }}
              </div>
              <div
                slot="content"
                style="white-space: normal"
                v-if="row.paymentName == 'ALIPAY'"
              >
                {{ row.errorMessage || "" }}
              </div>
            </Tooltip>
          </div>
        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10, 20, 50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import * as API_Order from "@/api/order";

export default {
  name: "refundLog",
  data() {
    return {
      loading: true, // 表单加载状态
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        orderSn: "",
        isRefund: "",
      },
      // refund起止时间
      selectDate: null,
      columns: [
        {
          title: "After-sales order number",
          key: "afterSaleNo",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "Order number",
          key: "orderSn",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "第三方付款流水",
          key: "paymentReceivableNo",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "第三方refund流水",
          key: "receivableNo",
          minWidth: 130,
          tooltip: true,
        },
        {
          title: "refund amount",
          key: "totalAmount",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.totalAmount, "RM")
            );
          },
        },
        {
          title: "Apply  时间",
          key: "createTime",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "refund状态",
          key: "isRefund",
          align:"center",
          width: 200,
          slot: "actions",
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
    // 分页 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分页 改变页数
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
    // 起止时间从新赋值
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;
      API_Order.refundLog(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.loading = false;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
