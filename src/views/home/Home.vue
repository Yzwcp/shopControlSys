<template>
  <div id="home">
       <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/push')
    }
  }
}
</script>

<style>

</style>
