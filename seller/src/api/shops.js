// 统一Please 求路径前缀在libs/axios.js中modify
import {getRequest, postRequest, putRequest, deleteRequest, importRequest, getRequestWithNoToken} from '@/libs/axios';


// 获取数据字典
export const getDictData = "/dictData/getByType/"
// Websocket
export const ws = "/ws"


//查询店铺列表
export const getShopListData = (params) => {
  return getRequest('/shop', params)
}
// 获取结算单分页
export const getBillPage = (params) => {
  return getRequest(`/order/bill/getByPage`, params)
}

// 获取商家结算单流水分页
export const getSellerFlow = (id, params) => {
  return getRequest(`/order/bill/${id}/getStoreFlow`, params)
}

// 商家核对结算单
export const reconciliation = (id, params) => {
  return putRequest(`/order/bill/check/${id}/`, params)
}

// 获取商家分销订单流水分页
export const getDistributionFlow = (id, params) => {
  return getRequest(`/order/bill/${id}/getDistributionFlow`, params)
}

// 获取商家结算单详细
export const getBillDetail = (id, params) => {
  return getRequest(`/order/bill/get/${id}`, params)
}

// 获取所有Logistics company
export const getLogistics = (id, params) => {
  return getRequest(`/other/logistics`, params)
}
//Back信息
export const getIsCheck =(logisticsId) =>{
  return getRequest(`other/logistics/${logisticsId}/getStoreLogistics`)
}

// OpeningLogistics company
export const logisticsChecked = (id, params) => {
  return postRequest(`/other/logistics/${id}`, params, {
    "Content-type": "application/json"
  })
}
//获取发货address
export const getDeliverAddress = () =>{
  return getRequest(`/settings/storeSettings/storeDeliverGoodsAddress`)
}
//modify发货address
export const editDeliverAddress = (params) =>{
  return putRequest(`/settings/storeSettings/storeDeliverGoodsAddress`,params)
}

// CloseOpeningLogistics company
export const logisticsUnChecked = (id, params) => {
  return deleteRequest(`/other/logistics/${id}`, params)
}
// 获取商家self-lifting点
export const getShopAddress = (id, params) => {
  return getRequest(`/member/storeAddress/`, params)
}

// modify商家self-lifting点
export const editShopAddress = (id, params) => {
  return putRequest(`/member/storeAddress/${id}`, params)
}

// 添加Goodsself-lifting点
export const addShopAddress = (params) => {
  return postRequest(`/member/storeAddress/`, params)
}

// 添加Goodsself-lifting点
export const deleteShopAddress = (id) => {
  return deleteRequest(`/member/storeAddress/${id}`)
}

// 获取商家详细信息
export const getShopInfo = () => {
  return getRequest(`/settings/storeSettings`)
}

// Save商家详细信息
export const saveShopInfo = (params) => {
  return putRequest(`/settings/storeSettings`, params)
}

//获取商家Return goodsaddress
export const getRefundGoodsAddress = () => {
  return getRequest(`/settings/storeSettings/storeAfterSaleAddress`)
}
//modify商家Return goodsaddress
export const saveRefundGoodsAddress = (params) => {
  return putRequest(`/settings/storeSettings/storeAfterSaleAddress`, params)
}
//modifyim商户id
export const updatEmerchantId = (params) => {
  return putRequest(`/settings/storeSettings/merchantEuid`, params)
}


//modifySave库存预警数
export const updateStockWarning = (params) => {
  return putRequest(`/settings/storeSettings/updateStockWarning`, params)
}
//查询运费模板
export const getShipTemplate = () => {
  return getRequest(`/setting/freightTemplate`)
}
//delete运费模板
export const deleteShipTemplate = (id) => {
  return deleteRequest(`/setting/freightTemplate/${id}`)
}
//新增运费模板
export const addShipTemplate = (params, headers) => {
  return postRequest(`/setting/freightTemplate`, params, headers)
}

//新增运费模板
export const editShipTemplate = (id, params, headers) => {
  return putRequest(`/setting/freightTemplate/${id}`, params, headers)
}

//modify电子面单等信息
export const editChecked = (logisticsId,params) => {
  return putRequest(`/other/logistics/${logisticsId}/updateStoreLogistics`,params)
}


