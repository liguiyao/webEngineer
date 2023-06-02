<template>
  <div class="wrapper">
    <card _Title="Coupon list" :_Tabs="statusNameList" @_Change="change" />
    <empty v-if="list.length == 0" />
    <ul class="coupon-list" v-else>
      <li v-for="(item, index) in list" class="coupon-item" :key="index">
        <div class="c-left">
          <div>
            <span
              v-if="item.couponType === 'PRICE'"
              class="fontsize_12 global_color"
              >RM<span class="price">{{ item.price | unitPrice }}</span></span
            >
            <span
              v-if="item.couponType === 'DISCOUNT'"
              class="fontsize_12 global_color"
              ><span class="price">{{ item.discount }}</span
              >off</span
            >
            <span class="describe">full{{ item.consumeThreshold }}ringgitavailable</span>
          </div>
          <p>使用范围：{{ useScope(item.scopeType, item.storeName) }}</p>
          <p>有效期：{{ item.endTime }}</p>
        </div>
        <b></b>
        <a
          class="c-right"
          :class="{ 'canot-use': params.memberCouponStatus !== 'NEW' }"
          @click="go(item)"
          >立即使用</a
        >
        <i class="circle-top"></i>
        <i class="circle-bottom"></i>
      </li>
    </ul>
    <Page
      :total="total"
      @on-change="changePageNum"
      class="pageration"
      @on-page-size-change="changePageSize"
      :page-size="params.pageSize"
      show-total
      show-sizer
    >
    </Page>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import { memberCouponList } from "@/api/member.js";
export default {
  name: "Coupons",
  data() {
    return {
      statusNameList: [
        // coupon状态
        "未使用",
        "已使用",
        "已过期",
      ],
      statusList: ["NEW", "USED", "EXPIRE"], // coupon状态
      loading: false, // 列表加载状态
      params: {
        // Please 求参数
        pageNumber: 1,
        pageSize: 10,
        memberCouponStatus: "NEW",
      },
      total: 0, // coupon总数
      list: [], // Coupon list
    };
  },
  methods: {
    getList() {
      // 获取Coupon list
      this.loading = true;
      memberCouponList(this.params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.list = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // 切换coupon状态
    change(index) {
      this.params.memberCouponStatus = this.statusList[index];
      this.params.pageNumber = 1;
      this.getList();
    },
    go(item) {
      // 根据使用条件跳转Goods列表页面
      if (this.params.memberCouponStatus !== "NEW") return;

      this.$router.push({
        path: "/goodsList",
        query: { promotionsId: item.couponId, promotionType: "COUPON" },
      });
    },

    changePageNum(val) {
      // 分页改变页码
      this.params.pageNumber = val;
      this.getList();
    },

    changePageSize(val) {
      // 分页改变页数
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.getList();
    },

    useScope(type, storeName) {
      // 根据字段Back coupon适用范围
      let shop = "平台";
      let goods = "All goods";
      if (storeName !== "platform") shop = storeName;
      switch (type) {
        case "ALL":
          goods = "All goods";
          break;
        case "PORTION_GOODS":
          goods = "Partial goods";
          break;
        case "PORTION_GOODS_CATEGORY":
          goods = "Partial classified goods";
          break;
      }
      return `${shop}${goods}available`;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/styles/coupon.scss";
.coupon-item {
  height: 125px;
  .c-left {
    padding: 16px;
  }
  .c-right {
    padding: 20px 16px;
    width: 43px;
    font-size: 14px;
  }
  .canot-use {
    color: #999;
    background-color: #eee;
  }
  i {
    right: 34px;
  }
}

.pageration {
  text-align: right;
}
</style>
