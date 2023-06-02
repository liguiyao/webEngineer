import { post, get } from '@/utils/request'

// 获取好友列表服务接口
export const ServeGetContacts = data => {
  return get('/contacts/list', data)
}

// 解除好友关系服务接口
export const ServeDeleteContact = data => {
  return post('/contacts/delete', data)
}

// modify好友备注服务接口
export const ServeEditContactRemark = data => {
  return post('/contacts/edit-remark', data)
}

// search联系人
export const ServeSearchContact = data => {
  return get('/contacts/search', data)
}

// 好友Apply  服务接口
export const ServeCreateContact = data => {
  return post('/contacts/apply/create', data)
}

// 查询好友Apply  服务接口
export const ServeGetContactApplyRecords = data => {
  return get('/contacts/apply/records', data)
}

// 处理好友Apply  服务接口
export const ServeApplyAccept = data => {
  return post('/contacts/apply/accept', data)
}

export const ServeApplyDecline = data => {
  return post('/contacts/apply/decline', data)
}

// 查询好友Apply  未读Quantity服务接口
export const ServeFindFriendApplyNum = () => {
  return get('/contacts/apply-unread-num')
}
