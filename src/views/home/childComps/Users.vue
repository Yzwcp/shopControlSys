<template>
  <div id="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>   
    <el-card class="box-card">
        <el-row :gutter='20'>
            <el-col :span='8'>
                <el-input @input="autoSearch" @clear="getUsersList" clearable placeholder="请输入内容" v-model="queryInfo.query">
                    <el-button @click="getUsersList" slot="append" icon="el-icon-search"></el-button>
                </el-input>                
            </el-col>
            <el-col :span='4'>
                <el-button type="primary" @click="isDialogVisible= true">添加用户</el-button>
            </el-col>
        </el-row>
     <!-- 用户渲染     -->
        <el-table
        :data="UsersList.users"
        style="width: 100%"
        v-loading="loading">
        <el-table-column type='index' label='id'></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态" >
            <template slot-scope="scope">
                <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="change([scope.row.id,scope.row.mg_state])">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="username" label="操作" >
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改信息" placement="top">
                    <el-button size='mini' @click="modifyUsers(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
                </el-tooltip>   
                <el-tooltip class="item" effect="dark" content="设置" placement="top">
                    <el-button size='mini' type="warning" icon="el-icon-setting"></el-button>
                </el-tooltip> 
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size='mini' @click="usersDelete(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>   
                </el-tooltip>                              
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="UsersList.total">
        </el-pagination>
    </el-card>   
    <!-- 添加对添加用户话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="isDialogVisible"
        @close="addClose"
        width="50%">
        <!-- 主体区域 -->
        <span></span>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-form ref="addFormRef" :rules='addFormRules' :model="addForm" label-width="80px" class="">
                <el-form-item prop='username'  label='用户名'>
                    <el-input v-model="addForm.username"  ></el-input>
                </el-form-item>
                <el-form-item prop='password' label='密码'>
                    <el-input type='password' v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item prop='email' label='email'>
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item prop='mobile' label='手机号'>
                    <el-input  v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button @click="isDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUsers">确 定</el-button>
                </el-form-item>
                
            </el-form>
        </span>
    </el-dialog>   
    <!-- 修改用户对话框 -->
    <el-dialog
        title="提示"
        :visible.sync="isModifyUsers"
        width="50%"
        @close="modifyClose">
        <span slot="footer" class="dialog-footer">
            <el-form ref="modifyFormRef" :rules='modifyFormRules' :model="modifyForm" label-width="80px">
        <el-form-item label="用户名" prop='username'>
            <el-input v-model="modifyForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
            <el-input v-model="modifyForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
            <el-input v-model="modifyForm.mobile"></el-input>
        </el-form-item>
            <el-button @click="isModifyUsers = false">取 消</el-button>
            <el-button type="primary" @click="modifyBtn">确 定</el-button></el-form>
        </span>
        
    </el-dialog>
  </div>
</template>

<script>
import  {debounce}  from "common/debouce";
export default {
    name:'Users',
    data(){
        //自定义验证邮箱
        var checkEmail =(rule,value,callback)=>{
            var regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(regEmail.test(value)){return callback()} 
            callback(new Error('请输入正确的邮箱'))
        }
        var checkMobile=(rule,value,callback)=>{
            var regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
            if(regMobile.test(value)){return callback()} 
            callback(new Error('请输入正确的手机'))
        }
        return{
            UsersList:{},
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            loading:false,
            // 添加用户弹出框
            isDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
            },
            // 给添加用户form绑定验证规则
            addFormRules: {
                // 验证用户名是否合法
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
                ],
                email: [
                    { validator:checkEmail,trigger:'blur'},
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在2-10个字符之间', trigger: 'blur' }
                ],
                // 验证密码是否合法
                mobile: [
                    {validator:checkMobile,trigger:'blur'},
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在2-10个字符之间', trigger: 'blur' }
                ]
            },
            //修改用户弹出框     
            isModifyUsers:false,
            modifyForm:{
                username:'',
                email:'',
                mobile:'',
            },
            modifyFormRules:{
                 // 验证用户名是否合法
                username: [
                    {message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
                ],
                email: [
                    { validator:checkEmail,trigger:'blur'},
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在2-10个字符之间', trigger: 'blur' }
                ],
                // 验证密码是否合法
                mobile: [
                    {validator:checkMobile,trigger:'blur'},
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在2-10个字符之间', trigger: 'blur' }
                ] 
            },
        }
    },
    created(){
            if (window.sessionStorage.getItem('PageWidth')) {
                this.queryInfo.pagesize= parseInt( window.sessionStorage.getItem('PageWidth'))
            }
            this.getUsersList()
            this.SearchDebouce = debounce(this.getUsersList,1000)
            this.loading=true
    },
    mounted(){
        this.loading=true
    },
    methods:{
        getUsersList(){
            // 获取users的数据
            this.$http.get('/users' ,{params:this.queryInfo}).then(res=>{
                if(res.data.meta.status !==200) return this.$message.error(res.data.meta.msg)
                this.UsersList = res.data.data
                this.loading=false

            })
        },
        //修改用户状态
        change(StatusParams){
            // let uid=StatusParams[0].toString()
            // console.log( ('users/:'+uid+'/state/:'+ StatusParams[1]));
            this.$http.put(`users/${StatusParams[0]}/state/${StatusParams[1]}`)
        },
        //修改每页显示条数
        handleSizeChange(nowNumber){
            this.queryInfo.pagesize = nowNumber
            window.sessionStorage.setItem('PageWidth',nowNumber)
            this.getUsersList()
        },
        //点击当前页和上下页
        handleCurrentChange(nowPage){
            this.queryInfo.pagenum = nowPage
            this.getUsersList()
        },
        //输入自动搜索
        autoSearch(){
            // 防抖
            let SearchDebouce = debounce(this.getUsersList,1000)
            SearchDebouce()
        },
        // 关闭提示框清除form内容
        addClose(){
            this.$refs.addFormRef.resetFields()
        },
        addUsers(){
            //添加用户预校验
            this.$refs.addFormRef.validate((valid)=>{
                if (!valid) return this.$message.error('请重新输入')
                this.$http.post('/users',this.addForm).then(res=>{
                    console.log(res);
                    if (res.data.meta.status!==201) return this.$message.error('添加失败')
                })
                this.$message.success('添加成功')
                this.isDialogVisible = false
                //添加成功重新刷新列表  
                this.getUsersList()
                
            })
        },
        //修改用户信息
        modifyUsers(iid){
            this.isModifyUsers=true
            this.$http.get(`/users/${iid}`).then(res=>{
                if (res.data.meta.status!==200) return this.$message.error('获得失败')
                this.modifyForm =  res.data.data
                this.modifyForm.iid = iid
            })
            
        },
        modifyBtn(){
            this.$refs.modifyFormRef.validate(valid=>{
                if (!valid) return this.$message.error('请重新输入')
                this.$http.put('/users/'+this.modifyForm.id,{
                   email: this.modifyForm.email,
                   mobile:this.modifyForm.mobile
                }).then(res=>{
                    if (res.data.meta.status!==200) return this.$message.error('添加失败')
                    this.$message.success('更新成功')
                    this.isModifyUsers = false
                    //添加成功重新刷新列表  
                    this.getUsersList()
                })
                
            })
        },
        modifyClose(){
            this.$refs.modifyFormRef.resetFields()

        } ,
        usersDelete(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.delete('/users/'+id).then((res)=>{
                        if (res.data.meta.status!==200) return this.$message.error('删除失败')
                        this.getUsersList()
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                    });
                }
            }
        }
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 12px;
}
.el-pagination{
    margin-top:12px ;
}
</style>