<template>
  <div class="search">
    <Card>
      <!-- 筛选项和operation按钮 -->
      <Row class="operation">
        <i-switch
          v-model="strict"
          class="selectModel"
          size="large"
          style="margin-right: 5px"
        >
          <span slot="open">级联</span>
          <span slot="close">单选</span>
        </i-switch>
        <Button @click="addRootMenu">添加顶级菜单</Button>
        <Button @click="addMenu" type="primary">添加子菜单</Button>
        <Button @click="delAll">批量delete</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>
            更多operation
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="expandOne">收合所有</DropdownItem>
            <DropdownItem name="expandTwo">展开一级</DropdownItem>
            <DropdownItem name="expandThree">展开两级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <!-- Page面主体，左侧树结构，右侧表单项 -->
      <Row type="flex" justify="start">
        <Col :md="8" :lg="8" :xl="6">
          <Alert show-icon>
            当前selectedit：
            <span class="select-title">{{ editTitle }}</span>
            <a class="select-clear" v-if="form.id" @click="cancelEdit">Cancelselect</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入菜单名search"
            clearable
          />
          <div class="tree-bar" :style="{ maxHeight: maxHeight }">
            <Tree
              ref="tree"
              :data="data"
              show-checkbox
              :render="renderContent"
              @on-select-change="selectTree"
              @on-check-change="changeSelect"
              :check-strictly="!strict"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </div>
        </Col>
        <Col :md="15" :lg="13" :xl="9" style="margin-left: 10px">
          <Form ref="form" :model="form" :label-width="110" :rules="formValidate">
            <FormItem label="类型" prop="type">
              <div v-show="form.level == 0">
                <Icon
                  type="ios-navigate-outline"
                  size="16"
                  style="margin-right: 5px"
                ></Icon>
                <span>顶级菜单</span>
              </div>
              <div v-show="form.level == 1 || form.level == 2">
                <Icon
                  type="ios-list-box-outline"
                  size="16"
                  style="margin-right: 5px"
                ></Icon>
                <span>Page面菜单</span>
              </div>
            </FormItem>
            <FormItem label="菜单名称" prop="title">
              <Input class="menu-input" v-model="form.title" />
            </FormItem>
            <FormItem
              label="路由address"
              prop="path"
              v-if="form.level != 0"
              class="block-tool"
            >
              <Tooltip
                placement="right"
                content="路由address，英文唯一，跳转Page面，路径展示用 "
              >
                <Input class="menu-input" v-model="form.path" />
              </Tooltip>
            </FormItem>
            <FormItem label="路由名称" prop="name" class="block-tool">
              <Tooltip
                placement="right"
                content="路由name，需英文唯一，跳转Page面用"
                transfer
              >
                <Input class="menu-input" v-model="form.name" />
              </Tooltip>
            </FormItem>
            <FormItem label="文件路径" prop="frontRoute" v-if="form.level != 0">
              <Input class="menu-input" v-model="form.frontRoute" />
            </FormItem>
            <FormItem label="权限url" v-if="form.level != 0" class="block-tool">
              <Tooltip placement="right" content="*号模糊匹配，逗号分割" transfer>
                <Input class="menu-input" v-model="form.permission" type="textarea" />
              </Tooltip>
            </FormItem>
            <FormItem label="排序值" prop="sortOrder">
              <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
                <InputNumber :max="1000" :min="0" v-model="form.sortOrder"></InputNumber>
              </Tooltip>
            </FormItem>
            <Form-item>
              <Button
                style="margin-right: 5px"
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                >Save
              </Button>
              <Button @click="handleReset">reset</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal
      draggable
      :title="modalTitle"
      v-model="menuModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{ top: '30px' }"
    >
      <Form ref="formAdd" :model="formAdd" :label-width="100" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="上级节点：">{{ parentTitle }}</FormItem>
        </div>
        <FormItem label="类型" prop="type">
          <div v-show="formAdd.level == 0">
            <Icon type="ios-navigate-outline" size="16" style="margin-right: 5px"></Icon>
            <span>顶级菜单</span>
          </div>
          <div v-show="formAdd.level != 0">
            <Icon type="ios-list-box-outline" size="16" style="margin-right: 5px"></Icon>
            <span>Page面菜单</span>
          </div>
        </FormItem>
        <FormItem label="菜单名称" prop="title">
          <Input class="menu-input" v-model="formAdd.title" />
        </FormItem>

        <FormItem label="路由address" prop="path" v-if="formAdd.level != 0">
          <Input v-model="formAdd.path" />
        </FormItem>
        <FormItem label="路由名称" prop="name" class="block-tool">
          <Tooltip placement="right" content="路由name，需英文唯一，跳转Page面用">
            <Input v-model="formAdd.name" />
          </Tooltip>
        </FormItem>
        <FormItem label="文件路径" prop="frontRoute" v-if="formAdd.level != 0">
          <Input v-model="formAdd.frontRoute" />
        </FormItem>
        <FormItem label="权限url" v-if="formAdd.level != 0">
          <Input v-model="formAdd.permission" type="textarea" />
          <div class="desc">*号模糊匹配，逗号分割</div>
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
            <InputNumber :max="1000" :min="0" v-model="formAdd.sortOrder"></InputNumber>
          </Tooltip>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="menuModalVisible = false">Cancel</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getAllPermissionList,
  addPermission,
  editPermission,
  deletePermission,
  searchPermission,
} from "@/api/index";
import util from "@/libs/util.js";
import Cookies from "js-cookie";
export default {
  name: "menu-manage",
  data() {
    return {
      loading: true, // 加载state
      strict: true, // 级联 单选
      maxHeight: "500px", // 最大高度
      expandLevel: 1, // 展开层级
      menuModalVisible: false, // 添加菜单modal
      selectList: [], // 已选列表
      selectCount: 0, // 所选Quantity
      showParent: false, // 展示父级
      searchKey: "", // search关键词
      parentTitle: "", // 父级标题
      editTitle: "", // edit标题
      modalTitle: "", // modal标题
      form: {
        // 表单数据
        id: "",
        title: "",
        name: "",
        path: "",
        frontRoute: "",
        parentId: "",
        sortOrder: 0,
        level: 0,
        permission: "",
      },
      formAdd: {
        // 添加表单
      },
      formValidate: {
        // 验证规则
        title: [{ required: true, message: "菜单名称名称不能为空", trigger: "blur" }],
        name: [{ required: true, message: "路由名称不能为空", trigger: "blur" }],
        path: [{ required: true, message: "路由address不能为空", trigger: "blur" }],
        frontRoute: [{ required: true, message: "文件address不能为空", trigger: "blur" }],
        sortOrder: [
          {
            required: true,
            type: "number",
            message: "排序值不能为空",
            trigger: "blur",
          },
        ],
      },
      submitLoading: false, // Submitstate
      data: [], // 数据
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getAllList();
    },

    renderContent(h, { root, node, data }) {
      // 渲染树形结构前面图标
      let icon = "";
      if (data.level == 0) {
        icon = "ios-navigate";
      } else if (data.level == 1) {
        icon = "md-list-box";
      } else if (data.level == 2) {
        icon = "md-list";
      }
      return h("span", [
        h("span", [
          h("Icon", {
            props: {
              type: icon,
              size: "16",
            },
            style: {
              "margin-right": "8px",
              "margin-bottom": "3px",
            },
          }),
          h("span", data.title),
        ]),
      ]);
    },
    // 更多operation
    handleDropdown(name) {
      if (name == "expandOne") {
        this.expandLevel = 1;
        this.getAllList();
      } else if (name == "expandTwo") {
        this.expandLevel = 2;
        this.getAllList();
      } else if (name == "expandThree") {
        this.expandLevel = 3;
        this.getAllList();
      }
      if (name == "expandAll") {
        this.expandLevel = 4;
        this.getAllList();
      } else if (name == "refresh") {
        this.getAllList();
      }
    },
    // 获取所有菜单
    getAllList() {
      this.loading = true;
      getAllPermissionList().then((res) => {
        this.loading = false;
        if (res.success) {
          // 仅展开指定级数 default后台已展开所有
          let expandLevel = this.expandLevel;
          res.result.forEach(function (e) {
            if (expandLevel == 1) {
              if (e.level == 0) {
                e.expand = false;
              }
              if (e.children && e.children.length > 0) {
                e.children.forEach(function (c) {
                  if (c.level == 1) {
                    c.expand = false;
                  }
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(function (b) {
                      if (b.level == 2) {
                        b.expand = false;
                      }
                    });
                  }
                });
              }
            } else if (expandLevel == 2) {
              if (e.level == 0) {
                e.expand = true;
              }
              if (e.children && e.children.length > 0) {
                e.children.forEach(function (c) {
                  if (c.level == 1) {
                    c.expand = false;
                  }
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(function (b) {
                      if (b.level == 2) {
                        b.expand = false;
                      }
                    });
                  }
                });
              }
            } else if (expandLevel == 3) {
              if (e.level == 0) {
                e.expand = true;
              }
              if (e.children && e.children.length > 0) {
                e.children.forEach(function (c) {
                  if (c.level == 1) {
                    c.expand = true;
                  }
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(function (b) {
                      if (b.level == 2) {
                        b.expand = false;
                      }
                    });
                  }
                });
              }
            } else if (expandLevel == 4) {
              if (e.level == 0) {
                e.expand = true;
              }
              if (e.children && e.children.length > 0) {
                e.children.forEach(function (c) {
                  if (c.level == 1) {
                    c.expand = true;
                  }
                  if (c.children && c.children.length > 0) {
                    c.children.forEach(function (b) {
                      if (b.level == 2) {
                        b.expand = true;
                      }
                    });
                  }
                });
              }
            }
          });
          this.data = res.result;
        }
      });
    },
    // select菜单
    selectTree(v) {
      if (v.length > 0) {
        let str = JSON.stringify(v);
        let menu = JSON.parse(str);
        this.form = menu[0];
        console.log(this.form);
        this.editTitle = menu[0].title;
      } else {
        this.cancelEdit();
      }
    },
    // search菜单
    search() {
      if (this.searchKey) {
        this.loading = true;
        searchPermission({ title: this.searchKey }).then((res) => {
          this.loading = false;
          if (res.success) {
            this.data = res.result;
          }
        });
      } else {
        this.getAllList();
      }
    },
    // Cancelselect
    cancelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.$refs.form.resetFields();
      this.form.id = "";
      this.editTitle = "";
    },
    // reset表单
    handleReset() {
      this.$refs.form.resetFields();
      this.form.frontRoute = "";
    },
    // Save
    submitEdit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            this.$Message.warning("Please 先点击select要modify的菜单节点");
            return;
          }
          this.submitLoading = true;
          if (this.form.sortOrder == null) {
            this.form.sortOrder = 0;
          }
          // delete一些之前添加的无用字段
          delete this.form.icon;
          delete this.form.frontComponent;
          delete this.form.buttonType;
          delete this.form.updateTime;
          delete this.form.selected;
          delete this.form.description;
          delete this.form.children;
          delete this.form.children;

          editPermission(this.form).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("editsuccess");
              // 标记重新获取菜单数据
              this.$store.commit("setAdded", false);
              util.initRouter(this);
              this.init();
              this.menuModalVisible = false;
            }
          });
        }
      });
    },
    // 添加
    submitAdd() {
      this.$refs.formAdd.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          addPermission(this.formAdd).then((res) => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("添加success");
              // 标记重新获取菜单数据
              this.$store.commit("setAdded", false);
              util.initRouter(this);
              this.init();
              this.menuModalVisible = false;
            }
          });
        }
      });
    },
    // 添加子菜单
    addMenu() {
      if (!this.form.id) {
        this.$Message.warning("Please 先点击select一个菜单权限节点");
        return;
      }
      this.parentTitle = this.form.title;
      this.modalTitle = "添加子节点";
      this.showParent = true;
      if (this.form.level == 2) {
        this.$Modal.warning({
          title: "抱歉，不能添加啦",
          content: "仅支持2级菜单目录",
        });
        return;
      }
      this.formAdd = {
        parentId: this.form.id,
        level: Number(this.form.level) + 1,
        sortOrder: 0,
        permission: "", // 权限url
      };
      if (this.form.level == 0) {
        this.formAdd.path = "/";
        this.formAdd.frontRoute = "Main";
      }
      this.menuModalVisible = true;
    },
    // 添加顶级菜单
    addRootMenu() {
      this.modalTitle = "添加顶级菜单";
      this.showParent = false;
      this.formAdd = {
        level: 0,
        sortOrder: 0,
      };
      this.menuModalVisible = true;
    },
    // 选中菜单赋值
    changeSelect(v) {
      this.selectCount = v.length;
      this.selectList = v;
    },
    // 批量delete菜单
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未勾选要delete的数据");
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
          deletePermission(ids).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("deletesuccess");
              // 标记重新获取菜单数据
              this.$store.commit("setAdded", false);
              util.initRouter(this);
              this.selectList = [];
              this.selectCount = 0;
              this.cancelEdit();
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
.desc {
  font-size: 12px;
  color: #999;
}
.menu-input {
  width: 362px;
}
</style>
