<template>
  <div class="app-container">
    <el-form ref="form" :model="pojo" label-width="100px" style="width: 640px">
      <el-form-item label="用户名" >
          <el-input v-model="pojo.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话号" >
          <el-input v-model="pojo.telno" auto-complete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="登录密码" >
          <el-input v-model="pojo.password" auto-complete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="籍贯" >
          <el-input v-model="pojo.addr" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" >
          <el-radio v-model="pojo.sex" label="男">男</el-radio>
          <el-radio v-model="pojo.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="备注" >
          <el-input v-model="pojo.remark" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userApi from "@/api/user"
export default {
  data() {
    return {
      pojo:{},
    }
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
            this.$message({
                showClose: true,
                message: response.message,
                type: response.flag?'success':'error'
            });
            if(response.flag){
                this.findById()
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
