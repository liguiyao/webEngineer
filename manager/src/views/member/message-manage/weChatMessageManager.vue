<template>
  <div>
    <!--Wechat模板-->
    <Modal v-model="wechatModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>Wechat设置</span>
      </p>
      <div>
        <Form ref="wechatFormData" :model="wechatFormData" label-position="left" :label-width="100">
          <FormItem v-if="tab === 'WECHAT'" label="模板名称">
            <Input v-model="wechatFormData.name" size="large" maxlength="9" disabled></Input>
          </FormItem>
          <FormItem v-if="tab === 'WECHAT'" label="头部信息" prop="first">
            <Input v-model="wechatFormData.first" size="large" maxlength="50"></Input>
          </FormItem>
          <FormItem v-if="tab === 'WECHAT'" label="备注" prop="remark">
            <Input class='textarea' :rows="5" :autosize="{maxRows:5,minRows: 5}" v-model="wechatFormData.remark"
                   type="textarea" maxlength="150"/>
          </FormItem>
          <FormItem label="是否Opening" prop="enable">
            <i-switch v-model="wechatFormData.enable" size="large">
              <span slot="open">Opening</span>
              <span slot="close">Close</span>
            </i-switch>
          </FormItem>
        </Form>

      </div>
      <div slot="footer" style="text-align: right">
        <Button v-if="tab === 'WECHAT'"  type="primary"  @click="wechatFormDataEdit">Save</Button>

        <Button v-else  type="primary" @click="wechatMPFormDataEdit">Save</Button>
      </div>
    </Modal>

  <Card>
    <Tabs @on-click="tabPaneChange" v-model="tab">
      <TabPane label="Wechat消息" name="WECHAT">
        <div class="search">
            <Row class="operation mt_10">
              <Button @click="weChatSync" type="primary">同步Wechat消息</Button>
            </Row>
            <Table
              :loading="loading"
              border
              :columns="weChatColumns"
              :data="weChatData"
              ref="weChatTable"
            ></Table>
            <Row type="flex" justify="end" class="mt_10">
              <Page
                :current="weChatSearchForm.pageNumber"
                :total="weChatTotal"
                :page-size="weChatSearchForm.pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                :page-size-opts="[10,20,50]"
                size="small"
              ></Page>
            </Row>
        </div>
      </TabPane>

      <TabPane label="Wechat小程序订阅消息" name="WECHATMP">
        <div class="search">
            <Row class="operation mt_10">
              <Button @click="weChatSync('mp')" type="primary">同步Wechat小程序订阅消息</Button>
            </Row>
            <Table
              :loading="loading"
              border
              :columns="weChatColumns"
              :data="weChatMPData"
              sortable="custom"
              ref="weChatMPTable"
            ></Table>
            <Row type="flex" justify="end" class="mt_10">
              <Page
                :current="weChatMPSearchForm.pageNumber"
                :total="weChatMPTotal"
                :page-size="weChatMPSearchForm.pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                :page-size-opts="[10,20,50]"
                size="small"
              ></Page>
            </Row>
        </div>
      </TabPane>
    </Tabs>
     </Card>
  </div>


</template>

<script>
import {
  wechatMessageSync,
  getWechatMessagePage,
  editWechatMessageTemplate,
  delWechatMessageTemplate,

  wechatMPMessageSync,
  getWechatMPMessagePage,
  editWechatMPMessageTemplate,
  delWechatMPMessageTemplate
} from "@/api/setting";

export default {
  title: "wechat-message-manage",
  data() {
    return {

      wechatModal: false,// modal展示
      wechatFormData: {}, // Wechat数据
      wechatMPFormData: {}, // Wechat订阅消息
      tab: "WECHAT", // tab栏分类
      searchForm: { // Please 求参数
        type: "WECHAT"
      },
      loading: true, // 表单加载state
      id: '', // 模板id
      //Wechat消息查询
      weChatSearchForm: {
        // search框对应data对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
      },
      weChatMPSearchForm: {
        // search框对应data对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
      },
      weChatColumns: [
        {
          title: "模板编号",
          key: "code",
          width: 500,
          sortable: true
        },
        {
          title: "是否Opening",
          key: "enable",
          sortable: true,
          width: 150,
          render: (h, params) => {
            if (params.row.enable == true) {
              return h('div', [
                h('span', {}, 'Opening'),
              ]);
            } else {
              return h('div', [
                h('span', {}, 'Close'),
              ]);
            }
          },
        },
        {
          title: "模板名称",
          key: "name",
          width: 200,
          sortable: true
        },
        {
          title: "Create time",
          key: "createTime",
          sortable: true,
          sortType: "desc",
        },
        {
          title: "operation",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.wechatSettingAlert(params.row);
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
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delWeChat(params.row);
                    }
                  }
                },
                "delete"
              )
            ]);
          }
        }
      ],
      weChatData: [], // 表单数据
      weChatMPData: [], // 表单数据
      weChatTotal: 0, // 表单数据总数
      weChatMPTotal: 0, // 表单数据总数
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.getDataList();
    },
    changePage(v) {
      this.searchForm.type = this.tab;
      this.getDataList();
    },
    changePageSize(v) {
      this.searchForm.type = this.tab;
      this.getDataList();
    },
    //Wechat弹出框
    wechatSettingAlert(v) {
      this.wechatFormData = v
      this.id = v.id
      this.wechatModal = true
    },

    //同步Wechat消息
    weChatSync(mp) {
      this.$Modal.confirm({
        title: "Tips",
        // 记得确认modify此处
        content: "确认要初始化Wechat小程序消息订阅?",
        loading: true,
        onOk: () => {
          // 同步Wechat消息模板

          if (mp === "mp") {
            wechatMPMessageSync().then(res => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success('Wechat小程序消息订阅初始化');
              }
            });
          } else {
            // 同步Wechat消息模板
            wechatMessageSync().then(res => {
              this.$Modal.remove();
              if (res.success) {
                this.$Message.success('Wechat消息模板初始化success');
              }
            });
          }
        }
      });
    },
    //Wechat设置Save
    wechatFormDataEdit() {
      this.$refs['wechatFormData'].validate((valid) => {
        if (valid) {
          if(!this.wechatFormData.updateTime){
            this.wechatFormData.updateTime = ''
          }
          editWechatMessageTemplate(this.id, this.wechatFormData).then(res => {
            if (res.message === 'success') {
              this.$Message.success('Wechat模板modifysuccess');
              this.wechatModal = false;
              this.getWechatMessagePage();
            }
          });
        }
      })
    },
    wechatMPFormDataEdit() {
      this.$refs['wechatFormData'].validate((valid) => {
        if (valid) {
          editWechatMPMessageTemplate(this.id, this.wechatMPFormData).then(res => {
            if (res.message === 'success') {
              this.$Message.success('Wechat消息订阅模板modifysuccess');
              this.wechatModal = false;
              this.getWechatMessagePage();
            }
          });
        }
      })
    },

    //deleteWechat模消息
    delWeChat(v) {
      this.$Modal.confirm({
        title: "Tips",
        content: "Confirmdelete此模板?",
        loading: true,
        onOk: () => {
          // deleteWechat消息模板
          if (this.tab === "WECHAT") {
            delWechatMessageTemplate(v.id).then(res => {
              if (res.success) {
                this.$Modal.remove();
                this.$Message.success('Wechat模板deletesuccess');
                this.getWechatMessagePage()
              }
            });
          } else {
            delWechatMPMessageTemplate(v.id).then(res => {
              if (res.success) {
                this.$Modal.remove();
                this.$Message.success('Wechat消息订阅deletesuccess');
                this.getWechatMessagePage()
              }
            });
          }
        }
      });

    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getDataList() {
      this.loading = true;
      getWechatMessagePage(this.searchWe).then(res => {
        this.loading = false;
        if (res.success) {
          this.weChatData = res.result.records;
          this.weChatTotal = res.result.total;
        }
      });
    },
    //分Page获取Wechat消息
    getWechatMessagePage() {
      getWechatMessagePage(this.weChatSearchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.weChatData = res.result.records;
          this.weChatTotal = res.result.total;
        }
      });
    },
    //分Page获取Wechat小程序消息订阅
    getWechatMPMessagePage() {
      getWechatMPMessagePage(this.weChatMPSearchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.weChatMPData = res.result.records;
          this.weChatMPTotal = res.result.total;
        }
      });
    },
    //tab切换事件
    tabPaneChange(v) {
      this.searchForm.type = v;
      //如果是Wechat消息则走单独的接口
      if (v === "WECHAT") {
        this.getWechatMessagePage();
      } else if (v === "WECHATMP") {
        this.getWechatMPMessagePage();
      }

    }
  },
  mounted() {
    this.init();
  }
};
</script>
