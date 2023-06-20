<template>
  <div class="self-address">
    <Card>
      <Button @click="add" type="primary">添加</Button>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        ref="table"
        style="margin-top:10px"
      ></Table>
      <Row type="flex" justify="end" style="margin-top:10px;">
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
        <FormItem label="名称" prop="addressName">
          <Input v-model="form.addressName" clearable style="width: 90%"/>
        </FormItem>
        <FormItem label="Full address" prop="address">
          <Input v-model="form.address" @on-focus="$refs.liliMap.showMap = true" clearable style="width: 90%"/>
        </FormItem>
        <FormItem label="联系电话" prop="mobile">
          <Input v-model="form.mobile" clearable style="width: 90%" maxlength="11"/>
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
    <liliMap ref="liliMap" @getAddress="getAddress"></liliMap>
  </div>
</template>

<script>
  import * as API_Shop from "@/api/shops";
  import { validateMobile } from "@/libs/validate";
  import liliMap from "@/views/my-components/map/index";


  export default {
    name: "shopAddress",
    components: {
      liliMap
    },
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
        },
        form: {
          // 添加或edit表单对象初始化数据
          addressName: "",
          center: "",
          address:"",//Full address
          mobile:"",//Phone number
        },

        // 表单验证规则
        formValidate: {
          addressName: [
            {
              required: true,
              message: "Please enter address名称",
              trigger: "blur",
            },
          ],
          longitude: [
            {
              required: true,
              message: "Please enter address经度",
              trigger: "blur",
            },
          ],
          latitude: [
            {
              required: true,
              message: "Please enter address纬度",
              trigger: "blur",
            },
          ],
          mobile: [
            {
              required: true,
              message: "Please enter 联系电话号",
              trigger: "blur",
            },
            { validator: validateMobile,
              trigger: "blur"
            }
          ],
          address: [
            {
              required: true,
              message: " ",
              trigger: "blur",
            },
          ],
        },
        submitLoading: false, // 添加或editSubmitstate
        columns: [
          // 表头
          {
            title: "self-lifting点名称",
            key: "addressName",
            minWidth: 120,
            sortable: false,
          },
          {
            title: "Full address",
            key: "address",
            minWidth: 280
          },
          {
            title: "Create time",
            key: "createTime",
            minWidth: 120,
            sortable: true,
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
                      type: "success",
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
                        this.deleteSubmit(params.row);
                      },
                    },
                  },
                  "delete"
                )
              ]);
            },
          },
        ],
        data: [], // 表单数据
        total: 0, // 表单数据总数
      };
    },
    methods: {
      init() { // 初始化数据
        this.getDataList();
      },
      // 分Page 改变Page码
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getDataList();
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
      // reset
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getDataList();
      },
      //获取address
      getAddress(item){
        this.$set(this.form, 'address', item.addr)
        this.form.address = item.address
        this.form.center = item.position.lat + "," + item.position.lng
      },
      // 获取数据
      getDataList() {
        this.loading = true;
        API_Shop.getShopAddress(this.searchForm).then((res) => {
          this.loading = false;
          if (res.success) {
            this.data = res.result.records;
            this.total = res.result.total;
          }
        });
        this.total = this.data.length;
        this.loading = false;
      },
      //添加弹出框
      add() {
        this.$refs.form.resetFields()
        this.modalVisible = true
        this.modalTitle = "添加self-liftingaddress"
      },
      //modify弹出框
      edit(v) {
        this.modalType = 1
        this.modalVisible = true
        this.modalTitle = "modifyself-liftingaddress"
        this.form.id = v.id
        this.form.address = v.address
        this.form.addressName = v.addressName
        this.form.mobile = v.mobile
        this.form.center = v.center
        this.form.longitude = v.center.split(',')[0]
        this.form.latitude = v.center.split(',')[1]
      },

      //Save或者edit
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            if (this.modalType == 0) {
              // 添加
              delete this.form.id;
              API_Shop.addShopAddress(this.form).then((res) => {
                this.submitLoading = false;
                if (res.success) {
                  this.$Message.success("添加success");
                  this.getDataList();
                  this.modalVisible = false;
                }
              });
            } else {
              // edit
              API_Shop.editShopAddress(this.form.id, this.form).then((res) => {
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
      //delete
      deleteSubmit(v){
        this.$Modal.confirm({
          title: "确认delete",
          // 记得确认modify此处
          content: "确认deleteself-liftingaddress么？",
          loading: true,
          onOk: () => {
            API_Shop.deleteShopAddress(v.id).then((res) => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success("此自self-liftingaddress已delete");
                this.init();
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

