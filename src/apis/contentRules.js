import request from "../utils/request";
// 广告图-广告图-筛选
export function appimage(data) {
  return request({
    url: "/appimage/list",
    method: "post",
    data: data
  });
}
// 广告图-状态开启关闭
export function statusUpdate(data) {
  return request({
    url: "/appimage/status_update",
    method: "post",
    data: data
  });
}
// 广告图-上传图片
export function projectUpload(data) {
  return request({
    url: "/project/upload",
    method: "post",
    data: data
  });
}
// 广告图-添加广告
export function appimageAdd(data) {
  return request({
    url: "/appimage/add",
    method: "post",
    data: data
  });
}
// 广告图-更新广告
export function appimageUpdate(data) {
  return request({
    url: "/appimage/update",
    method: "post",
    data: data
  });
}
// 广告图-删除广告
// export function AdMangementDelete(data) {
//   return request({
//     url: "/AdMangementDelete.do",
//     method: "post",
//     data: data
//   });
// }
// ---------------------------------------------
// 转转图片-初始化
export function projectitemList(data) {
  return request({
    url: "/projectitem/list",
    method: "post",
    data: data
  });
}
// 转转图片-状态打开关闭
export function projectitemStatuupdate(data) {
  return request({
    url: "/projectitem/status_update",
    method: "post",
    data: data
  });
}

// 转转图片-添加广告
export function zhuanzhuanInsert(data) {
  return request({
    url: "/zhuanzhuanInsert.do",
    method: "post",
    data: data
  });
}
// 转转图片-删除
export function zhuanzhuanDelete(data) {
  return request({
    url: "/zhuanzhuanDelete.do",
    method: "post",
    data: data
  });
}
// 转转图片-编辑
export function projectitemUpdate(data) {
  return request({
    url: "/projectitem/update",
    method: "post",
    data: data
  });
}
// ---------------------------------------
// 海报管理-数据初始化
export function PosterMangementQry(data) {
  return request({
    url: "/PosterMangementQry.do",
    method: "post",
    data: data
  });
}
// 海报管理-链接初始化
export function PosterQRMangementQry(data) {
  return request({
    url: "/PosterQRMangementQry.do",
    method: "post",
    data: data
  });
}
// 海报管理-添加海报
export function PosterMangementInsert(data) {
  return request({
    url: "/PosterMangementInsert.do",
    method: "post",
    data: data
  });
}
// 海报管理-编辑海报
export function PosterMangementUpdate(data) {
  return request({
    url: "/PosterMangementUpdate.do",
    method: "post",
    data: data
  });
}
// 海报管理-删除海报
export function PosterMangementDelete(data) {
  return request({
    url: "/PosterMangementDelete.do",
    method: "post",
    data: data
  });
}
// 海报管理-海报宣传链接
export function PosterQRMangementUpdate(data) {
  return request({
    url: "/PosterQRMangementUpdate.do",
    method: "post",
    data: data
  });
}
// ----------------------------------------------
// 消息管理-初始化数据
export function messageappList(data) {
  return request({
    url: "/messageapp/list",
    method: "post",
    data: data
  });
}
// 消息管理-添加消息
export function MessageInsert(data) {
  return request({
    url: "/MessageInsert.do",
    method: "post",
    data: data
  });
}
// 消息管理-删除消息
export function messageappStatusupdate(data) {
  return request({
    url: "/messageapp/status_update",
    method: "post",
    data: data
  });
}
// 消息管理-编辑消息
export function messageappUpdate(data) {
  return request({
    url: "/messageapp/update",
    method: "post",
    data: data
  });
}
// ----------------------------------------
// 爆币规则管理-初始数据
export function coinBallRuleList(data) {
  return request({
    url: "/coinBallRule/list",
    method: "post",
    data: data
  });
}
// 爆币规则管理-添加
export function coinBallRuleAdd(data) {
  return request({
    url: "coinBallRule/add",
    method: "post",
    data: data
  });
}
// 爆币规则管理-币种是否存在
export function CoinBurstRuleQueryCointype(data) {
  return request({
    url: "/CoinBurstRuleQueryCointype.do",
    method: "post",
    data: data
  });
}
// 爆币规则管理-编辑
export function coinBallRuleUpdate(data) {
  return request({
    url: "/coinBallRule/update",
    method: "put",
    data: data
  });
}
// -----------------------------------------------
// 爆币记录-初始化
export function coinBallList(data) {
  return request({
    url: "/coinBall/list",
    method: "post",
    data: data
  });
}
// 
export function usercard(data) {
  return request({
    url: "/usercard/list",
    method: "post",
    data: data
  });
}
