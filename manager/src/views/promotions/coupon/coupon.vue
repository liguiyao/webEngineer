<template>
  <div class="search">
    <Card>
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
          icon="ios-search"
          class="search-btn"
          >search</Button
        >
      </Form>
      <Row class="operation padding-row" v-if="getType !== 'ACTIVITY'">
        <Button @click="add" type="primary">添加coupon</Button>
        <Button @click="delAll">批量Close</Button>
        <Button @click="receivePage()" type="info">coupon领取记录</Button>
      </Row>
      <Table
        v-if="refreshTable"
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
              row.promotionStatus === 'CLOSE' || row.promotionStatus === 'NEW'
            "
            type="info"
            size="small"
            @click="see(row)"
            >edit
          </Button>
          <Button
            v-else
            type="default"
            size="small"
            @click="see(row, 'onlyView')"
            >View
          </Button>
          <Button
            class="ml_5"
            v-if="
              row.promotionStatus === 'START' || row.promotionStatus === 'NEW'
            "
            type="error"
            size="small"
            @click="close(row)"
            >Close
          </Button>
          <Button
            class="ml_5"
            v-if="
              row.promotionStatus === 'CLOSE' || row.promotionStatus === 'END'
            "
            type="error"
            size="small"
            @click="remove(row)"
            >delete
          </Button>
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
import {
  getPlatformCouponList,
  updatePlatformCouponStatus,
  deletePlatformCoupon,
} from "@/api/promotion";
import {
  promotionsStatusRender,
  promotionsScopeTypeRender,
} from "@/utils/promotions";

export default {
  name: "coupon",
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
      },
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 100,
          align: "center",
          fixed: "left",
        },
        {
          title: "coupon名称",
          key: "couponName",
          width: 180,
          tooltip: true,
        },
        {
          title: "面额/off扣",
          key: "price",
          width: 150,
          render: (h, params) => {
            if (params.row.price) {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.price, "RM")
              );
            } else {
              return h("div", params.row.couponDiscount + "off");
            }
          },
        },

        {
          title: "已领取Quantity/总Quantity",
          key: "publishNum",
          width: 180,
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
          width: 200,
          render: (h, params) => {
            return h("div", params.row.usedNum + "/" + params.row.receivedNum);
          },
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
            } else if (params.row.getType === "IGAME") {
              return h("Tag", { props: { color: "lime" } }, "游戏人生");
            } else {
              return h("Tag", { props: { color: "purple" } }, "未知");
            }
          },
        },
        {
          title: "coupon类型",
          key: "couponType",
          width: 150,
          render: (h, params) => {
            let text = "";
            if (params.row.couponType === "DISCOUNT") {
              return h("Tag", { props: { color: "blue" } }, "打off");
            } else if (params.row.couponType === "PRICE") {
              return h("Tag", { props: { color: "geekblue" } }, "减免现金");
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
          title: "活动时间",
          width: 200,
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
          align: "center",
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
          width: 150,
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      refreshTable: true, // modify选中state后刷新表格
      selectDate: [], //选中的信息
    };
  },
  props: {
    //coupon类型 查询参数
    getType: {
      type: String,
      default: "",
    },
    promotionStatus: {
      type: String,
      default: "",
    },
    //已selectcoupon
    selectedList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    $route(to, from) {
      if (to.fullPath == "/promotions/manager-coupon") {
        this.init();
      }
    },
    // 选中coupon 父级传值
    selectedList: {
      handler(val) {
        // 判断是否是父级回调给自己已selectcoupon
        if (val.length) {
          this.selectList = val;
          this.data.forEach((item) => {
            item._checked = false;
            if (this.selectList.length) {
              this.selectList.forEach((child) => {
                if (item.id == child.id) {
                  item._checked = true;
                }
              });
            }
          });
        } else {
          this.data.forEach((item) => {
            item._checked = false;
          });
        }
        this.refreshTable = false;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      deep: true,
    },
  },
  methods: {
    check() {
      // 选中的coupon
      this.$emit("selected", this.selectList);
    },
    receivePage(id) {
      if (id) {
        this.$router.push({ name: "coupon-receive", query: { couponId: id } });
      } else {
        this.$router.push({ name: "coupon-receive" });
      }
    },
    // 初始化数据
    init() {
      this.getDataList();
    },
    add() {
      // 跳转添加Page面
      this.$router.push({ name: "add-platform-coupon" });
    },
    info(v) {
      // Viewcoupon
      this.$router.push({ name: "platform-coupon-info", query: { id: v.id } });
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
    clearSelectAll() {
      // 清除选中state
      this.$refs.table.selectAll(false);
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
      getPlatformCouponList(this.searchForm).then((res) => {
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

    see(v, only) {
      // 跳转editPage面
      let data;
      only ? (data = { onlyView: true, id: v.id }) : (data = { id: v.id });
      this.$router.push({ name: "edit-platform-coupon", query: data });
    },
    close(v) {
      // Offcoupon
      this.$Modal.confirm({
        title: "确认Close",
        // 记得确认modify此处
        content: "确认要Close此coupon么?",
        loading: true,
        onOk: () => {
          // delete
          updatePlatformCouponStatus({
            couponIds: v.id,
            effectiveDays: 0,
          })
            .then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success("coupon已Close");
                this.getDataList();
              }
            })
            .catch(() => {
              this.$Modal;
            });
        },
      });
    },
    remove(v) {
      // Offcoupon
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "确认要delete此coupon么?",
        loading: true,
        onOk: () => {
          // delete
          deletePlatformCoupon(v.id)
            .then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success("coupon已delete");
                this.getDataList();
              }
            })
            .catch(() => {
              this.$Modal;
            });
        },
      });
    },
    delAll() {
      // 批量Off
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未select要Off的coupon");
        return;
      }
      this.$Modal.confirm({
        title: "confirm take off",
        content: "您确认要Off所选的 " + this.selectCount + " items数据?",
        loading: true,
        onOk: () => {
          let ids = [];
          this.selectList.forEach(function (e) {
            ids.push(e.id);
          });
          let params = {
            couponIds: ids.toString(),
            promotionStatus: "CLOSE",
          };
          // 批量delete
          updatePlatformCouponStatus(params).then((res) => {
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
    //如果作为组件方式，传入了类型值，则search参数附加类型
    if (this.getType) {
      this.searchForm.getType = this.getType;
      this.columns.pop();
    }
    if (this.promotionStatus) {
      this.searchForm.promotionStatus = this.promotionStatus;
      this.columns.pop();
    }
    this.init();
  },
};
</script>
