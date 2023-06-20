<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" type="primary">添加</Button>
        <Button @click="delAll">批量delete</Button>
      </Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          ref="table"
          @on-selection-change="changeSelect"
        ></Table>
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
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
        <FormItem label="敏感词" prop="sn">
          <Input v-model="form.sensitiveWord" clearable style="width: 100%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getSensitiveWordsPage,
  delSensitive,
  insertSensitiveWords,
  updateSensitiveWords
} from "@/api/index";
export default {
  name: "sensitive-words",
  data() {
    return {
      loading: true, // 表单加载state
      modalType: 0, // 添加或edit标识
      modalVisible: false, // 添加或edit显示
      modalTitle: "", // 添加或edit标题
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        sensitiveWord: "",
      },
      form: {
        // 添加或edit表单对象初始化数据
        sensitiveWord: "",
      },
      // 表单验证规则
      formValidate: {
        sensitiveWord: [
          {
            required: true,
            message: "Please enter 敏感词",
            trigger: "blur",
          },
        ],
      },
      submitLoading: false, // 添加或editSubmitstate
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "敏感词",
          key: "sensitiveWord",
          minWidth: 120
        },
        {
          title: "Create time",
          key: "createTime",
          width: 200
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: 200
        },
        {
          title: "operation人",
          key: "createBy",
          minWidth: 150
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
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
                      this.detail(params.row);
                    },
                  },
                },
                "modify"
              ),
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
      total: 0, // 表单数据总数
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getDataList();
    },
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
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 获取数据
    getDataList() {
      this.loading = true;

      getSensitiveWordsPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // Submit
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          if (this.modalType == 0) {
            // 添加 避免edit后传入id等数据 记得delete
            delete this.form.id;
            insertSensitiveWords(this.form).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          } else {
            // edit
            updateSensitiveWords(this.id,this.form).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          }
        }
      });
    },
    // 添加敏感词
    add() {
      this.modalType = 0;
      this.modalTitle = "添加";
      this.form = {}
      this.$refs.form.resetFields();

      this.modalVisible = true;
    },
    // modify
    detail(v) {
      this.modalType = 1;
      this.id = v.id;
      this.modalTitle = "modify";
      this.modalVisible = true;
      this.form.sensitiveWord = v.sensitiveWord;
    },
    // delete
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "您确认要delete " + v.sensitiveWord + " ?",
        loading: true,
        onOk: () => {
          // delete
          delSensitive(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getDataList();
            }
          });
        },
      });
    },
    // 批量delete
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未select要delete的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete所选的 " + this.selectCount + " items数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量delete
          delSensitive(ids).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.clearSelectAll();
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
