<template>
  <div class="search">
    <Card>
      <Form
        ref="searchForm"
        :model="searchForm"
        inline
        :label-width="70"
        class="search-form"
      >
        <Form-item label="Member name" prop="memberName">
          <Input
            type="text"
            v-model="searchForm.memberName"
            placeholder="Please enter member name"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="recharge number" prop="rechargeSn">
          <Input
            type="text"
            v-model="searchForm.rechargeSn"
            placeholder="Please enter recharge number"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="payment time">
          <DatePicker
            v-model="selectDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            clearable
            @on-change="selectDateRange"
            placeholder="select start time"
            style="width: 200px"
          ></DatePicker>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        class="mt_10"
      ></Table>
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
  import {
    getUserRecharge,
  } from "@/api/member";
  export default {
    name: "recharge",
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
          memberName:""
        },
        selectDate: null, // select区间时间
        columns: [
          {
            title: "member name",
            key: "memberName",
            minWidth: 120,
            tooltip: true
          },
          {
            title: "Order number",
            key: "rechargeSn",
            minWidth: 180,
            tooltip: true
          },
          {
            title: "recharge amount",
            key: "rechargeMoney",
            width: 160,
            sortable: true,
            render: (h, params) => {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.rechargeMoney, "RM")
              );
            },
          },
          {
            title: "payment method",
            key: "rechargeWay",
            width: 120,
            render: (h, params) => {
              if (params.row.rechargeWay === 'ALIPAY') {
                return h('div', [h('span', {}, 'Alipay')]);
              } else if (params.row.rechargeWay === 'WECHAT') {
                return h('div', [h('span', {}, 'Wechat')]);
              } else if (params.row.rechargeWay === 'BANK_TRANSFER') {
                return h('div', [h('span', {}, '线下转账')]);
              } else {
                return h('div', [h('span', {}, '')]);
              }
            }
          },
          {
            title: "payment status",
            key: "payStatus",
            align: "left",
            width: 120,
            sortable: false,
            render: (h, params) => {
              if (params.row.payStatus == "PAID") {
                return h("Tag", {props: {color: "green",},}, "Paid");
              } else {
                return h("Tag", {props: {color: "red",},}, "Unpaid");
              }
            },
          },
          {
            title: "payment time",
            key: "createTime",
            align: "left",
            width: 190,
            sortable: false,
          },
          {
            title: "payment time",
            key: "payTime",
            align: "left",
            width: 190,
            sortable: false,
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
        this.loading = true;
        getUserRecharge(this.searchForm).then((res) => {
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
