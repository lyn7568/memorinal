<template>
  <div class="main-con">
    <v-scroll :onLoadMore="onLoadMore" :dataList="scrollData">
      <group>
        <panel :list="list"></panel>
      </group>
    </v-scroll>
  </div>
</template>

<script>
import { Panel  } from 'vux'
import typeApi from "@/api/type"
import VScroll from "@/components/ScrollMore";
export default {
  data() {
    return {
      scrollData:{
        noFlag: false,
        loading: false
      },
      page: 1,
      size: 20,
      list: []
    }
  },
  components: {
    Panel,
    VScroll
  },
  created() {
    this.search()
  },
  methods: {
     onLoadMore(done) {
      var that = this
      if (!that.scrollData.noFlag) {
        setTimeout(() => {
          that.page++;
          that.search()
          done();
        }, 10);
      }
    },
    search() {
      this.$vux.loading.show()
      typeApi.search(this.page,this.size).then( response => {
        setTimeout(() => {
          this.$vux.loading.hide()
        }, 1000)
        if (response.flag && response.data) {
          var arr = []
          const obj = response.data.rows
          if (obj.length > 0) {
            for (let i = 0; i < obj.length; ++i) {
              let item = {
                title: obj[i].typename,
                desc: obj[i].remark
              }
              arr.push(item)
            }
            this.$nextTick(() => {
              this.list = this.list.concat(arr)
            })
            if (obj.length < this.size) {
              this.scrollData.noFlag = true
            }
          }
        }
        this.scrollData.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.lyout-show{
  .weui-tabbar__icon{
    width:auto;
    height: auto;
  }
  .weui-tabbar__label{
    margin: 2px 0;
  }
  .svg-icon{
    font-size: 16px;
  }
}
</style>
