import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let homeService = {};
/**GET /appstore/app/storeIndex.json 门店首页信息 */
homeService.storeIndex = (data) => {
  let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeIndex.json' : constant.apiUrl + '/account/appstore/app/storeIndex.json';
  return http.get(apiUrl, data);
}

homeService.ticketList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/coupon/couponlist.json';
  return http.get(apiUrl, data);
}

//拼团列表
homeService.getProductList = (data) => {
  let apiUrl = constant.apiUrlTwo + '/pintuan' + '/consumer/activity/batchQuery.json';
  // let apiUrl = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/consumer/activity/batchQuery.json' : constant.apiUrl + '/consumer/activity/batchQuery.json';
  return http.get(apiUrl, data);
}

homeService.storeInfoDetail = (data) => {
  let url = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 + '/member/appstore/storeInfo.json' : constant.apiUrl + '/account/appstore/app/storeInfo.json';
  return http.get(url, data)
}

// 获取最近门店   /appstore/closestStore.json
homeService.closestStore = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/appstore/closestStore.json';
  return http.get(apiUrl, data);
}

// 获取名称管理  
homeService.getSysConfig = (data) => {
  let apiUrl = constant.apiUrlTwo + '/account/config/getSysConfig.json';
  return http.get(apiUrl, data);
}

module.exports = {
  homeService: homeService
}