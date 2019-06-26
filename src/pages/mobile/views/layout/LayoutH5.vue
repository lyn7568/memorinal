<template>
  <div class="lyout-show">
    <view-box ref="viewBox">
      <x-header slot="header" :left-options="{backText: ''}" class="lay-header">{{$route.meta.title}}</x-header>
      <router-view></router-view>
      <tabbar slot="bottom">
        <tabbar-item v-for="tab in tabList" :key="tab.index" :selected="$route.path && $route.meta.active===tab.rname" :link="{name: tab.rname}">
          <svg-icon slot="icon" :icon-class="tab.icon" />
          <span slot="label">{{tab.name}}</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { ViewBox, XHeader, Tabbar, TabbarItem } from 'vux'
export default {
  name: 'layoutH5',
  data() {
    return {
      tabList: [
        {
          name: '首页',
          icon: 'home',
          rname: 'home'
        },
        {
          name: '群组',
          icon: 'group',
          rname: 'group'
        },
        {
          name: '类型',
          icon: 'form',
          rname: 'type'
        },
        {
          name: '我',
          icon: 'user',
          rname: 'mine'
        }
      ]
    }
  },
  created() {
    console.log(this.$route)
  },
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem
  }
}
</script>
<style lang="scss">
.lyout-show{
  height:100%;
  .lay-header{
    width:100%;
    position:absolute;
    left:0;
    top:0;
    z-index:100;  
  }
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
  .main-con{
    padding:40px 0 10px;
    .weui-btn_plain-default{
      border: none;
      background: #ffffff;
      border-radius: 0;
    }
  }
}
</style>
