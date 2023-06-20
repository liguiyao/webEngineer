<template>
  <div class="apply-after-sale">
    <card _Title="Apply  after sale"></card>
    <Table
      border
      :columns="columns"
      :data="goodsData"
    >
    <template slot-scope="{ row }" slot="goodsName">
      <div style="padding:5px;display:flex;">
        <img :src="row.image" style="vertical-align: top;" width="60" height="60" alt=""> <span class="ml_10">{{row.goodsName}}</span>
      </div>
    </template>
    <template slot-scope="{ row }" slot="goodsPrice">
      <div>{{row.applyRefundPrice | unitPrice('RM')}}</div>
    </template>
    </Table>
    <div>
      <Form :model="form" ref="form" class="mt_10" :rules="rules" :label-width="80">
        <FormItem label="after sale type">
          <RadioGroup v-model="form.serviceType" @on-change="changeReason" type="button" button-style="solid">
            <Radio v-if="info.returnGoods" label="RETURN_GOODS">Return goods</Radio>
            <Radio v-if="info.returnMoney" label="RETURN_MONEY">refund</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Submit quantity" prop="num">
          <Input type="number" v-model="form.num" style="width:260px" />
        </FormItem>
        <FormItem label="Submit reason" prop="reason">
          <Select v-model="form.reason" style="width:260px">
            <Option v-for="item in reasonList" :value="item.id" :key="item.id">{{ item.reason }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Problem description" prop="problemDesc">
          <Input type="textarea" :rows="4" maxlength="500" style="width:260px" show-word-limit v-model="form.problemDesc" />
        </FormItem>
        <FormItem label="Picture info">
          <div style="display:flex;align-items:center;">
            <div class="demo-upload-list" v-for="(img, index) in uploadList" :key="index">
              <img :src="img">
              <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(img)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              </div>
            </div>
            <Upload
                :show-upload-list="false"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                :format="['jpg','jpeg','png']"
                :action="action"
                :headers="accessToken"
                style="display: inline-block;width:58px;">
                <div class="hover-pointer icon-upload" style="">
                  <Icon type="md-add" size="20"></Icon>
                </div>
            </Upload>
          </div>
        </FormItem>
        <FormItem label="refund方式">
          <div>{{info.refundWay == 'ORIGINAL' ? 'backtracking' : 'account refund'}}</div>
        </FormItem>
        <template v-if="info.accountType === 'BANK_TRANSFER' && info.applyRefundPrice != 0">
          <FormItem label="Opening bank" prop="bankDepositName">
            <Input v-model="form.bankDepositName" type="text" placeholder="Please enter Bank of account" style="width:260px" />
          </FormItem>
          <FormItem label="Account name" prop="bankAccountName">
            <Input v-model="form.bankAccountName" type="text" placeholder="Please enter Bank account name" style="width:260px" />
          </FormItem>
          <FormItem label="Bank account" prop="bankAccountNumber">
            <Input v-model="form.bankAccountNumber" type="text" placeholder="Please enter Bank account" style="width:260px" />
          </FormItem>
        </template>
        <FormItem label="Back way" v-if="form.serviceType === 'RETURN_GOODS'">
          <div>Express to third party seller</div>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="apply">SubmitApply  </Button>
        </FormItem>
      </Form>
      <Modal title="View Image" v-model="visible">
        <img :src="previewImage" v-if="visible" style="width: 100%">
      </Modal>
    </div>
  </div>
</template>
<script>
import { afterSaleReason, afterSaleInfo, applyAfterSale } from '@/api/member.js'
import { commonUrl } from '@/plugins/request.js';
import storage from '@/plugins/storage';
import * as RegExp from '@/plugins/RegExp'
export default {
  data () {
    const checkNum = (rule, value, callback) => {
      if (value === '') {
        console.log(RegExp);
        callback(new Error('Please enter Submit quantity'));
      } else if (value > this.info.num) {
        callback(new Error('Submit quantity cannot be greater than the purchased quantity'));
      } else if (!RegExp.integer.test(value)) {
        callback(new Error('Submit quantity must be positive integer'));
      } else {
        callback();
      }
    };
    return {
      columns: [ // 表格表头
        {title: 'goods name', slot: 'goodsName'},
        {title: 'price', slot: 'goodsPrice'},
        {title: 'quantity', key: 'num'}
      ],
      goodsData: [], // Goods数据
      reasonList: [], // after sale原因列表
      info: {}, // after sale信息
      form: { // after sale数据
        serviceType: 'RETURN_GOODS',
        num: 1
      },
      uploadList: [], // 上传列表
      action: commonUrl + '/common/common/upload/file', // 上传address
      accessToken: {}, // 验证token
      visible: false, // 图片预览
      previewImage: '', // 预览图片url
      rules: { // 验证规则
        num: [{ validator: checkNum }],
        reason: [{ required: true, message: 'Please selectSubmit reason' }],
        problemDesc: [{ required: true, message: 'Please enter Problem description' }],
        bankAccountNumber: [
          { required: true, message: 'Please enter card number' },
          {
            type: 'string',
            pattern: /^[0-9]\d*$/,
            message: 'Please enter correct number'
          }
        ],
        bankAccountName: [{ required: true, message: 'Please enter Bank account name' }],
        bankDepositName: [{ required: true, message: 'Please enter Bank of account' }]
      }
    }
  },
  methods: {
    getInfo () { // 获取after sale信息
      afterSaleInfo(this.$route.query.sn).then(res => {
        if (res.success) {
          this.info = res.result
          this.goodsData.push(res.result)
          if (!this.info.returnGoods && this.info.returnMoney) {
            this.form.serviceType = 'RETURN_MONEY'
          }
          this.getReason(this.form.serviceType)
        }
      })
    },
    getReason (type) { // 获取after sale原因
      afterSaleReason(type).then(res => {
        if (res.success) this.reasonList = res.result
      })
    },
    changeReason (type) { // 改变after sale原因列表
      this.getReason(type)
    },
    apply () { // after saleApply  Submit
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign(this.info, this.form)
          params.images = this.uploadList.toString()
          params.orderItemSn = this.$route.query.sn
          params.reason = this.reasonList.find(item => item.id == params.reason).reason
          applyAfterSale(params).then(res => {
            if (res.success) {
              this.$Message.success('after saleApply  Submit success，Please 到after sale订单View！')
              this.$router.push({name: 'AfterSale'})
            }
          })
        }
      })
    },
    handleView (name) { // 预览图片
      this.previewImage = name;
      this.visible = true;
    },
    handleRemove (index) { // 移除图片
      this.uploadList.splice(index, 1)
      this.$forceUpdate()
    },
    handleSuccess (res, file) { // 上传success回调
      this.uploadList.push(res.result)
      this.$forceUpdate()
    },
    handleBeforeUpload () { // 上传之前钩子函数
      const check = this.uploadList.length < 6;
      if (!check) {
        this.$Notice.warning({
          title: 'Upload a maximum of 5 images'
        });
        return check;
      }
    }
  },
  mounted () {
    this.accessToken.accessToken = storage.getItem('accessToken');
    this.getInfo()
  }
}
</script>
<style lang="scss" scoped>

/** Goods details */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 16px;
  color: #999;
  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }
  .actrual-price {
    color: $theme_color;
    font-weight: bold;
    font-size: 20px;
  }
}
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
  margin-top: 10px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.icon-upload {
  width: 58px;
  height:58px;
  line-height: 58px;
  text-align:center;
  display: inline-block;
  border:1px dashed #999;
  border-radius: 4px;
  margin-top: 10px;
  &:hover{
    cursor: pointer;
    border-color: $theme_color;
  }
}
</style>
