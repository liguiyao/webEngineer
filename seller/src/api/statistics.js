// 统一Please 求路径前缀在libs/axios.js中modify
import {getRequest, postRequest, putRequest, deleteRequest, importRequest, getRequestWithNoToken} from '@/libs/axios';

//Goods统计
export const getGoodsStatisticsData = (params) => {
  return getRequest(`/statistics/goods`, params)
}

//获取订单统计金额
export const getOrderStatisticsPrice = (params) => {
  return getRequest(`/statistics/order/getPrice`, params)
}

//订单统计列表
export const getOrderStatistics = (params) => {
  return getRequest(`/statistics/order/getByPage`, params)
}



