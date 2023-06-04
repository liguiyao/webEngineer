<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="活动名称">
          <Input type="text" v-model="searchForm.promotionName" placeholder="Please enter 活动名称" clearable style="width: 200px" />
        </Form-item>
        <Form-item label="活动状态" prop="promotionStatus">
          <Select v-model="searchForm.promotionStatus" placeholder="Please select" clearable style="width: 200px">
            <Option value="NEW">未开始</Option>
            <Option value="START">已开始/上架</Option>
            <Option value="END">已结束/下架</Option>
            <Option value="CLOSE">紧急Close/作废</Option>
          </Select>
        </Form-item>
        <Form-item label="活动时间">
          <DatePicker v-model="selectDate" type="daterange" clearable placeholder="select start time" style="width: 200px">
          </DatePicker>
        </Form-item>
        <Form-item>
          <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
          <Button @click="handleReset" class="ml_10">重置</Button>
        </Form-item>
      </Form>
      <Row class="operation">
        <Button type="primary" @click="newAct">新增</Button>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table">
        <template slot-scope="{ row }" slot="applyEndTime">
          {{ unixDate(row.applyEndTime) }}
        </template>
        <template slot-scope="{ row }" slot="promotionType">
          {{ row.fullMinusFlag ? "full减" : "fulloff" }}
        </template>
        <template slot-scope="{ row }" slot="hours">
          <Tag v-for="item in unixHours(row.hours)" :key="item">{{ item }}</Tag>
        </template>
        <template slot-scope="{ row }" slot="action">
          <div>
            <Button type="primary" v-if="row.promotionStatus == 'NEW'" size="small" @click="edit(row)">编辑</Button>
            <Button type="info" v-else size="small" @click="edit(row)">查看</Button>
            <Button type="success" v-if="row.promotionStatus === 'START'" style="margin-left: 5px" size="small"
              @click="openOrClose(row)">Close</Button>
            <Button type="success" v-if="row.promotionStatus === 'CLOSE'" style="margin-left: 5px" size="small"
              @click="openOrClose(row)">Opening</Button>
            <Button type="error" :disabled="row.promotionStatus == 'START'" style="margin-left: 5px" size="small"
              @click="del(row)">delete</Button>
          </div>
        </template>
      </Table>
      <Row type="flex" justify="end" class="page operation">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
          @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small" show-total show-elevator
          show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>
<script>
import {
  getFullDiscountList,
  delFullDiscount,
  updateFullDiscount,
} from "@/api/promotion.js";
export default {
  name: "full-cut",
  data () {
    return {
      total: 0,
      selectDate: [],
      loading: false, // 表单加载状态
      searchForm: {
        // 列表Please 求参数
        pageNumber: 1,
        pageSize: 10,
        sort: "startTime",
        order: "desc",
      },
      columns: [
        {
          title: "活动名称",
          key: "promotionName",
          minWidth: 120,
        },
        {
          title: "开始时间",
          key: "startTime",
          minWidth: 60,
        },
        {
          title: "结束时间",
          key: "endTime",
          minWidth: 60,
        },
        {
          title: "活动类型",
          slot: "promotionType",
          width: 100,
        },
        {
          title: "活动状态",
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
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: color,
                  },
                },
                text
              ),
            ]);
          },
        },
        {
          title: "operation",
          slot: "action",
          align: "center",
          width: 200,
        },
      ],
      data: [], // 表格数据
    };
  },
  methods: {
    // 改变页码
    newAct () {
      this.$router.push({ name: "full-discount-detail" });
    },
    // 初始化数据
    init () {
      this.getDataList();
    },
    // 改变页数
    changePage (v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 改变页码
    changePageSize (v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch () {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // 重置
    handleReset () {
      this.selectDate = "";
      this.searchForm = {};
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    //  编辑
    edit (row) {
      this.$router.push({ name: "full-discount-detail", query: { id: row.id } });
    },
    // delete
    del (row) {
      this.$Modal.confirm({
        title: "Tips",
        // 记得确认modify此处
        content: "确认delete此活动吗?",
        loading: true,
        onOk: () => {
          // delete
          delFullDiscount(row.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getDataList();
            }
          });
        },
      });
    },
    // Opening或Close活动
    openOrClose (row) {
      let name = "Opening";
      let status = "START";
      if (row.promotionStatus === "START") {
        name = "Close";
        status = "CLOSE";
        this.$Modal.confirm({
          title: "Tips",
          // 记得确认modify此处
          content: `确认${name}此活动吗?需要一定时间才能生效，Please 耐心等待`,
          loading: true,
          onOk: () => {
            // delete
            updateFullDiscount(row.id).then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success(`${name}success`);
                this.getDataList();
              }
            });
          },
        });
      } else {
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
            updateFullDiscount(row.id, params).then((res) => {
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
      }
    },
    // 获取列表数据
    getDataList () {
      this.loading = true;
      if (this.selectDate && this.selectDate[0] && this.selectDate[1]) {
        this.searchForm.startTime = this.selectDate[0].getTime();
        this.searchForm.endTime = this.selectDate[1].getTime();
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
      getFullDiscountList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
  },
  mounted () {
    this.init();
  },
  // 页面缓存处理，从该页面离开时，modifyKeepAlive为false，保证进入该页面是刷新
  beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/table-common.scss";

.operation {
  margin: 10px 0;
}
</style>
