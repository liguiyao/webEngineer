<template>
  <div>
    <div class="wrapper" :style="{right:handleDrawer ? '300px' : '0px'}">

      <div class="barItem" @mouseenter="showCartNum(item)" @click="clickBar(item)" v-for="(item,index) in resetConfig.menuList" :key="index">
        <Tooltip placement="left" :content="item.title">
          <Icon size="20" :type="item.icon"/>
          <p class="barTitle" v-if="item.titleShow"> {{item.title}}</p>
          <div class="circle" v-if="item.title === 'Cart'">
            {{cartNum < 100 ? cartNum : 99}}
          </div>
        </Tooltip>
      </div>

    </div>
    <Drawer width="300" class="popup" :title="drawerData.title" :mask="resetConfig.mask" :closable="resetConfig.closable"
      v-model="handleDrawer">
      <drawerPage :title="drawerData.title" />
    </Drawer>
  </div>
</template>

<script>
import Storage from '@/plugins/storage.js';
import Configuration from './config';
import drawerPage from './Drawer'
import {cartCount} from '@/api/cart.js'
export default {
  name: 'Main',
  data () {
    return {
      resetConfig: Configuration, // 菜单项
      handleDrawer: false, // 是否可展开
      drawerData: '' // 菜单基础数据
    }
  },
  components: {drawerPage},
  computed: {
    // 用户信息
    userInfo () {
      return Storage.getItem('userInfo');
    },
    // 购物车GoodsQuantity
    cartNum () {
      return this.$store.state.cartNum
    }
  },
  methods: {
    showCartNum (item) { // 获取购物车Quantity
      if (this.userInfo && item.title === 'Cart') {
        this.getCartList()
      }
    },
    clickBar (val) { // tabbar点击operation
      if (!this.userInfo) {
        this.$Modal.confirm({
          title: 'Please login',
          content: '<p>Please login</p>',
          okText: 'Log in',
          cancelText: 'Continue browsing',
          onOk: () => {
            this.$router.push({
              path: '/login',
              query: {
                rePath: this.$router.history.current.path,
                query: JSON.stringify(this.$router.history.current.query)
              }
            });
          }
        });
      } else {
        if (val.display) {
          this.handleDrawer = true
          this.drawerData = val
        } else {
          this.handleDrawer = false
          switch (val.title) {
            case 'Member':
              this.openBlank('/home')
              break;
            case 'My assets':
              this.openBlank('/home/MoneyManagement')
              break;
          }
        }
      }
    },
    openBlank (path) { // 新Page面打开address
      let routerUrl = this.$router.resolve({
        path: path
      })
      window.open(routerUrl.href, '_blank')
    },
    getCartList () { // 获取购物车列表
      cartCount().then(res => {
        this.$store.commit('SET_CARTNUM', res.result)
        this.Cookies.setItem('cartNum', res.result)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    background-color: #000!important;
  }
  .barItem {
    text-align: center;
    padding: 13px 0;

    cursor: pointer;
    color: #fff;
    &:hover{
      background-color: $theme_color;
      .circle{
        color: $theme_color;
        background-color: #fff;
      }
    }
  }

  .barTitle {
    writing-mode: vertical-lr;
    letter-spacing: 2px;
    padding: 4px 0;

  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    background: $theme_color;
  }

  .wrapper {
    width: 40px;
    position: fixed;
    transition: .35s;
    height: 100%;
    z-index: 9999;
    background: $dark_background_color;
    top: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  /deep/.popup .ivu-drawer-body{
    padding: 0!important;
    background-color: #eee;
  }
  /deep/.popup .ivu-drawer-wrap{
    z-index: 3001;
  }
</style>
