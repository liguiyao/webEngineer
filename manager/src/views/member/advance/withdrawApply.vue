<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="Member name" prop="memberName">
            <Input type="text" v-model="searchForm.memberName" placeholder="Please enter member name" clearable style="width: 200px" />
          </Form-item>
          <Form-item label="audit status" prop="applyStatus">
            <Select v-model="searchForm.applyStatus" clearable style="width: 200px">
              <Option value="APPLY">Applying</Option>
              <Option value="VIA_AUDITING">pass(success)</Option>
              <Option value="FAIL_AUDITING">reject</Option>
            </Select>
          </Form-item>
          <Form-item label="Apply time">
            <DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" clearable @on-change="selectDateRange" placeholder="select start time" style="width: 200px"></DatePicker>
          </Form-item>
          <Form-item style="margin-left: -35px" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">search
            </Button>
          </Form-item>
        </Form>
      </Row>
      <Table class="mt_10" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small"
          show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable="false" :width="500">
      <Form :label-width="80">
        <FormItem label="Apply code">
          <span>{{showList.sn}}</span>
        </FormItem>
        <FormItem label="user name">
          <span>{{showList.memberName}}</span>
        </FormItem>
        <FormItem label="Apply amount">
          <span>{{showList.applyMoney | unitPrice}}</span>
        </FormItem>
        <FormItem label="withdraw">
          <span>{{showList.applyStatus | paramTypeFilter}}</span>
        </FormItem>
        <FormItem label="Apply time">
          <span>{{showList.createTime}}</span>
        </FormItem>
        <FormItem label="note">
          <Input v-model="audit" />
        </FormItem>

      </Form>
      <div slot="footer" v-if="showList.applyStatus == 'APPLY'">
        <Button type="text" @click="submitRole(false)">reject</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole(true)">pass
        </Button>
      </div>
    </Modal>

    <Modal :title="modalTitle" v-model="queryModalVisible" :mask-closable="false" :width="500">
      <Form :label-width="80">
        <FormItem label="Apply  code：">
          <span>{{showList.sn}}</span>
        </FormItem>
        <FormItem label="user name：">
          <span>{{showList.memberName}}</span>
        </FormItem>
        <FormItem label="Apply  amount：">
          <span>{{showList.applyMoney}}</span>
        </FormItem>
        <FormItem label="withdraw status：">
          <span>{{showList.applyStatus | paramTypeFilter}}</span>
        </FormItem>
        <FormItem label="Apply  time：">
          <span>{{showList.createTime}}</span>
        </FormItem>
        <FormItem label="audit time：">
          <span>{{showList.inspectTime}}</span>
        </FormItem>
        <FormItem label="note：">
          <span>{{showList.inspectRemark}}</span>
        </FormItem>

      </Form>
      <div slot="footer" v-if="showList.applyStatus == 'APPLY'">
        <Button type="text" @click="submitRole(false)">reject</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole(true)">pass
        </Button>
      </div>
      <div slot="footer" v-else>
        <Button type="text" @click="queryModalVisible = false">Cancel</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getUserWithdrawApply, withdrawApply } from "@/api/member";

export default {
  name: "withdrawApply",
  components: {},
  data() {
    return {
      modalTitle: "", //弹出框标题
      openSearch: true, // 显示search
      openTip: true, // 显示Tips
      loading: true, // 表单加载state
      audit: "", // 审核备注
      roleModalVisible: false, // 审核模态框
      queryModalVisible: false, // 审核模态框
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        memberName: "",
        applyStatus: "",
      },
      selectDate: null, // select时间段
      submitLoading: false, // 添加或editSubmitstate
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      showList: {}, // 可operation选项
      columns: [
        {
          title: "Apply  编号",
          key: "sn",
          align: "left",
          tooltip: true,
        },
        {
          title: "用户名称",
          key: "memberName",
          align: "left",
          tooltip: true,
        },
        {
          title: "Apply  金额",
          key: "applyMoney",
          align: "left",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {},
                this.$options.filters.unitPrice(params.row.applyMoney)
              ),
            ]);
          },
        },
        {
          title: "withdraw status",
          align: "left",
          key: "applyStatus",
          width: 120,
          render: (h, params) => {
            if (params.row.applyStatus == "APPLY") {
              return h("Tag", { props: { color: "volcano" } }, "Apply  中");
            } else if (params.row.applyStatus == "VIA_AUDITING") {
              return h("Tag", { props: { color: "green" } }, "pass");
            } else if (params.row.applyStatus == "SUCCESS") {
              return h("Tag", { props: { color: "blue" } }, "withdraw success");
            } else if (params.row.applyStatus == "ERROR") {
              return h("Tag", { props: { color: "blue" } }, "withdraw fail");
            } else {
              return h("Tag", { props: { color: "red" } }, "reject");
            }
          }
        },
        {
          title: "Apply  time",
          key: "createTime",
          align: "left",
          width: 170,
        },
        {
          title: "audit time",
          key: "inspectTime",
          align: "left",
          width: 170,
        },
        {
          title: "operation",
          key: "action",
          width: 120,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            if (params.row.applyStatus == "APPLY") {
              return h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.showList = {};
                      this.roleModalVisible = true;
                      this.showList = params.row;
                      this.audit =""
                    },
                  },
                },
                "audit"
              );
            } else {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.showList = {};
                      this.queryModalVisible = true;
                      this.showList = params.row;
                      this.modalTitle = "view";
                    },
                  },
                },
                "view"
              );
            }
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  filters: {
    paramTypeFilter(val) {
      if (val === "APPLY") {
        return "Applying";
      } else if (val === "VIA_AUDITING") {
        return "pass(success)";
      } else if (val === "FAIL_AUDITING") {
        return "reject";
      } else if (val === "ERROR") {
        return "fail";
      } else {
        return "unknown status";
      }
    },
  },
  methods: {
    submitRole(res) {
      const params = {};
      params.applyId = this.showList.id;
      params.result = res;
      params.remark = this.audit;
      if (res === false && params.remark === "") {
        this.$Message.error("can not empty");
        return;
      }
      withdrawApply(params).then((res) => {
        this.loading = false;
        if (res == true) {
          this.$Message.success("operation success");
          this.roleModalVisible = false;
          this.getDataList();
        }
      });
    },
    init() {
      this.getDataList();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.searchForm.memberName = "";
      // 重新加载数据
      this.getDataList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
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
      // 带多items件search参数获取表单数据 Please 自行modify接口
      getUserWithdrawApply(this.searchForm).then((res) => {
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

