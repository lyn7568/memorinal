<template>
  <div class="main-con">
    <box gap="5px 0">
      <tab :line-width=2 v-model="curTab">
        <tab-item class="vux-center" v-for="item in tabList"
         :key="item.index" @on-item-click="$router.push({name: item.path})">{{item.name}}</tab-item>
      </tab>
      <router-view></router-view>
    </box>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";

export default {
  components: {
    Tab,
    TabItem
  },
  data() {
    return {
      curTab: 0,
      tabList: [
        {
          name: '群组缴费',
          path: 'myGroups'
        },
        {
          name: '个人缴费',
          path: 'ownerPay'
        }
      ]
    };
  }
};
</script>
