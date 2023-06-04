<template>
  <div>
    <Card>
      <Form @keydown.enter.native="handleSearch" ref="searchForm" :model="searchForm" inline :label-width="70"
        class="search-form">
        <Form-item label="goods name" prop="goodsName">
          <Input type="text" v-model="searchForm.goodsName" placeholder="Please enter goods name" clearable style="width: 200px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Row class="operation" style="margin:10px 0;">
        <Button @click="delAll" type="primary">Bulk removal</Button>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"
        @on-selection-change="changeSelect">
        <template slot="goodsName" slot-scope="{row}">
          <div>
            <div class="div-zoom">
              <a @click="linkTo(row.goodsId,row.skuId)">{{row.goodsName}}</a>
            </div>
            <Poptip trigger="hover" title="Scan code to view" transfer>
              <div slot="content">
                <vue-qr :text="wapLinkTo(row.goodsId,row.skuId)" :margin="0" colorDark="#000" colorLight="#fff"
                  :size="150"></vue-qr>
              </div>
              <img src="../../assets/qrcode.svg" class="hover-pointer" width="20" height="20" alt="">
            </Poptip>
          </div>
        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
          @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator
          show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getDistributionGoods, delDistributionGoods } from "@/api/distribution";
import vueQr from "vue-qr";
export default {
  components: {
    "vue-qr": vueQr,
  },
  name: "distributionGoods",
  data() {
    return {
      loading: true, // 表单加载状态
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // default排序字段
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
          title: "Goods image",
          fixed: "left",
          key: "thumbnail",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.thumbnail || '',
                alt: "load failed",
              },
              style: {
                cursor: "pointer",
                width: "80px",
                height: "60px",
                margin: "10px 0",
                "object-fit": "contain",
              },
            });
          },
        },
        {
          title: "goods name",
          slot: "goodsName",
          minWidth: 200,
          tooltip: true,
        },
        {
          title: "Goodsprice",
          key: "price",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.price, "RM")
            );
          },
        },
        {
          title: "stock",
          key: "quantity",
          minWidth: 80,
        },
        {
          title: "add time",
          key: "createTime",
          minWidth: 100,
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "amount",
          key: "commission",
          minWidth: 100,
          sortable: false,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.commission, "RM")
            );
          },
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "Take off"
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
    // 分页 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
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
    // 清除选中状态
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    // 选中后赋值
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;
      getDistributionGoods(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // 下架Goods
    remove(v) {
      this.$Modal.confirm({
        title: "confirm take off",
        content: "confirm to Take off ?",
        loading: true,
        onOk: () => {
          // 下架
          delDistributionGoods(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Take off success");
              this.getDataList();
            }
          });
        },
      });
    },
    // 批量下架
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("not select Take off data");
        return;
      }
      this.$Modal.confirm({
        title: "confirm Take off",
        content: "confirm Take off " + this.selectCount + " data ?",
        loading: true,
        onOk: () => {
          let ids = [];
          this.selectList.forEach((item) => {
            ids.push(item.id);
          });
          // 批量下架
          delDistributionGoods(ids.toString()).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("Take off success");
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


