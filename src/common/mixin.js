import BackTop from "components/content/backTop/BackTop";

export const backTopMixin = {
    data() {
        return {
            isShow:false
        }
    },
    methods: {
        backtop() {
            this.$refs.scroll.scroll.scrollTo(0, 0, 500);
          },
    },
    components: {
        BackTop
    }
}
//可以混入生命周期函数，methods 也可以只不过 混入的是一整个函数 