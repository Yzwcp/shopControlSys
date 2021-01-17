<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-alert title="添加商品信息" center type="info" :closable='false'></el-alert>
        <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position='top' >    
            <el-tabs v-model="activeIndex" tab-position="left" @tab-click='tabClick'>
                <el-tab-pane label="基本信息" name='0'>
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格"  prop="goods_price">
                        <el-input v-model="addForm.goods_name" ></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量"  prop="goods_number">
                        <el-input v-model="addForm.goods_name" type='number'></el-input>
                    </el-form-item>
                    <!-- 联动菜单 -->
                    <el-form-item label="商品分类" prop="good_cat">
                    <Cascader @setCascader='getCascader'></Cascader>
                    </el-form-item> 
                </el-tab-pane>
                <el-tab-pane label="产品参数" name='1'>
                    <el-form-item :label='item.attr_name' v-for="(item, i) in manydata" :key="i">
                          <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="item" v-for="(item ,index) in item.attr_vals" :key="index"></el-checkbox>
                         </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name='2'>商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name='3'>
                    <el-upload
                    :on-success='onsuccess'
                    :headers='headersObj'
                    class="upload-demo"
                    action="http://127.0.0.1:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="视频内容" name='4'>
                      <quill-editor v-model="addForm.content"
                        ref="myQuillEditor">
                    </quill-editor>       
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card> 
  </div>
</template>

<script>
import Cascader from './Cascader.vue';
export default {
 name:'addGoods',
    data(){
        return{
            activeIndex:'0',
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_number:0,
                good_cat:[],
                pics:[],
                content:''
            },
            addFormRules:{
                goods_name:[
                    {
                        required: true,message:'请输入名称',trigger: 'blur'
                    }
                ],
                goods_price:[
                    {
                        required: true,message:'请输入价格',trigger: 'blur'
                    },
                ],
                goods_number:[
                    {
                        required: true,message:'请输入价格',trigger: 'blur'
                    },
                ],
                good_cat:[{required:true,message:'选择三级商品分类'}],
            },
            manydata:[],
            // 图片上传对象
            headersObj:{
                Authorization:window.sessionStorage.getItem('token')
            }
        }
    },
    methods:{
        getCascader(val){
            this.addForm.good_cat = val
            console.log(val);
            if (this.addForm.good_cat.length !==3 ) {
                this.addForm.good_cat=[]
            }
        },
        tabClick(){
            var id = this.addForm.good_cat[2]
            if (this.activeIndex == '1') {
                this.$http.get(`categories/${id}/attributes`,
                {params:{sel:'many'}}).then(res=>{
                    res.data.data.forEach(item => {
                        item.attr_vals=item.attr_vals.split(',')
                    });
                    this.manydata = res.data.data
                })
            }else if(this.activeIndex == '2'){

            }
        },
        // 处理预览
        handlePreview(){},
        // 移除效果
        handleRemove(){},
        onsuccess(response){
            const temp ={tmp_path: response.data.tmp_path}
            this.addForm.pics.push(temp)
        }
},
    components:{
        Cascader,
    }

}
</script>

<style>
.el-steps{margin: 20px 0;}
.ql-editor{
   min-height: 200px;
}
</style>