<template>
  <div style="background: #fff">
    <BaseHeader></BaseHeader>
    <Search></Search>
    <drawer></drawer>
    <ShopHeader :detail="storeMsg"></ShopHeader>
    <div class="shop-item-path">
      <div class="shop-nav-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home page</BreadcrumbItem>
          <BreadcrumbItem v-for="(item, index) in categoryBar" :to="goGoodsList(index)" target="_blank" :key="index">
            {{ item.name }}
          </BreadcrumbItem>
        </Breadcrumb>
        <div class="store-collect" v-if="!takeDownSale">
          <span class="mr_10" v-if="goodsMsg.data">
            <router-link :to="'Merchant?id=' + goodsMsg.data.storeId">{{
              goodsMsg.data.storeName
            }}</router-link>
          </span>
          <span @click="collect">
            <Icon type="ios-heart" :color="storeCollected ? '#ed3f14' : '#666'" />
            {{ storeCollected? "Collected shop": "Collection shop" }}
          </span>
          <span class="ml_10" @click="IMService(goodsMsg.data.storeId)">Contact customer service</span>
        </div>
      </div>
    </div>

    <!-- Goods details展示 -->
    <ShowGoods @handleClickSku="targetClickSku" v-if="goodsMsg.data" :detail="goodsMsg"></ShowGoods>
    <!-- Goods详细展示 -->
    <ShowGoodsDetail v-if="goodsMsg.data" :detail="goodsMsg"></ShowGoodsDetail>

    <empty _Title='Goods off the shelves' v-if="takeDownSale">
      <div class="sale-btn">
        <Button size="small" class="mr_10" @click="target('/')">Back to home page</Button>
        <Button size="small" @click="target('goodsList')">Back Goods list</Button>
      </div>
    </empty>
    <Spin size="large" fix v-if="isLoading"></Spin>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Search from "@/components/Search";
import ShopHeader from "@/components/header/ShopHeader";
import ShowGoods from "@/components/goodsDetail/ShowGoods";
import empty from "@/components/empty/Main";
import ShowGoodsDetail from "@/components/goodsDetail/ShowGoodsDetail";
import { goodsSkuDetail } from "@/api/goods";
import {
  cancelStoreCollect,
  collectStore,
  isStoreCollection,
  getGoodsDistribution,
} from "@/api/member";
import { getDetailById } from "@/api/shopentry";
import imTalk from '@/components/mixes/talkIm'
export default {
  name: "GoodsDetail",
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.getGoodsDetail();
  },
  mixins: [imTalk],
  data () {
    return {
      goodsMsg: {}, // Goods details
      isLoading: false, // 加载state
      categoryBar: [], // 分类
      storeCollected: false, // Goods收藏
      storeMsg: {}, // 店铺信息
      takeDownSale:false, // 是否Off

    };
  },
  methods: {
    // 跳转Home或GoodsPage面
    target(url){
      this.$router.push({path: url})

    },
    // 点击规格
    targetClickSku (val) {
      this.getGoodsDetail(val);
    },
    // 获取Goods Detail
    getGoodsDetail (val) {
      this.isLoading = true;
      const params = val || this.$route.query;

      // 分销员id
      let distributionId =
        params && params.distributionId
          ? params.distributionId
          : this.Cookies.getItem("distributionId");
      // 如果有分销信息
      if (distributionId) {
        console.log(distributionId);
        // 先存储
        this.Cookies.setItem("distributionId", params.distributionId);
        let _this = this;
        // 绑定关系
        getGoodsDistribution(params.distributionId).then((res) => {
          // 绑定success，则清除关系
          if (res.success) {
            _this.Cookies.removeItem("distributionId");
          }
        });
      }

      goodsSkuDetail(params)
        .then((res) => {
          this.isLoading = false;
          if (res.success) {
            const result = res.result;
            const cateName = res.result.categoryName;
            const cateId = result.data.categoryPath.split(",");
            const cateArr = [];
            cateId.forEach((e, index) => {
              // 插入分类id和name
              cateArr.push({
                id: e,
                name: cateName[index],
              });
            });
            this.categoryBar = cateArr;
            this.$set(this, "goodsMsg", res.result);
            // 判断是否收藏
            if (this.Cookies.getItem("userInfo")) {
              isStoreCollection("STORE", this.goodsMsg.data.storeId).then((res) => {
                if (res.success && res.result) {
                  this.storeCollected = true;
                }
              });
            }

            if (!this.storeMsg) {
              // 获取店铺信息
              getDetailById(this.goodsMsg.data.storeId).then((res) => {
                if (res.success) {
                  this.storeMsg = res.result;

                }
              });
            }
          } else {
            this.$Message.error(res.message);
            this.isLoading = false
          }
        })
        .catch((e) => {
          this.isLoading = false
          if(e.code === 11001){
            this.takeDownSale = true
          }
        });
    },
    goGoodsList (currIndex) {
      // 跳转Goods列表
      const arr = [];
      this.categoryBar.forEach((e, index) => {
        if (index <= currIndex) {
          arr.push(e.id);
        }
      });
      return location.origin + "/goodsList?categoryId=" + arr.toString();
    },
    async collect () {
      // 收藏店铺
      if (this.storeCollected) {
        let cancel = await cancelStoreCollect("STORE", this.goodsMsg.data.storeId);
        if (cancel.success) {
          this.$Message.success("Cancel collection");
          this.storeCollected = false;
        }
      } else {
        let collect = await collectStore("STORE", this.goodsMsg.data.storeId);
        if (collect.code === 200) {
          this.storeCollected = true;
          this.$Message.success("Collection shop success,You can check out my collection in the Personal center");
        }
      }
    },
  },
  watch: {},
  components: {
    Search,
    ShopHeader,
    ShowGoods,
    ShowGoodsDetail,
    empty
  },
};
</script>
<style scoped lang="scss">
.shop-item-path {
  height: 38px;
  @include background_color($light_background_color);
  line-height: 38px;
  color: #2c2c2c;
}

.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
  position: relative;

  .store-collect {
    position: absolute;
    right: 20px;
    top: 0;
    color: #999;

    span {
      &:hover {
        cursor: pointer;
        color: $theme_color;
      }
    }
  }
}
.sale-btn{
  margin:10px 0

}
</style>
