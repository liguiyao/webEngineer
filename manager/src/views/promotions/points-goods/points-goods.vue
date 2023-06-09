<template>
  <div class="search">
    <Card>
      <Row>
        <Form
          ref="searchForm"
          :model="searchForm"
          inline
          :label-width="70"
          class="search-form"
        >
          <Form-item label="goods name">
            <Input
              type="text"
              v-model="searchForm.goodsName"
              placeholder="Please enter goods name"
              clearable
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="积分区间">
            <Input
              type="text"
              v-model="searchForm.pointsS"
              placeholder="Please enter 开始区间"
              clearable
              style="width: 200px"
            />
            -
            <Input
              type="text"
              v-model="searchForm.pointsE"
              placeholder="Please enter 结束区间"
              clearable
              style="width: 200px"
            />
          </Form-item>
          <Form-item label="state">
            <Select v-model="searchForm.promotionStatus" style="width: 200px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{
                item.label
              }}</Option>
            </Select>
          </Form-item>
          <Form-item label="SKU编码">
            <Input
              type="text"
              v-model="searchForm.skuId"
              placeholder="Please enter SKU编码"
              clearable
              style="width: 200px"
            />
          </Form-item>
          <Button
            @click="handleSearch"
            type="primary"
            icon="ios-search"
            class="search-btn"
            >search</Button
          >
        </Form>
      </Row>
      <Row class="operation padding-row">
        <Button @click="addPointsGoods" type="primary">添加积分Goods</Button>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table">
        <template slot-scope="{ row }" slot="goodsName">
          <div>
            <a class="mr_10" @click="linkTo(row.goodsId, row.skuId)">{{
              row.goodsName
            }}</a>
            <Poptip trigger="hover" title="扫码在手机中View" transfer>
              <div slot="content">
                <vue-qr
                  :text="wapLinkTo(row.goodsId, row.skuId)"
                  :margin="0"
                  colorDark="#000"
                  colorLight="#fff"
                  :size="150"
                ></vue-qr>
              </div>
              <img
                src="../../../assets/qrcode.svg"
                style="vertical-align: middle"
                class="hover-pointer"
                width="20"
                height="20"
                alt=""
              />
            </Poptip>
          </div>
        </template>
        <template slot-scope="{ row }" slot="price">
          <div>{{ row.originalPrice | unitPrice("RM") }}</div>
        </template>
        <template slot-scope="{ row }" slot="settlementPrice">
          <div>{{ row.settlementPrice | unitPrice("RM") }}</div>
        </template>
        <template slot-scope="{ row }" slot="quantity">
          <div>{{ row.activeStock }}</div>
        </template>
        <template slot-scope="{ row }" slot="startTime">
          <div>{{ row.startTime }}</div>
          <div>{{ row.endTime }}</div>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            v-if="row.promotionStatus === 'CLOSE' || row.promotionStatus === 'NEW'"
            type="info"
            size="small"
            @click="edit(row.id)"
            style="margin-right: 5px"
            >edit</Button
          >
          <Button
            v-if="row.promotionStatus === 'START' || row.promotionStatus === 'NEW'"
            type="warning"
            size="small"
            @click="statusChanged(row.id, 'CLOSE')"
            style="margin-right: 5px"
            >Close</Button
          >
          <Button
            v-if="row.promotionStatus === 'CLOSE' || row.promotionStatus === 'END'"
            type="error"
            size="small"
            @click="close(row.id)"
            style="margin-right: 5px"
            >delete</Button
          >
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
  getPointsGoodsList,
  editPointsGoodsStatus,
  deletePointsGoodsStatus,
} from "@/api/promotion";
import vueQr from "vue-qr";
import { promotionsStatusRender } from "@/utils/promotions";

export default {
  name: "pointsGoods",
  components: {
    "vue-qr": vueQr,
  },
  data() {
    return {
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime",
        order: "desc", // default排序方式
      },
      statusList: [
        // 活动state
        { label: "未开始", value: "NEW" },
        { label: "已开始", value: "START" },
        { label: "已结束", value: "END" },
        { label: "已Close", value: "CLOSE" },
      ],
      columns: [
        // 表头
        {
          title: "goods name",
          slot: "goodsName",
          minWidth: 150,
          fixed: "left",
          tooltip: true,
        },
        {
          title: "市场价",
          slot: "price",
          width: 100,
        },
        {
          title: "结算价",
          slot: "settlementPrice",
          width: 100,
        },
        {
          title: "stockQuantity",
          slot: "quantity",
          width: 100,
        },
        {
          title: "活动剩余stock",
          key: "activeStock",
          width: 150,
        },
        {
          title: "兑换积分",
          key: "points",
          width: 100,
        },
        {
          title: "所属店铺",
          key: "storeName",
          width: 100,
        },
        {
          title: "活动开始时间",
          slot: "startTime",
          minWidth: 150,
        },
        {
          title: "state",
          key: "promotionStatus",
          width: 100,
          render: (h, params) => {
            return promotionsStatusRender(h, params);
          },
        },
        {
          title: "分类",
          key: "pointsGoodsCategoryName",
          width: 100,
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
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getDataList();
    },
    // 跳转Add goodsPage面
    addPointsGoods() {
      this.$router.push({ name: "add-points-goods" });
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
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      if (this.searchForm.pointsS) {
        this.searchForm.points =
          this.searchForm.pointsS +
          "_" +
          (this.searchForm.pointsE ? this.searchForm.pointsE : "");
      }
      this.getDataList();
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;
      getPointsGoodsList(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // edit
    edit(id) {
      this.$router.push({ name: "edit-points-goods", query: { id: id } });
    },
    // 启用 停用积分Goods
    statusChanged(id, status, startTime, endTime) {
      let text = "";
      let params = {};
      if (status == "START") {
        text = "Opening";
        params = {
          startTime: startTime,
          endTime: endTime,
        };
      } else if (status == "CLOSE") {
        text = "Close";
      }
      this.$Modal.confirm({
        title: "确认" + text,
        content: "您确认要" + text + "此积分Goods?",
        loading: true,
        onOk: () => {
          editPointsGoodsStatus(id, params).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success(text + "success");
              this.getDataList();
            }
          });
        },
      });
    },
    // delete积分Goods
    close(id) {
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete此积分Goods?",
        loading: true,
        onOk: () => {
          // delete
          deletePointsGoodsStatus(id).then((res) => {
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
