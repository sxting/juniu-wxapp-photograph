import { productService } from '../product/shared/service.js';
import { constant } from '../../utils/constant';
import { errDialog } from '../../utils/util';
import { payService } from 'shared/service.js'
import { service } from '../../service';
import { formidService } from '../../shared/service/formid.service.js';
// import { strip } from '../../utils/number-precision.js';
var NP = require('../../utils/number-precision.js');

Page({
  data: {
    count: 1,
    juniuImg: '/asset/images/product.png',
    showPaySuccess: false,
    productId: '',
    productInfo: {},
    storeId: '',
    productCouponLength: 0,
    ruleId: '',
    couponId: '',
    showUserBind: false,
    phone: '',
    type: 'PAY',
    memo: '',
    selectedTicketId: '',
    payPrice: 0,
    couponPrice: 0,
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提交订单',
    })
    this.setData({
      productId: options.productId,
      storeId: wx.getStorageSync(constant.STORE_INFO),
    })
    
    service.userIsBind().subscribe({
      next: res => {
        if (res.isBind) {
          this.setData({
            phone: res.phone
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
    getProductDetail.call(this);
    productCoupon.call(this);
  },

  onShow() {
    let self = this;
    if (wx.getStorageSync(constant.couponId)) {
      if (wx.getStorageSync(constant.couponId) === 'no') {
        this.setData({
          couponId: '',
          couponPrice: 0
        })
      } else {
        this.setData({
          couponId: wx.getStorageSync(constant.couponId),
          couponPrice: wx.getStorageSync(constant.couponPrice),
        })
      }
      this.setData({
        selectedTicketId: wx.getStorageSync(constant.couponId),
        payPrice: NP.minus(this.data.productInfo.currentPrice * this.data.count / 100, this.data.couponPrice)
      })    
      
      wx.removeStorageSync(constant.couponId)      
      wx.removeStorageSync(constant.couponPrice)      
    }
  },

  getMemo(e) {
    this.setData({
      memo: e.detail.value
    })
  },

  formSubmit: function (e) {
    let formId = e.detail.formId; //获取formId
    formidService.collectFormIds(formId).subscribe({
      next: res => { }
    })
  },

  // 跳转到我的优惠券
  goMyCoupon() {
    if (this.data.productCouponLength == 0 ) {
      return;
    }
    wx.navigateTo({
      url: '/pages/personal/ticket/ticket?productId=' + this.data.productId + '&ticketId=' + this.data.selectedTicketId + '&price=' + this.data.productInfo.currentPrice * this.data.count,
    })
  },


  // 立即支付
  onOrderPayClick() {
    let self = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let appId = extConfig.theAppid ? extConfig.theAppid : 'wx0c66057a9b376be1';
    // type不能为空 在线购卡付款:OPENCARD, 在线付款:PAY, 扣减会员卡:DEDUCTION
    let data = {
      appid: appId,
      buyProductRequest: {
        couponId: this.data.couponId,
        money: this.data.productInfo.currentPrice * this.data.count, //总价
        num: this.data.count,
        phone: this.data.phone,
        price: this.data.productInfo.currentPrice,
        productId: this.data.productInfo.productId,
        productName: this.data.productInfo.productName,
        storeId: this.data.storeId
      },
      memo: this.data.memo, //备注
      phone: this.data.phone,
      storeId: this.data.storeId,
      type: this.data.type
    }
    let verifyBalance;
    onlineBuyFun.call(self, data) 
  },
})

// 商品详情
function getProductDetail() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  productService.getProductDetail(data).subscribe({
    next: res => {
      if (res.url) {
        res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_140_100/mode_fill`;
      }
      this.setData({
        productInfo: res,
        payPrice: (res.currentPrice / 100) * this.data.count
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 查询优惠券列表
function productCoupon() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCoupon(data).subscribe({
    next: res => {
      this.setData({
        productCouponLength: res.length
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 在线购买
function onlineBuyFun(data) {
  let self = this;
  payService.onlineBuy(data).subscribe({
    next: res => {
      console.log(res);
      this.setData({
        orderId: res.orderId
      })
      if (res.status === 'PAID') {
        wx.navigateTo({
          url: '/pages/personal/product-order/order-form-detail/order-form-detail?orderId=' + self.data.orderId,
        })
      };
      wx.requestPayment({
        timeStamp: res.payInfo.timeStamp,
        nonceStr: res.payInfo.nonceStr,
        package: res.payInfo.package,
        signType: res.payInfo.signType,
        paySign: res.payInfo.paySign,
        success: function (res) {
          wx.navigateTo({
            url: '/pages/personal/product-order/order-form-detail/order-form-detail?orderId=' + self.data.orderId,
          })
        },
        fail: function (result) {
          console.log(result);
        },
        complete: function (result) {
          console.log(result);
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
} 