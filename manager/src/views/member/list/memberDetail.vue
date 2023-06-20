<template>
  <div>
    <Card style="height: 240px;padding: 12px 12px 0px">
      <div class="head-title">Basic</div>
      <div class="detail-body">
        <div class="ant-col-md-6">
          <div class="info">
            <div class="head-info">
              <Avatar size="large" :src="memberInfo.face"/>
              <div>
                <div class="name" v-if="memberInfo.username && memberInfo.username.length > 15">
                  {{memberInfo.username.slice(0,15)}}...
                </div>
                <div class="name" v-else>
                  {{memberInfo.username}}
                </div>
                <div class="phone">
                  {{memberInfo.mobile}}
                </div>
              </div>
            </div>
            <div class="bottom-info">
              <p>上次Login {{memberInfo.lastLoginDate}}&nbsp;
              <p>
                <i-switch size="large" v-model="memberInfo.disabled" :true-value="true" :false-value="false"
                          @on-change="memberStatusChange">
                  <span slot="open">enable</span>
                  <span slot="close">disable</span>
                </i-switch>
              </p>
            </div>
          </div>
        </div>
        <div class="ant-col-md-6">
          <p class="item">
            <span class="label">nick name：</span>
            <span class="info">{{memberInfo.nickName}}</span>
          </p>
          <p class="item">
            <span class="label">Member name：</span>
            <span class="info">{{memberInfo.username}}</span>
          </p>
          <p class="item">
            <span class="label">Sex：</span>
            <span v-if="memberInfo.sex===1" class="info">男</span>
            <span v-else class="info">女</span>
          </p>
          <p class="item">
            <span class="label">Brithday：</span>
            <span v-if="memberInfo.birthday == null || memberInfo.birthday == 'undefined'">None</span>
            <span v-else class="info">{{memberInfo.birthday}}</span>
          </p>
          <p class="item">
            <span class="label">Location：</span>
            <span v-if="memberInfo.region == null || memberInfo.region =='' || memberInfo.region === 'undefined'"
                  class="info">none</span>
            <span v-else class="info">{{memberInfo.region}}</span>
          </p>
          <p class="item">
            <span class="label">register time：</span>
            <span class="info">{{memberInfo.createTime}}</span>
          </p>
        </div>
      </div>
    </Card>

    <Card class="mt_10">
      <Tabs value="point" @on-click="memberInfoChange">
        <TabPane label="TA point" name="point">
          <div class="pointsTitle" style="justify-content: flex-start; text-align: left;">
            <div style="width: 120px;">
              <div class="points-top-title">
                remaining points
              </div>
              <div class="points-top-text">
                {{memberInfo.point?memberInfo.point:0}}
              </div>
            </div>
          </div>
          <div class="point-data" style="margin-top: -5px">
              <Table
                :loading="loading"
                border
                :columns="pointsColumns"
                :data="pointData"
                class="mt_10"
                ref="table"
              >
              </Table>

            <Row type="flex" justify="end" class="mt_10" style="margin-top: 10px">
              <Page
                :current="pointSearchForm.pageNumber"
                :total="pointTotal"
                :page-size="pointSearchForm.pageSize"
                @on-change="pointChangePage"
                @on-page-size-change="pointChangePageSize"
                :page-size-opts="[10, 20, 50]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </div>
        </TabPane>
        <TabPane label="TA point" name="order" style="min-height: 200px">
          <Row>
            <Form ref="searchForm" :model="orderSearchForm" inline :label-width="70" class="search-form">
              <Form-item label="Order number" prop="orderSn">
                <Input
                  type="text"
                  v-model="orderSearchForm.orderSn"
                  placeholder="Please enter Order number"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="Order status" prop="orderStatus">
                <Select v-model="orderSearchForm.orderStatus" placeholder="Please select" clearable style="width: 200px">
                  <Option value="UNPAID">Unpaid</Option>
                  <Option value="PAID">Paid</Option>
                  <Option value="UNDELIVERED">wait delivered</Option>
                  <Option value="DELIVERED">delivered</Option>
                  <Option value="COMPLETED">completed</Option>
                  <Option value="TAKE">verified</Option>
                  <Option value="CANCELLED">Cancel</Option>
                </Select>
              </Form-item>
              <Form-item label="Payment status" prop="payStatus">
                <Select v-model="orderSearchForm.payStatus" placeholder="Please select" clearable style="width: 200px">
                  <Option value="UNPAID">Unpaid</Option>
                  <Option value="PAID">Paid</Option>
                </Select>
              </Form-item>
              <Form-item label="Order type" prop="orderType">
                <Select v-model="orderSearchForm.orderType" placeholder="Please select" clearable style="width: 200px">
                  <Option value="NORMAL">normal</Option>
                  <Option value="VIRTUAL">virtual</Option>
                  <Option value="GIFT">gift</Option>
                  <Option value="PINTUAN">Group</Option>
                </Select>
              </Form-item>
              <Form-item label="Order source" prop="clientType">
                <Select v-model="orderSearchForm.clientType" placeholder="Please select" clearable style="width: 200px">
                  <Option value="H5">mobile</Option>
                  <Option value="PC">PC</Option>
                  <Option value="WECHAT_MP">Wechat</Option>
                  <Option value="APP">Mobile App</Option>
                  <Option value="UNKNOWN">Unknown</Option>
                </Select>
              </Form-item>
              <Form-item label="Time">
                <DatePicker
                  v-model="selectDate"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  clearable
                  @on-change="selectDateRange"
                  placeholder="select start time"
                  style="width: 200px"
                ></DatePicker>
              </Form-item>
              <Button @click="getOrderData" type="primary" icon="ios-search" class="search-btn">search</Button>
            </Form>
          </Row>
          <div style="min-height: 180px">
            <Table
              :loading="loading"
              border
              :columns="orderColumns"
              :data="orderData"
              ref="table"
              class="mt_10"
            >
            </Table>

            <Row type="flex" justify="end" class="mt_10" style="margin-top: 10px">
              <Page
                :current="orderSearchForm.pageNumber"
                :total="orderTotal"
                :page-size="orderSearchForm.pageSize"
                @on-change="orderChangePage"
                @on-page-size-change="orderChangePageSize"
                :page-size-opts="[10, 20, 50]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </div>
        </TabPane>
        <TabPane label="TADelivery address" name="address">
          <Row class="operation padding-row">
            <Button @click="addMemberAddress" type="primary">Add</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="addressColumns"
            :data="addressData"
            ref="table"
            class="mt_10"
            sortable="custom"
          >
          </Table>

          <Row type="flex" justify="end" class="mt_10" style="margin-top: 10px">
            <Page
              :current="addressSearchForm.pageNumber"
              :total="addressTotal"
              :page-size="addressSearchForm.pageSize"
              @on-change="addressChangePage"
              @on-page-size-change="addressChangePageSize"
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </TabPane>
        <TabPane label="balance" name="wallet">
          <div class="pointsTitle" style="justify-content: flex-start; text-align: left;">
            <div style="min-width: 120px; margin-right:20px">
              <div class="points-top-title">
                Balance
              </div>

              <div class="points-top-text">
                {{memberWalletInfo.memberWallet?memberWalletInfo.memberWallet:0 | unitPrice('RM')}}
              </div>
            </div>
            <div style="min-width: 120px;">
              <div class="points-top-title">
                frozen balance
              </div>
              <div class="points-top-text">
                {{memberWalletInfo.memberFrozenWallet?memberWalletInfo.memberFrozenWallet:0 | unitPrice('RM')}}
              </div>
            </div>
          </div>
          <Table
            :loading="loading"
            border
            :columns="walletColumns"
            :data="walletData"
            ref="table"
            class="mt_10"
          >
          </Table>

          <Row type="flex" justify="end" class="mt_10" style="margin-top: 10px">
            <Page
              :current="walletSearchForm.pageNumber"
              :total="walletTotal"
              :page-size="walletSearchForm.pageSize"
              @on-change="walletChangePage"
              @on-page-size-change="walletChangePageSize"
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </TabPane>
        <TabPane label="invoice" name="receipt">
          <Row>
            <Form ref="searchForm" :model="receiptRecordSearchForm" inline :label-width="70" class="search-form">
              <Form-item label="Order number" prop="orderSn">
                <Input
                  type="text"
                  v-model="receiptRecordSearchForm.orderSn"
                  placeholder="Please enter Order number"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Button @click="getReceiptRecordData" type="primary" icon="ios-search" class="search-btn">search</Button>
            </Form>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="receiptRecordColumns"
            :data="receiptRecordData"
            class="mt_10"
            ref="table"
          >
            <template slot="orderSnSlot" slot-scope="scope">

              <a @click="orderDetail(scope.row.orderSn)">{{scope.row.orderSn}}</a>

            </template>
          </Table>

          <Row type="flex" justify="end" class="mt_10" style="margin-top: 10px">
            <Page
              :current="receiptRecordSearchForm.pageNumber"
              :total="receiptRecordTotal"
              :page-size="receiptRecordSearchForm.pageSize"
              @on-change="walletChangePage"
              @on-page-size-change="walletChangePageSize"
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      :title="addressModalTitle"
      v-model="addressModalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="addressForm" :model="addressForm" :label-width="100" :rules="addressFormValidate">
        <FormItem label="receivername" prop="name">
          <Input v-model="addressForm.name" maxlength="8" clearable style="width: 80%"/>
        </FormItem>
        <FormItem label="receiver phone" prop="mobile">
          <Input v-model="addressForm.mobile" clearable style="width: 80%" maxlength="11"/>
        </FormItem>
        <FormItem label="receiver address" prop="consigneeAddressPath">
          <Input v-model="addressForm.consigneeAddressPath" @on-focus="$refs.liliMap.showMap = true" clearable
                 style="width: 80%"/>
        </FormItem>
        <FormItem label="Full address" prop="detail">
          <Input v-model="addressForm.detail" maxlength="35" clearable style="width: 80%"/>
        </FormItem>
        <FormItem label="Address alias" prop="alias">
          <Input v-model="addressForm.alias" clearable style="width: 80%" maxlength="8"/>
        </FormItem>
        <FormItem label="default" prop="isDefault">
          <RadioGroup type="button" button-style="solid" v-model="addressForm.isDefault">
            <Radio label="1">Yes</Radio>
            <Radio label="0">No</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addressModalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="addressSubmit">Save</Button>
      </div>
    </Modal>
    <liliMap ref="liliMap" @getAddress="getAddress"></liliMap>
  </div>
</template>

<script>
  import region from "@/components/region";
  import * as API_Member from "@/api/member.js";
  import ossManage from "@/views/sys/oss-manage/ossManage";
  import liliMap from "@/components/map/index";
  import * as RegExp from '@/libs/RegExp.js';
  import * as API_Order from "@/api/order.js";

  export default {
    name: "memberDetail",
    components: {
      region,
      ossManage,
      liliMap
    },
    data() {
      return {
        id: "",//会员id
        loading: true, // 表单加载state
        memberInfo: {},//会员信息
        memberWalletInfo: {},//会员预存款信息
        addressModalTitle: "",//会员addressoperation标题
        addressModalVisible: false, //会员addressoperation弹出框
        addressForm: {
          id: "",
          isDefault: "0"

        },//会员addressoperationform
        selectDate: null, // select时间段
        submitLoading: false, // 添加或editSubmitstate
        addressFormValidate: {
          name: [{required: true, message: "receiver name cannot empyt"}],
          mobile: [
            {required: true, message: 'Please enter receiverPhone number'},
            {
              pattern: RegExp.mobile,
              message: 'Please enter correctly phone number'
            }
          ],
          consigneeAddressPath: [{required: true, message: "receiver address cannot empyt"}],
          detail: [{required: true, message: "receiverFull address cannot empyt"}],
          alias: [{required: true, message: "receiver address alias cannot empyt"}],
        },//会员addressoperation表单校验
        //历史积分表格
        pointsColumns: [
          {
            title: "operation content",
            key: "content",
            minWidth: 120,
            tooltip: true
          },
          {
            title: "operation time",
            key: "createTime",
            width: 200
          },
          {
            title: "points",
            key: "beforePoint",
            width: 150,
          },
          {
            title: "points",
            key: "variablePoint",
            width: 150,
            render: (h, params) => {
              if (params.row.pointType == 'INCREASE') {
                return h('div', [
                  h('span', {
                    style: {
                      color: 'green'
                    }
                  }, "+" + params.row.variablePoint),
                ]);
              } else {
                return h('div', [
                  h('span', {
                    style: {
                      color: 'red'
                    }
                  }, '-' + params.row.variablePoint),
                ]);
              }
            }
          },
          {
            title: "points",
            key: "point",
            width: 150,
          },

        ],
        pointData: [],//历史积分数据
        pointTotal: 0,//历史积分总items数
        //历史积分数据查询form
        pointSearchForm: {
          pageNumber: 1, // 当前Page数
          pageSize: 10, // Page面大小
        },
        orderColumns: [
          {
            title: "Order number",
            key: "sn",
            minWidth: 100,
            tooltip: true
          },
          {
            title: "Order amount",
            key: "flowPrice",
            width: 130,
            render: (h, params) => {
              return h("div", this.$options.filters.unitPrice(params.row.flowPrice, 'RM'));
            }
          },
          {
            title: "Order type",
            key: "orderType",
            width: 100,
            render: (h, params) => {
              if (params.row.orderType == "NORMAL") {
                return h('div', [h('span', {}, 'normal'),]);
              } else if (params.row.orderType == "VIRTUAL") {
                return h('div', [h('span', {}, 'virtual'),]);
              } else if (params.row.orderType == "GIFT") {
                return h('div', [h('span', {}, 'gift'),]);
              } else if (params.row.orderType == "PINTUAN") {
                return h('div', [h('span', {}, 'group'),]);
              }
            }
          },
          {
            title: "Source",
            key: "clientType",
            width: 80,render: (h, params) => {
              if (params.row.clientType == "H5") {
                return h("div",{},"mobile");
              }else if(params.row.clientType == "PC") {
                return h("div",{},"PC");
              }else if(params.row.clientType == "WECHAT_MP") {
                return h("div",{},"Wechat");
              }else if(params.row.clientType == "APP") {
                return h("div",{},"Mobile App");
              }
              else{
                return h("div",{},params.row.clientType);
              }
            },
          },
          {
            title: "Order status",
            key: "orderStatus",
            width: 95,
            render: (h, params) => {
              if (params.row.orderStatus == "UNPAID") {
                return h('div', [h('span', {}, 'Unpaid'),]);
              } else if (params.row.orderStatus == "PAID") {
                return h('div', [h('span', {}, 'Paid'),]);
              } else if (params.row.orderStatus == "UNDELIVERED") {
                return h('div', [h('span', {}, 'Wait delivered'),]);
              } else if (params.row.orderStatus == "DELIVERED") {
                return h('div', [h('span', {}, 'DELIVERED'),]);
              } else if (params.row.orderStatus == "COMPLETED") {
                return h('div', [h('span', {}, 'completed'),]);
              } else if (params.row.orderStatus == "TAKE") {
                return h('div', [h('span', {}, 'Verify'),]);
              } else if (params.row.orderStatus == "CANCELLED") {
                return h('div', [h('span', {}, 'Cancel'),]);
              }
            }
          },
          {
            title: "Payment status",
            key: "payStatus",
            width: 95,
            render: (h, params) => {
              if (params.row.payStatus == "UNPAID") {
                return h('div', [h('span', {}, 'Unpaid'),]);
              } else if (params.row.payStatus == "PAID") {
                return h('div', [h('span', {}, 'PAID'),]);
              }
            }
          },
          {
            title: "after sale status",
            key: "groupAfterSaleStatus",
            width: 100,
            render: (h, params) => {
              if (params.row.groupAfterSaleStatus == "NEW") {
                return h('div', [h('span', {}, 'Not Apply  '),]);
              } else if (params.row.groupAfterSaleStatus == "NOT_APPLIED") {
                return h('div', [h('span', {}, 'Not Apply  '),]);
              } else if (params.row.groupAfterSaleStatus == "ALREADY_APPLIED") {
                return h('div', [h('span', {}, 'Apply  '),]);
              } else if (params.row.groupAfterSaleStatus == "EXPIRED") {
                return h('div', [h('span', {}, 'expired'),]);
              }
            }
          },
          {
            title: "Complaint status",
            key: "groupComplainStatus",
            width: 95,
            render: (h, params) => {
              if (params.row.groupComplainStatus == "NEW") {
                return h('div', [h('span', {}, 'Not Apply  '),]);
              } else if (params.row.groupComplainStatus == "NO_APPLY") {
                return h('div', [h('span', {}, 'Not Apply  '),]);
              } else if (params.row.groupComplainStatus == "APPLYING") {
                return h('div', [h('span', {}, 'Applying'),]);
              } else if (params.row.groupComplainStatus == "COMPLETE") {
                return h('div', [h('span', {}, 'completed'),]);
              } else if (params.row.groupComplainStatus == "EXPIRED") {
                return h('div', [h('span', {}, 'EXPIRED'),]);
              } else if (params.row.groupComplainStatus == "CANCEL") {
                return h('div', [h('span', {}, 'CancelComplaint'),]);
              }
            }
          },
          {
            title: "Store",
            key: "storeName",
            width: 120,
            tooltip: true
          },
          {
            title: "Time",
            key: "createTime",
            width: 170,
          },
          {
            title: "operation",
            key: "action",
            align: "center",
            width: 100,
            fixed: "right",
            render: (h, params) => {
              return h("div", {
                style: {
                  display: "flex",
                  justifyContent: "center"
                }
              }, [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.orderDetail(params.row.sn);
                      },
                    },
                  },
                  "View"
                ),
              ]);
            },
          },

        ],
        orderData: [],//订单数据
        orderTotal: 0,//订单总items数
        //TA的订单form
        orderSearchForm: {
          pageNumber: 1, // 当前Page数
          pageSize: 10, // Page面大小
          payStatus: "",
          orderSn: "",
          orderType: "",
        },
        addressColumns: [
          {
            title: "Address alias",
            key: "alias",
            minWidth: 80,
            tooltip: true
          },
          {
            title: "receivername",
            key: "name",
            minWidth: 90,
            tooltip: true
          },
          {
            title: "receiver电话",
            key: "mobile",
            width: 125,
          },

          {
            title: "address",
            key: "consigneeAddressPath",
            minWidth: 160,
            tooltip: true

          },
          {
            title: "Full address",
            key: "detail",
            minWidth: 180,
            tooltip: true
          },
          {
            title: "default",
            key: "isDefault",
            width: 80,
            render: (h, params) => {
              if (params.row.isDefault == "1") {
                return h('div', [
                  h('span', {}, "Yes"),
                ]);
              } else {
                return h('div', [
                  h('span', {}, "No"),
                ]);
              }

            }
          },
          {
            title: "operation",
            key: "action",
            align: "center",
            width: 120,
            fixed: "right",
            render: (h, params) => {
              return h("div", {
                style: {
                  display: "flex",
                  justifyContent: "center"
                }
              }, [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.memberAddressRemove(params.row);
                      },
                    },
                  },
                  "delete"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.editAddress(params.row);
                      },
                    },
                  },
                  "edit"
                ),
              ]);
            },
          },

        ],
        addressData: [],//历史积分数据
        addressTotal: 0,//历史积分总items数
        //TA的Delivery addressform
        addressSearchForm: {
          pageNumber: 1, // 当前Page数
          pageSize: 10, // Page面大小
        },
        //消费记录
        walletColumns: [
          {
            title: "Member name",
            key: "memberName",
            minWidth: 120,
          },
          {
          title: "业务类型",
          key: "serviceType",
          width: 200,
          render: (h, params) => {
            if (params.row.serviceType == "WALLET_WITHDRAWAL") {
              return h("div", [h("span", {}, "Balance Withdraw")]);
            } else if (params.row.serviceType == "WALLET_PAY") {
              return h("div", [h("span", {}, "Balance payment")]);
            } else if (params.row.serviceType == "WALLET_REFUND") {
              return h("div", [h("span", {}, "Balance refund")]);
            } else if (params.row.serviceType == "WALLET_RECHARGE") {
              return h("div", [h("span", {}, "WALLET RECHARGE")]);
            } else {
              return h("div", [h("span", {}, "xxxx")]);
            }
          },
        },
          {
            title: "变动金额",
            key: "money",
            width: 150,
            render: (h, params) => {
              if (params.row.money >0) {
                return h('div', [
                  h('span', {
                    style:{
                      color: 'green'
                    }
                  }, this.$options.filters.unitPrice(params.row.money,'RM')),
                ]);
              } else if (params.row.money < 0) {
                return h('div', [
                  h('span', {
                    style:{
                      color: 'red'
                    }
                  }, this.$options.filters.unitPrice(params.row.money,'RM')),
                ]);
              }
            },
          },
          {
            title: "变动时间",
            key: "createTime",
            width: 170,
          },
          {
            title: "变动明细",
            key: "detail",
            minWidth: 400,
            tooltip: true
          },
        ],
        //TA的余额消费记录
        walletSearchForm: {
          pageNumber: 1, // 当前Page数
          pageSize: 10, // Page面大小
          sort: "createTime", // default排序字段
          order: "desc", // default排序方式
        },
        walletData: [],//历史积分数据
        walletTotal: 0,//历史积分总items数
        //TA的发票记录
        receiptRecordSearchForm: {
          pageNumber: 1, // 当前Page数
          pageSize: 10, // Page面大小
          sort: "createTime", // default排序字段
          order: "desc", // default排序方式
        },
        receiptRecordColumns: [
          {
            title: "订单编号",
            key: "orderSn",
            width: 260,
            slot: "orderSnSlot",
          },
          {
            title: "发票抬头",
            key: "receiptTitle",
            minWidth: 130,
            tooltip: true
          },
          {
            title: "纳税人识别号",
            key: "taxpayerId",
            minWidth: 130,
            tooltip: true
          },
          {
            title: "发票金额",
            key: "receiptPrice",
            width: 130,
            render: (h, params) => {
              if(params.row.receiptPrice == null){
                return h("div", this.$options.filters.unitPrice(0, 'RM'));
              }else{
                return h("div", this.$options.filters.unitPrice(params.row.receiptPrice, 'RM'));
              }

            }
          },
          {
            title: "发票内容",
            key: "receiptContent",
            minWidth: 120,
            tooltip: true
          },
          ],
        receiptRecordData: [],//发票记录数据
        receiptRecordTotal: 0,//发票记录总items数
      };
    },
    methods: {
      init() {
        //查询会员信息
        this.getMemberInfo();
        //查询会员的历史积分数据
        this.getPointData();
      },
      //会员信息tab改变事件
      memberInfoChange(v) {
        if (v == "point") {
          this.getPointData();
        }
        if (v == "address") {
          this.getAddressData();
        }
        if (v == "order") {
          this.getOrderData();
        }
        if (v == "wallet") {
          this.getMemberWalletData();
          this.getDepositLogData();
        }
        if(v == "receipt"){
          this.getReceiptRecordData();
        }
      },
      //查询会员信息
      getMemberInfo() {
        API_Member.getMemberInfoData(this.id).then((res) => {
          this.$set(this, "memberInfo", res.result);
        });
      },
      //会员state改变事件
      memberStatusChange(v) {
        let params = {
          memberIds: [this.id],
          disabled: v
        }
        API_Member.updateMemberStatus(params).then(res => {
        });
      },
      //查询TA的余额disabled
      getMemberWalletData() {
        this.loading = true;
        let params = {
          memberId: this.id
        }
        API_Member.getMemberWallet(params).then((res) => {
          this.loading = false;
          if (res.success) {
            this.memberWalletInfo = res.result;
          }
        });
        this.loading = false;

      },
      //查询TA的余额消费记录
      getDepositLogData(){
        this.loading = true;
        this.walletSearchForm.memberId = this.id
        API_Member.getUserWallet(this.walletSearchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.walletData = res.result.records;
            this.walletTotal = res.result.total;
          }
        });
        this.loading = false;
      },

      //查询TA的发票记录
      getReceiptRecordData(){
        this.loading = true;
        this.receiptRecordSearchForm.memberId = this.id
        API_Order.getReceiptPage(this.receiptRecordSearchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.receiptRecordData = res.result.records;
            this.receiptRecordTotal = res.result.total;
          }
        });
        this.loading = false;
      },

      //查询TA的订单
      getOrderData() {
        this.loading = true;
        this.orderSearchForm.memberId = this.id
        API_Order.getOrderList(this.orderSearchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.orderData = res.result.records;
            this.orderTotal = res.result.total;
          }
        });
        this.loading = false;
      },
      //跳转到Order detailsPage面
      orderDetail(v) {
        this.$router.push({
          name: "order-detail",
          query: {sn: v},
        });
      },
      //查询TA的历史积分数据
      getPointData() {
        this.loading = true;
        this.pointSearchForm.memberId = this.id
        API_Member.getHistoryPointData(this.pointSearchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.pointData = res.result.records;
            this.pointTotal = res.result.total;
          }
        });
        this.loading = false;
      },
      //新增TA的Delivery address
      addMemberAddress() {
        this.addressModalTitle = "新增会员address";
        this.addressModalVisible = true
        this.addressForm = {
          id: "",
          isDefault: "0",
        }

      },
      //modifyTA的Delivery address
      editAddress(v) {
        this.addressModalTitle = "modify会员address";
        this.$set(this, "addressForm", v);
        delete this.addressForm.updateTime;
        this.addressModalVisible = true
      },
      //新增或者modify表单Submit
      addressSubmit() {
        this.addressForm.memberId = this.id
        this.$refs.addressForm.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            let submit = JSON.parse(JSON.stringify(this.addressForm))
            submit.isDefault == "1" ? submit.isDefault  = true :  submit.isDefault = false
            if (submit.id != "") {
              //modifyaddress
              API_Member.editMemberAddress(submit).then((res) => {
                this.submitLoading = false;
                if (res && res.success) {
                  this.$Message.success("modifysuccess");
                  this.addressModalVisible = false
                  this.getAddressData();
                }
              });
            } else {
              //添加address
              API_Member.addMemberAddress(submit).then((res) => {
                this.submitLoading = false;
                if (res && res.success) {
                  this.$Message.success("添加success");
                  this.addressModalVisible = false
                  this.getAddressData();
                }
              });
            }
          }
        })

      },
      //获取address
      getAddress(item) {
        this.$set(this.addressForm, 'consigneeAddressPath', item.addr)
        this.$set(this.addressForm, 'consigneeAddressIdPath', item.addrId)
        this.addressForm.address = item.address
        this.addressForm.lat = item.position.lat
        this.addressForm.lon = item.position.lng
      },
      //delete会员address
      memberAddressRemove(v) {
        this.$Modal.confirm({
          title: 'delete',
          content: '<p>Confirm要delete此Delivery address？</p>',
          onOk: () => {
            API_Member.removeMemberAddress(v.id).then((res) => {
              if (res.success) {
                this.$Message.success('deletesuccess');
                this.getAddressData();
              }
            });
          }
        })
      },
      //查询TA的Delivery address
      getAddressData() {
        this.loading = true;
        API_Member.getMemberAddressData(this.id, this.addressSearchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.addressData = res.result.records;
            this.addressTotal = res.result.total;
          }
        });
        this.loading = false;
      }
      ,
      //积分记录Page数变化
      pointChangePage(v) {
        this.pointSearchForm.pageNumber = v;
        this.getPointData();
      }
      ,
      //积分记录Page数变化
      pointChangePageSize(v) {
        this.pointSearchForm.pageNumber = 1;
        this.pointSearchForm.pageSize = v;
        this.getPointData();
      }
      ,
      //会员address记录Page数变化
      addressChangePage(v) {
        this.addressSearchForm.pageNumber = v;
        this.getAddressData()
      }
      ,
      //会员address记录Page数变化
      addressChangePageSize(v) {
        this.addressSearchForm.pageNumber = 1;
        this.addressSearchForm.pageSize = v;
        this.getPointData();
      },

      //余额记录Page数变化
      walletChangePage(v) {
        this.walletSearchForm.pageNumber = v;
        this.getDepositLogData();
      }
      ,
      //余额记录Page数变化
      walletChangePageSize(v) {
        this.walletSearchForm.pageNumber = 1;
        this.walletSearchForm.pageSize = v;
        this.getDepositLogData();
      },

      //订单记录Page数变化
      orderChangePage(v) {
        this.orderSearchForm.pageNumber = v;
        this.getOrderData()
      }
      ,
      //订单记录Page数变化
      orderChangePageSize(v) {
        this.orderSearchForm.pageNumber = 1;
        this.orderSearchForm.pageSize = v;
        this.getOrderData();
      },
      // 起止时间从新赋值
      selectDateRange(v) {
        if (v) {
          this.orderSearchForm.startDate = v[0];
          this.orderSearchForm.endDate = v[1];
        }
      },
    },

    mounted() {
      this.id = this.$route.query.id;
      this.init();
    }
    ,
  };
</script>
<style lang="scss" scoped>
  @import "memberDetail.scss";
</style>
