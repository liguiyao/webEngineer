<template>
  <Modal
    :title="title"
    :styles="{ top: '120px' }"
    width="750"
    @on-cancel="clickClose"
    @on-ok="clickOK"
    v-model="flag"
    :mask-closable="false"
    scrollable
  >
    <goodsDialog
      @selected="(val) => {goodsData = val;}"
      :selectedWay='goodsData'
      ref="goodsDialog"
      v-if="goodsFlag"
    />
    <linkDialog
      @selectedLink="(val) => {linkData = val;}"
      v-else
      class="linkDialog"
    />
  </Modal>
</template>
<script>
import goodsDialog from "./goods-dialog";
import linkDialog from "./link-dialog";
export default {
  components: {
    goodsDialog,
    linkDialog,
  },
  data() {
    return {
      title: "select", // 模态框标题
      goodsFlag: false, // 是否Goodsselect器
      goodsData: [], //selectgoods
      linkData: "", //select的链接
      flag: false, // 控制模态框显隐
    };
  },
  methods: {
    // Close弹窗
    clickClose() {
      this.$emit("closeFlag", false);
      this.goodsFlag = false;
    },

    // 单选Goods
    singleGoods(){
      var timer = setInterval(() => {
        if (this.$refs.goodsDialog) {

          this.$refs.goodsDialog.type = "single";
         clearInterval(timer);
        }
      }, 100);
    },
    clickOK() { // Confirm按钮回调，
      if (this.goodsFlag) {
        this.$emit("selectedGoodsData", this.goodsData);
      } else {
        this.$emit("selectedLink", this.linkData);
      }
      this.clickClose();
    },
    open (type) { // 父组件通过ref调用，打开Goodsselect器
      this.flag = true;
      if(type == 'goods'){
        this.goodsFlag = true;
      } else {
        this.goodsFlag = false
      }

    },
    close(){ // Close组件
      this.flag = false;
    }
  },
};
</script>
<style scoped lang="scss">
/deep/ .ivu-modal {
  overflow: hidden;
  height: 650px !important;
}
/deep/ .ivu-modal-body {
  width: 100%;
  height: 500px;
  overflow: hidden;
}
</style>
