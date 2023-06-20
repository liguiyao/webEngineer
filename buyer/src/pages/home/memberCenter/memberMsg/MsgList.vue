<template>
  <div class="msg-list">
    <card _Title="My message" :_Tabs="status" :_Size="16"  @_Change="statusChange"/>

    <Table v-if="params.status != 'ALREADY_REMOVE' " :columns="messageColumns" :data="messageData.records"></Table>
    <Table v-if="params.status == 'ALREADY_REMOVE' " :columns="messageDelColumns" :data="messageData.records"></Table>
    <!-- 分Page -->
    <Page
      style="float:right;margin-top:10px"
      :current="params.pageNumber"
      :total="messageData.total"
      :page-size="params.pageSize"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
      :page-size-opts="[10, 20, 50]"
      size="small"
      show-total
      show-elevator
    ></Page>
  </div>
</template>
<script>
import {memberMsgList, readMemberMsg, delMemberMsg} from '@/api/member.js'
export default {
  data() {
    return {
      messageData: {}, // 消息数据
      status: ['unread', 'read', 'Recycling station'],
      params: { // Please 求参数
        pageNumber: 1,
        pageSize: 10,
        status: 'UN_READY'
      },
      messageDelColumns: [ // table展示数据
        {
          title: 'Message title',
          key: 'title',
          align: 'left',
          tooltip: true,
        },
        {
          title: 'Message content',
          key: 'content',
          align: 'left',
          tooltip: true
        },
        {
          title: 'Sending time',
          key: 'createTime',
          align: 'left',
          width: 240
        },
      ],
      messageColumns: [ // table展示数据
        {
          title: 'Message title',
          key: 'title',
          align: 'left',
          tooltip: true,
        },
        {
          title: 'Message content',
          key: 'content',
          align: 'left',
          tooltip: true
        },
        {
          title: 'Sending time',
          key: 'createTime',
          align: 'left',
          width: 240
        },
        {
          title: 'operation',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          render: (h, params) => {
            if (params.row.status === 'UN_READY') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.setRead(params.row.id);
                      }
                    }
                  },
                  '已读'
                ), h(
                  'Button',
                  {
                    props: {
                      size: 'small',
                      type: 'error'
                    },
                    on: {
                      click: () => {
                        this.removeMessage(params.row.id);
                      }
                    }
                  },
                  'delete'
                )
              ]);
            } else if (params.row.status === 'ALREADY_READY') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small',
                      type: 'error'
                    },
                    on: {
                      click: () => {
                        this.removeMessage(params.row.id);
                      }
                    }
                  },
                  'delete'
                )
              ]);
            } else {

            }
          }
        }
      ]
    }
  },
  methods: {
    // 消息state发生变化
    statusChange (index) {
      if (index === 0) { this.params.status = 'UN_READY' }
      if (index === 1) { this.params.status = 'ALREADY_READY' }
      if (index === 2) { this.params.status = 'ALREADY_REMOVE' }
      this.getList()
    },
    // modifyPage码
    changePage (v) {
      this.params.pageNumber = v;
      this.getList();
    },
    // modifyPage数
    changePageSize (v) {
      this.params.pageSize = v;
      this.getList();
    },
    getList () { // 获Cancel息列表
      memberMsgList(this.params).then(res => {
        if (res.success) {
          this.messageData = res.result;
        }
      })
    },
    // 设置消息已读
    setRead (id) {
      readMemberMsg(id).then(res => {
        if (res.success) {
          this.getList()
        }
      })
    },
    // 消息放入回收站
    removeMessage (id) {
      this.$Modal.confirm({
        title: 'Confirm deletion',
        // 记得确认modify此处
        content: 'Confirm that you want to delete this message?',
        loading: true,
        onOk: () => {
          // delete
          delMemberMsg(id).then((res) => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success('Message was successfully placed in the recycle bin');
              this.getList();
            }
          });
        },
      });
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>

</style>
