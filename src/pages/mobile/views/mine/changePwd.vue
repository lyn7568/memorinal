<template>
  <div class="main-con">
    <group>
      <x-input type="password" title="旧密码" v-model="ruleForm.oldpass" placeholder="请输入您的旧密码" text-align="right" required></x-input>
      <x-input type="password" title="新密码" :min="6" :max="24" v-model="ruleForm.pass" placeholder="请设置您的新密码" text-align="right" required></x-input>
      <x-input type="password" title="确认密码" v-model="ruleForm.checkPass" :equal-with="ruleForm.pass" placeholder="请再次输入密码确认" text-align="right" required></x-input>
    </group>
    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native.prevent="changePw">确定</x-button>
    </box>
  </div>
</template>

<script>
  import userApi from "@/api/user"

  export default {
    data() {
      return {
        ruleForm: {
          oldpass: '',
          pass: '',
          checkPass: ''
        }
      }
    },
    computed: {
        UID() {
            return this.$store.getters.userid
        }
    },
    computed: {
      sureDisable() {
        return !this.checkIsPass() || false
      }
    },
    methods: {
      checkIsPass() {
        if (this.ruleForm.oldpass
          && this.ruleForm.pass
          && this.ruleForm.checkPass
          && this.ruleForm.checkPass === this.ruleForm.pass
          && this.ruleForm.pass.length >= 6 && this.ruleForm.pass.length <= 24) {
            return true
        }
        return false
      },
      changePw() {
        if (this.checkIsPass()) {
          const oldPassword = this.ruleForm.oldpass
          const newPassword = this.ruleForm.checkPass
          userApi.changePwd(this.UID,oldPassword,newPassword).then(response => {
              this.$vux.toast.show({
                text: response.message,
                type: response.flag?'':'warn'
              })
              if(response.flag){
                  this.ruleForm = {
                    oldpass: '',
                    pass: '',
                    checkPass: ''
                  }
                  this.$router.back(-1)
              }
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .modifyBox {
    display: flex;
    justify-content: center;

    .formBox {
      width: 400px;
      margin-top: 100px;
    }
  }
</style>