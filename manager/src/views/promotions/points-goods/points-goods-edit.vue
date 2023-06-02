<template>
  <div>
    <Card>
      <Form ref="form" :model="form" :label-width="120" :rules="formRule">
        <div class="base-info-item">
          <h4>积分Goods details</h4>
          <div class="form-item-view">
            <FormItem label="goods name">
              <div>{{ form.goodsSku.goodsName }}</div>
            </FormItem>
            <FormItem label="SKU编码">
              <div>{{ form.goodsSku.id }}</div>
            </FormItem>
            <FormItem label="store name">
              <div>{{ form.goodsSku.storeName }}</div>
            </FormItem>
            <FormItem label="Goodsprice">
              <div>{{ form.goodsSku.price | unitPrice("RM") }}</div>
            </FormItem>
            <FormItem label="库存">
              <div>{{ form.goodsSku.quantity }}</div>
            </FormItem>
            <FormItem label="结算price" prop="settlementPrice">
              <Input
                type="number"
                v-model="form.settlementPrice"
                placeholder="Please enter 结算price"
                clearable
                style="width: 260px"
              />
            </FormItem>
            <FormItem label="分类" prop="pointsGoodsCategoryId">
              <Select
                v-model="form.pointsGoodsCategoryId"
                :label-in-value="true"
                @on-change="changeCategory"
              >
                <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{
                  item.name
                }}</Option>
              </Select>
            </FormItem>
            <FormItem label="活动库存" prop="activeStock">
              <Input
                type="number"
                v-model="form.activeStock"
                placeholder="Please enter 活动库存"
                clearable
                style="width: 260px"
              />
            </FormItem>
            <FormItem label="兑换积分" prop="points">
              <Input
                type="number"
                v-model="form.points"
                placeholder="Please enter 兑换积分"
                clearable
                style="width: 260px"
              />
            </FormItem>
            <FormItem label="活动开始时间">
              <DatePicker
                type="datetimerange"
                v-model="form.rangeTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="Please select"
                :options="options"
                style="width: 260px"
              >
              </DatePicker>
            </FormItem>
          </div>
          <div class="footer">
            <Button @click="closeCurrentPage" style="margin-right: 5px">Back</Button>
            <Button type="primary" :loading="submitLoading" @click="handleSubmit"
              >Save</Button
            >
          </div>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
import {
  updatePointsGoods,
  getPointsGoodsById,
  getPointsGoodsCategoryList,
} from "@/api/promotion";

export default {
  name: "editPointsGoods",
  data() {
    return {
      pointsGoodsCategoryId:'',
      pointsGoodsCategoryName:'',
      form: {

        /** 活动名称 */
        promotionName: "",
        /** 报名截止时间 */
        applyEndTime: "",
        /** 活动开始时间 */
        startTime: "",
        /** 抢购时间段 */
        seckillPeriod: [],
        /** Apply  规则 */
        seckillRule: "",
        goodsSku: {},
        promotionStatus: "NEW",

      },
      categoryList: [], // 分类列表
      id: this.$route.query.id, // 活动id
      submitLoading: false, // 添加或编辑Submit状态
      formRule: {
        settlementPrice: [{ required: true, message: "Please enter 结算price" }],
        pointsGoodsCategoryId: [{ required: true, message: "Please select积分Goods分类" }],
        points: [{ required: true, message: "Please enter 兑换积分" }],
        activeStock: [{ required: true, message: "Please enter 库存" }],
      },
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
    };
  },
  async mounted() {
    await this.getCategory();
    // 如果id不为空则查询信息
    if (this.id) {
      this.getData();
    }
  },
  methods: {
    // 分类
    changeCategory(v){
      console.log(v);
      this.pointsGoodsCategoryId=v.value
      this.pointsGoodsCategoryName=v.label
    },
    // Close当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "edit-points-goods");
      localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
      this.$router.go(-1);
    },
    // 获取Goods数据
    getData() {
      getPointsGoodsById(this.id).then((res) => {
        if (res.success) {
          let data = res.result;
          this.form = data;
          data.rangeTime = [];
          if (data.startTime && data.endTime) {
            data.rangeTime.push(new Date(data.startTime), new Date(data.endTime));
          }
        }
      });
    },
    // 获取分类
    async getCategory() {
      let res = await getPointsGoodsCategoryList();
      this.categoryList = res.result.records;
    },
    /** Save */
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const start = this.$options.filters.unixToDate(this.form.rangeTime[0] / 1000);
          const end = this.$options.filters.unixToDate(this.form.rangeTime[1] / 1000);
          this.form.startTime = start;
          this.form.endTime = end;
          this.submitLoading = true;
          let params={
            ...this.form,
            pointsGoodsCategoryId: this.pointsGoodsCategoryId,
            pointsGoodsCategoryName:this.pointsGoodsCategoryName
          }
          updatePointsGoods(params).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("积分Goodsmodifysuccess");
              this.closeCurrentPage();
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*编辑基本信息*/
.el-form {
  padding-bottom: 80px;

  .el-form-item {
    width: 100%;
    color: gray;
    text-align: left;
  }
}

/*平铺*/
div.base-info-item > div {
  margin-left: 5%;
}

div.base-info-item {
  margin-bottom: 10px;

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

  .form-item-view {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding-left: 80px;

    .shop-category-text {
      font-size: 12px;
    }
  }

  .item-goods-properts-row {
    display: flex;
    flex-direction: row;
    word-break: break-all;
    white-space: normal;
    width: 300px;
    height: 100px;
  }

  .item-goods-properts {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .form-item {
    display: flex;
    align-items: center;
  }

  /** 审核信息-拒绝原因 */
  .auth-info {
    color: red;
  }

  .el-form-item {
    width: 30%;
    min-width: 300px;
  }

  .goods-name-width {
    width: 50%;
    min-width: 300px;
  }

  .el-form-item__content {
    margin-left: 120px;
    text-align: left;
  }

  p.goods-group-manager {
    padding-left: 7.5%;
    text-align: left;
    color: #999;
    font-size: 13px;
  }

  /*teatarea*/
  /deep/ .el-textarea {
    width: 150%;
  }

  .seo-text {
    width: 150%;
  }
}

/*Goods描述*/
.goods-intro {
  line-height: 40;
}

/** 底部步骤 */
.footer {
  width: 100%;
  padding: 10px;
  background-color: #ffc;
  position: fixed;
  bottom: 0px;
  right: 0;
  text-align: center;
  z-index: 9999;
}

/*图片上传组件第一张图设置封面*/
.goods-images {
  /deep/ li.el-upload-list__item:first-child {
    position: relative;
  }

  /deep/ li.el-upload-list__item:first-child:after {
    content: "封";
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    position: absolute;
    left: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    padding-top: 6px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  }
}

.el-form-item__label {
  word-break: break-all;
}

.step-view {
  width: 33%;
  height: 40px;
  font-size: 19px;
  text-align: center;
  display: flex;
  background-color: #fff;
  justify-content: center;
  align-items: center;
}

.page {
  margin-top: 2vh;
  margin-bottom: 5vh;
}
</style>
