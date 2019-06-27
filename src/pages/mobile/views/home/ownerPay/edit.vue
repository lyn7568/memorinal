<template>
  <div class="main-con">
    <group>
      <popup-picker title="缴费类型" :data="typeList" v-model="pojo.typeid" placeholder="请选择缴费类型" required></popup-picker>
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
import groupApi from "@/api/group";
import { messageFun } from '@/utils/msg'
export default {
  components: {
    PopupPicker,
    Datetime
  },
  data() {
    return {
      groupid: '',
      pojo: {}
    };
  },
  computed: {
    typeList() {
      return this.$store.getters.typeArrs
    },
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
    console.log(this.typeList)
    if (this.$route.query.id) {
      this.groupid = this.$route.query.id
      this.findById()
    }
  },
  methods: {
    checkIsRequired() {
      if (this.pojo.typeid && this.pojo.paytime && this.pojo.paycount) {
        return true;
      }
      return false;
    },
    onSubmit() {
      if (this.groupid) {
        this.pojo.updateuserid = this.UID;
      } else {
        this.pojo.createuserid = this.UID;
        this.pojo.groupmembers = this.UID;
      }
      groupApi.saveOrUpdate(this.groupid, this.pojo).then(response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      groupApi.findById(this.groupid).then(response => {
        this.pojo = response.data
      });
    }
  }
};
</script>
