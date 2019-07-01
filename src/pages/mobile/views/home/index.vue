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
          tab: 0,
          name: '群组缴费',
          path: 'myGroups'
        },
        {
          tab: 1,
          name: '个人缴费',
          path: 'ownerPay'
        }
      ]
    };
  },
  created() {
    if (this.$route.name === 'ownerPay') {
      this.curTab = 1
    }
  }
};
</script>
