// 统一Please 求路径前缀在libs/axios.js中modify
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from "@/libs/axios";

// 获取秒杀活动Apply  列表

export const getPromotionSeckill = params => {
  return getRequest(`/promotion/seckill/apply`, params);
};

// 是否推荐直播间
export const whetherStar = params => {
  return putRequest(`/broadcast/studio/recommend/${params.id}`, params);
};

// 添加coupon活动
export const addCouponActivity = params => {
  return postRequest(`/promotion/couponActivity/addCouponActivity`, params);
};


// 获取店铺直播间列表
export const getLiveList = params => {
  return getRequest("/broadcast/studio", params);
};

// 获取直播间详情
export const getLiveInfo = studioId => {
  return getRequest(`/broadcast/studio/${studioId}`);
};

// 获取当前进行中的促销活动Goods

export const getPromotionGoods = (promotionId, params) => {
  return getRequest(`/promotion/${promotionId}/goods`, params);
};

// 获取当前进行中的促销活动
export const getAllPromotion = params => {
  return getRequest("/promotion/promotion/current", params);
};

// 获取拼团数据
export const getPintuanList = params => {
  return getRequest("/promotion/pintuan", params);
};

// 获取拼团详情
export const getPintuanDetail = id => {
  return getRequest(`/promotion/pintuan/${id}`);
};

// 获取拼团Goods数据
export const getPintuanGoodsList = params => {
  return getRequest(`/promotion/pintuan/goods/${params.pintuanId}`, params);
};

// Close拼团活动
export const updatePintuanStatus = (pintuanId, params) => {
  return putRequest(`/promotion/pintuan/status/${pintuanId}`, params);
};

// modify砍价活动Goods
export const saveKanJiaActivityGoods = params => {
  return postRequest("/promotion/kanJiaGoods", params, {
    "Content-type": "application/json"
  });
};
// modify砍价活动Goods
export const editKanJiaActivityGoods = params => {
  return putRequest("/promotion/kanJiaGoods", params, {
    "Content-type": "application/json"
  });
};
// 获取砍价活动Goods
export const getKanJiaGoodsList = params => {
  return getRequest(`/promotion/kanJiaGoods`, params);
};

//delete砍价活动Goods
export const delKanJiaGoods = ids => {
  return deleteRequest(`/promotion/kanJiaGoods/${ids}`);
};

// 砍价活动Goods详情
export const getKanJiaActivityGoodsById = id => {
  return getRequest(`/promotion/kanJiaGoods/${id}`);
};

// Save平台coupon
export const savePlatformCoupon = params => {
  return postRequest("/promotion/coupon", params, {
    "Content-type": "application/json"
  });
};
// modify平台coupon
export const editPlatformCoupon = params => {
  return putRequest("/promotion/coupon", params, {
    "Content-type": "application/json"
  });
};

// 获取平台coupon
export const getPlatformCouponList = params => {
  return getRequest("/promotion/coupon", params);
};
//  作废coupon
export const deletePlatformCoupon = ids => {
  return deleteRequest(`/promotion/coupon/${ids}`);
};
//  更新coupon状态
export const updatePlatformCouponStatus = params => {
  return putRequest(`/promotion/coupon/status`, params);
};
//  获取单个coupon
export const getPlatformCoupon = id => {
  return getRequest(`/promotion/coupon/${id}`);
};

// 获取coupon领取详情
export const getMemberReceiveCouponList = id => {
  return getRequest(`/promotion/coupon/member/${id}`);
};
//  作废会员coupon
export const deleteMemberReceiveCoupon = id => {
  return putRequest(`/promotion/coupon/member/cancellation/${id}`);
};


// Save平台coupon
export const saveActivityCoupon = params => {
  return postRequest("/promotion/couponActivity", params, {
    "Content-type": "application/json"
  });
};
// 获取活动Coupon list
export const getActivityCouponList = params => {
  return getRequest("/promotion/couponActivity/activityCoupons", params);
};
// 获取平台coupon活动
export const getCouponActivityList = params => {
  return getRequest("/promotion/couponActivity", params);
};
// Closecoupon活动
export const closeActivity = id => {
  return deleteRequest(`/promotion/couponActivity/${id}`);
};


//  更新coupon活动
export const updateCouponActivity = params => {
  return putRequest(`/promotion/couponActivity/status`, params);
};
//  获取单个coupon活动
export const getCouponActivity = id => {
  return getRequest(`/promotion/couponActivity/${id}`);
};

// 获取秒杀活动数据
export const getSeckillList = params => {
  return getRequest("/promotion/seckill", params);
};

// 获取秒杀活动审核列表
export const seckillGoodsList = params => {
  return getRequest("/promotion/seckill/apply", params);
};

// 获取秒杀活动详情数据
export const seckillDetail = (id, params) => {
  return getRequest(`/promotion/seckill/${id}`, params);
};

// delete秒杀活动
export const delSeckill = id => {
  return deleteRequest(`/promotion/seckill/${id}`);
};

// Save秒杀活动
export const saveSeckill = params => {
  return postRequest("/promotion/seckill", params);
};

// modify秒杀活动
export const updateSeckill = params => {
  return putRequest("/promotion/seckill", params, {
    "Content-type": "application/json"
  });
};

// Close秒杀活动
export const updateSeckillStatus = (id, params) => {
  return putRequest(`/promotion/seckill/status/${id}`, params);
};
// delete秒杀Goods
export const delSeckillGoods = params => {
  return deleteRequest(`/promotion/seckill/apply/${params.seckillId}/${params.id}`);
};
// 审核秒杀活动
export const auditApplySeckill = params => {
  return putRequest(`/promotion/seckill/apply/audit/${params.ids}`, params);
};

// full优惠列表
export const getFullDiscountList = params => {
  return getRequest(`/promotion/fullDiscount`, params);
};

// full优惠列表
export const getFullDiscountById = id => {
  return getRequest(`/promotion/fullDiscount/${id}`);
};

// Opening、Closefull额活动
export const updateFullDiscount = (id, promotionStatus) => {
  return putRequest(`/promotion/fullDiscount/status/${id}`)
}

// 积分Goods列表
export const getPointsGoodsList = params => {
  return getRequest(`/promotion/pointsGoods`, params);
};

// 积分Goods详情
export const getPointsGoodsById = id => {
  return getRequest(`/promotion/pointsGoods/${id}`);
};

// 添加积分Goods
export const addPointsGoods = params => {
  return postRequest(`/promotion/pointsGoods`, params, {
    "Content-type": "application/json"
  });
};

// modify积分Goods
export const updatePointsGoods = params => {
  return putRequest(`/promotion/pointsGoods`, params, {
    "Content-type": "application/json"
  });
};
// modify积分Goods状态
export const editPointsGoodsStatus = (id, params) => {
  return putRequest(`/promotion/pointsGoods/status/${id}`, params);
};
// delete积分Goods
export const deletePointsGoodsStatus = id => {
  return deleteRequest(`/promotion/pointsGoods/${id}`);
};

// 积分Goods分类列表
export const getPointsGoodsCategoryList = params => {
  return getRequest(`/promotion/pointsGoodsCategory`, params);
};

// 积分Goods分类详情
export const getPointsGoodsCategoryById = id => {
  return getRequest(`/promotion/pointsGoodsCategory/${id}`);
};

// 添加积分Goods分类
export const addPointsGoodsCategory = params => {
  return postRequest(`/promotion/pointsGoodsCategory`, params);
};

// 更新积分Goods分类
export const updatePointsGoodsCategory = params => {
  return putRequest(`/promotion/pointsGoodsCategory`, params);
};

// delete积分Goods分类
export const deletePointsGoodsCategoryById = id => {
  return deleteRequest(`/promotion/pointsGoodsCategory/${id}`);
};

// 获取coupon领取记录
export const getCouponReceiveList = (params) => {
  return getRequest("/promotion/coupon/received", params);
};
