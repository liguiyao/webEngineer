<template>
  <div class="wrapper">
    <card _Title="Account security"/>
    <!--  Phone number验证  -->
    <Form ref="formData" :model="formData" label-position="left" :label-width="100" :rules="ruleInLines"
          v-if="(status == 2 || status == 3) && !showPwd">
      <FormItem label="Phone number">
        <div class="phone">1234567890</div>
      </FormItem>
      <FormItem label="verification code" prop="picture" style="width: 350px">
        <i-input v-model="formData.picture" size="large" maxlength="4"></i-input>
      </FormItem>
      <FormItem label="verification code" prop="msg">
        <i-input v-model="formData.msg" size="large" maxlength="6" style="width: 250px">
          <span slot="append">Input verification</span>
        </i-input>
      </FormItem>
    </Form>
    <div slot="footer" v-if="(status == 2 || status == 3) && !showPwd" style="text-align: center;width: 50%">
      <Button type="primary" class="ml_10" @click="submitRegister">Next</Button>
    </div>

    <!--  modify  -->
    <Form ref="formRegister" :model="formRegister" :rules="ruleInline" :label-width="80" v-if="status == 1 && !showPwd">
      <FormItem label="Old password" prop="password">
        <i-input type="password" v-model="formRegister.password" clearable size="large" placeholder="Please enter  old password"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem label="New password" prop="newPassword">
        <i-input type="password" v-model="formRegister.newPassword" clearable size="large" placeholder="Enter new password"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem label="Confirm password" prop="againPassword">
        <i-input type="password" v-model="formRegister.againPassword" clearable size="large" placeholder="Confirm new password"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>

    </Form>
    <div slot="footer" v-if="status == 1 && !showPwd" style="width: 50%;text-align: center">
      <Button type="primary" class="ml_10" @click="handleRegist">modify</Button>
    </div>
    <!-- 设置&modify的第二种情况   -->
    <Form ref="formDataUpdate" :model="formDataUpdate" label-position="left" :label-width="100" :rules="ruleIn"
          v-if="showPwd">
      <FormItem label="New password" prop="newPassword">
        <i-input type="password" v-model="formDataUpdate.newPassword" clearable size="large" placeholder="Please enter  new password"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem label="Confirm new password" prop="againPassword">
        <i-input type="password" v-model="formDataUpdate.againPassword" clearable size="large" placeholder="Confirm new password"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
    </Form>
    <div slot="footer" v-if="showPwd" style="text-align: center;width: 50%">
      <Button type="primary" class="ml_10" @click="setPassword">Set</Button>
    </div>
  </div>
</template>

<script>
import {
  setPwd,
  editPwd
} from '@/api/account';
import {md5} from '@/plugins/md5.js'

export default {
  name: 'modifyPwd',
  data () {
    return {
      // 1为modify    2为设置     3为Submit校验的Next
      status: '',
      showPwd: false, // 显示密码
      formData: { // 验证表单
        picture: '',
        msg: ''
      },
      formDataUpdate: { // 直接输入新密码表单
        newPassword: '',
        againPassword: ''
      },
      formRegister: { // 第三步 新密码表单
        password: '',
        againPassword: '',
        newPassword: ''
      },
      ruleInLines: { // 验证规则
        picture: [
          {required: true, message: 'verification code', trigger: 'blur'}
        ],
        msg: [
          {required: true, message: 'verification code', trigger: 'blur'}
        ]
      },
      ruleIn: { // 验证规则
        newPassword: [
          {required: true, message: 'Please enter  new password', trigger: 'blur'},
          {type: 'string', min: 6, message: 'cannot less than 6 characters'}
        ],
        againPassword: [
          {required: true, message: 'Please enter  new password', trigger: 'blur'},
          {type: 'string', min: 6, message: 'cannot less than 6 characters'}
        ]
      },
      ruleInline: { // 验证规则
        password: [
          {required: true, message: 'Please enter  old password', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: 'Please enter  new password', trigger: 'blur'},
          {type: 'string', min: 6, message: 'cannot less than 6 characters'}
        ],
        againPassword: [
          {required: true, message: 'Please confirm new password', trigger: 'blur'},
          {type: 'string', min: 6, message: 'cannot less than 6 characters'}
        ]
      }
    }
  },
  mounted () {
    this.status = this.$route.query.status
  },
  methods: {
    // modify
    handleRegist () {
      this.$refs['formRegister'].validate((valid) => {
        if (valid) {
          const {newPassword, againPassword, password} = this.formRegister
          if (newPassword !== againPassword) {
            this.$Message.error({
              content: 'old and new passwords different'
            });
            return
          }
          const params = {newPassword, password}
          params.newPassword = md5(newPassword)
          params.password = md5(password)
          editPwd(params).then(res => {
            if (res.message === 'success' && res.result) {
              this.$Message.success('Password changed successfully');
              this.$router.push('/home')
            }
          });
        }
      })
    },
    // Submit验证
    submitRegister () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.showPwd = true
        }
      })
    },
    // 设置密码
    setPassword () {
      this.$refs['formDataUpdate'].validate((valid) => {
        if (valid) {
          const {newPassword, againPassword} = this.formDataUpdate
          if (newPassword === '') {
            this.$Message.error({
              content: 'Please enter  password'
            });
            return
          }
          if (newPassword !== againPassword) {
            this.$Message.error({
              content: 'old and new passwords different'
            });
            return
          }
          const params = {password: newPassword}
          params.password = md5(newPassword)
          setPwd(params).then(res => {
            if (res.message === 'success' && res.result) {
              this.$Message.success('set successfully');
              this.$router.push('/home')
            }
          });
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    text-align: center;
  }
  .phone {
    text-align: left;
  }
</style>
