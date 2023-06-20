<template>
  <div class="invoice-modal">
    <Modal v-model="invoiceAvailable" width="600" footer-hide>
      <p slot="header">
        <span>Invoice information</span>
      </p>
      <!-- 普通发票 -->
      <div class="nav-content">
        <Form :model="invoiceForm" ref="form" label-position="left" :rules="ruleInline" :label-width="110">
          <FormItem label="Invoice type">
            <RadioGroup v-model="invoice" type="button" button-style="solid">
              <Radio @on-change="changeInvoice" :label="1">Ordinary invoice</Radio>
              <Radio :label="2" :disabled="true">Special invoice</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Invoice title">
            <RadioGroup v-model="type" @on-change="changeInvoice" type="button" button-style="solid">
              <Radio :label="1">individual</Radio>
              <Radio :label="2">company</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="name" v-if="type === 1" prop="receiptTitle">
            <i-input v-model="invoiceForm.receiptTitle"></i-input>
          </FormItem>
          <FormItem label="company name" v-if="type === 2" prop="receiptTitle">
            <i-input v-model="invoiceForm.receiptTitle"></i-input>
          </FormItem>
<!--          <FormItem label="纳税人识别号" v-if="type === 2" prop="taxpayerId">-->
<!--            <i-input v-model="invoiceForm.taxpayerId"></i-input>-->
<!--          </FormItem>-->
<!--          <FormItem label="发票内容">-->
<!--            <RadioGroup v-model="invoiceForm.receiptContent" type="button" button-style="solid">-->
<!--              <Radio label="Goods明细">Goods明细</Radio>-->
<!--              <Radio label="Goods类别">Goods类别</Radio>-->
<!--            </RadioGroup>-->
<!--          </FormItem>-->
        </Form>
        <div style="text-align: center">
          <Button type="primary" :loading="loading" @click="submit">save</Button>
          <Button type="default" @click="invoiceAvailable = false">cancel</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { receiptSelect } from '@/api/cart.js';
import { TINumber } from '@/plugins/RegExp.js';
export default {
  name: 'invoiceModal',
  data () {
    return {
      invoice: 1, // 发票类型
      invoiceAvailable: false, // 模态框显隐
      loading: false, // Submitstate
      invoiceForm: {
        // 普票表单
        receiptTitle: '', // 发票抬头
        taxpayerId: '', // 纳税人识别号
        receiptContent: 'Soods detail' // 发票内容
      },
      type: 1, // 1 个人 2 单位
      ruleInline: {
        taxpayerId: [
          { required: true, message: 'xx' },
          { pattern: TINumber, message: 'xx' }
        ]
      }
    };
  },
  props: ['invoiceData'],
  watch: {
    // 回显的发票信息
    invoiceData: {
      handler (val) {
        this.invoiceForm = { ...val };

        if (val.taxpayerId) {
          this.type = 2;
        } else {
          this.type = 1;
        }
      },
      deep: true,
      immeadite: true
    }
  },
  methods: {
    /**
     *  select发票抬头
     */
    changeInvoice (val) {
      this.$nextTick(() => {
        this.type = val;
      });
    },

    /**
     *  Save判断
     */
    save () {
      let flage = true;

      // Save分为两种类型，个人以及企业
      const { receiptTitle } = JSON.parse(
        JSON.stringify(this.invoiceForm)
      );
      // 判断是否enter 发票抬头
      if (!receiptTitle) {
        this.$Message.error('xx!');
        flage = false;
        return false;
      }

      if (this.type === 2) {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            flage = false;
          }
        });
      } else {
        delete this.invoiceForm.taxpayerId;
      }

      return flage;
    },
    // Save发票信息
    async submit () {
      if (this.save()) {
        this.loading = true;
        let submit = {
          way: this.$route.query.way,
          ...this.invoiceForm
        };
        let receipt = await receiptSelect(submit);
        if (receipt.success) {
          this.$emit('change', true);
        }

        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/** 普票 */
.inv-type {
  text-align: center;
}
.add-inv {
  font-size: 12px;
  color: #438cde;
  cursor: pointer;
  &:hover {
    color: $theme_color;
  }
}

.nav-content {
  width: 500px;
  margin: 10px auto;
}
</style>
