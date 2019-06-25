<template>
  <div class="lyout-show">
    <router-view></router-view>
    <tabbar>
      <tabbar-item selected :link="{name: 'home'}">
        <svg-icon slot="icon" icon-class="table" />
        <span slot="label">缴费</span>
      </tabbar-item>
      <tabbar-item :link="{name: 'group'}">
        <svg-icon slot="icon" icon-class="group" />
        <span slot="label">群组</span>
      </tabbar-item>
      <tabbar-item :link="{name: 'type'}">
        <svg-icon slot="icon" icon-class="form" />
        <span slot="label">类型</span>
      </tabbar-item>
      <tabbar-item :link="{name: 'mine'}">
        <svg-icon slot="icon" icon-class="user" />
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'layoutH5',
  components: {
    Tabbar,
    TabbarItem
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
