<template>
  <div>
    <div style="display:flex;">
      <Input
        v-model="currentValue"
        @on-change="handleChange"
        v-show="showInput"
        :placeholder="placeholder"
        :size="size"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
      >
          <Poptip slot="append" transfer trigger="hover" title="picture view" placement="right">
            <Icon type="md-eye" class="see-icon" />
            <div slot="content">
              <img :src="currentValue" alt="no resource" style="max-width: 300px;margin: 0 auto;display: block;" />
              <a @click="viewImage=true" style="margin-top:5px;text-align:right;display:block">check photo</a>
            </div>
          </Poptip>
      </Input>

      <Upload
        :action="uploadFileUrl"
        :headers="accessToken"
        :on-success="handleSuccess"
        :on-error="handleError"
        :format="['jpg','jpeg','png','gif','bmp']"
        accept=".jpg, .jpeg, .png, .gif, .bmp"
        :max-size="1024"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        ref="up"
        class="upload"
      >
        <Button :loading="loading" :size="size" :disabled="disabled">Photo upload</Button>
      </Upload>
    </div>

    <Modal title="photo view" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="currentValue" alt="no resource" style="max-width: 300px;margin: 0 auto;display: block;" />
      <div slot="footer">
        <Button @click="viewImage=false">Close</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { uploadFile } from "@/api/index";
export default {
  name: "uploadPicInput",
  props: {
    value: String,
    size: {
      default: 'default',
      type: String
    },
    placeholder: {
      type: String,
      default: "photo link"
    },
    showInput: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: Number,
    icon: {
      type: String,
      default: "ios-cloud-upload-outline"
    }
  },
  data() {
    return {
      accessToken: {}, // 验证token
      currentValue: this.value, // 当前值
      loading: false, // 加载state
      viewImage: false, // 预览图片modal
      uploadFileUrl: uploadFile // 上传address
    };
  },
  methods: {
    // 初始化
    init() {
      this.accessToken = {
        accessToken: this.getStore("accessToken")
      };
    },
    // 格式校验
    handleFormatError(file) {
      this.loading = false;
      this.$Notice.warning({
        title: "not support photo",
        desc:
          "file‘ " +
          file.name +
          " ’incorrect , Please select .jpg .jpeg .png .gif .bmp file"
      });
    },
    // 大小校验
    handleMaxSize(file) {
      this.loading = false;
      this.$Notice.warning({
        title: "too big",
        desc: "too big "
      });
    },
    // 上传前
    beforeUpload() {
      this.loading = true;
      return true;
    },
    // 上传success
    handleSuccess(res, file) {
      this.loading = false;
      if (res.success) {
        this.currentValue = res.result;
        this.$emit("input", this.currentValue);
        this.$emit("on-change", this.currentValue);
      } else {
        // this.$Message.error(res.message);
      }
    },
    // 上传失败
    handleError(error, file, fileList) {
      this.loading = false;
      this.$Message.error(error.toString());
    },
    // 上传success回显
    handleChange(v) {
      this.$emit("input", this.currentValue);
      this.$emit("on-change", this.currentValue);
      this.$attrs.rollback && this.$attrs.rollback()
    },
    // 初始值
    setCurrentValue(value) {
      if (value === this.currentValue) {
        return;
      }
      this.currentValue = value;
      this.$emit("on-change", this.currentValue);
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.see-icon {
  font-size: 16px;
  cursor: pointer;
}

.upload {
  display: inline-block;
  margin-left: 10px;
}
</style>

