<template>
  <div class="new-pintuan">
    <Card>
      <Form ref="form" :model="form" :label-width="130" :rules="formValidate">
        <FormItem label="活动名称" prop="promotionName" :label-width="130">
          <Input v-model="form.promotionName" clearable style="width: 260px" maxlength="25" />
          <div style="color: #cccccc">
            活动名称将显示在对人拼团活动列表中，方便商家管理使用，最多输入25个字符
          </div>
        </FormItem>
        <FormItem label="活动时间" prop="rangeTime">
          <DatePicker type="datetimerange" v-model="form.rangeTime" format="yyyy-MM-dd HH:mm:ss" placeholder="Please select" :options="options" style="width: 260px">
          </DatePicker>
        </FormItem>

        <FormItem label="参团人数" prop="requiredNum" :label-width="130">
          <Input v-model="form.requiredNum" style="width: 260px" max="8">
          <span slot="append">人</span>
          </Input>
          <span style="color: #cccccc">参团人数不少于2人，不得超过10人。</span>
        </FormItem>
        <FormItem label="限购Quantity" prop="limitNum" :label-width="130">
          <Input v-model="form.limitNum" type="number" style="width: 260px">
          <span slot="append">件/人</span>
          </Input>
          <span style="color: #cccccc">如果设置为0则视为不限制quantity</span>
        </FormItem>
        <FormItem label="虚拟成团" prop="fictitious">
          <RadioGroup type="button" button-style="solid" v-model="form.fictitious">
            <Radio title="Opening" :label="1">
              <span>Opening</span>
            </Radio>
            <Radio title="Close" :label="0">
              <span>Close</span>
            </Radio>
          </RadioGroup>
          <br />
          <span style="color: #cccccc">Opening虚拟成团后，24小时人数未full的团，系统将会模拟匿名买家凑full人数，使该团成团；您只需要对已付款参团的真实买家发货；建议合理Opening以提高</span>
        </FormItem>
        <FormItem label="拼团规则" prop="pintuanRule">
          <Input v-model="form.pintuanRule" type="textarea" :rows="4" clearable maxlength="255" style="width: 260px" />
          <br />
          <span style="color: #cccccc">拼团规则描述不能为空且不能大于255个字，会在WAP拼团详情页面显示</span>
        </FormItem>
      </Form>
      <div>
        <Button type="text" @click="closeCurrentPage">Back</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">Submit</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import { savePintuan, editPintuan, getPintuanDetail } from "@/api/promotion";
export default {
  data() {
    return {
      id: this.$route.query.id, // 拼团id
      form: {
        // 添加或编辑表单对象初始化数据
        promotionName: "",
        promotionTitle: "",
        pintuanRule: "",
        requiredNum: "",
        fictitious: 0,
        limitNum: "",
        startTime: "",
        endTime: "",
      },
      // 表单验证规则
      formValidate: {
        promotionName: [{ required: true, message: "活动名称不能为空" }],
        requiredNum: [
          { required: true, message: "参团人数不能为空" },
          {
            pattern: /^([2-9]|10)?$/,
            message: "参团人数不合法",
          },
        ],
        limitNum: [
          { required: true, message: "限购数不能为空" },
          {
            pattern: /^(0|[1-9]\d?|100)$/,
            message: "限购数不合法",
          },
        ],
        rangeTime: [{ required: true, message: "Please select活动时间" }],
      },
      submitLoading: false, // 添加或编辑Submit状态
      options: {
        // 不可选取时间
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
    };
  },
  mounted() {
    if (this.id) {
      this.getDetail();
    }
  },

  methods: {
    // Close当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "new-pintuan");
      localStorage.storeOpenedList = JSON.stringify(
        this.$store.state.app.storeOpenedList
      );
      this.$router.go(-1);
    },
    // Submit活动
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          let params = JSON.parse(JSON.stringify(this.form));
          params.fictitious
            ? (params.fictitious = true)
            : (params.fictitious = false);
          params.startTime = this.$options.filters.unixToDate(
            this.form.rangeTime[0] / 1000
          );

          params.endTime = this.$options.filters.unixToDate(
            this.form.rangeTime[1] / 1000
          );
          if (params.startTime === "" || params.endTime === "") {
            this.$Message.error("活动时间不能为空");
            this.submitLoading = false;
            return;
          }
          if (params.startTime < new Date()) {
            this.$Message.error("拼团活动开始时间不能小于当前时间");
            this.submitLoading = false;
            return;
          }

          delete params.rangeTime;
          if (!this.id) {
            // 添加 避免编辑后传入id等数据 记得delete
            delete params.id;
            savePintuan(params).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("拼团活动发布success");
                this.closeCurrentPage();
              }
            });
          } else {
            // 编辑
            if (params.promotionGoodsList == "")
              delete params.promotionGoodsList;
            editPintuan(params).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.closeCurrentPage();
              }
            });
          }
        }
      });
    },
    // 获取详情
    getDetail() {
      getPintuanDetail(this.id).then((res) => {
        if (res.success) {
          const data = res.result;
          data.rangeTime = [];
          data.rangeTime.push(new Date(data.startTime), new Date(data.endTime));
          this.form = data;
          // 此处将值转换为 1 true ，0 false 不然ivew radio组件会报错
          this.form.fictitious ? this.$set(this.form, "fictitious", 1)  : this.$set(this.form, "fictitious", 0);

       }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .ivu-form-item {
  padding: 18px 10px !important;
}
</style>
