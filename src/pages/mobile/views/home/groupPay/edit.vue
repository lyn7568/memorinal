<template>
  <box gap="10px 0">
    <group>
      <x-input title="缴费人" :value="UName" text-align="right" readonly></x-input>
      <popup-picker title="缴费类型" show-name :data="typeList()?[typeList()]:[]" v-model="pojo.typeid" placeholder="请选择缴费类型" required></popup-picker>
      <datetime title="缴费日期" v-model="pojo.paytime" placeholder="请选择缴费日期"></datetime>
      <x-input title="缴费金额" v-model="pojo.paycount" placeholder="请输入缴费金额" text-align="right" required></x-input>
    </group>
    <group>
      <checklist
        title="平摊人"
        label-position="left"
        :options="userListGroup"
        v-model="ptUserArr"></checklist>
                      <!-- :disabled="" -->
    </group>
    <group>
      <x-input title="平摊金额" v-model="pojo.paycount" placeholder="0.00" text-align="right" readonly></x-input>
    </group>
    <group>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native="onSubmit">保存</x-button>
    </box>
  </box>
</template>

<script>
import { PopupPicker, Datetime, Checklist, Checker, CheckerItem } from "vux";
import paymoneyApi from "@/api/paymoney"
import groupApi from "@/api/group"
import { messageFun } from '@/utils/msg'
import { arrToStr, strToArr } from '@/utils'
export default {
  components: {
    PopupPicker,
    Datetime,
    Checker,
    CheckerItem,
    Checklist
  },
  data() {
    return {
      groupid: '',
      payid: '',
      pojo: {},
      userListGroup: [],
      ptUserArr: []
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid;
    },
    UName() {
      return this.$store.getters.name;
    },
    sureDisable() {
      return !this.checkIsRequired() || false;
    }
  },
  created() {
    if(this.$route.query.gid) {
      this.groupid = this.$route.query.gid
      this.findAllUserById()
      if (this.$route.query.id) {
        this.payid = this.$route.query.id
        this.findById()
      }
    }
  },
  methods: {
    typeList() {
      let arr = []
      const oj = this.$store.getters.typeArrs
      if (oj.length) {
        for(let i = 0; i < oj.length; ++i) {
          arr.push({
            value: oj[i].id,
            name: oj[i].typename
          })
        }
      }
      return arr
    },
    checkIsRequired() {
      if (this.pojo.typeid && this.pojo.paycount) {
        return true;
      }
      return false;
    },
    onSubmit() {
      this.pojo.typeid = arrToStr(this.pojo.typeid)
      this.pojo.groupid = this.groupid
      this.pojo.shareuserid = arrToStr(this.ptUserArr)
      paymoneyApi.saveOrUpdate(this.payid,this.pojo).then( response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      paymoneyApi.findById(this.payid).then(response => {
        response.data.typeid = strToArr(response.data.typeid)
        this.$nextTick(() => {
          this.pojo = response.data
        })
      })
    },
    findAllUserById() {
        groupApi.findAllUserById(this.groupid).then(response => {
          var userArr = []
          if (response.flag && response.data) {
            response.data.map(item => {
              userArr.push({
                key: item.id,
                value: item.username
              })
            })
          }
          this.$nextTick(() => {
            this.userListGroup = userArr
          })
        })
    }
  }
};
</script>

<style lang="scss">
  .check-item{
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 5px 15px;
    margin-right: 5px;
    margin-top:5px;
  }
  .check-item-selected{
    border-color: #ff4a00;
    border-width: 2px;
  }
</style>
