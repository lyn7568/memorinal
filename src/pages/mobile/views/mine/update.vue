<template>
  <div class="main-con">
    <group>
      <x-input title="用户名" v-model="pojo.username" placeholder="请输入用户名" is-type="china-name" text-align="right"></x-input>
      <x-input title="手机号" v-model="pojo.telno" placeholder="请输入手机号" keyboard="number" is-type="china-mobile" text-align="right"></x-input>
    </group>
    <group>
      <popup-radio title="性别" :options="['男', '女']" v-model="pojo.sex"></popup-radio>
    </group>
    <group>
      <x-input title="籍贯" v-model="pojo.addr" name="text" placeholder="请输入籍贯" text-align="right"></x-input>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain @click.native="onSubmit">保存</x-button>
    </box>
  </div>
</template>

<script>
import { PopupRadio } from 'vux'
import userApi from "@/api/user"
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
    }
  },
  created() {
    this.findById()
  },
  methods: {
    onSubmit() {
        userApi.saveOrUpdate(this.UID,this.pojo).then( response => {
          this.$vux.toast.show({
            text: response.message,
            type: response.flag?'':'warn'
          })
          if(response.flag){
              this.findById()
              this.$router.back(-1)
              this.$store.dispatch('GetInfo')
          }
        })       
    },
    findById() {
        userApi.findById(this.UID).then(response => {
            this.pojo = response.data;
        })
    }
  }
}
</script>
