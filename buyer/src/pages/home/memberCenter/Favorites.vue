<template>
  <div class="wrapper">
    <card _Title="Recent collection" :_Tabs="favoriteWay" @_Change="change" :_Size="16" v-if="!homePage"/>
    <card _Title="Recent collection" :_Size="16" :_Tabs="favoriteWay" @_Change="change" _More="All collection" _Src="/home/Favorites" v-else></card>
    <div v-if="list.length">
      <template v-for="(item) in list">
        <div class="goodsItem" :key="item.skuId">
          <div class="goodsImg hover-pointer" v-if="params.type === 'GOODS'">
            <img :src="item.image" />
          </div>
          <div class="goodsImg hover-pointer" v-else>
            <img :src="item.storeLogo" />
          </div>
          <div class="goodsTitle hover-color" v-if="params.type === 'GOODS'" @click="buynow(item.skuId, item.goodsId)">
            {{item.goodsName}}
          </div>
          <div v-else class="goodsTitle hover-pointer">
            {{item.storeName}}
          </div>
          <div class="goodsPrice">
            <span v-if="params.type === 'GOODS'">{{item.price | unitPrice('RM')}}</span>
            <Tag color="error" v-if="item.selfOperated">Self-support</Tag>
          </div>
          <div class="goodsBuy">
            <Button size="small" type="primary" @click="buynow(item.skuId, item.goodsId)" v-if="params.type === 'GOODS'">Buy now</Button>
            <Button size="small" type="primary" @click="goShop(item.id)" v-else>Shop purchase</Button>
            <Button size="small" v-if="params.type === 'GOODS'" @click="cancel(item.skuId)">uncollect</Button>
            <Button size="small" v-if="params.type === 'STORE'" @click="cancelStore(item.id)">uncollect</Button>
          </div>
        </div>
      </template>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <empty v-else />
  </div>
</template>

<script>
import { collectList, cancelCollect,storeCollectList,cancelStoreCollect} from '@/api/member.js'
export default {
  name: 'Favorites',
  props: {
    homePage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      favoriteWay: ['Collection goods', 'Collection shop'], // 收藏分类
      list: [], // 收藏列表
      total: 0, // 收藏总数
      params: { // Please 求参数
        pageNumber: 1,
        pageSize: 100,
        type: 'GOODS'
      },
      spinShow: false // 加载state
    };
  },
  methods: {
    getList () { // 获取收藏列表
      this.spinShow = true
      collectList(this.params).then(res => {
        this.spinShow = false
        if (res.success) this.list = res.result.records;
      })
    },
    getStoreList () { // 获取收藏列表
      this.spinShow = true
      storeCollectList(this.params).then(res => {
        this.spinShow = false
        if (res.success) this.list = res.result.records;
      })
    },
    change (index) { // tab栏切换
      if (index === 0) { this.params.type = 'GOODS',this.getList()}
      if (index === 1) { this.params.type = 'STORE',this.getStoreList()}
    },
    cancel (id) { // Cancel收藏
      let typeName = this.params.type === 'GOODS' ? 'Goods' : 'Store'
      this.$Modal.confirm({
        title: 'Title',
        content: `<p>Make sure to unbookmark this${typeName}？</p>`,
        onOk: () => {
          cancelCollect(this.params.type, id).then(res => {
            if (res.success) {
              this.getList();
            }
          })
        }
      });
    },
    cancelStore (id) { // Cancel收藏
      let typeName = this.params.type === 'GOODS' ? 'Goods' : 'Store'
      this.$Modal.confirm({
        title: 'Title',
        content: `<p>Make sure to unbookmark this${typeName}？</p>`,
        onOk: () => {
          cancelStoreCollect(this.params.type, id).then(res => {
            if (res.success) {
              this.getStoreList();
            }
          })
        }
      });
    },
    buynow (skuId, goodsId) { // 跳转详情
      let url = this.$router.resolve({
        path: '/goodsDetail',
        query: {skuId, goodsId}
      })
      window.open(url.href, '_blank')
    },
    goShop (id) { // 跳转店铺Page面
      let url = this.$router.resolve({
        path: '/merchant',
        query: {id}
      })
      window.open(url.href, '_blank')
    }
  },
  mounted () {
    if (this.homePage) this.params.pageSize = 5;
    this.getList()
  }
};
</script>

<style scoped lang="scss">
.goodsShop,
.goodsImg,
.goodsPrice,
.goodsShop,
.goodsTitle {
  margin: 0 6px;
}
.wrapper {
  margin-bottom: 40px;
}
.goodsItem {
  display: flex;
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;

  > .goodsImg {
    width: 60px;
    height: 60px;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  > .goodsPrice,
  .goodsShop {
    width: 150px;
    text-align: center;
  }

  > .goodsTitle {
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.goodsBuy {
  margin-left: 80px;
  >*{
    margin: 0 4px;
  }
}
.page-size{
  text-align: right;
}
</style>
