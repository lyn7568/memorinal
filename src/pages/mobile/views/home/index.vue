<template>
  <div class="main-con">
    <box gap="10px 0">
      <tab :line-width=2 v-model="curTab">
        <tab-item class="vux-center" v-for="(item, index) in tabList" :key="index">{{item}}</tab-item>
      </tab>
      <swiper v-model="curTab" height="100vh" :show-dots="false">
        <swiper-item v-for="(item, index) in tabList" :key="index">
          <div class="tab-swiper vux-center">
            <box gap="15px" v-show="curTab===0">
              <my-groups></my-groups>
            </box>
            <box gap="15px 0" v-show="curTab===1">
              <personal-pay></personal-pay>
            </box>
          </div>
        </swiper-item>
      </swiper>
    </box>
    <div v-if="curTab===1" class="add-group" @click="$router.push({name:'editOwnerPay'})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
import userApi from "@/api/user";
import { strToArr } from "@/utils";
import MyGroups from './myGroups'
import PersonalPay from './ownerPay/index'

export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    MyGroups,
    PersonalPay
  },
  data() {
    return {
      curTab: 0,
      tabList: ['群组缴费', '个人缴费']
    };
  }
};
</script>
