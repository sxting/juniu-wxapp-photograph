import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let orderService = {};

// 查询门店预约配置
orderService.reserveConfig = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/reserveConfig.json';
  return http.get(url, data)
}

// 单个手艺人预约信息
orderService.reserveStaff = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/reserveStaff.json';
  return http.get(url, data)
}

// 保存预约信息
orderService.saveReserve = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/reserve.json';
  return http.post(url, data)
}

module.exports = {
  orderService: orderService
}