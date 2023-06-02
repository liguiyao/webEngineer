<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" type="primary">添加</Button>
      </Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          ref="table"
          sortable="custom"
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
        <FormItem label="自定义分词" prop="name">
          <Input v-model="form.name" clearable style="width: 100%" />
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
import {
  getCustomWordsPage,
  delCustom,
  insertCustomWords,
  updateCustomWords
} from "@/api/index";

import { regular } from "@/utils";
export default {
  name: "custom-words",
  data() {
    return {
      loading: true, // 表单加载状态
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        words: "",
      },
      form: {
        // 添加或编辑表单对象初始化数据
        name: "",
      },
      // 表单验证规则
      formValidate: {
        name: [
          regular.REQUIRED,
          regular.VARCHAR20
        ],
      },
      submitLoading: false, // 添加或编辑Submit状态
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
          title: "自定义分词",
          key: "name",
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
    init() {
      this.getDataList();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    // 选中状态变更
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;

      getCustomWordsPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // Submit数据
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          if (this.modalType == 0) {
            delete this.form.id;
            insertCustomWords(this.form).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          } else {
            this.form.id = this.id;
            // 编辑
            updateCustomWords(this.form).then((res) => {
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
    // 添加
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
      this.form.name = v.name;
    },
    // delete
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        // 记得确认modify此处
        content: "您确认要delete " + v.name + " ?",
        loading: true,
        onOk: () => {
          // delete
          delCustom(v.id).then((res) => {
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
        content: "您确认要delete所选的 " + this.selectCount + " 条数据?",
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
