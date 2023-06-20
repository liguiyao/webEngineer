<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="Username">
          <Input
            type="text"
            v-model="searchForm.username"
            placeholder="Please enter username"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="contact">
          <Input
            type="text"
            v-model="searchForm.mobile"
            placeholder="Please enter contact"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="department">
          <department-choose @on-change="handleSelectDep" style="width: 150px;" ref="dep"></department-choose>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Row class="operation padding-row">
        <Button @click="add" type="primary">Add</Button>
        <Button @click="delAll">Batch delete</Button>
        <Button @click="resetPass">reset password</Button>
      </Row>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="data"
        sortable="custom"
        @on-sort-change="changeSort"
        @on-selection-change="showSelect"
        ref="table"
      ></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          :page-size="searchForm.pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>

    <Modal
      :title="modalTitle"
      v-model="userModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <FormItem label="Username" prop="username">
          <Input v-model="form.username" autocomplete="off"/>
        </FormItem>
        <FormItem label="nickname" prop="username">
          <Input v-model="form.nickName" autocomplete="off"/>
        </FormItem>
        <FormItem label="password" prop="password" v-if="modalType==0" :error="errorPass">
          <Input type="password" password v-model="form.password" autocomplete="off"/>
        </FormItem>
        <FormItem label="email" prop="email">
          <Input v-model="form.email"/>
        </FormItem>
        <FormItem label="Phone number" prop="mobile">
          <Input v-model="form.mobile"/>
        </FormItem>
        <Form-item label="icon" prop="avatar">
          <upload-pic-input v-model="form.avatar"></upload-pic-input>
        </Form-item>
        <Form-item label="department">
          <department-tree-choose @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>
        </Form-item>
        <FormItem label="role" prop="roles">
          <Select v-model="form.roles" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">

            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="userModalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserListData,
  getAllRoleList,
  addUser,
  editOtherUser,
  enableUser,
  deleteUser,
  resetPassword
} from "@/api/index";
import {validateMobile} from "@/libs/validate";
import departmentChoose from "@/components/lili/department-choose";
import departmentTreeChoose from "@/components/lili/department-tree-choose";
import uploadPicInput from "@/components/lili/upload-pic-input";

export default {
  name: "user-manage",
  components: {
    departmentChoose,
    departmentTreeChoose,
    uploadPicInput,
  },
  data() {
    return {
      loading: true, // 加载state
      selectCount: 0, // 已选Quantity
      selectList: [], // 已选数据列表
      searchForm: { // Please 求参数
        username: "",
        departmentId: "",
        mobile: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc"
      },
      modalType: 0, // 新增edit标识
      userModalVisible: false, // 用户modal显隐
      modalTitle: "", // modal标题
      form: { // 表单
        username: "",
        mobile: "",
        email: "",
        sex: "",
        roles: [],
        departmentId: 0,
        departmentTitle: ""
      },
      roleList: [], // 角色列表
      errorPass: "", // 错误Tips
      formValidate: { // 验证规则
        username: [
          {required: true, message: "Username cannot be empty", trigger: "blur"}
        ],
        password: [
          {required: true, message: "password cannot be empty", trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "Phone number cannot be empty", trigger: "blur"},
          {validator: validateMobile, trigger: "blur"}
        ],
        email: [
          {required: true, message: "Please enter email address"},
          {type: "email", message: "email format wrong"}
        ]
      },
      submitLoading: false, // Submitstate
      columns: [ // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "username",
          key: "username",
          minWidth: 120,
          sortable: true,
          fixed: "left"
        },
        {
          title: "icon",
          key: "avatar",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: "phone",
          key: "mobile",
          width: 125
        },
        {
          title: "email",
          key: "email",
          minWidth: 180,
          sortable: true
        },
        {
          title: "status",
          key: "status",
          align: "center",
          width: 110,
          render: (h, params) => {
            if (params.row.status == true) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "enable"
                  }
                })
              ]);
            } else if (params.row.status == false) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "disable"
                  }
                })
              ]);
            }
          },
          filters: [
            {
              label: "enable",
              value: true
            },
            {
              label: "disable",
              value: false
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            return row.status == value;
          }
        },
        {
          title: "Create time",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          width: 180
        },
        {
          title: "operation",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let enableOrDisable = "";
            if (params.row.status == true) {
              enableOrDisable = h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.disable(params.row);
                    }
                  }
                },
                "disable"
              );
            } else {
              enableOrDisable = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.enable(params.row);
                    }
                  }
                },
                "启用"
              );
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
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
              enableOrDisable,
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
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
          }
        }
      ],
      data: [], // 用户数据
      total: 0, // 总数
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getUserList();
    },
    // select部门回调
    handleSelectDepTree(v) {
      if (v) {
        this.form.departmentId = v.departmentId;
        this.form.departmentTitle = v.departmentTitle;
      } else {
        this.form.departmentId = 0;
        this.form.departmentTitle = "";
      }
    },
    // search项部门select
    handleSelectDep(v) {
      this.searchForm.departmentId = v;
    },
    // 分Page modifyPage码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList();
      this.clearSelectAll();
    },
    // 分Page modifyPage数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.searchForm.pageNumber = 1;
      this.getUserList();
    },
    getUserList() {
      // 多items件search用户列表
      this.loading = true;
      getUserListData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getUserList();
    },
    // 排序
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
    // 获取角色列表
    getRoleList() {
      let params = {
        pageSize: 100
      }
      getAllRoleList(params).then(res => {
        if (res.success) {
          this.roleList = res.result.records;
        }
      });
    },
    // reset密码
    resetPass() {
      if(this.selectCount==0) {this.$Message.warning('Please 选中数据后重试!'); return}
      this.$Modal.confirm({
        title: "确认reset",
        content:
          "您确认要reset所选的 " +
          this.selectCount +
          " items用户数据密码为【123456】?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          resetPassword(ids).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.clearSelectAll();
              this.getUserList();
            }
          });
        }
      });
    },
    // 确认Submit
    submitUser() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.modalType == 0) {
            // 添加用户 避免edit后传入id
            const params = JSON.parse(JSON.stringify(this.form))
            delete params.id;
            delete params.status;
            if (params.password == "" || params.password == undefined) {
              this.errorPass = "password cannot be empty";
              return;
            }
            if (params.password.length < 6) {
              this.errorPass = "密码长度不得少于6位";
              return;
            }
            //todo
            params.password = this.md5(params.password)
            this.submitLoading = true;
            addUser(params).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getUserList();
                this.userModalVisible = false;
              }
            });
          } else {
            // edit
            this.submitLoading = true;
            editOtherUser(this.form).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("operationsuccess");
                this.getUserList();
                this.userModalVisible = false;
              }
            });
          }
        }
      });
    },
    // 添加用户
    add() {
      this.modalType = 0;
      this.modalTitle = "添加用户";
      this.$refs.form.resetFields();
      this.form = { // 表单
        username: "",
        mobile: "",
        email: "",
        sex: "",
        roles: [],
        departmentId: 0,
        departmentTitle: ""
      },
      this.$refs.depTree.setData("", "");
      this.userModalVisible = true;
    },
    // edit用户
    edit(v) {
      this.form = JSON.parse(JSON.stringify(v));
      this.modalType = 1;
      this.modalTitle = "edit用户";
      this.$refs.form.resetFields();
      // 转换null为""
      for (let attr in this.form) {
        if (this.form[attr] == null) {
          this.form[attr] = "";
        }
      }
      this.$refs.depTree.setData(this.form.departmentId, this.form.departmentTitle);
      let selectRolesId = [];
      if (this.form.roles) {
        this.form.roles.forEach(function (e) {
          selectRolesId.push(e.id);
        });
      }
      this.form.roles = selectRolesId;
      this.userModalVisible = true;
    },
    // 启用
    enable(v) {
      let params = {
        status: true
      }
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          enableUser(v.id, params).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getUserList();
            }
          });
        }
      });
    },
    // disable
    disable(v) {
      let params = {
        status: false
      }
      this.$Modal.confirm({
        title: "确认disable",
        content: "您确认要disable用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          enableUser(v.id, params).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getUserList();
            }
          });
        }
      });
    },
    // delete用户
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          deleteUser(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getUserList();
            }
          });
        }
      });
    },
    // 选中state
    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 清除选中state
    clearSelectAll() {
      this.$refs.table.selectAll(false);
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
          deleteUser(ids).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.clearSelectAll();
              this.getUserList();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
    this.getRoleList();
  }
};
</script>
