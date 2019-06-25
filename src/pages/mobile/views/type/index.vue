<template>
  <div class="lyout-show">
    <panel header="缴费类型" :list="list"></panel>
  </div>
</template>

<script>
import { Panel, Group  } from 'vux'
import typeApi from "@/api/type"
export default {
  data() {
    return {
      page: 1,
      size: 20,
      list: []
    }
  },
  components: {
    Panel,
    Group
  },
  created() {
    this.search()
  },
  methods: {
    search() {
        typeApi.search(this.page,this.size).then( response => {
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
