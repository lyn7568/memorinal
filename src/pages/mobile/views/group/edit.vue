<template>
  <div class="main-con">
    <group>
      <x-input
        title="群组名称"
        v-model="pojo.groupname"
        placeholder="请输入群组名称"
        text-align="right"
        required
      ></x-input>
      <x-input
        title="群组密钥"
        type="password"
        v-model="pojo.grouppwd"
        placeholder="请输入群组密钥"
        text-align="right"
        required
      ></x-input>
    </group>
    <group>
      <x-input :title="id?'修改人':'创建人'" v-model="UName" readonly text-align="right"></x-input>
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
import groupApi from "@/api/group";
export default {
  data() {
    return {
      pojo: {}
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
    if (this.$router.query.id) {
      this.id = this.$router.query.id
      this.findById()
    }
  },
  methods: {
    checkIsRequired() {
      if (this.pojo.username && this.pojo.telno) {
        return true;
      }
      return false;
    },
    saveOrUpdate() {
      if (this.id) {
        this.pojo.updateuserid = this.UID;
      } else {
        this.pojo.createuserid = this.UID;
        this.pojo.groupmembers = this.UID;
      }
      groupApi.saveOrUpdate(this.id, this.pojo).then(response => {
        this.messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      groupApi.findById(this.id).then(response => {
        this.pojo = response.data
      });
    }
  }
};
</script>
