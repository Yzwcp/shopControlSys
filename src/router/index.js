import Vue from 'vue'
import Router from 'vue-router'
import '../plugins/element'
Vue.use(Router)
const Login = () => import('components/content/Login')
const Home = () => import('views/home/Home')
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]
const router = new Router({
  routes
})
// 挂载路由导航
router.beforeEach((to, form, next) => {
  // to 将要访问的路径
  // from 从哪个路径来
  // next 放行函数
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
