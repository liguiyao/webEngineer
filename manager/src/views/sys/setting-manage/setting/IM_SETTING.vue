<template>
  <div class="layout">
    <Form ref="formValidate" :label-width="150" label-position="right" :model="formValidate" :rules="ruleValidate">
      <FormItem label="云IMaddress" prop="httpUrl">
        <Input v-model="formValidate.httpUrl"/>
        <span class="desc">配置买家端联系客服以及商家端Login客服跳转的路径</span>
      </FormItem>

      <div class="label-btns">
        <Button type="primary" @click="submit('formValidate')">Save</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import {setSetting} from "@/api/index";
import {handleSubmit} from "./validate";

export default {
  data() {
    return {
      ruleValidate: {}, // 验证规则
      formValidate: { // 表单数据
        httpUrl: ""
      },
      result:"",
    };
  },
  props: ["res", "type"],
  created() {
    this.init();
  },
  methods: {
    // Save
    submit(name) {
      let that = this;
      if (handleSubmit(that, name)) {
        this.setupSetting()
      }
    },
    // Save设置
    setupSetting() {
      setSetting(this.type, this.formValidate).then((res) => {
        if (res.success) {
          this.$Message.success("Savesuccess!");
        } else {
          this.$Message.error("Save失败!");
        }
      });
    },
    // 实例化数据
    init() {
      this.result = JSON.parse(this.res);

      this.$set(this, "formValidate", {...this.result});
      Object.keys(this.formValidate).forEach((item) => {
        this.ruleValidate[item] = [
          {
            required: true,
            message: "Please enter 必填项",
            trigger: "blur",
          },
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";

.label-item {
  display: flex;
}

/deep/ .ivu-input {
  width: 300px !important;
  margin: 0 10px;
}

.ivu-input-wrapper {
  width: 300px;
  margin-right: 10px;
}
</style>
