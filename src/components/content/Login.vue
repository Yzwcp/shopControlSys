<template>
  <div id="login">
    <div class="login-info">
      <div class="logo">
        <img src="~assets/img/login/Login.jpg" alt="">
      </div>
      <!-- 登录区域 -->
      <el-form ref="loginFormRef" :rules='loginFormRules' :model="LoginForm" label-width="0px" class="login-form">
        <el-form-item prop='username'>
          <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input type='password' v-model="LoginForm.password" prefix-icon="iconfont icon-icon-mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="btnRest">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登入表单的数据绑定对象
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      // 给form绑定验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置input内容
    btnRest () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证valid布尔值
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        // 判断表单验证是否成功，失败返回false，成功就请求数据判断。
        if (!valid) return false
        this.$http.post('login', this.LoginForm).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('账号或密码错误！请重新登录')
          this.$message({
            message: '恭喜你，登录成功',
            type: 'success'
          })
          console.log(res)
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('home')
          // 1.登入成功后保存token到sessionStorage中
          //  1.1如果出现登录之外的API接口，必须在登录之后才能访问。使用路由导航守卫
          // 2.通过链式路由跳转到/home
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~assets/css/fonts/iconfont.css';
  #login{
    background: #2b4b6b;
    padding: 0;
    margin: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-info{
    border-radius: 10px;
    width: 400px;
    height: 300px;
    background: white;
    position: relative;
  }
  .logo{
    width: 100px;
    height: 100px;
    position: absolute;
    border-radius: 50px;
    left: 50%;
    border: 5px rgb(255, 255, 255) solid;
    transform: translate(-50%,-50%);
    img{
      width: 100px;
      height: 100px;
      box-shadow: 0px 5px 10px rgba(19, 19, 19, 0.5);
      border-radius: 50px;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
