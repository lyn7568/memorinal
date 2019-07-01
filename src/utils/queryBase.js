import typeApi from '@/api/type'
import userApi from '@/api/user'
/* eslint-disable one-var */
var objCache = {
  qoType: {},
  qoUser: {}
}
var objHcache = {
  qoType: {},
  qoUser: {}
}
var objCacheHandler = {
  qoType: function(id) {
    var hc = objHcache.qoType[id]
    typeApi.findById(id).then(response => {
      if (response.flag && response.data) {
        objCache.qoType[id] = response.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, response.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    }).catch(() => {
      for (let i = 0; i < hc.length; ++i) {
        hc[i](false)
      }
    })
  },
  qoUser: function(id) {
    var hc = objHcache.qoUser[id]
    userApi.findById(id).then(response => {
      if (response.flag && response.data) {
        objCache.qoUser[id] = response.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, response.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    }).catch(() => {
      for (let i = 0; i < hc.length; ++i) {
        hc[i](false)
      }
    })
  }
}
var cacheModel = {
  getType: function(id, handler) {
    var data = objCache.qoType[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.qoType[id]) {
        objHcache.qoType[id].push(handler)
      } else {
        objHcache.qoType[id] = []
        objHcache.qoType[id].push(handler)
        objCacheHandler.qoType(id)
      }
    }
  },
  getUser: function(id, handler) {
    var data = objCache.qoUser[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.qoUser[id]) {
        objHcache.qoUser[id].push(handler)
      } else {
        objHcache.qoUser[id] = []
        objHcache.qoUser[id].push(handler)
        objCacheHandler.qoUser(id)
      }
    }
  }
}

export default cacheModel
