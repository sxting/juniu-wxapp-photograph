import { constant } from 'utils/constant';
import { http } from 'utils/http';
let service = {};

/**登录 */
service.logIn = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl;
  let apiUrl = api + '/member/platformUsers/wxapp/login.json';
  return http.get(apiUrl, data);
}

/*判断是否绑定手机号 */
service.userIsBind = () => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl;
  let apiUrl = api + '/member/sp/coupon/isBind.json';
  return http.get(apiUrl);
}

// 用户手机号解密  /app/decodeUserPhone
service.decodeUserPhone = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/order/app/decodeUserPhone.json';
  return http.get(apiUrl, data);
}

module.exports = {
  service: service
}