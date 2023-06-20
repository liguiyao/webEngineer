<template>
  <div class="search">
    <Card>
      <Form
        ref="searchForm"
        @keydown.enter.native="handleSearch"
        :model="searchForm"
        inline
        :label-width="70"
        class="search-form"
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
        <Button @click="handleSearch" class="search-btn" type="primary" icon="ios-search"
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
        <template slot="goodsSlot" slot-scope="scope">
          <div style="margin-top: 5px; height: 80px; display: flex">
            <div style="">
              <img
                :src="scope.row.original"
                style="height: 60px; margin-top: 3px; width: 60px"
              />
            </div>

            <div style="margin-left: 13px">
              <div class="div-zoom">
                <a>{{ scope.row.goodsName }}</a>
              </div>
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
import { authGoods, getAuthGoodsListData } from "@/api/goods";

export default {
  name: "goods",
  components: {},
  data() {
    return {
      id: "", //要operation的id
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "create_time", // default排序字段
        order: "desc", // default排序方式
      },
      goodsAuditForm: {
        // Goodsedit表单
        auth_flag: 1,
      },
      columns: [
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 180,
          slot: "goodsSlot",
          tooltip: true,
        },
        {
          title: "Goods number",
          key: "id",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "price",
          key: "price",
          minWidth: 130,
          render: (h, params) => {
            return h("div", this.$options.filters.unitPrice(params.row.price, "RM"));
          },
        },
        {
          title: "audit status",
          key: "authFlag",
          minWidth: 130,
          render: (h, params) => {
            if (params.row.authFlag == "TOBEAUDITED") {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "wait",
                  },
                }),
              ]);
            } else if (params.row.authFlag == "PASS") {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "pass",
                  },
                }),
              ]);
            } else if (params.row.authFlag == "REFUSE") {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "reject",
                  },
                }),
              ]);
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
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.examine(params.row, 1);
                    },
                  },
                },
                "pass"
              ),
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
                      this.examine(params.row, 2);
                    },
                  },
                },
                "reject"
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
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    init() {
      // 初始化数据
      this.getDataList();
    },
    changePage(v) {
      // 改变Page码
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePageSize(v) {
      // 改变每PageQuantity
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      // search
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    getDataList() {
      // 获取列表数据
      this.loading = true;
      // 带多items件search参数获取表单数据
      this.searchForm.authFlag = 0;
      getAuthGoodsListData(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    examine(v, authFlag) {
      // 审核Goods
      let examine = "pass";
      this.goodsAuditForm.authFlag = "PASS";
      if (authFlag != 1) {
        examine = "reject";
        this.goodsAuditForm.authFlag = "REFUSE";
      }
      this.$Modal.confirm({
        title: "confirm",
        content: "confirm audit " + examine + " " + v.goodsName + " ?",
        loading: true,
        onOk: () => {
          authGoods(v.id, this.goodsAuditForm).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("audit success");
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
