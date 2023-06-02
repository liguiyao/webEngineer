<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="会员名称" prop="memberName">
          <Input
            type="text"
            v-model="searchForm.memberName"
            placeholder="Please enter 会员名称"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="store name" prop="storeName">
          <Input
            type="text"
            v-model="searchForm.storeName"
            placeholder="Please enter store name"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="Create time" prop="createTime">
          <DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" clearable @on-change="selectDateRange" placeholder="select起始时间" style="width: 200px"></DatePicker>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]"
              size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
  </div>
</template>

<script>
  import {
    getShopListData,
    shopAudit
  } from "@/api/shops";
  import shopOperation from "./shopOperation";
  export default {
    name: "shop",
    components: {
      shopOperation,
    },
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
        },
        selectDate: null, // Create time
        columns: [
          // 表头
          {
            title: "store name",
            key: "storeName",
            minWidth: 120,
            align: "left",
          },
          {
            title: "会员名称",
            key: "memberName",
            align: "left",
            minWidth: 120,
          },
          {
            title: "店铺address",
            key: "storeAddressPath",
            width: 300,
            sortable: false,
            render: (h, params) => {
            return h(
              "Tag",
              {

              },
              params.row.storeAddressPath ||  "暂未enter "
            );
          },
          },
          {
            title: "是否自营",
            key: "selfOperated",
            align: "left",
            width: 120,
            render: (h, params) => {
              return h(
                "Tag",
                {
                  props: {
                    color: params.row.selfOperated ? "default" : "success",
                  },
                },
                params.row.selfOperated ? "自营" : "非自营"
              );
            },
          },

          {
            title: "Create time",
            key: "createTime",
            align: "left",
            width: 170,
            sortable: false,
          },
          {
            title: "operation",
            key: "action",
            width: 170,
            align: "center",
            fixed: "right",
            render: (h, params) => {
              if (params.row.storeDisable == "APPLYING") {
                return h(
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
                          this.edit(params.row);
                        },
                      },
                    },
                    "查看"
                  )
              }
            },
          },
        ],
        data: [], // 表单数据
        total: 0 // 表单数据总数
      };
    },

    methods: {
      // 回调给父级
      callback(val) {
        this.$emit("callback", val);
      },
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
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = v;
        this.getDataList();
      },
      // search
      handleSearch() {
        this.searchForm.pageNumber = 1;
        this.getDataList();
      },
      // 起止时间从新赋值
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      // 获取列表数据
      getDataList() {
        this.loading = true;
        // 带多条件search参数获取表单数据 Please 自行modify接口
        this.searchForm.storeDisable='APPLYING'
        getShopListData(this.searchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.data = res.result.records;
            this.total = res.result.total;
          }
        });
        this.total = this.data.length;
        this.loading = false;
      },
      // 查看店铺
      edit(v) {
        this.$router.push({ path: '/shop-operation', query: { shopId: v.id } });
      },

    },
    mounted() {
      this.init();
    },
  };
</script>
