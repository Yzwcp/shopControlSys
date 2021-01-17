<template>
  <div>
      <el-card> 
          <div id="main" style="width: 600px;height:400px;"></div>
      </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            datas:{}
        }
    },
    created(){
      
    },
 async mounted(){
     const {data:res}=await this.$http.get('reports/type/1')
        var myChart = echarts.init(document.getElementById('main'));
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
 },
}
</script>

<style>

</style>