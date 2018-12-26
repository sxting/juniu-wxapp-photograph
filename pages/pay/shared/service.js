import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let payService = {};

// 判断卡余额是否充足   /app/online/verifyBalance.json
payService.verifyBalance = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/order/app/online/verifyBalance.json';
  return http.post(apiUrl, data);
}

//持有的适用于某商品的会员卡列表 /card/productCard.json
payService.productCard = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/card/productCard.json';
  return http.get(apiUrl, data);
}

//查找用户适用于某商品的优惠券 
payService.productCoupon = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let apiUrl = api + '/member/sp/coupon/productCoupon.json';
  return http.get(apiUrl, data);
}

// 适用于某商品的卡规则  /productCardConfig.json
payService.productCardConfig = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/productCardConfig.json';
  return http.get(url, data)
}

// 在线购买 /app/online/order.json
payService.onlineBuy = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/order/app/online/order.json';
  return http.post(url, data)
}

// 接口金额为0，返回状态 为PAID，不需要调用微信支付相关接口拉起支付
// https://biz.juniuo.com/wxapp/order/app/online/order.json



module.exports = {
  payService: payService
}