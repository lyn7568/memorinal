<template>
  <div class="app-container">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm formBox" label-width="100px" style="width: 640px">
      <el-form-item prop="oldpass" label="旧密码">
        <el-input type="password" v-model="ruleForm2.oldpass" placeholder="请输入您的旧密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="pass" label="新密码">
        <el-input type="password" v-model="ruleForm2.pass" placeholder="请设置您的新密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" label="确认密码">
        <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入密码确认" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item class="el-btn-col">
        <div class="el-btn-col-box">
          <el-button type="primary" @click.native.prevent="changePw('ruleForm2')">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import userApi from "@/api/user"

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请设置您的新密码'))
        } else if (value.length < 6 || value.length > 24) {
          callback(new Error('密码由6-24个字符组成，区分大小写'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码确认'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致，请重新输入!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm2: {
          oldpass: '',
          pass: '',
          checkPass: ''
        },
        rules2: {
          oldpass: [
            { required: true, message: '请输入您的旧密码', trigger: 'blur' }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
        UID() {
            return this.$store.getters.userid
        }
    },
    methods: {
      changePw(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const oldPassword = this.ruleForm2.oldpass
            const NewPassword = this.ruleForm2.checkPass
            userApi.changePwd(this.UID,oldPassword,NewPassword).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                if(response.flag){
                   this.$refs[formName].resetFields()
                }
            })
          } else {
            return false
          }
        })
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