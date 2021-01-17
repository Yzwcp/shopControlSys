<template>
  <div id="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon>
        </el-alert>
        选择商品分类 ：
        <el-cascader
            v-model="value"
            :options="cascaDerdata"
            @change="handleChange"
            :props='cascaderProps'>
        </el-cascader>
        <el-tabs v-model="activeName" @tab-click="tabsClick">
            
            <el-tab-pane label="动态参数" name="only">
                <el-button :disabled='btnFlag' type="primary">添加参数</el-button>
                <!-- 静态属性表格 -->
                <el-table
                :data="goodsParamsOnly"
                style="width: 100%">
                <el-table-column  type='expand'>
                    <template slot-scope="scope">
                        <el-tag @close='closeTag(scope.row)' closable v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                          <div style="margin-top:10px;width:150px;" >
                            <el-tag type='danger' disable-transitions v-show="!scope.row.isShowIpt" @click='addClick(scope.row)'>+TAG</el-tag>
                            <el-input  ref="saveTagInput" @blur='iptBlur(scope.row)' v-model="scope.row.value"  v-show="scope.row.isShowIpt"></el-input>
                          </div>
                    </template>
                </el-table-column>
                <el-table-column  type='index'></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column>
                <el-tooltip class="item" effect="dark" content="修改信息" placement="top">
                    <el-button size='mini' @click="modifyUsers(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
                </el-tooltip>   
                <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                    <el-button size='mini' @click="ShowRoledialog(scope.row)" type="warning" icon="el-icon-setting"></el-button>
                </el-tooltip> 
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size='mini' @click="usersDelete(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>   
                </el-tooltip>      
                </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="many">
                <el-button :disabled='btnFlag'  type="primary">添加属性</el-button>
                <el-table
                :data="goodsParamsMany"
                style="width: 100%">
                <el-table-column  type='expand'>
                    <template slot-scope="scope">
                        <el-tag @close='closeTag(scope.row)' closable v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                          <div style="margin-top:10px;width:150px;" >
                            <el-tag type='danger' disable-transitions v-show="!scope.row.isShowIpt" @click='addClick(scope.row)'>+TAG</el-tag>
                            <el-input   ref="saveTagInput" @blur='iptBlur(scope.row)' v-model="scope.row.value"  v-show="scope.row.isShowIpt"></el-input>
                          </div>
                    </template>
                </el-table-column>
                    <el-table-column  type='index'></el-table-column>
                <el-table-column
                    prop="attr_name"
                    label="参数名称">
                </el-table-column>
                <el-table-column>
                <el-tooltip class="item" effect="dark" content="修改信息" placement="top">
                    <el-button size='mini' @click="modifyUsers(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
                </el-tooltip>   
                <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                    <el-button size='mini' @click="ShowRoledialog(scope.row)" type="warning" icon="el-icon-setting"></el-button>
                </el-tooltip> 
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size='mini' @click="usersDelete(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>   
                </el-tooltip>      
                </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    
    </el-card>
  </div>
</template>

<script>
export default {
    name:'GoodsParams',
    data(){
        return{
            cascaDerdata:[],
            cascaderProps:{
            value: 'cat_id',
            label: 'cat_name',
            children:'children'
          },
          value:[],
          activeName:'only',
          goodsParamsOnly:[],
          goodsParamsMany:[],
        }
    },
    created(){
        this.getCascaderdata()
    },
    methods:{
        getCascaderdata(){
            this.$http.get('categories',{params:{type:3}}).then(res=>{
            this.cascaDerdata =res.data.data
            console.log(res);
        })
        },
        //判断是否三级目录
        handleChange(){
            if (this.value.length !== 3) {
                this.goodsParamsOnly=[],
                this.goodsParamsMany=[]
                return this.value=[]
            }
            console.log(this.value);
            this.getCategories()
        },
        tabsClick(){
            this.getCategories()
        },
        async getCategories(){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
            {
                params:{sel:this.activeName}
            })
            res.data.forEach(element => {
              element.attr_vals =  element.attr_vals.split(' ')
              element.isShowIpt = false
              element.value = ''
            });
            
            if (this.activeName === 'only') {
                this.goodsParamsOnly = res.data
            }else{
                this.goodsParamsMany =res.data
            }
        
        },
        async closeTag(row,i){
            const confirmResult = await  this.$confirm('是否删除此权限', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).catch(err=>err)
            if(confirmResult !=='confirm'){
            return this.$message.info('没有删除')
            }
            row.attr_vals.splice(i,1)
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {attr_name:row.attr_name,
             attr_sel:row.attr_sel,
             attr_vals:row.attr_vals.join(' ')})
        },
        addClick(TagFlag){
            TagFlag.isShowIpt  = !TagFlag.isShowIpt
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        iptBlur(TagFlag){
           TagFlag.isShowIpt  = !TagFlag.isShowIpt
           TagFlag.attr_vals.push(TagFlag.value) 
           this.$http.put(`categories/${TagFlag.cat_id}/attributes/${TagFlag.attr_id}`,
           {attr_name:TagFlag.attr_name,
           attr_sel:TagFlag.attr_sel,
           attr_vals:TagFlag.attr_vals.join(' ')}).then(res=>{
               
                   
            
           })
           TagFlag.value = ''
        }
    },
    computed:{
        //按钮是否禁用
          btnFlag(){
              if (this.value.length !== 3) return true
              return false
          },
          cateId(){
              if (this.value.length !==3) {
                  return
              }
              return this.value[2]
          }
    }
}
</script>

<style>
.el-card{ margin-top:20px;
    
}
.el-tag{ margin: 0px 0 10px 10px;cursor: pointer; }
</style>