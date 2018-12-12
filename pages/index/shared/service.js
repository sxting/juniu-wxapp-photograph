import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let indexService = {};

/**行政区查询 */
indexService.getDistrict = (key, loc) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/pay/collectMoney.json';
  return http.post(apiUrl, data);
}
/**
 * 获取门店列表
 */
indexService.getStoreList = (data) => {
  // GET /appstore/list
  let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/list.json' : constant.apiUrl + '/account/appstore/list.json';
  return http.get(apiUrl, data);
}
/**地址转id */
// GET GET /TencentNameToId.json

indexService.nameToId = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/TencentNameToId.json';
  return http.get(apiUrl, data);
}
//经纬度转地址 GET /TencentLongAndLatiToAddress.json
indexService.TencentLongAndLatiToAddress = (data) => {
  let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/TencentLongAndLatiToAddress.json' : constant.apiUrl + '/account/TencentLongAndLatiToAddress.json';
  return http.get(apiUrl, data);
}
/**登录 */
indexService.logIn = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/platformUsers/wxapp/login.json';
  return http.get(apiUrl, data);
}
module.exports = {
  indexService: indexService
}
