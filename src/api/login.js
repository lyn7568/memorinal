import request from '@/utils/request'
const url = 'https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin'
export function login(username, password) {
  return request({
    url: url + '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: url + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: url + '/user/logout',
    method: 'post'
  })
}
