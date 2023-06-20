<template>
  <div class="wrapper">
    <div class="wap-content">
      <div class="query-wrapper">
        <div class="query-item">
          <div>search范围</div>
          <Input placeholder="goods name" @on-clear="goodsData=[]; goodsParams.goodsName='';  getQueryGoodsList()" @on-enter="()=>{goodsData=[]; getQueryGoodsList();}" clearable style="width: 150px"
            v-model="goodsParams.goodsName" />
        </div>
        <div class="query-item">
          <Cascader v-model="category" placeholder="Please selectGoods Category" style="width: 150px" :data="cateList"></Cascader>
        </div>
        <div class="query-item">
          <Button type="primary" @click="goodsData=[]; getQueryGoodsList();" icon="ios-search">search</Button>
        </div>
      </div>
      <div >
        <Scroll class="wap-content-list" :on-reach-bottom="handleReachBottom" :distance-to-edge="[3,3]">

          <div class="wap-content-item" :class="{ active: item.selected }" @click="checkedGoods(item, index)" v-for="(item, index) in goodsData" :key="index">
            <div>
              <img :src="item.thumbnail" alt="" />
            </div>
            <div class="wap-content-desc">
              <div class="wap-content-desc-title">{{ item.goodsName }}</div>
              <div class="wap-sku">{{ item.goodsUnit }}</div>
              <div class="wap-sku"><Tag :color="item.salesModel === 'RETAIL' ? 'default' : 'geekblue'">{{item.salesModel === "RETAIL" ? "retail" : "wholesale"}}</Tag></div>
              <div class="wap-content-desc-bottom">
                <div>RM{{ item.price | unitPrice }}</div>
              </div>
            </div>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>

          <div v-if="empty" class="empty">absentGoods details</div>
        </Scroll>

      </div>
    </div>
  </div>
</template>
<script>
import * as API_Goods from "@/api/goods";
export default {
  props: {
    selectedWay: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      type: "multiple", //单选或者多选 single  multiple

      cateList: [], // Goods Category列表
      total: "", // Goods总数
      goodsParams: {
        // Please 求Goods列表参数
        pageNumber: 1,
        pageSize: 18,
        order: "desc",
        goodsName: "",
        sn: "",
        categoryPath: "",
        marketEnable: "UPPER",
        authFlag: "PASS",
        sort:"createTime"
      },
      category: [], // 选中Goods Category
      goodsData: [], // Goods列表
      empty: false, // 是否空数据
      loading: false, // Goods加载loading
    };
  },
  watch: {
    category(val) {
      this.goodsParams.categoryPath = val[2];
    },
    selectedWay: {
      handler(val) {
        this.$emit("selected", this.selectedWay);
      },
      deep: true,
      immediate: true,
    },
    "goodsParams.categoryPath": {
      handler: function () {
        this.goodsData = [];
        (this.goodsParams.pageNumber = 0), this.getQueryGoodsList();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleReachBottom() {
      // Page面触底触发加载
      setTimeout(() => {
        if (
          this.goodsParams.pageNumber * this.goodsParams.pageSize <=
          this.total
        ) {
          this.goodsParams.pageNumber++;
          this.getQueryGoodsList();
        }
      }, 1500);
    },
    getQueryGoodsList() {
      // 根据Goods Category筛选Goods
      API_Goods.getGoodsSkuData(this.goodsParams).then((res) => {
        this.initGoods(res);
      });
    },

    initGoods(res) {
      // 获取Goods列表
      if (res.result.records.length != 0) {
        let data = res.result.records;
        data.forEach((item) => {
          item.selected = false;
          item.___type = "goods"; //设置为goods让pc wap知道标识

          this.selectedWay.forEach((e) => {
            if (e.id === item.id) {
              item.selected = true;
            }
          });
        });
        /**
         * 解决数据Please 求中，滚动栏会一直上下跳动
         */
        this.total = res.result.total;
        this.goodsData.push(...res.result.records);
      } else {
        this.empty = true;
      }
    },

    // 查询Goods
    init() {
      Promise.all([
        API_Goods.getGoodsSkuData(this.goodsParams),
        API_Goods.getGoodsCategoryAll(0),
      ]).then((res) => {
        // Goods
        this.initGoods(res[0]);

        // 分类
        if (res[1].result) {
          this.deepGroup(res[1].result);
        }
      });
    },

    deepGroup(val) {
      val.forEach((item) => {
        let childWay = []; //第二级
        // 第二层
        if (item.children) {
          item.children.forEach((child) => {
            // // 第三层
            if (child.children) {
              child.children.forEach((grandson, index, arr) => {
                arr[index] = {
                  value: grandson.id,
                  label: grandson.name,
                  children: "",
                };
              });
            }
            let children = {
              value: child.id,
              label: child.name,
              children: child.children,
            };
            childWay.push(children);
          });
        }

        // 第一层
        let way = {
          value: item.id,
          label: item.name,
          children: childWay,
        };

        this.cateList.push(way);
      });
    },

    /**
     * 点击Goods
     */
    checkedGoods(val, index) {
      // 如果单选的话
      if (this.type != "multiple") {
        this.goodsData.forEach((item) => {
          item.selected = false;
        });
        this.selectedWay = [];
        val.selected = true;
        this.selectedWay.push(val);

        return false;
      }

      if (val.selected == false) {
        val.selected = true;
        this.selectedWay.push(val);
      } else {
        val.selected = false;
        for (let i = 0; i < this.selectedWay.length; i++) {
          if (this.selectedWay[i].id === val.id) {
            this.selectedWay.splice(i, 1);
            break;
          }
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./style.scss";
.wap-content {
  width: 100%;
}
.empty {
  text-align: center;
  padding: 8px 0;
  width: 100%;
}
.wap-content {
  flex: 1;
  padding: 0;
}
.wap-content-list {
  position: relative;
}
.wap-content-item {
  width: 210px;
  margin: 10px 7px;
  padding: 6px 0;
}

.active {
  background: url("../../assets/selected.png") no-repeat;
  background-position: right;
  background-size: 10%;
}
</style>
