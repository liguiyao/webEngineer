<template>
  <div>
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="Member name" prop="memberName">
            <Input type="text" v-model="searchForm.memberName" placeholder="Please enter member name" clearable style="width: 200px"/>
          </Form-item>
          <Button @click="handleSearch" type="primary" class="search-btn" icon="ios-search">search</Button>
        </Form>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10">
        <!-- Page面展示 -->
        <template slot="shopDisableSlot" slot-scope="scope">
          <i-switch size="large" true-value="OPEN" false-value="CLOSE" v-model="scope.row.status"
                    @on-change="changeSwitch(scope.row)">
            <span slot="open">display</span>
            <span slot="close">hidden</span>
          </i-switch>
        </template>
      </Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
              @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]"
              size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
    <!-- Evaluate详情 -->
    <Modal v-model="infoFlag" width="800" :title="infoTitle">

      <div class="info-list" style="overflow: hidden">
        <div class="left-container">
          <div class="product">
            <img class="img" :src=infoData.goodsImage>
          </div>
          <div class="show">
            <label>page display：</label>
            <i-switch size="large" true-value="OPEN" false-value="CLOSE" v-model="infoData.status"
                      @on-change="changeSwitchView" style="margin-top: 3px">
              <span slot="open">display</span>
              <span slot="close">hidden</span>
            </i-switch>
          </div>
        </div>
        <div class="right-container">
          <div class="border-b">{{ infoData.goodsName }}</div>
          <div class="border-b">
            <div class="div-height"> store name：{{ infoData.storeName }}</div>
            <div class="div-height"> Order number：{{ infoData.orderNo }}</div>
          </div>

          <div class="border-b">
            <List>

              <ListItem>
                <ListItemMeta :avatar="infoData.memberProfile" :title="infoData.memberName"
                  :description="infoData.content"/>
              </ListItem>
              <div class="score-content">
                <span>logistics score：{{infoData.deliveryScore}}</span>
                <span>service score：{{infoData.serviceScore}}</span>
                <span>describe score：{{infoData.descriptionScore}}</span>
              </div>
              <div class="" v-if="infoData.haveImage">
                Evaluate image
                <div style="margin-left: 40px">
                  <template v-if="infoData.images && infoData.images.length">
                    <img style="width: 100px;height: 110px;margin-left: 2px"
                       v-for="(img,index) in infoData.images.split(',')"  :src="img"
                       alt="" :key="index"/>
                  </template>

                </div>
              </div>
            </List>
          </div>
          <div class="border-b" v-if="infoData.reply">
            <div>
              <div>
                <div style="float: left"> Store reply：</div>
                <div style="margin-left: 60px">{{ infoData.reply }}</div>
              </div>
              <div v-if="infoData.haveReplyImage">
                <div style="margin-left: 60px">
                  <template  v-if="infoData.replyImage && infoData.replyImage.length">
                    <img style="width: 100px;height: 110px" v-for="(img,index) in infoData.replyImage.split(',')" :key="index"
                       :src="img" alt=""/>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import * as API_Member from "@/api/member";

export default {
  name: "goods-review", // 会员Evaluate
  data() {
    return {
      infoData: {}, // Goods details
      infoFlag: false, // Evaluate展示
      infoTitle: "", // modal名称
      loading: true, // 表单加载state
      searchForm: {
        // search框初始化对象
        pageNumber: 1, // 当前Page数
        pageSize: 10, // Page面大小
        sort: "createTime", // default排序字段
        order: "desc", // default排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
      },
      columns: [
        // 表头
        {
          title: "goods name",
          key: "goodsName",
          minWidth: 120,
          align: "left",
          tooltip: true,
        },
        {
          title: "Member name",
          key: "memberName",
          minWidth: 120,
          align: "left",
          tooltip: true,
        },
        {
          title: "Evaluate",
          key: "grade",
          align: "left",
          width: 90,
          render: (h, params) => {
            if (params.row.grade == "GOOD") {
              return h("Tag", {props: {color: "green",},}, "好评");
            } else if (params.row.grade == "MODERATE") {
              return h("Tag", {props: {color: "orange",},}, "中评");
            } else {
              return h("Tag", {props: {color: "red",},}, "差评");
            }
          }
        },
        {
          title: "logistics评分",
          key: "deliveryScore",
          render: (h, params) => {
            return h('div',params.row.deliveryScore || 5 + '星')
          },
        },
        {
          title: "服务评分",
          key: "deliveryScore",
          render: (h, params) => {
            return h('div',params.row.serviceScore || 5 + '星')
          },
        },
        {
          title: "描述评分",
          key: "deliveryScore",
          render: (h, params) => {
            return h('div',params.row.descriptionScore || 5 + '星')
          },
        },
        {
          title: "Evaluate时间",
          key: "createTime",
          align: "left",
          width: 170
        },
        {
          title: "Page面展示",
          key: "shopDisable",
          align: "left",
          width: 100,
          slot: "shopDisableSlot",
        },
        {
          title: "operation",
          key: "action",
          width: 150,
          align: "center",
          fixed: "right",

          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "info",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.info(params.row);
                    },
                  },
                },
                "View"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "delete"
              ),
            ]);
          },
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    };
  },
  methods: {
    // 切换Viewswitch
    changeSwitchView(val) {
      let status = val;
      API_Member.updateMemberReview(this.infoData.id, {status}).then(
        (res) => {
          this.$Message.success("modifysuccess!");
          this.init();
        }
      );
    },
    // 初始化数据
    init() {
      this.getDataList();
    },
    // 分Page 改变Page码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    // 分Page 改变Page数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // search
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    //列表直接selectPage面是否展示
    changeSwitch(v) {
      let status = v.status;
      API_Member.updateMemberReview(v.id, {status: status}).then((res) => {
        this.init();
      });
    },
    // 获取列表
    getDataList() {
      this.loading = true;
      API_Member.getMemberReview(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    //Evaluate详情
    info(v) {
      this.infoFlag = true;
      this.infoTitle = `用户${v.memberName}的Evaluate详情`;
      API_Member.getMemberInfoReview(v.id).then((res) => {
        if (res.result) {
          this.infoData = res.result;
        }
      });
    },
    // delete评论
    remove(v) {
      this.$Modal.confirm({
        title: "确认delete",
        content: "您确认要delete会员" + v.memberName + "的评论?",
        loading: true,
        onOk: () => {
          API_Member.delMemberReview(v.id).then((res) => {
            this.$Modal.remove();
            this.$Message.success("modifysuccess");
            this.init();
          });
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
.left-container {
  float: left;
}

.right-container {
  float: left;
  margin-left: 50px;
}

.img {
  width: 100%;
  height: 100%;
}
img {
  vertical-align: middle;
  border-style: none;
}
.product {
  width: 140px;
  height: 160px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
}
.show{
  label{
    font-size: 14px;
  }
  margin-top: 15px;
}

label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
  float: left;
  margin-right: 2px;
}
.border-b {
  border-bottom: 1px solid #e9e9e9;
  width: 500px;
  overflow: hidden;
  position: relative;
  margin-top: 12px;
}
.div-height{
  line-height: 25px;
}
.score-content {
  margin: 5px 0;
  span{margin-right: 20px;}
}
</style>
