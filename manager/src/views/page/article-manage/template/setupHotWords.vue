<template>
  <div class="layout">
    <Form
      ref="formValidate"
      :label-width="150"
      label-position="right"
      :model="formValidate"
      :rules="ruleValidate"
    >
      <FormItem label="hot word default set" prop="hotWordsSettingItems">
        <div
          class="item-label"
          v-for="(item, index) in formValidate.hotWordsSettingItems"
          :key="index"
        >
          <div>
            <div class="item-keyword">
              <div>Hot word：</div>
              <Input type="text" v-model="item.keywords"> </Input>
            </div>
            <div class="item-score">
              <div>Score：</div>
              <InputNumber :max="5" :min="0" v-model="item.score"></InputNumber>
            </div>
          </div>
          <div>
            <Button type="primary" @click="formValidate.hotWordsSettingItems.splice(index,1)">delete</Button>
          </div>
        </div>
        <Button @click="addSetItem">Setting</Button>
      </FormItem>
      <FormItem label="每日持久化热词Quantity" prop="saveNum">
        <InputNumber :min="0" v-model="formValidate.saveNum" />
      </FormItem>

      <div class="label-btns">
        <Button type="primary" @click="submit('formValidate')">Save</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import { setSetting, getSetting } from "@/api/index";

export default {
  data() {
    return {
      ruleValidate: {}, // 验证规则
      formValidate: {
        // 表单数据
        saveNum: 1, // 每日SaveQuantity
        hotWordsSettingItems: [
          {
            keywords: "",
            score: 1,
          },
        ], // 热词default配置
      },
    };
  },

  created() {
    this.init();
  },
  methods: {
    // 添加热词default配置
    addSetItem(val) {
      if (this.formValidate.hotWordsSettingItems.length >= 5) {
        this.$Message.error("最多5个热词项");
      } else {
        this.formValidate.hotWordsSettingItems.push({
          keywords: "",
          score: 1,
        });
      }
    },

    submit(name) {
      this.$refs["formValidate"].validate(async (valid) => {
        if (valid) {
          this.setupSetting();
        } else {
          that.$Message.error("Please 正确enter 内容!");
          return flag;
        }
      });
    },
    // Save设置
    setupSetting() {
      setSetting("HOT_WORDS", this.formValidate).then((res) => {
        if (res.success) {
          this.$Message.success("Savesuccess!");
        } else {
          this.$Message.error("Save失败!");
        }
        this.init();
      });
    },
    // 实例化数据
    async init() {
      const res = await getSetting("HOT_WORDS");
      if (res.success) {
        this.formValidate = res.result;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-label {
  border-bottom: 1px solid #ededed;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width:500px;
  justify-content:space-between;
}
/deep/ .ivu-input {
  width: 100px !important;
}
.ivu-input-wrapper {
  width: 300px;
  margin-right: 10px;
}
.item-keyword,
.item-score {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  > div {
    margin-right: 20px;
  }
}
</style>
