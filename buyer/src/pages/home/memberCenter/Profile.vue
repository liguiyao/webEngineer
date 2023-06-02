<template>
  <div class="wrapper">
    <card _Title="User information" />
    <Form :model="formItem" :rules="rules" ref="form" :label-width="80">
      <FormItem label="photo">
        <Avatar v-if="formItem.face" :src="formItem.face" size="80"/>
        <Avatar v-else icon="ios-person" size="80"/>
        <Upload
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :action="action"
          :headers="accessToken"
          >
          <Button class="mt_10">Upload photo</Button>
        </Upload>
      </FormItem>
      <FormItem label="nickname" prop="nickName">
        <Input class="wrapper-user-name" style="width:187px" v-model="formItem.nickName" placeholder="" />
      </FormItem>

      <FormItem label="brithday">
        <DatePicker type="date" placeholder="Select your birthday" v-model="formItem.birthday"></DatePicker>
      </FormItem>
      <FormItem label="gender">
        <RadioGroup v-model="formItem.sex" type="button" button-style="solid">
          <Radio :label="1">male</Radio>
          <Radio :label="0">female</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="save">Confirm</Button>

      </FormItem>
    </Form>
  </div>
</template>

<script>
import storage from '@/plugins/storage.js';
import { editMemberInfo } from '@/api/account.js';
import { commonUrl } from '@/plugins/request.js';
export default {
  name: 'Profile',
  data () {
    return {
      rules: { // 验证规则
        nickName: [{required: true, message: 'Nickname cannot be empty'}, { max: 16, message: 'Nicknames cannot be longer than 15 characters' }]
      },
      formItem: {}, // 表单数据
      action: commonUrl + '/common/common/upload/file', // 上传接口
      accessToken: {} // 验证token
    }
  },
  mounted () {
    this.formItem = JSON.parse(storage.getItem('userInfo'))
    this.accessToken.accessToken = storage.getItem('accessToken');
  },
  methods: {
    save () { // Save
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            birthday: this.$options.filters.unixToDate(this.formItem.birthday / 1000, 'yyyy-MM-dd'),
            face: this.formItem.face,
            nickName: this.formItem.nickName,
            sex: this.formItem.sex
          }
          editMemberInfo(params).then(res => {
            if (res.success) {
              this.$Message.success('Modified personal data successfully')
              storage.setItem('userInfo', res.result)
            }
          })
        }
      })
    },
    handleSuccess (res, file) { // 上传success
      this.$set(this.formItem, 'face', res.result)
    },
  }

}
</script>

<style scoped lang="scss">

</style>
