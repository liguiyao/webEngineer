
// 统一Please 求路径前缀在libs/axios.js中modify
import {getRequest, postRequest, putRequest, deleteRequest} from '@/libs/axios';

//查询分销商
export const getDistributionListData = (params) => {
    return getRequest('/distribution/distribution/getByPage', params)
}
//审核分销商
export const auditDistribution = (id, params) => {
    return putRequest(`/distribution/distribution/audit/${id}`, params)
}
// 清退分销商
export const retreatDistribution = (id, params) => {
    return putRequest(`/distribution/distribution/retreat/${id}`, params)
}


// 恢复分销商
export const resumeDistribution = (id, params) => {
    return putRequest(`/distribution/distribution/resume/${id}`, params)
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
    return getRequest('/distribution/order/getByPage', params)
}

//获取分销Goods列表
export const getDistributionGoods = (params) => {
    return getRequest('/distribution/goods/getByPage', params)
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



