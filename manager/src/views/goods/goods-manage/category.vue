<template>
  <div>
    <Card>
      <div class="mb_10">
        <Button @click="addParent" icon="md-add">Add classification</Button>
      </div>
      <Table
      update-show-children
        class="table"
        :load-data="handleLoadData"
        row-key="id"
        :loading="loading"
        :data="tableData"
        :columns="columns"
      >
        <template slot="action" slot-scope="scope">
          <Dropdown v-show="scope.row.level == 2" trigger="click">
            <Button size="small">
              band
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="brandOperation(scope.row)"
                >edit band</DropdownItem
              >
              <DropdownItem @click.native="specOperation(scope.row)"
                >edit specification</DropdownItem
              >
              <DropdownItem @click.native="parameterOperation(scope.row)"
                >edit parameter</DropdownItem
              >
            </DropdownMenu>
          </Dropdown>

          &nbsp;
          <Dropdown trigger="click">
            <Button size="small">
              operation
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="edit(scope.row)">edit</DropdownItem>
              <DropdownItem
                v-if="scope.row.deleteFlag == 1"
                @click.native="enable(scope.row)"
                >enable</DropdownItem
              >
              <DropdownItem
                v-if="scope.row.deleteFlag == 0"
                @click.native="disable(scope.row)"
                >disable</DropdownItem
              >
              <DropdownItem @click.native="remove(scope.row)">delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          &nbsp;
          <Button
            v-show="scope.row.level != 2"
            type="primary"
            @click="addChildren(scope.row)"
            size="small"
            icon="md-add"
            style="margin-right: 5px"
            >add sub classification
          </Button>
        </template>

        <template slot="commissionRate" slot-scope="scope">
          {{ scope.row.commissionRate }}%
        </template>

        <template slot="deleteFlag" slot-scope="{ row }">
          <Tag
            :class="{ ml_10: row.deleteFlag }"
            :color="row.deleteFlag == false ? 'success' : 'error'"
          >
            {{ row.deleteFlag == false ? "enable" : "disable" }}</Tag
          >
        </template>
      </Table>

      <Modal
        :title="modalTitle"
        v-model="modalVisible"
        :mask-closable="false"
        :width="500"
      >
        <Form ref="form" :model="formAdd" :label-width="100" :rules="formValidate">
          <div v-if="showParent">
            <FormItem label="super classification" prop="parentId">
              {{ parentTitle }}
              <Input
                v-model="formAdd.parentId"
                clearable
                style="width: 100%; display: none"
              />
            </FormItem>
          </div>
          <FormItem label="level" prop="level" style="display: none">
            <Input v-model="formAdd.level" clearable style="width: 100%" />
          </FormItem>
          <FormItem label="level name" prop="name">
            <Input v-model="formAdd.name" clearable style="width: 100%" />
          </FormItem>
          <FormItem label="classification icon" prop="image" v-if="formAdd.level !== 1">
            <upload-pic-input
              v-model="formAdd.image"
              style="width: 100%"
            ></upload-pic-input>
          </FormItem>
          <FormItem label="sort number" prop="sortOrder" style="width: 345px">
            <InputNumber v-model="formAdd.sortOrder"></InputNumber>
          </FormItem>
          <FormItem label="commission(%)" prop="commissionRate" style="width: 345px">
            <InputNumber v-model="formAdd.commissionRate"></InputNumber>
          </FormItem>
          <FormItem label="enable" prop="deleteFlag">
            <i-switch
              size="large"
              v-model="formAdd.deleteFlag"
              :true-value="0"
              :false-value="1"
            >
              <span slot="open">enable</span>
              <span slot="close">disable</span>
            </i-switch>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="modalVisible = false">Cancel</Button>
          <Button type="primary" :loading="submitLoading" @click="Submit">Submit</Button>
        </div>
      </Modal>

      <Modal
        :title="modalBrandTitle"
        v-model="modalBrandVisible"
        :mask-closable="false"
        :width="500"
      >
        <Form ref="brandForm" :model="brandForm" :label-width="100">
          <Select v-model="brandForm.categoryBrands" filterable multiple>
            <Option v-for="item in brandWay" :value="item.id" :key="item.id">{{
              item.name
            }}</Option>
          </Select>
        </Form>
        <div slot="footer">
          <Button type="text" @click="modalBrandVisible = false">Cancel</Button>
          <Button type="primary" :loading="submitLoading" @click="saveCategoryBrand"
            >Submit</Button
          >
        </div>
      </Modal>

      <Modal
        :title="modalSpecTitle"
        v-model="modalSpecVisible"
        :mask-closable="false"
        :width="500"
      >
        <Form ref="specForm" :model="specForm" :label-width="100">
          <Select v-model="specForm.categorySpecs" multiple>
            <Option
              v-for="item in specifications"
              :value="item.id"
              :key="item.id"
              :label="item.specName"
            >
            </Option>
          </Select>
        </Form>
        <div slot="footer">
          <Button type="text" @click="modalSpecVisible = false">Cancel</Button>
          <Button type="primary" :loading="submitLoading" @click="saveCategorySpec"
            >Submit</Button
          >
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import {
  insertCategory,
  updateCategory,
  getBrandListData,
  delCategory,
  getCategoryBrandListData,
  saveCategoryBrand,
  getSpecificationList,
  getCategorySpecListData,
  disableCategory,
  saveCategorySpec,
  getCategoryTree,
} from "@/api/goods";

import uploadPicInput from "@/components/lili/upload-pic-input";
import { regular } from "@/utils";
export default {
  name: "goods-category",
  components: {
    uploadPicInput,
  },
  data() {
    return {
      submitLoading: false, //加载state
      categoryList: [], // 分类列表
      loading: false, // 加载state
      brands: [], //品牌集合
      specifications: [], //规格集合
      categoryId: "", // 分类id
      categorySpecs: [], //已经select的规格
      modalType: 0, // 添加或edit标识
      modalVisible: false, // 添加或edit显示
      modalBrandVisible: false, //品牌关联edit显示
      modalSpecVisible: false, //品牌关联edit显示
      modalTitle: "", // 添加或edit标题
      showParent: false, // 是否展示上级菜单
      parentTitle: "", // 父级菜单名称
      modalBrandTitle: "", // 品牌弹窗标题
      modalSpecTitle: "", // 规格弹窗标题
      formAdd: {
        // 添加或edit表单对象初始化数据
        parentId: "",
        name: "",
        image: "",
        sortOrder: 0,
        deleteFlag: 0,
        commissionRate: 0,
        level: 0,
      },
      brandForm: {
        categoryBrands: [],
      },
      brandWay: "", //Please 求绑定品牌的信息
      specForm: {}, // 规格数据
      // 表单验证规则
      formValidate: {
        commissionRate: [regular.REQUIRED, regular.INTEGER],
        name: [regular.REQUIRED, regular.VARCHAR20],
        sortOrder: [regular.REQUIRED, regular.INTEGER],
      },
      columns: [
        {
          title: "classification name",
          key: "name",
          tree: true,
        },
        {
          title: "status",
          slot: "deleteFlag",
        },
        {
          title: "commission",
          key: "commissionRate",

          slot: "commissionRate",
        },
        {
          title: "operation",
          key: "action",

          slot: "action",
        },
      ],
      tableData: [], // 表格数据
      categoryIndex: 0, // 分类id
      checkedCategoryChildren: "", //选中的分类子级
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getAllList(0);
      this.getBrandList();
      this.getSpecList();
    },
    //获取所有品牌
    getBrandList() {
      getBrandListData().then((res) => {
        this.brandWay = res;
      });
    },
    //获取所有规格
    getSpecList() {
      getSpecificationList().then((res) => {
        if (res.length != 0) {
          this.specifications = res.result;
        }
      });
    },
    //弹出品牌关联框
    brandOperation(v) {
      getCategoryBrandListData(v.id).then((res) => {
        this.categoryId = v.id;
        this.modalBrandTitle = "bind brand";
        this.brandForm.categoryBrands = res.result.map((item) => item.id);
        this.modalBrandVisible = true;
      });
    },
    //弹出规格关联框
    specOperation(v) {
      getCategorySpecListData(v.id).then((res) => {
        this.categoryId = v.id;
        this.modalSpecTitle = "specification";
        this.specForm.categorySpecs = res.map((item) => item.id);
        this.modalSpecVisible = true;
      });
    },
    //Save分类规格绑定
    saveCategorySpec() {
      saveCategorySpec(this.categoryId, this.specForm).then((res) => {
        this.submitLoading = false;
        if (res.success) {
          this.$Message.success("operationsuccess");
          this.modalSpecVisible = false;
        }
      });
    },
    //Save分类品牌绑定
    saveCategoryBrand() {
      saveCategoryBrand(this.categoryId, this.brandForm).then((res) => {
        this.submitLoading = false;
        if (res.success) {
          this.$Message.success("operationsuccess");
          this.modalBrandVisible = false;
        }
      });
    },
    // edit绑定参数
    parameterOperation(v) {
      this.$router.push({ name: "parameter", query: { id: v.id } });
    },
    // 添加子分类
    addChildren(v) {
      this.modalType = 0;
      this.modalTitle = "add sub classification";
      this.parentTitle = v.name;
      this.formAdd.level = eval(v.level + "+1");
      this.formAdd.commissionRate = v.commissionRate;
      this.showParent = true;
      delete this.formAdd.id;
      this.formAdd.parentId = v.id;
      this.modalVisible = true;
    },
    // edit分类
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "edit";
      this.formAdd.id = v.id;
      this.formAdd.name = v.name;
      this.formAdd.level = v.level;
      this.formAdd.parentId = v.parentId;
      this.formAdd.sortOrder = v.sortOrder;
      this.formAdd.commissionRate = v.commissionRate;
      this.formAdd.deleteFlag = v.deleteFlag;
      this.formAdd.image = v.image;
      this.showParent = false;
      this.modalVisible = true;
    },
    // 添加一级分类
    addParent() {
      this.modalType = 0;
      this.modalTitle = "add classification";
      this.parentTitle = "super classification";
      this.showParent = true;
      this.$refs.form.resetFields();
      delete this.formAdd.id;
      this.formAdd.parentId = 0;
      this.modalVisible = true;
    },
    // Submit
    Submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if (this.modalType === 0) {
            // 添加 避免edit后传入id等数据 记得delete
            delete this.formAdd.id;
            insertCategory(this.formAdd).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("add success");
                this.getAllList(this.categoryIndex);
                this.modalVisible = false;
                this.$refs.form.resetFields();
              }
            });
          } else {
            // edit
            updateCategory(this.formAdd).then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("modify success");
                this.getAllList(this.categoryIndex);
                this.modalVisible = false;
                this.$refs.form.resetFields();
              }
            });
          }
        }
      });
    },
    // delete分类
    remove(v) {
      this.$Modal.confirm({
        title: "delete",
        content: "confirm delete " + v.name + " ?",
        loading: true,
        onOk: () => {
          // delete
          delCategory(v.id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operation success");
              this.getAllList(0);
            }
          });
        },
      });
    },

    // 异步手动加载分类名称
    handleLoadData(item, callback) {
      if (item.level == 0) {
        let categoryList = JSON.parse(JSON.stringify(this.categoryList));
        categoryList.forEach((val) => {
          if (val.id == item.id) {
            val.children.map((child) => {
              child._loading = false;
              child.children = [];
            });
            // 模拟加载
            setTimeout(() => {
              callback(val.children);
            }, 1000);
          }
        });
      } else {
        this.deepCategoryChildren(item.id, this.categoryList);
        setTimeout(() => {
          callback(this.checkedCategoryChildren);
        }, 1000);
      }
    },

    // pass递归children来实现手动加载数据
    deepCategoryChildren(id, list) {
      if (id != "0" && list.length != 0) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.id == id) {
            this.checkedCategoryChildren = item.children;
            return;
          } else {
            this.deepCategoryChildren(id, item.children);
          }
        }
      }
    },
    // 获取分类数据
    getAllList(parent_id) {
      this.loading = true;
      getCategoryTree(parent_id).then((res) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem("category", JSON.stringify(res.result));
          this.categoryList = JSON.parse(JSON.stringify(res.result));
          this.tableData = res.result.map((item) => {
            if (item.children.length != 0) {
              item.children = [];
              item._loading = false;
            }
            return item;
          });
        }
      });
    },
    // 启用分类
    enable(v) {
      this.$Modal.confirm({
        title: "confirm",
        content: "confirm enable " + v.name + " and classification ?",
        loading: true,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          disableCategory(v.id, { enableOperations: 0 }).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operation success");
              this.getAllList(0);
            }
          });
        },
        onCancel: () => {
          this.getAllList(0);
        },
      });
    },
    // disable分类
    disable(v) {
      this.$Modal.confirm({
        title: "confirm",
        content: "confirm delete " + v.name + " and sub classification?",
        loading: true,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          disableCategory(v.id, { enableOperations: true }).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operation success");
              this.getAllList(0);
            }
          });
        },
        onCancel: () => {
          this.getAllList(0);
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
/deep/ .ivu-table-wrapper {
  overflow: auto;
}
.table {
  min-height: 100vh;
  height: auto;
}
</style>
