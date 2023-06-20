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
        <Form-item label="活动名称" prop="promotionName">
          <Input
            type="text"
            v-model="searchForm.promotionName"
            placeholder="Please enter 活动名称"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="活动state" prop="promotionStatus">
          <Select
            v-model="searchForm.promotionStatus"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="NEW">未开始</Option>
            <Option value="START">已开始/On</Option>
            <Option value="END">已结束/Off</Option>
            <Option value="CLOSE">紧急Close/作废</Option>
          </Select>
        </Form-item>
        <Form-item label="活动时间">
          <DatePicker
            v-model="selectDate"
            type="daterange"
            clearable
            placeholder="select start time"
            style="width: 200px"
          ></DatePicker>
        </Form-item>
        <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
      </Form>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        class="mt_10"
      >
        <template slot-scope="{ row }" slot="action">
          <Button type="info" size="small" @click="view(row)" style="margin-right: 5px"
            >View</Button
          >
          <Button
            type="error"
            size="small"
            v-if="row.promotionStatus === 'START' || row.promotionStatus === 'NEW'"
            @click="close(row)"
            >Close
          </Button>
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
import { getPintuanList, updatePintuanStatus } from "@/api/promotion";
import { promotionsStatusRender } from "@/utils/promotions";

export default {
  name: "pintuan",
  data() {
    return {
      selectDate: [], //选中的数据
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime",
        order: "desc", // default排序方式
      },
      columns: [
        // 表头
        {
          title: "活动名称",
          key: "promotionName",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "state",
          key: "promotionStatus",
          width: 110,
          render: (h, params) => {
            return promotionsStatusRender(h, params);
          },
        },
        {
          title: "所属店铺",
          key: "storeName",
          minWidth: 120,
          tooltip: true,
        },

        {
          title: "活动开始时间",
          key: "startTime",
          width: 180,
        },
        {
          title: "活动结束时间",
          key: "endTime",
          width: 180,
        },

        {
          fixed: "right",
          title: "operation",
          slot: "action",
          align: "center",
          width: 200,
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
    // 分Page modifyPage码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    // 分Page modifyPage数
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
    // 获取拼团列表
    getDataList() {
      this.loading = true;
      if (this.selectDate && this.selectDate[0] && this.selectDate[1]) {
        this.searchForm.startTime = this.selectDate[0].getTime();
        this.searchForm.endTime = this.selectDate[1].getTime();
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
      getPintuanList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // View拼团Goods
    view(v) {
      this.$router.push({ name: "pintuan-goods", query: { id: v.id } });
    },
    // Close当前活动
    close(v) {
      this.$Modal.confirm({
        title: "确认Close",
        // 记得确认modify此处
        content: "您确认要Close此拼团活动?",
        loading: true,
        onOk: () => {
          // delete
          updatePintuanStatus(v.id).then((res) => {
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
<style lang="scss" scoped>
.ivu-form-item {
  margin-bottom: 0 !important;
}
</style>
