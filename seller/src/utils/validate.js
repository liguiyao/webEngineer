import * as regExp from "./regular";

//表单中必须输入汉字
export function validateNeedName(rule, value, callback) {
  const name = regExp.name;
  if (name.test(value)) {
    callback();
  } else {
    return callback(new Error("Please enter 汉字"));
  }
}

//表单中输入Phone number验证
export function validateMobile(rule, value, callback) {
  const mobile = regExp.mobile;
  if (mobile.test(value)) {
    callback();
  } else {
    return callback(new Error("Phone number输入错误！"));
  }
}
