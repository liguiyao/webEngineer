<template>
  <div>
    <Card>
      <div class="operation mb_10">
        <Button @click="addParent" type="primary" icon="md-add">添加积分Goods Category</Button>
        <Button icon="md-refresh" @click="init">刷新</Button>
      </div>
      <tree-table
        ref="treeTable"
        size="default"
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :border="true"
        :show-index="false"
        :is-fold="true"
        :expand-type="false"
        primary-key="id"
      >
        <template slot="action" slot-scope="scope">
          <Button @click.native="edit(scope.row)" style="margin-right:10px;" size="small">edit</Button>
          <Button @click.native="remove(scope.row)" type="primary" size="small">delete</Button>
        </template>
      </tree-table>
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form
        ref="form"
        :model="formAdd"
        :label-width="100"
        :rules="formValidate"
      >
        <FormItem label="分类名称" prop="name">
          <Input v-model="formAdd.name" clearable style="width: 100%" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <InputNumber v-model="formAdd.sortOrder" :min="0" clearable style="width: 100%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="Submit"
          >Submit</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getPointsGoodsCategoryList,
  addPointsGoodsCategory,
  updatePointsGoodsCategory,
  deletePointsGoodsCategoryById,
} from "@/api/promotion";
import TreeTable from "@/components/tree-table/Table/Table";

export default {
  name: "pointsGoodsCategory",
  components: {
    TreeTable
  },
  data() {
    return {
      submitLoading:false,
      loading: false, // 加载state
      modalType: 0, // 添加或edit标识
      modalVisible: false, // 添加或edit显示
      modalTitle: "", // 添加或edit标题
      showParent: false, // 是否展示上级菜单
      parentTitle: "", // 父级菜单名称
      formAdd: {
        // 添加或edit表单对象初始化数据
        parentId: 0,
        name: "",
        deleteFlag: 0,
        level: 0,
        sortOrder:1
      },
      // 表单验证规则
      formValidate: {
        name: [{ required: true, message: "Goods Category名称不能为空" }],
      },
      columns: [
        {
          title: "分类名称",
          key: "name",
          minWidth: "120px",
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          headerAlign: "center",
          width: "400px",
          type: "template",
          template: "action",
        },
      ],
      tableData: [], // 表格数据
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getAllList();
    },
    // edit分类
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "edit";
      this.formAdd.id = v.id;
      this.formAdd.name = v.name;
      this.formAdd.sortOrder = v.sortOrder;
      this.showParent = false;
      this.modalVisible = true;
    },
    // 添加顶级分类
    addParent() {
      this.modalType = 0;
      this.modalTitle = "添加积分Goods Category";
      this.parentTitle = "顶级分类";
      this.showParent = true;
      this.$refs.form.resetFields();
      delete this.formAdd.id;
      this.formAdd.parentId = 0;
      this.modalVisible = true;
    },
    // Submit
    Submit() {
      this.$refs.form.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.submitLoading = true;
          if (this.modalType === 0) {
            // 添加 避免edit后传入id等数据 记得delete
            delete this.formAdd.id;
            addPointsGoodsCategory(this.formAdd).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("添加success");
                this.getAllList();
                this.modalVisible = false;
                this.$refs.form.resetFields();
              }
            });
          } else {
            // edit
            updatePointsGoodsCategory(this.formAdd).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("modifysuccess");
                this.getAllList();
                this.modalVisible = false;
                this.$refs.form.resetFields();
              }
            });
          }
        }
      });
    },
    // delete
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete " + v.name + " ?",
        loading: true,
        onOk: () => {
          // delete
          deletePointsGoodsCategoryById(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getAllList();
            }
          });
        },
      });
    },
    // 获取所有分类
    getAllList() {
      this.loading = true;
      getPointsGoodsCategoryList().then((res) => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.result.records;
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>


</style>
