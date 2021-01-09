import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'

import './plugins/element'
import 'assets/css/fonts/iconfont.css';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 根据token访问数据权限
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')