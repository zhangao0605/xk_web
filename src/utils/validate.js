import { ruleOfLowerCase, ruleOfUpperCase, ruleOfInt, ruleOfAlphabets, ruleOfURL, ruleOfPhoneNumber, ruleOfEmail, regOfSpecial, ruleOfHost, ruleOfSocialCreditCode } from './rules'
import variables from './data/variables'
const { MAX_LENGTH_OF_PASSWORD, MIN_LENGTH_OF_PASSWORD } = variables

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  return ruleOfLowerCase.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  return ruleOfUpperCase.test(str)
}

/**
 * 验证正整数
 * @param str
 * @returns {boolean}
 */
export function validInt(str) {
  return ruleOfInt.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  return ruleOfAlphabets.test(str)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  return ruleOfURL.test(url)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  return ruleOfEmail.test(email)
}

/**
 * 验证手机号
 * @param phone
 * @returns {boolean}
 */
export function validPhoneNumber(phone) {
  return ruleOfPhoneNumber.test(phone)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 校验用户设置密码
 * 密码长度为MIN_LENGTH_OF_PASSWORD-MAX_LENGTH_OF_PASSWORD，必须包含数字、字母、特殊符号其中的两种
 * @param password
 * @returns {boolean}
 */
export function validPassword(password) {
  if (!password || !isString(password) || password.length < MIN_LENGTH_OF_PASSWORD || password.length > MAX_LENGTH_OF_PASSWORD) {
    return false
  }
  let typeNumber = 0
  if (/\d+/.test(password)) {
    typeNumber++
  }
  if (/[A-Za-z]+/.test(password)) {
    typeNumber++
  }
  if (regOfSpecial.test(password)) {
    typeNumber++
  }
  return typeNumber >= 2
}

/**
 * 校验挂载主机
 * @param {string} str
 * @returns {Boolean}
 */
export function validHost(str) {
  return ruleOfHost.test(str)
}

/**
 * 校验社会信用代码
 * @param {string} str
 * @returns {Boolean}
 */
export function validSocialCreditCode(str) {
  return ruleOfSocialCreditCode.test(str)
}

/**
 * 身份证
 * @param id
 * @returns {boolean}
 */
export function validID (id) {
  let regID18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0-2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
  let regID16 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0-2]\d)|3[0-1])\d{3}$/;
  return regID18.test(id) || regID16.test(id);
}
