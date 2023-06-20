<template>
  <div class="search">
    <Card>
      <Button style="margin-bottom: 10px" @click="back()">Back</Button>
      <Form
        ref="searchForm"
        :model="searchForm"
        inline
        :label-width="75"
        class="search-form mb_10"
      >
        <Form-item label="coupon名称" prop="couponName">
          <Input
            type="text"
            v-model="searchForm.couponName"
            placeholder="Please enter coupon名称"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="Member name" prop="memberName">
          <Input
            type="text"
            v-model="searchForm.memberName"
            placeholder="Please enter Member name"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="获取方式" prop="getType">
          <Select
            v-model="searchForm.getType"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="FREE">免费获取</Option>
            <Option value="ACTIVITY">活动获取</Option>
          </Select>
        </Form-item>
        <Form-item label="couponstate" prop="memberCouponStatus">
          <Select
            v-model="searchForm.memberCouponStatus"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="NEW">已领取</Option>
            <Option value="USED">已使用</Option>
            <Option value="EXPIRE">已过期</Option>
            <Option value="CLOSED">已作废</Option>
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
          icon="ios-search"
          class="search-btn"
          >search</Button
        >
      </Form>
      <Table
        v-if="refreshTable"
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        class="mt_10"
        @on-selection-change="changeSelect"
      >
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
import { getCouponReceiveList } from "@/api/promotion";
import {
  memberPromotionsStatusRender,
  promotionsScopeTypeRender,
} from "@/utils/promotions";

export default {
  name: "coupon-recevie",
  data() {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "create_time", // default排序字段
        order: "desc", // default排序方式
        getType: "", // default排序方式
        couponId: this.$route.query.couponId, // couponid
      },
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          title: "Member name",
          key: "memberName",
          minWidth: 130,
          fixed: "left",
        },
        {
          title: "coupon名称",
          key: "couponName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "发布店铺",
          key: "storeName",
          minWidth: 100,
          render: (h, params) => {
            return h("div", (params.row.storeName === 'platform' && "平台") || params.row.storeName);
          },
        },
        {
          title: "面额/off扣",
          key: "price",
          width: 100,
          render: (h, params) => {
            if (params.row.price) {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.price, "RM")
              );
            } else {
              return h("div", params.row.discount + "off");
            }
          },
        },

        {
          title: "使用门槛",
          key: "consumeThreshold",
          width: 130,
        },
        {
          title: "获取方式",
          width: 120,
          key: "getType",
          render: (h, params) => {
            if (params.row.getType === "FREE") {
              return h("Tag", { props: { color: "red" } }, "免费获取");
            } else if (params.row.getType === "ACTIVITY") {
              return h("Tag", { props: { color: "volcano" } }, "活动获取");
            } else if (params.row.getType === "INSIDE") {
              return h("Tag", { props: { color: "lime" } }, "内购");
            } else {
              return h("Tag", { props: { color: "purple" } }, "未知");
            }
          },
        },
        {
          title: "会员couponstate",
          width: 130,
          key: "memberCouponStatus",
          render: (h, params) => {
            return memberPromotionsStatusRender(
              h,
              params.row.memberCouponStatus
            );
          },
        },
        {
          title: "coupon类型",
          key: "couponType",
          width: 120,
          render: (h, params) => {
            if (params.row.couponType === "DISCOUNT") {
              return h("Tag", { props: { color: "orange" } }, "打off");
            } else if (params.row.couponType === "PRICE") {
              return h("Tag", { props: { color: "magenta" } }, "减免现金");
            } else {
              return h("Tag", { props: { color: "purple" } }, "未知");
            }
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
          title: "有效时间",
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
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      refreshTable: true, // modify选中state后刷新表格
      selectDate: [], //选中的信息
    };
  },
  props: {
    promotionStatus: {
      type: String,
      default: "",
    },
  },
  watch: {
    $route(e) {
      // 监听路由，参数变化调取接口
      this.searchForm.couponId = e.query.couponId;
      if (this.couponId) {
        this.getDataList();
      } else {
        this.$refs.form.resetFields();
      }
    },
  },
  methods: {
    back() {
      this.$store.commit("removeTag", "coupon-receive");
      this.$router.go(-1);
    },
    check() {
      // 选中的coupon
      this.$emit("selected", this.selectList);
    },
    // 初始化数据
    init() {
      this.getDataList();
    },
    changePage(v) {
      // 改变Page码
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePageSize(v) {
      // 改变Page数
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      // search
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    /**
     * selectcoupon
     */
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
      if (this.getType === "ACTIVITY") this.check();
    },
    getDataList() {
      // 获取数据
      this.loading = true;
      if (this.selectDate && this.selectDate[0] && this.selectDate[1]) {
        this.searchForm.startTime = this.selectDate[0].getTime();
        this.searchForm.endTime = this.selectDate[1].getTime();
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
      getCouponReceiveList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          console.log(res);
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
