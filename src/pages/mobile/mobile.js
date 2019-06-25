import Vue from 'vue'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
// import store from './store'
import '@/utils/filter'

import '@/icons' // icon
// import '@/permission' // permission control

// Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
})
