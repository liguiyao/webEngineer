import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import storage from '@/plugins/storage.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navList: [], // Home快捷导航
    cartNum: storage.getItem('cartNum') || 0,
    logoImg: storage.getItem('logoImg') || require('@/assets/images/logo2.png'),
    siteName:storage.getItem('siteName')|| 'easyshop',
    hotWordsList: storage.getItem('hotWordsList'),
    category: JSON.parse(localStorage.getItem('category'))
  },
  getters,
  actions,
  mutations
});
