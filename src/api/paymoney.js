// 缴费管理的api接口
import request from '@/utils/request'

export default {
  getList: function() {
    return request({
      url: '/paymoney/payinfo',
      method: 'get',
    })
  },
  save: function(pojo) {
    return request({
      url: '/paymoney',
      method: 'post',
      data: pojo
    })
  },
  findById: function(id) {
    return request({
      url: `/paymoney/${id}`,
      method: 'get'
    })
  },
  update: function(id, pojo) {
    return request({
      url: `/paymoney/${id}`,
      method: 'put',
      data: pojo
    })
  },
  // 新增和修改合并为一个方法
  saveOrUpdate: function(id, pojo) {
    if (id !== undefined && id !== null && id !== '') {
      return this.update(id, pojo) // 有id修改
    } else {
      return this.save(pojo) // 没有id,保存
    }
  },
  deleteById: function(id) {
    return request({
      url: `/paymoney/${id}`,
      method: 'delete'
    })
  },
  search: function(page, size) {
    return request({
      url: `/paymoney/search/${page}/${size}`,
      method: 'post'
    })
  },
  findSumCount: function() {
    return request({
      url: `/paymoney/sum`,
      method: 'get'
    })
  },
  findSumCountByType: function(typeid) {
    return request({
      url: `/paymoney/sum/${typeid}`,
      method: 'get'
    })
  },

  searchOwner: function(userid, page, size) {
    return request({
      url: `/indivpaymoney/search/${userid}/${page}/${size}`,
      method: 'post'
    })
  },
  saveOwner: function(pojo) {
    return request({
      url: '/indivpaymoney',
      method: 'post',
      data: pojo
    })
  },
  findByIdOwner: function(id) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'get'
    })
  },
  updateOwner: function(id, pojo) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'put',
      data: pojo
    })
  },
  // 新增和修改合并为一个方法
  saveOrUpdateOwner: function(id, pojo) {
    if (id !== undefined && id !== null && id !== '') {
      return this.updateOwner(id, pojo) // 有id修改
    } else {
      return this.saveOwner(pojo) // 没有id,保存
    }
  },
  deleteByIdOwner: function(id) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'delete'
    })
  },
  findSumCountOwner: function(userid) {
    return request({
      url: `/indivpaymoney/sum/${userid}`,
      method: 'get'
    })
  },
  findSumCountByTypeOwner: function(typeid) {
    return request({
      url: `/indivpaymoney/sum/${userid}/${typeid}`,
      method: 'get'
    })
  }
}