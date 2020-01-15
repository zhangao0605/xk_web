import request from "../utils/request";

export default {

  get_commission_setting () {
    return request({
      url: '/QryXkCommissionSetting.do',
      method: 'post',
      data: {}
    })
  },
  /**
   * 芯客反佣设置
   * @param isStart
   * @param firstPercent
   * @param secPercent
   */
  set_commission (isStart, firstPercent, secPercent) {
     return request({
       url: '/XkCommissionSetting.do',
       method: 'post',
       data: { isStart, firstPercent, secPercent }
     })
  },

  /**
   * 获得常见问题列表
   * @param parentId 问题类别
   * @param page
   * @param rows
   */
  get_common_problem_list ( parentId, page, rows ) {
    return request({
      url: '/AppQuestion/list',
      method: 'post',
      data: { parentId, page, rows }
    })
  },

  /**
   * 修改问题状态
   * @param status
   * @param ids
   */
  change_common_problem_status (status, ids) {
    return request({
      url: '/UpdateCommonProblemStateOpen.do',
      method: 'post',
      data: { questionSeq }
    })
  },

  /**
   * 开启问题
   * @param questionSeq
   */
  open_common_problem (questionSeq = '') {
    return request({
      url: '/UpdateCommonProblemStateOpen.do',
      method: 'post',
      data: { questionSeq }
    })
  },

  /**
   * 关闭问题
   * @param questionSeq
   */
  close_common_problem (questionSeq = '') {
    return request({
      url: '/UpdateCommonProblemStateClose.do',
      method: 'post',
      data: { questionSeq }
    })
  },

  /**
   * 编辑问题
   * @param questionType
   * @param questionName
   * @param questionContent
   * @param questionSeq
   */
  edit_problem (questionType, questionName, questionContent, questionSeq) {
    return request({
      url: '/CommonProblemUpdate.do',
      method: 'post',
      data: { questionType, questionName, questionContent, questionSeq }
    })
  },

  /**
   * 创建问题
   * @param questionType
   * @param questionName
   * @param questionContent
   */
  add_problem (questionType, questionName, questionContent) {
    return request({
      url: '/CommonProblemInsert.do',
      method: 'post',
      data: { questionType, questionName, questionContent}
    })
  },

  /**
   * 删除问题
   * @param questionSeq
   */
  delete_problem (questionSeq) {
    return request({
      url: '/CommonProblemDelete.do',
      method: 'post',
      data: { questionSeq }
    })
  },

  /**
   * 获得版本列表
   * @param versionNo
   * @param page
   * @param rows
   */
  get_version_list ( versionNo, page, rows) {
    return request({
      url: '/appVersion/list',
      method: 'post',
      data: {  versionNo, page, rows }
    })
  },

  /**
   * 创建版本
   * @param VersionId
   * @param versionNo
   * @param os
   * @param url
   * @param description
   * @param forceUpdate
   */
  create_version ({versionNo, os, url, description, forceUpdate}) {
    return request({
      url: '/appVersion/add',
      method: 'post',
      data: { versionNo, os, url, description, forceUpdate }
    })
  },

  /**
   * 删除版本
   * @param id
   */
  delete_version (id) {
    return request({
      url: '/appVersion/delete',
      method: 'delete',
      data: { id }
    })
  },

  /**
   * 获得白名单列表
   * @param Phone
   * @param currentIndex
   * @param pageSize
   */
  get_white_list (Phone, currentIndex, pageSize) {
    return request({
      url: '/QryXkWhiteList.do',
      method: 'post',
      data: { Phone, currentIndex, pageSize }
    })
  },


  /**
   * 删除白名单
   * @param Ids 白名单id
   */
  delete_white_list (Ids) {
    return request({
      url: '/DeleteXkWhite.do',
      method: 'post',
      data: { Ids }
    })
  },

  create_white_list (Phone) {
    return request({
      url: '/InsertXkWhite.do',
      method: 'post',
      data: { Phone }
    })
  }

}
