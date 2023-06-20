<template>
  <div class="goods-operation">
    <div class="step-list">
      <steps :current="activestep" style="height:60px;margin-top: 10px">
        <step title="select Goods type"/>
        <step title="enter Goods Detail"/>
        <step title="Goods release success"/>
      </steps>
    </div>
    <!-- 第一步 select分类 -->
    <first-step ref='first' v-show="activestep === 0" @change="getFirstData"></first-step>
    <!-- 第二步 Goods详细信息 -->
    <second-step ref='second' :firstData="firstData" v-if="activestep === 1"></second-step>
    <!-- 第三步 发布完成 -->
    <third-step ref='third' v-if="activestep === 2"></third-step>


  </div>
</template>
<script>
import firstStep from  './goodsOperationFirst'
import secondStep from  './goodsOperationSec'
import thirdStep from  './goodsOperationThird'
export default {
  name: "addGoods",
  components: {
    firstStep,
    secondStep,
    thirdStep
  },

  data() {
    return {
      /** 当前激活步骤*/
      activestep: 0,
      firstData: {}, // 第一步传递的数据
    };
  },
  methods: {
    // selectGoods Category回调
    getFirstData (item) {
      this.firstData = item;
      this.activestep = 1;
    }
  },
  mounted() {
    // editGoods、模板
    if (this.$route.query.id || this.$route.query.draftId) {
      this.activestep = 1;
    } else {
      this.activestep = 0
      this.$refs.first.selectGoodsType = true;
    }

  }
};
</script>
<style lang="scss" scoped>
@import "./addGoods.scss";
</style>
