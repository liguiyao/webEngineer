
<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="Member name" prop="memberName">
            <Input type="text" v-model="searchForm.memberName" placeholder="Please enter member name" clearable style="width: 200px" />
          </Form-item>
          <Form-item label="payment time">
            <DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" clearable @on-change="selectDateRange" placeholder="select start time" style="width: 200px"></DatePicker>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
        </Form>
      </Row>
        <Table class="mt_10" :loading="loading" border :columns="columns" :data="data" ref="table"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]"
          size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getUserWallet } from "@/api/member";
export default {
  name: "walletLog",
  data() {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        memberName: "",
      },
      selectDate: null, // select时间段
      columns: [
        // 表头
        {
          title: "member name",
          key: "memberName",
          minWidth: 100,
        },
        {
          title: "change amount",
          key: "money",
          width: 150,
          render: (h, params) => {
            if (params.row.money > 0) {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "green",
                    },
                  },
                  this.$options.filters.unitPrice(params.row.money, "RM")
                ),
              ]);
            } else if (params.row.money < 0) {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "red",
                    },
                  },
                  this.$options.filters.unitPrice(-params.row.money, "- RM")
                ),
              ]);
            }
          },
        },

        {
          title: "change time",
          key: "createTime",
          width: 200,
        },
        {
          title: "business time",
          key: "serviceType",
          width: 200,
          render: (h, params) => {
            if (params.row.serviceType == "WALLET_WITHDRAWAL") {
              return h("div", [h("span", {}, "balance withdraw")]);
            } else if (params.row.serviceType == "WALLET_PAY") {
              return h("div", [h("span", {}, "Balance payment")]);
            } else if (params.row.serviceType == "WALLET_REFUND") {
              return h("div", [h("span", {}, "balance refund")]);
            } else if (params.row.serviceType == "WALLET_RECHARGE") {
              return h("div", [h("span", {}, "balance recharge")]);
            } else {
              return h("div", [h("span", {}, "commission")]);
            }
          },
        },
        {
          title: "detail",
          key: "detail",
          minWidth: 300,
          tooltip: true,
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
    // 分Page 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分Page 改变Page数
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
    // 时间段赋值
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取列表数据
    getDataList() {
      getUserWallet(this.searchForm).then((res) => {
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
