// 统一Please 求路径前缀在libs/axios.js中modify
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  getRequestHasHeader,
  importRequest,
  getRequestWithNoToken
} from "@/libs/axios";



// 分Page获取Logistics company
export const getLogisticsPage = params => {
  return getRequest(`/other/logistics/getByPage`, params);
};
// delete
export const delLogistics = id => {
  return deleteRequest(`/other/logistics/delete/${id}`);
};
// 添加
export const addLogistics = params => {
  return postRequest(`/other/logistics/save`,params);
};
// passid查询详情
export const getLogisticsDetail = id => {
  return getRequest(`/other/logistics/get/${id}`);
};
// edit
export const updateLogistics = (id,params) => {
  return putRequest(`/other/logistics/${id}`,params);
};

export const getCheckedOn = params =>{
  return getRequest(`/other/logistics/getCheckedFaceSheet`,params);
}

//获取logistics设置
export const getLogisticsSetting = () =>{
  return getRequest(`/other/logistics`);
}

export const getShunFengFaceSheet = (url,headers) =>{
  return getRequestHasHeader(`${url}`,null,headers);
}


