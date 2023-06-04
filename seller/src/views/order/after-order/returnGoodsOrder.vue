<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="Goods" prop="goodsName">
            <Input
              type="text"
              v-model="searchForm.goodsName"
              clearable
              placeholder="Please enter goods name"
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="Member name" prop="memberName">
            <Input
              type="text"
              v-model="searchForm.memberName"
              clearable
              placeholder="Please enter Member name"
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="订单编号" prop="orderSn">
            <Input
              type="text"
              v-model="searchForm.orderSn"
              clearable
              placeholder="Please enter 订单编号"
              style="width: 200px"
            />
          </Form-item>

          <Form-item label="Apply  时间">
            <DatePicker
              v-model="selectDate"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              clearable
              @on-change="selectDateRange"
              placeholder="select start time"
              style="width: 200px"
            ></DatePicker>
          </Form-item>
          <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
          <Button @click="handleReset" class="search-btn">重置</Button>
        </Form>
      </Row>
      <Table
        :loading="loading"
        border
        class="mt_10"
        :columns="columns"
        :data="data"
        ref="table"
      >

        <!-- Goods栏目格式化 -->
        <template slot="goodsSlot" slot-scope="{row}">
          <div style="margin-top: 5px;height: 90px; display: flex;">
            <div style="">
              <img :src="row.goodsImage" style="height: 80px;margin-top: 3px">
            </div>

            <div style="margin-left: 13px;">
              <div class="div-zoom">
                <a @click="linkTo(row.goodsId,row.skuId)">{{row.goodsName}}</a>
              </div>
              <Poptip trigger="hover" title="扫码在手机中查看" transfer>
                <div slot="content">
                  <vue-qr :text="wapLinkTo(row.goodsId,row.skuId)"  :margin="0" colorDark="#000" colorLight="#fff" :size="150"></vue-qr>
                </div>
                <img src="../../../assets/qrcode.svg" class="hover-pointer" width="20" height="20" alt="">
              </Poptip>
            </div>
          </div>

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
  import * as API_Order from "@/api/order";

  export default {
    name: "returnGoodsOrder",
    components: {},
    data() {
      return {
        loading: true, // 表单加载状态
        searchForm: {
          // search框初始化对象
          pageNumber: 1, // 当前页数
          pageSize: 10, // 页面大小
          sort: "createTime", // default排序字段
          order: "desc", // default排序方式
          startDate: "", // 起始时间
          endDate: "", // 终止时间
          serviceType:"RETURN_GOODS",
          orderSn:"",
          memberName:"",
          goodsName:""
        },
        selectDate: null,
        columns: [

          {
            title: "After-sales order number",
            key: "sn",
            minWidth: 150,
          },
          {
            title: "Order number",
            key: "orderSn",
            minWidth: 150,
          },

          {
            title: "Goods",
            key: "sn",
            minWidth: 200,
            slot: "goodsSlot",

          },
          {
            title: "Apply  refund amount",
            key: "applyRefundPrice",
            width: 130,
            render: (h, params) => {
              return h(
                "div",
                this.$options.filters.unitPrice(params.row.applyRefundPrice, "RM")
              );
            },
          },
          {
            title: "Member name",
            key: "memberName",
            minWidth: 120,
          },
          {
            title: "状态",
            align: "center",
            key: "serviceStatus",
            width: 200,
            render: (h, params) => {
              if (params.row.serviceStatus == "APPLY") {
                return h('div', [h('tag', {props: {color: "blue"}}, 'Apply  中'),]);
              } else if (params.row.serviceStatus == "PASS") {
                return h('div', [h('tag', {props: {color: "cyan"}}, '通过after sale'),]);
              } else if (params.row.serviceStatus == "REFUSE") {
                return h('div', [h('tag', {props: {color: "volcano"}}, '拒绝after sale'),]);
              } else if (params.row.serviceStatus == "BUYER_RETURN") {
                return h('div', [h('tag', {props: {color: "orange"}}, '买家Return goods，待卖家收货'),]);
              } else if (params.row.serviceStatus == "SELLER_CONFIRM") {
                return h('div', [h('tag', {props: {color: "gold"}}, '卖家Confirm receipt'),]);
              } else if (params.row.serviceStatus == "SELLER_TERMINATION") {
                return h('div', [h('tag', {props: {color: "lime"}}, '卖家终止after sale'),]);
              } else if (params.row.serviceStatus == "BUYER_CANCEL") {
                return h('div', [h('tag', {props: {color: "purple"}}, '买家Cancelafter sale'),]);
              } else if (params.row.serviceStatus == "COMPLETE") {
                return h('div', [h('tag', {props: {color: "green"}}, '完成after sale'),]);
              }else if (params.row.serviceStatus == "WAIT_REFUND") {
                return h('div', [h('tag', {props: {color: "geekblue"}}, '待平台refund'),]);
              }
            }
          },
          {
            title: "Apply  时间",
            key: "createTime",
            width: 170
          },
          {
            title: "operation",
            key: "action",
            align: "center",
            fixed: 'right',
            width: 120,
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.detail(params.row);
                      },
                    },
                  },
                  "查看"
                ),
              ]);
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
      // 改变页码
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getDataList();
      },
      // 改变页数
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
      // 重置
      handleReset() {
        this.searchForm = {};
        this.selectDate = ''
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getDataList();
      },
      // 范围时间select格式化
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      // 获取列表数据
      getDataList() {
        this.loading = true;
        API_Order.afterSaleOrderPage(this.searchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.data = res.result.records;
            this.total = res.result.total;
          }
        });
        this.total = this.data.length;
        this.loading = false;
      },
      // Return goodsOrder details
      detail(v) {
        let sn = v.sn;
        this.$router.push({
          name: "return-goods-order-detail",
          query: { sn: sn },
        });

      },
    },
    mounted () {
      this.init();
    },
    // 页面缓存处理，从该页面离开时，modifyKeepAlive为false，保证进入该页面是刷新
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = false
      next()
    }
  };
</script>
<style lang="scss">
  // 建议引入通用样式 可delete下面样式代码
   @import "@/styles/table-common.scss";
</style>
