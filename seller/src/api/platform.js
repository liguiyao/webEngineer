// 统一Please 求路径前缀在libs/axios.js中modify
import { getRequest, postRequest, putRequest, deleteRequest, importRequest, getRequestWithNoToken } from '@/libs/axios';

// 获取kuaidi配置
export const getParams = (params) => {
    return getRequest('/platformSetting/get/'+params)
}
// editkuaidi配置
export const editParams = (params,method) => {
    return postRequest('/platformSetting/insertOrUpdate/'+method, params)
}
