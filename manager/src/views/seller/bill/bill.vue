<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="账单编号" prop="sn">
          <Input type="text" v-model="searchForm.sn" placeholder="Please enter 账单编号" clearable style="width: 200px" />
        </Form-item>
        <Form-item label="出帐时间" prop="createTime">
          <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd HH:mm:ss" clearable @on-change="selectDateRange" placeholder="select start time" style="width: 200px">
          </DatePicker>
        </Form-item>
        <Form-item label="筛选state">
          <Select v-model="searchForm.billStatus" clearable style="width:160px">
            <Option value="OUT">已出账</Option>
            <Option value="CHECK">已对账</Option>
            <!-- <Option value="EXAMINE">已审核</Option> -->
            <Option value="COMPLETE">Paid</Option>
          </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Row class="operation padding-row">

      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect">
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]"
          size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import * as API_Shop from "@/api/shops";

export default {
  name: "bill",
  components: {},
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
        billStatus:"" //state
      },
      selectDate: null, // select一个时间段
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "账单号",
          key: "sn",
          minWidth: 200,
          tooltip: true,
        },
        {
          title: "生成时间",
          key: "createTime",
          width: 120,
        },
        {
          title: "结算时间段",
          key: "startTime",
          width: 200,
          render: (h, params) => {
            return h("div", params.row.startTime + "~" + params.row.endTime);
          },
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 120,
          tooltip: true,
        },

        {
          title: "结算金额",
          key: "billPrice",
          width: 130,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.billPrice, "RM")
            );
          },
        },
        {
          title: "state",
          key: "billStatus",
          width: 100,
          render: (h, params) => {
            if (params.row.billStatus == "OUT") {
              return h("Tag", {props: {color: "blue",},},"已出账");
            } else if (params.row.billStatus == "CHECK") {
              return h("Tag", {props: {color: "geekblue",},},"已对账");
            } else if (params.row.billStatus == "EXAMINE") {
              return h("Tag", {props: {color: "purple",},},"已审核");
            } else {
              return h("Tag", {props: {color: "green",},},"Paid");
            }
          },
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
          width: 120,
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
                "详细"
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
    init() {
      this.getDataList();
    },
    changePage(v) { // 改变Page码
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePageSize(v) { // 改变Page数
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() { // search
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    changeSelect(e) { // 表格选中
      this.selectList = e;
      this.selectCount = e.length;
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getDataList() {
      this.loading = true;

      this.searchForm.startTime &&
        (this.searchForm.startTime = this.$options.filters.unixToDate(
          this.searchForm.startTime / 1000
        ));
      this.searchForm.endTime &&
        (this.searchForm.endTime = this.$options.filters.unixToDate(
          this.searchForm.endTime / 1000
        ));

      API_Shop.getBuyBillPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    detail(v) { // 账单详情
      let id = v.id;
      this.$router.push({
        name: "bill-detail",
        query: { id: id },
      });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "您确认要delete " + v.name + " ?",
        loading: true,
        onOk: () => {
          // delete
          this.deleteRequest("/bill/delByIds/" + v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getDataList();
            }
          });
        },
      });
    },
    delAll() { // 多选delete数据
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未select要delete的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete所选的 " + this.selectCount + " items数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量delete
          this.deleteRequest("/bill/delByIds/" + ids).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getDataList();
            }
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
