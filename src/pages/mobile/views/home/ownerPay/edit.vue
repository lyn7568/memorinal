<template>
  <div class="main-con">
    <group>
      <popup-picker title="缴费类型" show-name :data="[typeList()]" v-model="pojo.typeid" placeholder="请选择缴费类型" required></popup-picker>
      <datetime title="缴费日期" v-model="pojo.paytime" placeholder="请选择缴费日期" required></datetime>
      <x-input title="缴费金额" v-model="pojo.paycount" placeholder="请输入缴费金额" text-align="right" required></x-input>
    </group>
    <group>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native="onSubmit">保存</x-button>
    </box>
  </div>
</template>

<script>
import { PopupPicker, Datetime } from "vux";
import paymoneyApi from "@/api/paymoney";
import { arrToStr, strToArr } from '@/utils'
import { messageFun } from '@/utils/msg'
export default {
  components: {
    PopupPicker,
    Datetime
  },
  data() {
    return {
      payid: '',
      pojo: {
        typeid: [],
        paytime: '',
        paycount: '',
        remark: ''
      }
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
    if (this.$route.query.id) {
      this.payid = this.$route.query.id
      this.findById()
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
      if (this.pojo.typeid && this.pojo.paytime && this.pojo.paycount) {
        return true;
      }
      return false;
    },
    onSubmit() {
      this.pojo.typeid = arrToStr(this.pojo.typeid)
      this.pojo.userid = this.UID
      paymoneyApi.saveOrUpdateOwner(this.payid,this.pojo).then( response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      paymoneyApi.findByIdOwner(this.payid).then(response => {
        response.data.typeid = strToArr(response.data.typeid)
        this.$nextTick(() => {
          this.pojo = response.data
        })
      })
    }
  }
};
</script>
