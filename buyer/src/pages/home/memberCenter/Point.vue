<template>
  <div class="point">
    <card _Title="my bonus points"/>
    <div class="point-content">
      <span>Residual bonus points：<span>{{ pointObj.point || 0 }}</span></span>
      <span>Cumulative acquisition：<span>{{ pointObj.totalPoint || 0 }}</span></span>
    </div>
    <h3>Integral log</h3>
    <Table :columns="logColumns" :data="logData.records">
      <template slot-scope="{ row }" slot="point">
        <div :style="{color:row.pointType === 'INCREASE' ? 'green' : 'red'}">
          <span v-if="row.pointType === 'INCREASE'">+</span>{{ row.variablePoint }}
        </div>
      </template>
    </Table>
    <!-- 分页 -->
    <Page
      style="float:right;margin-top:10px"
      :current="params.pageNumber"
      :total="logData.total"
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
import {memberPoint, memberPointHistory} from '@/api/member.js'

export default {
  name: 'Point',
  data () {
    return {
      logData: {}, // 积分日志
      pointObj: {}, // 积分明细
      loading: false, // Please 求接口加载框
      params: { // 积分列表Please 求参数
        pageNumber: 1,
        pageSize: 10
      },
      logColumns: [ // table展示数据
        {
          title: 'Log content',
          key: 'content',
          align: 'center'
        },
        {
          title: 'Time',
          key: 'createTime',
          align: 'center'
        },
        {
          title: 'Details',
          slot: 'point',
          align: 'center'
        }
      ]
    }
  },
  mounted () {
    this.getHistory()
    this.getPoint()
  },
  methods: {
    getHistory () { // 获取积分历史
      memberPointHistory(this.params).then(res => {
        this.logData = res.result;
      })
    },
    getPoint () { // 获取积分详情
      memberPoint().then(res => {
        if (res.success) this.pointObj = res.result
      })
    },
    changePage (val) { // modify页码
      this.params.pageNumber = val
      this.getHistory()
    },
    changePageSize (val) { // modify页数
      this.params.pageSize = val
      this.params.pageNumber = 1
      this.getHistory()
    }
  }
}
</script>
<style lang="scss" scoped>
h3 {
  font-size: 16px;
  margin: 20px 10px;
}

.point-content {
  text-align: center;
  margin-bottom: 30px;

  > span {
    color: #999;
    margin-right: 100px;

    span {
      color: $theme_color;
      font-size: 24px;
    }
  }
}
</style>
