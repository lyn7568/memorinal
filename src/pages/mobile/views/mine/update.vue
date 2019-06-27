<template>
  <div class="main-con">
    <group>
      <x-input title="用户名" v-model="pojo.username" placeholder="请输入用户名" is-type="china-name" text-align="right" required></x-input>
      <x-input title="手机号" v-model="pojo.telno" placeholder="请输入手机号" keyboard="number" is-type="china-mobile" text-align="right" required></x-input>
    </group>
    <group>
      <popup-radio title="性别" :options="['男', '女']" v-model="pojo.sex"></popup-radio>
    </group>
    <group>
      <x-input title="籍贯" v-model="pojo.addr" name="text" placeholder="请输入籍贯" text-align="right"></x-input>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native="onSubmit">保存</x-button>
    </box>
  </div>
</template>

<script>
import { PopupRadio } from 'vux'
import userApi from "@/api/user"
import { messageFun } from '@/utils/msg'
export default {
  data() {
    return {
      pojo:{},
    }
  },
  components: {
    PopupRadio
  },
  computed: {
    UID() {
        return this.$store.getters.userid
    },
    sureDisable() {
      return !this.checkIsRequired() || false
    }
  },
  created() {
    this.findById()
  },
  methods: {
    checkIsRequired() {
      if (this.pojo.username
        && this.pojo.telno) {
          return true
      }
      return false
    },
    onSubmit() {
      if (this.checkIsRequired()) {
        userApi.saveOrUpdate(this.UID,this.pojo).then( response => {
          messageFun(response)
          if(response.flag){
              this.findById()
              this.$router.back(-1)
              this.$store.dispatch('GetInfo')
          }
        })
      }      
    },
    findById() {
        userApi.findById(this.UID).then(response => {
            this.pojo = response.data;
        })
    }
  }
}
</script>
