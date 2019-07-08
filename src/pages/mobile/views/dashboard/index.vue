<template>
  <div class="dashboard-container">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.indexOf('1') > -1) {
      this.$router.push({ name: 'user' })
    } else {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
