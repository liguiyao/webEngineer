<template>
  <div class="wrapper">
    <!-- <Card class="category">
      <div
        :class="{ active: i == selectedIndex }"
        class="category-item"
        v-for="(typeItem, i) in pageTypes"
        :key="typeItem.type"
      >
        <div @click="clickType(typeItem.type, i)">{{ typeItem.title }}</div>
      </div>
    </Card> -->
    <Card class="content">
      <Button type="primary" @click="createTemp">添加Page面</Button>
      <div class="list">
        <Spin size="large" fix v-if="loading"></Spin>
        <div class="item item-title">
          <div>Page面名称</div>
          <div class="item-config">
            <div>state</div>
            <div>operation</div>
          </div>
        </div>

        <div class="item" v-for="(item, index) in list" :key="index">
          <div>{{ item.name || "absent模板昵称" }}</div>
          <div class="item-config">
            <i-switch
              v-model="item.pageShow"
              @on-change="releaseTemplate(item.id)"
            >
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
            <Button
              type="info"
              placement="right"
              @click="Template(item)"
              size="small"
              >edit</Button
            >
            <Button
              type="success"
              placement="right"
              @click="decorate(item)"
              size="small"
              >装修</Button
            >
            <Poptip confirm title="delete此模板？" @on-ok="delTemplate(item.id)">
              <Button type="error" size="small">delete</Button>
            </Poptip>
          </div>
        </div>
        <div class="no-more" v-if="list.length == 0">absent更多模板</div>
      </div>
      <Page
        show-total
        :total="total"
        show-sizer
        :page-size-opts="[10, 20, 50]"
        show-elevator
        style="float: right; overflow: hidden"
        @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="searchForm.pageSize"
      />
    </Card>
    <Modal
      v-model="showModal"
      title="模板设置"
      draggable
      width="600"
      :z-index="100"
      :loading="loading"
      :mask-closable="false"
      @on-ok="newTemplate"
      @on-cancel="showModal = false"
    >
      <Form ref="form" :model="formData" :label-width="80">
        <FormItem label="模板名称" prop="name">
          <Input v-model="formData.name" placeholder="Please enter 模板名称" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import * as API_floor from "@/api/other.js";
export default {
  name: "floorList",
  data() {
    return {
      showModal: false, // 添加modal的显示
      selectedIndex: 0, // Home还是专题select的index
      total: 0,
      formData: {
        // 新建模态框的数据
        status: false, // 模板是否Opening
        name: "", // 模板名称
      },
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        pageClientType: "PC",
      },
      columns: [
        // 列表展示的column
        {
          title: "Page面名称",
          key: "name",
        },
        {
          title: "state",
        },
        {
          title: "operation",
          key: "action",
        },
      ],

      loading: false, // 加载state
      pageTypes: [
        // 那种类别的模板
        {
          type: "INDEX",
          title: "Home",
        },
        // {
        //   type: "SPECIAL",
        //   title: "专题",
        // },
      ],
      list: [], // 模板列表
    };
  },
  mounted() {
    this.getTemplateList();
  },
  methods: {
    newTemplate() {
      // 添加，edit模板
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = this.formData;
          data.status ? (data.pageShow = "OPEN") : (data.pageShow = "CLOSE");
          delete data.status;
          (data.pageType = "STORE"), (data.pageClientType = "PC");
          if (data.id) {
            API_floor.updateHome(data.id, data).then((res) => {
              this.$Message.success("edit模板success");
              this.showModal = false;
              this.getTemplateList();
            });
          } else {
            API_floor.setHomeSetup(data).then((res) => {
              this.$Message.success("新建模板success");
              this.showModal = false;
              this.getTemplateList();
            });
          }
        } else {
          this.loading = false;
        }
      });
    },

    createTemp() {
      // 新建表单
      this.$refs.form.resetFields();
      this.showModal = true;
    },

    Template(item) {
      // edit表单
      item.status = item.pageShow;
      this.formData = item;
      this.showModal = true;
    },

    decorate(val) {
      // 装修
      this.$router.push({
        name: "renovation",
        query: { id: val.id, pageShow: val.pageShow },
      });
    },

    // 分Page modifyPage码
    changePageNum(val) {
      this.searchForm.pageNumber = val;
      this.getTemplateList();
    },
    // 分Page modifyPage数
    changePageSize(val) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = val;
      this.getTemplateList();
    },
    getTemplateList() {
      //模板列表
      // let params = {
      //   pageNumber: 1,
      //   pageSize: 999,
      //   pageType: "INDEX",
      //   pageClientType: "PC",
      // };
      API_floor.getHomeList(this.searchForm).then((res) => {
        if (res.success) {
          // this.total
          this.total = res.result.total;
          this.list = res.result.records;
          this.list.forEach((e) => {
            if (e.pageShow === "OPEN") {
              e.pageShow = true;
            } else {
              e.pageShow = false;
            }
          });
        }
      });
    },

    releaseTemplate(id) {
      //发布模板
      API_floor.releasePageHome(id).then((res) => {
        if (res.success) {
          this.$Message.success("发布模板success");
          this.getTemplateList();
        }
      });
    },
    // delete模板
    delTemplate(id) {
      API_floor.removePageHome(id).then((res) => {
        if (res.success) {
          this.$Message.success("delete模板success");
          this.getTemplateList();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.category-item {
  cursor: pointer;
  padding: 4px;
}
.active {
  background: #ededed;
}
.item-title {
  background: #d7e7f5 !important;
  height: 54px;
}
.no-more {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  background: #fff;
  padding: 20px;
  display: flex;
}
.category {
  flex: 2;
}
.content {
  flex: 8;
}
* {
  margin: 5px;
}
.list {
  min-height: 600px;
  position: relative;
}
.item:nth-of-type(2) {
  margin: 0 5px;
}
.item {
  width: 100% !important;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > .item-config {
    width: 250px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:nth-child(2) {
      margin-right: 80px;
    }
  }
}
.item:nth-of-type(2n + 1) {
  background: #f5f7fa;
}
</style>
