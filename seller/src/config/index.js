module.exports = {
  title: "jusdemo", //配置显示在浏览器标签的title
  /**
   * 高德地图Apply  链接
   * https://lbs.amap.com/api/javascript-api/guide/abc/prepare
   * 添加success后，可获取到key值和安全密钥jscode（自2021年12月02日升级，升级之后所Apply  的 key 必须配备安全密钥 jscode 一起使用)
   */
  //FIXME Please 检查当前高德key创建的日期，如果2021年12月02日之前Apply  的 无需enter 安全密钥
  aMapSecurityJsCode: "2bd0fbf621881f4c77be74f0e76495f3", // 高德web端jsApply  的安全密钥
  aMapKey: "7f11113750315d8543daaf5c3ba353ca", //高德web端jsApply  的api key
  website: "https://www.pickmall.cn", //官网address
  enableCDN: true, //生产环境 是否启用cdn加载 vue等js
  port: 10002, //端口
  inputMaxLength:'140' //全局输入框default最大输入长度字
};
