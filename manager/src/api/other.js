// 统一Please 求路径前缀在libs/axios.js中modify
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from "@/libs/axios";

/**
 * 楼层装修设置
 *
 */
export const setHomeSetup = params => {

  return postRequest("/other/pageData/add", params);
};

/**
 * 获取Page面信息
 *
 */
export const getHomeData = params => {

  return getRequest(`/other/pageData/${params}`);
};


/**
 * 查询楼层装修列表
 *
 */
export const getHomeList = params => {

  return getRequest("/other/pageData/pageDataList", params);
};


/**
 * modify楼层装修
 *
 */
export const updateHome = (id, params) => {

  return putRequest(`/other/pageData/update/${id}`, params);
};

/**
 * delete楼层装修
 *
 */
export const removePageHome = (id) => {

  return deleteRequest(`/other/pageData/remove/${id}`);
};


/**
 * 发布Page面
 *
 */
export const releasePageHome = (id) => {

  return putRequest(`/other/pageData/release/${id}`);
};

//管理员获取发送列表
export const getMessagePage = (params) => {
  return getRequest(`/other/message`, params);
};
//管理员获取发送列表
export const sendMessage = (params) => {
  return postRequest(`/other/message`, params);
};
//管理员获取发送详情列表
export const getShopMessage = (params) => {
  return getRequest(`/other/storeMessage`, params);
};

//管理员获取会员意见反馈
export const getMemberFeedback = (params) => {
  return getRequest(`/other/feedback`, params);
};

//管理员获取会员意见反馈
export const getMemberFeedbackDetail = (id) => {
  return getRequest(`/other/feedback/${id}`);
};

//管理员获取发送详情列表
export const getMemberMessage = (params) => {
  return getRequest(`/other/memberMessage`, params);
};

// 弹窗广告
export const getOpenHomeData = params => {
  return getRequest(`/other/pageData/pageType/${params}`);
};
// Savemodify弹窗广告
export const addOpenHomeData = params => {
  return postRequest(`/other/pageData/pageType/${params}`);
};
