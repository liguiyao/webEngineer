<template>
  <div class="photo-msg">
    <Form ref="secondForm" :model="form" :rules="rules" :label-width="140">
      <h4>Basic information</h4>
      <FormItem prop="settlementBankAccountName" label="Bank account name">
        <Input
          type="text"
          v-model="form.settlementBankAccountName"
          placeholder="Please enter Bank account name"
        />
      </FormItem>
      <FormItem prop="settlementBankAccountNum" label="Bank account">
        <Input
          type="text"
          v-model="form.settlementBankAccountNum"
          placeholder="Please enter Bank account"
        />
      </FormItem>
      <FormItem prop="settlementBankBranchName" label="Bank branch name">
        <Input
          type="text"
          v-model="form.settlementBankBranchName"
          placeholder="Please enter Bank branch name"
        />
      </FormItem>
      <FormItem prop="settlementBankJointName" label="Branch bank number">
        <Input
          type="text"
          v-model="form.settlementBankJointName"
          placeholder="Please enter Branch bank number"
        />
      </FormItem>

      <FormItem>
        <Button @click="$emit('change', 0)">Back</Button>
        <Button type="primary" :loading="loading" @click="next"
          >enter other information</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { applySecond } from '@/api/shopentry';
export default {
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      loading: false, // 加载state
      form: {}, // 表单数据
      rules: { // 验证规则
        settlementBankAccountName: [
          { required: true, message: 'Please enter Bank account name' }
        ],
        settlementBankAccountNum: [
          { required: true, message: 'Please enter Bank account' }
        ],
        settlementBankBranchName: [
          { required: true, message: 'Please enter Bank branch name' }
        ],
        settlementBankJointName: [
          { required: true, message: 'Please enter Branch bank number' }
        ]
      }
    };
  },
  methods: {
    // Next
    next () {
      this.$refs.secondForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          applySecond(this.form)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 2);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error');
        }
      });
    }
  },
  mounted () {
    if (this.content != {}) {
      this.form = JSON.parse(JSON.stringify(this.content));
      this.$forceUpdate();
    }
    this.$refs.secondForm.resetFields()
  }
};
</script>
<style lang="scss" scoped>
h4 {
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  text-align: left;
}
.ivu-input-wrapper {
  width: 300px;
}
</style>
