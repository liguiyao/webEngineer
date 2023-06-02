// 统一Please 求路径前缀在libs/axios.js中modify
import { getRequest, postRequest, putRequest ,postRequestWithNoForm } from "@/libs/axios";

import { baseUrl } from "@/libs/axios.js";

// 下载待发货的订单列表
export const verificationCode = verificationCode => {
  return getRequest(`/order/order/getOrderByVerificationCode/${verificationCode}`);
};

// 下载待发货的订单列表
export const downLoadDeliverExcel = params => {
  return getRequest(`/order/order/downLoadDeliverExcel`, params, 'blob');
};
// 导出待发货订单
export const queryExportOrder = params => {
  return getRequest(`/order/order/queryExportOrder`, params);
};

//获取电子面单
export const getOrderFaceSheet= (orderSn,params) =>{
  return postRequest(`/order/order/${orderSn}/createElectronicsFaceSheet`,params)
}

// 上传待发货的订单列表
export const uploadDeliverExcel = params => {
  return postRequestWithNoForm(`/order/order/batchDeliver`, params );
};

// 获取普通订单列表
export const getOrderList = params => {
  return getRequest(`/order/order`, params);
};

// 获取普通订单详细信息
export const getOrderDetail = sn => {
  return getRequest(`/order/order/${sn}`);
};

// 调整订单金额
export const modifyOrderPrice = (sn, params) => {
  return putRequest(`/order/order/update/${sn}/price`, params);
};

// Cancel order
export const cancelOrder = (sn, params) => {
  return postRequest(`/order/order/${sn}/cancel`, params);
};

// modifyDelivery address
export const editOrderConsignee = (sn, params) => {
  return postRequest(`/order/order/update/${sn}/consignee`, params);
};
//获取Complaint列表
export const getComplainPage = params => {
  return getRequest(`/order/complain`, params);
};

//获取Complaint详情
export const getComplainDetail = id => {
  return getRequest(`/order/complain/${id}`);
};

//添加交易Complaint对话
export const addOrderComplaint = params => {
  return postRequest(`/order/complain/communication/`, params);
};

//添加交易Complaint对话
export const appeal = params => {
  return putRequest(`/order/complain/appeal`, params);
};

//获取订单日志
export const getOrderLog = (sn, params) => {
  return getRequest(`/orderLog/${sn}`, params);
};

// 订单发货
export const orderDelivery = (sn, params) => {
  return postRequest(`/order/order/${sn}/delivery`, params);
};

// 订单发货
export const orderShunFengDelivery = (sn) => {
  return postRequest(`/order/order/${sn}/shunfeng/delivery`);
};

// 获取商家选中的Logistics company
export const getLogisticsChecked = () => {
  return getRequest(`/other/logistics/getChecked`);
};

// 订单核验
export const orderTake = (sn, verificationCode) => {
  return putRequest(`/order/order/take/${sn}/${verificationCode}`);
};

// after sale服务单
export const afterSaleOrderPage = params => {
  return getRequest(`/order/afterSale/page`, params);
};

// after sale服务单详情
export const afterSaleOrderDetail = sn => {
  return getRequest(`/order/afterSale/${sn}`);
};

// 商家审核
export const afterSaleSellerReview = (sn, params) => {
  return putRequest(`/order/afterSale/review/${sn}`, params);
};

// 商家Confirm receipt
export const afterSaleSellerConfirm = (sn, params) => {
  return putRequest(`/order/afterSale/confirm/${sn}`, params);
};

// 商家换货业务发货
export const afterSaleSellerDelivery = (sn, params) => {
  return postRequest(`/order/afterSale/${sn}/delivery`, params);
};
//查询logistics
export const getTraces = (sn, params) => {
  return getRequest(`/order/order/getTraces/${sn}`, params);
};
//after sale单查询logistics
export const getSellerDeliveryTraces = (sn, params) => {
  return getRequest(`/order/afterSale/getSellerDeliveryTraces/${sn}`, params);
};
//after sale单查询logistics
export const getAfterSaleTraces = (sn, params) => {
  return getRequest(`/order/afterSale/getDeliveryTraces/${sn}`, params);
};
//获取发票列表
export const getReceiptPage = params => {
  return getRequest(`/trade/receipt`, params);
};

//获取发票列表
export const invoicing = id => {
  return postRequest(`/trade/receipt/${id}/invoicing`);
};
