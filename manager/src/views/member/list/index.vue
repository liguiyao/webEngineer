<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="Member name" prop="username">
            <Input type="text" v-model="searchForm.username" placeholder="Please enter Member name" clearable style="width: 200px" />
          </Form-item>

          <Form-item label="nick name" prop="nickName">
            <Input type="text" v-model="searchForm.nickName" placeholder="Please enter nick name" clearable style="width: 200px" />
          </Form-item>

          <Form-item label="contact" prop="mobile">
            <Input type="text" v-model="searchForm.mobile" placeholder="Please enter member contact" clearable style="width: 200px" />
          </Form-item>
          <Button @click="handleSearch" class="search-btn" type="primary" icon="ios-search">search</Button>
        </Form>
      </Row>
      <Row class="operation padding-row" v-if="!selectedMember">
        <Button @click="addMember" type="primary">add member</Button>
      </Row>

      <Table :loading="loading" border :columns="columns" class="mt_10" :data="data" ref="table"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
          @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small" show-total show-elevator
          show-sizer></Page>
      </Row>
    </Card>

    <!-- 添加用户模态框 -->
    <Modal v-model="addFlag" title="add member">
      <Form ref="addMemberForm" :model="addMemberForm" :rules="addRule" :label-width="100">
        <FormItem label="Phone number" prop="mobile" style="width: 90%;">
          <Input v-model="addMemberForm.mobile" maxlength="11" placeholder="Please enter Phone number" />
        </FormItem>
        <FormItem label="Member name" prop="username" style="width: 90%">
          <Input v-model="addMemberForm.username" maxlength="15" placeholder="Please enter Member name" />
        </FormItem>

        <FormItem label="member password" prop="password" style="width: 90%">
          <Input type="password" password v-model="addMemberForm.password" maxlength="20" placeholder="Please enter member password" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addFlag = false">Cancel</Button>
        <Button type="primary" @click="addMemberSubmit">Confirm</Button>
      </div>
    </Modal>
    <!-- modify模态框 -->
    <Modal v-model="descFlag" :title="descTitle" @on-ok="handleSubmitModal" width="500">
      <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">

        <Input v-model="form.id" v-show="false"/>

        <FormItem label="avatar">
          <img :src="form.face" class="face" />
          <Button type="text" class="upload" @click="() => {
                this.picModelFlag = true;
                this.$refs.ossManage.selectImage = true;
              }">modify</Button>
          <input type="file" style="display: none" id="file" />
        </FormItem>
        <FormItem label="username" prop="name">
          <Input v-model="form.username" style="width: 200px" disabled />
        </FormItem>
        <FormItem label="nickname" prop="name">
          <Input v-model="form.nickName" style="width: 200px" />
        </FormItem>
        <FormItem label="gender" prop="sex">
          <RadioGroup type="button" button-style="solid" v-model="form.sex">
            <Radio :label="1">
              <span>male</span>
            </Radio>
            <Radio :label="0">
              <span>female</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="modify password" prop="password">
          <Input type="password" style="width: 220px" password v-model="form.newPassword" />
        </FormItem>
        <FormItem label="birthday" prop="birthday">
          <DatePicker type="date" format="yyyy-MM-dd" v-model="form.birthday" style="width: 220px"></DatePicker>
        </FormItem>
        <FormItem label="location" prop="mail">
          <div class="form-item" v-if="!updateRegion">
            <Input disabled style="width: 250px" :value="form.region" />
            <Button type="text" @click="() => {
                  this.updateRegion = !this.updateRegion;
                }">modify</Button>
          </div>
          <div class="form-item" v-else>
            <region style="width: 250px" @selected="selectedRegion" />
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Modal width="1200px" v-model="picModelFlag">
      <ossManage @callback="callbackSelected" ref="ossManage" />
    </Modal>
  </div>
</template>

<script>
import region from "@/components/region";
import * as API_Member from "@/api/member.js";
import ossManage from "@/views/sys/oss-manage/ossManage";
import * as RegExp from "@/libs/RegExp.js";

export default {
  name: "member",
  components: {
    region,
    ossManage,
  },
  data() {
    return {
      descTitle: "", // modal标题
      descFlag: false, //editView框
      loading: true, // 表单加载state
      addFlag: false, // modal显隐控制
      updateRegion: false, // 地区
      addMemberForm: {
        // 添加用户表单
        mobile: "",
        username: "",
        password: "",
      },
      searchForm: {
        // Please 求参数
        pageNumber: 1,
        pageSize: 10,
        order: "desc",
        username: "",
        mobile: "",
        disabled: "OPEN",
      },
      picModelFlag: false, // select图片
      form: {}, // 表单数据
      addRule: {
        // 验证规则
        mobile: [
          { required: true, message: "Please enter Phone number" },
          {
            pattern: RegExp.mobile,
            message: "Please enter correctly phone number",
          },
        ],
        username: [{ required: true, message: "Please enter Member name" }],
        password: [{ required: true, message: "Please enter 密码" }],
      },
      ruleValidate: {}, //modify验证
      columns: [
        {
          title: "Member name",
          key: "username",
          tooltip: true,
        },
        {
          title: "nick name",
          key: "nickName",
          tooltip: true,
        },
        {
          title: "contact",
          width: 130,
          key: "mobile",
          render: (h, params) => {
            if (params.row.mobile == null) {
              return h("div", [h("span", {}, "")]);
            } else {
              return h("div", [h("span", {}, params.row.mobile)]);
            }
          },
        },
        {
          title: "注册时间",
          key: "createTime",
          width: 180,
        },

        {
          title: "积分Quantity",
          align: "left",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {},
              params.row.point == void 0 ? "0" : params.row.point
            );
          },
        },
        {
          title: "operation",
          key: "action",
          align: "center",
          width: 200,
          fixed: "right",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "center",
                },
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: params.row.___selected ? "primary" : "default",
                    },
                    style: {
                      marginRight: "5px",
                      display: this.selectedMember ? "block" : "none",
                    },
                    on: {
                      click: () => {
                        this.callback(params.row, params.index);
                      },
                    },
                  },
                  params.row.___selected ? "已select" : "select"
                ),

                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                      display: this.selectedMember ? "none" : "block",
                    },
                    on: {
                      click: () => {
                        this.detail(params.row);
                      },
                    },
                  },
                  "View"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                      ghost: true,
                    },
                    style: {
                      marginRight: "5px",
                      display: this.selectedMember ? "none" : "block",
                    },
                    on: {
                      click: () => {
                        this.editPerm(params.row);
                      },
                    },
                  },
                  "edit"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: "error",
                    },
                    style: {
                      marginRight: "5px",
                      display: this.selectedMember ? "none" : "block",
                    },
                    on: {
                      click: () => {
                        this.disabled(params.row);
                      },
                    },
                  },
                  "disable"
                ),
              ]
            );
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      selectMember: [], //Save选中的用户
    };
  },
  props: {
    // 是否为选中模式
    selectedMember: {
      type: Boolean,
      default: false,
    },
    // 已select用户数据
    selectedList: {
      type: null,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    selectedList: {
      handler(val) {
        this.$set(this, "selectMember", JSON.parse(JSON.stringify(val)));
        this.init(this.data);
        // 将父级数据与当前组件数据进行匹配
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 回调给父级
    callback(val, index) {
      this.selectMember.forEach(item=>{item.___selected = false})
      this.$set(val, "___selected", !val.___selected);
      console.log(val.___selected);
      console.log(this.selectMember);
      let findUser = this.selectMember.find((item) => {
        return item.id == val.id;
      });
      // 如果没有则添加
      if (!findUser) {
        this.selectMember.push(val);
      } else {
        // 有重复数据就delete
        this.selectMember.map((item, index) => {
          if (item.id == findUser.id) {
            this.selectMember.splice(index, 1);
          }
        });
      }

      this.$emit("callback", val);
    },
    // 初始化信息
    init(data) {
      data.forEach((item) => {
        if (this.selectMember.length != 0) {
          this.selectMember.forEach((member) => {
            if (member.id == item.id) {
              this.$set(item, "___selected", true);
            }
          });
        } else {
          this.$set(item, "___selected", false);
        }
      });
      this.data = data;
    },
    // 分Page 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getData();
    },
    // 分Page 改变Page数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.searchForm.pageNumber = 1;
      this.getData();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getData();
    },
    //View详情modify
    editPerm(val) {
      this.descTitle = `View用户 ${val.username}`;
      this.descFlag = true;
      this.updateRegion = false;
      this.getMemberInfo(val.id);
    },
    addMember() {
      this.addFlag = true;
      this.$refs.addMemberForm.resetFields();
    },
    /**
     * 查询View会员详情
     */
    getMemberInfo(id) {
      API_Member.getMemberInfoData(id).then((res) => {
        if (res.result) {
          this.$set(this, "form", res.result);
        }
      });
    },

    //查询会员列表
    getData() {
      API_Member.getMemberListData(this.searchForm).then((res) => {
        if (res.result.records) {
          this.loading = false;
          this.init(res.result.records);
          this.total = res.result.total;
        }
      });
    },
    // 选中的图片
    callbackSelected(val) {
      this.picModelFlag = false;
      this.form.face = val.url;
    },
    //添加会员Submit
    addMemberSubmit() {
      this.addMemberForm.password = this.md5(this.addMemberForm.password);
      this.$refs.addMemberForm.validate((valid) => {
        if (valid) {
          API_Member.addMember(this.addMemberForm).then((res) => {
            if (res.result) {
              this.$refs.addMemberForm.resetFields();
              this.getData();
              this.$Message.success("添加success！");
              this.addFlag = false;
            }
          });
        }
      });
    },

    // 选中的address
    selectedRegion(val) {
      this.region = val[1];
      this.regionId = val[0];
    },
    //View会员
    detail(row) {
      this.$router.push({ name: "member-detail", query: { id: row.id } });
    },

    //disable会员
    disabled(v) {
      let params = {
        memberIds: [v.id],
        disabled: false,
      };
      this.$Modal.confirm({
        title: "Tips",
        content: "<p>确认disable此会员？</p>",
        onOk: () => {
          API_Member.updateMemberStatus(params).then((res) => {
            if (res.success) {
              this.$Message.success("disablesuccess");
              this.getData();
            } else {
              // this.$Message.error(res.message);
            }
          });
        },
      });
    },

    // Submitmodify数据
    handleSubmitModal() {
      debugger
      const { nickName, sex, username, face, newPassword,id } = this.form;
      let time = new Date(this.form.birthday);
      let birthday = this.form.birthday=== undefined?'':
        time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
      let submit = {
        regionId: this.form.regionId,
        region: this.form.region,
        nickName,
        username,
        sex,
        birthday,
        face,
        id
      };
      if (this.region != "undefined") {
        submit.regionId = this.regionId;
        submit.region = this.region;
      }
      if (newPassword) {
        submit.password = this.md5(newPassword);
      }
      API_Member.updateMember(submit).then((res) => {
        if (res.result) {
          this.$Message.success("modifysuccess！");
          this.init();
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
/deep/ .ivu-table-wrapper {
  width: 100%;
}
/deep/ .ivu-card {
  width: 100%;
}
.face {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
