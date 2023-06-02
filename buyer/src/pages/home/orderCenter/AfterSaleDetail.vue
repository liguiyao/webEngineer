<template>
  <div class="order-detail">
    <card _Title="After-sale details" :_Size="16"></card>
    <!-- operation按钮 -->
    <Card class="mb_10" v-if="(afterSale.serviceStatus == 'PASS' &&
          afterSale.serviceType != 'RETURN_MONEY') || (afterSale.afterSaleAllowOperationVO && afterSale.afterSaleAllowOperationVO.cancel)">
      <Button type="success" @click="openModal" v-if="afterSale.serviceStatus == 'PASS' &&
          afterSale.serviceType != 'RETURN_MONEY'" size="small">Submit logistics</Button>&nbsp;
      <Button type="error" @click="cancel(afterSale.sn)" v-if="afterSale.afterSaleAllowOperationVO && afterSale.afterSaleAllowOperationVO.cancel" size="small">Cancelafter sale</Button>
    </Card>
    <div class="order-card">
      <h3>{{afterSale.serviceName}}</h3>
      <p class="global_color fontsize_18">{{ afterSale.orderStatusValue }}</p>
      <p>After-sales order number：{{ afterSale.sn }} &nbsp;&nbsp;&nbsp;Order number：{{afterSale.orderSn}}</p>
      <div style="color:#999;" class="operation-time">Create time：{{afterSale.createTime}}</div>
      <div class="service-after">
        <div>
          This after-sales service is provided by<span>{{afterSale.storeName}}</span>provide for you
        </div>
        <div>
          <img :src="afterSale.goodsImage" alt="" width="60" height="60">
          <span>{{afterSale.goodsName}}</span>
        </div>
      </div>
    </div>
    <div class="order-card">
      <h3>process</h3>
      <Steps class="progress" :current="logList.length" direction="vertical">
        <Step
          :content="'operator：'+ log.operatorName + '   ' + log.createTime"
          :title="log.message"
          v-for="(log, index) in logList"
          :key="index"
        ></Step>
      </Steps>
    </div>
    <div class="order-card">
      <h3 class="mb_10">list information</h3>
      <table border="1" cellpadding='0' cellspacing="0">
        <tr>
          <td>Refund method</td><td>{{afterSale.refundWay == 'ORIGINAL' ? 'backtracking' : 'Account refund'}}</td>
        </tr>
        <tr>
          <td>Apply refund amount</td><td>{{afterSale.applyRefundPrice | unitPrice('RM')}}</td>
        </tr>
        <tr v-if="afterSale.actualRefundPrice">
          <td>real refund amount</td><td>{{afterSale.actualRefundPrice | unitPrice('RM')}}</td>
        </tr>
        <template v-if="afterSale.refundWay === 'OFFLINE'">
          <tr>
            <td>Refund bank</td><td>{{afterSale.bankDepositName}}</td>
          </tr>
          <tr>
            <td>Account name for refund</td><td>{{afterSale.bankAccountName}}</td>
          </tr>
          <tr>
            <td>Refund card number</td><td>{{afterSale.bankAccountNumber}}</td>
          </tr>
        </template>
        <tr>
          <td>Way of handling goods</td><td>{{afterSale.serviceType == 'RETURN_MONEY' ? 'refund' : 'Return goods'}}</td>
        </tr>
        <tr>
          <td>Reason for refund</td><td>{{afterSale.reasonName}}</td>
        </tr>
        <tr>
          <td>Problem description</td><td>{{afterSale.problemDesc}}</td>
        </tr>
      </table>
    </div>
    <div class="order-card" v-if="afterSale.afterSaleImage">
      <h3 class="mb_10">Picture info</h3>
      <div v-for="img in afterSale.afterSaleImage.split(',')" :key="img">
        <img :src="img" width="200" height="200" @click="perviewImg(img)" class="hover-pointer" alt="">
      </div>
    </div>
    <Modal v-model="logisticsShow" width="530">
      <p slot="header">
        <span>Submitlogistics information</span>
      </p>
      <div>
        <Form ref="form" :model="form" label-position="left" :label-width="100" :rules="rules">
          <FormItem label="Logistics company " prop="logisticsId">
            <Select v-model="form.logisticsId" placeholder="Please selectLogistics company ">
              <Option v-for="item in companyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="Tracking number" prop="logisticsNo">
            <Input v-model="form.logisticsNo" placeholder="Please enter Tracking number"></Input>
          </FormItem>
          <FormItem label="Delivery time" prop="mDeliverTime">
            <DatePicker type="date" style="width:100%" v-model="form.mDeliverTime" @on-change="changeTime" format="yyyy-MM-dd" placeholder="selectDelivery time"></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="logisticsShow = false">Close</Button>
        <Button type="primary" :loading="submitLoading" @click="submitDelivery">Submit</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { afterSaleDetail, afterSaleLog, afterSaleReason, cancelAfterSale } from '@/api/member.js';
import { afterSaleDelivery, getLogisticsCompany } from '@/api/order.js';
import { afterSaleStatusList } from '../enumeration.js'
export default {
  name: 'aftersale-detail',
  data () {
    return {
      afterSale: {}, // After-sale details数据
      logList: [], // 日志
      reasonList: [], // after sale原因列表
      afterSaleStatusList, // after sale状态列表
      companyList: [], // Logistics company 列表
      logisticsShow: false, // logistics informationmodal
      form: { // logistics information数据
        afterSaleSn: '',
        logisticsId: '',
        logisticsNo: '',
        mDeliverTime: ''
      },
      rules: { // 必填校验
        logisticsId: [{ required: true, message: 'Please selectLogistics company ' }],
        logisticsNo: [{ required: true, message: 'Please enter Logistics number' }],
        mDeliverTime: [{ required: true, message: 'Please selectDelivery time' }]
      },
      submitLoading: false // Submit加载状态
    };
  },
  methods: {
    getDetail () { // After-sale details
      afterSaleDetail(this.$route.query.sn).then(res => {
        if (res.success) {
          this.afterSale = res.result;
          this.afterSale.serviceName = this.filterOrderStatus(this.afterSale.serviceStatus)
          // 如果是原因id，则调接口查询原因中文释义
          const pattern3 = new RegExp('[0-9]+');
          if (pattern3.test(this.afterSale.reason)) {
            this.getReason(this.afterSale.serviceType)
          } else {
            this.$set(this.afterSale, 'reasonName', this.afterSale.reason)
          }
        }
      })
    },
    getReason (type) { // 获取after sale原因
      afterSaleReason(type).then(res => {
        if (res.success) {
          this.reasonList = res.result
          this.reasonList.forEach(e => {
            if (e.id === this.afterSale.reason) {
              this.$set(this.afterSale, 'reasonName', e.reason)
            }
          })
        }
      })
    },
    getLog () { // 获取after sale日志
      afterSaleLog(this.$route.query.sn).then(res => {
        this.logList = res.result;
      })
    },
    filterOrderStatus (status) { // 获取订单状态中文
      const ob = this.afterSaleStatusList.filter(e => { return e.status === status });
      if (ob.length) return ob[0].name
    },
    perviewImg (img) { // 查看图片
      window.open(img, '_blank')
    },
    cancel (sn) { // Cancelafter saleApply
      this.$Modal.confirm({
        title: 'Cancel',
        content: '<p>Are you sure to cancel this after-sales application？</p>',
        onOk: () => {
          cancelAfterSale(sn).then(res => {
            if (res.success) {
              this.$Message.success('Cancel the after-sales application successfully')
              this.getDetail()
            }
          })
        },
        onCancel: () => {}
      });
    },
    // 获取Logistics company 列表
    getCompany () {
      getLogisticsCompany().then(res => {
        if (res.success) {
          this.companyList = res.result
        }
      })
    },
    // Submitlogistics information
    submitDelivery () {
      this.submitLoading = true
      afterSaleDelivery(this.form).then(res => {
        if (res.success) {
          this.logisticsShow = false;
          this.$Message.success('Submit success')
          this.getDetail()
        }
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // Submitlogisticsmodal
    openModal () {
      this.form.afterSaleSn = this.afterSale.sn
      this.logisticsShow = true;
      this.$refs.form.resetFields()
      if (!this.companyList.length) {
        this.getCompany()
      }
    },
    // 格式化时间
    changeTime (time) {
      this.form.mDeliverTime = time;
    }
  },
  mounted () {
    this.getDetail();
    this.getLog()
  }
};
</script>
<style lang="scss" scoped>
.order-card {
  padding: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
  position: relative;
  .global_color {
    color: $theme_color;
  }
  p {
    color: #999;
    margin: 3px;
  }
  h3 {
    font-weight: normal;
    font-size: 16px;
  }
  .operation-time {
    position: absolute;
    right: 20px;
    top: 10px;
  }
  &:last-child{
    border: none;
  }
}
.service-after {
  border: 1px solid #eee;
  display: flex;
  height: 80px;
  padding: 10px;
  >div:nth-child(1) {
    width: 400px;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    span{color: $theme_color;}
    border-right: 1px solid #eee;
  }
  >div:nth-child(2){
    padding-left: 15px;
    img{vertical-align: top;}
    span{color: #999;}
  }
}
/** after sale进度条 */
.progress {
  margin: 15px 0;
}
table{
  border-color: #eee;
  width: 100%;
  color: #999;
  tr{
    td:nth-child(1){
      width: 200px;
    }
  }
  td{
    padding: 5px;
  }
}
</style>
