<template>
  <div class="set-password">
    <Poptip transfer trigger="focus" placement="right" width="250">
      <Input
        type="password"
        password
        style="width:350px;"
        :maxlength="maxlength"
        v-model="currentValue"
        @on-change="handleChange"
        :size="size"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
      />
      <div :class="tipStyle" slot="content">
        <div class="words">strength : {{strength}}</div>
        <Progress
          :percent="strengthValue"
          :status="progressStatus"
          hide-info
          style="margin: 13px 0;"
        />
        <br />Please at least 6 character.
        <br />
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  name: "setPassword",
  props: {
    value: String,
    size: String,
    placeholder: {
      type: String,
      default: "Please enter password，length 6-20 characters"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      currentValue: this.value, // 当前值
      tipStyle: "password-tip-none", // 强度样式
      strengthValue: 0, // 强度等级
      progressStatus: "normal", // 进度itemsstate
      strength: "无", // 密码强度描述
      grade: 0 // 强度等级
    };
  },
  methods: {
    checkStrengthValue(v) {
      // 评级制判断密码强度 最高5
      let grade = 0;
      if (/\d/.test(v)) {
        grade++; //数字
      }
      if (/[a-z]/.test(v)) {
        grade++; //小写
      }
      if (/[A-Z]/.test(v)) {
        grade++; //大写
      }
      if (/\W/.test(v)) {
        grade++; //特殊字符
      }
      if (v.length >= 10) {
        grade++;
      }
      this.grade = grade;
      return grade;
    },
    strengthChange() {
      if (!this.currentValue) {
        this.tipStyle = "password-tip-none";
        this.strength = "None";
        this.strengthValue = 0;
        return;
      }
      let grade = this.checkStrengthValue(this.currentValue);
      if (grade <= 1) {
        this.progressStatus = "wrong";
        this.tipStyle = "password-tip-weak";
        this.strength = "weak";
        this.strengthValue = 33;
      } else if (grade >= 2 && grade <= 4) {
        this.progressStatus = "normal";
        this.tipStyle = "password-tip-middle";
        this.strength = "middle";
        this.strengthValue = 66;
      } else {
        this.progressStatus = "success";
        this.tipStyle = "password-tip-strong";
        this.strength = "strong";
        this.strengthValue = 100;
      }
    },
    // 密码变动后回调
    handleChange(v) {
      this.strengthChange();
      this.$emit("input", this.currentValue);
      this.$emit("on-change", this.currentValue, this.grade, this.strength);
    },
    // 监听密码变动，实时回显密码强度
    setCurrentValue(value) {
      if (value === this.currentValue) {
        return;
      }
      this.currentValue = value;
      this.strengthChange();
      this.$emit("on-change", this.currentValue, this.grade, this.strength);
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.set-password .ivu-poptip,
.set-password .ivu-poptip-rel {
  display: block;
}
.password-tip-none {
  padding: 1vh 0;
}

.password-tip-weak {
  padding: 1vh 0;

  .words {
    color: #ed3f14;
  }
}

.password-tip-middle {
  padding: 1vh 0;

  .words {
    color: #2d8cf0;
  }
}

.password-tip-strong {
  padding: 1vh 0;

  .words {
    color: #52c41a;
  }
}
</style>

