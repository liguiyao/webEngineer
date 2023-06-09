import Main from "@/views/Main.vue";

const config = require('@/config/index')
// 不作为Main组件的子Page面展示的Page面单独写，如下
export const loginRouter = {
  path: "/login",
  name: "login",
  meta: {
    title: `Login - ${config.title}background`
  },
  component: () => import("@/views/login.vue")
};
export const forgetPasswordRouter = {
  path: "/forgetPassword",
  name: "forgetPassword",
  component: () => import("@/views/ForgetPassword.vue")
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
      title: "Home",
      name: "home_index",
      component: () => import("@/views/home/home.vue")
    },
    {
      path: "change-password",
      title: "modify密码",
      name: "change_pass",
      component: () => import("@/views/change-password/change-password.vue")
    },
    {
      path: "message",
      title: "消息中心",
      name: "message_index",
      component: () => import("@/views/message/message.vue")
    },
    {
      path: "goods-operation",
      title: "Add goods",
      name: "goods-operation",
      component: () => import("@/views/goods/goods-seller/goodsOperation.vue")
    },
    {
      path: "goods-operation-edit",
      title: "editGoods",
      name: "goods-operation-edit",
      component: () => import("@/views/goods/goods-seller/goodsOperation.vue")
    },
    {
      path: "goods-template-operation-edit",
      title: "edit模版",
      name: "goods-template-operation-edit",
      component: () => import("@/views/goods/goods-seller/goodsOperation.vue")
    },
    {
      path: "goods-draft-operation-edit",
      title: "edit草稿",
      name: "goods-draft-operation-edit",
      component: () => import("@/views/goods/goods-seller/goodsOperation.vue")
    },
    {
      path: "add-coupon",
      title: "店铺coupon",
      name: "add-coupon",
      component: () => import("@/views/promotion/coupon/coupon-publish.vue")
    },
    {
      path: "add-live",
      title: "创建直播",
      name: "add-live",
      component: () => import("@/views/promotion/live/addLive.vue")
    },
    {
      path: "bill-detail",
      title: "结算单详情",
      name: "bill-detail",
      component: () => import("@/views/shop/bill/billDetail.vue")
    },
    {
      path: "seckill-goods",
      title: "限时抢购Goods",
      name: "seckill-goods",
      component: () => import("@/views/promotion/seckill/seckill-goods.vue")
    },
    {
      path: "pintuan-goods",
      title: "拼团Goods",
      name: "pintuan-goods",
      component: () => import("@/views/promotion/pintuan/pintuan-goods.vue")
    },
    {
      path: "pintuan-edit",
      title: "新增拼团",
      name: "pintuan-edit",
      component: () => import("@/views/promotion/pintuan/pintuan-edit.vue")
    },
    {
      path: "order-detail",
      title: "Order details",
      name: "order-detail",
      component: () => import("@/views/order/order/orderDetail.vue")
    },
    {
      path: "/floorList/main",
      title: "edit模板",
      name: "main",
      component: () => import("@/views/shop/wap/main.vue")
    },
    {
      path: "/pcFloorList/main",
      title: "edit模板",
      name: "renovation",
      component: () => import("@/views/shop/renovation.vue")
    },
    {
      path: "order-complaint-detail",
      title: "Complaint详情",
      name: "order-complaint-detail",
      component: () =>
        import("@/views/order/after-order/orderComplaintDetail.vue")
    },
    {
      path: "return-goods-order-detail",
      title: "After-sale details",
      name: "return-goods-order-detail",
      component: () =>
        import("@/views/order/after-order/reurnGoodsOrderDetail.vue")
    },
    {
      path: "full-discount-detail",
      title: "添加full额活动",
      name: "full-discount-detail",
      component: () => import("@/views/promotion/full-discount/full-discount-add.vue")
    },
    {
      path: "export-order-deliver",
      title: "发货",
      name: "export-order-deliver",
      component: () => import("@/views/order/order/exportOrderDeliver.vue")
    },
    {
      path: "order-detail",
      title: "Order details",
      name: "order-detail",
      component: () => import("@/views/order/order/orderDetail.vue")
    },
    {
      path: "/floorList/main",
      title: "edit模板",
      name: "main",
      component: () => import("@/views/shop/wap/main.vue")
    },
    {
      path: "/pcFloorList/main",
      title: "edit模板",
      name: "renovation",
      component: () => import("@/views/shop/renovation.vue")
    },
    {
      path: "promotions/coupon-receive",
      title: "coupon领取记录",
      name: "coupon-receive",
      component: () => import("@/views/promotion/coupon/coupon-receive.vue"),
    },
    // {
    //   path: "/*",
    //   name: "error-404",
    //   meta: {
    //     title: "404-Page面不存在"
    //   },
    //   component: () => import("@/views/error-page/404.vue")
    // }
  ]
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
// 所有上面定义的路由都要写在下面的routers里
export const routers = [loginRouter, forgetPasswordRouter, otherRouter, page500, page403];
