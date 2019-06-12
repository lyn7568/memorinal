import { login, logout, getInfo } from '@/api/login'

const user = {
  state: {
    userid: sessionStorage.getItem('USERID') || '',
    name: '',
    roles: ''
  },

  mutations: {
    SET_USERID: (state, id) => {
      state.userid = id
      sessionStorage.setItem('USERID', id)
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(response => {
          const dataS = response.data
          if (dataS.id === '2319F311BE294CB9A8FBF05F267ED77A') {
            commit('SET_ROLES', ['1'])
          } else {
            commit('SET_ROLES', ['2'])
          }
          commit('SET_USERID', dataS.id)
          commit('SET_NAME', dataS.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userid).then(response => {
          const dataS = response.data
          if (dataS.id === '2319F311BE294CB9A8FBF05F267ED77A') {
            commit('SET_ROLES', ['1'])
          } else {
            commit('SET_ROLES', ['2'])
          }
          commit('SET_USERID', dataS.id)
          commit('SET_NAME', dataS.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_USERID', '')
          commit('SET_ROLES', '')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USERID', '')
        commit('SET_ROLES', '')
        resolve()
      })
    }
  }
}

export default user
