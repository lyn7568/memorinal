<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
  body{
    background: #f4f6f8;
  }
  #app{
    height: 100%;
  }
</style>

