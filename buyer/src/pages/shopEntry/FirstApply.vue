<template>
  <div class="company-msg">
    <Form ref="firstForm" :model="form" :rules="rules" :label-width="140">
      <h4>Basic information</h4>
      <FormItem prop="companyName" label="Company name">
        <Input
          type="text"
          v-model="form.companyName"
          placeholder="Please enter Company information"
        />
      </FormItem>
      <FormItem prop="companyAddressIdPath" label="Location">
        <region
          style="width: 250px"
          @selected="selectedRegion"
          :addressId="address"
        />
      </FormItem>
      <FormItem prop="companyAddress" label="Company Full address">
        <Input
          type="text"
          v-model="form.companyAddress"
          placeholder="Please enter company detail information"
        />
      </FormItem>
      <FormItem prop="employeeNum" label="Total number of employees">
        <Input
          type="text"
          v-model="form.employeeNum"
          placeholder="Please enter Total number of employees"
          ><span slot="append">人</span>
          </Input>
      </FormItem>
      <FormItem prop="companyPhone" label="Company telephone">
        <Input
          type="text"
          v-model="form.companyPhone"
          placeholder="Please enter Company telephone"
          ></Input>
      </FormItem>
      <FormItem prop="registeredCapital" label="Registered capital">
        <Input
          type="text"
          v-model="form.registeredCapital"
          placeholder="Please enter Registered capital"
          ><span slot="append">万ringgit</span></Input>
      </FormItem>
      <FormItem prop="linkName" label="contact name">
        <Input
          type="text"
          v-model="form.linkName"
          placeholder="Please enter contact name"
        />
      </FormItem>
      <FormItem prop="linkPhone" label="Contact number">
        <Input
          type="text"
          v-model="form.linkPhone"
          placeholder="Please enter Contact number"
        />
      </FormItem>
      <FormItem prop="companyEmail" label="email">
        <Input
          type="text"
          v-model="form.companyEmail"
          placeholder="Please enter email"
        />
      </FormItem>

      <h4>Business license</h4>
      <FormItem prop="licenseNum" label="Business license number">
        <Input
          type="text"
          v-model="form.licenseNum"
          placeholder="Please enter Business license number"
        />
      </FormItem>
      <FormItem prop="scope" label="Legal scope of business">
        <Input
          type="textarea"
          v-model="form.scope"
          maxlength="200"
          show-word-limit
          :rows="4"
          placeholder="Please enter legal scope of business"
        />
      </FormItem>
      <FormItem prop="licencePhoto" label="Electronic version of business license">
        <Upload
          ref="uploadLicence"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg', 'jpeg', 'png', 'gif']"
          :max-size="2048"
          :before-upload="beforeUpload"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="uploadErr"
          multiple
          :action="action"
          :headers="accessToken"
        >
          <Button type="info" :loading="uploadLoading">uploading</Button>
        </Upload>
        <div class="describe">
          Please
        </div>
        <div
          class="img-list"
          v-for="(item, index) in form.licencePhoto"
          :key="index"
        >
          <img :src="item" width="100" alt="" />
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'licencePhoto')"
            ></Icon>
          </div>
        </div>
      </FormItem>

      <h4>Legal person information</h4>
      <FormItem prop="legalName" label="法人name">
        <Input
          type="text"
          v-model="form.legalName"
          maxlength="20"
          placeholder="Please enter name"
        />
      </FormItem>
      <FormItem prop="legalId" label="法人证件号">
        <Input
          type="text"
          v-model="form.legalId"
          placeholder="Please enter 法人证件号"
        />
      </FormItem>
      <FormItem prop="legalPhoto" label="法人证件电子版">
        <Upload
          ref="uploadLegal"
          :show-upload-list="false"
          :on-success="handleSuccess1"
          :before-upload="beforeUpload1"
          :max-size="2048"
          :format="['jpg', 'jpeg', 'png', 'gif']"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="uploadErr"
          multiple
          :action="action"
          :headers="accessToken"
        >
          <Button type="info" :loading="uploadLoading1">Certificate uploading</Button>
        </Upload>
        <div class="describe">
          Please
        </div>
        <div
          class="img-list"
          v-for="(item, index) in form.legalPhoto"
          :key="index"
        >
          <img :src="item" width="100" alt="" />
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'legalPhoto')"
            ></Icon>
          </div>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="next"
          >enter Financial qualification information</Button
        >
      </FormItem>
    </Form>
    <Modal title="View Image" v-model="visible">
      <img :src="previewPicture" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import { applyFirst } from '@/api/shopentry';
import * as RegExp from '@/plugins/RegExp.js';
import region from '@/components/map/region.vue';
import storage from '@/plugins/storage';
import { commonUrl } from '@/plugins/request.js';
export default {
  components: { region },
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      action: commonUrl + '/common/common/upload/file', // 上传address
      accessToken: {}, // 验证token
      visible: false, // 预览图片
      loading: false, // 加载状态
      address: '', // address
      previewPicture: '', // 预览图片url
      form: { // 表单数据
        legalPhoto: [],
        licencePhoto: []
      },
      rules: { // 验证规则
        companyName: [{ required: true, message: 'Please enter company info' }],
        companyAddressIdPath: [{ required: true, message: 'Please select location' }],
        companyAddress: [{ required: true, message: 'Please enter company Full address' }],
        employeeNum: [
          { required: true, message: 'Please enter company employee quantity' },
          { pattern: RegExp.integer, message: 'must enter positive integer' }
        ],
        registeredCapital: [
          { required: true, message: 'Please enter Registered capital' },
          { pattern: RegExp.integer, message: 'muse enter positive integer' }
        ],
        linkName: [{ required: true, message: 'Please enter contact name' }],
        linkPhone: [
          { required: true, message: 'Please enter contact number' },
          { pattern: RegExp.mobile, message: 'Please enter correctly number' }
        ],
        companyPhone: [
          { required: true, message: 'Please enter company contact' },
          { pattern: RegExp.mobile, message: 'Please enter company contact' }
        ],
        companyEmail: [
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter correctly email' }
        ],
        licenseNum: [
          { required: true, message: 'Please enter Business license number' },
          { pattern: RegExp.licenseNum, message: 'Please enter Business license number' }
        ],
        scope: [{ required: true, message: 'Please enter 营业执照所示经营范围' }],
        legalPhoto: [{ required: true, message: 'Please 上传法人身份证照片' }],
        licencePhoto: [{ required: true, message: 'Please 上传营业执照' }],
        legalName: [{ required: true, message: 'Please enter 法人name' }],
        legalId: [
          { required: true, message: 'Please enter 法人证件号' },
          { pattern: RegExp.IDCard, message: 'Please enter 正确的证件号' }
        ]
      },
      uploadLoading1: false, // 上传loading
      uploadLoading: false // 上传loading
    };
  },
  methods: {
    // 下一步
    next () {
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = JSON.parse(JSON.stringify(this.form));
          params.legalPhoto = this.form.legalPhoto.toString();
          params.licencePhoto = this.form.licencePhoto.toString();
          applyFirst(params)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error');
        }
      });
    },
    // addressselect回显
    selectedRegion (item) {
      this.$set(this.form, 'companyAddressIdPath', item[0].toString());
      this.$set(
        this.form,
        'companyAddressPath',
        item[1].toString().replace(/\s/g, '')
      );
    },
    // 上传之前
    beforeUpload () {
      this.uploadLoading = true;
      if (this.form.licencePhoto.length >= 3) {
        this.$Message.warning('Upload a maximum of three images')
        return false;
      }
    },
    // 上传之前
    beforeUpload1 () {
      this.uploadLoading1 = true;
      if (this.form.legalPhoto.length >= 2) {
        this.$Message.warning('Upload a maximum of two images')
        return false;
      }
    },
    // 上传success回调
    handleSuccess (res, file) {
      this.uploadLoading = false;
      this.form.licencePhoto.push(res.result);
    },
    // 上传success回调
    handleSuccess1 (res, file) {
      this.uploadLoading1 = false;
      this.form.legalPhoto.push(res.result);
    },
    // 上传失败
    uploadErr () {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
    },
    // 上传失败回调
    handleFormatError (file) {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'format is incorrect'
      });
    },
    // 上传大小限制
    handleMaxSize (file) {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'file size cannot exceed 2 MB'
      });
    },
    // 图片查看
    handleView (item) {
      this.previewPicture = item;
      this.visible = true;
    },
    // delete图片
    handleRemove (index, listName) {
      this.form[listName].splice(index, 1);
    }
  },
  mounted () {
    this.accessToken.accessToken = storage.getItem('accessToken');
    if (Object.keys(this.content).length) { // 处理回显数据
      this.form = JSON.parse(JSON.stringify(this.content));
      if (this.form.licencePhoto) {
        this.form.legalPhoto = this.content.legalPhoto.split(',');
        this.form.licencePhoto = this.content.licencePhoto.split(',');
        this.address = this.form.companyAddressIdPath;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
.ivu-input-wrapper {
  width: 300px;
}
.img-list {
  display: inline-block;
  margin: 10px;
  width: 100px;
  position: relative;
  .cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    width: inherit;
    height: inherit;
    align-items: center;
    justify-content: space-around;
    i {
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }
  &:hover .cover {
    display: flex;
  }
}
.describe {
  font-size: 12px;
  color: #999;
}
</style>
