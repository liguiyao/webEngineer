// 统一Please 求路径前缀在libs/axios.js中modify
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  importRequest,
  getRequestWithNoToken,
  putRequestWithNoForm,
  postRequestWithNoTokenData,
  postRequestWithNoForm,
  managerUrl
} from "@/libs/axios";


let commonUrl = (process.env.NODE_ENV === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common)

// 文件上传接口
export const uploadFile = commonUrl+ "/common/common/upload/file";
// Websocket
export const ws = managerUrl + "/ws";

//获取所有city
export const getAllCity = (params) => {
  return getRequest(commonUrl + '/common/common/region/allCity', params)
}


// 获取Home查询数据
export const homeStatistics = (params) => {
  return getRequest("/statistics/index", params);
};

// 获取Hometpo10Goods
export const hotGoods = (params) => {
  return getRequest("/statistics/index/goodsStatistics", params);
};
// 获取Hometpo10店铺
export const hotShops = (params) => {
  return getRequest("/statistics/index/storeStatistics", params);
};


// 通知Tips信息
export const getNoticePage = (params) => {
  return getRequest("/statistics/index/notice", params);
};

// 登陆
export const login = (params) => {
  return postRequestWithNoTokenData("/passport/user/login", params);
};

// 登出
export const logout = () => {
  return postRequest("/passport/user/logout");
};

// 刷新token
export const handleRefreshToken = (token) => {
  return getRequestWithNoToken(`/passport/user/refresh/${token}`);
};
// 获取用户Login信息
export const userInfo = (params) => {
  return getRequest("/passport/user/info", params);
};
// 注册
export const regist = (params) => {
  return postRequest("/user/regist", params);
};
// 初始化验证码
export const initCaptcha = (params) => {
  return getRequestWithNoToken("/common/captcha/init", params);
};
// 发送Login短信验证码
export const sendLoginSms = (mobile, params) => {
  return getRequest(`/common/captcha/sendLoginSms/${mobile}`, params);
};
// 发送注册短信验证码
export const sendRegistSms = (mobile, params) => {
  return getRequest(`/common/captcha/sendRegistSms/${mobile}`, params);
};
// 发送reset密码短信验证码
export const sendResetSms = (mobile, params) => {
  return getRequest(`/common/captcha/sendResetSms/${mobile}`, params);
};
// 发送modify绑定手机短信验证码
export const sendEditMobileSms = (mobile, params) => {
  return getRequest(`/common/captcha/sendEditMobileSms/${mobile}`, params);
};
// pass手机reset密码
export const resetByMobile = (params) => {
  return postRequest("/user/resetByMobile", params);
};

// IP天气信息
export const ipInfo = (params) => {
  return getRequest("/common/ip/info", params);
};
// 个人中心edit
export const userInfoEdit = (params) => {
  return putRequest("/passport/user/edit", params);
};
// 个人中心modify密码
export const changePass = (params) => {
  return putRequest("/passport/user/editPassword", params);
};
// 个人中心modify手机
export const changeMobile = (params) => {
  return postRequest("/passport/user/changeMobile", params);
};
// 获取用户数据 多items件
export const getUserListData = (params) => {
  return getRequest("/passport/user", params);
};
// pass用户名search
export const searchUserByName = (username, params) => {
  return getRequest("/passport/user/searchByName/" + username, params);
};
// 获取全部用户数据
export const getAllUserData = (params) => {
  return getRequest("/passport/user/getAll", params);
};

// 添加用户
export const addUser = (params) => {
  return postRequest("/passport/user", params);
};
// edit管理员自身
export const editUser = (params) => {
  return putRequest("/passport/user/edit", params);
};
// edit用户
export const editOtherUser = (params) => {
  return putRequest("/passport/user/admin/edit", params);
};
// 启用用户
export const enableUser = (id, params) => {
  return putRequest(`/passport/user/enable/${id}`, params);
};
// delete用户
export const deleteUser = (ids, params) => {
  return deleteRequest(`/passport/user/${ids}`, params);
};
// 导入用户
export const importUserData = (params) => {
  return importRequest("/passport/user/importData", params);
};
/****************************** 部门 */
// pass部门获取全部角色数据
export const getUserByDepartmentId = (id, params) => {
  return getRequest(`/permission/departmentRole/${id}`, params);
};

// pass部门modify绑定角色
export const updateDepartmentRole = (id, params) => {
  return putRequestWithNoForm(`/permission/departmentRole/${id}`, params);
};

// 获取一级部门
export const initDepartment = (params) => {
  return getRequest("/permission/department", params);
};
// 加载部门子级数据
export const loadDepartment = (id) => {
  return getRequest(`/permission/department/${id}`);
};
// 添加部门
export const addDepartment = (params) => {
  return postRequest("/permission/department", params);
};
// edit部门
export const editDepartment = (ids, params) => {
  return putRequest(`/permission/department/${ids} `, params);
};
// delete部门
export const deleteDepartment = (ids, params) => {
  return deleteRequest(`/permission/department/${ids}`, params);
};
// search部门
export const searchDepartment = (params) => {
  return getRequest("/permission/department/search", params);
};

/****************************** 部门结束 */

// 获取全部角色数据
export const getAllRoleList = (params) => {
  return getRequest("/permission/role", params);
};
// 分Page获取角色数据
export const getRoleList = (params) => {
  return getRequest("/permission/role", params);
};

// 添加角色
export const addRole = (params) => {
  return postRequest("/permission/role", params);
};

// edit角色
export const editRole = (params) => {
  return putRequest(`/permission/role/${params.roleId}`, params);
};

// View某角色拥有的菜单
export const selectRoleMenu = (params) => {
  return getRequest(`/permission/roleMenu/${params}`);
};

// Save角色菜单
export const saveRoleMenu = (id, params) => {
  return postRequestWithNoForm(`/permission/roleMenu/${id}`, params);
};

// 分配角色权限
export const editRolePerm = (params) => {
  return postRequest("/permission/role/editRolePerm", params);
};
// 分配角色数据权限
export const editRoleDep = (params) => {
  return postRequest("/permission/role/editRoleDep", params);
};
// delete角色
export const deleteRole = (ids, params) => {
  return deleteRequest(`/permission/role/${ids}`, params);
};

/****************************** 角色结束 */


/****************************** 权限 */
// 获取全部权限数据
export const getAllPermissionList = (params) => {
  return getRequest("/permission/menu/tree", params);
};

// 获取全部权限数据
export const getCurrentPermissionList = (params) => {
  return getRequest("/permission/menu/memberMenu", params);
};

// 添加权限
export const addPermission = (params) => {
  return postRequest("/permission/menu", params);
};

// edit权限
export const editPermission = (params) => {
  return putRequest(`/permission/menu/${params.id}`, params);
};
// delete权限
export const deletePermission = (ids, params) => {
  return deleteRequest(`/permission/menu/${ids}`, params);
};
// search权限
export const searchPermission = (params) => {
  return getRequest("/permission/menu", params);
};

/****************************** 权限结束 */


// 分Page获取日志数据
export const getLogListData = (params) => {
  return getRequest("/setting/log/getAllByPage", params);
};
// delete日志
export const deleteLog = (ids, params) => {
  return deleteRequest(`/setting/log/${ids}`, params);
};
// 清空日志
export const deleteAllLog = (params) => {
  return deleteRequest("/setting/log", params);
};


// 分Page获Cancel息数据
export const getMessageData = (params) => {
  return getRequest("/other/message/getByCondition", params);
};
// 获取单个消息详情
export const getMessageDataById = (id, params) => {
  return getRequest(`/other/message/get/${id}`, params);
};
// 发送消息
export const addMessage = (params) => {
  return postRequest("/messageSend/send", params);
};
// edit消息
export const editMessage = (params) => {
  return postRequest("/other/message/edit", params);
};
// delete消息
export const deleteMessage = (ids, params) => {
  return deleteRequest(`/other/message/delByIds/${ids}`, params);
};
// edit发送消息
export const editMessageSend = (params) => {
  return putRequest("/messageSend/update", params);
};
// delete发送消息
export const deleteMessageSend = (ids, params) => {
  return deleteRequest(`/manager/messageSend/delByIds/${ids}`, params);
};

// 分Page获取文件数据
export const getFileListData = (params) => {
  return getRequest("/common/file", params);
};

// 重命名文件
export const renameFile = (params) => {
  return postRequest("/common/file/rename", params);
};
// delete文件
export const deleteFile = (ids, params) => {
  return deleteRequest(`/common/file/delete/${ids}`, params);
};
// 下载文件
export const aliDownloadFile = (fKey, params) => {
  return getRequest(`/file/ali/download/${fKey}`, params);
};

// base64上传
export const base64Upload = (params) => {
  return postRequest("/common/common/upload/file", params);
};

// 系统设置
export const getSetting = (key) => {
  return getRequest(`/setting/setting/get/${key}`);
};
// 更新系统配置
export const setSetting = (key, params) => {
  return putRequestWithNoForm(`/setting/setting/put/${key}`, params);
};

// 分Page查询敏感词

export const getSensitiveWordsPage = (params) => {
  return getRequest(`/other/sensitiveWords`, params);
};

// 分Page查询敏感词
export const insertSensitiveWords = (params) => {
  return postRequest(`/other/sensitiveWords`, params);
};

// modify
export const updateSensitiveWords = (id, params) => {
  return putRequest(`/other/sensitiveWords/${id}`, params);
};

// delete敏感词
export const delSensitive = (ids) => {
  return deleteRequest(`/other/sensitiveWords/delByIds/${ids}`);
};

// Add goodsUnit
export const addGoodsUnit = (params) => {
  return postRequest(`/goods/goodsUnit`, params);
};
// 分Page获取GoodsUnit
export const getGoodsUnitPage = (params) => {
  return getRequest(`/goods/goodsUnit`, params);
};
// editGoodsUnit
export const updateGoodsUnit = (id, params) => {
  return putRequest(`/goods/goodsUnit/${id}`, params);
};
// deleteGoodsUnit
export const delGoodsUnit = (ids) => {
  return deleteRequest(`/goods/goodsUnit/delete/${ids}`);
};

// 同步高德行政地区数据
export const asyncRegion = () => {
  return postRequest(`/setting/region/sync`);
};

// 批量iddelete
export const delRegion = (ids) => {
  return deleteRequest(`/setting/region/${ids}`);
};

// 更新地区
export const updateRegion = (id, params) => {
  return putRequest(`/setting/region/${id}`, params);
};
// 添加地区
export const addRegion = (params) => {
  return postRequest(`/setting/region`, params);
};

// passid获取子地区
export const getChildRegion = (id) => {
  return getRequest(`/setting/region/item/${id}`);
};

// reset用户密码
export const resetPassword = (params) => {
  return postRequest(`/passport/user/resetPassword/${params}`);
};

// 初始化Goods索引
export const createIndex = () => {
  return getRequest(`/other/elasticsearch`);
};

// 初始化Goods索引
export const getProgress = () => {
  return getRequest(`/other/elasticsearch/progress`);
};

// 分Page查询自定义分词
export const getCustomWordsPage = (params) => {
  return getRequest(`/other/customWords/page`, params);
};

// 添加自定义分词
export const insertCustomWords = (params) => {
  return postRequest(`/other/customWords`, params);
};

// modify自定义分词
export const updateCustomWords = (params) => {
  return putRequest(`/other/customWords`, params);
};

// delete自定义分词
export const delCustom = (id) => {
  return deleteRequest(`/other/customWords/${id}`);
};

// 设置热搜词
export const setHotWords = (params) => {
  return postRequest(`/hotwords/hotwords`, params);
};

// delete热搜词
export const deleteHotWords = (params) => {
  return deleteRequest(`/hotwords/hotwords`,params);
};

// 获取热搜词
export const getHotWords = () => {
  return getRequest(`/hotwords/hotwords`);
};

// 获取热词统计
export const getHotWordsStatistics = (params) => {
  return getRequest(`/hotwords/hotwords/statistics`,params);
};

// 获取历史热词
export const getHotWordsHistory = (params) => {
  return getRequest(`/hotwords/hotwords/history`,params);
};


