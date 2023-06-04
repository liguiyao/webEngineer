<template>
  <div class="search">
    <Card>
      <Row class="operation padding-row">
        <Button @click="add" type="primary">Add</Button>
      </Row>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
      >
        <!-- 页面展示 -->
        <template slot="disableSlot" slot-scope="{row}">
          <i-switch size="large"  :true-value="true" :false-value="false"  :value="row.switch" @on-change="changeSwitch(row)">
            <span slot="open">Opening</span>
            <span slot="close">disable</span>
          </i-switch>
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
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="120" :rules="formValidate">
        <FormItem label="Logistics company name" prop="name">
          <Input v-model="form.name" clearable style="width: 100%"/>
        </FormItem>
        <FormItem label="Logistics company code" prop="code">
          <Input v-model="form.code" clearable style="width: 100%"/>
        </FormItem>
        <FormItem label="支持电子面单">
          <i-switch   v-model="form.standBy" size="large">
            <span slot="open">ON</span>
            <span slot="close">OFF</span>
          </i-switch>
        </FormItem>
        <FormItem label="电子面单表单">
          <Input v-model="form.formItems" clearable style="width: 100%"/>
        </FormItem>
        <FormItem label="status" prop="disabled">

          <i-switch true-value="OPEN" false-value="CLOSE" v-model="form.disabled" size="large">
            <span slot="open">Enable</span>
            <span slot="close">Disable</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit"
        >Submit
        </Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getLogisticsPage,
    updateLogistics,
    addLogistics,
    delLogistics,
  } from "@/api/logistics";

  export default {
    name: "logistics",
    data() {
      return {
        loading: true, // 表单加载状态
        modalVisible: false, // 添加或编辑显示
        modalTitle: "", // 添加或编辑标题
        searchForm: {
          // search框初始化对象
          pageNumber: 1, // 当前页数
          pageSize: 20, // 页面大小
          sort: "createTime", // default排序字段
          order: "desc", // default排序方式
          name: "",
        },
        form: {
          // 添加或编辑表单对象初始化数据
          name: "",
          disabled:"CLOSE"
        },
        // 表单验证规则
        formValidate: {
          name: [
            {
              required: true,
              message: "Please enter Logistics company 名称",
              trigger: "blur",
            },
          ],
        },
        submitLoading: false, // 添加或编辑Submit状态
        columns: [
          {
            title: "Logistics company name",
            key: "name",
            minWidth: 120,
            sortable: false,
          },
          {
            title: "Logistics company code",
            key: "code",
            minWidth: 120,
            sortable: false,
          },
          {
            title: "status",
            key: "disabled",
            width: 150,
            slot: "disableSlot",
          },
          {
            title: "Create time",
            key: "createTime",
            width: 180,
            sortable: false,
          },
          {
            title: "operation",
            key: "action",
            align: "center",
            width: 150,
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
      // 初始化
      init() {
        this.getDataList();
      },
      // 分页 改变页码
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getDataList();
      },
      // 分页 改变页数
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getDataList();
      },
      // 获取列表
      getDataList() {
        this.loading = true;

        getLogisticsPage(this.searchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            const data = res.result.records;
            data.forEach(e => {
              e.switch = e.disabled === 'OPEN' ? true : false;
              e.standBy = e.standBy == 'null' || !e.standBy ? false : true;
            });
            this.data = data;
            console.log(data)
            this.total = res.result.total;
          }
        });
        this.total = this.data.length;
        this.loading = false;
      },
      // switch 切换状态
      changeSwitch (v) {
        this.form.name = v.name;
        this.form.code = v.code;
        this.form.standBy = v.standBy;
        this.form.formItems = v.formItems;
        this.form.disabled = v.disabled === 'CLOSE' ? 'OPEN' : 'CLOSE';
        updateLogistics(v.id, this.form).then((res) => {
          if (res.success) {
            this.$Message.success("operationsuccess");
            this.getDataList();
          }
        });
      },
      // 确认Submit
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitLoading = true;

            if (this.modalTitle == "添加") {
              // 添加 避免编辑后传入id等数据 记得delete
              delete this.form.id;


              addLogistics(this.form).then((res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("operationsuccess");
                  this.getDataList();
                  this.modalVisible = false;
                }
              });
            } else {
              // 编辑
              updateLogistics(this.id, this.form).then((res) => {
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
      // 添加信息
      add() {
        this.modalTitle = "add";
        this.form = {};
        this.$refs.form.resetFields();

        this.modalVisible = true;
      },
      // 编辑
      detail(v) {
        this.id = v.id;
        this.modalTitle = "modify";
        this.modalVisible = true;

        this.form.name = v.name;
        this.form.code = v.code;
        console.log(v)
        this.form.standBy = v.standBy;
        this.form.formItems = v.formItems;



        this.form.disabled = v.disabled
      },
      // deleteLogistics company
      remove(v) {
        this.$Modal.confirm({
          title: "confirm delete",
          // 记得确认modify此处
          content: "confirm to delete " + v.name + " ?",
          loading: true,
          onOk: () => {
            // delete
            delLogistics(v.id).then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success("operationsuccess");
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
