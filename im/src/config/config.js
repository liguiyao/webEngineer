
/**
 * 读取公total配置API路径。
 * 工程会读取根目录下的 env 。
 * 根目录下的.env文件是用来定义环境变量的。
 * 它可以包含各种键值对，每个键代表一个环境变量。
 * 这些环境变量可以在应用程序的整个生命周期内使用，例如在代码中访问、配置webpack或在构建部署过程中使用不同的值。
 * env中的 ODE_ENV指定当前的环境。
 * 可以分别创建.env.development、.env.production等文件。
 * default.env 文件中的变量作为开发环境的环境变量。
 * env文件modify的话需要重新编译项目。
 */
export default {
   // 网站名称
  WEBSITE_NAME: process.env.VUE_APP_WEBSITE_NAME || "LiLi IM",
  // defaultPlease 求IM的API
  BASE_API_URL: process.env.VUE_APP_API_BASE_URL || "", 
  // defaultPlease 求的WS
  BASE_WS_URL: process.env.VUE_APP_WEB_SOCKET_URL || "", 
  // defaultPlease 求公有接口相关 API
  BASE_COMMON: process.env.VUE_APP_COMMON || "", 
  // defaultPlease 求用户相关API
  BASE_BUYER: process.env.VUE_APP_BUYER || "", 
  // defaultPlease 求卖家相关的API
  BASE_SELLER: process.env.VUE_APP_SELLER || "",
  // 点击Goods跳转到的address
  PC_URL: process.env.VUE_APP_PC_URL || "https://pc-b2b2c.pickmall.cn",
  // 订单跳转商家订单Page面
  PC_STORE: process.env.VUE_APP_PC_STORE || 'https://store-b2b2c.pickmall.cn',
};