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

service.logInFun = (code, rawData, fun) => {
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  let appId = 'wx0c66057a9b376be1';
  let reqData = {
    code: code,
    appid: extConfig.theAppid ? extConfig.theAppid : appId,
    rawData: rawData,
    tplid: constant.TPLID
  }
  service.logIn(reqData).subscribe({
    next: res => {
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId);
      wx.setStorageSync(constant.OPEN_ID, res.openid);
      wx.setStorageSync(constant.CUSTOMER_ID, res.customerId);

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          fun();
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

module.exports = {
  service: service
}