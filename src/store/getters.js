const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles
}
export default getters
