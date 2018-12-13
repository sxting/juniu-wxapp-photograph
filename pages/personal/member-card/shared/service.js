import { constant } from '../../../../utils/constant';
import { http } from '../../../../utils/http';
let memberCardService = {};

// 用户手机号解密  /app/decodeUserPhone
memberCardService.decodeUserPhone = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/order/app/decodeUserPhone.json';
  return http.get(apiUrl, data);
}

// 会员卡绑定
memberCardService.bindCard = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/member/card/bind.json';
  return http.get(apiUrl, data);
}

memberCardService.cardInfo = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/member/card/cardInfo.json'
  return http.get(apiUrl, data);
}
// GET /sp/member/card/consumeRecord.json
// 消费记录
memberCardService.consumeRecord = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/member/card/consumeRecord.json';
  return http.get(apiUrl, data);
}
// /sp/member/card/list.json
// 会员卡列表
memberCardService.cardList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/member/card/list.json';
  return http.get(apiUrl, data);
}
//适用于某商品的会员卡列表 /card/productCard.json
memberCardService.productCard = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/card/productCard.json';
  return http.get(apiUrl, data);
}

memberCardService.getStoreInfo = (data) => {
  let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeInfo.json' : constant.apiUrl + '/account/appstore/app/storeInfo.json';
  return http.get(apiUrl, data);
}
// 获取绑定会员卡的验证码
memberCardService.getVaildCode = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl3 : constant.apiUrlTwo  
  let apiUrl = api + '/common/validCode/getValidCode.json';
  return http.get(apiUrl, data);
}
module.exports = {
  memberCardService: memberCardService
}