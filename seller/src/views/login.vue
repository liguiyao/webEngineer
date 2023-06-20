<template>
  <div class="login" @click="$refs.verify.show = false">
    <Row type="flex" @keydown.enter.native="submitLogin">
      <Col style="width: 368px">
      <Header />
      <Row style="flex-direction: column">
        <Tabs v-model="loginType">
          <Tab-pane label="Account login" name="passwordLogin">
            <!--Account login-->
            <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
              <FormItem prop="username">
                <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="Please enter username"
                  autocomplete="off" />
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="form.password" prefix="ios-lock" size="large" password placeholder="Please enter password"
                  autocomplete="off" />
              </FormItem>
            </Form>
            <div class="register">
              <a @click="$router.push('forgetPassword')">Forget Password</a>
            </div>
          </Tab-pane>
          <Tab-pane label="SMS login" name="mobileLogin">
            <!-- SMS login -->
            <Form ref="formSms" :model="formSms" :rules="ruleInline" @click.self='$refs.verify.show = false'>
              <FormItem prop="mobile">
                <i-input type="text" v-model="formSms.mobile" clearable placeholder="Phone number">
                  <Icon type="md-lock" slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem prop="code">
                <i-input type="text" v-model="formSms.code" placeholder="phone verification code">
                  <Icon type="ios-text-outline" style="font-weight: bold" slot="prepend" />
                  <Button slot="append" @click="sendCode">{{ codeMsg }}</Button>
                </i-input>
              </FormItem>
              <FormItem>
                <Button @click.stop="verifyBtnClick" long :type="verifyStatus ? 'success' : 'default'">{{ verifyStatus ?
                  'Verify Pass' :
                  'Click to verify' }}
                </Button>
              </FormItem>
            </Form>
          </Tab-pane>
        </Tabs>
        <Row>
          <div class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
            <span v-if="!loading">Login</span>
            <span v-else>Logging in</span>
          </div>
        </Row>
      </Row>
      <Footer />
      <!-- 拼图验证码 -->
      <verify ref="verify" class="verify-con" verifyType="LOGIN" @change="verifyChange"></verify>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getCurrentPermissionList } from "@/api/index";
import { login, userMsg, storeSmsLogin } from "@/api/index";
import { sendSms } from "@/api/common.js";
import Cookies from "js-cookie";
import Header from "@/views/main-components/header";
import Footer from "@/views/main-components/footer";
import util from "@/libs/util.js";
import verify from "@/views/my-components/verify";
export default {
  components: {
    Header,
    Footer,
    verify,
  },
  data() {
    return {
      saveLogin: true, // SaveLoginstate
      loading: false, // 加载state
      verifyStatus: false, // 是否图片验证pass
      time: 60, // 倒计时
      loginType: 'passwordLogin', //登陆类型
      form: {
        // 表单数据
        username: "",
        password: "",
        mobile: "",
        code: "",
      },
      formSms: {
        mobile: '',
        code: '',
      },
      rules: {
        // 验证规则
        username: [
          {
            required: true,
            message: "Username cannot empty",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "password cannot be empty",
            trigger: "blur",
          },
        ],
      },
      ruleInline: {
        // 验证规则
        username: [{ required: true, message: "Please enter username" }],
        password: [
          { required: true, message: "Please enter password" },
          { type: "string", min: 6, message: "password cannot be less than 6 characters" },
        ],
        mobile: [
          { required: true, message: "Please enter Phone number" },
          {
            pattern: RegExp.mobile,
            message: "Please enter correctly phone number",
          },
        ],
        code: [{ required: true, message: "Please enter phone verification code" }],
      },
      codeMsg: "Send verification code", // 验证码文字
    };
  },
  created() {
    window.localStorage.setItem("menuData", "");
  },

  methods: {
    afterLogin(res) {
      let accessToken = res.result.accessToken;
      this.setStore("accessToken", accessToken);
      this.setStore("refreshToken", res.result.refreshToken);

      // 获取用户信息
      userMsg().then((res) => {
        if (res.success) {
          // location.reload();
          // this.$router.go(0);

          console.log("Huoqu ");
          this.setStore("saveLogin", this.saveLogin);
          if (this.saveLogin) {
            // Save7天
            Cookies.set("userInfoSeller", JSON.stringify(res.result), {
              expires: 7,
            });
          } else {
            Cookies.set("userInfoSeller", JSON.stringify(res.result));
          }

          util.initRouter(this);
          this.$store.commit("setAvatarPath", res.result.storeLogo);
          // 加载菜单
          this.$router.push({
            name: "home_index",
          });
        } else {
          this.loading = false;
        }
      });
    },
    // 发送phone verification code
    sendCode() {
      if (this.time === 60) {
        if (this.formSms.mobile === "") {
          this.$Message.warning("Please enter Phone number first");
          return;
        }
        if (!this.verifyStatus) {
          this.$Message.warning("Please verify first");
          return;
        }
        let params = {
          mobile: this.formSms.mobile,
          verificationEnums: "LOGIN",
        };
        sendSms(params).then((res) => {
          if (res.success) {
            this.$Message.success("SMS send success");
            let that = this;
            this.interval = setInterval(() => {
              that.time--;
              if (that.time === 0) {
                that.time = 60;
                that.codeMsg = "resend";
                that.verifyStatus = false;
                clearInterval(that.interval);
              } else {
                that.codeMsg = that.time;
              }
            }, 1000);
          } else {
            this.$Message.warning(res.message);
          }
        });
      }
    },
    submitLogin() {
      // LoginSubmit
      if (this.loginType == 'passwordLogin') {
        this.$refs.usernameLoginForm.validate((valid) => {
          if (valid) {
            this.$refs.verify.init();
          }
        });
      } else if (this.loginType == 'mobileLogin') {
        this.$refs['formSms'].validate((valid) => {
          if (valid) {
            storeSmsLogin(this.formSms).then(res => {
              if (res.success) {
                this.afterLogin(res)
              }
            })
          }
        })
      }
    },
    verifyChange(con) {
      // 拼图验证码回显
      if (!con.status) return;

      if (this.loginType == 'passwordLogin') {
        this.loading = true;
        let fd = new FormData();
        fd.append("username", this.form.username);
        fd.append("password", this.md5(this.form.password));
        login(fd)
          .then((res) => {
            this.loading = false;
            if (res && res.success) {
              this.afterLogin(res);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
      this.verifyStatus = true;
      this.$refs.verify.show = false;
    },

    // Opening滑块验证
    verifyBtnClick() {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  background: url("../assets/background.png") no-repeat;
  background-size: 100%;
  background-position-y: bottom;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .verify-con {
    position: absolute;
    top: 126px;
    z-index: 10;
    left: 20px;
  }

  .form {
    padding-top: 1vh;
  }

  .login-btn {
    background: linear-gradient(135deg, $theme_color 0%, $warning_color 100%);
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    width: 100%;
    text-align: center;
    transition: 0.35s;
  }

  .login-btn:hover {
    opacity: 0.9;
    border-radius: 10px;
  }

}
</style>
