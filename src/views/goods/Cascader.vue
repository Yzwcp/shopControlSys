<template>
  <div>
    <el-cascader
    v-model="selectKey"
    :options="cascader"
    
    @change="parentCateChange"
    :props='cateprops'
    clearable>
    </el-cascader>
  </div>
</template>

<script>
export default {
    data() {
            return {
                cascader: [],
                cateprops:{
                value: 'cat_id',
                label: 'cat_name',
                children:'children'
          },
          selectKey:[]
            }
        },
        created() {
            this.getCascader()
        },
        methods: {
            getCascader() {
                this.$http.get('categories').then(res => {
                    this.cascader = res.data.data
                })
            },
            parentCateChange(){
                this.$emit('setCascader',this.selectKey)
            }
        },
}
</script>

<style>

</style>