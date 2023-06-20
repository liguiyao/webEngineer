<template>
  <div class="wrapper">
    <card _Title="My distribution" />
    <!-- 分销Apply   -->

    <div v-if="status === 0">
      <Alert type="warning">Distributor application</Alert>
      <Form ref="form" :model="applyForm" :rules="rules">
        <FormItem label="Name" prop="name">
          <Input v-model="applyForm.name"></Input>
        </FormItem>
        <FormItem label="Id card" prop="idNumber">
          <Input v-model="applyForm.idNumber"></Input>
        </FormItem>
        <FormItem label="Bank account" prop="settlementBankBranchName">
          <Input v-model="applyForm.settlementBankBranchName"></Input>
        </FormItem>
        <FormItem label="Account name" prop="settlementBankAccountName">
          <Input v-model="applyForm.settlementBankAccountName"></Input>
        </FormItem>
        <FormItem label="Account number" prop="settlementBankAccountNum">
          <Input v-model="applyForm.settlementBankAccountNum"></Input>
        </FormItem>

        <FormItem>
          <Button type="primary" :loading="applyLoading" @click="apply"
            >Submit</Button
          >
        </FormItem>
      </Form>
    </div>
    <!-- 分销审核 -->
    <div v-if="status === 1">
      <Alert type="success">
        Your submission is being reviewed
        <template slot="desc"
          >After submitting the certification application, the staff will complete the verification within three working days</template
        >
      </Alert>
    </div>
    <!-- 分销提现、Goods、订单 -->
    <div v-if="status === 2">
      <div class="tips">

          <p>A distribution order is generated after the distribution line payment is made</p>
          <p>
            Frozen amount: The amount withdrawn by the user is the frozen amount. The frozen amount will be deducted after the approval, and the frozen amount will be returned to the withdrawal amount after the rejection
          </p>
          <p>Withdrawable amount: Distribution order commission T+1 can be changed into withdrawable amount after thawing</p>

      </div>

      <div class="box">
        <div class="mb_20 account-price">
          <span class="subTips">Available for withdrawal：</span>
          <span class="fontsize_48 global_color"
            >RM{{ result.canRebate | unitPrice }}</span
          >
          <span class="subTips">Frozen amount：</span>
          <span class="">RM{{ result.commissionFrozen | unitPrice }}</span>
          <span class="subTips">Total amount of rebate：</span>
          <span class="">RM{{ result.rebateTotal | unitPrice }}</span>
          <Button
            type="primary"
            size="small"
            class="ml_20"
            @click="withdrawApplyModal = true"
            >Application for withdrawal</Button
          >
        </div>
      </div>
      <Tabs :value="tabName" @on-click="tabPaneChange">
        <TabPane label="Selected goods" name="goodsChecked">
          <Table stripe :columns="goodsColumns" :data="goodsData.records">
            <template slot-scope="{ row }" slot="name">
              <div
                class="goods-msg"
                @click="
                  linkTo(
                    `/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}`
                  )
                "
              >
                <img
                  style="vertical-align: top"
                  :src="row.thumbnail"
                  width="60"
                  height="60"
                  alt=""
                />&nbsp; {{ row.goodsName }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span> RM{{ row.price | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="commission">
              <span> RM{{ row.commission | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                type="success"
                size="small"
                style="margin-right: 5px"
                @click="fenxiao(row)"
                >Distribute goods</Button
              >
              <Button
                type="error"
                size="small"
                @click="selectGoods(row.id, false)"
                >deselect</Button
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="params.pageNumber"
              :total="goodsData.total"
              :page-size="params.pageSize"
              @on-change="changePage"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
        <TabPane label="Unselected goods" name="goodsUncheck">
          <Table stripe :columns="goodsColumns" :data="goodsData.records">
            <template slot-scope="{ row }" slot="name">
              <div
                class="goods-msg"
                @click="
                  linkTo(
                    `/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}`
                  )
                "
              >
                <img
                  style="vertical-align: top"
                  :src="row.thumbnail"
                  width="60"
                  height="60"
                  alt=""
                />&nbsp; {{ row.goodsName }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span> RM{{ row.price | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="commission">
              <span> RM{{ row.commission | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="selectGoods(row.id, true)"
                >Select goods</Button
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="params.pageNumber"
              :total="goodsData.total"
              :page-size="params.pageSize"
              @on-change="changePage"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
        <TabPane label="Withdrawal record" name="log">
          <Table stripe :columns="logColumns" :data="logData.records">
            <template slot-scope="{ row }" slot="sn">
              <span>{{ row.sn }}</span>
            </template>
            <template slot-scope="{ row }" slot="time">
              <span>{{ row.createTime }}</span>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span
                v-if="row.distributionCashStatus == 'VIA_AUDITING'"
                style="color: green"
              >
                +RM{{ row.price | unitPrice }}</span
              >
              <span v-else style="color: red">
                -RM{{ row.price | unitPrice }}</span
              >
            </template>
            <template slot-scope="{ row }" slot="status">
              <span>
                {{
                  row.distributionCashStatus == "APPLY"
                    ? "processed"
                    : row.distributionCashStatus == "VIA_AUDITING"
                    ? "pass"
                    : "reject"
                }}</span
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="logParams.pageNumber"
              :total="logData.total"
              :page-size="logParams.pageSize"
              @on-change="changePageLog"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <!-- 未开放 -->
    <div v-if="status === 3">
      <Alert type="error">
        The distribution function is not enabled
        <template slot="desc"
          >After submitting the certification application, the staff will complete the verification within three working days</template
        >
      </Alert>
    </div>

    <Modal v-model="withdrawApplyModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>Amount withdrawn</span>
      </p>
      <div>
        <Input v-model="withdrawPrice" size="large" number maxlength="9"
          ><span slot="append">ringgit</span></Input
        >
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" size="large" @click="withdraw">Withdraw cash</Button>
      </div>
    </Modal>
    <Modal v-model="qrcodeShow" title="分销Goods" width="800">
      <Alert type="warning"> Download QR code or copy the link to share the product </Alert>
      <div style="width: 200px; height: 200px; border: 1px solid #eee">
        <vue-qr
          :text="qrcode"
          :callback="qrcodeData"
          :margin="0"
          colorDark="#000"
          colorLight="#fff"
          :size="200"
        ></vue-qr>
        <Button class="download-btn" type="success" @click="downloadQrcode"
          >Download QR code</Button
        >
      </div>
      <div class="mt_10">
        Commodity link：<Input style="width: 400px" v-model="qrcode"></Input>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  distribution,
  applyDistribution,
  distCash,
  distCashHistory,
  getDistGoodsList,
  selectDistGoods,
} from "@/api/member.js";
import { IDCard } from "@/plugins/RegExp.js";
import { checkBankno } from "@/plugins/Foundation";
import vueQr from "vue-qr";
export default {
  name: "Distribution",
  components: { vueQr },
  data() {
    return {
      status: 0, // Apply  state，0为未Apply   1 Apply  中 2 Apply  完成 3 功能暂未Opening
      applyForm: {}, // Apply  表单
      rules: {
        // 验证规则
        name: [{ required: true, message: "Please enter  your real name" }],
        idNumber: [
          { required: true, message: "Please enter  your ID number" },
          { pattern: IDCard, message: "Please enter  the correct ID number" },
        ],
        settlementBankBranchName: [
          {
            required: true,
            message: "bank account",
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
        ],
        settlementBankAccountName: [
          {
            required: true,
            message: "account name",
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
        ],
        //Bank account
        settlementBankAccountNum: [
          {
            required: true,
            message: "account number is incorrect",
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // 上面有说，Backtrue表示校验pass，Backfalse表示不pass
              // this.$u.test.mobile()就是Backtrue或者false的
              return checkBankno(value);
            },
            message: "account number is incorrect",
          },
        ],
      },
      tabName: "goodsChecked", // 当前所在tab
      result: {}, // 审核结果
      applyLoading: false, // Apply  加载state
      goodsLoading: false, // 列表加载state
      withdrawApplyModal: false, // 提现表单显隐
      withdrawPrice: 0, // 提现金额
      goodsData: {}, // Goods数据
      logData: {}, // 日志数据
      goodsColumns: [
        // Goods表头
        { title: "Goods name", slot: "name", width: 400 },
        { title: "Goods price", slot: "price" },
        { title: "commission", slot: "commission" },
        { title: "operation", slot: "action", minWidth: 120 },
      ],
      logColumns: [
        // 日志表头
        { title: "Number", slot: "sn" },
        { title: "Application time", slot: "time" },
        { title: "Amount withdrawn", slot: "price" },
        { title: "Withdrawal status", slot: "status" },
      ],
      params: {
        // GoodsPlease 求参数
        pageNumber: 1,
        pageSize: 20,
        checked: true,
      },
      orderParams: {
        // 订单GoodsPlease 求参数
        pageNumber: 1,
        pageSize: 20,
      },
      logParams: {
        // 日志参数
        pageNumber: 1,
        pageSize: 20,
        sort: "createTime",
        order: "desc",
      },
      qrcode: "", // 二维码
      qrcodeShow: false, // 显示二维码
      base64Img: "", // base64编码
      goodsNameCurr: "", // 当前分销goods name
    };
  },
  mounted() {
    this.distribution();
  },
  methods: {
    apply() {
      // Apply  成为分销商
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.applyLoading = true;
          applyDistribution(this.form).then((res) => {
            this.applyLoading = false;
            if (res.success) {
              this.$Message.success("The application has been submitted, please wait for administrator review");
              this.status = 1;
            }
          });
        }
      });
    },
    withdraw() {
      // Apply  提现
      distCash({ price: this.withdrawPrice }).then((res) => {
        this.withdrawApplyModal = false;
        this.price = 0;
        if (res.success) {
          this.$Message.success("The application has been submitted, please wait for administrator review");
          this.distribution();
          this.getLog();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    qrcodeData(data64) {
      // 二维码base64address
      this.base64Img = data64;
    },
    downloadQrcode() {
      // 下载二维码
      let a = document.createElement("a"); // 生成一个aringgit素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = this.goodsNameCurr || "photo";
      a.href = this.base64Img; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    },
    tabPaneChange(tab) {
      // tab栏切换
      if (tab === "goodsChecked") {
        this.params.checked = true;
        this.params.pageNUmber = 1;
        this.getGoodsData();
      } else if (tab === "goodsUncheck") {
        this.params.checked = false;
        this.getGoodsData();
      } else if (tab === "log") {
        this.logParams.pageNumber = 1;
        this.getLog();
      }
    },
    changePage(val) {
      // modifyPage码
      this.params.pageNumber = val;
      this.getGoodsData();
    },
    changePageLog(val) {
      // modifyPage码 日志
      this.logParams.pageNumber = val;
      this.getLog();
    },
    selectGoods(id, checked) {
      // selectGoods
      let params = {
        distributionGoodsId: id,
        checked: checked,
      };
      selectDistGoods(params).then((res) => {
        if (res.success) {
          this.$Message.success("Successful operation！");
          this.getGoodsData();
        }
      });
    },
    fenxiao(row) {
      // 分销Goods
      this.qrcode = `${location.origin}/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}&distributionId=${this.result.id}`;
      this.goodsNameCurr = row.goodsName;
      this.qrcodeShow = true;
    },
    getGoodsData() {
      // Goods数据
      getDistGoodsList(this.params).then((res) => {
        if (res.success) this.goodsData = res.result;
      });
    },
    getLog() {
      // 提现历史
      distCashHistory(this.logParams).then((res) => {
        if (res.success) this.logData = res.result;
      });
    },
    distribution() {
      // 获取分销商信息
      distribution().then((res) => {
        if (res.result) {
          this.result = res.result;
          let type = res.result.distributionStatus;

          if (type === "PASS") {
            this.status = 2;
            this.getGoodsData();
          } else if (type === "RETREAT" || type === "REFUSE") {
            this.status = 0;
          } else {
            this.status = 1;
          }
        } else if (!res.data.success && res.data.code === 22000) {
          this.status = 3;
        } else {
          // 没有资格Apply   先去实名认证
          this.status = 0;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  margin: 20px 0;
}
.page-size {
  margin: 15px 0px;
  text-align: right;
}
.account-price {
  font-weight: bold;
}
.subTips {
  margin-left: 10px;
}
.fontsize_48 {
  font-size: 48px;
}
.goods-msg {
  display: flex;
  align-items: center;
  padding: 3px;
  &:hover {
    color: $theme_color;
    cursor: pointer;
  }
}
.download-btn {
  position: relative;
  top: -200px;
  left: 200px;
}
/deep/ .ivu-alert-message {
  p {
    margin: 4px 0;
  }
}
.tips{
  background:#f7f7f7;
  padding: 16px;
  border-radius: .4em;
  >p{
    margin: 6px 0;
  }
}
</style>
