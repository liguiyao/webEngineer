<template>
  <div>
    <Card>
      <Form ref="form" :model="form" :label-width="120" :rules="formRule">
        <div class="base-info-item">
          <h4>活动信息</h4>
          <div class="form-item-view">
            <FormItem label="活动名称" prop="promotionName">
              <Input
                type="text"
                v-model="form.promotionName"
                placeholder="Please enter 活动名称"
                clearable
                style="width: 260px"
              />
            </FormItem>
            <FormItem label="活动时间">
              <DatePicker
                type="datetimerange"
                :options="options"
                v-model="rangeTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="Please select活动时间"
                style="width: 260px"
              >
              </DatePicker>
            </FormItem>

            <FormItem label="coupon活动类型" prop="couponActivityType">
              <RadioGroup
                type="button"
                button-style="solid"
                v-model="form.couponActivityType"
              >
                <Radio label="REGISTERED">新人发券</Radio>
                <Radio label="SPECIFY">精确发券</Radio>
                <Radio label="INVITE_NEW">邀新赠券</Radio>
                <Radio label="AUTO_COUPON">自动赠券</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              label="领取频率"
              v-if="form.couponActivityType === 'AUTO_COUPON'"
            >
            <RadioGroup
                type="button"
                button-style="solid"
                v-model="form.couponFrequencyEnum"
              >
                <Radio label="DAY">每日一次</Radio>
                <Radio label="WEEK">每周一次</Radio>
                <Radio label="MONTH">每月一次</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              label="活动范围"
              prop="activityScope"
              v-if="form.couponActivityType === 'SPECIFY'"
            >
              <RadioGroup type="button" button-style="solid" v-model="form.activityScope">
                <Radio label="ALL">全部会员</Radio>
                <Radio label="DESIGNATED">指定会员</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              label="select会员"
              prop="scopeType"
              v-if="
                form.couponActivityType === 'SPECIFY' &&
                form.activityScope === 'DESIGNATED'
              "
            >
              <Button type="primary" icon="ios-add" @click="addVip" ghost
                >select会员</Button
              >
              <div style="margin-top: 24px" v-if="form.activityScope == 'DESIGNATED'">
                <Table border :columns="userColumns" :data="this.selectedMember"> </Table>
              </div>
            </FormItem>
          </div>
          <h4>配置coupon</h4>
          <div class="form-item-view">
            <FormItem label="selectcoupon" prop="scopeType">
              <Button type="primary" :loading="submitLoading" @click="showSelector"
                >selectcoupon</Button
              >
            </FormItem>
            <FormItem label="赠送配置" prop="scopeType">
              <Table border :columns="columns" :data="this.selectCouponList">
                <template slot="sendNum" slot-scope="scope">
                  <Input
                    type="text"
                    v-model="form.couponActivityItems[scope.index].num"
                    placeholder="赠送Quantity"
                  />
                  <Input
                    type="text"
                    v-model="form.couponActivityItems[scope.index].couponId"
                    v-show="false"
                  />
                </template>
              </Table>
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
    <Modal
      @on-ok="
        () => {
          this.showCouponSelect = false;
        }
      "
      @on-cancel="
        () => {
          this.showCouponSelect = false;
        }
      "
      v-model="showCouponSelect"
      width="80%"
    >
      <couponTemplate
        :checked="true"
        :selectedList="selectCouponList"
        getType="ACTIVITY"
        promotionStatus="START"
        @selected="selectedCoupon"
      />
    </Modal>

    <Modal width="1200" v-model="checkUserList">
      <userList
        v-if="checkUserList"
        @callback="callbackSelectUser"
        :selectedList="selectedMember"
        ref="memberLayout"
      />
    </Modal>
  </div>
</template>

<script>
import couponTemplate from "@/views/promotions/coupon/coupon";
import userList from "@/views/member/list/index";
import { saveActivityCoupon } from "@/api/promotion";
import { promotionsScopeTypeRender } from "@/utils/promotions";

export default {
  name: "add-coupon-activity",
  components: {
    couponTemplate,
    userList,
  },
  data() {
    return {
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      showCouponSelect: false, //显示couponselect框
      rangeTime: "", //时间区间
      checkUserList: false, //会员select器
      selectedMember: [], //select的会员
      form: {
        promotionName: "", //活动名称
        activityScope: "ALL", //活动范围 ，default全体发券
        couponActivityType: "REGISTERED", //触发活动方式 default新人赠券
        startTime: "", //开始时间
        endTime: "", //结束时间
        memberDTOS: [], //指定会员范围
        couponActivityItems: [], //Coupon list
        couponFrequencyEnum:"", //select周期
      },
      submitLoading: false, // 添加或editSubmitstate
      selectCouponList: [], //select的Coupon list
      formRule: {
        promotionName: [{ required: true, message: "活动名称不能为空" }],
        rangeTime: [{ required: true, message: "Please select活动有效期" }],
        description: [{ required: true, message: "Please enter 范围描述" }],
      },
      // 用户表格
      userColumns: [
        {
          title: "用户名称",
          key: "nickName",
          minWidth: 120,
        },
        {
          title: "Phone number",
          key: "mobile",
          render: (h, params) => {
            return h("div", params.row.mobile || "暂未enter ");
          },
        },
        {
          title: "最后Login时间",
          key: "lastLoginDate",
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
                    this.delUser(params.index);
                  },
                },
              },
              "delete"
            );
          },
        },
      ],
      //coupon表格
      columns: [
        {
          title: "coupon名称",
          key: "couponName",
          minWidth: 120,
        },
        {
          title: "品类描述",
          key: "scopeType",
          width: 120,
          render: (h, params) => {
            return promotionsScopeTypeRender(h, params);
          },
        },
        {
          title: "面额/off扣",
          key: "couponName",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.price) {
              return h("div", this.$options.filters.unitPrice(params.row.price, "RM"));
            } else {
              return h("div", params.row.couponDiscount + "off");
            }
          },
        },

        {
          title: "赠送Quantity",
          type: "template",
          slot: "sendNum",
          minWidth: 120,
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
                    this.delCoupon(params.index);
                  },
                },
              },
              "delete"
            );
          },
        },
      ],
    };
  },
  methods: {
    // Back已select的用户
    callbackSelectUser(val) {
      // 每次将Back的数据回调判断
      let findUser = this.selectedMember.find((item) => {
        return item.id === val.id;
      });
      // 如果没有则添加
      if (!findUser) {
        this.selectedMember.push(val);
      } else {
        // 有重复数据就delete
        this.selectedMember.map((item, index) => {
          if (item.id === findUser.id) {
            this.selectedMember.splice(index, 1);
          }
        });
      }
      this.reSelectMember();
    },

    // deleteselect的会员
    delUser(index) {
      this.selectedMember.splice(index, 1);
      this.reSelectMember();
    },
    //更新select的会员
    reSelectMember() {
      this.form.memberDTOS = this.selectedMember.map((item) => {
        return {
          nickName: item.nickName,
          id: item.id,
        };
      });
    },
    /**
     * Backcoupon*/
    selectedCoupon(val) {
      this.selectCouponList = val;
      this.reSelectCoupon();
    },
    // deleteselect的coupon
    delCoupon(index) {
      this.selectCouponList.splice(index, 1);
      this.reSelectCoupon();
    },
    reSelectCoupon() {
      // 清空原有数据
      this.form.couponActivityItems = this.selectCouponList.map((item) => {
        return {
          num: 1,
          couponId: item.id,
        };
      });
    },
    // 添加指定用户
    addVip() {
      this.checkUserList = true;
      this.$nextTick(() => {
        this.$refs.memberLayout.selectedMember = true;
      });
    },
    //显示couponselect框
    showSelector() {
      this.showCouponSelect = true;
    },
    /** Save平台coupon */
    handleSubmit() {
      if(this.form.couponFrequencyEnum !== ''){
        console.log(this.activityScope)
        if(this.form.activityScope == 'ALL'){
          this.form.startTime = this.$options.filters.unixToDate(this.rangeTime[0] / 1000);
          this.form.endTime = this.$options.filters.unixToDate(this.rangeTime[1] / 1000);

          this.$refs.form.validate((valid) => {
            if (valid) {
              const params = JSON.parse(JSON.stringify(this.form));
              this.submitLoading = true;
              // 添加 避免edit后传入id等数据 记得delete
              delete params.id;
              saveActivityCoupon(params).then((res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("coupon活动创建success");
                  this.closeCurrentPage();
                }
              });
            }
          });
        }else {
          this.$Message.info('自动发券只能全用户发送')
          this.form.couponActivityType = 'SPECIFY'
          this.form.activityScope = 'ALL'
        }
      }else{
      this.form.startTime = this.$options.filters.unixToDate(this.rangeTime[0] / 1000);
      this.form.endTime = this.$options.filters.unixToDate(this.rangeTime[1] / 1000);

      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));
          this.submitLoading = true;
          // 添加 避免edit后传入id等数据 记得delete
          delete params.id;
          saveActivityCoupon(params).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("coupon活动创建success");
              this.closeCurrentPage();
            }
          });
        }
      });
      }

    },
    // Close当前Page面
    closeCurrentPage() {
      this.$store.commit("removeTag", "add-platform-coupon");
      localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
      this.$router.go(-1);
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
</style>
