<template>
  <div class="main-con">
    <v-scroll :onLoadMore="onLoadMore" :dataList="scrollData">
      <group v-for="item in list" :key="item.index">
        <cell title="群组名称" :value="item.groupname" class="big-font"></cell>
        <cell title="创建人" :value="item.createuserid | uInfo"></cell>
        <cell title="备注" :value="item.remark"></cell>
        <cell title="创建时间" :value="item.createtime"></cell>
        <flexbox class="group-btn">
          <template v-if="UID===item.createuserid">
            <flexbox-item><x-button plain type="warn" @click.native="deleteById(item.id)">删除</x-button></flexbox-item>
            <flexbox-item><x-button plain type="primary" @click.native="$router.push({name:'editGroup', query: { id:item.id } })">修改</x-button></flexbox-item>
          </template>
          <template v-else>
            <flexbox-item v-if="ifBeyondGroup(item)"><x-button plain type="warn" @click="outById(UID,item.id)">退群</x-button></flexbox-item>
            <flexbox-item><x-button plain type="primary" @click.native="joinGroup(item.id)" :disabled="ifBeyondGroup(item)">{{ifBeyondGroup(item)?'已加入':'加群'}}</x-button></flexbox-item>
          </template>
          <template v-if="UID===item.createuserid || ifBeyondGroup(item)">
            <flexbox-item><x-button plain type="primary" @click.native="showGroupMemners(item)">查看成员</x-button></flexbox-item>
          </template>
        </flexbox>
      </group>
    </v-scroll>
    <div class="add-group" @click="$router.push({name:'editGroup'})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from "vux";
import groupApi from "@/api/group";
import { strToArr, arrToStr } from "@/utils";
import { messageFun } from '@/utils/msg'
import VScroll from "@/components/ScrollMore";
export default {
  data() {
    return {
      scrollData:{
        noFlag: false,
        loading: false
      },
      list: [],
      page: 1,
      size: 10
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    VScroll
  },
  computed: {
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
    onLoadMore(done) {
      var that = this
      if (!that.scrollData.noFlag) {
        setTimeout(() => {
          that.page++;
          that.search()
          done();
        }, 10);
      }
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          groupApi.deleteById(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    async search() {
      this.$vux.loading.show()
      let response = await groupApi.search(this.page, this.size);
      setTimeout(() => {
        this.$vux.loading.hide()
      }, 1000)
      if (response.flag && response.data) {
        const oj = response.data.rows
        if(oj.length > 0) {
          this.$nextTick(() => {
            this.list = this.list.concat(oj)
          })
          if (oj.length < this.size) {
            this.scrollData.noFlag = true
          }
        }
      }
      this.scrollData.loading = false
    },
    currentPageSize(val) {
      this.size = val;
      this.search();
    },
    joinGroup(id) {
      const _this = this
      this.$vux.confirm.prompt('请输入群组密钥',{
        title: '提示',
        onConfirm: (value) => {
          groupApi.joinGroup({
            userid: this.UID,
            groupid: id,
            grouppwd: value
          }).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    outById(id, gid) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定退群?',
        onConfirm : () => {
          groupApi.outGroup(id, gid).then(response => {
            messageFun(response)
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
    },
    showGroupMemners(row) {
      this.$router.push({name:'groupM', query: { id:row.id, cid:row.createuserid } });
      sessionStorage.setItem('GROUPName',row.groupname)
    }
  }
};
</script>

<style lang="scss" scoped>
.main-con{
  .group-btn{
    border-top: 1px solid #dcdcdc;
    .weui-btn{
      font-size: .9em;
      border-radius: 0;
      border:none;
    }
  }
}
</style>
