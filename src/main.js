import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

import './plugins/element'
import 'assets/css/fonts/iconfont.css';
Vue.component('zk-table', ZkTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//富文本编辑
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)


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