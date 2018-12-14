import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let productService = {};

let apiUrl = constant.apiUrl + '/product';
let apiUrl2 = constant.apiUrl + '/member';

// 获取预约手艺人商品
productService.getStaffProduct = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product/product/staff.json';
  return http.get(url, data)
}

// 获取预约商品列表
productService.getReserveProduct = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product/app/findProductByIds.json';
  return http.get(url, data)
}

// 获取商品列表
productService.getProductList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product/list.json';
  return http.get(url, data)
}

// 获取商品详情
productService.getProductDetail = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product/app/productinfo.json';
  return http.get(url, data)
}

// 获取商品评价列表
productService.getProductCommentList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/member/comment/app/queryAppCommenProductnList.json';
  return http.get(url, data)
} 

// GET /app/categoryList.json 获取商品分类列表
productService.getProdTypeList = (data) => {
  let api = wx.getStorageSync(constant.VER) == constant.version2 ? constant.apiUrl2 : constant.apiUrl
  let url = api + '/product/app/categoryList.json';
  return http.get(url, data)
}
module.exports = {
  productService: productService
}