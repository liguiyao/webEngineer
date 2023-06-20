import request, {
  Method
} from '@/plugins/request.js';

/**
 * 清空购物车
 */
export function clearCart () {
  return request({
    url: '/buyer/trade/carts',
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 获取购物车Page面购物车详情
 */
export function cartGoodsAll () {
  return request({
    url: '/buyer/trade/carts/all',
    method: Method.GET,
    needToken: true
  });
}

/**
 * 获取购物车GoodsQuantity
 */
export function cartCount () {
  return request({
    url: '/buyer/trade/carts/count',
    method: Method.GET,
    needToken: true
  });
}

/**
 * 获取结算Page面购物车详情
 */
export function cartGoodsPay (params) {
  return request({
    url: '/buyer/trade/carts/checked',
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 向购物车添加一个Goods
 * @param skuId skuId
 * @param  num  quantity
 */
export function addCartGoods (params) {
  return request({
    url: '/buyer/trade/carts',
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 创建交易
 * @param client 客户端：H5/移动端 PC/PC,WECHAT_MP/小程序端,APP/移动应用端
 * @param way 购物车购买：CART/立即购买：BUY_NOW / 积分购买：POINT
 * @param remark 备注  非必填
 */
export function createTrade (data) {
  return request({
    url: '/buyer/trade/carts/create/trade',
    method: Method.POST,
    needToken: true,
    headers: {'Content-Type': 'application/json'},
    data
  });
}

/**
 * selectcoupon
 * @param memberCouponId couponid
 * @param way 购物车购买：CART/立即购买：BUY_NOW/ 积分购买：POINT
 * @param used 使用true 弃用 false
 */
export function selectCoupon (params) {
  return request({
    url: '/buyer/trade/carts/select/coupon',
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * availablecouponQuantity
 */
export function couponNum (params) {
  return request({
    url: '/buyer/trade/carts/coupon/num',
    method: Method.GET,
    needToken: true,
    params
  });
}
/**
 * selectDelivery address
 * @param shippingAddressId addressid
 * @param way 购物车类型
 */
export function selectAddr (params) {
  return request({
    url: `/buyer/trade/carts/shippingAddress`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 选中购物车所有Goods
 * @param checked 设置选中 0，1
 */
export function setCheckedAll (params) {
  return request({
    url: `/buyer/trade/carts/sku/checked`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 批量设置某商家goods为选中或不选中
 * @param checked 是否选中
 * @param storeId   商家id
 */
export function setCheckedSeller (params) {
  return request({
    url: `/buyer/trade/carts/store/${params.storeId}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 选中购物车中单个产品
 * @param skuId 产品id
 * @param checked 设置选中0，1
 */
export function setCheckedGoods (params) {
  return request({
    url: `/buyer/trade/carts/sku/checked/${params.skuId}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 更新购物车中单个产品Quantity
 * @param skuId 产品id
 * @param num   产品Quantity
 */
export function setCartGoodsNum (params) {
  return request({
    url: `/buyer/trade/carts/sku/num/${params.skuId}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * delete购物车中一个或多个产品
 * @param skuIds 产品id数组
 */
export function delCartGoods (params) {
  return request({
    url: `/buyer/trade/carts/sku/remove`,
    method: Method.DELETE,
    needToken: true,
    params
  });
}

/**
 * selectDistribution mode
 * @param shippingMethod SELF_PICK_UP(self-lifting),LOCAL_TOWN_DELIVERY(同城配送),LOGISTICS(logistics)
 * @param way 购物方式
 */
export function shippingMethod (params) {
  return request({
    url: `/buyer/trade/carts/shippingMethod`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * select发票
 * @param receiptId 发票Id
 * @param way 购物方式
 */
export function receiptSelect (params) {
  return request({
    url: `/buyer/trade/carts/select/receipt`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取全部Distribution mode
 */
 export function shippingMethodList(params) {
  return request({
    url: `/buyer/trade/carts/shippingMethodList`,
    method: Method.GET,
    needToken: true,
    params: params,
  });
}

/**
 * 获取全部Distribution mode
 */
 export function storeAddressList(params) {
  return request({
    url: `/buyer/store/address/shippingMethodList`,
    method: Method.GET,
    needToken: true,
    params: params,
  });
}

/**
 * 设置self-liftingaddressID
 * @param addressId
 */
 export function setStoreAddressId(storeAddressId,way) {
  return request({
    url: `/buyer/trade/carts/storeAddress?storeAddressId=${storeAddressId}&way=${way}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * SubmitDistribution mode
 * @param params
 */
 export function setShipMethod(params) {
  return request({
    url: "/buyer/trade/carts/shippingMethod",
    method: Method.PUT,
    needToken: true,
    params,
  });
}
