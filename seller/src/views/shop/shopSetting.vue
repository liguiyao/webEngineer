<template>
  <div class="search">
    <Card style="margin-left: 10px">
      <Tabs v-model="type" @on-click="handleClickType">
        <TabPane label="基本信息" name="INFO">
          <Form
            ref="form"
            :model="form"
            :label-width="100"
            :rules="formValidate"
          >
            <FormItem label="store name">
              <Input
                v-model="storeName"
                disabled
                clearable
                style="width: 20%"
              />
            </FormItem>
            <FormItem label="店铺address" prop="address">
              <Input
                v-model="form.address"
                @on-focus="$refs.liliMap.showMap = true"
                clearable
                style="width: 20%"
              />
            </FormItem>
            <FormItem label="Full address" prop="shopAddressDetail">
              <Input
                v-model="form.storeAddressDetail"
                clearable
                style="width: 20%"
                maxlength="50"
              />
            </FormItem>
            <FormItem label="店铺LOGO：">
              <upload-pic-thumb
                v-model="form.storeLogo"
                :multiple="false"
              ></upload-pic-thumb>
            </FormItem>
            <FormItem label="store details" prop="content" class="wangEditor">
              <Input
                type="textarea"
                :rows="8"
                v-model="form.storeDesc"
                style="width: 30%"
              ></Input>
            </FormItem>
            <FormItem label="店铺楼层" prop="content" class="wangEditor">
              <i-switch v-model="form.pageShow" @on-change="pageShow"></i-switch>
               <span class="desc">店铺楼层装修是否Opening，Opening后移动端PC将会自动展示装修的内容</span>
            </FormItem>
            <FormItem label="Openingself-lifting" prop="content" class="wangEditor">
              <i-switch v-model="form.selfPickFlag" @on-change="changeSelfPickFlag"></i-switch>
               <span class="desc">店铺是否Openingself-lifting功能</span>
            </FormItem>
            <Form-item>
              <Button
                @click="handleSubmit"
                :loading="submitLoading"
                type="primary"
                style="margin-right: 5px"
                >modify
              </Button>
            </Form-item>
          </Form>
        </TabPane>
        <TabPane label="发货address">
          <Form
            ref="addressGoods"
            :model="addressGoods"
            :label-width="100"
            :rules="addressGoodsValidate"
          >
            <FormItem label="发货人name" prop="salesConsignorName">
              <Input
                v-model="addressGoods.salesConsignorName"
                maxlength="11"
                clearable
                style="width: 20%"
              >
              </Input>
            </FormItem>
            <FormItem label="发货人Phone number" prop="salesConsignorMobile">
              <Input
                v-model="addressGoods.salesConsignorMobile"
                maxlength="11"
                clearable
                style="width: 20%"
              >
              </Input>
            </FormItem>
            <FormItem label="address" prop="salesConsignorAddressId">
              <Input
                v-model="regionGoods"
                clearable
                disabled
                style="width: 20%"
                v-if="showRegion == false"
              >
              </Input>
              <regionMap
                style="width: 20%"
                @selected="selectedRegionGoods"
                v-if="showRegion == true"
              />
              <Button
                v-if="showRegion == false"
                @click="regionClicks"
                type="primary"
                style="margin-left: 8px"
              >modify
              </Button>
            </FormItem>
            <!-- <FormItem label="address名称" prop="salesConsignorAddressPath">
              <Input
                v-model="addressGoods.salesConsignorAddressPath"
                clearable
                style="width: 20%"
              >
              </Input>
            </FormItem> -->
            <FormItem label="Full address" prop="salesConsignorDetail">
              <Input
                v-model="addressGoods.salesConsignorDetail"
                clearable
                style="width: 20%"
              >
              </Input>
            </FormItem>
            <Button
              @click="SetAddressGoods"
              type="primary"
              style="margin-left: 8px"
            >确认
            </Button>
          </Form>
        </TabPane>
        <TabPane label="Return goodsaddress" name="REFUND_GOODS_ADDRESS">
          <Form
            ref="addressForm"
            :model="addressForm"
            :label-width="100"
            :rules="afterFormValidate"
          >
            <FormItem label="receiver" prop="salesConsigneeName">
              <Input
                v-model="addressForm.salesConsigneeName"
                maxlength="11"
                clearable
                style="width: 20%"
              />
            </FormItem>
            <FormItem label="receiver电话" prop="salesConsigneeMobile">
              <Input
                v-model="addressForm.salesConsigneeMobile"
                maxlength="11"
                style="width: 20%"
              />
            </FormItem>
            <FormItem label="after saleaddress">
              <Input
                v-model="region"
                disabled
                style="width: 20%"
                v-if="showRegion == false"
              />
              <Button
                v-if="showRegion == false"
                @click="regionClick"
                :loading="submitLoading"
                type="primary"
                style="margin-left: 8px"
                >modify
              </Button>
              <regionMap
                style="width: 20%"
                @selected="selectedRegion"
                v-if="showRegion == true"
              />
            </FormItem>
            <FormItem label="Full address" prop="salesConsigneeDetail">
              <Input
                v-model="addressForm.salesConsigneeDetail"
                clearable
                style="width: 20%"
                maxlength="50"
              />
            </FormItem>

            <Form-item>
              <Button
                @click="afterHandleSubmit"
                :loading="submitLoading"
                type="primary"
                style="margin-right: 5px"
                >modify
              </Button>
            </Form-item>
          </Form>
        </TabPane>
        <TabPane label="stock预警" name="STOCK_WARNING">
          <Form
            ref="stockWarningForm"
            :model="stockWarningForm"
            :label-width="100"
            :rules="stockWarningFormValidate"
          >
            <FormItem label="预警数" prop="stockWarning">
              <InputNumber
                :min="0"
                :max="99999"
                v-model="stockWarningForm.stockWarning"
                type="number"
                maxlength="6"
                clearable
                style="width: 20%"
              />
            </FormItem>

            <Form-item>
              <Button
                @click="stockWarningHandleSubmit"
                :loading="submitLoading"
                type="primary"
                style="margin-right: 5px"
                >modify
              </Button>
            </Form-item>
          </Form>
        </TabPane>
        <!-- Udesk 坐席功能 后续维护 -->
        <!-- <TabPane label="客服设置" name="UDESK">
          <Form
            ref="udeskForm"
            :model="udeskForm"
            :label-width="100"
            :rules="udeskFormValidate"
          >
            <FormItem label="坐席id" prop="merchantEuid">
              <Input
                v-model="udeskForm.merchantEuid"
                maxlength="30"
                clearable
                style="width: 20%"
              />
            </FormItem>
            <Form-item>
              <Button
                @click="merchantSubmit"
                :loading="submitLoading"
                type="primary"
                style="margin-right: 5px"
                >modify
              </Button>
            </Form-item>
          </Form>
        </TabPane> -->
      </Tabs>
    </Card>

    <liliMap ref="liliMap" @getAddress="getAddress"></liliMap>
  </div>
</template>

<script>
import * as API_Shop from "@/api/shops";
import { validateMobile } from "@/libs/validate";
import uploadPicThumb from "@/views/my-components/lili/upload-pic-thumb";
import liliMap from "@/views/my-components/map/index";
import regionMap from "@/views/lili-components/region";
import * as RegExp from "@/libs/RegExp.js";
import Cookies from "js-cookie";
import {editDeliverAddress, getDeliverAddress} from "../../api/shops";

export default {
  name: "shopSetting",
  components: {
    uploadPicThumb,
    liliMap,
    regionMap,
  },
  data() {
    return {
      type: "INFO",
      showRegion: false, // selectaddress模态框显隐
      storeName: "", //store name
      region: "", // 地区名称
      regionId: [], // 地区id
      addressForm: {
        // Return goodsaddress
        salesConsigneeName: "", // receivername
        salesConsigneeMobile: "", // receiver电话
        salesConsigneeAddressId: "", // after saleaddressid,逗号分割
        salesConsigneeAddressPath: "", // after saleaddress，逗号分割
        salesConsigneeDetail: "", // Full address
      },
      //stock预警form
      stockWarningForm: {
        stockWarning: "", // stock预警Quantity
      },
      //im form
      udeskForm: {
        merchantEuid: "",
      },
      stockWarningFormValidate: {
        stockWarning: [
          { required: true, type:'number', message: "Please enter stock预警数", trigger: "blur" },
        ],
      },
      udeskFormValidate: {
        merchantEuid: [
          { required: true, message: "Please enter 店铺坐席ID", trigger: "blur" },
        ],
      },
      afterFormValidate: {
        salesConsigneeMobile: [
          { required: true, message: "Phone number不能为空", trigger: "blur" },
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: "Please enter correctly phone number",
          },
        ],
        salesConsigneeName: [
          { required: true, message: "Please enter receiver", trigger: "blur" },
        ],
        salesConsigneeDetail: [
          { required: true, message: "Please enter Full address", trigger: "blur" },
        ],
      },
      form: {
        // 添加或edit表单对象初始化数据
        storeAddressPath: "", // 店铺address中文
        storeCenter: "", // 经度 + 纬度
        longitude: "", //经度
        latitude: "", //纬度
        storeAddressDetail: "", //Full address
        storeAddressIdPath: "", //address
        storeDesc: "", // 店铺描述
        pageShow: false,
        selfPickFlag: false,
      },

      // 表单验证规则
      formValidate: {
        addressName: [
          {
            required: true,
            message: "Please enter address名称",
            trigger: "blur",
          },
        ],
        longitude: [
          {
            required: true,
            message: "Please enter address经度",
            trigger: "blur",
          },
        ],
        latitude: [
          {
            required: true,
            message: "Please enter address纬度",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "Please enter address纬度",
            trigger: "blur",
          },
          {
            validator: validateMobile,
            trigger: "blur",
          },
        ],
        storeAddressDetail: [
          {
            required: true,
            message: "Please enter Full address",
            trigger: "blur",
          },
        ],
      },
      submitLoading: false, // 添加或editSubmitstate
      //发货address
      addressGoods: {
        salesConsignorName:" ",
        salesConsignorMobile:" ",
        salesConsignorAddressId: " ",
        salesConsignorAddressPath: " ",
        salesConsignorDetail: " ",
      },
      regionGoods:"",//发货address
      addressGoodsValidate: {
        salesConsignorName: [
          { required: true, message: "Please enter 发货人name", trigger: "blur" },
        ],
        salesConsignorMobile: [
          { required: true, message: "Phone number不能为空", trigger: "blur" },
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: "Please enter correctly phone number",
          },
        ],
        salesConsignorDetail: [
          { required: true, message: "Please enter Full address", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getShopInfo();
      this.getDeliverAddress()
    },
    selectedRegionGoods(val){
      this.regionGoods = val[1];
      this.regionIdS = val[0];
    },
    regionClicks(){
      this.showRegion = true;
      this.regionIdS = "";
    },
    SetAddressGoods(){
      console.log(this.$refs.addressGoods)
      if (this.regionIdS == "") {
        this.$Message.error("Please selectaddress");
        return;
      }
      this.$refs.addressGoods.validate((valid) => {
        if (valid) {
          this.addressGoods.salesConsignorAddressPath = this.regionGoods;
          this.addressGoods.salesConsignorAddressId = this.regionIdS;
          API_Shop.editDeliverAddress(this.addressGoods).then(res=>{
            if(res.success){
              this.$Message.success("modifysuccess")
            }
          })
        }
      });
    },
    //获取店铺信息
    getShopInfo() {
      this.loading = true;
      API_Shop.getShopInfo().then((res) => {
        this.loading = false;
        if (res.success) {
          this.form = res.result;
          this.$set(this.form, "address", res.result.storeAddressPath);
          this.storeName = res.result.storeName;
          this.form.storeCenter = res.result.storeCenter;
          Cookies.set("userInfoSeller", JSON.stringify(res.result));
          //stock预警数赋值
          this.$nextTick(() => {
            this.stockWarningForm.stockWarning = res.result.stockWarning + "";
          });
          if (res.result.merchantEuid) {
            //赋予坐席id
            this.udeskForm.merchantEuid = res.result.merchantEuid;
          }
        }
      });
    },
    pageShow(type) {
      this.form.pageShow = type
    },
    changeSelfPickFlag(item){
      if(item){
        this.form.selfPickFlag = item
      }
    },
    getDeliverAddress(){
      API_Shop.getDeliverAddress().then(res=>{
        if(res.success){
          if(res.result!= '' && res.result != null){
            console.log(89898999998)
            this.addressGoods = res.result;
            this.regionGoods = res.result.salesConsignorAddressPath;
            this.regionIdS = res.result.salesConsignorAddressId;
          }
        }
      })
    },
    //modifyafter saleaddress
    regionClick() {
      this.showRegion = true;
      this.regionId = "";
    },
    //reset
    handleReset() {
      this.$refs.form.resetFields();
    },
    //SubmitSave
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          API_Shop.saveShopInfo(this.form).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("modifysuccess");
              this.getShopInfo();
            }
          });
        }
      });
    },
    //modifystock预警数
    stockWarningHandleSubmit() {
      this.$refs.stockWarningForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          API_Shop.updateStockWarning(this.stockWarningForm).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("modifysuccess");
              this.getShopInfo();
            }
          });
        }
      });
    },
    merchantSubmit() {
      this.$refs.udeskForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          API_Shop.updatEmerchantId(this.udeskForm).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("modifysuccess");
              this.getShopInfo();
            }
          });
        }
      });
    },
    // 选中的address
    selectedRegion(val) {
      this.region = val[1];
      this.regionId = val[0];
    },
    //tab切换
    handleClickType(v) {
      //refund
      if (v == "INFO") {
        this.getShopInfo();
      }
      //Return goods
      if (v == "REFUND_GOODS_ADDRESS") {
        this.getRefundGoodsAddress();
      }
    },
    //获取商家Return goodsaddress
    getRefundGoodsAddress() {
      API_Shop.getRefundGoodsAddress().then((res) => {
        if (res.result != null) {
          this.addressForm = res.result;
          this.regionId = res.result.salesConsigneeAddressId;
          this.region = res.result.salesConsigneeAddressPath;
        }
      });
    },
    //SubmitSave
    afterHandleSubmit() {
      if (this.regionId == "") {
        this.$Message.error("Please selectaddress");
        return;
      }
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          this.addressForm.salesConsigneeAddressPath = this.region;
          this.addressForm.salesConsigneeAddressId = this.regionId;
          this.submitLoading = true;
          API_Shop.saveRefundGoodsAddress(this.addressForm).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("modifysuccess");
              this.getRefundGoodsAddress();
              this.showRegion = false;
            }
          });
        }
      });
    },
    //获取address
    getAddress(item) {
      this.$set(this.form, "address", item.addr);
      this.form.storeAddressPath = item.addr;
      this.form.storeAddressIdPath = item.addrId;
      this.form.storeCenter = item.position.lng + "," + item.position.lat;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped lang="scss">
.desc{
  margin-left: 10px;
  color: #999;
}
</style>
