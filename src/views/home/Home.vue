<template>
  <div id="home">
    <el-container class="home-container">
      <el-header>
        <div>电商管理系统</div> 
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <el-menu
            unique-opened
            :default-active="ActiveHeightColor"
            class="el-menu-vertical-demo"
            background-color="#373D3F"
            text-color="#fff"
            active-text-color="#5A91D0"
           :collapse='isCollapse'
           :collapse-transition='false'
           router
           >
          <div class="togglebtn" @click="toggleBtn"> <span :class="{'togglebtn-span':isCollapse}">|||</span> </div>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="(item) in MenusList" :key="item.id">
              <template slot="title">
                <i :class="MenusIcon[item.id+'']"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item @click="setActive(subitem.path)" :index="'/'+subitem.path " v-for="subitem in item.children" :key="subitem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
        <el-main>
           <!-- 存放子路由 -->
           <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
      MenusList:[],
      MenusIcon:{
        '125':'iconfont icon-icon_zhanghao',
        '103':'iconfont icon-zhanghaoquanxianguanli',
        '101':'iconfont icon-icon_yingyongguanli',
        '102':'iconfont icon-icon_shiyongwendang',
        '145':'iconfont icon-tubiao-zhuzhuangtu'
      },
      isCollapse:false,
      ActiveHeightColor:null,
    }
  },
  created(){
    this.getMenusList()
    this.ActiveHeightColor = window.sessionStorage.getItem('ActiveHeightColor')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenusList(){
      this.$http.get('menus').then(res=>{
      if(res.data.meta.status !== 200) return  this.$message.error(res.data.meta.msg)
      this.MenusList = res.data.data
      })
    },
    toggleBtn(){
      this.isCollapse = !this.isCollapse
    },
    setActive(index){
      window.sessionStorage.setItem('ActiveHeightColor','/'+index)
      this.ActiveHeightColor = '/' + index
    }
  }
}
</script>

<style lang="less" scoped>
#home{
  height: 100%;
}
.el-header{
  background: #373D3F;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  color: white;
}
.el-aside{
  background:#373D3F ;
  .el-menu{
   border-right:none ;
  }
}
.el-main{
  background: #FCFFFC;
}
.home-container{
  height: 100%;
}
.iconfont{
  margin-right: 5px;
}
.togglebtn{
  line-height: 24px;
  color: white;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.togglebtn-span{
  transform: rotate(-90deg);
  display: block;
  margin-right: 5px;
}
</style>
