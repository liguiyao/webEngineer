import Cookies from 'js-cookie';

const user = {
    state: {},
    mutations: {
        logout () {
            Cookies.remove('userInfoManager');
            // 清空打开的Page面等数据
            localStorage.clear();
        }
    }
};

export default user;
