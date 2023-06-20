<template>
  <div class="pintuan">
    <Card>
      <Row>
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
          <Button
            @click="handleSearch"
            type="primary"
            class="search-btn"
            icon="ios-search"
            >search</Button
          >
          <Button @click="handleReset" class="search-btn">reset</Button>
        </Form>
      </Row>
      <Row class="operation padding-row">
        <Button @click="newAct" type="primary">添加</Button>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table">
        <template slot-scope="{ row }" slot="action">
          <div class="row">
            <Button
              type="default"
              size="small"
              v-if="row.promotionStatus == 'NEW'"
              @click="edit(row)"
              >edit</Button
            >
            <Button
              type="info"
              v-if="row.promotionStatus == 'NEW'"
              size="small"
              @click="manage(row, 'manager')"
              >管理</Button
            >
            <Button
              type="info"
              v-if="row.promotionStatus !== 'NEW' && row.promotionStatus !== 'CLOSE'"
              size="small"
              @click="manage(row, 'view')"
              >View</Button
            >
            <Button
              type="error"
              size="small"
              v-if="row.promotionStatus != 'START'"
              @click="remove(row)"
              >delete</Button
            >
            <Button
              type="success"
              v-if="row.promotionStatus == 'CLOSE'"
              size="small"
              @click="open(row)"
              >Opening</Button
            >
            <Button
              type="warning"
              v-if="row.promotionStatus == 'START'"
              size="small"
              @click="close(row)"
              >Close</Button
            >
          </div>
        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page
          :current="searchForm.pageNumber + 1"
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
import { getPintuanList, deletePintuan, editPintuanStatus } from "@/api/promotion";
export default {
  name: "pintuan",
  data() {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 0, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "startTime", // default排序字段
        order: "desc", // default排序方式
      },
      selectDate: null, // select的时间
      columns: [
        {
          title: "活动名称",
          key: "promotionName",
          minWidth: 120,
        },
        {
          title: "活动开始时间",
          key: "startTime",
        },
        {
          title: "活动结束时间",
          key: "endTime",
        },
        {
          title: "state",
          key: "promotionStatus",
          width: 100,
          render: (h, params) => {
            let text = "未知",
              color = "default";
            if (params.row.promotionStatus == "NEW") {
              text = "未开始";
              color = "default";
            } else if (params.row.promotionStatus == "START") {
              text = "已开始";
              color = "green";
            } else if (params.row.promotionStatus == "END") {
              text = "已结束";
              color = "blue";
            } else if (params.row.promotionStatus == "CLOSE") {
              text = "已Close";
              color = "red";
            }
            return h("div", [h("Tag", { props: { color: color } }, text)]);
          },
        },
        {
          title: "operation",
          slot: "action",
          align: "center",
          width: 250,
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
    // 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v - 1;
      this.getDataList();
    },
    // 改变Page数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 0;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // reset
    handleReset() {
      this.searchForm = {};
      this.selectDate = "";
      this.searchForm.pageNumber = 0;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // 时间段分别赋值
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    // 获取列表数据
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
    // 新建拼团
    newAct() {
      this.$router.push({ name: "pintuan-edit" });
    },
    // edit拼团
    edit(v) {
      this.$router.push({ name: "pintuan-edit", query: { id: v.id } });
    },
    // 管理拼团Goods
    manage(v, status) {
      this.$router.push({ name: "pintuan-goods", query: { id: v.id, status: status } });
    },
    // 手动Opening拼团活动
    open(v) {
      let sTime = new Date();
      sTime.setMinutes(sTime.getMinutes() + 10);
      let eTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1);
      this.openStartTime = sTime.getTime();
      this.openEndTime = eTime.getTime();
      this.$Modal.confirm({
        title: "确认Opening(default为当前时间的十分钟之后)",
        content: "您确认要Opening此拼团活动?",
        onOk: () => {
          let params = {
            startTime: this.openStartTime,
            endTime: this.openEndTime,
          };
          editPintuanStatus(v.id, params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Opening活动success");
              this.getDataList();
            }
          });
        },
        render: (h) => {
          return h("div", [
            h("DatePicker", {
              props: {
                type: "datetimerange",
                placeholder: "Please select开始时间和结束时间",
                value: [sTime, eTime],
              },
              style: {
                width: "350px",
              },
              on: {
                input: (val) => {
                  if (val[0]) {
                    this.openStartTime = val[0].getTime();
                  }
                  if (val[1]) {
                    this.openEndTime = val[1].getTime();
                  }
                },
              },
            }),
          ]);
        },
      });
    },
    // Close拼团活动
    close(v) {
      this.$Modal.confirm({
        title: "确认Close",
        content: "您确认要Close此拼团活动?",
        loading: true,
        onOk: () => {
          editPintuanStatus(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Close活动success");
              this.getDataList();
            }
          });
        },
      });
    },
    // delete拼团活动
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete此拼团活动?",
        loading: true,
        onOk: () => {
          // delete
          deletePintuan(v.id).then((res) => {
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
  // Page面缓存处理，从该Page面离开时，modifyKeepAlive为false，保证进入该Page面是刷新
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
};
</script>
<style lang="scss">
@import "@/styles/table-common.scss";
.row Button {
  margin-right: 4px;

}
</style>
