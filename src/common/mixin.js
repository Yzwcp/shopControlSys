export const cascaderMixin = {
        data() {
            return {
                cascader: []
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
        },
    }
    //可以混入生命周期函数，methods 也可以只不过 混入的是一整个函数