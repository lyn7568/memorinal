import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '../theme/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from '@/router'
import store from '@/store'
import '@/utils/filter'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    this.$store.dispatch('getDictuList')
    this.$store.dispatch('getDictType')
  }
})
