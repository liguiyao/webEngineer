// 统一Please 求路径前缀在libs/axios.js中modify
import { getRequest, postRequest, postRequestWithNoForm, putRequest, deleteRequest, importRequest, uploadFileRequest } from '@/libs/axios';


// 获取店铺直播间列表
export const getLiveList = (params) => {
    return getRequest('/broadcast/studio', params)
}
// 添加直播间
export const addLive = (params) => {
    return postRequest('/broadcast/studio', params)
}

// 获取直播间详情
export const getLiveInfo = (studioId) => {
    return getRequest(`/broadcast/studio/studioInfo/${studioId}`)
}

// modify直播间
export const editLive = (params) => {
    return putRequest('/broadcast/studio/edit', params)
}

// 获取店铺直播Goods
export const getLiveGoods = (params) => {
    return getRequest('/broadcast/commodity', params)
}

// 店铺直播间deleteGoods
export const delLiveGoods = (goodsId) => {
    return deleteRequest(`/broadcast/commodity/${goodsId}`)
}

// 直播间deleteGoods
export const delRoomLiveGoods = (roomId, liveGoodsId) => {
    return deleteRequest(`/broadcast/studio/deleteInRoom/${roomId}/${liveGoodsId}`)
}

// 添加店铺直播Goods
export const addLiveStoreGoods = (params) => {
    return postRequestWithNoForm('/broadcast/commodity', params)
}

// 店铺直播间添加
export const addLiveGoods = (params) => {

    return putRequest(`/broadcast/studio/push/${params.roomId}/${params.liveGoodsId}`, { goodsId: params.goodsId })
}

// 获取拼团列表
export const getPintuanList = (params) => {
    return getRequest('/promotion/pintuan', params)
}
// 新建 拼团
export const savePintuan = (params) => {
    return postRequest('/promotion/pintuan', params, { 'Content-type': 'application/json' })
}
// edit 拼团
export const editPintuan = (params) => {
    return putRequest('/promotion/pintuan', params, { 'Content-type': 'application/json' })
}
// 手动Opening拼团活动
export const editPintuanStatus = (pintuanId, params) => {
    return putRequest(`/promotion/pintuan/status/${pintuanId}`, params)
}

// delete拼团活动
export const deletePintuan = (pintuanId) => {
    return deleteRequest(`/promotion/pintuan/${pintuanId}`)
}

// 根据id获取拼团信息
export const getPintuanDetail = (id) => {
    return getRequest(`/promotion/pintuan/${id}`)
}

// 获取拼团Goods列表
export const getPintuanGoodsList = (params) => {
    return getRequest(`/promotion/pintuan/goods/${params.pintuanId}`, params)
}

// 新增coupon
export const saveShopCoupon = (params) => {
    return postRequest('/promotion/coupon', params, { 'Content-type': 'application/json' })
}

// modifycoupon
export const editShopCoupon = (params) => {
    return putRequest('/promotion/coupon', params, { 'Content-type': 'application/json' })
}

// 获取Coupon list
export const getShopCouponList = (params) => {
    return getRequest('/promotion/coupon', params)
}

//  更新couponstate
export const updateCouponStatus = (params) => {
    return putRequest(`/promotion/coupon/status`, params)
}

//  作废coupon
export const deleteShopCoupon = (ids) => {
    return deleteRequest(`/promotion/coupon/${ids}`)
}
//  Oncoupon
export const upShopCoupon = (ids, params) => {
    return postRequest(`/promotion/coupon/up/${ids}`, params)
}
//  获取单个coupon
export const getShopCoupon = (id) => {
    return getRequest(`/promotion/coupon/${id}`)
}

// 获取coupon领取详情
export const getMemberReceiveCouponList = (id) => {
    return getRequest(`/promotion/memberCoupon/getByPage/${id}`)
}
//  作废会员coupon
export const deleteMemberReceiveCoupon = (ids, params) => {
    return deleteRequest(`/promotion/memberCoupon/delByIds/${ids}`, params)
}

// 限时秒杀活动列表
export const seckillList = (params) => {
    return getRequest(`/promotion/seckill`, params)
}

// 限时秒杀活动Goods
export const seckillGoodsList = (params) => {
    return getRequest(`/promotion/seckill/apply`, params)
}

// 添加限时抢购 Goods
export const setSeckillGoods = (params) => {
    return postRequest(`/promotion/seckill/apply/${params.seckillId}`, params.applyVos, { 'Content-type': 'application/json' })
}

// 添加限时抢购 Goods
export const removeSeckillGoods = (seckillId, ids) => {
    return deleteRequest(`/promotion/seckill/apply/${seckillId}/${ids}`)
}

// 限时秒杀活动详情
export const seckillDetail = (seckillId) => {
    return getRequest(`/promotion/seckill/${seckillId}`)
}
// delete秒杀Goods
export const delSeckillGoods = params => {
    return deleteRequest(`/promotion/seckill/apply/${params.seckillId}/${params.id}`);
};
// full减full赠活动列表
export const getFullDiscountList = (params) => {
    return getRequest(`/promotion/fullDiscount`, params)
}

// 新增full减活动
export const newFullDiscount = (params) => {
    return postRequest(`/promotion/fullDiscount`, params, { 'Content-type': 'application/json' })
}

// editfull减活动
export const editFullDiscount = (params) => {
    return putRequest(`/promotion/fullDiscount`, params, { 'Content-type': 'application/json' })
}

// passid获取full减活动
export const getFullDiscountById = (id) => {
    return getRequest(`/promotion/fullDiscount/${id}`)
}

// deletefull减活动
export const delFullDiscount = (id) => {
    return deleteRequest(`/promotion/fullDiscount/${id}`)
}
// Opening、Closefull减活动
export const updateFullDiscount = (id, params) => {
    return putRequest(`/promotion/fullDiscount/status/${id}`, params)
}

// 获取coupon领取记录
export const getCouponReceiveList = (params) => {
    return getRequest("/promotion/coupon/received", params);
};
