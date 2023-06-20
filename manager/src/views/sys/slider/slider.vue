<template>
  <div class="search">
    <Card>
      <Tabs value="RESOURCE" @on-click="handleClickType">
        <TabPane label="source" name="RESOURCE">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add" type="primary">添加</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
            sortable="custom"
          >
            <!-- Goods栏目格式化 -->
            <template slot="imageSlot" slot-scope="scope">
              <div style="">
                <img
                  :src="scope.row.resource"
                  style="height: 60px; margin-top: 1px; width: 90px"
                />
              </div>
            </template>
          </Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10, 20, 50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            >
            </Page>
          </Row>
        </TabPane>
        <TabPane label="滑块源" name="SLIDER">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add" type="primary" icon="md-add">添加</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
            sortable="custom"
          >
            <!-- Goods栏目格式化 -->
            <template slot="imageSlot" slot-scope="scope">
              <div style="">
                <img
                  :src="scope.row.resource"
                  style="height: 60px; margin-top: 1px; width: 60px"
                />
              </div>
            </template>
          </Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
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
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
        <FormItem label="名称" prop="name">
          <Input
            v-model="form.name"
            maxlength="20"
            clearable
            style="width: 100%"
          />
        </FormItem>
        <FormItem label="图片" prop="resource">
          <upload-pic-input v-model="form.resource" style="width: 100%"></upload-pic-input>
        </FormItem>
        <FormItem label="类型" prop="type">
          <radio-group v-model="form.type" type="button">
            <radio label="RESOURCE">source</radio>
            <radio label="SLIDER">滑块源</radio>
          </radio-group>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit"
          >Submit
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import * as API_Setting from "@/api/setting";
import uploadPicInput from "@/components/lili/upload-pic-input";
export default {
  components: {
    uploadPicInput
  },
  data() {
    return {
      modalVisible: false, //添加验证码源弹出框
      modalTitle: "", //添加验证码源弹出框标题
      loading: true, // 表单加载state
      modalType: 0, // 添加或edit标识
      submitLoading: false, // 添加或editSubmitstate
      form: {
        name: "",
        resource: "",
        type: "RESOURCE",
      }, //添加edit表单
      formValidate: {
        name: [
          {
            required: true,
            message: "Please enter 名称",
            trigger: "blur",
          },
        ],
        resource: [
          {
            required: true,
            message: "Please 上传图片",
            trigger: "blur",
          },
        ],
      },
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        type: "RESOURCE",
      },
      columns: [
        {
          title: "名称",
          key: "name",
          minWidth: 80,
        },
        {
          title: "图片",
          key: "resource",
          width: 150,
          slot: "imageSlot",
        },
        {
          title: "创建人",
          key: "createBy",
          minWidth: 80,
        },
        {
          title: "Create time",
          key: "createTime",
          minWidth: 120,
        },
        {
          title: "最后modify人",
          key: "updateBy",
          minWidth: 80,
        },
        {
          title: "更新时间",
          key: "updateTime",
          minWidth: 120,
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
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
                      this.edit(params.row);
                    },
                  },
                },
                "edit"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "delete"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, //items数
    };
  },

  methods: {
    // 分Page 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    // 分Page 改变Page数
    changePageSize(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    //切换tab
    handleClickType(v) {
      this.searchForm.pageNumber = 1; // 当前Page数
      this.searchForm.pageSize = 10; // Page面大小
      //source
      if (v == "RESOURCE") {
        this.searchForm.type = "RESOURCE";
      }
      //滑块源
      if (v == "SLIDER") {
        this.searchForm.type = "SLIDER";
      }
      this.getDataList();
    },
    //获取验证码源数据
    getDataList() {
      this.loading = true;
      API_Setting.verificationPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.loading = false;
    },
    //添加验证码源
    add() {
      this.$refs.form.resetFields()
      this.form.type = this.searchForm.type;
      this.modalVisible = true;
      this.modalType = 0;
      this.modalTitle = "添加验证码源";
    },
    //modify验证码源
    edit(v) {
      this.form.name = v.name;
      this.form.id = v.id;
      this.form.resource = v.resource;
      this.form.type = v.type;

      this.modalType = 1;
      this.modalVisible = true;
      this.modalTitle = "modify验证码源";
    },
    //Submit表单
    handleSubmit() {
      this.form.type = this.searchForm.type;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if (this.modalType == 0) {
            // 添加
            delete this.form.id;
            API_Setting.addVerification(this.form).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("添加success");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          } else {
            // edit
            API_Setting.editVerification(this.form.id, this.form).then(
              (res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("modifysuccess");
                  this.getDataList();
                  this.modalVisible = false;
                }
              }
            );
          }
        }
      });
    },
    //delete验证码源
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "确认要delete此验证码源?",
        loading: true,
        onOk: () => {
          // delete
          API_Setting.delVerification(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("验证码源已delete");
              this.getDataList();
            }
          });
        },
      });
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
