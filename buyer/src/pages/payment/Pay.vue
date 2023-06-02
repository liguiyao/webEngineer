<template>
  <div class="pay-order">
    <BaseHeader></BaseHeader>
    <!-- LOGO 步骤条 -->
    <div class="width_1200 logo">
      <div>
        <router-link to="/"><img :src="$store.state.logoImg" /></router-link>
        <div>Settlement page</div>
      </div>
      <div class="cart-steps">
        <span :class="stepIndex == 1 ? 'active' : ''">1.My cart</span>
        <Icon :class="stepIndex == 1 ? 'active-arrow' : ''" custom="icomoon icon-next"></Icon>
        <span :class="stepIndex == 1 ? 'active' : ''">2.enter order information</span>
        <Icon :class="stepIndex == 1 ? 'active-arrow' : ''" custom="icomoon icon-next"></Icon>
        <span :class="stepIndex == 2 ? 'active' : ''">3.success Submit order</span>
      </div>
    </div>
    <Divider />
    <div class="content width_1200">
      <!-- Delivery address -->
      <div class="address" v-if="selectedDeliverMethod === 'LOGISTICS'">
        <div class="card-head">
          <span>Consignee info</span>
          <span @click="goAddressManage">manage receiver address</span>
        </div>
        <div class="address-manage">
          <div class="address-item" v-show="moreAddr ? true : index < 3"
            :class="selectedAddress.id === item.id ? 'border-red' : ''" @mouseenter="showEditBtn = index"
            @mouseleave="showEditBtn = ''" @click="selectAddress(item)" v-for="(item, index) in addressList"
            :key="index">
            <div>
              <span>{{ item.name }}</span>
              <Tag class="ml_10" v-if="item.isDefault" color="red">default</Tag>
              <Tag class="ml_10" v-if="item.alias" color="warning">{{ item.alias }}
              </Tag>
            </div>
            <div>{{ item.mobile }}</div>
            <div>
              {{ item.consigneeAddressPath | unitAddress }} {{ item.detail }}
            </div>
            <div class="edit-btn" v-show="showEditBtn === index">
              <span @click.stop="editAddress(item.id)">modify</span>
              <span class="ml_10" v-if="!item.isDefault" @click.stop="delAddress(item)">delete</span>
            </div>
            <div class="corner-icon" v-show="selectedAddress.id === item.id">
              <div></div>
              <Icon type="md-checkmark" />
            </div>
          </div>
          <div class="add-address" @click="editAddress('')">
            <Icon type="ios-add-circle-outline" />
            <div>Add new address</div>
          </div>
        </div>
        <div class="more-addr" @click="moreAddr = !moreAddr" v-if="addressList.length > 3">
          {{ moreAddr ? "Put away address" : "More address" }}
          <Icon v-show="!moreAddr" type="md-arrow-dropdown" />
          <Icon v-show="moreAddr" type="md-arrow-dropup" />
        </div>
      </div>

      <div class="address" v-if="selectedDeliverMethod === 'SELF_PICK_UP'">
        <div class="card-head">
          <span>Self-extracting point information</span>
        </div>
        <div class="address-manage">
          <div class="address-item" v-show="storeMoreAddr ? true : index < 3"
            :class="selectedAddress.id === item.id ? 'border-red' : ''" @mouseenter="showEditBtn = index"
            @mouseleave="showEditBtn = ''" @click="selectStoreAddress(item)" v-for="(item, index) in storeAddressList"
            :key="index">
            <div>
              <span>{{ item.addressName }}</span>
            </div>
            <div>{{ item.mobile }}</div>
            <div>
              {{ item.address | unitAddress }} {{ item.detail }}
            </div>
            <div class="corner-icon" v-show="selectedStoreAddress.id === item.id">
              <div></div>
              <Icon type="md-checkmark" />
            </div>
          </div>
        </div>
        <div class="more-addr" @click="storeMoreAddr = !storeMoreAddr" v-if="addressList.length > 3">
          {{ storeMoreAddr ? "Put away address" : "More address" }}
          <Icon v-show="!storeMoreAddr" type="md-arrow-dropdown" />
          <Icon v-show="storeMoreAddr" type="md-arrow-dropup" />
        </div>
      </div>
      <div>
      </div>
      <div class="goods-content">
        <div class="card-head mt_20 mb_20">
          <span>Distribution mode</span>
        </div>
        <div class="delivery-method">

          <div class="method-item" v-show="moreAddr ? true : index < 3"
            :class="selectedDeliverMethod === item.value ? 'border-red' : ''" @mouseenter="showEditBtn = item.value"
            @mouseleave="showEditBtn = ''" @click="selectDeliverMethod(item)" v-for="(item, index) in shippingMethod"
            :key="index">
            <div>{{ item.label }}</div>
            <div class="corner-icon" v-show="selectedDeliverMethod === item.value">
              <div></div>
              <Icon type="md-checkmark" />
            </div>
          </div>
        </div>
      </div>
      <!-- Goods details -->
      <div class="goods-content">
        <div class="card-head mt_20 mb_20">
          <span>Goods details</span>
          <span @click="$router.push('/cart')">Back to cart</span>
        </div>
        <div class="goods-msg" v-for="(shop, shopIndex) in goodsList" :key="shopIndex">
          <div v-if="shop.checked">
            <div class="shop-name">
              <span>
                <span class="hover-color" @click="goShopPage(shop.storeId)">{{
                    shop.storeName
                }}</span>&nbsp;&nbsp;
              </span>
            </div>
            <div class="goods-list">
              <div class="goods-item" v-for="(goods, goodsIndex) in shop.checkedSkuList" :key="goodsIndex">
                <span class="hover-color" @click="
                  goGoodsDetail(goods.goodsSku.id, goods.goodsSku.goodsId)
                ">
                  <img :src="goods.goodsSku.thumbnail" alt="" />
                  <span style="vertical-align: top">{{
                      goods.goodsSku.goodsName
                  }}</span>
                </span>
                <span class="goods-price">{{
                    goods.purchasePrice | unitPrice("RM")
                }}</span>
                <span>x{{ goods.num }}</span>
                <span>{{ goods.goodsSku.quantity > 0 ? "In stock" : "Out of stock" }}</span>
                <span class="goods-price">{{
                    goods.subTotal | unitPrice("RM")
                }}</span>
              </div>
            </div>
            <div class="order-mark">
              <Input type="textarea" maxlength="60" v-model="shop.remark" show-word-limit placeholder="Order note" />
              <span style="font-size: 12px; color: #999">Tips：Please dont enter payment informations</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 发票信息 -->
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative">Invoice information<span class="inv-tips">
              <Icon type="ios-alert-outline" />The taxpayer identification number must be entered for the invoice issued on enterprise letterhead, so as not to affect reimbursement
            </span></span>
        </div>
        <div class="inovice-content">
          <span>{{ invoiceData.receiptTitle }}</span>
          <span>{{ invoiceData.receiptContent }}</span>
          <span @click="editInvoice">Edit</span>
        </div>
      </div>
      <!-- coupon -->
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative">coupon</span>
        </div>
        <div v-if="couponList.length === 0">no coupon</div>
        <ul v-else class="coupon-list">
          <li v-for="(item, index) in couponList" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="item.couponType === 'PRICE'" class="fontsize_12 global_color">RM<span class="price">{{
                    item.price | unitPrice
                }}</span></span>
                <span v-if="item.couponType === 'DISCOUNT'" class="fontsize_12 global_color"><span class="price">{{
                    item.discount
                }}</span>off</span>
                <span class="describe">full{{ item.consumeThreshold }}ringgit available</span>
              </div>
              <p>Scope of use：{{ useScope(item.scopeType) }}</p>
              <p>Validity period：{{ item.endTime }}</p>
            </div>
            <img class="used" v-if="usedCouponId.includes(item.id)" src="../../assets/images/geted.png" alt="" />
            <b></b>
            <a class="c-right" @click="useCoupon(item.id, true)">Immediate use</a>
            <a class="c-right" v-if="usedCouponId.includes(item.id)" @click="useCoupon(item.id, false)">Waiver of preference</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
      </div>
      <!-- 订单price -->
      <div class="order-price">
        <div>
          <span>{{ totalNum }}Item, total amount of goods：</span><span>{{ priceDetailDTO.goodsPrice | unitPrice("RM") }}</span>
        </div>
        <div v-if="priceDetailDTO.freightPrice > 0">
          <span>freight：</span><span>{{ priceDetailDTO.freightPrice | unitPrice("RM") }}</span>
        </div>
        <div v-if="priceDetailDTO.discountPrice > 0">
          <span>Discount amount：</span><span>-{{ priceDetailDTO.discountPrice | unitPrice("RM") }}</span>
        </div>
        <div v-if="priceDetailDTO.couponPrice > 0">
          <span>Coupon amount：</span><span>-{{ priceDetailDTO.couponPrice | unitPrice("RM") }}</span>
        </div>

        <div v-if="$route.query.way === 'POINTS'">
          <span>Credits payable：</span><span class="actrual-price">{{ priceDetailDTO.payPoint }}</span>
        </div>
        <div v-else>
          <span>Amount payable：</span><span class="actrual-price">{{
              priceDetailDTO.flowPrice | unitPrice("RM")
          }}</span>
        </div>
      </div>
    </div>
    <!-- 底部支付栏 -->
    <div class="order-footer width_1200">
      <div class="pay ml_20" @click="pay">Submit order</div>
      <div class="pay-address" v-if="addressList.length && selectedDeliverMethod === 'LOGISTICS'">
        Deliver to：{{ selectedAddress.consigneeAddressPath | unitAddress }}
        {{ selectedAddress.detail }}&nbsp;&nbsp;receiver：{{
            selectedAddress.name
        }}&nbsp;&nbsp;{{ selectedAddress.mobile }}
      </div>
      <div class="pay-address" v-if="addressList.length && selectedDeliverMethod === 'SELF_PICK_UP'">
        Pick-up site：{{selectedStoreAddress.address}} &nbsp;&nbsp;Contact ：{{ selectedStoreAddress.mobile }}
      </div>
    </div>
    <BaseFooter></BaseFooter>
    <!-- 添加发票模态框 -->
    <invoice-modal ref="invModal" :invoiceData="invoiceData" @change="getInvMsg" />
    <!-- selectaddress模态框 -->
    <address-manage ref="address" :id="addrId" @change="addrChange"></address-manage>
  </div>
</template>

<script>
import invoiceModal from "@/components/invoiceModal";
import addressManage from "@/components/addressManage";
import { memberAddress, delMemberAddress } from "@/api/address";
import {
  cartGoodsPay,
  createTrade,
  selectAddr,
  selectCoupon,
  setShipMethod,
  setStoreAddressId,
  shippingMethodList,
  couponNum,
} from "@/api/cart";
import { getStoreAddress } from "@/api/shopentry.js"
import { canUseCouponList } from "@/api/member.js";

export default {
  name: "Pay",
  components: { invoiceModal, addressManage },
  data() {
    return {
      selectedStoreAddress: 'm',
      selectMethod: '',
      stepIndex: 1, // 顶部步骤条状态
      invoiceAvailable: false, // 发票编辑按钮
      showEditBtn: "", // 鼠标移入显示编辑按钮
      orderMark: "", // 订单备注
      storeMoreAddr: false,
      invoiceData: {
        // 发票数据
        receiptTitle: "Individual",
        receiptContent: "No need invoice",
      },
      searchForm: {
        pageNumber: 1,
        pageSize: 100
      },
      shippingMethod: [],
      storeAddressList: [],
      shippingWay: [
        {
          value: "LOGISTICS",
          label: "logistics",
        },
        {
          value: "SELF_PICK_UP",
          label: "self-lifting",
        },
      ],
      selectedDeliverMethod: 'LOGISTICS',
      addressList: [], // address列表
      selectedAddress: {}, // 所选address
      goodsList: [], // Goods列表
      priceDetailDTO: {}, // Goodsprice
      totalNum: 0, // quantity
      addrId: "", // 编辑address传入的id
      moreAddr: false, // More address
      canUseCouponNum: 0, // availablecouponQuantity
      couponList: [], // availableCoupon list
      usedCouponId: [], // 已使用couponid
      selectedCoupon: {}, // 已选coupon对象
      storeId: '', //店铺Id
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      this.getGoodsDetail();
      this.getDistribution();
    },
    goAddressManage() {
      // 跳转address管理页面
      this.$router.push("/home/MyAddress");
    },
    getAddress() {
      // 获取Delivery address列表
      memberAddress(this.searchForm).then((res) => {
        if (res.success) {
          this.addressList = res.result.records;
          this.addressList.forEach((e, index) => {
            if (e.id === this.selectedAddress.id && index > 2) {
              this.moreAddr = true;
            }
          });
        }
      });
    },
    // 获取Distribution mode列表
    async getDistribution() {
      let shopRes = await shippingMethodList({ way: this.$route.query.way });
      let shopList;
      if (shopRes.success) {
        shopList = shopRes.result;
        let way = [];
        console.log(shopList)
        this.shippingWay.forEach((item) => {
          shopList.forEach((child) => {
            if (item.value == child) {
              way.push(item);
            }
          });
        });
        this.shippingMethod = way;
        console.log(this.shippingMethod)
      }
    },

    async getStoreAddressList() {
      getStoreAddress(this.storeId,this.searchForm).then(res => {
        if (res.success) {
          this.storeAddressList = res.result.records
          this.storeAddressList.forEach((e, index) => {
            if (e.id === this.selectedAddress.id && index > 2) {
              this.storeMoreAddr = true;
            }
          });
        }
      })
    },
    getGoodsDetail() {
      // 订单Goods详情
      this.$Spin.show();
      cartGoodsPay({ way: this.$route.query.way })
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            if (
              !res.result.checkedSkuList ||
              res.result.checkedSkuList.length === 0
            ) {
              if (res.result.skuList && res.result.skuList[0]) {
                this.$Modal.warning({
                  title: "Invalid item in shopping cart！",
                  content:
                    "[" +
                    res.result.skuList[0].goodsSku.goodsName +
                    "]" +
                    res.result.skuList[0].errorMessage,
                });
              }
              this.$router.push({
                path: "/cart",
                replace: true,
              });
            }
            this.goodsList = res.result.cartList;
            this.priceDetailDTO = res.result.priceDetailDTO;
            this.skuList = res.result.skuList;
            this.storeId = this.goodsList[0].storeId
            if (res.result.receiptVO) {
              this.invoiceData = res.result.receiptVO;
            }
            let notSupArea = res.result.notSupportFreight;
            this.selectedCoupon = {};
            if (res.result.platformCoupon)
              this.selectedCoupon[res.result.platformCoupon.memberCoupon.id] =
                res.result.platformCoupon;
            if (
              res.result.storeCoupons &&
              Object.keys(res.result.storeCoupons)[0]
            ) {
              let storeMemberCouponsId = Object.keys(
                res.result.storeCoupons
              )[0];
              let storeCouponId =
                res.result.storeCoupons[storeMemberCouponsId].memberCoupon.id;
              this.selectedCoupon[storeCouponId] =
                res.result.storeCoupons[storeMemberCouponsId];
            }
            if (notSupArea) {
              let content = [];
              let title = "";
              notSupArea.forEach((e) => {
                title = e.errorMessage;
                content.push(e.goodsSku.goodsName);
              });
              this.$Modal.warning({
                title: "The following items are outside the distribution area" || title,
                content: content.toString(),
              });
            }
            if (res.result.memberAddress) {
              this.selectedAddress = res.result.memberAddress;
            }
            this.getAddress();
            this.getStoreAddressList();
            this.totalNum = 0;
            for (let i = 0; i < this.skuList.length; i++) {
              this.totalNum += this.skuList[i].num;
            }
            this.usedCouponId = [];
            this.couponList = res.result.canUseCoupons;
            const couponKeys = Object.keys(this.selectedCoupon);
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (
                  this.selectedCoupon[e.id] &&
                  e.id === this.selectedCoupon[e.id].memberCoupon.id
                ) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
    },
    getCouponNum() {
      // 获取availablecouponQuantity
      couponNum({ way: this.$route.query.way }).then((res) => {
        this.canUseCouponNum = res.result;
        if (res.result) {
          let storeArr = [];
          let skuArr = [];
          this.goodsList.forEach((e) => {
            storeArr.push(e.storeId);
            e.skuList.forEach((i) => {
              skuArr.push(i.goodsSku.id);
            });
          });
          let params = {
            pageNumber: 1,
            pageSize: 100,
            memberCouponStatus: "NEW",
            scopeId: skuArr.toString(),
            storeId: storeArr.toString(),
            totalPrice: this.priceDetailDTO.goodsPrice,
          };
          canUseCouponList(params).then((res) => {
            // availableCoupon list
            if (res.success) this.couponList = res.result.records;
            const couponKeys = Object.keys(this.selectedCoupon);
            this.usedCouponId = [];
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (e.id === this.selectedCoupon[couponKeys].memberCoupon.id) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          });
        }
      });
    },
    selectAddress(item) {
      // selectaddress
      let params = {
        way: this.$route.query.way,
        shippingAddressId: item.id,
      };
      selectAddr(params).then((res) => {
        if (res.success) {
          this.$Message.success("selectDistribution modesuccess");
          this.selectMethod = item;
          this.getGoodsDetail();
        }
      });
    },
    selectStoreAddress(item) {
      console.log(item.id)
      console.log(this.$route.query.way)
      // selectself-liftingaddress
      setStoreAddressId(item.id,this.$route.query.way).then((res) => {
        if (res.success) {
          this.$Message.success("selectself-liftingaddresssuccess");
          this.selectedStoreAddress = item;
          this.getGoodsDetail();
        }
      });
    },
    selectDeliverMethod(item) {
      let params = {
        way: this.$route.query.way,
        shippingMethod: item.value,
      };
      setShipMethod(params).then((res) => {
        if (res.success) {
          this.selectedDeliverMethod = item.value;
          this.getGoodsDetail();
        }
      });
    },
    editAddress(id) {
      // 编辑address
      this.addrId = id;
      this.$refs.address.show();
    },
    addrChange() {
      // 添加，编辑address回显
      this.getAddress();
    },
    delAddress(item) {
      // deleteaddress
      this.$Modal.confirm({
        title: "Tips",
        content: "Are you sure to delete thisDelivery address",
        onOk: () => {
          delMemberAddress(item.id).then((res) => {
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getAddress();
            }
          });
        },
        onCancel: () => { },
      });
    },
    goGoodsDetail(skuId, goodsId) {
      // 跳转Goods详情
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 跳转店铺首页
    goShopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: { id: id },
      });
      window.open(routeUrl.href, "_blank");
    },
    useCoupon(id, used) {
      // 使用coupon
      let params = {
        way: this.$route.query.way,
        memberCouponId: id,
        used: used, // true 为使用， false为弃用
      };
      selectCoupon(params).then((res) => {
        if (res.success) this.init();
      });
    },
    editInvoice() {
      // 编辑发票信息
      this.$refs.invModal.invoiceAvailable = true;
    },
    getInvMsg(item) {
      // 获取发票信息
      if (item) {
        this.init();
        this.$refs.invModal.invoiceAvailable = false;
      }
    },

    pay() {
      // 结算
      const params = {
        client: "PC",
        remark: [],
        way: this.$route.query.way,
      };
      this.goodsList.forEach((e) => {
        if (e.remark) {
          params.remark.push({
            remark: e.remark,
            storeId: e.storeId,
          });
        }
      });

      if (!params.remark.length) delete params.remark;

      this.$Spin.show();
      createTrade(params)
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            if (params.way === "POINTS") {
              // 积分支付不需要跳转支付页面
              this.$router.push("/payDone");
            } else {
              this.$router.push({
                path: "/payment",
                query: { orderType: "TRADE", sn: res.result.sn },
              });
            }
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
    },
    // couponavailable范围
    useScope(type) {
      let goods = "All goods";
      switch (type) {
        case "ALL":
          goods = "All goods";
          break;
        case "PORTION_GOODS":
          goods = "Partial goods";
          break;
        case "PORTION_GOODS_CATEGORY":
          goods = "Partial classified goods";
          break;
      }
      return `${goods}available`;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/coupon.scss";

.goods-msg {
  overflow: hidden;
}

/** logo start */
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

.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;

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

/** logo end */
/** content start */
.content {
  margin: 20px auto;
  background-color: #fff;
  min-height: 200px;
  padding: 15px 25px;
}

.delivery-method {
  display: flex;
  flex-wrap: wrap;

  >div {
    border: 1px dotted #949494;
    width: 50px;
    height: 40px;
    margin: 20px 20px 0 0;
    padding: 10px;
    cursor: pointer;
    color: #999;
  }

  .method-item {
    position: relative;
    font-size: 12px;

    >div:nth-child(1) {
      margin-bottom: 10px;

      span {
        margin-right: 10px;
      }

      >span:nth-child(1) {
        color: #000000;
        font-size: 14px;
      }
    }

    .edit-btn {
      font-size: 12px;
      position: absolute;
      top: 15px;
      right: 20px;
      color: $theme_color;

      span:hover {
        border-bottom: 1px solid $theme_color;
      }
    }

    .corner-icon {
      position: absolute;
      right: -1px;
      bottom: -1px;

      div {
        width: 0;
        border-top: 20px solid transparent;
        border-right: 20px solid $theme_color;
      }

      .ivu-icon {
        font-size: 12px;
        position: absolute;
        bottom: 0;
        right: 1px;
        transform: rotate(-15deg);
        color: #fff;
      }
    }
  }

  .border-red {
    border-color: $theme_color;
  }
}

/** address管理 */
.address-manage {
  display: flex;
  flex-wrap: wrap;

  >div {
    border: 1px dotted #949494;
    width: 265px;
    height: 120px;
    margin: 20px 20px 0 0;
    padding: 10px;
    cursor: pointer;
    color: #999;
  }

  .add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .ivu-icon {
      font-size: 24px;
    }

  }

  .address-item {
    position: relative;
    font-size: 12px;

    >div:nth-child(1) {
      margin-bottom: 10px;

      span {
        margin-right: 10px;
      }

      >span:nth-child(1) {
        color: #000000;
        font-size: 14px;
      }
    }

    .edit-btn {
      font-size: 12px;
      position: absolute;
      top: 15px;
      right: 20px;
      color: $theme_color;

      span:hover {
        border-bottom: 1px solid $theme_color;
      }
    }

    .corner-icon {
      position: absolute;
      right: -1px;
      bottom: -1px;

      div {
        width: 0;
        border-top: 20px solid transparent;
        border-right: 20px solid $theme_color;
      }

      .ivu-icon {
        font-size: 12px;
        position: absolute;
        bottom: 0;
        right: 1px;
        transform: rotate(-15deg);
        color: #fff;
      }
    }
  }

  .border-red {
    border-color: $theme_color;
  }
}

/** 购买Goods列表 start */
.shop-name {
  display: flex;
  justify-content: space-between;

  >span:nth-child(1) {
    font-weight: bold;

    .ivu-icon {
      color: #ff8f23;

      &:hover {
        color: $theme_color;
      }
    }
  }

  >span:nth-child(2) {
    color: #999;
    position: relative;
    display: flex;
    width: 200px;
  }

  .delivery-list {
    position: absolute;
    right: 0;
    top: 20px;
    background-color: #f3fafe;
    box-shadow: 0px 0px 5px #b9b2b2;
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    min-height: 100px;
    padding: 10px;

    li {
      width: 90px;
      height: 30px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.goods-list {
  width: 1150px;
  background-color: #f8f8f8;
  margin: 10px 0 20px 0;

  .goods-item {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    margin: 0 20px;
    border-bottom: 1px dotted #999;

    &:last-child {
      border: none;
    }

    img {
      width: 48px;
      height: 48px;
    }

    >span {
      text-align: center;
      width: 100px;
    }

    >span:nth-child(1) {
      font-size: 12px;

      flex: 1;
      text-align: left;

      >span {
        margin-left: 10px;
      }
    }

    >span:last-child {
      color: $theme_color;
      font-weight: bold;
    }

    .goods-price {
      font-size: 16px;
    }
  }
}

.order-mark {
  width: 500px;
}

/** 购买Goods列表 end */
/** 发票信息 start */
.invoice {
  .inv-tips {
    position: absolute;
    border: 1px solid #ddd;
    width: 310px;
    padding: 3px;
    margin: 0 0 0 10px;
    font-size: 12px !important;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);

    &::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 17px;
      background: url(../../assets/images/arrow-left.png) 0 0 no-repeat;
      background-color: #fff;
      position: absolute;
      left: -9px;
    }

    .ivu-icon {
      color: #ff8f23;
      margin-right: 3px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .inovice-content {
    >span {
      margin-right: 10px;
    }

    >span:last-child {
      color: $theme_color;
      cursor: pointer;

      &:hover {
        border-bottom: 1px solid $theme_color;
      }
    }
  }
}

/** 发票信息 end */

/** 订单price */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 16px;
  color: #999;

  >div>span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }

  .actrual-price {
    color: $theme_color;
    font-weight: bold;
    font-size: 20px;
  }
}

/** content end */
/** 底部支付栏 */
.order-footer {
  z-index: 20;
  height: 50px;
  @include background_color($light_white_background_color);
  @include title_color($title_color);
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1px solid #ddd;
  margin: 10px auto;

  div {
    text-align: center;
  }

  position: sticky;
  bottom: 0;

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

/** 公共表头 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dddddd;
  height: 40px;

  span:nth-child(1) {
    font-size: 18px;
  }

  span:nth-child(2) {
    font-size: 12px;
    color: #438cde;
    cursor: pointer;

    &:hover {
      color: $theme_color;
    }
  }
}

.ivu-divider {
  background: $theme_color;
  height: 2px;
}

.pay-address {
  font-size: 12px;
}

.more-addr {
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
}

.coupon-item {
  width: 260px;
  height: 125px;
  margin-right: 10px;
  margin-bottom: 10px;

  .c-right {
    width: 30px;
    padding: 10px 7px;
  }

  b {
    background: url("../../assets/images/small-circle.png") top left repeat-y;
    right: 28px;
  }

  .circle-top,
  .circle-bottom {
    right: 22px;
  }

  .used {
    position: absolute;
    top: 60px;
    right: 40px;
    width: 50px;
    height: 50px;
  }
}

.coupon-list {
  max-height: 260px;
  overflow: scroll;
}
</style>
