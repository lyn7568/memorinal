<template>
  <div class="main-con">
    <group v-for="item in 10" :key="item.index">
      <cell title="群组名称" :value="item.groupname"></cell>
      <cell title="创建人" :value="item.createuserid | uInfo"></cell>
      <cell title="备注" :value="item.remark"></cell>
      <cell title="创建时间" :value="item.createtime"></cell>
      <flexbox class="group-btn" :gutter="0">
        <flexbox-item><x-button plain @click.native="deleteById(item.id)">删除</x-button></flexbox-item>
        <flexbox-item><x-button plain @click.native="$router.push({name:'editGroup', query: { id:item.id } })">修改</x-button></flexbox-item>
        <flexbox-item v-if="ifBeyondGroup(item)"><x-button plain @click="outById(UID,item.id,true)">退群</x-button></flexbox-item>
        <flexbox-item><x-button plain @click="joinGroup(item.id)" :disabled="ifBeyondGroup(item)">{{ifBeyondGroup(item)?'已加入':'加群'}}</x-button></flexbox-item>
        <flexbox-item><x-button plain @click.native="$router.push({name:'groupM', query: { id:item.id } })">成员</x-button></flexbox-item>
      </flexbox>
    </group>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Cell } from "vux";
import groupApi from "@/api/group";
import { strToArr, arrToStr } from "@/utils";

export default {
  data() {
    return {
      list: null,
      searchMap: {},
      dialogFormVisible: false,
      pojo: {},
      id: null,
      page: 1,
      size: 10,
      total: 0
    };
  },
  components: {
    Cell,
    Flexbox,
    FlexboxItem
  },
  computed: {
    roles() {
      return this.$store.getters.roles;
    },
    name() {
      return this.$store.getters.name;
    },
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    this.search();
  },
  methods: {
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onCancel : () => {},
        onConfirm : () => {
          groupApi.deleteById(id).then(response => {
            this.messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    async search() {
      let response = await groupApi.search(this.page, this.size);
      if (response.flag && response.data) {
        const $info = response.data.rows;
        if ($info.length > 0) {
          for (let i = 0; i < $info.length; ++i) {
            $info[i].userGs = [];
            let res = await groupApi.findAllUserById($info[i].id);
            if (res.flag && res.data) {
              $info[i].userGs = res.data;
            }
          }
          this.list = $info;
          this.total = response.data.total;
        }
      }
    },
    currentPageSize(val) {
      this.size = val;
      this.search();
    },
    joinGroup(id) {
      this.$vux.confirm.prompt({
        title: '提示',
        content: '请输入群组密钥',
        showInput: true,
        onCancel : () => {},
        onConfirm : ({ value }) =>{
          groupApi.joinGroup({
              userid: this.UID,
              groupid: id,
              grouppwd: value
            })
            .then(response => {
              this.messageFun(response)
              if (response.flag) {
                this.search();
              }
            })
          }
        }).catch(err => {});
    },
    outById(id, gid, flag) {
      var msg = "";
      if (flag) {
        msg = "确定退群?";
      } else {
        msg = "确定移除?";
      }
      this.$vux.confirm.show({
        title: '提示',
        content: msg,
        onCancel : () => {},
        onConfirm : () => {
          groupApi.outGroup(id, gid).then(response => {
            this.messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    ifBeyondGroup(row) {
      if (row.groupmembers) {
        const uarr = strToArr(row.groupmembers);
        return uarr.indexOf(this.UID) > -1 || false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .group-btn{
    border-top: 1px solid #dcdcdc;
    .weui-btn{
      font-size: .9em;
    }
  }
</style>
