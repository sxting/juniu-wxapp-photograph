import { constant } from '../../../utils/constant';
import { http } from '../../../utils/http';
let collageService = {};

let API = constant.apiUrlTwo + 'pintuan';
// API = 'http://192.168.199.26:8080';
// API = 'http://123.56.1.184:2000'; 
// API = 'http://192.168.199.23:2000'; 



// 下单  /consumer/activity/order/payment.json
collageService.payment = (data) => {
  let apiUrl = API + '/consumer/activity/order/payment.json';
  return http.get(apiUrl, data);
}

//拼团活动详情
collageService.getProductDetail = (data) => {
  let apiUrl = API + '/consumer/activity/detail.json';
  return http.get(apiUrl, data);
}

//商品列表
collageService.getProductList = (data) => {
  let apiUrl = API + '/consumer/activity/batchQuery.json';
  return http.get(apiUrl, data);
}


module.exports = {
  collageService: collageService
}