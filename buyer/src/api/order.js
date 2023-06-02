import request, {
  Method
} from '@/plugins/request.js';

// 查询会员订单列表
export function getOrderList (params) {
  return request({
    url: `/buyer/order/order`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 订单明细
 * @param {orderSn} 订单编号
 */
export function orderDetail (orderSn) {
  return request({
    url: `/buyer/order/order/${orderSn}`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * Cancel order
 * @param {orderSn} 订单编号
 * @param reason Cancel order reason
 */
export function cancelOrder (params) {
  return request({
    url: `/buyer/order/order/${params.orderSn}/cancel`,
    method: Method.POST,
    needToken: true,
    params
  });
}

/**
 * delete order
 * @param {orderSn} 订单编号
 */
export function delOrder (orderSn) {
  return request({
    url: `/buyer/order/order/${orderSn}`,
    method: Method.DELETE,
    needToken: true
  });
}

/**
 * Confirm receipt
 * @param {orderSn} 订单编号
 */
export function sureReceived (orderSn) {
  return request({
    url: `/buyer/order/order/${orderSn}/receiving`,
    method: Method.POST,
    needToken: true
  });
}

/**
 * 查询logistics
 * @param {orderSn} 订单编号
 */
export function getTraces (orderSn) {
  return request({
    url: `/buyer/order/order/getTraces/${orderSn}`,
    method: Method.POST,
    needToken: true
  });
}

/**
 * Evaluate列表
 *
 */
export function evolutionList (params) {
  return request({
    url: `/buyer/member/evaluation`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 添加交易Complaint对话
export function communication (params) {
  return request({
    url: `/buyer/order/complain/communication`,
    method: Method.POST,
    needToken: true,
    params
  });
}

// 退换货服务 Submitlogistics
export function afterSaleDelivery (params) {
  return request({
    url: `/buyer/order/afterSale/delivery/${params.afterSaleSn}`,
    method: Method.POST,
    needToken: true,
    params
  });
}
// 获取Return goods可选Logistics company
export function getLogisticsCompany () {
  return request({
    url: `/buyer/other/logistics`,
    method: Method.GET,
    needToken: true,
    params: { pageNumber: 1, pageSize: 200, disabled: 'OPEN' }
  });
}
