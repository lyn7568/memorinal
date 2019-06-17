import Vue from 'vue'
import store from '@/store'
import { strToArr, arrToStr } from '@/utils'

function userLoop(mList, b) {
  const w = mList.find(item => {
    return item.id === b
  })
  return w.username
}
Vue.filter('uInfo', function(val) {
  var labV = []
  if (val) {
    const arr = strToArr(val)
    const uList = store.getters.uListArrs
    for (let i = 0; i < arr.length; i++) {
      labV.push(userLoop(uList, arr[i]))
    }
  } else {
    labV.push('无')
  }
  return arrToStr(labV)
})
Vue.filter('typeInfo', function(val) {
  if (val) {
    const w = store.getters.typeArrs.find(item => {
      return item.id === val
    })
    return w.typename
  } else {
    return '无'
  }
})