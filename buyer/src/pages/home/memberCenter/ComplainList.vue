<template>
  <div class="wrapper">
    <card _Title="我的Complaint"  />

    <div class="order">
      <div class="order-title">
        <Row class="order-row title">
          <i-col span="12">Goods details</i-col>
          <i-col span="4">Complaintstate</i-col>
          <i-col span="4">Complaint主题</i-col>
          <i-col span="6"></i-col>
        </Row>
      </div>
      <empty v-if="list.length === 0" />

      <div class="order-item" v-else v-for="(item, index) in list" :key="index">
        <div>
          <div class="title order-item-title">
            <span>Complaint单号:{{item.id}}</span>
            <span class="color999 ml_10">{{item.createTime}}</span>
            <span class="hover-pointer fontsize_12 eval-detail" @click="goDetail(item.id)">Complaint详情</span>
            <span class="hover-pointer fontsize_12 eval-detail" style="right: 90px" v-if="item.complainStatus === 'APPLYING' || item.complainStatus === 'NEW'" @click="cancel(item.id)">CancelComplaint</span>
          </div>
          <Row class="order-item-view">
            <i-col span="12" class="item-view-name">
              <div class="order-img hover-color" @click="linkTo(`/goodsDetail?goodsId=${item.goodsId}&skuId=${item.skuId}`)">
                <img :src="item.goodsImage" alt="" />
              </div>
              <div class="order-name hover-color" @click="linkTo(`/goodsDetail?goodsId=${item.goodsId}&skuId=${item.skuId}`)">
                {{item.goodsName}}
              </div>
            </i-col>
            <i-col span="4">{{statusLabel[item.complainStatus]}}</i-col>
            <i-col span="4">
              <div class="content">{{item.complainTopic}}</div>
            </i-col>
            <i-col span="4">
              <Tooltip >
                <div class="content">{{item.content}}</div>
                <div style="white-space: normal;" slot="content">
                  {{item.content}}
                </div>
              </Tooltip>
            </i-col>
          </Row>
        </div>
      </div>
      <Spin v-if="loading"></Spin>
    </div>
    <!-- 分Page -->
    <div class="page-size">
      <Page :total="total" @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="params.pageSize"
        show-total
        show-sizer>
      </Page>
    </div>
  </div>
</template>

<script>
import {complainList, clearComplain} from '@/api/member.js';
export default {
  name: 'ComplainList',
  data () {
    return {
      loading: false, // 加载state
      list: [], // Complaint列表
      statusLabel: { // Complaintstate
        NO_APPLY: '未Apply  ',
        APPLYING: 'Apply  中',
        COMPLETE: 'completed',
        EXPIRED: '已失效',
        CANCEL: 'Cancel',
        NEW: '新订单'
      },
      total: 0, // Complaint总数
      params: { // Please 求参数
        pageNumber: 1,
        pageSize: 10
      }
    };
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () { // 获取Complaint列表
      complainList(this.params).then(res => {
        if (res.success) {
          const list = res.result.records;
          this.list = list;
          this.total = res.result.total
        }
      })
    },
    changePageNum (val) { // 改变Page码
      this.params.pageNumber = val;
      this.getList()
    },
    changePageSize (val) { // 改变Page数
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.getList()
    },
    cancel (id) { // CancelComplaint
      this.$Modal.confirm({
        title: 'CancelComplaint',
        content: '<p>ConfirmCancelComplaint吗？</p>',
        onOk: () => {
          clearComplain(id).then((res) => {
            if (res.success) {
              this.$Message.success('CancelComplaintsuccess');
              this.getCartList();
            }
          });
        },
        onCancel: () => { }
      });
    },
    goDetail (id) { // 跳转Complaint详情
      this.$router.push({path: '/home/complainDetail', query: { id }})
    }
  }
};
</script>

<style scoped lang="scss">
.order-img {
  > img {
    width: 60px;
    height: 60px;
    border: 1px solid $border_color;
    box-sizing: border-box;
  }
}
.title {
  @include background_color($light_background_color);
}
.item-view-name {
  display: flex;
}
.order-name {
  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;

  overflow: hidden;
  text-align: left;
  padding: 0 10px;
  font-size: 13px;
  @include content_color($light_content_color);
}
.order-item-title {
  padding: 5px 20px;
  text-align: left;
  font-size: 13px;
  position: relative;
}
.order-item-view {
  padding: 10px 20px;
}
.order-item {
  text-align: center;
  border: 1px solid $border_color;
  margin: 10px 0;
}
.order-row {
  padding: 10px 0;
  text-align: center;
}
.content {
  color: #999;
  max-height: 60px;
  overflow: hidden;
  word-wrap: break-word;
}

.eval-detail {
  position: absolute;
  right: 20px;
  &:hover{
    color: $theme_color;
  }
}
.page-size{
  text-align: right;
}
</style>
