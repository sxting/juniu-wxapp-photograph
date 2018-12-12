import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let sampleService = {};

// 店铺作品
sampleService.getStoreWorkList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl : constant.apiUrl
  let url = api + '/account/production/list.json';
  return http.get(url, data)
}

// 视频地址接口  getVideoUrlById.json
sampleService.getVideoUrlById = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrlTwo : constant.apiUrlTwo
  let url = api + '/getVideoUrlById.json';
  return http.get(url, data)
}
// 手艺人作品详情
sampleService.getStaffProductionDetail = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/account/production/detail.json';
  return http.get(url, data)
}
module.exports = {
  sampleService: sampleService
}