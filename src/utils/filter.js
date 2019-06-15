import Vue from 'vue'
import store from '@/store'

Vue.filter('uInfo', function(val) {
    if (val) {
      const w = store.getters.uListArrs.find(item => {
        return item.id === val
      })
      return w.username
    } else {
      return '无'
    }
})