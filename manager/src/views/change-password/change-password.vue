<template>
  <div>
    <Card class="change-pass">
      <p slot="title">modify password</p>
      <div class="mt_10">
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate" style="width:450px">
          <FormItem label="Old password" prop="oldPass">
            <Input type="password" v-model="editPasswordForm.oldPassword" placeholder="Please enter old password"></Input>
          </FormItem>
          <FormItem label="New password" prop="newPass">
            <SetPassword  v-model="editPasswordForm.newPassword" @on-change="changeInputPass" />
          </FormItem>
          <FormItem label="Confirm password" prop="rePass">
            <Input type="password" v-model="editPasswordForm.rePassword" placeholder="Please reenter password"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" class="mr_10" :loading="savePassLoading" @click="saveEditPass">Save
            </Button>
            <Button @click="cancelEditPass">Cancel</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import SetPassword from "@/components/lili/set-password";
import { changePass } from "@/api/index";

export default {
  name: "change-password",
  components: {
    SetPassword
  },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPassword) {
        callback(new Error("password different"));
      } else {
        callback();
      }
    };
    return {
      savePassLoading: false, // Save加载状态
      editPasswordForm: { // 编辑密码表单
        oldPassword: "",
        newPassword: "",
        rePassword: "",
      },
      strength: "", // 密码强度
      passwordValidate: { // 验证规则
        oldPassword: [
          {
            required: true,
            message: "Please enter old password",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "Please enter new password",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Please enter at least 6 character",
            trigger: "blur",
          },
          {
            max: 32,
            message: "Max 32 character",
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            required: true,
            message: "Please reenter password",
            trigger: "blur",
          },
          {
            validator: valideRePassword,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 密码强度
    changeInputPass(v, grade, strength) {
      this.strength = strength;
    },
    // 确认modify密码
    saveEditPass() {
      let params = {
        password: this.md5(this.editPasswordForm.oldPassword),
        newPassword: this.md5(this.editPasswordForm.newPassword),
        passStrength: this.md5(this.strength),
      };
      this.$refs["editPasswordForm"].validate((valid) => {
        if (valid) {
          this.savePassLoading = true;
          changePass(params).then((res) => {
            this.savePassLoading = false;
            if (res.success) {
              this.$Modal.success({
                title: "modify password success",
                content: "modify password success，need Login again",
                onOk: () => {
                  this.$store.commit("logout", this);
                  this.$router.push({
                    name: "login",
                  });
                },
              });
            }
          });
        }
      });
    },
    // Cancelmodify密码
    cancelEditPass() {
      this.$store.commit("removeTag", "change_password");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      let lastPageName = "";
      let length = this.$store.state.app.pageOpenedList.length;
      if (length > 1) {
        lastPageName = this.$store.state.app.pageOpenedList[length - 1].name;
      } else {
        lastPageName = this.$store.state.app.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName,
      });
    },
  }
};
</script>
