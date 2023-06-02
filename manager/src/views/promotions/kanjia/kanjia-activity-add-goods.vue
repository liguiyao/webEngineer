<template>
  <div>
    <Card>
      <Form ref="form" :model="form" :label-width="120" :rules="formRule">
        <div class="base-info-item">
          <div class="form-item-view">
            <h4>Goods details</h4>

            <FormItem label="selectGoods" prop="scopeType">
              <Button type="primary" @click="openSkuList">selectGoods</Button>
              <!-- <Button type="error" ghost style="margin-left: 10px" @click="delSelectGoods">批量delete
              </Button> -->
            </FormItem>

            <FormItem astyle="width: 100%">
              <Table
                border
                :columns="columns"
                :data="form.promotionGoodsList"
                @on-selection-change="changeSelect"
              >
                <template slot-scope="{ row }" slot="skuId">
                  <div>{{ row.skuId }}</div>
                </template>

                <template slot-scope="{ index }" slot="settlementPrice">
                  <InputNumber
                    :min="0"
                    v-model="form.promotionGoodsList[index].settlementPrice"
                  />
                </template>
                <template slot-scope="{ index }" slot="lowestPrice">
                  <InputNumber
                    :min="0"
                    v-model="form.promotionGoodsList[index].lowestPrice"
                  />
                </template>
                <template slot-scope="{ index }" slot="highestPrice">
                  <InputNumber
                    :min="0"
                    v-model="form.promotionGoodsList[index].highestPrice"
                  />
                </template>
                <template slot-scope="{ index }" slot="stock">
                  <InputNumber :min="0" v-model="form.promotionGoodsList[index].stock" />
                </template>
              </Table>
            </FormItem>
            <FormItem label="活动时间" prop="rangeTime">
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
            <div>
              <Button type="text" @click="closeCurrentPage">Back</Button>
              <Button type="primary" :loading="submitLoading" @click="handleSubmit"
                >Submit</Button
              >
            </div>
          </div>
        </div>
      </Form>
    </Card>
    <sku-select ref="skuSelect" @selectedGoodsData="selectedGoodsData"></sku-select>
  </div>
</template>

<script>
import { saveKanJiaActivityGoods } from "@/api/promotion";
import { regular } from "@/utils";
import skuSelect from "@/components/lili-dialog";

export default {
  name: "add-kanjia-activity-goods",
  components: {
    skuSelect,
  },
  watch: {},
  data() {
    return {
      modalType: 0, // 是否编辑
      form: {
        promotionGoodsList: [], // 活动Goods列表
      },
      id: this.$route.query.id, // 砍价活动id
      submitLoading: false, // 添加或编辑Submit状态
      selectedGoods: [], // 已选Goods列表，便于delete
      promotionGoodsList: [], // 活动Goods列表
      formRule: {
        rangeTime: [{ required: true, message: "Please select活动时间" }],
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "goods name",
          key: "goodsName",
          tooltip: true,
          minWidth: 100,
        },
        {
          title: "Goodsprice",
          key: "price",
          width: 120,
          render: (h, params) => {
            return h("div", this.$options.filters.unitPrice(params.row.price, "RM"));
          },
        },
        {
          title: "库存",
          key: "quantity",
          width: 100,
        },
        {
          title: "结算price",
          slot: "settlementPrice",
          width: 110,
        },
        {
          title: "最低砍",
          slot: "lowestPrice",
          width: 110,
        },
        {
          title: "最高砍",
          slot: "highestPrice",
          width: 110,
        },
        {
          title: "活动库存",
          slot: "stock",
          width: 110,
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  size: "small",
                  type: "error",
                  ghost: true,
                },
                on: {
                  click: () => {
                    this.delGoods(params.index);
                  },
                },
              },
              "delete"
            );
          },
        },
      ],
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
    };
  },
  async mounted() {
    // 如果id不为空则查询信息
    if (this.id) {
      this.getCoupon();
      this.modalType = 1;
    }
  },
  methods: {
    openSkuList() {
      // 显示Goodsselect器
      this.$refs.skuSelect.open("goods");
      let data = JSON.parse(JSON.stringify(this.promotionGoodsList));
      data.forEach((e) => {
        e.id = e.skuId;
      });
      this.$refs.skuSelect.goodsData = data;
    },

    /** Save砍价活动 */
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));
          if (this.form.rangeTime[0] === "" || this.form.rangeTime[0] === "") {
            this.$Message.error("Please select活动时间");
            return;
          }
          params.startTime = this.$options.filters.unixToDate(
            this.form.rangeTime[0] / 1000
          );
          params.endTime = this.$options.filters.unixToDate(
            this.form.rangeTime[1] / 1000
          );
          delete params.rangeTime;
          let checkResult = true;
          //如果添加活动的时候select了Goods 则对selectgoods参数做一些校验
          if (this.form.promotionGoodsList.length > 0) {
            this.form.promotionGoodsList.forEach((res) => {
              //校验库存参数
              if (res.stock <= 0 || res.stock > res.quantity) {
                checkResult = false;
                this.$Message.error("活动库存不能为0且不能超过Goods库存");
                return;
              }

              // 结算price金额格式校验
              if (!regular.money.test(res.settlementPrice)) {
                checkResult = false;
                this.$Message.error("结算price金额格式不正确");
                return;
              }
              // 结算price金额格式校验
              if (res.settlementPrice < 0 || res.settlementPrice > res.price) {
                checkResult = false;
                this.$Message.error("结算price金额不能为0且不能超过Goodsprice");
                return;
              }
              //最高砍价校验
              if (!regular.money.test(res.highestPrice)) {
                checkResult = false;
                this.$Message.error("最高可砍金额格式错误");
                return;
              }
              if (res.highestPrice <= 0 || res.highestPrice > res.price) {
                checkResult = false;
                this.$Message.error("最高可砍金额不能为0且不能超过Goodsprice");
                return;
              }
              //最低砍价校验
              if (!regular.money.test(res.lowestPrice)) {
                checkResult = false;
                this.$Message.error("最低可砍金额格式错误");
                return;
              }
              if (res.lowestPrice <= 0 || res.lowestPrice > res.price) {
                checkResult = false;
                this.$Message.error("最低可砍金额不能为0");
                return;
              }
              //校验最高最低砍价金额
              if (parseInt(res.lowestPrice) > parseInt(res.highestPrice)) {
                checkResult = false;
                this.$Message.error("最低砍价金额不能大于最高砍价金额");
                return;
              }
            });
          }

          if (!checkResult) {
            return;
          }
          this.submitLoading = true;
          saveKanJiaActivityGoods(params).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("砍价活动modifysuccess");
              this.closeCurrentPage();
            }
          });
        }
      });
    },
    // Close当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "add-kan-jia-goods");
      localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
      this.$router.go(-1);
    },
    openSkuList() {
      // 显示Goodsselect器
      this.$refs.skuSelect.open("goods");
      let data = JSON.parse(JSON.stringify(this.form.promotionGoodsList));
      data.forEach((e) => {
        e.id = e.skuId;
      });
      this.$refs.skuSelect.goodsData = data;
    },
    changeSelect(e) {
      // 已选Goods批量select
      this.selectedGoods = e;
    },
    // delSelectGoods() {
    //   // 多选deleteGoods
    //   if (this.selectedGoods.length <= 0) {
    //     this.$Message.warning("您还未select要delete的数据");
    //     return;
    //   }
    //   this.$Modal.confirm({
    //     title: "确认delete",
    //     content: "您确认要delete所选Goods吗?",
    //     onOk: () => {
    //       let ids = [];
    //       this.selectedGoods.forEach(function (e) {
    //         ids.push(e.id);
    //       });
    //       this.form.promotionGoodsList = this.form.promotionGoodsList.filter(
    //         (item) => {
    //           return !ids.includes(item.id);
    //         }
    //       );
    //     },
    //   });
    // },
    delGoods(index) {
      // deleteGoods
      this.form.promotionGoodsList.splice(index, 1);
    },
    selectedGoodsData(item) {
      // 回显已选Goods
      let list = [];
      item.forEach((e) => {
        list.push({
          settlementPrice: e.settlementPrice || 0,
          purchasePrice: 0,
          lowestPrice: e.lowestPrice || 0,
          highestPrice: e.highestPrice || 0,
          stock: e.stock || 0,
          goodsName: e.goodsName,
          price: e.price,
          originalPrice: e.price,
          quantity: e.quantity,
          storeId: e.storeId,
          storeName: e.storeName,
          skuId: e.id,
        });
      });
      console.warn(list);
      this.form.promotionGoodsList = list;
    },
  },
};
</script>

<style lang="scss" scpoed>
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

.describe {
  font-size: 12px;
  margin-left: 10px;
  color: #999;
}

.effectiveDays {
  font-size: 12px;
  color: #999;

  > * {
    margin: 0 4px;
  }
}

.tips {
  font-size: 12px;
  color: #999;
}
</style>
