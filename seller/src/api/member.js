// 统一Please 求路径前缀在libs/axios.js中modify
import { getRequest, putRequest, postRequest } from "@/libs/axios";

// 分Page获取会员Evaluate
export const getMemberReview = (params) => {
  return getRequest("/member/evaluation", params);
};

// 根据id获取Evaluate详情
export const getMemberInfoReview = (id) => {
  return getRequest(`/member/evaluation/get/${id}`);
};

//回复Evaluate信息
export const replyMemberReview = (id, params) => {
  return putRequest(`/member/evaluation/reply/${id}`, params);
};

// 获取会员注册统计列表
export const getStatisticsList = (params) => {
  return getRequest("/statistics/view/list", params);
};

//   获取分Page
export const getMember = (params) => {
  return getRequest("/member/getByPage", params);
};

//  添加或modify
export const insertOrUpdateSpec = (params) => {
  return postRequest("/memberNoticeSenter/insertOrUpdate", params);
};
//deletegUI个
export const delSpec = (id, params) => {
  return deleteRequest(`/goods/spec/del/${id}`, params);
};

//  获取会员列表
export const getMemberListData = (params) => {
  return getRequest("/member", params);
};

//  获取会员详情
export const getMemberInfoData = (id) => {
  return getRequest(`/member/${id}`);
};

//  添加会员基本信息
export const addMember = (params) => {
  return postRequest(`/member`, params);
};

//  获取会员列表
export const getMemberAll = () => {
  return getRequest("/member/getAll");
};

//  增加或modify会员列表
export const operationMemberListData = (params) => {
  return postRequest("/member/insertOrUpdate", params);
};

//  增加或modify会员列表
export const deleteMemberListData = (ids) => {
  return deleteRequest(`/member/delByIds/${ids}`);
};
// 获取充值记录列表数据
export const getUserRecharge = (params) => {
  return getRequest("/wallet/recharge", params);
};

// 获取预存款明细列表数据
export const getUserDeposit = (params) => {
  return getRequest("/deposit", params);
};

// 获取提现Apply  列表数据
export const getUserWithdrawApply = (params) => {
  return getRequest("/members/withdraw-apply", params);
};

// 审核提现Apply
export const withdrawApply = (params) => {
  return postRequest("/members/withdraw-apply", params);
};
