<template>
  <div class="main-con">
    <box gap="15px 0">
      <div class="person-info">
        <div class="person-head">
          <svg-icon icon-class="user" />
        </div>
        <div class="person-desc">
          用户邢敏</div>
      </div>
    </box>
    <group>
      <cell is-link title="修改资料" :link="{name: 'update'}"></cell>
      <cell is-link title="修改密码" :link="{name: 'changePwd'}"></cell>
    </group>

    <box gap="60px 0">
      <x-button plain style="color: #E64340;" @click.native="logout">退出登录</x-button>
    </box>
  </div>
</template>

<script>
import { Cell } from 'vux'

export default {
  components: {
    Cell
  },
  computed: {
    UName() {
      return this.$store.getters.name
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>
<style lang="scss">
  .person-info{
    background: #ffffff;
    text-align: center;
    padding: 1.5em;
    .person-head{
      margin: auto;
      width: 8em;
      height: 8em;
      border-radius: 50%;
      background:#ccc;
      padding: 1em;
      box-sizing: border-box;
      .svg-icon{
        font-size: 5em;
        color: #ffffff;
      }
    }
    .person-desc{
      margin: .5em 0 .3em;
      font-size: 1.4em; 
    }
  }
</style>
