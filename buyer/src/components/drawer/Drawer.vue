<template>
  <div class="content-drawer">
    <div v-if="title === 'Cart'" class="cart-con">
      <ul>
        <li v-for="(goods,goodsIndex) in cartList" :key="goodsIndex">
          <div>
            <img :src="goods.goodsSku.thumbnail" width="90" height="90" alt="">
          </div>
          <div>
            <p class="hover-color" @click="linkTo(`/goodsDetail?skuId=${goods.goodsSku.id}&goodsId=${goods.goodsSku.goodsId}`)">{{goods.goodsSku.goodsName}}</p>
            <p class="price">{{goods.goodsSku.price | unitPrice('RM')}}<span>&nbsp; x{{goods.num}}</span></p>
          </div>
          <span class="del hover-color" @click="delGoods(goods.goodsSku.id)">Delete</span>
        </li>
      </ul>
      <Button size="large" class="mt_10" type="primary" @click="linkTo('/cart')" long>Cart checkout</Button>
    </div>

    <div v-else-if="title === 'My order'" class="order-con">
      <ul>
        <li v-for="(order,orderIndex) in orderList" :key="orderIndex">
          <div class="order-status"><span>{{filterOrderStatus(order.orderStatus)}}</span><span>{{order.createTime}}</span></div>
          <div class="goods-img">
            <img :src="img.image"
              @click="linkTo(`/goodsDetail?skuId=${img.skuId}&goodsId=${img.goodsId}`)"
              v-for="(img,imgIndex) in order.orderItems"
              :key="imgIndex" width="40" height="40" alt="">
          </div>
          <div class="order-handle"><span>{{ order.flowPrice | unitPrice("RM") }}</span><span class="hover-color" @click="linkTo(`home/OrderDetail?sn=${order.sn}`)">View order</span></div>
        </li>
      </ul>
      <Button type="primary" @click="linkTo('/home/MyOrder')" long>Check my order</Button>
    </div>

    <div v-else-if="title === 'Coupon'" class="coupon-con">
      <ul class="coupon-list">
          <li v-for="(coupon, index) in couponList" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="coupon.couponType === 'PRICE'" class="fontsize_12 global_color">RM<span class="price">{{coupon.price | unitPrice}}</span></span>
                <span v-if="coupon.couponType === 'DISCOUNT'" class="fontsize_12 global_color"><span class="price">{{coupon.couponDiscount}}</span>discount</span>
                <span class="describe">Full{{coupon.consumeThreshold}}available</span>
              </div>
              <p>Scope：{{useScope(coupon.scopeType, coupon.storeName)}}</p>
              <p>Validity：{{coupon.endTime}}</p>
            </div>
            <b></b>
            <a class="c-right" @click="receive(coupon)">Get</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
    </div>
    <div v-else-if="title === 'Track'" class="tracks-con">
      <ul>
        <li v-for="(track,trackIndex) in tracksList" :key="trackIndex">
          <img :src="track.thumbnail" :alt="track.thumbnail" @click="linkTo(`/goodsDetail?skuId=${track.id}&goodsId=${track.goodsId}`)" width="100" height="100">
          <div @click="addToCart(track.id)">Add cart</div>
          <p class="global_color">{{track.price | unitPrice('RM')}}</p>
        </li>
      </ul>
      <div class="hover-color" style="text-align:center;" @click="linkTo('/home/MyTracks')">More>></div>
    </div>
    <div v-else-if="title === 'My collection'" class="collect-con">
      <ul>
        <li v-for="(collect,collectIndex) in collectList" :key="collectIndex">
          <img :src="collect.image" :alt="collect.image" @click="linkTo(`/goodsDetail?skuId=${collect.skuId}&goodsId=${collect.goodsId}`)" width="100" height="100">
          <div @click="addToCart(collect.skuId)">Add cart</div>
          <span class="del-icon" @click.stop="cancelCollect(collect.skuId)">
            <Icon type="md-trash" />
          </span>
          <p class="global_color">{{collect.price | unitPrice('RM')}}</p>
        </li>
      </ul>
      <div class="hover-color" style="text-align:center;" @click="linkTo('/home/Favorites')">More>></div>
    </div>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import {cartGoodsAll, delCartGoods, addCartGoods, cartCount} from '@/api/cart.js'
import { getOrderList } from '@/api/order';
import {couponList, receiveCoupon, tracksList, collectList, cancelCollect} from '@/api/member.js'
export default {
  name: 'Drawer',
  props: {
    title: {
      default: '',
      type: String
    }
  },
  watch: {
    title (val) {
      switch (val) {
        case 'Cart':
          this.getCartList()
          break;
        case 'Order':
          this.getOrderList()
          break;
        case 'Track':
          this.getTracksList()
          break;
        case 'Coupon':
          this.getCouponList()
          break;
        case 'Collection':
          this.getCollectList()
          break;
      }
    }
  },
  data () {
    return {
      loading: false, // 控制spin显隐
      cartList: [], // 购物车列表
      couponList: [], // Coupon list
      orderList: [], // 订单列表
      collectList: [], // 收藏列表
      tracksList: [], // 足迹列表
      orderStatusList: [ // Status
        {
          name: 'UNPAID',
          status: 'UNPAID'
        },
        {
          name: 'PAID',
          status: 'PAID'
        },
        {
          name: 'UNDELIVERED',
          status: 'UNDELIVERED'
        },
        {
          name: 'DELIVERED',
          status: 'DELIVERED'
        },
        {
          name: 'COMPLETED',
          status: 'COMPLETED'
        },
        {
          name: 'evaluate',
          status: 'TAKE'
        },
        {
          name: 'CANCELLED',
          status: 'CANCELLED'
        }
      ]
    };
  },
  methods: {
    getCartList () { // 获取购物车列表
      this.loading = true
      cartGoodsAll().then(res => {
        this.loading = false
        this.cartList = res.result.skuList
      })
    },
    // deleteGoods
    delGoods (id) {
      delCartGoods({ skuIds: id }).then((res) => {
        if (res.success) {
          this.$Message.success('Delete success');
          this.getCartList();
          cartCount().then(res => {
            this.$store.commit('SET_CARTNUM', res.result)
            this.Cookies.setItem('cartNum', res.result)
          })
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    filterOrderStatus (status) { // 获取Status中文
      const ob = this.orderStatusList.filter(e => { return e.status === status });
      return ob[0].name
    },
    receive (item) { // 领取coupon
      receiveCoupon(item.id).then(res => {
        if (res.success) {
          this.$Modal.confirm({
            title: 'Get coupon',
            content: '<p>Received successfully,you can go to my coupon page to view</p>',
            okText: 'My coupon',
            cancelText: 'Immediate use',
            onOk: () => {
              this.$router.push('/home/Coupons')
            },
            onCancel: () => {
              if (item.storeId !== '0') {
                this.$router.push({path: '/merchant', query: {id: item.storeId}})
              } else {
                if (item.scopeType === 'PORTION_GOODS_CATEGORY') {
                  this.$router.push({path: '/goodsList', query: {categoryId: item.scopeId}})
                } else {
                  this.$router.push({path: '/goodsList'})
                }
              }
            }
          });
        }
      })
    },
    useScope (type, storeName) { // 判断coupon使用范围
      let shop = 'platform';
      let goods = 'All goods'
      if (storeName !== 'platform') shop = storeName
      switch (type) {
        case 'ALL':
          goods = 'All goods'
          break;
        case 'PORTION_GOODS':
          goods = 'Partial goods'
          break;
        case 'PORTION_GOODS_CATEGORY':
          goods = 'Partial classified goods'
          break;
      }
      return `${shop}${goods}available`
    },
    addToCart (id) { // Add goods到购物车
      const params = {
        num: 1,
        skuId: id
      }
      this.loading = true;
      addCartGoods(params).then(res => {
        this.loading = false;
        if (res.success) {
          this.$Message.success('Successfully added to the cart')
        } else {
          this.$Message.warning(res.message);
        }
      }).catch(() => { this.loading = false });
    },
    getCouponList () { // 获取Coupon list
      // this.loading = true;
      const params = {
        pageNumber: 1,
        pageSize: 10
      }
      couponList(params).then(res => {
        this.loading = false
        if (res.success) {
          this.couponList = res.result.records
        }
      }).catch(() => { this.loading = false })
    },
    getOrderList () { // 获取订单列表
      this.loading = true
      const params = {
        pageNumber: 1,
        pageSize: 10,
        tag: 'ALL'
      }
      getOrderList(params).then(res => {
        this.loading = false
        if (res.success) {
          this.orderList = res.result.records;
        }
      });
    },
    getCollectList () { // 获取收藏列表
      const params = {
        pageNumber: 1,
        pageSize: 10,
        type: 'GOODS'
      }
      this.loading = true
      collectList(params).then(res => {
        this.loading = false
        this.collectList = res.result.records
      })
    },
    cancelCollect (id) { // CancelGoods收藏
      cancelCollect('GOODS', id).then(res => {
        if (res.success) {
          this.$Message.success('Cancel success')
          this.getCollectList();
        }
      })
    },
    getTracksList () { // 获取足迹列表
      const params = {
        pageNumber: 1,
        pageSize: 20
      }
      this.loading = true
      tracksList(params).then(res => {
        this.tracksList = res.result.records
        this.loading = false
      }).catch(() => { this.loading = false })
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../assets/styles/coupon.scss';
@import './drawer.scss';
.coupon-item{
  overflow: hidden;
  background-color: #fff;
  height: 120px;
  .c-left{
    padding: 15px;
  }
  .c-right{
    width: 38px;
    padding: 13px;
    font-size: 14px;
  }
  i{
    right: 30px;
    background-color: #eee;
  }
}
</style>
