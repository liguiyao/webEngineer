<template>
  <div>
    <card _Title="Delivery address" _More="Add new address" _Src="/home/addAddress"></card>
    <div class="address-box" v-for="(item, index) in list" :key="index">
      <div class="address-header">
        <span>
          {{ item.name }}
          <Tag class="ml_10" v-if="item.isDefault" color="red">Default address</Tag>
          <Tag class="ml_10" v-if="item.alias" color="warning">{{item.alias}}</Tag>
        </span>
        <div class="address-action">
          <span @click="edit(item.id)"><Icon type="edit"></Icon>modify</span>
          <span @click="del(item.id)"><Icon type="trash-a"></Icon>delete</span>
        </div>
      </div>
      <div class="address-content">
        <p>
          <span class="address-content-title"> receiver :</span> {{ item.name }}
        </p>
        <p>
          <span class="address-content-title">receive area:</span
          >{{ item.consigneeAddressPath | unitAddress }}
        </p>
        <p>
          <span class="address-content-title">Full address:</span> {{ item.detail }}
        </p>
        <p>
          <span class="address-content-title">Phone number:</span> {{ item.mobile }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card';
import { memberAddress, delMemberAddress } from '@/api/address.js';

export default {
  name: 'MyAddress',

  data () {
    return {
      list: [] // address列表
    };
  },
  methods: {
    edit (id) {
      // 编辑address
      this.$router.push({ path: '/home/addAddress', query: { id: id } });
    },
    del (id) {
      // deleteaddress
      this.$Modal.confirm({
        title: 'Tips',
        content: 'Are you sure to delete this Delivery address',
        onOk: () => {
          delMemberAddress(id).then((res) => {
            if (res.success) {
              this.$Message.success('deletesuccess');
              this.getAddrList();
            }
          });
        },
        onCancel: () => {
          this.$Message.info('Cancel delete');
        }
      });
    },
    getAddrList () {
      // 获取address列表
      memberAddress().then((res) => {
        console.log(res);
        if (res.success) {
          this.list = res.result.records;
        }
      });
    }
  },
  mounted () {
    this.getAddrList();
  }
};
</script>

<style scoped lang="scss">
.address-box {
  padding: 15px;
  margin: 15px;

  border-bottom: 1px solid $border_color;
}

.address-header {
  cursor: pointer;
  height: 35px;
  display: flex;
  justify-content: space-between;
  @include title_color($light_title_color);
  font-size: 18px;
}

.address-content {
  cursor: pointer;
  font-size: 14px;

  > p {
    padding: 12px 0;
  }
}

.address-content-title {

}

.address-action span {
  margin-left: 15px;
  font-size: 14px;
  color: $theme_color;
  cursor: pointer;
}

#map-container {
  width: 500px;
  height: 300px;
}
</style>
