<template>
  <div>
    <Card>
      <Row @keydown.enter.native="handleSearch">
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
          <Form-item label="status">
            <Select
              v-model="searchForm.distributionStatus"
              style="width: 200px"
            >
              <Option
                v-for="item in distributionStatusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
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
  getDistributionListData,
  retreatDistribution,
  resumeDistribution,
  auditDistribution,
} from "@/api/distribution";
import { distributionStatusList } from "./dataJson.js";
export default {
  name: "distribution",
  components: {},
  data() {
    return {
      distributionStatusList, // 分销状态
      loading: true, // 表单加载状态
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
      },
      columns: [
        {
          title: "member name",
          key: "memberName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "promotions number",
          key: "distributionOrderCount",
          minWidth: 120,
          width: 150,
        },
        {
          title: "Distribution amount",
          key: "rebateTotal",
          width: 150,
          sortable: false,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.rebateTotal, "RM")
            );
          },
        },
        {
          title: "available amount",
          key: "canRebate",
          width: 150,
          sortable: false,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.canRebate, "RM")
            );
          },
        },
        {
          title: "frozen amount",
          key: "commissionFrozen",
          width: 150,
          sortable: false,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.commissionFrozen, "RM")
            );
          },
        },
        {
          title: "status",
          key: "distributionStatus",
          width: 150,
          sortable: false,
          render: (h, params) => {
            if (params.row.distributionStatus == "PASS") {
              return h("Tag", {props: {color: "green",},},"pass");
            } else if (params.row.distributionStatus == "APPLY") {
              return h("Tag", {props: {color: "geekblue",},},"wait audit");
            } else if (params.row.distributionStatus == "RETREAT") {
              return h("Tag", {props: {color: "volcano",},},"clear out");
            } else if (params.row.distributionStatus == "REFUSE") {
              return h("Tag", {props: {color: "red",},},"reject");
            }
          },
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
          width: 140,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "center",
                },
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                      display:
                        params.row.distributionStatus != "RETREAT"
                          ? "block"
                          : "none",
                    },
                    on: {
                      click: () => {
                        this.retreat(params.row);
                      },
                    },
                  },
                  "清退"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                      display:
                        params.row.distributionStatus == "RETREAT"
                          ? "block"
                          : "none",
                    },
                    on: {
                      click: () => {
                        this.resume(params.row);
                      },
                    },
                  },
                  "recover"
                ),
              ]
            );
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
    // 分页 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分页 改变页数
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
    // 获取列表数据
    getDataList() {
      this.loading = true;
      this.searchForm.status = "PASS";
      getDistributionListData(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // 清退分销商
    retreat(v) {
      this.$Modal.confirm({
        title: "Tips",
        // 记得确认modify此处
        content: "confirm to clear out " + v.memberName + " ?",
        loading: true,
        onOk: () => {
          // delete
          retreatDistribution(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getDataList();
            }
          });
        },
      });
    },
    // 恢复分销商
    resume(v) {
      this.$Modal.confirm({
        title: "Tips",
        // 记得确认modify此处
        content: "confirm to recover " + v.memberName + " ?",
        loading: true,
        onOk: () => {
          // delete
          resumeDistribution(v.id).then((res) => {
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
