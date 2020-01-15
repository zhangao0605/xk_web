import request from "../utils/request";

export default {

  get_user_management_list (UserName, UserPhone, IsXinVip, UserState, currentIndex, pageSize) {
    return request({
      url: '',
      methods: 'post',
      data: { UserName, UserPhone, IsXinVip, UserState, currentIndex, pageSize }
    })
  }
}
