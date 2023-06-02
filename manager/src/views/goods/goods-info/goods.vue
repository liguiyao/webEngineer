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
        <Form-item label="Goods编号" prop="id">
          <Input
            type="text"
            v-model="searchForm.id"
            placeholder="Please enter Goods编号"
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
        <Form-item label="状态" prop="status">
          <Select
            v-model="searchForm.marketEnable"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="UPPER">上架</Option>
            <Option value="DOWN">下架</Option>
          </Select>
        </Form-item>
        <Form-item label="销售模式" prop="status">
          <Select
            v-model="searchForm.salesModel"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="RETAIL">零售</Option>
            <Option value="WHOLESALE">批发</Option>
          </Select>
        </Form-item>
        <Form-item label="Goods类型" prop="status">
          <Select
            v-model="searchForm.goodsType"
            placeholder="Please select"
            clearable
            style="width: 200px"
          >
            <Option value="PHYSICAL_GOODS">实物Goods</Option>
            <Option value="VIRTUAL_GOODS">虚拟Goods</Option>
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
              <Poptip trigger="hover" title="扫码在手机中查看" transfer>
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
      title="下架operation"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="underForm" :model="underForm" :label-width="100">
        <FormItem label="下架原因" prop="reason">
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
      loading: true, // 表单加载状态
      modalVisible: false, // 添加或编辑显示
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "create_time", // default排序字段
        order: "desc", // default排序方式
      },
      underForm: {
        // 下架原因
        reason: "",
      },
      submitLoading: false, // 添加或编辑Submit状态
      columns: [
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 180,
          slot: "goodsSlot",
        },
        {
          title: "Goods编号",
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
          title: "销售模式",
          key: "salesModel",
          width: 100,
          render: (h, params) => {
            if (params.row.salesModel === "RETAIL") {
              return h("Tag", { props: { color: "orange" } }, "零售");
            } else if (params.row.salesModel === "WHOLESALE") {
              return h("Tag", { props: { color: "magenta" } }, "批发");
            } else {
              return h("Tag", { props: { color: "volcano" } }, "Others类型");
            }
          },
        },
        {
          title: "Goods类型",
          key: "goodsType",
          width: 130,
          render: (h, params) => {
            if (params.row.goodsType === "PHYSICAL_GOODS") {
              return h("Tag", { props: { color: "green" } }, "实物Goods");
            } else if (params.row.goodsType === "VIRTUAL_GOODS") {
              return h("Tag", { props: { color: "volcano" } }, "虚拟Goods");
            } else {
              return h("Tag", { props: { color: "geekblue" } }, "电子卡券");
            }
          },
        },
        {
          title: "状态",
          key: "marketEnable",
          width: 100,
          render: (h, params) => {
            if (params.row.marketEnable == "DOWN") {
              return h("Tag", { props: { color: "volcano" } }, "下架");
            } else if (params.row.marketEnable == "UPPER") {
              return h("Tag", { props: { color: "green" } }, "上架");
            }
          },
        },
        {
          title: "审核状态",
          key: "authFlag",
          width: 130,
          render: (h, params) => {
            if (params.row.authFlag == "TOBEAUDITED") {
              return h("Tag", { props: { color: "volcano" } }, "待审核");
            } else if (params.row.authFlag == "PASS") {
              return h("Tag", { props: { color: "green" } }, "通过");
            } else if (params.row.authFlag == "REFUSE") {
              return h("Tag", { props: { color: "red" } }, "拒绝");
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
                  "上架"
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
                  "查看"
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
                  "下架"
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
                  "查看"
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
    // 分页 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 分页 改变页数
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
    // 编辑
    edit(v) {
      this.id = v.id;
      if (v.underMessage) {
        this.underForm.reason = v.underMessage;
      } else {
        this.underForm.reason = "";
      }
      this.modalVisible = true;
    },
    // 下架
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
        title: "确认上架",
        content: "您确认要上架 " + v.goodsName + " ?",
        loading: true,
        onOk: () => {
          upGoods(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("上架success");
              this.getDataList();
            }
          });
        },
      });
    },

    //查看Goods详情
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
