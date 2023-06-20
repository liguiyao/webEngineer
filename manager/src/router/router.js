import Main from "@/views/Main.vue";

const config = require('@/config/index')
// 不作为Main组件的子Page面展示的Page面单独写，如下
export const loginRouter = {
  path: "/login",
  name: "login",
  meta: {
    title: `Login - ${config.title}Backstage`
  },
  component: () => import("@/views/login.vue")
};

// 作为Main组件的子Page面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: "/",
  name: "otherRouter",
  redirect: "/home",
  component: Main,
  children: [
    {
      path: "home",
      title: 'Home',
      name: "home_index",
      component: () => import("@/views/home/home.vue")
    },
    {
      path: "personal-center",
      title: "个人中心",
      name: "personal-center",
      meta: { title: "个人中心" },
      component: () => import("@/views/personal-center/personal-center.vue")
    },
    {
      path: "change-password",
      title: "modify密码",
      name: "change_password",
      component: () => import("@/views/change-password/change-password.vue")
    },
    {
      path: "category",
      title: "类型列表",
      name: "category",
      component: () => import("@/views/goods/goods-manage/category.vue")
    },
    {
      path: "parameter",
      title: "参数绑定",
      name: "parameter",
      component: () => import("@/views/goods/goods-manage/parameter.vue")
    },
    {
      path: "shop",
      title: "店铺列表",
      name: "shop",
      component: () => import("@/views/seller/shop/shopList.vue")
    },
    {
      path: "shop-operation",
      title: "店铺operation",
      name: "shop-operation",
      component: () => import("@/views/seller/shop/shopOperation.vue")
    },
    {
      path: "shop-detail",
      title: "店铺详细",
      name: "shop-detail",
      component: () => import("@/views/seller/shop/shopDetail.vue")
    },
    {
      path: "bill-detail",
      title: "结算单详情",
      name: "bill-detail",
      component: () => import("@/views/seller/bill/bill-detail.vue")
    },
    {
      path: "apply-goods",
      title: "Goods审核列表",
      name: "apply-goods",
      component: () => import("@/views/goods/goods-info/goodsApply.vue")
    },
    {
      path: "manager-goods",
      title: "管理端Goods列表",
      name: "manager-goods",
      component: () => import("@/views/goods/goods-info/goods.vue")
    },
    {
      path: "goods-brand",
      title: "Goods Brand",
      name: "goods-brand",
      component: () => import("@/views/goods/goods-manage/brand.vue")
    },
    {
      path: "goods-category",
      title: "Goods Category",
      name: "goods-category",
      component: () => import("@/views/goods/goods-manage/category.vue")
    },
    {
      path: "goods-parameter",
      title: "Parameter",
      name: "goods-parameter",
      component: () => import("@/views/goods/goods-manage/parameter.vue")
    },
    {
      path: "goods-spec",
      title: "Parameter",
      name: "goods-spec",
      component: () => import("@/views/goods/goods-manage/spec.vue")
    },
    {
      path: "order-complaint-detail",
      title: "Complaint详情",
      name: "order-complaint-detail",
      component: () =>
        import("@/views/order/after-order/orderComplaintDetail.vue")
    },
    {
      path: "order-list",
      title: "订单列表",
      name: "order-list",
      component: () => import("@/views/order/order/orderList.vue")
    },
    {
      path: "order-detail",
      title: "Order details",
      name: "order-detail",
      component: () => import("@/views/order/order/orderDetail.vue")
    },
    {
      path: "after-order-detail",
      title: "after sale单详情",
      name: "after-order-detail",
      component: () =>
        import("@/views/order/after-order/afterSaleOrderDetail.vue")
    },
    {
      path: "shop-operation",
      title: "店铺详情",
      name: "shop-operation",
      component: () => import("@/views/seller/shop/shopOperation.vue")
    },
    {
      path: "member-detail",
      title: "会员详情",
      name: "member-detail",
      component: () => import("@/views/member/list/memberDetail.vue")
    },

    {
      path: "goods/goods-info/goodsDetail",
      title: "Goods Detail",
      name: "goods-detail",
      component: () => import("@/views/goods/goods-info/goodsDetail.vue")
    },
    {
      path: "promotions/add-points-goods",
      title: "添加积分Goods",
      name: "add-points-goods",
      component: () =>
        import("@/views/promotions/points-goods/points-goods-add.vue")
    },
    {
      path: "promotions/edit-points-goods",
      title: "modify积分Goods",
      name: "edit-points-goods",
      component: () =>
        import("@/views/promotions/points-goods/points-goods-edit.vue")
    },
    {
      path: "promotions/manager-points-goods-category",
      title: "积分Goods Category",
      name: "manager-points-goods-category",
      component: () =>
        import("@/views/promotions/points-goods-category/points-goods-category.vue")
    },
    {
      path: "promotions/add-kanJia-activity-goods",
      title: "添加砍价活动",
      name: "add-kanJia-activity-goods",
      component: () => import("@/views/promotions/kanjia/kanjia-activity-add-goods.vue")
    },
    {
      path: "promotions/edit-kanJia-activity-goods",
      title: "modify砍价活动",
      name: "edit-kanJia-activity-goods",
      component: () => import("@/views/promotions/kanjia/kanjia-activity-edit-goods.vue")
    },
    {
      path: "promotions/manager-coupon",
      title: "平台coupon",
      name: "manager-coupon",
      component: () => import("@/views/promotions/coupon/coupon.vue")
    },
    {
      path: "promotions/coupon-receive",
      title: "coupon领取记录",
      name: "coupon-receive",
      component: () => import("@/views/promotions/coupon/coupon-receive.vue"),
    },
    {
      path: "promotions/add-platform-coupon",
      title: "添加平台coupon",
      name: "add-platform-coupon",
      component: () => import("@/views/promotions/coupon/coupon-publish.vue")
    },
    {
      path: "promotions/edit-platform-coupon",
      title: "edit平台coupon",
      name: "edit-platform-coupon",
      component: () => import("@/views/promotions/coupon/coupon-publish.vue")
    },
    {
      path: "promotions/add-coupon-activity",
      title: "添加coupon活动",
      name: "add-coupon-activity",
      component: () => import("@/views/promotions/coupon-activity/coupon-publish.vue")
    },
    {
      path: "promotions/edit-coupon-activity",
      title: "edit平台coupon活动",
      name: "edit-coupon-activity",
      component: () => import("@/views/promotions/coupon-activity/coupon-publish.vue")
    },
    {
      path: "promotions/coupon-activity-info",
      title: "券活动详情",
      name: "coupon-activity-info",
      component: () => import("@/views/promotions/coupon-activity/coupon-info.vue")
    },
    {
      path: "promotions/manager-pintuan",
      title: "平台拼团",
      name: "manager-pintuan",
      component: () => import("@/views/promotions/pintuan/pintuan.vue")
    },
    {
      path: "promotions/pintuan/pintuan-goods",
      title: "拼团Goods",
      name: "pintuan-goods",
      component: () => import("@/views/promotions/pintuan/pintuan-goods.vue")
    },
    {
      path: "promotions/full-discount-detail",
      title: "full减fulloff详情",
      name: "full-discount-detail",
      component: () => import("@/views/promotions/full-discount/full-discount-detail.vue")
    },
    {
      path: "promotions/seckill/manager-seckill-add",
      title: "edit秒杀活动",
      name: "manager-seckill-add",
      component: () => import("@/views/promotions/seckill/seckill-add.vue")
    },
    {
      path: "promotions/seckill/seckill-goods",
      title: "秒杀Goods",
      name: "seckill-goods",
      component: () => import("@/views/promotions/seckill/seckill-goods.vue")
    },
    {
      path: "/floorList/renovation",
      title: "edit模板",
      name: "renovation",
      component: () => import("@/views/page-decoration/renovation.vue")
    },
    {
      path: "/floorList/main",
      title: "edit模板",
      name: "main",
      component: () => import("@/views/page-decoration/wap/main.vue")
    },
    {
      path: "add-sms-sign",
      title: "短信签名",
      name: "add-sms-sign",
      component: () => import("@/views/sys/message/smsSign.vue")
    },
    {
      path: "live-detail",
      title: "View直播",
      name: "live-detail",
      component: () => import("@/views/promotions/live/live-detail.vue")
    }
  ]
};

export const page404 = {
  path: "/*",
  name: "error-404",
  meta: {
    title: "404-Page面不存在"
  },
  component: () => import("@/views/error-page/404.vue")
};

export const page403 = {
  path: "/403",
  meta: {
    title: "403-权限不足"
  },
  name: "error-403",
  component: () => import("@/views/error-page/403.vue")
};

export const page500 = {
  path: "/500",
  meta: {
    title: "500-服务端错误"
  },
  name: "error-500",
  component: () => import("@/views/error-page/500.vue")
};

export const externalLink = {
  path: "/external-link",
  meta: {
    title: "外部链接"
  },
  name: "external-link",
  component: () => import("@/views/external-link/index.vue")
};

// 所有上面定义的路由都要写在下面的routers里
export const routers = [loginRouter, otherRouter, page500, page403, externalLink];
