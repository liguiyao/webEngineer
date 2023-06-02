<template>
  <div>
    <card _Title="Delivery address" />
    <div class="add-box">
      <Form :model="formData" ref="form" label-position="left" :label-width="100" :rules="ruleInline">
        <FormItem label="Receiver" prop="name">
          <i-input v-model="formData.name" placeholder="Enter receiver name" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Receiving area" prop="address">
          <i-input v-model="formData.address" disabled placeholder="select delivery address" style="width: 600px"></i-input>
          <Button type="primary" size="small" @click="$refs.map.showMap = true">select</Button>
        </FormItem>
        <FormItem label="Full address" prop="detail">
          <i-input v-model="formData.detail" placeholder="enter full address" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Phone number" prop="mobile">
          <i-input v-model="formData.mobile" placeholder="enter receiver phone" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Address alias">
          <i-input v-model="formData.alias" length :maxlength="4" placeholder="Please enter Address alia, like company" style="width: 600px">
          </i-input>
        </FormItem>
        <FormItem label="Default address">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
    </div>
    <div class="mt_20">
      <Button type="primary" class="mr_10" :loading="loading" @click="save">Save Delivery address</Button>
      <Button @click="$router.back()">Back</Button>
    </div>
    <lili-map ref="map" @getAddress="getAddress"></lili-map>
  </div>
</template>

<script>
import card from "@/components/card";
import liliMap from "@/components/map";

import * as RegExp from "@/plugins/RegExp.js";
import {
  newMemberAddress,
  editMemberAddress,
  getAddrDetail,
} from "@/api/address";
export default {
  name: "AddAddress",
  data() {
    return {
      formData: {
        // 添加address表单
        isDefault: false,
      },
      ruleInline: {
        // 验证规则
        name: [{ required: true, message: "Please enter name", trigger: "blur" }],
        address: [{ required: true, message: "Please enter address", trigger: "change" }],
        detail: [
          { required: true, message: "Please enter Full address", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "Please enter Phone number" },
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: "Please enter correctly phone number",
          },
        ],
      },
      loading: false, // 加载状态
      mapMsg: {}, // 地图信息
    };
  },
  methods: {
    save() {
      // Saveaddress
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          params.consigneeAddressPath = params.address.replace(/\s/g, ",");
          delete params.address;
          this.loading = true;
          if (this.$route.query.id) {
            editMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            newMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    getAddrById(id) {
      // 获取address详情
      getAddrDetail(id).then((res) => {
        if (res.success) {
          console.log(res);
          const data = res.result;
          data.address = res.result.consigneeAddressPath.replace(/,/g, " ");
          this.formData = data;
        }
      });
    },
    getAddress(item) {
      // 获取地图select信息
      console.log(item);
      this.mapMsg = item;
      this.$set(this.formData, "address", item.addr);
      this.$set(this.formData, "consigneeAddressIdPath", item.addrId);
      this.$set(this.formData, "detail", item.detail);
      this.formData.lat = item.position.lat;
      this.formData.lon = item.position.lng;
    },
  },
  mounted() {
    const id = this.$route.query.id;
    if (id) this.getAddrById(id);
  },
  components: {
    card,
    liliMap,
  },
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
