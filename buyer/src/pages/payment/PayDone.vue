<template>
  <div class="pay-done">
    <BaseHeader></BaseHeader>
    <div class="pay-done-box">
      <img src="../../assets/images/pay-success.png">
    </div>
    <div class="pay-btn">
      <Button type="primary" @click="$router.push('/')">Continue to browse</Button>
      <Button type="info" v-if="$route.query.orderType ==='RECHARGE'" @click="$router.push('/home/MoneyManagement')">Check the balance</Button>
      <Button type="info" v-else @click="$router.push('/home/myOrder')">View the order</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayDone',
  mounted () {
    document.querySelector('.pay-done').style.height = window.innerHeight + 'px'
  }
};
</script>

<style scoped lang='scss'>
.pay-done-box {
  margin: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay-btn{
  width: 300px;
  margin: 0 auto;
  >*{
    margin:0 4px;
  }
}
</style>
