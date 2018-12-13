import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let personalService = {};
let API = constant.apiUrlTwo + 'pintuan';

// 查询我的订单详情  /app/order/detail.json
personalService.getOrderDetail = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/order/app/order/detail.json';
  data.timestamp = new Date().getTime();
  return http.get(url, data)
}

// 查询我的订单列表
personalService.getOrderList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/order/app/order/list.json';
  return http.get(url, data)
}

// 申请退款  /app/refund.json
personalService.refund = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/order/app/refund.json?orderId=' + data.orderId;
  return http.post2(url)
}

// 查询我的预约列表
personalService.reserveConfig = () => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/reserve/app/myReservations.json';
  return http.get(url)
}

personalService.myComment = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/comment/app/userComment.json';
  return http.get(url, data);
}

personalService.myTicket = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/sp/coupon/userCouponList.json';
  return http.get(url, data);
}

// 我的拼团订单详情页面
personalService.getCollageOrderDetail = (data) => {
  let url = API + '/consumer/activity/order/detail.json';
  return http.get(url, data)
}

// 我的拼团订单列表页面
personalService.getCollageListInfor = (data) => {
  let url = API + '/consumer/activity/order/batchQuery.json';
  return http.get(url, data)
}

// 拼团订单取消
personalService.cancelFunction = (data) => {
  let url = API + '/consumer/activity/order/cancel.json';
  return http.get(url, data)
}

// 订单支付
personalService.paymentSubmit = (data) => {
  let url = API + '/consumer/activity/order/payment.json';
  return http.get(url, data)
}

module.exports = {
  personalService: personalService
}