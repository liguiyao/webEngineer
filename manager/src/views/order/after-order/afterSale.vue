<template>
  <div class="search">
    <Card>
      <Tabs value="RETURN_MONEY" @on-click="handleClickType">
        <TabPane label="refund" name="RETURN_MONEY">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add"  type="primary" >添加</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
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
        </TabPane>
        <TabPane label="Cancel" name="CANCEL">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add" type="primary" icon="md-add">添加</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
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
        </TabPane>
        <TabPane label="Return goods" name="RETURN_GOODS">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add" type="primary" icon="md-add">添加</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
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
        </TabPane>
        <TabPane label="Complaint" name="COMPLAIN">
          <Row class="operation" style="margin-bottom: 10px">
            <Button @click="add" type="primary" icon="md-add">添加</Button>
            <Button @click="getDataList" icon="md-refresh">刷新</Button>
          </Row>
          <Table
            :loading="loading"
            border
            :columns="columns"
            :data="data"
            ref="table"
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
        <FormItem label="after sale原因" prop="reason">
          <Input v-model="form.reason" maxlength="20" clearable style="width: 100%"/>
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
  import * as API_Order from "@/api/order";

  export default {
    data() {
      return {
        modalVisible: false,//添加after sale原因弹出框
        modalTitle: "", //添加after sale原因弹出框标题
        loading: true, // 表单加载state
        submitLoading: false, // 添加或editSubmitstate
        form: {
          reason: ""
        },//添加edit表单
        formValidate: {
          reason: [
            {
              required: true,
              message: "Please enter after sale原因",
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
          serviceType: "RETURN_MONEY"
        },
        columns: [
          {
            title: "创建人",
            key: "createBy",
            minWidth: 120,
          },
          {
            title: "原因",
            key: "reason",
            minWidth: 400,
          },
          {
            title: "时间",
            key: "createTime",
            minWidth: 100,
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
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
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
                      }
                    }
                  },
                  "delete"
                )
              ]);
            },
          },
        ],
        data: [], // 表单数据
        total: 0,//items数
      };
    },

    methods: {
      // 分Page modifyPage码
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getDataList();
        this.clearSelectAll();
      },
      // 分Page modifyPage数
      changePageSize(v) {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = v;
        this.getDataList();
      },
      //切换tab
      handleClickType(v) {
        this.searchForm.pageNumber = 1 // 当前Page数
        this.searchForm.pageSize = 10 // Page面大小
        //refund
        if (v == "RETURN_MONEY") {
          this.searchForm.serviceType = "RETURN_MONEY"
        }
        //Return goods
        if (v == "RETURN_GOODS") {
          this.searchForm.serviceType = "RETURN_GOODS"
        }
        //Cancel
        if (v == "CANCEL") {
          this.searchForm.serviceType = "CANCEL"
        }
        //Cancel
        if (v == "COMPLAIN") {
          this.searchForm.serviceType = "COMPLAIN"
        }
        this.getDataList();
      },
      //获取after sale原因数据
      getDataList() {
        this.loading = true;
        API_Order.getAfterSaleReasonPage(this.searchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.data = res.result.records;
            this.total = res.result.total
          }
        });
        this.loading = false;
      },
      //添加after sale原因
      add() {
        this.form.reason = ""
        this.modalVisible = true
        this.modalTitle = "添加after sale原因"
      },
      //modifyafter sale原因
      edit(v) {

        this.form.reason = v.reason
        this.form.id = v.id

        this.modalVisible = true
        this.modalTitle = "modifyafter sale原因"
      },
      //Submit表单
      handleSubmit() {
        this.form.serviceType = this.searchForm.serviceType
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            if (this.modalTitle == '添加after sale原因') {
              // 添加
              delete this.form.id;
              API_Order.addAfterSaleReason(this.form).then((res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("添加success");
                  this.getDataList();
                  this.modalVisible = false;
                }
              });
            } else {
              // edit
              API_Order.editAfterSaleReason(this.form.id, this.form).then((res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("modifysuccess");
                  this.getDataList();
                  this.modalVisible = false;
                }
              });
            }
          }
        });
      },
      //deleteafter sale原因
      remove(v) {
        this.$Modal.confirm({
          title: "确认delete",
          // 记得确认modify此处
          content: "确认要delete此after sale原因?",
          loading: true,
          onOk: () => {
            // delete
            API_Order.delAfterSaleReason(v.id).then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success("after sale原因已delete");
                this.getDataList();
              }
            });
          },
        });
      }

    },
    mounted() {
      this.getDataList();
    },
  };
</script>
