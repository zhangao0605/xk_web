const getters = {
  token: state => state.user.token,
  isLogin: state => !!state.user.token,
  userInfo: state => state.user.userInfo,
  quotaData: state => state.quota.quotaDetailData,
}
export default getters
