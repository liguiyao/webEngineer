<template>
  <div class="search">
    <Card>
      <Row class="operation padding-row">
        <Button @click="add" type="primary">添加活动</Button>
      </Row>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        sortable="custom"
      >
        <template slot-scope="{ row }" slot="action">
          <Button type="info" size="small" style="margin-right: 10px" @click="info(row)">
            View
          </Button>
          <Button
            v-if="
              (!checked && row.promotionStatus === 'START') ||
              row.promotionStatus === 'NEW'
            "
            type="error"
            size="small"
            style="margin-right: 10px"
            @click="remove(row)"
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
import { getCouponActivityList, closeActivity } from "@/api/promotion";
import { promotionsStatusRender } from "@/utils/promotions";

export default {
  name: "coupon-activity",
  components: {},
  data() {
    return {
      loading: true, // 表单加载state
      modalType: 0, // 添加或edit标识
      modalVisible: false, // 添加或edit显示
      modalTitle: "", // 添加或edit标题
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
      },
      form: {
        // 添加或edit表单对象初始化数据
        promotionName: "",
      },
      // 表单验证规则
      formValidate: {
        promotionName: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      submitLoading: false, // 添加或editSubmitstate
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          title: "活动名称",
          key: "promotionName",
          minWidth: 120,
        },
        {
          title: "活动类型",
          key: "couponActivityType",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.couponActivityType === "REGISTERED") {
              return h("div", ["注册赠券"]);
            }else if(params.row.couponActivityType === 'AUTO_COUPON'){
              return h("div", ["自动发券"]);
            }else {
              return h("div", ["精确发券"]);
            }
          },
        },
        {
          title: "活动范围",
          key: "activityScope",
          minWidth: 120,
          render: (h, params) => {
            let text = "未知";
            if (params.row.activityScope === "DESIGNATED") {
              text = "指定会员";
            } else {
              text = "全部会员";
            }
            return h("div", [text]);
          },
        },
        {
          title: "领取频率",
          key: "couponFrequencyEnum",
          minWidth: 120,
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.couponFrequencyEnum === "DAY") {
              text = "每日";
            } else if(params.row.couponFrequencyEnum === "WEEK") {
              text = "每周";
            } else if(params.row.couponFrequencyEnum === 'MONTH'){
              text = '每月'
            } else {
              text = '/'
            }
            return h("div", [text]);
          },
        },
        {
          title: "活动时间",
          minWidth: 150,
          render: (h, params) => {
            if (params.row.startTime && params.row.endTime) {
              return h("div", {
                domProps: {
                  innerHTML: params.row.startTime + "<br/>" + params.row.endTime,
                },
              });
            }else{
              return h("div", '/');
            }
          },
        },
        {
          title: "state",
          minWidth: 80,
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
          minWidth: 100,
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  props: {
    // 是否为选中模式
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //获取数据 初始化
    init() {
      this.getDataList();
    },
    //增加券活动
    add() {
      this.$router.push({ name: "add-coupon-activity" });
    },
    //View详情
    info(v) {
      this.$router.push({ name: "coupon-activity-info", query: { id: v.id } });
    },
    // 分Page modifyPage码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分Page modifyPage数
    changePageSize(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    //search活动
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    //数据获取
    getDataList() {
      this.loading = true;
      if (this.selectDate && this.selectDate[0] && this.selectDate[1]) {
        this.searchForm.startTime = this.selectDate[0].getTime();
        this.searchForm.endTime = this.selectDate[1].getTime();
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
      getCouponActivityList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.loading = false;
    },
    //跳转edit
    edit(v) {
      this.$router.push({ name: "edit-platform-coupon", query: { id: v.id } });
    },
    //停止活动
    remove(v) {
      this.$Modal.confirm({
        title: "确认Close",
        content: "确认要Close此coupon活动么?Close活动只能重新创建",
        loading: true,
        onOk: () => {
          // delete
          closeActivity(v.id)
            .then((res) => {
              if (res.success) {
                this.$Message.success("coupon活动已Close");
                this.getDataList();
                this.$Modal.remove();
              }
            })
            .catch(() => {});
        },
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
