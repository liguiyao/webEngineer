<template>
  <div class="wrapper">
    <Card>
      <Form ref="form" :model="form" :rules="formRule">
        <div class="base-info-item">
          <h4>添加积分Goods</h4>
          <div class="form-item-view">
            <FormItem astyle="width: 100%">
              <div style="display: flex; margin-bottom: 10px">
                <Button type="primary" @click="openSkuList">selectGoods</Button>
                <Button
                  type="error"
                  ghost
                  style="margin-left: 10px"
                  @click="delSelectGoods"
                  >批量delete</Button
                >
              </div>
              <Table
                border
                v-if="showTable"
                :columns="columns"
                :data="promotionGoodsList"
                @on-selection-change="changeSelect"
              >
                <template slot-scope="{ row }" slot="skuId">
                  <div>{{ row.skuId }}</div>
                </template>

                <template slot-scope="{ index }" slot="settlementPrice">
                  <InputNumber
                    :min="0"
                    type="number"
                    v-model="promotionGoodsList[index].settlementPrice"
                  />
                </template>

                <template slot-scope="{ row, index }" slot="pointsGoodsCategory">
                  <Select
                    v-model="promotionGoodsList[index].pointsGoodsCategoryId"
                    :transfer="true"
                    :label-in-value="true"
                    @on-change="
                      (val) => {
                        changeCategory(val, index);
                      }
                    "
                  >
                    <Option
                      v-for="item in categoryList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </template>
                <template slot-scope="{ index }" slot="activeStock">
                  <InputNumber
                    :min="0"
                    type="number"
                    v-model="promotionGoodsList[index].activeStock"
                  />
                </template>
                <template slot-scope="{ index }" slot="points">
                  <InputNumber
                    :min="0"
                    type="number"
                    v-model="promotionGoodsList[index].points"
                  />
                </template>
              </Table>
            </FormItem>

            <FormItem label="兑换时间" prop="time">
              <DatePicker
                type="datetime"
                v-model="form.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="Please select"
                :options="options"
                clearable
                style="width: 200px"
              >
              </DatePicker>
              -
              <DatePicker
                type="datetime"
                v-model="form.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                :options="options"
                placeholder="Please select"
                clearable
                style="width: 200px"
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
import { addPointsGoods, getPointsGoodsCategoryList } from "@/api/promotion";
import { regular } from "@/utils";
import skuSelect from "@/components/lili-dialog";
export default {
  name: "addPoinsGoods",
  components: {
    skuSelect,
  },
  data() {
    const isLtEndDate = (rule, value, callback) => {
      if (new Date(value).getTime() > new Date(this.form.endTime).getTime()) {
        callback(new Error());
      } else {
        callback();
      }
    };
    const isGtStartDate = (rule, value, callback) => {
      if (new Date(value).getTime() < new Date(this.form.startTime).getTime()) {
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      form: {
        promotionGoodsList: [], // 活动Goods列表
      },
      showTable: true,
      promotionGoodsList: [], // 活动Goods列表
      categoryList: [], // 分类列表
      submitLoading: false, // 添加或编辑Submit状态
      selectedGoods: [], // 已选Goods列表，便于delete
      formRule: {
        startTime: [
          {
            required: true,
            type: "date",
            message: "Please select开始时间",
          },
          {
            trigger: "change",
            message: "开始时间要小于结束时间",
            validator: isLtEndDate,
          },
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "Please select结束时间",
          },
          {
            trigger: "change",
            message: "结束时间要大于开始时间",
            validator: isGtStartDate,
          },
        ],
        discount: [
          { required: true, message: "Please enter off扣" },
          {
            pattern: regular.discount,
            message: "Please enter 0-10的数字,可有一位小数",
          },
        ],
        sellerCommission: [
          { required: true, message: "Please enter 店铺承担比例" },
          { pattern: regular.rate, message: "Please enter 0-100的正整数" },
        ],
        publishNum: [
          { required: true, message: "Please enter 发放Quantity" },
          { pattern: regular.Integer, message: "Please enter 正整数" },
        ],
        couponLimitNum: [
          { required: true, message: "Please enter 领取限制" },
          { pattern: regular.Integer, message: "Please enter 正整数" },
        ],
        description: [{ required: true, message: "Please enter 范围描述" }],
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
          minWidth: 120,
          render: (h, params) => {
            return h("div", params.row.goodsName);
          },
        },
        {
          title: "SKU编码",
          slot: "skuId",
          minWidth: 120,
        },
        {
          title: "store name",
          key: "storeName",
          minWidth: 60,
          render: (h, params) => {
            return h("div", params.row.storeName);
          },
        },
        {
          title: "Goodsprice",
          key: "price",
          minWidth: 40,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.price, "RM")
            );
          },
        },
        {
          title: "库存",
          key: "quantity",
          minWidth: 20,
          render: (h, params) => {
            return h("div", params.row.quantity);
          },
        },
        {
          title: "结算price",
          slot: "settlementPrice",
          minWidth: 40,
        },
        {
          title: "分类",
          slot: "pointsGoodsCategory",
          minWidth: 60,
        },
        {
          title: "活动库存",
          slot: "activeStock",
          minWidth: 40,
        },
        {
          title: "兑换积分",
          slot: "points",
          minWidth: 40,
        },
        {
          title: "operation",
          key: "action",
          minWidth: 50,
          align: "center",
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
    await this.getCategory();
  },
  methods: {
    // 获取Goods分类
    async getCategory() {
      let res = await getPointsGoodsCategoryList();
      this.categoryList = res.result.records;
    },
    /** Save积分Goods */
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = this.promotionGoodsList;
          const start = this.$options.filters.unixToDate(this.form.startTime / 1000);
          const end = this.$options.filters.unixToDate(this.form.endTime / 1000);

          if (!params || params.length == 0) {
            this.$Modal.warning({ title: "Tips", content: "Please select指定Goods" });
            return;
          }

          this.submitLoading = true;
          params = params.map((j) => {
            j.startTime = start;
            j.endTime = end;
            return j;
          });
          addPointsGoods(params).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("积分Goods创建success");
              this.closeCurrentPage();
            }
          });
        }
      });
    },
    // Close当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "add-points-goods");
      localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
      this.$router.go(-1);
    },
    // select分类
    changeCategory(val, index) {
      this.promotionGoodsList[index].pointsGoodsCategoryName = val.label;
    },
    // 变更选中状态
    changeSelect(e) {
      // 已选Goods批量select
      this.selectedGoods = e;
    },
    delSelectGoods() {
      // 多选deleteGoods
      if (this.selectedGoods.length <= 0) {
        this.$Message.warning("您还未select要delete的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete所选Goods吗?",
        onOk: () => {
          let ids = [];
          this.selectedGoods.forEach(function (e) {
            ids.push(e.skuId);
          });
          this.promotionGoodsList = this.promotionGoodsList.filter((item) => {
            return !ids.includes(item.skuId);
          });
        },
      });
    },
    delGoods(index) {
      // deleteGoods
      this.promotionGoodsList.splice(index, 1);
    },
    openSkuList() {
      // 显示Goodsselect器
      this.$refs.skuSelect.open("goods");
      let data = JSON.parse(JSON.stringify(this.promotionGoodsList));
      data.forEach((e) => {
        e.id = e.skuId;
      });
      this.$refs.skuSelect.goodsData = data;
    },
    selectedGoodsData(item) {
      // 回显已选Goods
      let list = [];
      item.forEach((e) => {
        const obj = {
          settlementPrice: e.settlementPrice || 0,
          pointsGoodsCategoryId: e.pointsGoodsCategoryId || 0,
          pointsGoodsCategoryName: e.pointsGoodsCategoryName || "",
          activeStock: e.activeStock || 1,
          points: e.points || 1,
          skuId: e.id,
          goodsId: e.goodsId,
          originalPrice: e.price || 0,
          thumbnail: e.thumbnail || "",
          goodsName: e.goodsName || "",
          quantity: e.quantity || "",
          storeName: e.storeName || "",
          price: e.price || ""
        };
        list.push(obj);
      });
      this.promotionGoodsList = list;
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
.wrapper {
  min-height: 800px;
}
</style>
