<template>
  <div>
    <Card>
        <Form ref="searchForm" :model="searchForm"  class="search-form">
          <Form-item label="member name"  class="flex" prop="memberName">
            <Input
              type="text" v-model="searchForm.memberName" clearable
              style="width: 200px"></Input>
          </Form-item>
          <Form-item label="code" class="flex">
            <Input
              type="text" v-model="searchForm.sn" clearable
              style="width: 200px"></Input>
          </Form-item>
          <Form-item label="status"
                     style="width: 200px">
            <Select v-model="searchForm.distributionCashStatus" clearable style="width: 150px">
                <Option v-for="item in cashStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button @click="handleSearch" type="primary">search</Button>
          </Form-item>
        </Form>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10"></Table>
      <Row type="flex" justify="end" class="page padding-row">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="500">
      <Form ref="form" :model="form" :label-width="100"  >
      <FormItem label="code">
          <Input disabled v-model="form.sn" clearable style="width:100%"/>
        </FormItem>
        <FormItem label="member name">
          <Input disabled v-model="form.distributionName" clearable style="width:100%"/>
        </FormItem>
        <FormItem label="amount">
          <Input disabled v-model="form.price" clearable style="width:100%"/>
        </FormItem>
        <FormItem label="pass or not" prop="result" v-if="handleStatus =='edit'">
             <RadioGroup v-model="result" type="button" button-style="solid">
                 <Radio label="VIA_AUDITING">pass</Radio>
                 <Radio label="FAIL_AUDITING">reject</Radio>
             </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" v-if="handleStatus == 'edit'">
        <Button type="text" @click="modalVisible=false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
        getDistributionCash,
        auditDistributionCash
    } from "@/api/distribution";
import {cashStatusList} from './dataJson'
export default {
  name: "distributionCash",
  data() {
    return {
      cashStatusList, // state列表
      loading: true, // 表单加载state
      modalVisible: false, // 添加或edit显示
      modalTitle: "", // 添加或edit标题
      result: 'FAIL_AUDITING', // 是否pass
      searchForm: { // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
      },
      handleStatus:'edit',// 判断是edit还是View
      form: { // 添加或edit表单对象初始化数据
        sn: "",
        memberName: "",
        price: "",
      },
      submitLoading: false, // 添加或editSubmitstate
      columns: [
        {
          title: "code",
          key: "sn",
          minWidth: 200
        },
        {
          title: "member name",
          key: "distributionName",
          minWidth: 120
        },
        {
          title: "Apply  amount",
          key: "price",
          minWidth: 90,
          render: (h, params) => {
            return h("div", this.$options.filters.unitPrice(params.row.price,'RM'));
          }
        },
        {
          title: "Apply time",
          key: "createTime",
          minWidth: 130
        },
        {
          title: "during time",
          key: "updateTime",
          minWidth: 130
        },
        {
          title: "status",
          key: "distributionCashStatus",
          minWidth: 100,
          render: (h, params) => {
              if (params.row.distributionCashStatus == 'APPLY') {
                   return h("div", "waiting");
              }
              if (params.row.distributionCashStatus == 'VIA_AUDITING') {
                   return h("div", "pass");
              }
              if (params.row.distributionCashStatus == 'FAIL_AUDITING') {
                   return h("div", "reject");
              }
            },
         },
        {
          title: "operation",
          key: "action",
          align: "center",
          fixed: "right",
          width: 130,
          render: (h, params) => {
            if(params.row.distributionCashStatus != 'APPLY'){
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.view(params.row);
                        }
                      }
                    },
                    "check"
                  ),

                ]);
            }else {
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
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
                    "audit"
                  ),

                ]);
            }
          }
        }
      ],
      data: [], // 表单数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getDataList();
    },
    // 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    // 改变Page数
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
    // 获取列表数据
    getDataList() {
      this.loading = true;
      // 带多items件search参数获取表单数据 Please 自行modify接口
      getDistributionCash(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    // pass还是拒绝Apply
    handleSubmit() {
      let result = "reject"
      if(this.result == 'VIA_AUDITING'){
        result = "pass"
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "confirm",
            content: "sure to "+result+"?",
            loading: true,
            onOk: () => {
                auditDistributionCash(this.form.id,{result:this.result}).then(res => {
                    if (res.success) {
                      this.$Modal.remove();
                      this.$Message.success("audit success");
                      this.getDataList();
                      this.modalVisible = false;
                    } else {
                      this.modalVisible = false;
                    }
                });
            }
          })
        }
      });
    },
    // 弹出modal 审核
    edit(v) {
      this.modalTitle = "audit";
      this.handleStatus = 'edit';
      this.$refs.form.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      this.form = JSON.parse(JSON.stringify(v));
      this.modalVisible = true;
    },
    // 弹出modal View
    view(v){
      this.modalTitle = "check";
      this.handleStatus = 'view';
      this.$refs.form.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.form = data;
      this.modalVisible = true;

    }
  },
  mounted() {
    this.init();
  }
};
</script>
