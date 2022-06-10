import Cookies from 'js-cookie'
const TokenKey = 'saber-access-token'
const RefreshTokenKey = 'saber-refresh-token'
export default {
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  getRefreshToken() {
    return Cookies.get(RefreshTokenKey)
  },
  setRefreshToken(token) {
    return Cookies.set(RefreshTokenKey, token)
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },
  removeRefreshToken() {
    return Cookies.remove(RefreshTokenKey)
  },
  /**
   * 获取单个cookie
   * @param {*} key 属性
   * @returns cookie属性对应的值
   */
  getTheKeyCookie(key) {
    return Cookies.get(key)
  },
  /**
   * 设置单个cookie
   * @param {*} key 属性
   * @param {*} value 值
   */
  setCookie(key, value) {
    Cookies.set(key, value)
  },
  /**
   * 删除cookie下某个属性
   * @param {*} key 属性
   */
  deleteCookie(key) {
    Cookies.remove(key)
  }
}
