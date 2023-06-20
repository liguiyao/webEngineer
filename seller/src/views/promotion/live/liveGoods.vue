<template>
  <div class="wrapper">
    <Card>
      <Form ref="searchForm" :model="params" inline :label-width="100" class="search-form">
        <Form-item label="goods name">
          <Input type="text" v-model="params.name" placeholder="Please enter goods name" clearable style="width: 200px" />
        </Form-item>

        <Button @click="getLiveGoodsMethods('clear')" type="primary" class="search-btn" icon="ios-search">search</Button>
      </Form>
      <h4 v-if="!reviewed">
        由于直播Goods需经过小程序直播平台的审核，你需要在此先提审Goods，为了不影响直播间选取Goods，Please 提前1天提审Goods；
      </h4>

      <div>
        <Tabs v-model="params.auditStatus">
          <TabPane v-for="(item,index) in liveTabWay" :key="index" :label="item.label" :name="item.type+''">
          </TabPane>
        </Tabs>
      </div>

      <Button v-if="!reviewed" type="primary" style="margin-bottom:10px;" @click="addNewLiveGoods" icon="md-add">selectGoods</Button>
      <Button type="primary" v-if="params.auditStatus == 0" ghost style="margin:0 0 10px 10px" @click="getLiveGoodsMethods('clear')">更新state</Button>
      <div style="position:relative">
        <Spin size="large" fix v-if="tableLoading">
        </Spin>
        <Table class="mt_10" disabled-hover :columns="liveGoodsColumns" :data="liveGoodsData">

          <template slot-scope="{ row }" slot="goodsName">
            <div class="flex-goods">
              <img class="thumbnail" :src="row.thumbnail || row.goodsImage">
              {{ row.goodsName || row.name }}
            </div>
          </template>
          <template slot-scope="{ row ,index }" class="price" slot="price">
            <!-- 如果为新增Goods显示 -->

            <RadioGroup v-if="params.auditStatus == 99" @on-change="changeRadio(row,'priceType')" v-model="row.priceType">
              <div class="price-item">
                <Radio :label="1">一口价:</Radio>
                <InputNumber :min="0.1" v-if="liveGoodsData[index].priceType == 1" style="width:100px" v-model="liveGoodsData[index].price"></InputNumber>
              </div>
              <div class="price-item">
                <Radio :label="2">区间价:</Radio> <span v-if="liveGoodsData[index].priceType == 2">
                  <InputNumber :min="0.1" style="width:100px" v-model="liveGoodsData[index].price" />至
                  <InputNumber :min="0.1" style="width:100px" v-model="liveGoodsData[index].price2" />
                </span>
              </div>
              <div class="price-item">
                <Radio :label="3">off扣价:</Radio> <span v-if="liveGoodsData[index].priceType == 3">原价<InputNumber :min="0.1" style="width:100px" v-model="liveGoodsData[index].price"></InputNumber>现价
                  <InputNumber :min="0.1" style="width:100px" v-model="liveGoodsData[index].price2" />
                </span>
              </div>
            </RadioGroup>
            <div v-else>
              <div v-if="row.priceType == 1">{{row.price | unitPrice('RM')}}</div>
              <div v-if="row.priceType == 2">{{row.price | unitPrice('RM')}}至{{row.price2 | unitPrice('RM')}}</div>
              <div v-if="row.priceType == 3">{{row.price2 | unitPrice('RM')}}<span class="original-price">{{row.price | unitPrice('RM')}}</span></div>
            </div>

          </template>

          <template slot-scope="{ row,index }" slot="action">
            <Button v-if="params.auditStatus == 99" type="primary" @click="()=>{liveGoodsData.splice(index,1)}">delete</Button>
            <Button v-if="params.auditStatus != 99 && !reviewed" ghost type="primary" @click="()=>{$router.push({path:'/goods-operation-edit',query:{id:row.goodsId}})}">View</Button>
            <Button v-if="reviewed" :type="row.___selected ? 'primary' : 'default'" @click="selectedLiveGoods(row,index)">{{row.___selected ? '已':''}}select</Button>
          </template>
        </Table>
        <div class="flex">
          <Page size="small" :total="goodsTotal" @on-change="changePageNumber" class="pageration" @on-page-size-change="changePageSize" :page-size="params.pageSize" show-total show-elevator
            show-sizer>
          </Page>

        </div>
      </div>
    </Card>
    <sku-select ref="skuSelect" @selectedGoodsData="selectedGoodsData"></sku-select>
    <div v-if="params.auditStatus == 99" class="submit">
      <Button type="primary" :loading="saveGoodsLoading" @click="saveLiveGoods">SaveGoods</Button>
    </div>
  </div>
</template>

<script>
import skuSelect from "@/views/lili-dialog"; //selectGoods组件
import { addLiveStoreGoods, getLiveGoods } from "@/api/promotion.js";
export default {
  components: {
    skuSelect,
  },
  data() {
    return {
      goodsTotal: 0, //Goods总数
      saveGoodsLoading: false, //SaveGoods加载
      tableLoading: false, //表格是否加载
      params: {
        pageNumber: 1,
        pageSize: 10,
        auditStatus: 2, //goods status
      },
      // Goodsaudit state
      liveTabWay: [
        {
          label: "待提审",
          type: 0,
        },
        {
          label: "已审核",
          type: 2,
        },

        {
          label: "审核中",
          type: 1,
        },

        {
          label: "审核未pass",
          type: 3,
        },
      ],

      // Goods表格columns
      liveGoodsColumns: [
        {
          title: "Goods",
          slot: "goodsName",
        },
        {
          title: "price",
          slot: "price",
        },
        {
          title: "stock",
          key: "quantity",
          width: 100,
        },

        {
          title: "operation",
          slot: "action",
          width: 100,
        },
      ],
      // 表格Goods Detail
      liveGoodsData: [],
      // 已选Goods
      selectedGoods: [],
    };
  },
  props: {
    // 是否是已审核，此处为组件模式时使用。去除添加等功能 只保留查询以及新增select回调数据
    reviewed: {
      type: Boolean,
      default: false,
    },
    // 初始化信息，此处为组件模式时使用。父级将数据传输到此方法上
    init: {
      type: null,
      default: "",
    },
  },
  watch: {
    //此处为组件模式时使用 监听此处为Opening则需要deletetab上面的数据只显示已审核
    reviewed: {
      handler(val) {
        if (val) {
          this.liveTabWay = this.liveTabWay.filter((item) => {
            return item.label == "已审核";
          });
        }
      },
      immediate: true,
    },
    //此处为组件模式时使用 监听父级给传值
    init: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            // 将当前父级Back的数据和当前数据进行匹配
            this.selectedGoods = val;
            this.liveGoodsData.forEach((item, index) => {
              val.forEach((callback) => {
                if (item.id == callback.id) {
                  this.$set(this.liveGoodsData[index], "___selected", true);
                  // this.selectedGoods.push(item);
                }
              });
            });
          });
        }
      },
      immediate: true,
    },
    // 监听如果次数变化说明用户再点击tab
    "params.auditStatus": {
      handler(val) {
        this.liveGoodsData = [];
        if (val != 99) {
          this.params.pageNumber = 1;
          this.getLiveGoodsMethods();
        }
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * 回调参数补充
     */
    selectedLiveGoods(val, index) {
      this.$emit("selectedGoods", val);
    },
    /**
     * 解决radio数据不回显问题
     */
    changeRadio(val) {
      this.$set(this.liveGoodsData[val._index], "priceType", val.priceType);
    },
    /**
     * Page面数据大小分Page回调
     */
    changePageSize(val) {
      this.params.pageSize = val;
      this.getLiveGoodsMethods("clear");
    },
    /**
     * 分Page回调
     */
    changePageNumber(val) {
      this.params.pageNumber = val;
      this.getLiveGoodsMethods("clear");
    },
    /**
     * 清除新增的tab
     */
    clearNewLiveTab() {
      this.liveTabWay.map((item, index) => {
        return item.type == 99 && this.liveTabWay.splice(index, 1);
      });
    },

    /**
     * 查询Goods
     */
    async getLiveGoodsMethods(type) {
      this.tableLoading = true;

      let result = await getLiveGoods(this.params);
      if (result.success) {
        // 将表格数据清除
        if (type == "clear") {
          this.liveGoodsData = [];
        }
        this.liveGoodsData.push(...result.result.records);
        this.goodsTotal = result.result.total;
      }
      this.tableLoading = false;
    },

    /**
     * Save直播Goods
     */
    async saveLiveGoods() {
      this.saveGoodsLoading = true;
      let submit = this.liveGoodsData.map((element) => {

        return {
          goodsId: element.goodsId, //Goodsid
          goodsImage: element.small, //Goods images  最大为 300 * 300
          name: element.goodsName, //Goods昵称
          price: parseInt(element.price), //Goodsprice
          quantity: element.quantity, //stock
          price2: element.price2 ? parseInt(element.price2) : "", //Goodsprice
          priceType: element.priceType, // priceType  Number  是  price类型，1：一口价（只需要传入price，price2不传） 2：price区间（price字段为左边界，price2字段为右边界，price和price2必传） 3：显示off扣价（price字段为原价，price2字段为现价， price和price2必传）
          skuId: element.id,
          url: `pages/product/goods?id=${element.id}&goodsId=${element.goodsId}`, //小程序address
        };
      });

      let result = await addLiveStoreGoods(submit);
      if (result.success) {
        this.$Message.success({
          content: `添加success！`,
        });

        this.params.auditStatus = 0;
      }
      this.saveGoodsLoading = false;
    },

    /**
     * Goodsselect器回调goods信息
     */
    selectedGoodsData(goods) {
      goods.map((item) => {
        return (item.priceType = 1);
      });

      this.liveGoodsData.push(...goods);
    },

    /**
     * 新增Goods
     */
    addNewLiveGoods() {
      this.clearNewLiveTab();
      this.liveTabWay.push({
        type: 99,
        label: "新增Goods",
      });
      this.$set(this, "liveGoodsData", []);
      this.params.auditStatus = 99;
      this.$refs.skuSelect.open("goods");
      this.$refs.skuSelect.goodsData = JSON.parse(
        JSON.stringify(this.liveGoodsData)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/table-common.scss";
.search-form {
  margin-bottom: 10px;
}
.flex {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
.wrapper {
  position: relative;
}
.thumbnail {
  width: 100px;
  height: 100px;
  border-radius: 0.4em;
}
.flex-goods {
  margin: 10px;
  display: flex;

  align-items: center;
  > img {
    margin-right: 10px;
  }
}
.price-item {
  margin: 15px 5px;
  > * {
    margin: 5px;
  }
}
.submit {
  box-shadow: 3px 5px 12px rgba(0, 0, 0, 0.1);
  height: 60px;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.original-price {
  margin-left: 10px;
  color: #999;
  text-decoration: line-through;
}

h4 {
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  color: #333;
  font-size: 12px;
  line-height: 40px;
  text-align: left;
}
</style>
