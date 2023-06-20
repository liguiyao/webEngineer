<template>
  <div class="wrapper">
    <card _Title="Account security"/>
    <div class="safeList">
      <!-- 密码 -->
      <Row class="safeItem">
        <Col :span="2">
          <Icon size="40" type="md-key"/>
        </Col>
        <Col :span="16">
          <div class="setDivItem">Password</div>
          <div class="setDivItem theme">You are advised to periodically change your password to protect your Internet account security。</div>
        </Col>
        <Col :span="4">
          <Button @click="modifyPwd">Change password</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { getPwdStatus } from '@/api/account';
export default {
  name: 'AccountSafe',
  data () {
    return {
      pwdStatus: '' // 密码state
    }
  },
  mounted () {
    this.getPwdStatus()
  },
  methods: {
    // 设置支付密码
    goModifyPwd () {
      this.$router.push({name: 'ModifyPwd', query: { status: 2 }})
    },
    modifyPwd () { // modify密码
      this.$router.push({name: 'ModifyPwd', query: { status: 1 }})
    },
    // 获取密码state
    getPwdStatus () {
      getPwdStatus().then(res => {
        if (res) {
          this.pwdStatus = 'Change password'
        } else {
          this.pwdStatus = 'Set a password'
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .ivu-col-span-2, .ivu-col-span-4 {
    text-align: center;
    color: $theme_color;
  }

  .theme {
    color: $theme_color;
  }

  .setDivItem {
    line-height: 1.75;
  }

  .safeItem {
    border-bottom: 1px solid $border_color;
    padding: 16px 0;

    /deep/ .ivu-col {
      padding: 8px 0;

    }
  }
</style>
