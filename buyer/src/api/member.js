import request, {Method} from '@/plugins/request.js';

// 查询账户余额
export function getMembersWallet () {
  return request({
    url: '/buyer/wallet/wallet',
    method: Method.GET,
    needToken: true
  });
}

// 查询余额列表
export function getDepositLog (params) {
  return request({
    url: '/buyer/wallet/log',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询充值记录
export function getRecharge (params) {
  return request({
    url: '/buyer/wallet/recharge',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询提现记录
export function getWithdrawApply (params) {
  return request({
    url: '/buyer/member/withdrawApply',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 在线充值
export function recharge (params) {
  return request({
    url: '/buyer/trade/recharge',
    method: Method.POST,
    needToken: true,
    data: params
  });
}

// 提现
export function withdrawalApply (params) {
  return request({
    url: '/buyer/wallet/wallet/withdrawal',
    method: Method.POST,
    needToken: true,
    data: params
  });
}

// 收藏Goods
export function collectGoods (type, id) {
  return request({
    url: `/buyer/member/collection/add/${type}/${id}`,
    method: Method.POST,
    needToken: true
  });
}

// 收藏店铺
export function collectStore (type, id) {
  return request({
    url: `/buyer/member/storeCollection/add/${type}/${id}`,
    method: Method.POST,
    needToken: true
  });
}

// Cancel 收藏Goods
export function cancelCollect (type, id) {
  return request({
    url: `/buyer/member/collection/delete/${type}/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

// Cancel 收藏店铺
export function cancelStoreCollect (type, id) {
  return request({
    url: `/buyer/member/storeCollection/delete/${type}/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

// 查看是否收藏Goods
export function isCollection (type, goodsId) {
  return request({
    url: `/buyer/member/collection/isCollection/${type}/${goodsId}`,
    method: Method.GET,
    needToken: true
  });
}

// 查看是否收藏店铺
export function isStoreCollection (type, goodsId) {
  return request({
    url: `/buyer/member/storeCollection/isCollection/${type}/${goodsId}`,
    method: Method.GET,
    needToken: true
  });
}

// 会员收藏Goods列表
export function collectList (params) {
  return request({
    url: `/buyer/member/collection/${params.type}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 会员收藏店铺列表
export function storeCollectList (params) {
  return request({
    url: `/buyer/member/storeCollection/${params.type}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 单个Goods evaluation
export function goodsComment (params) {
  return request({
    url: `/buyer/member/evaluation/${params.goodsId}/goodsEvaluation`,
    method: Method.GET,
    needToken: false,
    params
  });
}

// Goods各Evaluate类别Quantity
export function goodsCommentNum (goodsId) {
  return request({
    url: `/buyer/member/evaluation/${goodsId}/evaluationNumber`,
    method: Method.GET,
    needToken: false
  });
}

// 添加会员Evaluate
export function addEvaluation (params) {
  return request({
    url: `/buyer/member/evaluation`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 会员Evaluate详情
export function evaluationDetail (id) {
  return request({
    url: `/buyer/member/evaluation/get/${id}`,
    method: Method.GET,
    needToken: true
  });
}

// 发票分页列表
export function receiptList () {
  return request({
    url: `/buyer/trade/receipt`,
    method: Method.GET,
    needToken: true
  });
}

// Save发票信息
export function saveReceipt (params) {
  return request({
    url: `/buyer/trade/receipt`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 获取可领取Coupon list
export function couponList (params) {
  return request({
    url: `/buyer/promotion/coupon`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 会员Coupon list
export function memberCouponList (params) {
  return request({
    url: `/buyer/promotion/coupon/getCoupons`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 会员Coupon list
export function canUseCouponList (params) {
  return request({
    url: `/buyer/promotion/coupon/canUse`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 领取coupon
export function receiveCoupon (couponId) {
  return request({
    url: `/buyer/promotion/coupon/receive/${couponId}`,
    method: Method.GET,
    needToken: true
  });
}

// 获取Apply  after sale列表
export function afterSaleList (params) {
  return request({
    url: `/buyer/order/afterSale/page`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 获取Apply  after sale页面信息
export function afterSaleInfo (sn) {
  return request({
    url: `/buyer/order/afterSale/applyAfterSaleInfo/${sn}`,
    method: Method.GET,
    needToken: true
  });
}

// 获取Apply  after sale、Complaint原因
export function afterSaleReason (serviceType) {
  return request({
    url: `/buyer/order/afterSale/get/afterSaleReason/${serviceType}`,
    method: Method.GET,
    needToken: true
  });
}
// 获取Apply  After-sale details
export function afterSaleDetail (sn) {
  return request({
    url: `/buyer/order/afterSale/get/${sn}`,
    method: Method.GET,
    needToken: true
  });
}
// after sale日志
export function afterSaleLog (sn) {
  return request({
    url: `/buyer/order/afterSale/get/getAfterSaleLog/${sn}`,
    method: Method.GET,
    needToken: true
  });
}

// Apply  after sale
export function applyAfterSale (params) {
  return request({
    url: `/buyer/order/afterSale/save/${params.orderItemSn}`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// Cancelafter saleApply
export function cancelAfterSale (afterSaleSn) {
  return request({
    url: `/buyer/order/afterSale/cancel/${afterSaleSn}`,
    method: Method.POST,
    needToken: true
  });
}

// ComplaintGoods
export function handleComplain (data) {
  return request({
    url: `/buyer/order/complain`,
    method: Method.POST,
    needToken: true,
    data
  });
}
// 分页获取我的Complaint列表
export function complainList (params) {
  return request({
    url: `/buyer/order/complain`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取Complaint详情
 */
export function getComplainDetail (id) {
  return request({
    url: `/buyer/order/complain/${id}`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * CancelComplaint
 */
export function clearComplain (id) {
  return request({
    url: `/buyer/order/complain/status/${id}`,
    method: Method.PUT,
    needToken: true
  });
}

/**
 * 获取当前会员分销信息
 */
export function distribution () {
  return request({
    url: `/buyer/distribution/distribution`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * Apply  成为分销商
 * @param idNumber 身份证号
 * @param name  名字
 */
export function applyDistribution (params) {
  return request({
    url: `/buyer/distribution/distribution`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * 获取分销商订单列表
 */
export function getDistOrderList (params) {
  return request({
    url: `/buyer/distribution/order`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 获取分销商Goods列表
 */
export function getDistGoodsList (params) {
  return request({
    url: `/buyer/distribution/goods`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 绑定、解绑分销Goods
 * @param distributionGoodsId 分销Goodsid
 * @param checked 分销Goodsid,true为绑定，false为解绑
 */
export function selectDistGoods (params) {
  return request({
    url: `/buyer/distribution/goods/checked/${params.distributionGoodsId}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 分销商提现历史
 */
export function distCashHistory (params) {
  return request({
    url: `/buyer/distribution/cash`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 分销商提现
 */
export function distCash (params) {
  return request({
    url: `/buyer/distribution/cash`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * My tract
 * @param {Number} pageNumber 页码
 * @param {Number} pageSize 页数
 */
export function tracksList (params) {
  return request({
    url: `/buyer/member/footprint`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 清空足迹
 */
export function clearTracks () {
  return request({
    url: `/buyer/member/footprint`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 根据iddelete足迹
 * @param {String} ids id集合
 */
export function clearTracksById (ids) {
  return request({
    url: `/buyer/member/footprint/delByIds/${ids}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 获取会员积分
 */
export function memberPoint (params) {
  return request({
    url: `/buyer/member/memberPointsHistory/getMemberPointsHistoryVO`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 积分历史
 */
export function memberPointHistory (params) {
  return request({
    url: `/buyer/member/memberPointsHistory/getByPage`,
    method: Method.GET,
    needToken: true,
    params
  });
}
/**
 * 分页获取会员站内信
 * @param {Object} params Please 求参数，包括pageNumber、pageSize、status
 */
export function memberMsgList (params) {
  return request({
    url: `/buyer/message/member`,
    method: Method.GET,
    needToken: true,
    params
  });
}
/**
 * 设置消息为已读
 * @param {String} messageId 消息id
 */

export function readMemberMsg (id) {
  return request({
    url: `/buyer/message/member/${id}`,
    method: Method.PUT,
    needToken: true
  });
}
/**
 * delete会员消息
 * @param {String} messageId 消息id
 */
export function delMemberMsg (id) {
  return request({
    url: `/buyer/message/member/${id}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * 绑定分销
 * @param distributionId Goods分销ID
 */
export function getGoodsDistribution (distributionId) {
  return request({
    url: `/buyer/distribution/distribution/bindingDistribution/${distributionId}`,
    method: Method.GET,
    needToken: true
  });
}
