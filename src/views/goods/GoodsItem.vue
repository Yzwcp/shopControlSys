<template>
  <div class="GoodsItem">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input @input='changeIpt' @clear='clearIpt' clearable placeholder="请输入内容" v-model="goodsItemInfo.query" style="width:300px">
        <el-button slot="append" @click="searchBtn" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type='primary' size='small' @click="addGoods">添加商品</el-button>
       <el-table
        :data="goodsItemList.goods"
        style="width: 100%" align = 'center'>
        <el-table-column type='index'></el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
          <template v-slot='scope'>
            <div v-html="KeyRegExp(scope.row.goods_name,goodsItemInfo.query)"> </div>
          </template>
        </el-table-column>
        <el-table-column prop="goods_price" label="价格"></el-table-column>
        <el-table-column prop="goods_number" label="数量"></el-table-column>
        <el-table-column prop="add_time" label="添加时间"></el-table-column>
        <el-table-column  label="操作">
          <el-tooltip class="item" effect="dark" content="修改信息" placement="top">
              <el-button size='mini' type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>   
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size='mini' type="danger" icon="el-icon-delete"></el-button>   
          </el-tooltip> 
        </el-table-column>
       </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="goodsItemList.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import format from 'common/utils'
import {debounce} from 'common/debouce'

export default {
    name:"GoodsItem",
    data(){
      return{
        goodsItemInfo:{
          query:'',
          pagenum:1,
          pagesize:6
        },
        goodsItemList:{},
        //搜索框内柔
        searchIpt:''
      }
    },
    created(){
      this.getgoodsItemList()
    },
    methods:{
      getgoodsItemList(){
        this.$http.get('goods',{params:this.goodsItemInfo}).then(res=>{
          res.data.data.goods.forEach(item => {
            item.add_time = format(item.add_time,'YYYY-MM-DD HH:mm:ss')
          });
          this.goodsItemList = res.data.data
        })
      },
      handleCurrentChange(val) {
        this.goodsItemInfo.pagenum = val
        this.getgoodsItemList()
      },
      searchBtn(){this.getgoodsItemList()} ,
      clearIpt(){this.getgoodsItemList()},
      changeIpt(){
        let searchangeIpt = debounce(this.getgoodsItemList,1000)
        searchangeIpt()
      },
      //高亮
      KeyRegExp:function(val, keyword) {
                val = val + '';
                if (val.indexOf(keyword) !== -1 && keyword !== '') {
                    return val.replace(keyword, '<font color="#f00">' + keyword + '</font>')
                } else {
                    return val
                }
      },
      addGoods(){
          this.$router.push('/goods/add')
      }
  }
  
  
}
</script>

<style>
.heightColor{
  color: yellowgreen;
}
</style>