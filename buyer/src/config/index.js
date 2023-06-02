
const Cookie = require('js-cookie')
module.exports = {
  title:Cookie.get('siteName') || 'easyshop', //配置显示在浏览器标签的title、底部信息、部分信息展示的值
  icpCard: "", // icp证
  company: {
    href: "https://www.google.com",
    name: "this is test website",
  }, //公司信息
  icpMessage: "S244200223696-1", //icp备案
  /**
   * 高德地图Apply  链接
   * https://lbs.amap.com/api/javascript-api/guide/abc/prepare
   * 添加success后，可获取到key值和安全密钥jscode（自2021年12月02日升级，升级之后所Apply  的 key 必须配备安全密钥 jscode 一起使用)
   */
  //FIXME Please 检查当前高德key创建的日期，如果2021年12月02日之前Apply  的 无需enter 安全密钥
  aMapSecurityJsCode:"2bd0fbf621881f4c77be74f0e76495f3", // 高德web端jsApply  的安全密钥
  aMapKey: "7f11113750315d8543daaf5c3ba353ca", //高德web端jsApply  的api key
  enableCDN: true, //生产环境 是否启用cdn加载 vue等js
  port: 10000, //端口
  inputMaxLength:'140' //全局输入框default最大输入长度字
};
