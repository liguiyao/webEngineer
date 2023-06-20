<template>
  <div class="cart" @click="couponAvailable = false">
    <BaseHeader></BaseHeader>
    <!-- LOGO search -->
    <div class="width_1200 logo">
      <div>
        <router-link to="/"><img :src="$store.state.logoImg" /></router-link>
        <div>
          Cart(<span>{{ goodsTotal }}</span
          >)
        </div>
      </div>
      <Search :showTag="false" :showLogo="false"></Search>
    </div>
    <Divider />
    <!-- 购物车主体 -->
    <div class="cart-content width_1200 center">
      <div class="available-area">
        <div class="cart-steps">
          <span :class="stepIndex == 0 ? 'active' : ''">1.My cart</span>
          <Icon
            :class="stepIndex == 0 ? 'active-arrow' : ''"
            custom="icomoon icon-next"
          ></Icon>
          <span :class="stepIndex == 1 ? 'active' : ''">2.enter order information</span>
          <Icon
            :class="stepIndex == 1 ? 'active-arrow' : ''"
            custom="icomoon icon-next"
          ></Icon>
          <span :class="stepIndex == 2 ? 'active' : ''">3.success Submit order</span>
        </div>
      </div>
      <!-- 购物车Goods列表 -->
      <div class="cart-goods">
        <div class="cart-goods-title">
          <div class="width_60">
            <Checkbox
              v-model="allChecked"
              @on-change="changeChecked(allChecked, 'all')"
              >Select all</Checkbox
            >
          </div>
          <div class="goods-title">Goods</div>
          <div class="width_150">Price（ringgit）</div>
          <div class="width_100">Quantity</div>
          <div class="width_150">Subtotal</div>
          <div class="width_100">operation</div>
        </div>
        <div v-if="cartList.length === 0" class="cart-empty">
          <p>Empty cart</p>
          <router-link to="/">Go shopping&gt;</router-link>
        </div>
        <div
          v-else
          class="cart-goods-items"
          v-for="(shop, index) in cartList"
          :key="index"
        >
          <div class="shop-name">
            <div>
              <Checkbox
                v-model="shop.checked"
                @on-change="changeChecked(shop.checked, 'shop', shop.storeId)"
              ></Checkbox>
              <span class="go-shop-page" @click="goShopPage(shop.storeId)">{{
                shop.storeName
              }}</span>
            </div>
            <span
              class="shop-coupon"
              v-if="shop.couponList.length"
              :class="couponAvailable === index ? 'shop-coupon-show' : ''"
              @click.stop="showCoupon(shop.id, index)"
            >
              <!-- coupon模态框 -->
              <div v-if="couponAvailable === index">
                <div
                  class="coupon-item"
                  v-for="(item, index) in shop.couponList"
                  :key="index"
                >
                  <span v-if="item.couponType === 'PRICE'"
                    >RM{{ item.price }}</span
                  >
                  <span v-if="item.couponType === 'DISCOUNT'"
                    >{{ item.couponDiscount }}off</span
                  >
                  <span>full{{ item.consumeThreshold }}ringgitavailable</span>
                  <Button
                    class="coupon-btn"
                    size="small"
                    type="primary"
                    @click="receiveShopCoupon(item)"
                    :disabled="item.disabled"
                    >{{ item.disabled ? "已领取" : "领取" }}</Button
                  >
                </div>
              </div>
            </span>
            <div class="promotion-notice">{{ shop.promotionNotice }}</div>
          </div>
          <template v-for="(goods, goodsIndex) in shop.skuList">
            <div class="goods-item" :key="goodsIndex">
              <div class="width_60">
                <Checkbox
                  v-model="goods.checked"
                  @on-change="
                    changeChecked(goods.checked, 'goods', goods.goodsSku.id)
                  "
                ></Checkbox>
              </div>
              <div
                class="goods-title"
                @click="
                  goGoodsDetail(goods.goodsSku.id, goods.goodsSku.goodsId)
                "
              >
                <img
                  :src="
                    goods.goodsSku.thumbnail ||
                    '../assets/images/goodsDetail/item-detail-1.jpg'
                  "
                />
                <div>
                  <p>
                    {{ goods.goodsSku.goodsName }}
                  </p>
                  <p><Tag
                    v-if="goods.goodsSku.salesModel === 'WHOLESALE'"
                    class="goods-show-tag"
                    color="purple"
                  >
                    wholesale Goods
                  </Tag></p>
                  <template
                    v-for="(promotion, promotionIndex) in goods.promotions"
                  >
                    <div
                      class="promotion"
                      :key="promotionIndex"
                      v-if="promotion.promotionType === 'SECKILL'"
                    >
                      <span>seckill</span>
                      <promotion
                        :time="promotion.endTime"
                        type="cart"
                      ></promotion>
                    </div>
                  </template>
                  <template
                    v-for="(promotion, promotionIndex) in goods.promotions"
                  >
                    <div
                      class="promotion"
                      :key="promotionIndex"
                      v-if="promotion.promotionType === 'FULL_DISCOUNT'"
                    >
                      <span>full Preferential activities</span>
                      <promotion
                        :time="promotion.endTime"
                        type="cart"
                      ></promotion>
                    </div>
                  </template>
                </div>
              </div>
              <div class="width_150">
                {{ goods.purchasePrice | unitPrice("RM") }}
              </div>
              <div class="width_100">
                <InputNumber
                  :min="1"
                  size="small"
                  v-model="goods.num"
                  @on-change="changeNum(goods.num, goods.goodsSku.id)"
                ></InputNumber>
                <div class="fontsize_12">
                  {{ goods.goodsSku.quantity > 0 ? "In stock" : "Out of stock" }}
                </div>
              </div>
              <div class="width_150">
                {{ goods.subTotal | unitPrice("RM") }}
              </div>
              <div class="width_100">
                <Button
                  v-if="!goods.errorMessage"
                  size="small"
                  type="primary"
                  @click="delGoods(goods.goodsSku.id)"
                  >delete</Button
                >
                <Button
                  v-if="!goods.errorMessage"
                  size="small"
                  type="info"
                  @click="collectGoods(goods.goodsSku.id)"
                  style="margin-left: 10px"
                  >collect</Button
                >
              </div>
              <div class="error-goods" v-if="goods.errorMessage">
                <div style="margin-top: 20px">{{ goods.errorMessage }}</div>
                <Button type="primary" @click="delGoods(goods.goodsSku.id)"
                  >delete</Button
                >
              </div>
            </div>
          </template>
        </div>
        <!-- 底部支付栏 -->
        <div class="cart-goods-footer">
          <div>
            <div class="width_60">
              <Checkbox
                v-model="allChecked"
                @on-change="changeChecked(allChecked, 'all')"
                >select all</Checkbox
              >
            </div>
            <div class="width_100 handle-btn" @click="delGoods()">
              delete select Goods
            </div>
            <!-- <div class="width_100 handle-btn" @click="collectGoods">移到我的收藏</div> -->
            <div class="width_100 handle-btn" @click="clearCart">
              Clear cart
            </div>
          </div>
          <div>
            <div class="selected-count">
              select<span>{{ checkedNum }}</span
              >Goods
            </div>
            <div class="ml_20 save-price">
              saved<span>{{
                priceDetailDTO.discountPrice | unitPrice("RM")
              }}</span>
            </div>
            <div class="ml_20 total-price">
              Total price（Excluding freight）:
              <div>{{ priceDetailDTO.flowPrice | unitPrice("RM") }}</div>
            </div>
            <div class="pay ml_20" @click="pay">To payment</div>
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Promotion from "@/components/goodsDetail/Promotion";
import Search from "@/components/Search";
import * as APICart from "@/api/cart";
import * as APIMember from "@/api/member";
export default {
  name: "Cart",
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  components: {
    Search,
    Promotion,
  },
  data() {
    return {
      couponAvailable: false, // 展示coupon
      stepIndex: 0, // 当前处于哪一步，购物车==0，enter order information==1，success Submit order==2
      goodsTotal: 0, // GoodsQuantity
      checkedNum: 0, // 选中Quantity
      allChecked: false, // 全选
      loading: false, // 加载state
      cartList: [], // 购物车列表
      couponList: [], // Coupon list
      priceDetailDTO: {}, // price明细
      skuList: [], // sku列表
    };
  },
  methods: {
    // 跳转Goods Detail
    goGoodsDetail(skuId, goodsId) {
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 跳转店铺Home
    goShopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: { id },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 收藏Goods
    collectGoods(id) {
      this.$Modal.confirm({
        title: "collection",
        content: "<p>The goods collection can be viewed in my Collection at the Personal Center</p>",
        onOk: () => {
          APIMember.collectGoods("GOODS", id).then((res) => {
            if (res.success) {
              this.$Message.success("collection Goods success");
              this.getCartList();
            }
          });
        },
        onCancel: () => {},
      });
    },
    // deleteGoods
    delGoods(id) {
      const idArr = [];
      if (!id) {
        const list = this.cartList;
        list.forEach((shop) => {
          shop.skuList.forEach((goods) => {
            if (goods.checked) {
              idArr.push(goods.goodsSku.id);
            }
          });
        });
      } else {
        idArr.push(id);
      }
      this.$Modal.confirm({
        title: "delete",
        content: "<p>Do you confirm delete Goods？</p>",
        onOk: () => {
          APICart.delCartGoods({ skuIds: idArr.toString() }).then((res) => {
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getCartList();
            } else {
              this.$Message.error(res.message);
            }
          });
        },
      });
    },
    // 清空购物车
    clearCart() {
      this.$Modal.confirm({
        title: "Tips",
        content: "<p>Are you sure you want to empty the cart? Cannot be restored after clearing</p>",
        onOk: () => {
          APICart.clearCart().then((res) => {
            if (res.success) {
              this.$Message.success("clear cart success");
              this.getCartList();
            } else {
              this.$Message.error(res.message);
            }
          });
        },
      });
    },
    // 跳转支付Page面
    pay() {
      if (this.checkedNum) {
        this.$router.push({ path: "/pay", query: { way: "CART" } });
      } else {
        this.$Message.warning("Please as least select one Goods");
      }
    },
    // 展示coupon
    showCoupon(storeId, index) {
      this.couponAvailable = index;
    },
    // 设置quantity
    changeNum(val, id) {
      if (val) {
        APICart.setCartGoodsNum({ skuId: id, num: val }).then((res) => {
          if (res.success) {
            this.getCartList();
          }
        });
      }
    },
    // 设置Goods选中state
    async changeChecked(status, type, id) {
      const check = status ? 1 : 0;
      if (type === "all") {
        // 全选
        await APICart.setCheckedAll({ checked: check });
      } else if (type === "shop") {
        // 选中店铺所有Goods
        await APICart.setCheckedSeller({ checked: check, storeId: id });
      } else {
        // 单个Goods
        await APICart.setCheckedGoods({ checked: check, skuId: id });
      }

      this.getCartList();
    },
    // 领取coupon
    async receiveShopCoupon(item) {
      let res = await APIMember.receiveCoupon(item.id);
      if (res.success) {
        this.$set(item, "disabled", true);
        this.$Message.success("get success");
      } else {
        this.$Message.error(res.message);
      }
    },
    // 购物车列表
    async getCartList() {
      this.loading = true;
      try {
        let res = await APICart.cartGoodsAll();
        this.loading = false;
        if (res.success) {
          this.cartList = res.result.cartList;
          this.priceDetailDTO = res.result.priceDetailDTO;
          this.skuList = res.result.skuList;
          this.checkedNum = 0;
          let allChecked = true;
          for (let k = 0; k < this.cartList.length; k++) {
            let shop = this.cartList[k];
            let list = await APIMember.couponList({ storeId: shop.storeId });
            shop.couponList.push(...list.result.records);
          }
          for (let i = 0; i < this.skuList.length; i++) {
            if (this.skuList[i].checked) {
              this.checkedNum += this.skuList[i].num;
            } else {
              allChecked = false;
            }
          }
          this.$forceUpdate();
          this.allChecked = allChecked;
        }
      } catch (error) {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getCartList();
    APICart.cartCount().then((res) => {
      // 购物车GoodsQuantity
      if (res.success) this.goodsTotal = res.result;
    });
  },
};
</script>

<style scoped lang="scss">
/** logo search start **/
.logo {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;
  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 150px;
      height: auto;
      cursor: pointer;
    }
    div:nth-child(2) {
      width: 200px;
      color: #999;
      font-size: 16px;
      margin: 0 20px;
      span {
        color: $theme_color;
      }
    }
  }
}
.cart-content {
  margin: 0 auto;
  width: 1200px;
  position: relative;
}
/** logo end */
/** step步骤items */
.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    @include content_color($light_content_color);
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    padding: 0 15px;
  }

  .ivu-icon {
    @include content_color($light_content_color);
    font-size: 20px;
    margin: 0 15px;
  }

  .active {
    border-radius: 50px;
    background-color: #ff8f23;
    color: #fff;
  }

  .active-arrow {
    color: #ff8f23;
  }
}
/** 步骤items和配送区域总体 */
.available-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
/** Goods列表 */
.cart-goods {
  &-title {
    height: 50px;
    @include background_color($light_white_background_color);
    @include title_color($title_color);
    display: flex;
    align-items: center;
    padding: 0 20px;
    div {
      text-align: center;
    }
    .goods-title {
      flex: 1;
    }
  }
  .cart-empty {
    width: 100%;
    text-align: center;
    height: 300px;
    padding-top: 100px;
  }
  &-items {
    .shop-name {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      position: relative;
      @include title_color($light_title_color);
      > * {
        width: 50%;
      }
      .go-shop-page:hover {
        color: $theme_color;
        cursor: pointer;
      }
      .customer-service {
        margin-left: 5px;
        color: #fcc217;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
      /** coupon */
      .shop-coupon {
        width: 80px;
        height: 24px;
        position: relative;
        background: url(../assets/images/cart-coupon-icons02.png) 0 0 no-repeat;
        > div {
          position: absolute;
          top: 35px;
          left: 0;
          width: 300px;
          height: 300px;
          background-color: #fff;
          border: 1px solid $theme_color;
          // border-radius: 3px;
          z-index: 1;
          padding: 10px 20px;
          &::before {
            content: "";
            display: block;
            background: url(../assets/images/cart-coupon-icons02.png) 0 -58px no-repeat;
            width: 80px;
            height: 12px;
            position: absolute;
            top: -12px;
            left: 0;
          }
          .coupon-item {
            margin-bottom: 10px;
            span:nth-child(1) {
              border: 1px solid #e33937;
              display: inline-block;
              padding: 3px 10px;
              color: $theme_color;
              border-radius: 3px;
            }
            span:nth-child(2) {
              font-size: 12px;
              margin-left: 5px;
              color: #999;
            }
            .coupon-btn {
              height: 26px;
              float: right;
              font-size: 12px;
            }
            &::after {
              display: block;
              content: "";
              clear: right;
            }
          }
        }
      }
      .promotion-notice {
        text-align: right;
        font-size: 12px;
      }
      .shop-coupon-show {
        background-position-y: -34px;
      }
    }
    .goods-item {
      position: relative;
      @extend .cart-goods-title;
      @include background_color($light_white_background_color);
      padding: 10px 20px;
      height: auto;
      > div:nth-child(1) {
        padding-left: 15px;
        width: 30px;
      }
      > div:nth-child(2) {
        cursor: pointer;
        display: flex;
        box-sizing: border-box;
        padding-left: 20px;
        position: relative;
        img {
          width: 70px;
          height: 70px;
        }
        > div > p {
          @include content_color($light_content_color);
          font-size: 13px;
          text-align: left;
          margin-left: 10px;
          &:hover {
            color: $theme_color;
          }
        }
      }
      > div:nth-child(5) {
        font-weight: bold;
      }
      .num-input {
        width: 60px;
        border: 1px solid #999;
        border-radius: 5px;
        padding: 0 5px;
        &:focus {
          outline-color: $theme_color;
        }
      }
    }
    .error-goods {
      position: absolute;
      width: 100%;
      height: 100%;
      margin-left: -20px;
      background-color: rgba($color: #999, $alpha: 0.5);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 150px;
      color: #000;
      padding-right: 30px;
    }
  }
  &-footer {
    @extend .cart-goods-title;
    position: sticky;
    bottom: 0;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding: 0 0 0 20px;
    line-height: 50px;
    justify-content: space-between;
    > div {
      display: flex;
    }
    .selected-count {
      span {
        color: $theme_color;
      }
    }

    .save-price span {
      color: #000;
    }
    .total-price div {
      color: $theme_color;
      font-size: 20px;
    }
    .pay {
      background-color: $theme_color;
      width: 150px;
      font-size: 20px;
      color: #fff;
      height: 100%;
      line-height: 50px;
      cursor: pointer;
    }
  }
  .handle-btn {
    font-size: 12px;
    color: $handle-btn-color;
    cursor: pointer;
    &:hover {
      color: $theme_color;
    }
  }
}
.like {
  width: 1200px;
  margin: 10px auto;
  // padding: 20px 0;
  @include white_background_color();
}
.likeGoods,
.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
}
.ivu-divider {
  background: $theme_color;
  height: 2px;
}
.width_150 {
  width: 150px;
}
.width_60 {
  width: 60px;
}
.promotion {
  display: flex;
  margin-top: 5px;
  margin-left: 5px;
  > span {
    border: 1px solid $theme_color;
    color: $theme_color;
    font-size: 12px;
    border-radius: 2px;
    padding: 0 2px;
  }
  > p {
    font-size: 12px;
    margin-left: 10px;
    color: #999;
  }
}
.cart-goods-footer > div {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.total-price {
  display: flex;
  align-items: center;
}
</style>
<style>
.ivu-input-number-input {
  text-align: center;
}
</style>
