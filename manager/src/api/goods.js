// 统一Please 求路径前缀在libs/axios.js中modify
import { getRequest, postRequest, putRequest, deleteRequest} from '@/libs/axios';

//  获取Goods Brand分Page列表
export const getManagerBrandPage = (params) => {
    return getRequest('/goods/brand/getByPage', params)
}

// 批量delete
export const delBrand = (ids) =>{
  return deleteRequest(`/goods/brand/delByIds/${ids}`)
}


//  添加
export const addBrand = (params) => {
    return postRequest('/goods/brand', params)
}
// modify品牌设置
export const updateBrand = (params) => {
    return putRequest(`/goods/brand/${params.id}`, params)
}
// disable品牌
export const disableBrand = (id, params) => {
    return putRequest(`/goods/brand/disable/${id}`, params)
}
//根据分类id获取关联品牌
export const getCategoryBrandListData = (category_id, params) => {
    return getRequest(`/goods/categoryBrand/${category_id}`, params)
}
//Save获取关联品牌
export const saveCategoryBrand = (category_id, params) => {
    return postRequest(`/goods/categoryBrand/${category_id}`, params)
}
//Save获取关联规格
export const saveCategorySpec = (category_id, params) => {
    return postRequest(`/goods/categorySpec/${category_id}`, params)
}

//获取所有available品牌
export const getBrandListData = (params) => {
    return getRequest('/goods/brand/all', params)
}
// 获取所有available规格
export const getSpecificationList = (params) => {
    return getRequest('/goods/spec/all', params)
}

//获取分类列表数据
export const getAllCategoryList = (parent_id) => {
  return getRequest(`/goods/category/${parent_id}/all-children`)
}

//获取分类列表数据
export const getCategoryTree = () => {
  return getRequest(`/goods/category/allChildren`)
}

//  Add Goods Category
export const insertCategory = (params) => {
    return postRequest('/goods/category', params)
}
//  Add Goods Category
export const updateCategory = (params) => {
    return putRequest('/goods/category', params)
}
//deleteGoods Category
export const delCategory = (id) => {
    return deleteRequest(`/goods/category/${id}`)
}
// disable分类
export const disableCategory = (id, type) => {
    return putRequest(`/goods/category/disable/${id}`, type)
}


//  获取Goods规格分Page列表
export const getSpecListData = (params) => {
    return getRequest('/goods/spec', params)
}
//  添加或modify规格设置
export const insertSpec = (params) => {
    return postRequest('/goods/spec', params)
}
//  添加或modify规格设置
export const updateSpec = (id,params) => {
    return putRequest(`/goods/spec/${id}`, params)
}
//根据分类id获取关联规格
export const getCategorySpecListData = (category_id, params) => {
    return getRequest(`/goods/categorySpec/${category_id}`, params)
}
//deletegUI个
export const delSpec = (id, params) => {
    return deleteRequest(`/goods/spec/${id}`, params)
}

// 查询某分类下的全部子分类列表
export const getGoodsCategory = (parent_id) => {
    return getRequest(`/goods/category/${parent_id}/all-children`)
}

//  OnGoods
export const upGoods = (id, params) => {
    return putRequest(`/goods/goods/${id}/up`, params)
  }
  //  OffGoods
  export const lowGoods = (id, params) => {
    return putRequest(`/goods/goods/${id}/under`, params)
  }

//  获取Goodssku分Page列表
export const getGoodsSkuData = (params) => {
    return getRequest('/goods/goods/sku/list', params)
}


//  获取Goods分Page列表
export const getGoodsListData = (params) => {
    return getRequest('/goods/goods/list', params)
}
//  获取待审核Goods分Page列表
export const getAuthGoodsListData = (params) => {
    return getRequest('/goods/goods/auth/list', params)
}
//  审核Goods
export const authGoods = (id, params) => {
    return putRequest(`/goods/goods/${id}/auth`, params)
}

//查询分类绑定参数信息
export const getCategoryParamsListData = (id, params) => {
    return getRequest(`/goods/categoryParameters/${id}`, params)
}

//查询Goods绑定参数信息
export const getCategoryParamsByGoodsId = (goodsId, categoryId) => {
    return getRequest(`/goods/parameters/${goodsId}/${categoryId}`)
}
//Save参数
export const insertGoodsParams = (params) => {
    return postRequest('/goods/parameters', params)
}
//更新参数
export const updateGoodsParams = (params) => {
    return putRequest('/goods/parameters', params)
}
//delete参数
export const deleteParams = (id, params) => {
    return deleteRequest(`/goods/parameters/${id}`, params)
}
//Save参数组
export const insertParamsGroup = (params) => {
    return postRequest('/goods/categoryParameters', params)
}
//更新参数组
export const updateParamsGroup = (params) => {
    return putRequest('/goods/categoryParameters', params)
}
//delete参数组
export const deleteParamsGroup = (id, params) => {
    return deleteRequest(`/goods/categoryParameters/${id}`, params)
}

//Save获取关联规格
export const getGoodsSpecInfo = (category_id, params) => {
    return getRequest(`/goods/categorySpec/goods/${category_id}`, params)
}


//获取sku列表
export const getSkuPage = (params) => {
  return getRequest(`/goodsSku/getByPage`, params)
}


//ViewGoods Detail
export const getGoodsDetail = (id) => {
  return getRequest(`/goods/goods/get/${id}`)
}



// 获取订单统计图表
export const getOrderChart = (params) => {
  return getRequest(`/statistics/order`, params)
}


// 订单统计概览
export const getOrderOverView = (params) => {
  return getRequest(`/statistics/order/overview`, params)
}

// 统计相关订单统计

export const statisticsOrderList = (params) => {
  return getRequest(`/statistics/order/order`, params)
}

// 统计相关退单统计

export const statisticsOrderRefundList = (params) => {
  return getRequest(`/statistics/order/refund`, params)
}


// 获取行业统计列表
export const goodsCategoryStatistics = (params) => {
    return getRequest(`/statistics/goods/getCategoryByPage`, params)
}

// 获取统计列表,排行前一百的数据
export const goodsStatistics = (params) => {
    return getRequest(`/statistics/goods`, params)
}


// 获取refund统计列表
export const refundStatistics = (params) => {
    return getRequest(`/statistics/refund/order/getByPage`, params)
}

// 获取refund统计金额
export const refundPriceStatistics = (params) => {
    return getRequest(`/statistics/refund/order/getPrice`, params)
}
