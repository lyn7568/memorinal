<template>
  <div class="main-con">
    <box gap="20px 15px">
      <button-tab v-model="curTab">
        <button-tab-item>群组缴费</button-tab-item>
        <button-tab-item>个人缴费</button-tab-item>
      </button-tab>
    </box>
    <box gap="15px" v-show="curTab===0">
      <my-groups></my-groups>
    </box>
    <box gap="15px 0" v-show="curTab===1">
      <personal-pay></personal-pay>
    </box>
  </div>
</template>

<script>
import { Grid, GridItem, ButtonTab, ButtonTabItem } from "vux";
import userApi from "@/api/user";
import { strToArr } from "@/utils";
import MyGroups from './myGroups'
import PersonalPay from './ownerPay/index'

export default {
  components: {
    Grid,
    GridItem,
    ButtonTab,
    ButtonTabItem,
    MyGroups,
    PersonalPay
  },
  data() {
    return {
      curTab: 0
    };
  }
};
</script>
