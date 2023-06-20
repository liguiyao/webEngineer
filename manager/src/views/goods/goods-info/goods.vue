<template>
  <div class="search">
    <Card>
      <Form
        ref="searchForm"
        :model="searchForm"
        inline
        :label-width="70"
        class="search-form"
        @keydown.enter.native="handleSearch"
      >
        <Form-item label="goods name" prop="goodsName">
          <Input
            type="text"
            v-model="searchForm.goodsName"
            placeholder="Please enter goods name"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="Goods number" prop="id">
          <Input
            type="text"
            v-model="searchForm.id"
            placeholder="Please enter Goods number"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="store name" prop="id">
          <Input
            type="text"
            v-model="searchForm.storeName"
            placeholder="Please enter store name"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="status" prop="status">
          <Select
            v-model="searchForm.marketEnable"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="UPPER">put on</Option>
            <Option value="DOWN">put off</Option>
          </Select>
        </Form-item>
        <Form-item label="sales model" prop="status">
          <Select
            v-model="searchForm.salesModel"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="RETAIL">retail</Option>
            <Option value="WHOLESALE">wholesale</Option>
          </Select>
        </Form-item>
        <Form-item label="Goods type" prop="status">
          <Select
            v-model="searchForm.goodsType"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="PHYSICAL_GOODS">Physical Goods</Option>
            <Option value="VIRTUAL_GOODS">Virtual Goods</Option>
          </Select>
        </Form-item>
        <Button
          @click="handleSearch"
          class="search-btn"
          type="primary"
          icon="ios-search"
          >search</Button
        >
      </Form>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        class="mt_10"
      >
        <!-- Goods栏目格式化 -->
        <template slot="goodsSlot" slot-scope="{ row }">
          <div style="margin: 5px 0px; height: 80px; display: flex">
            <div style="">
              <img
                :src="row.original"
                style="height: 60px; margin-top: 1px; width: 60px"
              />
            </div>

            <div style="margin-left: 13px">
              <div class="div-zoom">
                <a @click="linkTo(row.id, row.skuId)">{{ row.goodsName }}</a>
              </div>
              <Poptip trigger="hover" title="Scan QR to view" transfer>
                <div slot="content">
                  <vue-qr
                    :text="wapLinkTo(row.id, row.skuId)"
                    :margin="0"
                    colorDark="#000"
                    colorLight="#fff"
                    :size="150"
                  ></vue-qr>
                </div>
                <img
                  src="../../../assets/qrcode.svg"
                  class="hover-pointer"
                  width="20"
                  height="20"
                  alt=""
                />
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
    <Modal
      title="Offoperation"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="underForm" :model="underForm" :label-width="100">
        <FormItem label="Off原因" prop="reason">
          <Input v-model="underForm.reason" clearable style="width: 100%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="lower"
          >Submit</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import { getGoodsListData, upGoods, lowGoods } from "@/api/goods";
import vueQr from "vue-qr";
export default {
  components: {
    "vue-qr": vueQr,
  },
  name: "goods",
  data() {
    return {
      id: "", //要operation的id
      loading: true, // 表单加载state
      modalVisible: false, // 添加或edit显示
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "create_time", // default排序字段
        order: "desc", // default排序方式
      },
      underForm: {
        // Off原因
        reason: "",
      },
      submitLoading: false, // 添加或editSubmitstate
      columns: [
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 180,
          slot: "goodsSlot",
        },
        {
          title: "Goods number",
          key: "id",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "price",
          key: "price",
          width: 130,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.price, "RM")
            );
          },
        },
        {
          title: "Sales model",
          key: "salesModel",
          width: 100,
          render: (h, params) => {
            if (params.row.salesModel === "RETAIL") {
              return h("Tag", { props: { color: "orange" } }, "Retail");
            } else if (params.row.salesModel === "WHOLESALE") {
              return h("Tag", { props: { color: "magenta" } }, "Wholesale");
            } else {
              return h("Tag", { props: { color: "volcano" } }, "Others type");
            }
          },
        },
        {
          title: "Goods type",
          key: "goodsType",
          width: 130,
          render: (h, params) => {
            if (params.row.goodsType === "PHYSICAL_GOODS") {
              return h("Tag", { props: { color: "green" } }, "Physical Goods");
            } else if (params.row.goodsType === "VIRTUAL_GOODS") {
              return h("Tag", { props: { color: "volcano" } }, "Virtual Goods");
            } else {
              return h("Tag", { props: { color: "geekblue" } }, "Coupon");
            }
          },
        },
        {
          title: "status",
          key: "marketEnable",
          width: 100,
          render: (h, params) => {
            if (params.row.marketEnable == "DOWN") {
              return h("Tag", { props: { color: "volcano" } }, "Off");
            } else if (params.row.marketEnable == "UPPER") {
              return h("Tag", { props: { color: "green" } }, "On");
            }
          },
        },
        {
          title: "audit status",
          key: "authFlag",
          width: 130,
          render: (h, params) => {
            if (params.row.authFlag == "TOBEAUDITED") {
              return h("Tag", { props: { color: "volcano" } }, "wait");
            } else if (params.row.authFlag == "PASS") {
              return h("Tag", { props: { color: "green" } }, "pass");
            } else if (params.row.authFlag == "REFUSE") {
              return h("Tag", { props: { color: "red" } }, "reject");
            }
          },
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
          width: 150,
          render: (h, params) => {
            if (params.row.marketEnable == "DOWN") {
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
                        this.upper(params.row);
                      },
                    },
                  },
                  "On"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row);
                      },
                    },
                  },
                  "view"
                ),
              ]);
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      },
                    },
                  },
                  "take off"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row);
                      },
                    },
                  },
                  "view"
                ),
              ]);
            }
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
    // 分Page 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分Page 改变Page数
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
    // 获取数据
    getDataList() {
      this.loading = true;
      getGoodsListData(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // edit
    edit(v) {
      this.id = v.id;
      if (v.underMessage) {
        this.underForm.reason = v.underMessage;
      } else {
        this.underForm.reason = "";
      }
      this.modalVisible = true;
    },
    // Off
    lower() {
      lowGoods(this.id, this.underForm).then((res) => {
        this.$Modal.remove();
        if (res.success) {
          this.$Message.success("operationsuccess");
          this.modalVisible = false;
          this.getDataList();
        }
      });
    },
    // 商家
    upper(v) {
      this.$Modal.confirm({
        title: "Confirm the shelf",
        content: "Confirm the shelf " + v.goodsName + " ?",
        loading: true,
        onOk: () => {
          upGoods(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("shelf success");
              this.getDataList();
            }
          });
        },
      });
    },

    //ViewGoods Detail
    showDetail(v) {
      let id = v.id;
      this.$router.push({
        name: "goods-detail",
        query: { id: id },
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
