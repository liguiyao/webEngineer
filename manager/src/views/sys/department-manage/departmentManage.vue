<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <i-switch v-model="strict" size="large" style="margin-right: 5px">
          <span slot="open">级联</span>
          <span slot="close">单选</span>
        </i-switch>
        <Button @click="addRoot">添加部门</Button>
        <Button @click="add" type="primary">添加子部门</Button>
        <Button @click="delAll">批量delete</Button>
        <Button @click="getParentList">刷新</Button>
      </Row>
      <Row type="flex" justify="start">
        <Col :md="8" :lg="8" :xl="6">
          <Alert show-icon>
            当前selectedit：
            <span class="select-title">{{ editTitle }}</span>
            <a class="select-clear" v-if="form.id" @click="cancelSelect"
              >Cancelselect</a
            >
          </Alert>
          <div class="tree-bar" :style="{ maxHeight: maxHeight }">
            <Tree
              ref="tree"
              :data="data"
              :load-data="loadData"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
              :check-strictly="!strict"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </div>
        </Col>
        <Col :md="15" :lg="13" :xl="9" style="margin-left: 10px">
          <Form
            ref="form"
            :model="form"
            :label-width="100"
            :rules="formValidate"
          >
            <!-- <FormItem label="上级部门" prop="parentTitle">
              <div style="display: flex">
                <Input
                  v-model="form.parentTitle"
                  readonly
                  style="margin-right: 10px"
                />
                <Poptip
                  transfer
                  trigger="click"
                  placement="right-start"
                  title="select上级部门"
                  width="250"
                >
                  <Button icon="md-list">select部门</Button>
                  <div
                    slot="content"
                    style="position: relative; min-height: 5vh"
                  >
                    <Tree
                      :data="dataEdit"
                      :load-data="loadData"
                      @on-select-change="selectTreeEdit"
                    ></Tree>
                    <Spin size="large" fix v-if="loadingEdit"></Spin>
                  </div>
                </Poptip>
              </div>
            </FormItem> -->
            <FormItem label="部门名称" prop="title">
              <Input v-model="form.title" />
            </FormItem>
            <FormItem label="select角色">
              <Select
                :loading="userLoading"
                not-found-text="absent角色"
                v-model="selectedRole"
                multiple
              >
                <Option v-for="item in users" :value="item.id" :key="item.id">{{
                  item.name
                }}</Option>
              </Select>
            </FormItem>

            <FormItem label="排序值" prop="sortOrder">
              <Tooltip
                trigger="hover"
                placement="right"
                content="值越小越靠前，支持小数"
              >
                <InputNumber
                  :max="1000"
                  :min="0"
                  v-model="form.sortOrder"
                ></InputNumber>
              </Tooltip>
            </FormItem>
            <!--   <FormItem label="是否启用" prop="status">
              <i-switch size="large" v-model="form.status" :true-value="0" :false-value="-1">
                <span slot="open">启用</span>
                <span slot="close">disable</span>
              </i-switch>
            </FormItem> -->
            <Form-item>
              <Button
                style="margin-right: 5px"
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                >modify并Save</Button
              >
              <Button @click="handleReset">reset</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form
        ref="formAdd"
        :model="formAdd"
        :label-width="85"
        :rules="formValidate"
      >
        <div v-if="showParent">
          <FormItem label="上级部门：">{{ form.title }}</FormItem>
        </div>
        <FormItem label="部门名称" prop="title">
          <Input v-model="formAdd.title" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <Tooltip
            trigger="hover"
            placement="right"
            content="值越小越靠前，支持小数"
          >
            <InputNumber
              :max="1000"
              :min="0"
              v-model="formAdd.sortOrder"
            ></InputNumber>
          </Tooltip>
        </FormItem>
        <!--   <FormItem label="是否启用" prop="status">
          <i-switch size="large" v-model="formAdd.status" :true-value="0" :false-value="-1">
            <span slot="open">启用</span>
            <span slot="close">disable</span>
          </i-switch>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAdd">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd"
          >Submit</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  initDepartment,
  loadDepartment,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getUserByDepartmentId,
  getRoleList,
  updateDepartmentRole,
} from "@/api/index";
export default {
  name: "department-manage",
  data() {
    return {
      loading: true, // 加载state
      maxHeight: "500px", // 最大高度
      strict: true, // 级联还是单选
      userLoading: false, // select角色加载state
      loadingEdit: false, // edit加载state
      modalVisible: false, // modal显隐
      selectList: [], // 已选列表
      selectCount: 0, // 已选总数
      showParent: false, // 展示父级
      modalTitle: "", // modal标题
      editTitle: "", // edit标题
      selectedRole: [], //select的角色
      searchKey: "", // search关键字
      form: {
        // Submit表单
        id: "",
        title: "",
        parentId: "",
        parentTitle: "",
        sortOrder: 0,
        status: 0,
      },

      formAdd: {}, // 新增表单
      formValidate: {
        // 验证规则
        title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sortOrder: [
          {
            required: true,
            type: "number",
            message: "排序值不能为空",
            trigger: "blur",
          },
        ],
      },
      submitLoading: false, // Submitloading
      data: [], // 部门数据
      dataEdit: [], // edit时部门数据
      users: [], // 用户
    };
  },
  methods: {
    init() {
      this.getParentList();
    },
    // 获取部门数据
    getParentList() {
      this.loading = true;
      initDepartment().then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = this.bubbleSort(res.result);
        }
      });
    },
    // 动态加载二级数据
    loadData(item, callback) {
      loadDepartment(item.id).then((res) => {
        this.loadingEdit = false;
        if (res.success) {
          console.log(res.result);
          callback(res.result);
        }
      });
    },

    // 点击树
    selectTree(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);

        this.editTitle = data.title;
        // 加载部门用户数据
        this.userLoading = true;

        getUserByDepartmentId(data.id).then((res) => {
          let way = [];
          res.result &&
            res.result.forEach((item) => {
              way.push(item.roleId);
            });
          this.$set(this, "selectedRole", way);
          console.warn(this.selectedRole);
        });

        getRoleList({
          pageNumber: 1,
          pageSize: 10000,
        }).then((res) => {
          this.userLoading = false;
          console.log(res);
          if (res.success) {
            this.users = res.result.records;
            // 回显
            this.form = data;
          }
        });
      } else {
        this.cancelSelect();
      }
    },

    // 排序
    bubbleSort(array) {
      const len = array.length;
      if (len < 2) return array;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < i; j++) {
          if (array[j].sortOrder > array[i].sortOrder) {
            const temp = array[j];
            array[j] = array[i];
            array[i] = temp;
          }
        }
      }
      return array;
    },

    // Cancelselect
    cancelSelect() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.$refs.form.resetFields();
      delete this.form.id;
      this.editTitle = "";
    },
    // select上级部门
    selectTreeEdit(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.form.parentId = data.id;
        this.form.parentTitle = data.title;
      }
    },
    // Cancel添加部门
    cancelAdd() {
      this.modalVisible = false;
    },
    // reset表单
    handleReset() {
      this.$refs.form.resetFields();
      this.form.status = 0;
    },
    // Submit表单
    submitEdit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            this.$Message.warning("Please 先点击select要modify的部门");
            return;
          }
          let roleWay = [];
          this.selectedRole.forEach((item) => {
            let role = {
              departmentId: this.form.id,
              roleId: item,
            };
            roleWay.push(role);
          });

          Promise.all([
            editDepartment(this.form.id, this.form),
            updateDepartmentRole(this.form.id, roleWay),
          ]).then((res) => {
            this.submitLoading = false;
            if (res[0].success) {
              this.$Message.success("editsuccess");
              this.init();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    // 确认添加部门
    submitAdd() {
      this.$refs.formAdd.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addDepartment(this.formAdd).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("添加success");
              this.init();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    // 添加子部门
    add() {
      if (this.form.id == "" || this.form.id == null) {
        this.$Message.warning("Please 先点击select一个部门");
        return;
      }
      this.modalTitle = "添加子部门";
      this.showParent = true;

      this.formAdd = {
        parentId: this.form.id,
        sortOrder: 0,
        status: 0,
      };
      this.modalVisible = true;
    },
    // 添加一级部门
    addRoot() {
      this.modalTitle = "添加一级部门";
      this.showParent = false;
      this.formAdd = {
        parentId: 0,
        sortOrder: 0,
        status: 0,
      };
      this.modalVisible = true;
    },
    // 选中回调
    changeSelect(v) {
      console.log(v);
      this.selectCount = v.length;
      this.selectList = v;
    },
    // 批量delete部门
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未勾选要delete的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认delete",
        content:
          "您确认要delete所选的 " + this.selectCount + " items数据及其下级所有数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteDepartment(ids).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.selectList = [];
              this.selectCount = 0;
              this.cancelSelect();
              this.init();
            }
          });
        },
      });
    },
  },
  mounted() {
    // 计算高度
    let height = document.documentElement.clientHeight;
    this.maxHeight = Number(height - 287) + "px";
    this.init();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/tree-common.scss";
</style>
