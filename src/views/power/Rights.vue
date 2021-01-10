<template>
  <div id="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="rightsList"
        stripe
        style="width: 100%">
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column  prop="authName"  label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot = 'scoped'>
            <el-tag v-if="scoped.row.level == 0">等级一</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level == 1">等级二</el-tag>
            <el-tag v-else type="warning">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>      
    </el-card>    
  </div>
</template>

<script>
export default {
    name:'Rights',
    data(){
      return{
        rightsList:[]
      }
    },
    created(){
      this.getRightsList()
    },
    methods:{
      getRightsList(){
        this.$http.get('rights/list').then((res)=>{
          console.log(res);
        if(res.data.meta.status !==200) return this.$message(res.data.meta.msg)
        this.rightsList = res.data.data
        this.$message(res.data.meta.msg)
      })  
      }
    }
}
</script>

<style scoped>
.el-card{ margin-top:20px;}
</style>