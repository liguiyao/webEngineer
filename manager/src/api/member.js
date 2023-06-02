// 统一Please 求路径前缀在libs/axios.js中modify
import {
  getRequest,
  putRequest,
  postRequest,
  deleteRequest,
} from "@/libs/axios";

//   获取分页
export const getMember = (params) => {
  return getRequest("/member/getByPage", params);
};

// 分页获取会员Evaluate
export const getMemberReview = (params) => {
  return getRequest("/member/evaluation/getByPage", params);
};

// 获取id
export const getMemberInfoReview = (id) => {
  return getRequest(`/member/evaluation/get/${id}`);
};

// delete评论
export const delMemberReview = (id) => {
  return putRequest(`/member/evaluation/delete/${id}`);
};
// modifyEvaluate状态
export const updateMemberReview = (id, params) => {
  return getRequest(`/member/evaluation/updateStatus/${id}`, params);
};

//  添加或modify
export const insertOrUpdateSpec = (params) => {
  return postRequest("/memberNoticeSenter/insertOrUpdate", params);
};

//  获取会员列表
export const getMemberListData = (params) => {
  return getRequest("/passport/member", params);
};

//  获取会员详情
export const getMemberInfoData = (id) => {
  return getRequest(`/passport/member/${id}`);
};

//  modify会员基本信息
export const updateMember = (params) => {
  return putRequest(`/passport/member`, params);
};

//  添加会员基本信息
export const addMember = (params) => {
  return postRequest(`/passport/member`, params);
};

//  获取会员列表
export const getMemberAll = () => {
  return getRequest("/passport/member/getAll");
};

//  增加或modify会员列表
export const operationMemberListData = (params) => {
  return postRequest("/passport/member/insertOrUpdate", params);
};

//  增加或modify会员列表
export const deleteMemberListData = (ids) => {
  return deleteRequest(`/passport/member/delByIds/${ids}`);
};
// 获取充值记录列表数据
export const getUserRecharge = (params) => {
  return getRequest("/wallet/recharge", params);
};

// 获取预存款明细列表数据
export const getUserWallet = (params) => {
  return getRequest("/wallet/log", params);
};

// 获取提现Apply  列表数据
export const getUserWithdrawApply = (params) => {
  return getRequest("/wallet/withdrawApply", params);
};

// 审核提现Apply
export const withdrawApply = (params) => {
  return postRequest("/wallet/withdrawApply", params);
};

//会员状态modify
export const updateMemberStatus = (params) => {
  return putRequest("/passport/member/updateMemberStatus", params);
};

// 获取会员注册统计列表
export const getMemberStatistics = (params) => {
  return getRequest("/statistics/member", params);
};

// 获取流量统计
export const getStatisticsList = (params) => {
  return getRequest("/statistics/view/list", params);
};

// 获取会员历史流量
export const historyMemberChartList = () => {
  return getRequest("/statistics/view/online/history");
};

//查询会员Quantity
export const getMemberNum = (params) => {
  return getRequest("/passport/member/num", params);
};
//查询会员历史积分
export const getHistoryPointData = (params) => {
  return getRequest(`/member/memberPointsHistory/getByPage`, params);
};
//查询会员的Delivery address
export const getMemberAddressData = (id, params) => {
  return getRequest(`/member/address/${id}`, params);
};
//delete会员address
export const removeMemberAddress = (id) => {
  return deleteRequest(`/member/address/delById/${id}`);
};
//添加会员Delivery address
export const addMemberAddress = (params) => {
  return postRequest(`/member/address`, params);
};
//modify会员Delivery address
export const editMemberAddress = (params) => {
  return putRequest(`/member/address`, params);
};
//查询会员预存款
export const getMemberWallet = (params) => {
  return getRequest(`/wallet/wallet`, params);
};
