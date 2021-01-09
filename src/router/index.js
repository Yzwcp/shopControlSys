import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Login = () =>
    import ('components/content/Login')
const Home = () =>
    import ('views/home/Home')
const Welcome = () =>
    import ('views/home/childComps/Welcome')
const Users = () =>
    import ('views/home/childComps/Users')
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
        ]
    }
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