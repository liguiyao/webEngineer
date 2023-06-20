<template>
  <div class="person-msg">
    <Form ref="thirdForm" :model="form" :rules="rules" :label-width="140">
      <h4>Basic information</h4>
      <FormItem prop="storeName" label="Store name">
        <Input
          type="text"
          v-model="form.storeName"
          placeholder="Please enter store name"
        />
      </FormItem>

      <FormItem prop="storeLogo" label="store logo">
        <Upload
          ref="uploadLogo"
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
          <Button type="info" :loading="uploadLoading">upload logo</Button>
        </Upload>
        <div class="describe">Please compressed image should be less than 2M in format of gif, jpg, or png</div>
        <div
          class="img-list"
          v-for="(item, index) in form.storeLogo"
          :key="index"
        >
          <img :src="item" width="100" height="" alt="" />
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'storeLogo')"
            ></Icon>
          </div>
        </div>
      </FormItem>
      <FormItem prop="goodsManagementCategory" label="Categories of shop operations">
        <Select
          v-model="form.goodsManagementCategory"
          multiple
          style="width: 300px"
        >
          <Option
            v-for="item in categoryList"
            :value="item.id"
            :key="item.id"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem prop="storeCenter" label="positioning">
        <Button
          type="info"
          v-if="!form.storeCenter"
          @click="$refs.liliMap.showMap = true"
        >Click to get store location</Button>
        <Button
          type="success"
          v-else
          @click="$refs.liliMap.showMap = true"
        >located</Button>
      </FormItem>
      <FormItem prop="storeAddressIdPath" label="Shop location">
        <region
          style="width: 250px"
          @selected="selectedRegion"
          :addressId="address"
        />
      </FormItem>
      <FormItem prop="storeAddressDetail" label="Store Full address">
        <Input
          type="text"
          v-model="form.storeAddressDetail"
          placeholder="Please enter store Full address"
        />
      </FormItem>
      <FormItem prop="storeDesc" label="Store details">
        <Input
          type="textarea"
          v-model="form.storeDesc"
          maxlength="200"
          show-word-limit
          :rows="4"
          placeholder="Please enter store details"
        />
      </FormItem>

      <FormItem>
        <Button @click="$emit('change', 1)">Back</Button>
        <Button type="primary" :loading="loading" @click="next"
          >Submit audit</Button
        >
      </FormItem>
    </Form>
    <Modal title="View Image" v-model="visible">
      <img :src="previewPicture" v-if="visible" style="width: 100%" />
    </Modal>
    <lili-map ref="liliMap" @getAddress="getAddress" :useApi="false"></lili-map>
  </div>
</template>
<script>
import { applyThird } from '@/api/shopentry';
import { getCategory } from '@/api/goods';
import Map from '@/components/map/index';
import storage from '@/plugins/storage';
import { commonUrl } from '@/plugins/request.js';
import region from '@/components/map/region.vue';
export default {
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  components: { liliMap: Map, region },
  data () {
    return {
      loading: false, // 加载state
      uploadLoading: false, // 上传加载state
      action: commonUrl + '/common/common/upload/file', // 上传address
      accessToken: {}, // 验证token
      previewPicture: '', // 预览图片
      address: '', // 回显address
      visible: false, // 图片预览
      form: { // 表单数据
        storeLogo: []
      },
      rules: { // 验证规则
        goodsManagementCategory: [
          { required: true, message: 'Please select categories of shop operations' }
        ],
        storeName: [{ required: true, message: 'Please enter store name' }],
        storeLogo: [{ required: true, message: 'Please upload stroe logo' }],
        storeDesc: [{ required: true, message: 'Please enter store details' }],
        storeCenter: [{ required: true, message: 'Please select store location' }],
        storeAddressIdPath: [{ required: true, message: 'Please select store location' }],
        storeAddressDetail: [{ required: true, message: 'Please enter store Full address' }]
      },
      categoryList: [] // 分类数据
    };
  },
  methods: {
    // Next
    next () {
      this.$refs.thirdForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = JSON.parse(JSON.stringify(this.form));
          params.storeLogo = this.form.storeLogo.toString();
          params.goodsManagementCategory = this.form.goodsManagementCategory.toString();
          applyThird(params)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 3);
              this.$parent.getData()
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error');
        }
      });
    },
    // 上传之前
    beforeUpload () {
      this.uploadLoading = true;
      if (this.form.storeLogo.length >= 3) {
        this.$Message.warning('Upload a maximum of three images')
        return false;
      }
    },
    // 上传success回调
    handleSuccess (res, file) {
      this.uploadLoading = false;
      this.form.storeLogo.push(res.result);
    },
    // 上传格式错误
    handleFormatError (file) {
      this.uploadLoading = false;
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'The format of the uploaded file is incorrect'
      });
    },
    // 上传大小限制
    handleMaxSize (file) {
      this.uploadLoading = false;
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'The file size cannot exceed 2 MB'
      })
    },
    // 上传失败
    uploadErr () {
      this.uploadLoading = false;
    },
    // View图片
    handleView (item) {
      this.previewPicture = item;
      this.visible = true;
    },
    // delete图片
    handleRemove (index, listName) {
      this.form[listName].splice(index, 1);
    },
    // select坐标回调
    getAddress (item) {
      this.$set(
        this.form,
        'storeCenter',
        item.position.lng + ',' + item.position.lat
      );
    },
    // 获取Goods Category
    getCategoryList () {
      getCategory(0).then((res) => {
        if (res.success) this.categoryList = res.result;
      });
    },
    // addressselect回显
    selectedRegion (item) {
      this.$set(this.form, 'storeAddressIdPath', item[0].toString());
      this.$set(
        this.form,
        'storeAddressPath',
        item[1].toString().replace(/\s/g, '')
      );
    }
  },
  mounted () {
    this.accessToken.accessToken = storage.getItem('accessToken');
    this.getCategoryList();
    if (this.content != {}) {
      this.form = JSON.parse(JSON.stringify(this.content));
      if (this.form.storeLogo) {
        this.form.storeLogo = this.content.storeLogo.split(',');
        this.form.goodsManagementCategory = this.content.goodsManagementCategory.split(
          ','
        );
      } else {
        this.form.storeLogo = [];
      }
      this.address = this.form.storeAddressIdPath;
      this.$forceUpdate();
    }
    this.$refs.thirdForm.resetFields()
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
  height: auto;
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
