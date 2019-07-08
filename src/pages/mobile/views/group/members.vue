<template>
  <div class="main-con">
    <group>
      <group-title>{{gName}}</group-title>
      <div class="vux-1px-t">
        <swipeout class="vux-1px-tb">
          <swipeout-item v-for="item in list" :key="item.index" :disabled="UID!==createuserid || item.id===createuserid">
            <div slot="right-menu">
              <swipeout-button @click.native="outById(item.id)" background-color="#D23934">移除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-tb">
              <cell :title="item.username+'-'+item.sex+'-'+item.addr" :value="item.remark" :inline-desc="item.telno">
                <div class="badge-value" v-if="item.id===createuserid">
                  <span class="vertical-middle">{{item.remark}}</span><br/>
                  <badge text="群主"></badge>
                </div>
              </cell>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </group>
    <group-title v-if="UID===createuserid">试试向左滑动，可以移除该成员</group-title>
  </div>
</template>
<script>
import { GroupTitle, Swipeout, SwipeoutItem, SwipeoutButton, Badge } from 'vux'
import groupApi from '@/api/group'
import { messageFun } from '@/utils/msg'

export default {
  data() {
    return {
      gName: '',
      groupid: '',
      createuserid: '',
      list: null
    }
  },
  components: {
    GroupTitle,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Badge
  },
  computed: {
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    this.gName = sessionStorage.getItem('GROUPName')
    if (this.$route.query.id) {
      this.groupid = this.$route.query.id
      this.createuserid = this.$route.query.cid
      this.getMembers()
    }
  },
  methods: {
    getMembers() {
      groupApi.findAllUserById(this.groupid).then(res => {
        if (res.flag && res.data) {
          this.list = res.data;
        }
      })
    },
    outById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定移除?',
        onConfirm : () => {
          groupApi.outGroup(id, this.groupid).then(response => {
            messageFun(response)
          })
        }
      })
    }
  }
}
</script>