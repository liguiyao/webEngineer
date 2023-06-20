<template>
  <div class="wrapper">
    <!-- 卡片组件 -->
    <card _Title="My order" :_Size="16" :_Tabs="changeWay" @_Change="change" v-if="!homePage"></card>
    <card _Title="My order" :_Size="16" :_Tabs="changeWay" @_Change="change" _More="All order" _Src="/home/MyOrder" v-else></card>
    <!-- search 筛选 -->
    <div class="mb_24 box" v-if="!homePage">
      <div class="global_float_right" >
        <Input
          class="width_300"
          search
          enter-button
          v-model="params.keywords"
          @on-search="getList"
          placeholder="Please enter Order number search"
        />
      </div>
    </div>
    <!-- 订单列表 -->
    <empty v-if="orderList.length === 0" />
    <div class="order-content" v-else>
      <div
        class="order-list"
        v-for="(order, onderIndex) in orderList"
        :key="onderIndex"
      >
        <div class="order-header">
          <div>
            <div>{{ filterOrderStatus(order.orderStatus) }}</div>
            <div>
              Order number：{{ order.sn }} &nbsp; &nbsp; &nbsp;{{order.createTime}}
            </div>
          </div>
          <div>
            <Button v-if="order.orderStatus === 'COMPLETED'" @click="delOrder(order.sn)" class="del-btn mr_10 fontsize_16" style="margin-top:-5px;" type="text" icon="ios-trash-outline" size="small"></Button>
            <span>{{ order.flowPrice | unitPrice("RM") }}</span>
          </div>
        </div>
        <div class="order-body">
          <div class="goods-list">
            <div
              v-for="(goods, goodsIndex) in order.orderItems"
              :key="goodsIndex"
            >
              <img
                @click="goodsDetail(goods.skuId, goods.goodsId)"
                class="hover-color"
                :src="goods.image"
                alt=""
              />
              <div>
                <div class="hover-color" @click="goodsDetail(goods.skuId, goods.goodsId)">{{ goods.name }}</div>
                <div class="mt_10">
                  <span class="global_color"
                    >{{ goods.goodsPrice | unitPrice("RM") }} </span
                  >x {{ goods.num }}
                </div>
                <Button v-if="goods.commentStatus == 'UNFINISHED'" @click="comment(order.sn, goodsIndex)" size="small" type="success" class="fontsize_12" style="position:relative;top:-22px;left:100px;margin-right:10px">Evaluate</Button>
                <Button v-if="goods.complainStatus == 'NO_APPLY'" @click="complain(order.sn, goodsIndex)" type="warning" class="fontsize_12" size="small" style="position:relative;top:-22px;left:100px">Complaint</Button>
              </div>
            </div>
          </div>
          <div>
            <span @click="shopPage(order.storeId)">{{ order.storeName }}</span>
          </div>
          <div>
            <!-- 订单基础operation -->
            <Button @click="orderDetail(order.sn)" type="info" size="small">Order details</Button>
            <Button @click="handleCancelOrder(order.sn)" type="error" v-if="order.allowOperationVO.cancel" size="small">Cancel order</Button>
            <Button @click="goPay(order.sn)" size="small" type="success" v-if="order.allowOperationVO.pay">payment</Button>
            <Button @click="received(order.sn)" size="small" type="warning" v-if="order.allowOperationVO.rog">Confirm receipt</Button>
            <!-- after sale -->
            <Button v-if="order.groupAfterSaleStatus && order.groupAfterSaleStatus.includes('NOT_APPLIED')" @click="applyAfterSale(order.orderItems)" size="small">Apply  after sale</Button>
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <!-- 分Page -->
    <div class="page-size" v-if="!homePage">
      <Page :total="total" @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="params.pageSize"
        show-total
        show-sizer>
      </Page>
    </div>
    <!-- selectafter saleGoods -->
    <Modal v-model="afterSaleModal" title="Please selectApply  after sale goods">
      <div>
        <Table
          border
          :columns="afterSaleColumns"
          :data="afterSaleArr"
          @on-row-click="afterSaleSelect"
        >
        </Table>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="cancelAvail" title="Please selectCancel order reason" @on-ok="sureCancel" @on-cancel="cancelAvail = false">
      <RadioGroup v-model="cancelParams.reason" vertical type="button" button-style="solid">
        <Radio :label="item.reason" v-for="item in cancelReason" :key="item.id">
           {{item.reason}}
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>

<script>
import { getOrderList, sureReceived, cancelOrder, delOrder } from '@/api/order';
import { afterSaleReason } from '@/api/member';
import { orderStatusList } from '../enumeration.js'
export default {
  name: 'MyOrder',
  props: {
    homePage: { // 判断是否个人中心Home展示内容
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      orderList: [], // 订单列表
      params: { // Please 求参数
        pageNumber: 1,
        pageSize: 10,
        // orderStatus: 'ALL',
        keywords: '',
        tag: 'ALL'
      },
      cancelParams: { // Cancelafter sale参数
        orderSn: '',
        reason: ''
      },
      // state数组
      orderStatusList,
      changeWay: ['All order', 'To be paid', 'To be receive', 'completed'], // Status
      total: 0, // 数据总数
      spinShow: false, // 加载state
      afterSaleModal: false, // selectafter saleGoods模态框
      afterSaleColumns: [ // after saleGoods表头
        {title: 'goods name', key: 'name'},
        {title: 'price', key: 'goodsPrice'}
      ],
      afterSaleArr: [], // after saleGoods列表
      cancelAvail: false, // Cancel ordermodal控制
      cancelReason: [] // Cancel order reason
    };
  },
  mounted () {
    if (this.homePage) this.params.pageSize = 5;
    this.getList();
  },
  methods: {
    goodsDetail (skuId, goodsId) {
      // 跳转Goods Detail
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId, goodsId }
      });
      window.open(routeUrl.href, '_blank');
    },
    // 切换Status
    change (index) {
      switch (index) {
        case 0:
          this.params.tag = 'ALL'
          break;
        case 1:
          this.params.tag = 'WAIT_PAY'
          break;
        case 2:
          this.params.tag = 'WAIT_ROG'
          break;
        case 3:
          this.params.tag = 'COMPLETE'
          break;
      }
      this.getList()
    },
    // 跳转店铺Home
    shopPage (id) {
      let routeUrl = this.$router.resolve({
        path: '/Merchant',
        query: { id: id }
      });
      window.open(routeUrl.href, '_blank');
    },
    orderDetail (sn) {
      // 跳转Order details
      this.$router.push({ name: 'OrderDetail', query: {sn} });
    },
    received (sn) { // Confirm receipt
      sureReceived(sn).then(res => {
        if (res.success) {
          this.$Message.success('Confirm receiptsuccess')
          this.getList()
        }
      })
    },
    goPay (sn) { // payment
      this.$router.push({path: '/payment', query: {orderType: 'ORDER', sn}});
    },
    applyAfterSale (goodsItem) { // Apply  after sale
      let arr = []
      goodsItem.forEach(e => {
        if (e.afterSaleStatus === 'NOT_APPLIED') {
          arr.push(e)
        }
      });
      if (arr.length === 1) {
        this.$router.push({name: 'ApplyAfterSale', query: {sn: arr[0].sn}})
      } else {
        this.afterSaleArr = arr;
        this.afterSaleModal = true
      }
    },
    // Apply  after sale
    afterSaleSelect (item) {
      this.$router.push({name: 'ApplyAfterSale', query: {sn: item.sn}})
    },
    comment (sn, goodsIndex) { // Evaluate
      this.$router.push({path: '/home/addEval', query: {sn, index: goodsIndex}})
    },
    complain (sn, goodsIndex) { // Complaint
      this.$router.push({name: 'Complain', query: {sn, index: goodsIndex}})
    },
    delOrder (sn) { // delete order
      this.$Modal.confirm({
        title: 'delete order',
        content: '<p>delete current order ？</p>',
        onOk: () => {
          delOrder(sn).then(res => {
            if (res.success) {
              this.$Message.success('deletesuccess');
              this.getList()
            }
          })
        },
        onCancel: () => {}
      });
    },
    getList () { // 获取订单列表
      this.spinShow = true;
      let params = JSON.parse(JSON.stringify(this.params))
      if (params.orderStatus === 'ALL') {
        delete params.orderStatus
      }
      getOrderList(params).then(res => {
        this.spinShow = false
        if (res.success) {
          this.orderList = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    changePageNum (val) { // modifyPage码
      this.params.pageNumber = val;
      this.getList()
    },
    changePageSize (val) { // modifyPage数
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.getList()
    },
    handleCancelOrder (sn) {
      // Cancel order
      this.cancelParams.orderSn = sn;
      afterSaleReason('CANCEL').then(res => {
        if (res.success) {
          this.cancelReason = res.result;
          this.cancelAvail = true
          this.cancelParams.reason = this.cancelReason[0].reason
        }
      })
    },
    sureCancel () { // ConfirmCancel
      cancelOrder(this.cancelParams).then(res => {
        if (res.success) {
          this.$Message.success('Cancel ordersuccess')
          this.getList()
          this.cancelAvail = false
        }
      })
    },
    filterOrderStatus (status) { // 获取Status中文
      const ob = this.orderStatusList.filter(e => { return e.status === status });
      return ob && ob[0] ? ob[0].name : status
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  margin-bottom: 40px;
}
.box {
  overflow: hidden;
}
.page-size {
  margin: 15px 0px;
  text-align: right;
}
/** 订单列表 */
.order-list {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover{
    .del-btn{visibility: visible;}
  }
  .del-btn{
    visibility: hidden;
  }

  .order-header {
    display: flex;
    align-items: center;
    padding: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    > div:nth-child(1) > div:nth-child(2) {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
  .order-body {
    display: flex;
    justify-content: space-between;
    color: #999;
    padding: 10px;

    .goods-list > div {
      width: 500px;
      display: flex;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      > div {
        flex: 1;
      }
    }

    > div:nth-child(2) {
      width: 150px;
      text-align: center;
      span {
        color: #438cde;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
      .ivu-icon {
        color: #ff8f23;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
    }

    > div:nth-child(3) {
      width: 100px;
      .ivu-btn {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
