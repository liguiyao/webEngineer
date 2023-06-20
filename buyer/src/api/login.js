
import request, {Method, buyerUrl} from '@/plugins/request.js';

/**
 * 注册
 */
export function regist (params) {
  return request({
    url: '/buyer/passport/member/register',
    method: Method.POST,
    needToken: false,
    data: params
  });
}

/**
 * Account login
 */
export function login (params) {
  return request({
    url: '/buyer/passport/member/userLogin',
    method: Method.POST,
    needToken: false,
    data: params,
    headers: { 'clientType': 'PC' }
  });
}

/**
 * Phone numberSMS login
 */
export function smsLogin (params) {
  return request({
    url: '/buyer/passport/member/smsLogin',
    method: Method.POST,
    needToken: false,
    data: params,
    headers: { 'clientType': 'PC' }
  });
}

/**
 * 获取用户信息
 */
export function getMemberMsg (params) {
  return request({
    url: '/buyer/passport/member',
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 第三方Login Alipay，微博，qq,Wechat
 */
export function webLogin (type) {
  window.open(`${buyerUrl}/buyer/passport/connect/connect/login/web/${type}`, 'blank');
}

/**
 * 第三方Loginsuccess 回调接口
 */
export function loginCallback (uuid) {
  return request({
    url: `/buyer/passport/connect/connect/result?state=${uuid}`,
    method: Method.GET,
    needToken: false
  });
}

/**
 * Forget Password  验证phone verification code
 */
export function validateCode (params) {
  return request({
    url: `/buyer/passport/member/resetByMobile`,
    method: Method.POST,
    needToken: false,
    params
  });
}

/**
 * Forget Password reset密码
 */
export function resetPassword (params) {
  return request({
    url: `/buyer/passport/member/resetPassword`,
    method: Method.POST,
    needToken: false,
    params
  });
}

export function getSCLoginCode(params) {
  return request({
    url: `/buyer/passport/member/pc_session`,
    method: Method.POST,
    needToken: false,
    params
  });
}
export function sCLogin(token,params) {
  return request({
    url: `/buyer/passport/member/session_login/`+token,
    method: Method.POST,
    needToken: false,
    params
  });
}
