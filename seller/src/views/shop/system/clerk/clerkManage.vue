<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="店员名称">
          <Input
            type="text"
            v-model="searchForm.clerkName"
            placeholder="Please enter 店员名称"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="联系方式">
          <Input
            type="text"
            v-model="searchForm.mobile"
            placeholder="Please enter 联系方式"
            clearable
            style="width: 200px"
          />
        </Form-item>
        <Form-item label="部门">
          <department-choose @on-change="handleSelectDep" style="width: 150px;" ref="dep"></department-choose>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">search</Button>
      </Form>
      <Row class="operation padding-row">
        <Button @click="add" type="primary">添加</Button>
        <Button @click="delAll">批量delete</Button>
        <Button @click="resetPass">重置密码</Button>
      </Row>
      <br>
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
      v-model="userEditModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="form" :model="editForm" :label-width="80" :rules="formValidate">
        <FormItem label="Phone number">
          <Input v-model="mobile" disabled/>
        </FormItem>
        <FormItem label="店员名称">
          <Input v-model="clerkName" disabled/>
        </FormItem>
        <FormItem label="超级管理员" prop="isSuper">
          <RadioGroup type="button" button-style="solid" v-model="editForm.isSuper">
            <Radio :label="1">
              <span>是</span>
            </Radio>
            <Radio :label="0">
              <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="角色" prop="roles" v-if="editForm.isSuper == 0">
          <Select v-model="editForm.roles" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">

            </Option>
          </Select>
        </FormItem>
        <Form-item label="所属部门">
          <department-tree-choose @on-change="handleEditSelectDepTree" ref="depTree"></department-tree-choose>
        </Form-item>

      </Form>
      <div slot="footer">
        <Button type="text" @click="userEditModalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="updateSubmit">Submit</Button>
      </div>
    </Modal>

    <Modal
      :title="modalTitle"
      v-model="userModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="form" :model="form" :label-width="80" :rules="formValidate">
        <FormItem label="Phone number" prop="mobile">
          <Input placeholder="Please enter 要添加的会员Phone number" maxlength="11" style="width: 75%" v-model="form.mobile"
                 autocomplete="off" @on-change="checkClerks"/>
          &nbsp;<Button v-if="!memberCheck" @click="checkClerk">校验</Button>
          <Button v-if="memberCheck" @click="checkAgainClerk">重新校验</Button>
        </FormItem>
        <FormItem v-if="newMember" label="用户名" prop="username">
          <Input v-model="form.username" autocomplete="off"/>
        </FormItem>
        <FormItem v-if="oldMember" label="用户名" prop="username">
          <Input v-model="form.username" autocomplete="off" disabled/>
        </FormItem>

        <FormItem label="密码" prop="password" v-if="newMember" :error="errorPass">
          <Input type="password" password v-model="form.password" autocomplete="off"/>
        </FormItem>
        <FormItem label="超级管理员" prop="isSuper" v-if="newMember || oldMember">
          <RadioGroup type="button" button-style="solid" v-model="form.isSuper">
            <Radio :label="1">
              <span>是</span>
            </Radio>
            <Radio :label="0">
              <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="角色" prop="roles" v-if="(oldMember || newMember) && form.isSuper == 0">
          <Select v-model="form.roles" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">

            </Option>
          </Select>
        </FormItem>
        <Form-item label="所属部门" v-if="oldMember || newMember">
          <department-tree-choose @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>
        </Form-item>
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
  checkClerk,
  getUserListData,
  getAllRoleList,
  addUser,
  editOtherUser,
  enableClerk,
  deleteClerk,
  resetPassword,
  getClerk
} from "@/api/index";
import {validateMobile} from "@/libs/validate";
import departmentChoose from "@/views/my-components/lili/department-choose";
import departmentTreeChoose from "@/views/my-components/lili/department-tree-choose";
import uploadPicInput from "@/views/my-components/lili/upload-pic-input";

export default {
  name: "clerk-manage",
  components: {
    departmentChoose,
    departmentTreeChoose,
    uploadPicInput,
  },
  data() {
    return {
      open:0,
      loading: true, // 加载状态
      selectCount: 0, // 已选Quantity
      selectList: [], // 已选数据列表
      searchForm: { // Please 求参数
        clerkName: "",
        departmentId: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc"
      },
      modalType: 0, // 新增编辑标识
      userModalVisible: false, // 用户modal显隐
      userEditModalVisible:false,
      modalTitle: "", // modal标题
      form: { // 表单
        username: "",
        mobile: 0,
        sex: "",
        isSuper: 0,
        roles: [],
        departmentId: "",
        departmentTitle: ""
      },

      editForm: { // 表单
        isSuper: 0,
        roles: [],
        departmentId: "",
        departmentTitle: ""
      },
      mobile: "",
      clerkName: "",

      newMember: false,
      oldMember: false,
      memberCheck: false,
      roleList: [], // 角色列表
      errorPass: "", // 错误Tips
      formValidate: { // 验证规则
        username: [
          {required: true, message: "用户名不能为空", trigger: "blur"}
        ],
        password: [
          {required: true, message: "password cannot be empty", trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "Phone number不能为空", trigger: "blur"},
          {validator: validateMobile, trigger: "blur"}
        ]
      },
      submitLoading: false, // Submit状态
      columns: [ // 表头
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "店员名称",
          key: "clerkName",
          minWidth: 100,
          sortable: true,
          fixed: "left"
        },
        {
          title: "Phone number",
          key: "mobile",
          minWidth: 100,
          fixed: "left"
        },
        {
          title: "店主",
          key: "status",
          align: "center",
          width: 130,
          render: (h, params) => {
            if (params.row.shopkeeper == true) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "是"
                  }
                })
              ]);
            } else if (params.row.shopkeeper == false) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "否"
                  }
                })
              ]);
            }
          },
        },
        {
          title: "超级管理员",
          key: "status",
          align: "center",
          width: 130,
          render: (h, params) => {
            if (params.row.isSuper == true) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "是"
                  }
                })
              ]);
            } else if (params.row.isSuper == false) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "否"
                  }
                })
              ]);
            }
          },
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 130,
          render: (h, params) => {
            if (params.row.status == true) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "success",
                    text: "启用"
                  }
                })
              ]);
            } else if (params.row.status == false) {
              return h("div", [
                h("Badge", {
                  props: {
                    status: "error",
                    text: "禁用"
                  }
                })
              ]);
            }
          },
          filters: [
            {
              label: "启用",
              value: true
            },
            {
              label: "禁用",
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
                "禁用"
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
                "编辑"
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
    checkClerks() {
      this.open = this.form.mobile.length;
      console.log(this.open)
      if(this.open == 11 ){
        this.checkClerk();
      }
      if(this.open < 11){
        this.checkAgainClerk()
      }
    },
    // select部门回调
    handleSelectDepTree(v) {
      if (v) {
        this.form.departmentId = v.departmentId;
        this.form.departmentTitle = v.departmentTitle;
      } else {
        this.form.departmentId = "";
        this.form.departmentTitle = "";
      }
    },
    // select部门回调
    handleEditSelectDepTree(v) {
      if (v) {
        this.editForm.departmentId = v.departmentId;
        this.editForm.departmentTitle = v.departmentTitle;
      } else {
        this.editForm.departmentId = "";
        this.editForm.departmentTitle = "";
      }
    },
    //重新校验会员
    checkAgainClerk() {
      this.memberCheck = false
      this.newMember = false
      this.oldMember = false
    },
    //检测当前店员
    checkClerk() {
      if (this.form.mobile) {
        this.newMember = false
        this.oldMember = false
        checkClerk(this.form.mobile).then(res => {
          if (!res.result.id) {
            this.newMember = true
          } else {
            this.oldMember = true
            this.form.username = res.result.username
            this.form.password = res.result.password
          }
          this.form.isSuper = 1
          this.memberCheck = true;
        });
      }

    },
    // search项部门select
    handleSelectDep(v) {
      this.searchForm.departmentId = v;
    },
    // 分页 modify页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList();
      this.clearSelectAll();
    },
    // 分页 modify页数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.searchForm.pageNumber = 1;
      this.getUserList();
    },
    getUserList() {
      // 多条件search用户列表
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
    // 重置密码
    resetPass() {
      if (this.selectCount == 0) {
        this.$Message.warning('Please 选中数据后重试!');
        return
      }
      this.$Modal.confirm({
        title: "确认重置",
        content:
          "您确认要重置所选的 " +
          this.selectCount +
          " 条用户数据密码为【123456】?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          console.warn(ids)
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
    updateSubmit(){
      this.submitLoading = true;
      console.warn(this.editForm)
      editOtherUser(this.editForm.id,this.editForm).then(res => {
        this.submitLoading = false;
        if (res.success) {
          this.$Message.success("operationsuccess");
          this.getUserList();
          this.userEditModalVisible = false;
        }
      });
    },
    // 确认Submit
    submitUser() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 添加用户 避免编辑后传入id
          const params = JSON.parse(JSON.stringify(this.form))
          console.warn(params)
          delete params.id;
          delete params.status;
          if (this.newMember) {
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
          } else {
            params.password = this.form.password
          }
          this.submitLoading = true;
          addUser(params).then(res => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getUserList();
              this.userModalVisible = false;
            }
          });
        }
      });
    },
    // 添加用户
    add() {
      // this.checkClerks();
      this.modalType = 0;
      this.modalTitle = "添加店员";
      this.$refs.form.resetFields();
      this.form = { // 表单
        username: "",
        mobile: "",
        isSuper: 0,
        roles: [],
        departmentId: "",
        departmentTitle: ""
      },
      this.oldMember = false
      this.newMember = false
      this.userModalVisible = true;
    },
    // 编辑用户
    edit(v) {
      console.warn(v)
      getClerk(v.id).then(res => {
        console.warn(res)
        this.mobile = res.result.mobile
        this.clerkName = res.result.clerkName
        this.editForm.isSuper = 0
        this.editForm.id = res.result.id
        if(res.result.isSuper){
          this.editForm.isSuper = 1
        }
        this.editForm.departmentId = res.result.departmentId
        this.$refs.depTree.setData(res.result.departmentId, res.result.departmentTitle);
        let selectRolesId = [];
        if (res.result.roles) {
          res.result.roles.forEach(function (e) {
            selectRolesId.push(e.id);
          });
        }
        this.editForm.roles = selectRolesId;

        this.modalTitle = "modify店员";
        this.userEditModalVisible = true;
      })

    },
    // 启用
    enable(v) {
      let params = {
        status: true
      }
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.clerkName + " ?",
        loading: true,
        onOk: () => {
          enableClerk(v.id, params).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("operationsuccess");
              this.getUserList();
            }
          });
        }
      });
    },
    // 禁用
    disable(v) {
      let params = {
        status: false
      }
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用用户 " + v.clerkName + " ?",
        loading: true,
        onOk: () => {
          enableClerk(v.id, params).then(res => {
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
        content: "您确认要delete用户 " + v.clerkName + " ?",
        loading: true,
        onOk: () => {
          deleteClerk(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              this.getUserList();
            }
          });
        }
      });
    },
    // 选中状态
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    // 清除选中状态
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
        content: "您确认要delete所选的 " + this.selectCount + " 条店员?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteClerk(ids).then(res => {
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
