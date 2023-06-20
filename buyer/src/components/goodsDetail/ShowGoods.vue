<template>
  <div class="wrapper">
    <div class="item-detail-show">
      <!-- 详情左侧展示数据、图片，收藏、举报 -->
      <div class="item-detail-left">
        <!-- 大图、放大镜 -->
        <div class="item-detail-big-img">
          <pic-zoom :url="imgList[imgIndex].url" :scale="2"></pic-zoom>
        </div>
        <div
          v-if="skuDetail.goodsType !== 'VIRTUAL_GOODS'"
          style="margin-top:10px;rgb(153, 149, 149);"
        >
          Physical goods
        </div>
        <div
          v-else-if="skuDetail.goodsType == 'VIRTUAL_GOODS'"
          style="margin-top:10px;rgb(153, 149, 149);"
        >
          Virtual goods
        </div>
        <div class="item-detail-img-row">
          <div
            class="item-detail-img-small"
            @mouseover="imgIndex = index"
            v-for="(item, index) in imgList"
            :key="index"
          >
            <img :src="item.url" />
          </div>
        </div>

        <div class="goodsConfig mt_10">
          <span @click="collect"
            ><Icon
              type="ios-heart"
              :color="isCollected ? '#ed3f14' : '#666'"
            />{{ isCollected ? "Collected" : "Collect" }}</span
          >
        </div>
      </div>
      <!-- 右侧Goods details、活动信息、operation展示 -->
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            {{ skuDetail.goodsName }}
          </p>
        </div>
        <div class="sell-point">
          {{ skuDetail.sellingPoint }}
        </div>
        <!-- 限时秒杀 -->
        <Promotion
          v-if="promotionMap['SECKILL']"
          :time="promotionMap['SECKILL'].endTime"
        ></Promotion>
        <!-- Goods详细 price、coupon、促销 -->
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <!-- 秒杀price -->
            <div
              class="item-price-row"
              v-if="skuDetail.promotionPrice && promotionMap['SECKILL']"
            >
              <p>
                <span class="item-price-title" v-if="promotionMap['SECKILL']"
                  >seconds &nbsp;杀&nbsp;价</span
                >
                <span class="item-price">{{
                  skuDetail.promotionPrice | unitPrice("RM")
                }}</span>
                <span class="item-price-old">{{
                  skuDetail.price | unitPrice("RM")
                }}</span>
              </p>
            </div>
            <!-- Goods原价 -->
            <div class="item-price-row" v-else>
              <!-- 批发price -->
              <div v-if="wholesaleNum && wholesaleNum.length">
                <div class="flex">
                  <div class="item-price-title">
                    Price
                  </div>

                  <div
                    v-for="(item, index) in wholesalePrice"
                    :key="index"
                    class="item-price item-num"
                  >
                    {{ item | unitPrice("RM") }}
                  </div>
                </div>
                <div class="flex">
                  <div class="item-price-title">Initial batch quantity</div>
                  <div
                    v-for="(item, index) in wholesaleNum"
                    :key="index"
                    class="item-num item-price-num"
                  >
                    {{ item }}{{ skuDetail.goodsUnit }}
                  </div>
                </div>
              </div>

              <!-- 普通price -->
              <div v-else>
                <span class="item-price-title"
                  >Price</span
                >
                <span class="item-price">{{
                  skuDetail.price | unitPrice("RM")
                }}</span>
              </div>
            </div>
            <!-- coupon展示 -->
            <div class="item-price-coupon-row" v-if="promotionMap['COUPON'].length">
              <p class="Ellipsis">
                <span class="item-price-title">Coupon</span>
                <span>
                  <span
                    class="item-coupon"
                    v-for="(item, index) in promotionMap['COUPON'].slice(0, 6)"
                    :key="index"
                    @click="receiveCoupon(item.id)"
                  >
                    <span v-if="item.couponType == 'PRICE'"
                      >Full{{ item.consumeThreshold }}reduce{{ item.price }}</span
                    >
                    <span v-if="item.couponType == 'DISCOUNT'"
                      >Full{{ item.consumeThreshold }}get{{
                        item.couponDiscount
                      }}Sale</span
                    >
                  </span>
                </span>

                <div class="dropdown" v-if="promotionMap['COUPON'].length > 6">
                    <span>More</span>
                    <div class="dropdown-content">
                      <span
                        class="item-coupon"
                        v-for="(item, index) in promotionMap['COUPON'].slice(6, promotionMap['COUPON'].length)"
                        :key="index"
                        @click="receiveCoupon(item.id)"
                      >
                        <span v-if="item.couponType == 'PRICE'"
                          >Full{{ item.consumeThreshold }}reduce{{ item.price }}</span
                        >
                        <span v-if="item.couponType == 'DISCOUNT'"
                          >Full{{ item.consumeThreshold }}get{{
                            item.couponDiscount
                          }}sale</span
                        >
                      </span>
                    </div>
                  </div>
              </p>
            </div>
            <!-- full减展示 -->
            <div class="item-price-row" v-if="promotionMap['FULL_DISCOUNT']">
              <p>
                <span class="item-price-title"
                  >promotion</span
                >
                <span class="item-promotion">Full subtraction</span>
                <span
                  class="item-desc-pintuan"
                  v-if="promotionMap['FULL_DISCOUNT'].fullMinus"
                  >Full{{ promotionMap["FULL_DISCOUNT"].fullMoney }}Ringgit，reduction{{
                    promotionMap["FULL_DISCOUNT"].fullMinus
                  }}Ringgit</span
                >
                <span
                  class="item-desc-pintuan"
                  v-if="
                    promotionMap['FULL_DISCOUNT'].fullRate &&
                    promotionMap['FULL_DISCOUNT'].fullRateFlag
                  "
                  >Full{{ promotionMap["FULL_DISCOUNT"].fullMoney }}Ringgit，enjoy{{
                    promotionMap["FULL_DISCOUNT"].fullRate
                  }}sale</span
                >
              </p>
            </div>
          </div>
          <div class="item-price-right">
            <div class="item-remarks-sum">
              <p>evaluation</p>
              <p>
                <span class="item-remarks-num"
                  >{{ skuDetail.commentNum || 0 }} item</span
                >
              </p>
            </div>
          </div>
        </div>
        <!-- select颜色 -->
        <div
          class="item-select"
          v-for="(sku, index) in formatList"
          :key="sku.name"
        >
          <div class="item-select-title">
            <p>{{ sku.name }}</p>
          </div>
          <div class="item-select-column">
            <div
              class="item-select-row"
              v-for="item in sku.values"
              :key="item.value"
            >
              <div
                class="item-select-box"
                @click="select(index, item.value)"
                :class="{
                  'item-select-box-active':
                    item.value === currentSelceted[index],
                }"
              >
                <div class="item-select-intro">
                  <p>{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="add-buy-car-box">
          <div class="item-select">
            <div class="item-select-title">
              <p>quantity</p>
            </div>
            <div class="item-select-row">
              <InputNumber
                :min="1"
                :max="skuDetail.quantity"
                :disabled="skuDetail.quantity === 0"
                v-model="count"
                :precision="0.1"
                @on-blur="changeCount"
              ></InputNumber>
              <span class="inventory"> stock{{ skuDetail.quantity }}</span>
            </div>
          </div>
          <div
            class="item-select"
            v-if="
              skuDetail.goodsType !== 'VIRTUAL_GOODS' && skuDetail.weight !== 0
            "
          >
            <div class="item-select-title">
              <p>weight</p>
            </div>
            <div class="item-select-row">
              <span class="inventory"> {{ skuDetail.weight }}kg</span>
            </div>
          </div>
          <div
            class="add-buy-car"
            v-if="$route.query.way === 'POINT' && skuDetail.authFlag === 'PASS'"
          >
            <Button
              type="error"
              :loading="loading"
              :disabled="skuDetail.quantity === 0"
              @click="pointPay"
              >Point purchase</Button
            >
          </div>
          <div
            class="add-buy-car"
            v-if="$route.query.way !== 'POINT' && skuDetail.authFlag === 'PASS'"
          >
            <Button
              type="error"
              v-if="skuDetail.goodsType !== 'VIRTUAL_GOODS'"
              :loading="loading"
              :disabled="skuDetail.quantity === 0"
              @click="addShoppingCartBtn"
              >Add to cart</Button
            >
            <Button
              type="warning"
              :loading="loading1"
              :disabled="skuDetail.quantity === 0"
              @click="buyNow"
              >Buy now</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Promotion from "./Promotion.vue";
import PicZoom from "vue-piczoom"; // 图片放大
import {
  collectGoods,
  isCollection,
  receiveCoupon,
  cancelCollect,
} from "@/api/member.js";
import { addCartGoods } from "@/api/cart.js";
export default {
  name: "ShowGoods",
  props: {
    // Goods数据
    detail: {
      type: Object,
      default: null,
    },
  },
  watch: {
    detail: {
      handler(val) {
        this.skuDetail = val.data;
        this.wholesaleList = val.wholesaleList;
        if (this.wholesaleList && this.wholesaleList.length > 0) {
          this.count = this.wholesaleList[0].num;
        }
        this.swiperGoodsImg();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      wholesaleList: [],
      count: 1, // GoodsQuantity
      imgIndex: 0, // 展示图片下标
      currentSelceted: [], // 当前Goodssku
      imgList: [{ url: "" }], // Goods images列表
      skuDetail: {
        specList: [],
      }, // sku详情
      goodsSpecList: this.detail.specs, // Goodsspec
      promotionMap: {
        // 活动state
        SECKILL: null,
        FULL_DISCOUNT: null,
        COUPON: [],
      }, // 促销活动
      formatList: [], // select Goods type的数组
      loading: false, // 立即购买loading
      loading1: false, // 加入购物车loading
      isCollected: false, // 是否收藏
    };
  },
  components: { PicZoom, Promotion },
  computed: {
    wholesalePrice(key) {
      return this.wholesaleList.length
        ? this.wholesaleList.map((item) => {
            return item.price;
          })
        : [];
    },
    wholesaleNum(key) {
      return this.wholesaleList.length
        ? this.wholesaleList.map((item) => {
            return item.num;
          })
        : [];
    },
  },
  methods: {
    changeCount(val) {
      if (this.wholesaleList && this.wholesaleList.length > 0) {
        if (this.count <= this.wholesaleList[0].num) {
          this.$Message.warning("The purchase quantity of wholesale goods shall not be less than the initial batch quantity");
          this.count = this.wholesaleList[0].num;
        }
      }
    },
    select(index, value) {
      // select规格
      this.$set(this.currentSelceted, index, value);
      let selectedSkuId = this.goodsSpecList.find((i) => {
        let matched = true;
        let specValues = i.specValues.filter((j) => j.specName !== "images");
        for (let n = 0; n < specValues.length; n++) {
          if (specValues[n].specValue !== this.currentSelceted[n]) {
            matched = false;
            return;
          }
        }
        if (matched) {
          return i;
        }
      });
      this.$emit("handleClickSku", {
        skuId: selectedSkuId.skuId,
        goodsId: this.skuDetail.goodsId,
      });
    },

    addShoppingCartBtn() {
      // 添加购物车
      const params = {
        num: this.count,
        skuId: this.skuDetail.id,
      };
      this.loading = true;
      addCartGoods(params)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.$router.push({
              path: "/shoppingCart",
              query: { detail: this.skuDetail, count: this.count },
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    buyNow() {
      // 立即购买
      const params = {
        num: this.count,
        skuId: this.skuDetail.id,
        cartType: "BUY_NOW",
      };
      // Virtual Goods购买
      if (this.skuDetail.goodsType === "VIRTUAL_GOODS") {
        params.cartType = "VIRTUAL";
      }
      this.loading1 = true;
      addCartGoods(params)
        .then((res) => {
          this.loading1 = false;
          if (res.success) {
            this.$router.push({
              path: "/pay",
              query: { way: params.cartType },
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading1 = false;
        });
    },
    async collect() {
      // 收藏Goods
      if (this.isCollected) {
        let cancel = await cancelCollect("GOODS", this.skuDetail.id);
        if (cancel.success) {
          this.$Message.success("Cancel success");
          this.isCollected = false;
        }
      } else {
        let collect = await collectGoods("GOODS", this.skuDetail.id);
        if (collect.code === 200) {
          this.isCollected = true;
          this.$Message.success("collect success");
        }
      }
    },
    // 格式化数据
    formatSku(list) {
      let arr = [{}];
      list.forEach((item, index) => {
        item.specValues.forEach((spec, specIndex) => {
          let name = spec.specName;
          let values = {
            value: spec.specValue,
            quantity: item.quantity,
          };
          if (name === "images") {
            return;
          }

          arr.forEach((arrItem, arrIndex) => {
            if (
              arrItem.name === name &&
              arrItem.values &&
              !arrItem.values.find((i) => i.value === values.value)
            ) {
              arrItem.values.push(values);
            }

            let keys = arr.map((key) => {
              return key.name;
            });
            if (!keys.includes(name)) {
              arr.push({
                name: name,
                values: [values],
              });
            }
          });
        });
      });
      arr.shift();
      this.formatList = arr;

      let cur = list.filter((i) => i.skuId === this.$route.query.skuId)[0];
      if (cur) {
        cur.specValues
          .filter((i) => i.specName !== "images")
          .forEach((value, _index) => {
            this.currentSelceted[_index] = value.specValue;
          });
      }
      this.skuList = list;
    },
    receiveCoupon(id) {
      // 领取coupon
      receiveCoupon(id).then((res) => {
        if (res.success) {
          this.$Message.success("get success");
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    promotion() {
      // 格式化促销活动，Back当前促销的对象
      if (!this.detail.promotionMap) return false;
      let keysArr = Object.keys(this.detail.promotionMap);
      if (keysArr.length === 0) return false;

      for (let i = 0; i < keysArr.length; i++) {
        let key = keysArr[i].split("-")[0];
        if (key === "COUPON") {
          this.promotionMap[key].push(this.detail.promotionMap[keysArr[i]]);
        } else {
          this.promotionMap[key] = this.detail.promotionMap[keysArr[i]];
        }
      }
    },
    swiperGoodsImg() {
      this.skuDetail.specList.forEach((e) => {
        if (e.specName === "images") {
          this.imgList = e.specImage;
        }
      });
    },
  },
  mounted() {
    // 用户Login才会判断是否收藏
    if (this.Cookies.getItem("userInfo")) {
      isCollection("GOODS", this.skuDetail.id).then((res) => {
        if (res.success && res.result) {
          this.isCollected = true;
        }
      });
    }

    this.formatSku(this.goodsSpecList);
    this.promotion();
    document.title = this.skuDetail.goodsName;
  },
};
</script>

<style scoped lang="scss">
/******************Goods images及购买详情开始******************/
.item-detail-see {
  width: 175px;
  margin-left: 30px;
}
.flex {
  display: flex;
}
.inventory {
  padding-left: 4px;
}

.wrapper {
  @include white_background_color();
}

.item-num {
  text-align: center;
  width: 100px;
}
.item-price-num {
  font-size: 16px;
  color: #666;
}

.item-detail-show {
  width: 1200px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  flex-direction: row;
}

.item-detail-left {
  width: 350px;
  margin-right: 30px;
}

.item-detail-big-img {
  width: 350px;
  height: 350px;
  box-shadow: 0px 0px 8px $border_color;
  cursor: pointer;
}

.item-detail-big-img img {
  width: 100%;
}

.item-detail-img-row {
  margin-top: 15px;
  display: flex;
}

.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  margin-left: 5px;
}

.item-detail-img-small img {
  height: 100%;
  width: 100%;
}

/*Goods选购详情*/
.item-detail-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-detail-title p {
  @include content_color($light_content_color);
  font-weight: bold;
  font-size: 20px;
  padding: 8px 0;
}

.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: $theme_color;
  color: #fff;
}

/*Goods标签*/
.item-detail-tag {
  padding: 8px 0;
  font-size: 12px;
  color: $theme_color;
}

/*price详情等*/
.item-detail-price-row {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: url("../../assets/images/goodsDetail/price-bg.png");
}

.item-price-left {
  display: flex;
  flex-direction: column;
}

.item-price-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}

.item-price-row {
  margin: 5px 0px;
}

.item-price {
  color: $theme_color;
  font-size: 20px;
  cursor: pointer;
}
.item-price-old {
  color: gray;
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 5px;
}

.item-price-coupon-row {
  display: flex;
  align-items: center;
  margin: 5px 0px;
}

.Ellipsis {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; //控制显示几行
  -webkit-box-orient: vertical; //webbox方向
}

.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
  z-index: 999;
}

.dropdown .item-coupon {
  display: flex;
  align-content: center;
  align-items: center;
  color: $theme_color;
  margin: 5px 0;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted $theme_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
}
.dropdown:hover .dropdown-content {
  display: block;
}

.item-coupon {
  margin-right: 5px;
  padding: 0 5px;
  color: $theme_color;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted $theme_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}
.item-promotion {
  margin-right: 5px;
  padding: 3px;
  color: $theme_color;
  font-size: 12px;
  border: 1px solid $theme_color;
}

.item-price-right {
  display: flex;
  align-content: center;
  align-items: center;
}

.item-remarks-sum {
  width: 70px;
  text-align: center;
  padding: 0 10px;
  border-left: 1px solid $border_color;
}

.item-remarks-sum p {
  color: #999999;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
}

.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}

.item-select {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}

.item-select-title {
  @include content_color($light_content_color);
  font-size: 14px;
  margin-right: 15px;
  width: 60px;
}

.item-select-column {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}

.item-select-row {
  margin-bottom: 8px;
}

.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-select-box {
  padding: 5px;
  margin-right: 8px;
  @include background_color($light_background_color);
  border: 0.5px solid $border_color;
  cursor: pointer;
  @include content_color($light_content_color);
}

.item-select-box:hover {
  border: 0.5px solid $theme_color;
}

.item-select-box-active {
  border: 0.5px solid $theme_color;
}

.item-select-intro p {
  margin: 0px;
  padding: 5px;
}

.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
  border-top: 1px dotted $border_color;
}

.add-buy-car {
  margin-top: 15px;
  > * {
    margin: 0 4px;
  }
}

.goodsConfig {
  display: flex;
  justify-content: space-between;
  > span {
    padding-right: 10px;
    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
}
.sell-point {
  font-size: 12px;
  color: red;
  margin-bottom: 5px;
}
/******************Goods images及购买详情结束******************/
</style>
