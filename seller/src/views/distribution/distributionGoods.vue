<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="goods name" prop="goodsName">
            <Input type="text" v-model="searchForm.goodsName" placeholder="Please enter goods name" clearable style="width: 200px"/>
          </Form-item>
          <Button @click="handleSearch" type="primary" class="search-btn">search</Button>
        </Form>
      </Row>
      <Row class="operation padding-row">
        <Button @click="add" type="primary">Add</Button>
      </Row>
      <Table class="mt_10" :loading="loading" border :columns="columns" :data="data" ref="table" >
        <!-- Goods栏目格式化 -->
        <template slot="goodsSlot" slot-scope="{row}">
          <div style="margin-top: 5px;height: 70px; display: flex;">
            <div style="">
              <img :src="row.thumbnail" style="height: 60px;margin-top: 3px;width: 60px">
            </div>

            <div style="margin-left: 13px;">
              <div class="div-zoom">
                <a @click="linkTo(row.id,row.skuId)">{{row.goodsName}}</a>
              </div>
              <Poptip trigger="hover" title="扫码在手机中查看" transfer>
                <div slot="content">
                  <vue-qr :text="wapLinkTo(row.id,row.skuId)"  :margin="0" colorDark="#000" colorLight="#fff" :size="150"></vue-qr>
                </div>
                <img src="../../assets/qrcode.svg" class="hover-pointer" width="20" height="20" alt="">
              </Poptip>
            </div>
          </div>

        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
    <liliDialog
      ref="liliDialog"
      @selectedGoodsData="selectedGoodsData"
    ></liliDialog>
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
        <FormItem label="分销佣金" prop="commission">
          <Input v-model="form.commission" clearable style="width: 100%"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit"
        >Submit
        </Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
        getDistributionGoods,
        distributionGoodsCancel,
        distributionGoodsCheck
    } from "@/api/distribution";
import liliDialog from "../lili-dialog/index";

import {getShopListData} from '@/api/shops'
export default {
  name: "distributionGoods",
  components: {
    liliDialog
  },
  data() {
    return {
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      submitLoading: false, // 添加或编辑Submit状态
      shopList:[], // 店铺列表
      loading: true, // 表单加载状态
      searchForm: { // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
      },
      selectList: [], // 多选数据
      form:{
        commission : 1 // 分销金额
      },
      skuId:0, // 当前分销Goods的skuId
      formValidate: {
        commission: [
          { required: true, message: 'Please enter 大于1小于9999的合法分销金额'},
          {
            pattern:  /^[1-9]\d{0,3}(\.\d{1,2})?$/,
            message: "Please enter 大于1小于9999的合法分销金额",
            trigger: "change"
          }],
      },
      columns: [ // 表格表头
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 250,
          slot: "goodsSlot",
        },
        {
          title: "Goodsprice",
          key: "price",
          width: 130,
          render: (h, params) => {
            return h("div", this.$options.filters.unitPrice(params.row.price,'RM'));
          }
        },
        {
          title: "库存",
          key: "quantity",
          width: 100
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 120,
        },
        {
            title: "佣金金额",
            key: "commission",
            width: 120,
            render: (h, params) => {
                if(params.row.commission !=null){
                  return h("div", this.$options.filters.unitPrice(params.row.commission,'RM'));
                }else{
                  return h("div", this.$options.filters.unitPrice(0,'RM'));
                }
            }
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "delete"
              )
            ]);
          }
        }
      ],
      data: [], // 表单数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() { // 初始化数据
      this.getDataList();
    },
    // selectGoods回调
    selectedGoodsData(v){
      this.modalVisible = true
      this.form.commission = 1
      this.modalTitle = "Save分销Goods"
      this.skuId = v[0].id
    },
    // 添加Goodsmodal
    add(){
      this.$refs.liliDialog.flag = true;
      this.$refs.liliDialog.goodsFlag = true;
      this.$refs.liliDialog.singleGoods();
    },
    // 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.$refs.table.selectAll(false);
    },
    // 添加Goods
    handleSubmit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          distributionGoodsCheck(this.skuId,this.form).then(res => {
            if(res.message === 'success') {
              this.$Message.success("添加success");
            }
            this.modalVisible = false
            this.getDataList()
          });
        }
      })
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
    // 获取Goods列表
    getDataList() {
      this.loading = true;
      // 带多条件search参数获取表单数据 Please 自行modify接口
      getDistributionGoods(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // deleteGoods
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "您确认要delete此分销Goods么?",
        loading: true,
        onOk: () => {
          // delete
          distributionGoodsCancel(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getDataList();
            }
          });
        }
      });
    },
    // 获取店铺列表 search项用
    getShopList (val) {
      const params = {
        pageNumber:1,
        pageSize:10,
        storeName:''
      }
      if (val) {
        params.storeName = val;
      } else {
        params.storeName = ''
      }

      getShopListData(params).then(res => {
        this.shopList = res.result.records
      })
    },
    searchChange(val){
      this.getShopList(val)
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
  @import "@/styles/table-common.scss";
  .search-form{
    width: 100%;
  }
</style>
