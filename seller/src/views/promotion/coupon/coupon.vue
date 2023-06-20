<template>
  <div class="search">
    <Card>
      <Row>
        <Form
          ref="searchForm"
          :model="searchForm"
          inline
          :label-width="100"
          class="search-form"
        >
          <Form-item label="coupon名称">
            <Input
              type="text"
              v-model="searchForm.couponName"
              placeholder="Please enter coupon名称"
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
      <Row class="operator padding-row">
        <Button @click="add" type="primary">添加</Button>
        <Button @click="delAll" class="ml_10">批量Close</Button>
        <Button @click="receivePage()" class="ml_10" type="info">coupon领取记录</Button>
      </Row>
      <Table
        class="mt_10"
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        @on-selection-change="changeSelect"
      >
        <template slot-scope="{ row }" slot="action">
          <Button
            v-if="
              row.promotionStatus === 'NEW' || row.promotionStatus === 'CLOSE'
            "
            type="info"
            size="small"
            @click="see(row)"
            >edit</Button
          >
          <Button v-else type="default" size="small" @click="see(row, 'only')"
            >View</Button
          >
          <Button
            v-if="
              row.promotionStatus === 'START' || row.promotionStatus === 'NEW'
            "
            type="error"
            size="small"
            :style="{ marginLeft: '5px' }"
            @click="remove(row)"
            >Close</Button
          >
          <Button
            style="margin: 5px"
            type="info"
            size="small"
            @click="receivePage(row.id)"
            >领取记录
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
import { getShopCouponList, updateCouponStatus } from "@/api/promotion";
import {
  promotionsStatusRender,
  promotionsScopeTypeRender,
} from "@/utils/promotions";

export default {
  name: "coupon",
  data() {
    return {
      selectDate: [],
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "startTime", // default排序字段
        order: "desc", // default排序方式
      },
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          title: "coupon名称",
          key: "couponName",
          tooltip: true,
        },
        {
          title: "面额/off扣",
          key: "price",
          width: 100,
          render: (h, params) => {
            if (params.row.price) {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.price || 0, "RM")
              );
            } else {
              return h("div", (params.row.couponDiscount || 0) + "off");
            }
          },
        },

        {
          title: "已领取Quantity/总Quantity",
          key: "publishNum",
          render: (h, params) => {
            return h(
              "div",
              params.row.receivedNum +
                "/" +
                (params.row.publishNum === 0 ? "不限制" : params.row.publishNum)
            );
          },
        },
        {
          title: "已被使用的Quantity/已领取Quantity",
          key: "publishNum",
          render: (h, params) => {
            return h("div", params.row.usedNum + "/" + params.row.receivedNum);
          },
        },
        {
          title: "coupon类型",
          key: "couponType",
          render: (h, params) => {
            let text = "未知";
            if (params.row.couponType === "DISCOUNT") {
              text = "打off";
            } else if (params.row.couponType === "PRICE") {
              text = "减免现金";
            }
            return h("div", [text]);
          },
        },
        {
          title: "品类描述",
          key: "scopeType",
          width: 120,
          render: (h, params) => {
            return promotionsScopeTypeRender(h, params);
          },
        },
        {
          title: "活动时间",
          width: 150,
          render: (h, params) => {
            if (
              params?.row?.getType === "ACTIVITY" &&
              params?.row?.rangeDayType === "DYNAMICTIME"
            ) {
              return h("div", "长期有效");
            } else if (params?.row?.startTime && params?.row?.endTime) {
              return h("div", {
                domProps: {
                  innerHTML:
                    params.row.startTime + "<br/>" + params.row.endTime,
                },
              });
            }
          },
        },
        {
          title: "state",
          width: 100,
          key: "promotionStatus",
          fixed: "right",
          render: (h, params) => {
            return promotionsStatusRender(h, params);
          },
        },
        {
          title: "operation",
          slot: "action",
          align: "center",
          fixed: "right",
          maxWidth: 140,
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
    receivePage(id) {
      if (id) {
        this.$router.push({ name: "coupon-receive", query: { couponId: id } });
      } else {
        this.$router.push({ name: "coupon-receive" });
      }
    },
    add() {
      this.$router.push({ name: "add-coupon" });
    },
    /** 跳转至领取详情Page面 */
    receiveInfo(v) {
      this.$router.push({ name: "member-receive-coupon", query: { id: v.id } });
    },
    info(v) {
      this.$router.push({ name: "platform-coupon-info", query: { id: v.id } });
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
      this.getDataList();
    },
    handleReset() {
      this.searchForm = {};
      this.selectDate = "";
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
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
      getShopCouponList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // 跳转editcouponPage面
    see(v, only) {
      let data;
      only ? (data = { onlyView: true, id: v.id }) : (data = { id: v.id });
      this.$router.push({ name: "add-coupon", query: data });
    },
    // Offcoupon
    remove(v) {
      this.$Modal.confirm({
        title: "confirm take off",
        content: "确认要Off此coupon么?",
        loading: true,
        onOk: () => {
          this.loading = false;
          let params = {
            couponIds: v.id,
          };
          updateCouponStatus(params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Offsuccess");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        },
      });
    },

    // 批量Off
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未select要Close的coupon");
        return;
      }
      this.$Modal.confirm({
        title: "确认Close",
        content: "您确认要Close所选的 " + this.selectCount + " items数据?",
        loading: true,
        onOk: () => {
          let ids = [];
          this.selectList.forEach(function (e) {
            ids.push(e.id);
          });

          let params = {
            couponIds: ids.toString(),
          };
          updateCouponStatus(params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Offsuccess");
              this.clearSelectAll();
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
@import "@/styles/table-common.scss";
.search-form {
  width: 100% !important;
}
</style>
