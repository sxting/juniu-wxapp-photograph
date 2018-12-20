import { http } from '../../utils/http';
import { constant } from '../../utils/constant';
let formidService = {};

// 收集formid
formidService.collectFormIds = (formId) => {
  let data = {
    merchantId: wx.getStorageSync(constant.MERCHANTID),
    userId: wx.getStorageSync(constant.USER_ID),
    openId: wx.getStorageSync(constant.OPEN_ID),
    formId: formId,
    customerId: wx.getStorageSync(constant.CUSTOMER_ID),
  }
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/platformUsers/collectFormIds.json';
  return http.post2(url, data)
}

module.exports = {
  formidService: formidService
}
