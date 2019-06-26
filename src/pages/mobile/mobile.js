import Vue from 'vue'

import '@/styles/reset.scss'

import App from './App'
import router from './router'
import store from '@/store'
import '@/utils/filter'
import '@/utils/msg'

import '@/icons'

import { LoadingPlugin, ToastPlugin, ConfirmPlugin, Group, Box, XInput, XButton } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.component('group', Group)
Vue.component('box', Box)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
