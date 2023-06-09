
// 统一Please 求路径前缀在libs/axios.js中modify
import {getRequest, postRequest, putRequest, deleteRequest, importRequest, getRequestWithNoToken} from '@/libs/axios';


//获取分销Goods列表
export const getDistributionGoods = (params) => {
  return getRequest('/distribution/goods', params)
}

// Cancel分销Goods
export const distributionGoodsCancel = (id) => {
  return deleteRequest(`/distribution/goods/cancel/${id}`)
}

// select分销Goods
export const distributionGoodsCheck = (id,param) => {
  return putRequest(`/distribution/goods/checked/${id}`,param)
}


//查询分销商
export const getDistributionListData = (params) => {
    return getRequest('/distribution/getByPage', params)
}
//审核分销商
export const auditDistribution = (id, params) => {
    return putRequest(`/distribution/audit/${id}`, params)
}

// 清退分销商
export const retreatDistribution = (id, params) => {
    return putRequest(`/distribution/retreat/${id}`, params)
}

// 恢复分销商
export const resumeDistribution = (id, params) => {
    return putRequest(`/distribution/resume/${id}`, params)
}

//Save更新分销设置
export const saveDistributionSetting = (params) => {
    return postRequest('/distribution/setting/insertOrUpdate', params)
}

//获取分销设置
export const getDistributionSetting = (id, params) => {
    return getRequest(`/distribution/setting/get/${id}`, params)
}


//获取分销订单列表
export const getDistributionOrder = (params) => {
    return getRequest('/distribution/order', params)
}


//delete分销Goods
export const delDistributionGoods = (ids) => {
    return deleteRequest(`/distribution/goods/delByIds/${ids}`)
}
//获取分销佣金信息
export const getDistributionCash = (params) => {
    return getRequest('/distribution/cash/getByPage', params)
}
//审核分销佣金Apply
export const auditDistributionCash = (id,params) => {
    return postRequest(`/distribution/cash/audit/${id}`, params)
}



