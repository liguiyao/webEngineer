import request, {
  Method
} from '@/plugins/request.js';

// Goods列表
export function goodsList (params) {
  return request({
    url: '/buyer/goods/goods/es',
    method: Method.GET,
    needToken: false,
    params
  });
}

// Goods分类 筛选条件  品牌， 尺寸等
export function filterList (params) {
  return request({
    url: '/buyer/goods/goods/es/related',
    method: Method.GET,
    needToken: false,
    params
  });
}

// id获取Goods详情
export function goodsDetail (goodsId) {
  return request({
    url: `/buyer/goods/goods/get/${goodsId}`,
    method: Method.GET,
    needToken: false
  });
}

// id获取GoodsSku详情
export function goodsSkuDetail (params) {
  return request({
    url: `/buyer/goods/goods/sku/${params.goodsId}/${params.skuId}`,
    method: Method.GET,
    needToken: true,
    params
  });
}

// 获取所有Goods分类
export function getCategory (parentId) {
  return request({
    url: `/buyer/goods/category/get/${parentId}`,
    method: Method.GET,
    needToken: false
  });
}

// 当前拼团活动未成团会员
export function pintuanMembers (pintuanId) {
  return request({
    url: `/buyer/promotion/pintuan/${pintuanId}/members`,
    method: Method.GET,
    needToken: false
  });
}

/**
 * 获取search热词
 * @param {Number} count 获取search热词Quantity
 */
export function hotWords (params) {
  return request({
    url: `/buyer/goods/goods/hot-words`,
    method: Method.GET,
    needToken: false,
    params
  });
}
