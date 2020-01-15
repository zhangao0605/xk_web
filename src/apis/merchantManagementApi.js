import request from '../utils/request'

export default {

  /**
   * 获得商户列表
   * @param page
   * @param rows
   */
  get_merchant_list(page = 1, rows = 1000) {
    return request({
      url: '/merchant/list',
      method: 'post',
      data: { page, rows }
    })
  },

  /**
   * 添加商户
   * @param name
   * @param province 省
   * @param city 市
   * @param district 区
   * @param bankReceiverName 收款人姓名
   * @param bankIdCard  身份证
   * @param bankAccount 银行卡号
   * @param bankName 银行名称
   * @param contactName 联系人姓名
   * @param contactPhone 联系人电话
   * @param contactWechat 联系人微信
   */
  add_merchant ({ name, province, city, district, bankReceiverName, bankIdCard, bankAccount, bankName, contactName, contactPhone, contactWechat }) {
    return request({
      url: '/merchant/add',
      method: 'post',
      data: { name, province, city, district, bankReceiverName, bankIdCard, bankAccount, bankName, contactName, contactPhone, contactWechat }
    })
  },

  /**
   * 修改商户信息
   * @param id
   * @param merchantNo
   * @param name
   * @param province
   * @param city
   * @param district
   * @param bankReceiverName
   * @param bankIdCard
   * @param bankAccount
   * @param bankName
   * @param contactName
   * @param contactPhone
   * @param contactWechat
   * @param status
   */
  update_merchant ({id, merchantNo, name, province, city, district, bankReceiverName, bankIdCard, bankAccount, bankName, contactName, contactPhone, contactWechat, status}) {
    return request({
      url: '/merchant/update',
      method: 'post',
      data: { id, merchantNo, name, province, city, district, bankReceiverName, bankIdCard, bankAccount, bankName, contactName, contactPhone, contactWechat, status }
    })
  },
}
