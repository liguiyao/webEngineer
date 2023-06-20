import Vue from "vue";
import Router from "vue-router";
import Index from "@/pages/Index";
const Login = (resolve) => require(["@/pages/Login"], resolve);
const SignUp = (resolve) => require(["@/pages/SignUp"], resolve);
const ForgetPassword = (resolve) =>
  require(["@/pages/ForgetPassword"], resolve);
const GoodsList = (resolve) => require(["@/pages/GoodsList"], resolve);
const GoodsDetail = (resolve) => require(["@/pages/GoodsDetail"], resolve);
const PointGoodsDetail = (resolve) =>
  require(["@/pages/promotion/PointGoodsDetail"], resolve);
const ShoppingCart = (resolve) => require(["@/pages/ShoppingCart"], resolve);
const Cart = (resolve) => require(["@/pages/Cart"], resolve);
const Pay = (resolve) => require(["@/pages/payment/Pay"], resolve);
const PayDone = (resolve) => require(["@/pages/payment/PayDone"], resolve);
const PayMent = (resolve) => require(["@/pages/payment/PayMent"], resolve);
const ThirdPay = (resolve) => require(["@/pages/payment/ThirdPay"], resolve);
const Coupon = (resolve) => require(["@/pages/CouponCenter"], resolve);
const seckill = (resolve) => require(["@/pages/promotion/seckill"], resolve);
const article = (resolve) => require(["@/pages/article/index"], resolve);
const articleDetail = (resolve) => require(["@/pages/article/detail"], resolve);
const PointMall = (resolve) =>
  require(["@/pages/promotion/PointMall"], resolve);

/*
 * 会员中心
 * 订单列表
 */
const MyOrder = (resolve) =>
  require([`@/pages/home/orderCenter/MyOrder`], resolve);
const OrderDetail = (resolve) =>
  require([`@/pages/home/orderCenter/OrderDetail`], resolve);
const MyAddress = (resolve) =>
  require(["@/pages/home/orderCenter/MyAddress"], resolve);
const AddAddress = (resolve) =>
  require(["@/pages/home/orderCenter/AddAddress"], resolve);
const Complain = (resolve) =>
  require(["@/pages/home/orderCenter/Complain"], resolve);
const AfterSale = (resolve) =>
  require(["@/pages/home/orderCenter/AfterSale"], resolve);
const AfterSaleDetail = (resolve) =>
  require(["@/pages/home/orderCenter/AfterSaleDetail"], resolve);
const ApplyAfterSale = (resolve) =>
  require(["@/pages/home/orderCenter/ApplyAfterSale"], resolve);

/*
 * 会员中心
 */
const Profile = (resolve) =>
  require(["@/pages/home/memberCenter/Profile"], resolve);
const AccountSafe = (resolve) =>
  require(["@/pages/home/memberCenter/AccountSafe"], resolve);
const ModifyPwd = (resolve) =>
  require(["@/pages/home/memberCenter/ModifyPwd"], resolve);
const Favorites = (resolve) =>
  require(["@/pages/home/memberCenter/Favorites"], resolve);
const Distribution = (resolve) =>
  require(["@/pages/home/memberCenter/Distribution"], resolve);
const CommentList = (resolve) =>
  require(["@/pages/home/memberCenter/CommentList"], resolve); // Evaluate列表
const AddEval = (resolve) =>
  require(["@/pages/home/memberCenter/evaluation/AddEval"], resolve); // 添加Evaluate
const EvalDetail = (resolve) =>
  require(["@/pages/home/memberCenter/evaluation/EvalDetail"], resolve);
const ComplainList = (resolve) =>
  require(["@/pages/home/memberCenter/ComplainList"], resolve);
const ComplainDetail = (resolve) =>
  require(["@/pages/home/memberCenter/ComplainDetail"], resolve);
const Point = (resolve) =>
  require(["@/pages/home/memberCenter/Point"], resolve);
const MsgList = (resolve) =>
  require(["@/pages/home/memberCenter/memberMsg/MsgList"], resolve);
const MsgDetail = (resolve) =>
  require(["@/pages/home/memberCenter/memberMsg/MsgDetail"], resolve);

/*
 * 会员中心
 * 账户中心
 * */
const Coupons = (resolve) =>
  require(["@/pages/home/userCenter/Coupons"], resolve);
const MyTracks = (resolve) =>
  require(["@/pages/home/userCenter/MyTracks"], resolve);
const MoneyManagement = (resolve) =>
  require(["@/pages/home/userCenter/MoneyManagement"], resolve);

const Home = (resolve) => require(["@/pages/user/Home"], resolve);

const Merchant = (resolve) => require(["@/pages/Merchant"], resolve);
const UserMain = (resolve) => require(["@/pages/home/Main"], resolve);

/**
 * 店铺入驻
 */
const ShopEntry = (resolve) =>
  require(["@/pages/shopEntry/ShopEntry"], resolve);

Vue.use(Router);

/**
 * 解决重复点击菜单会控制台报错bug
 */
 const routerPush = Router.prototype.push
 Router.prototype.push = function push(location) {
   return routerPush.call(this, location).catch(error=> error)
 }

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/", // Home
      name: "Index",
      component: Index,
    },
    {
      path: "/login", // 登陆
      name: "login",
      component: Login,
      meta: {
        title: "Login",
      },
    },
    {
      path: "/SignUp", // 注册
      name: "SignUp",
      component: SignUp,
      meta: {
        title: "Register",
      },
    },
    {
      path: "/forgetPassword", // Forget Password
      name: "forgetPassword",
      component: ForgetPassword,
      meta: {
        title: "Forgot password",
      },
    },
    {
      path: "/goodsList", // Goods列表
      name: "GoodsList",
      component: GoodsList,
    },
    {
      path: "/goodsDetail", // Goods Detail
      name: "GoodsDetail",
      component: GoodsDetail,
      meta: { title: "Goods detail" },
    },
    {
      path: "/pointGoodsDetail", // Goods Detail
      name: "PointGoodsDetail",
      component: PointGoodsDetail,
      meta: { title: "Goods points" },
    },
    {
      path: "/shoppingCart", // 头部购物车
      name: "ShoppingCart",
      component: ShoppingCart,
    },
    {
      path: "/cart", // 购物车
      name: "Cart",
      component: Cart,
      meta: { title: "Cart" },
    },
    {
      path: "/pay", // 支付Page面
      name: "Pay",
      component: Pay,
      meta: { title: "Payment detail" },
    },
    {
      path: "/payMent",
      name: "PayMent",
      component: PayMent,
    },
    {
      path: "/PointMall",
      name: "PointMall",
      component: PointMall,
      meta: { title: "Points mall" },
    },
    {
      path: "/qrpay", // 三方支付
      name: "qrpay",
      component: ThirdPay,
    },
    {
      path: "/payDone", // payment successPage面
      name: "PayDone",
      component: PayDone,
    },
    {
      path: "/article", // 文章Page面
      name: "article",
      component: article,
      meta: {
        title: "Help center",
      },
    },
    {
      path: "/article/detail", // 文章Page面
      name: "articleDetail",
      component: articleDetail,
      meta: {
        title: "Help center",
      },
    },
    {
      path: "/shopEntry",
      name: "shopEntry",
      component: ShopEntry,
      meta: {
        title: "Store occupancy",
      },
    },
    {
      path: "/coupon",
      name: "coupon",
      component: Coupon,
      meta: {
        title: "Coupon centre",
      },
    },
    {
      path: "/seckill",
      name: "seckill",
      component: seckill,
      meta: {
        title: "seckill",
      },
    },
    {
      path: "/home", // 主Page
      component: Home,
      children: [
        {
          path: "/",
          name: "Home",
          component: UserMain,
          meta: {
            title: "Member",
          },
        },
        {
          path: "MyTracks",
          name: "MyTracks",
          component: MyTracks,
          meta: { title: "My tract" },
        },
        {
          path: "MoneyManagement",
          name: "MoneyManagement",
          component: MoneyManagement,
        },
        {
          path: "Complain",
          name: "Complain",
          component: Complain,
        },
        {
          path: "Coupons",
          name: "Coupons",
          component: Coupons,
        },
        {
          path: "CommentList",
          name: "CommentList",
          component: CommentList,
          mate: { title: "Evaluate list" },
        },
        {
          path: "AddEval",
          name: "AddEval",
          component: AddEval,
          mate: { title: "Add Evaluate" },
        },
        {
          path: "EvalDetail",
          name: "EvalDetail",
          component: EvalDetail,
          mate: { title: "Evaluate detail" },
        },
        {
          path: "ComplainList",
          name: "ComplainList",
          component: ComplainList,
        },
        {
          path: "ComplainDetail",
          name: "ComplainDetail",
          component: ComplainDetail,
        },
        {
          path: "AccountSafe",
          name: "AccountSafe",
          component: AccountSafe,
        },
        {
          path: "ModifyPwd",
          name: "ModifyPwd",
          component: ModifyPwd,
        },
        {
          path: "Favorites",
          name: "Favorites",
          component: Favorites,
          meta: { title: "My collection" },
        },
        {
          path: "Distribution",
          name: "Distribution",
          component: Distribution,
          meta: { title: "Distribution" },
        },
        {
          path: "Point",
          name: "Point",
          component: Point,
          meta: { title: "My points" },
        },
        {
          path: "Profile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "AfterSale",
          name: "AfterSale",
          component: AfterSale,
          meta: { title: "after sale" },
        },
        {
          path: "ApplyAfterSale",
          name: "ApplyAfterSale",
          component: ApplyAfterSale,
          meta: { title: "Apply  after sale" },
        },
        {
          path: "/home/MyAddress",
          name: "MyAddress",
          component: MyAddress,
          meta: { title: "Delivery address" },
        },
        {
          path: "AddAddress",
          name: "AddAddress",
          component: AddAddress,
        },
        {
          path: "MsgList",
          name: "MsgList",
          component: MsgList,
          meta: { title: "My message" },
        },
        {
          path: "MsgDetail",
          name: "MsgDetail",
          component: MsgDetail,
          meta: { title: "My message" },
        },
        {
          path: "MyOrder",
          name: "MyOrder",
          component: MyOrder,
          meta: { title: "My order" },
        },
        {
          path: "OrderDetail",
          name: "OrderDetail",
          component: OrderDetail,
          meta: { title: "Order details" },
        },
        {
          path: "AfterSaleDetail",
          name: "AfterSaleDetail",
          component: AfterSaleDetail,
          meta: { title: "After-sale details" },
        },
      ],
    },
    {
      path: "/merchant",
      name: "Merchant",
      component: Merchant,
      meta: { title: "Store" },
    },
  ],
});
