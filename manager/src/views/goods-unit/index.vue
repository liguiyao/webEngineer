<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" type="primary">Add</Button>
        <Button @click="delAll">batch delete</Button>
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
        <FormItem label="Unit" prop="name">
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
  addGoodsUnit,
  getGoodsUnitPage,
  updateGoodsUnit,
  delGoodsUnit
} from "@/api/index";

import {regular} from "@/utils";

export default {
  name: "goods-unit",
  data() {
    return {
      loading: true, // 表单加载state
      modalVisible: false, // 添加或edit显示
      modalTitle: "", // 添加或edit标题
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        name: "",
      },
      form: {
        // 添加或edit表单对象初始化数据
        name: "",
      },
      // 表单验证规则
      formValidate: {
        name: [
          regular.REQUIRED,
          regular.VARCHAR5
        ]
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
          title: "Unit",
          key: "name",
          minWidth: 120
        },

        {
          title: "Create time",
          key: "createTime",
          width: 180
        },
        {
          title: "update time",
          key: "updateTime",
          width: 180
        },
        {
          title: "operator",
          key: "createBy",
          minWidth: 150
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
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    // 清除选中
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    // 选中回调
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 获取列表数据
    getDataList() {
      this.loading = true;

      getGoodsUnitPage(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // modify后Submit
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          if (this.modalTitle == "add") {

            if(this.data.find(item=>item.name == this.form.name)){
              this.$Message.error('Please dont repeat add!')
              this.submitLoading = false
              return
            }
            // 添加 避免edit后传入id等数据 记得delete
            delete this.form.id;
            addGoodsUnit(this.form).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          } else {
            // edit
            updateGoodsUnit(this.id, this.form).then((res) => {
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
      this.modalTitle = "add";
      this.form = {};
      this.$refs.form.resetFields();

      this.modalVisible = true;
    },
    // edit
    edit(v) {
      this.id = v.id;
      this.modalTitle = "modify";
      this.modalVisible = true;
      this.form.name = v.name;
    },
    // delete
    remove(v) {
      this.$Modal.confirm({
        title: "confirm delete",
        // 记得确认modify此处
        content: "confirm to delete " + v.name + " ?",
        loading: true,
        onOk: () => {
          // delete
          delGoodsUnit(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operation success");
              this.getDataList();
            }
          });
        },
      });
    },
    // 全部delete
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("no select data");
        return;
      }
      this.$Modal.confirm({
        title: "confirm delete",
        content: "confirm delete selected " + this.selectCount + " data?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量delete
          delGoodsUnit(ids).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operation success");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  },
};
</script>
