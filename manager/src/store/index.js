import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import user from "./modules/user";
import dict from "./modules/dict";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // state
    openStyleStore: "", // 移动端楼层装修中select风格存储
    openStoreId:"",
    notices: "" //通知Tips信息
  },
  mutations: {
    // 改变方法
  },
  actions: {},
  modules: {
    app,
    user,
    dict
  }
});

export default store;
