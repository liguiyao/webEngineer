<template>
  <div>
    <Row class="operation">
      <Button @click="add()" type="primary">设置今日热词</Button>
    </Row>
    <Row>
      <p>
        <Alert type="success">
          这里展示今日系统中search前一百的search热词，分数为热词在排序系统中的分数，分数越高，可以在用户获取热词时进行优先展示（HomeGoodssearch栏下方推荐位）（分数可以enter 负数，会降低推荐度）
        </Alert>
      </p>
    </Row>

    <div class="card-list">
      <Card v-for="words in data" class="card-item" :key="words" onclick="">
        <p>
          <a href="#" slot="extra" @click.prevent="add(words)">{{ words }}</a>
        </p>
        <p slot="extra">
          <a @click="deleteWords(words)">
            <Icon type="md-close" />
          </a>
        </p>
      </Card>
    </div>
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
        <FormItem label="热词" prop="keywords">
          <Input v-model="form.keywords" clearable style="width: 100%" />
        </FormItem>
        <FormItem label="分数" prop="point">
          <InputNumber  v-model="form.point" clearable style="width: 100%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit"
          >Submit</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import { getHotWords, setHotWords, deleteHotWords } from "@/api/index";

import { regular } from "@/utils";
export default {
  name: "hotWords",
  components: {},
  data() {
    return {
      submitLoading: false,
      modalTitle: "",
      loading: true, // 表单加载state
      modalVisible: false, //弹出框
      form: {
        keywords: "",
        point: 0,
      },
      data: [], // 表单数据

      // 表单验证规则
      formValidate: {
        keywords: [regular.REQUIRED, regular.VARCHAR20],
        point: [regular.REQUIRED, regular.NUMBER],
      },
    };
  },
  methods: {
    init() {
      this.getDataList();
    },
    handleClickTab(val) {
      console.log(val);
    },
    getDataList() {
      this.loading = true;
      getHotWords().then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result;
          this.$store.state.app.hotWords = this.data

        }
      });
      this.loading = false;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setHotWords(this.form).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getDataList();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    //设置热词优先
    add(words) {
      this.modalType = 0;
      this.modalTitle = "设置热词";
      if (words) {
        this.form.keywords = words;
      } else {
        this.form.keywords = "";
      }
      this.form.point = 1;
      this.modalVisible = true;
    },
    deleteWords(words) {
      this.$Modal.confirm({
        title: "是否Confirmdelete热词",
        content: "<p>您Confirm要delete此热词吗？</p>",
        okText: "确实",
        cancelText: "Cancel",
        onOk: () => {
          deleteHotWords({words}).then((res) => {
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getDataList();
            }
          });
        },
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.card-item {
  min-width: 100px;
  margin: 20px;
}
</style>
<style>
.ivu-card-extra {
  right: 3px;
  top: 15px;
  z-index: 99;
}
</style>
