<template>
  <div id="cate">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button @click="getaddCateDialog" type="primary">添加分类</el-button>
      <zk-table border :show-index="true" index-text='#' :expand-type='false' :selection-type='false' :columns='columns' :data='goodsCate'>
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
            <i class="el-icon-error" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level == 1">等级二</el-tag>
            <el-tag v-else type="warning">等级三</el-tag>
        </template>
      </zk-table>
      <div class="block">
            <span class="demonstration">显示总数</span>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pagenum"
            :page-size="pagination.pagesize"
            layout="total, prev, pager, next"
            :total="total">
            </el-pagination>
        </div>      
    </el-card>  
    <!-- 添加商品分类对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="addCateDialog"
    width="30%"
    @close='addCateClose'>
        <span slot="footer" class="dialog-footer">
        <el-form :model="addCateForm" :rules="addCaterules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="添加到" prop="">
        <!-- 联动菜单 -->
            <el-cascader
            v-model="selectKey"
            :options="allList"
            @change="parentCateChange"
            :props='cateprops'
            clearable></el-cascader>
            </el-form-item>
            </el-form>
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogBtn">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
 name:'Cate',
 data(){
     return{
         goodsCate:[],
         pagination:{
            type:3,
            pagesize:10,
            pagenum:1
         },
         total:null,
         columns:[{
             label:'分类名称',
             prop:'cat_name'
         },{
             label:'是否有效',
             type: "template",
             template:'isok'
         },{
             label:'排序',
             type: "template",
             template:'level'
         }],
        //  商品分类对话框
        addCateDialog:false,
        addCateForm:{
            cat_name:'',
            cat_pid:0,
            cat_level:0
        },
        addCaterules:{
            cat_name: [
            { required: true, message: '请输入分类名字', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在2-6个字符之间', trigger: 'blur' }
          ],
        },
        allList:[],
        //渲染联动值
        cateprops:{
            value:'cat_id',
            label:'cat_name',
            children:'children',
            expandTrigger: 'hover',
            checkStrictly:true
        },
        //存储选中值的id
        selectKey:[]
     }
 },
 created(){
     this.getGoodsCate()
 },
 methods:{
     async getGoodsCate(){
         const {data:res} =await this.$http.get('categories',{params:this.pagination})
         console.log(res);
         if (res.meta.status !==200) {
             return this.$message.error(res.meta.msg)
         }
         this.goodsCate = res.data.result
         this.total = res.data.total
     },
     handleSizeChange(val){
         console.log(val);
     },
     handleCurrentChange(val){
         this.pagination.pagenum = val
         this.getGoodsCate()
     },
    //  添加商品分类
    getaddCateDialog(){
        this.addCateDialog = true
        this.$http.get('categories',{params:{type:2}}).then(res=>{
            this.allList =res.data.data
            console.log(res);
        })
    },
    //选择项发生变化
    parentCateChange(){
        if (this.selectKey.length>0) {
            this.addCateForm.cat_pid = this.selectKey[this.selectKey.length-1]
            this.addCateForm.cat_level = this.selectKey.length
        }
    },
    //添加分类
    addCateDialogBtn(){
        this.$refs.addCateFormRef.validate(valid=>{
            if (!valid)  return this.$message.error('填写分类名称错误')
                this.$http.post('categories',this.addCateForm).then(res=>{
                if (res.data.meta.status !==201) return this.$message.error(res.data.meta.msg)
                this.$message.success(res.data.meta.msg)
                this.getGoodsCate()
                this.addCateDialog=false
            })
        })
    },
    addCateClose(){
        this.$refs.addCateFormRef.resetFields()
        this.selectKey = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level=0
    }
 }
}
</script>

<style scpoed>
.el-card{ margin-top:20px;}
.el-icon-success{color: lightgreen;font-size: 25px;}
.el-icon-error{color: red;font-size: 25px;}

</style>