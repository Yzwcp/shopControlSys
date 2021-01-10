<template>
  <div id="Roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="addRoles" type="primary" @click="isDialogVisible= true">添加角色</el-button>
    <el-card class="box-card">
      <el-table
        :data="RolesList"
        stripe
        style="width: 100%">
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-row :class="{bottomborder:true,flexcolcenter:true }" :gutter="20"  v-for="(item1 , index) in scope.row.children" :key="index">
              <!-- 一级 -->
              <el-col  :span="6"><el-tag @close='removeRights3(scope.row,item1.id)' closable>{{item1.authName}}</el-tag></el-col>
              <el-col :span='18'>
                <!-- 二级 -->
                <el-row  class="flexcolcenter" v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span='5'><el-tag @close='removeRights3(scope.row,item2.id)' closable type='success'>{{item2.authName}}</el-tag></el-col>
                  <!-- 三级 -->
                  <el-col :span='19'><el-tag @close='removeRights3(scope.row,item3.id)' closable type='warning'  v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column  prop="roleName"  label="主管">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
        <el-table-column prop="username" label="操作" >
          <template slot-scope="scope" >
            <el-button size='mini' type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size='mini' @click="showSetRisghtDialog(scope.row)" type="warning" icon="el-icon-setting">分配权限</el-button>
            <el-button size='mini'  type="danger" icon="el-icon-delete">删除</el-button>   
          </template>
        </el-table-column>
      </el-table>      
    </el-card> 
    <!-- 分配权限对话框    -->
    <el-dialog
      title="提示"
      @close = 'setRightsDialog'
      :visible.sync="isShowSetRisghtDialog"
      width="50%">
      <!-- 树形控件 -->
     
      <el-tree ref="treeRef" :default-checked-keys='checkedKeys' default-expand-all node-key='id'  show-checkbox :data="getRightsList" :props="treeProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSetRisghtDialog = false">取 消</el-button>
        <el-button type="primary" @click="UpstateRisghtDialog">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
    name:'Roles',
    data(){
      return{
        RolesList:[],
        isShowSetRisghtDialog:false,
        //所有数据
        getRightsList:[],
        // 树形控件绑定对象
        treeProps:{
          label:'authName',
          children:'children'
        },
        //默认选中的数据
        checkedKeys:[],
        //角色id
        roleId:null,
      }
    },
    created(){
      this.getRolesList()
      
    },
    methods:{
      //获得权限列表
      getRolesList(){
        this.$http.get('roles').then((res)=>{
        if(res.data.meta.status !==200) return this.$message(res.data.meta.msg)
        this.RolesList = res.data.data
        this.$message(res.data.meta.msg)
      })  
      },
      //删除三级
      async removeRights3(role,rightsID){
      const confirmResult = await  this.$confirm('是否删除此权限', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
          return this.$message.info('没有删除')
        }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightsID}`)
      if (res.meta.status!==200) {
          return this.$message.error('失败')
      }
      role.children =res.data
      },
      //分配对话框
      async showSetRisghtDialog(role){
        this.roleId = role.id
        const res = await this.$http.get('rights/tree')
          if (res.data.meta.status!==200) {
            return this.$message.error('返回失败')
          }
        this.getRightsList = res.data.data
        // 递归获得三级节点id
        this.getLeafKeys(role,this.checkedKeys)
        
        this.isShowSetRisghtDialog =true
      },
      //通过递归获得角色下所有三级
      getLeafKeys(node,arr){
        if(!node.children){
          //如果node节点不包含children 那就是三级节点
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        });
      },
      setRightsDialog(){
        this.checkedKeys=[]
      },
      async UpstateRisghtDialog(){
        var arr =  [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        var {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:arr.join(',')})
        if(res.meta.status !== 200){
          return this.$message.error('更新失败')
        }
        console.log(res);
        this.$message.success(res.meta.msg)
        this.isShowSetRisghtDialog =false
        this.getRolesList()
      }
    },
   
}
//           this.$confirm('是否删除此权限', '提示', {
      //           confirmButtonText: '确定',
      //           cancelButtonText: '取消',
      //           type: 'warning'
      //           }).then(() => {
      //               this.$http.delete(`roles/${role.id}/rights/${rightsID}`).then((res)=>{
      //                   if (res.data.meta.status!==200) return this.$message.error('操作失败')
      //                   role.children.data=res.data
      //                   console.log(res);
      //                   this.getRolesList()
      //               })
      //           }).catch(() => {
      //               this.$message({
      //                   type: 'info',
      //                   message: '已取消删除'
      //               });          
      //             });
      // }
</script>

<style scoped>
.el-card{ box-shadow: 0px 5px 1px rgb(77, 76, 76);}
.addRoles{ margin: 20px 0 10px 0;}
.el-row{
  margin-bottom: 5px;
}
.el-tag{margin: 0px 5px 5px 0;}
.bottomborder{
  border-bottom: 1px rgb(226, 226, 226) solid;
}
.flexcolcenter{
  display: flex;
  align-items: center;
}
</style>