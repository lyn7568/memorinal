<template>
  <div class="main-con">
    <group>
      <x-input
        title="类型名称"
        v-model="pojo.typename"
        placeholder="请输入类型名称"
        text-align="right"
        required
      ></x-input>
    </group>
    <group>
      <cell :title="typeid?'修改人':'创建人'" :value="UName"></cell>
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
import typeApi from "@/api/type";
export default {
  data() {
    return {
      typeid: '',
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
    if (this.$route.query.id) {
      this.typeid = this.$route.query.id
      this.findById()
    }
  },
  methods: {
    checkIsRequired() {
      if (this.pojo.typename) {
        return true;
      }
      return false;
    },
    onSubmit() {
      if (this.typeid) {
        this.pojo.updatetypeuid = this.UID;
      } else {
        this.pojo.userid = this.UID;
      }
      typeApi.saveOrUpdate(this.typeid, this.pojo).then(response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
          this.$store.dispatch('getDictType')
        }
      });
    },
    findById() {
      typeApi.findById(this.typeid).then(response => {
        this.pojo = response.data
      });
    }
  }
};
</script>
