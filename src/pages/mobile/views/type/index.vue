<template>
  <div class="main-con">
    <box gap="1.2em 0">
      <panel :list="list"></panel>
    </box>
  </div>
</template>

<script>
import { Panel  } from 'vux'
import typeApi from "@/api/type"
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      page: 1,
      size: 20,
      list: []
    }
  },
  components: {
    Panel
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.$vux.loading.show({
        text: 'Loading'
      })
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
            this.list = arr
          }
        } 
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
