<template>
  <div>
    <Modal v-model="showAddr" width="800" title="收件人地址">
      <Form
        :model="formData"
        ref="form"
        label-position="left"
        :label-width="100"
        :rules="ruleInline"
      >
        <FormItem label="Receiver" prop="name">
          <i-input v-model="formData.name" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Area" prop="address">
          <i-input
            v-model="formData.address"
            disabled
            style="width: 600px"
          ></i-input>
          <Button type="primary" size="small" @click="$refs.map.showMap = true">Select</Button>
        </FormItem>
        <FormItem label="Full address" prop="detail">
          <i-input v-model="formData.detail" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Mobile phone" prop="mobile">
          <i-input v-model="formData.mobile" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="Address alias">
          <i-input
            v-model="formData.alias"
            length
            :maxlength="4"
            placeholder="Please enter an alias, such as a company"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Default address">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
      <div class="mt_20" slot="footer">
        <Button @click="hide">Cancel</Button>
        <Button type="primary" class="mr_10" :loading="loading" @click="save">Save</Button>
      </div>
    </Modal>
    <lili-map ref="map" @getAddress="getAddress"></lili-map>
  </div>
</template>

<script>
import liliMap from '@/components/map';
import {
  newMemberAddress,
  editMemberAddress,
  getAddrDetail
} from '@/api/address';
export default {
  name: 'addressManage',
  props: {
    id: { // 传入的地址id
      defalut: '',
      type: String
    }
  },
  data () {
    return {
      showAddr: false, // 控制模态框显隐
      formData: { // 表单数据
        isDefault: false
      },
      ruleInline: { // 验证规则
        name: [{ required: true, message: 'Enter receiver name', trigger: 'blur' }],
        address: [{ required: true, message: 'Enter Address', trigger: 'change' }],
        detail: [
          { required: true, message: 'Enter address detail', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Phone number cannot be empty', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
            message: 'Wrong number format',
            trigger: 'blur'
          }
        ]
      },
      loading: false, // 提交的加载状态
      mapMsg: {} // 地图信息
    };
  },
  methods: {
    save () { // 保存地址
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          params.consigneeAddressPath = params.address.replace(/\s/g, ',');
          delete params.address;
          this.loading = true;
          if (this.id) {
            editMemberAddress(params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success('Edit success');
                this.$emit('change', true);
                this.hide();
              }
            }).catch(() => { this.loading = false; });
          } else {
            newMemberAddress(params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success('Add success');
                this.$emit('change', true);
                this.hide();
              }
            }).catch(() => { this.loading = false; });
          }
        }
      });
    },
    getAddrById (id) {
      // 获取地址详情
      getAddrDetail(id).then((res) => {
        if (res.success) {
          console.log(res);
          const data = res.result;
          data.address = res.result.consigneeAddressPath.replace(/,/g, ' ');
          this.formData = data;
        }
      });
    },
    getAddress (item) {
      // 获取地图选择信息
      this.mapMsg = item;
      this.$set(this.formData, 'address', item.addr);
      this.$set(this.formData, 'consigneeAddressIdPath', item.addrId);
      this.$set(this.formData, 'detail', item.detail);
      this.formData.lat = item.position.lat;
      this.formData.lon = item.position.lng;
    },
    show () { // 地址模态框显示
      this.showAddr = true;
    },
    hide () { // 地址模态框隐藏
      this.showAddr = false;
    }
  },
  watch: {
    id: { // 传入的地址id
      handler: function (v) {
        if (v) {
          this.getAddrById(v);
        } else {
          this.formData = {isDefault: false}
          this.$refs.form.resetFields();
        }
      }
    }
  },
  components: {
    liliMap
  }
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
