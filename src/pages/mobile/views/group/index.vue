<template>
  <div class="lyout-show">
    <group>
      <cell is-link title="Simple" link="/component/tabbar-simple"></cell>
      <cell is-link title="Switch icons" link="/component/tabbar-icon"></cell>
    </group>
    <tabbar>
      <tabbar-item selected>
        <svg-icon slot="icon" icon-class="table" />
        <span slot="label">缴费</span>
      </tabbar-item>
      <tabbar-item>
        <svg-icon slot="icon" icon-class="group" />
        <span slot="label">群组</span>
      </tabbar-item>
      <tabbar-item>
        <svg-icon slot="icon" icon-class="form" />
        <span slot="label">类型</span>
      </tabbar-item>
      <tabbar-item>
        <svg-icon slot="icon" icon-class="user" />
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Group, Cell } from 'vux'

export default {
  components: {
    Tabbar,
    TabbarItem,
    Group,
    Cell
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
