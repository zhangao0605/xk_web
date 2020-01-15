import request from "../utils/request";

// 用户拥有的权限
export function byUser(data) {
  return request({
    url: "/v1/auth/permission/list/byUser",
    method: "post",
    data: data
  });
}
