import { productService } from '../product/shared/service.js';
import { constant } from '../../utils/constant';
import { errDialog } from '../../utils/util';
import { payService } from 'shared/service.js'
import { service } from '../../service';
// import { strip } from '../../utils/number-precision.js';
var NP = require('../../utils/number-precision.js');

Page({
  data: {
    count: 1,
    juniuImg: '/asset/images/product.png',
    showCardBuy: false,
    showPaySuccess: false,
    productId: '',
    productInfo: {},
    storeId: '',
    productCardLength: 0,
    productCouponLength: 0,
    productCardConfigList: [],
    ruleId: '',
    cardConfigId: '',
    cardId: '',
    cardName: '',
    couponId: '',
    showUserBind: false,
    phone: '',
    type: '',
    memo: '',
    noCardConfig: true,
    selectedCardId: '',
    selectedTicketId: '',
    payPrice: 0,
    cardPrice: 0,
    couponPrice: 0,
    cardType: '',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提交订单',
    })
    this.setData({
      productId: options.productId,
      storeId: wx.getStorageSync(constant.STORE_INFO),
      count: options.count,
    })
    getProductDetail.call(this);
    productCoupon.call(this);
    productCardConfig.call(this);
  },

  onShow() {
    let self = this;
    productCard.call(this);
    if (wx.getStorageSync(constant.couponId)) {
      if (wx.getStorageSync(constant.couponId) === 'no') {
        this.setData({
          couponId: '',
          selectedTicketId: wx.getStorageSync(constant.couponId),
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
        payPrice: this.data.cardId ? 0 : NP.minus(this.data.productInfo.currentPrice * this.data.count / 100, this.data.couponPrice)
      })
       //如果选择了会员卡，改变优惠券的时候 需要重新计算会员卡的扣卡金额
      if (this.data.cardId && (wx.getStorageSync(constant.cardType) === 'STORED' || wx.getStorageSync(constant.cardType) === 'REBATE' || this.data.cardType === 'STORED' || this.data.cardType === 'REBATE')) {
        this.setData({
          cardPrice: NP.minus(this.data.productInfo.currentPrice * this.data.count / 100, this.data.couponPrice)
        })
      }
      
      wx.removeStorageSync(constant.couponId)      
      wx.removeStorageSync(constant.couponPrice)      
    }
    if (wx.getStorageSync(constant.cardId)) {
      if (wx.getStorageSync(constant.cardId) === 'no') {
        this.setData({
          cardId: '',
          cardName: '',
          selectedCardId: wx.getStorageSync(constant.cardId),
          payPrice: NP.minus(this.data.productInfo.currentPrice * this.data.count / 100, this.data.couponPrice)
        })
      } else {
        this.setData({
          cardType: wx.getStorageSync(constant.cardType) ? wx.getStorageSync(constant.cardType) : '',
          cardId: wx.getStorageSync(constant.cardId),
          cardName: wx.getStorageSync(constant.cardName),
          selectedCardId: wx.getStorageSync(constant.cardId),
          payPrice: 0,
        })
        if (wx.getStorageSync(constant.cardType) === 'STORED' || wx.getStorageSync(constant.cardType) === 'REBATE') {
          this.setData({
            cardPrice: NP.minus(this.data.productInfo.currentPrice * this.data.count / 100, this.data.couponPrice)
          })
        }
      }
      wx.removeStorageSync(constant.cardId);
      wx.removeStorageSync(constant.cardName);          
      wx.removeStorageSync(constant.cardType);          
    }
    service.userIsBind().subscribe({
      next: res => {
        if (res.isBind) {
          self.setData({
            phone: res.phone
          })
        }
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  onCountLeftClick() {
    if(this.data.count == 1) {
      return
    };
    --this.data.count;
    this.setData({
      count: this.data.count,
      payPrice: this.data.productInfo.currentPrice * this.data.count / 100
    })
  },

  onCountRightClick() {
    ++this.data.count;
    this.setData({
      count: this.data.count,
      payPrice: this.data.productInfo.currentPrice * this.data.count / 100
    })
  },

  getMemo(e) {
    this.setData({
      memo: e.detail.value
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

  // 跳转到我的会员卡列表
  goMyCard() {
    wx.navigateTo({
      url: '/pages/personal/member-card/list/list?productId=' + this.data.productId + '&price=' + this.data.payPrice + '&cardId=' + this.data.selectedCardId,
    })
  },

  // 点击更多优惠
  onMoreRightsClick() {
    if (this.data.noCardConfig) {
      return;
    }
    this.setData({
      showCardBuy: true
    })
  },

  // 点击卡规则 
  onCardConfigItemClick(e) {
    console.log(e);
    this.setData({
      ruleId: e.currentTarget.dataset.ruleid,
      cardConfigId: e.currentTarget.dataset.cardid
    })
  },

  // 点击关闭按钮
  onCloseCardClick() {
    this.setData({
      showCardBuy: false
    })
  },

  // 开通并付款
  onPayBtnClick() {
    userIsBind.call(this)
  },

  // 确定
  onSuccessSureClick() {
    this.setData({
      showPaySuccess: false,
      showCardBuy: false
    })
    wx.navigateTo({
      url: '/pages/personal/order-form-detail/order-form-detail?orderId=' + this.data.orderId,
    })
  },

  // 立即支付
  onOrderPayClick() {
    if(this.data.cardId) {
      this.setData({
        type: 'DEDUCTION'
      })
    } else {
      this.setData({
        type: 'PAY'
      })
    }
    
    onlineBuy.call(this);
  },

  // 直接付款
  onZhijieOrderPay() {
    this.setData({
      type: 'PAY'
    })
    onlineBuy.call(this);
  }


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
        res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_375_180/mode_fill`;
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

// 查询会员卡列表
function productCard() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCard(data).subscribe({
    next: res => {
      this.setData({
        productCardLength: res.length
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

// 适用于某商品的卡规则
function productCardConfig() {
  let data = {
    productId: this.data.productId,
    storeId: this.data.storeId
  }
  payService.productCardConfig(data).subscribe({
    next: res => {
      this.setData({
        productCardConfigList: res,
        ruleId: res[0].rules[0].ruleId,
        cardConfigId: res[0].cardConfigId,
        noCardConfig: res.length == 0 ? true : false
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 是否绑定手机号
function userIsBind() {
  let self = this;
  service.userIsBind().subscribe({
    next: res => {
      if (res.isBind) {
        self.setData({
          phone: res.phone,
          type: 'OPENCARD'
        })
        // 已经绑定手机号   直接调用在线购买接口
        onlineBuy.call(self)
      } else {
        wx.showModal({
          title: '绑定手机号',
          content: '开通会员卡需要绑定手机号，用于会员的查询及消费，请先绑定手机号',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/personal/member-card/band/band?from=product',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

// 在线购买
function onlineBuy() {
  let self = this;
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  //    wx3bb038494cd68262
  let appId = extConfig.theAppid ? extConfig.theAppid : 'wx3bb038494cd68262';
  // type不能为空 在线购卡付款:OPENCARD, 在线付款:PAY, 扣减会员卡:DEDUCTION
  if ((this.data.cardType === 'METERING' || this.data.cardType === 'TIMES') && this.data.cardId) {
    this.data.couponId = '';
  }
  let data = {
    appid: appId,
    buyProductRequest: {
      couponId: this.data.couponId,
      money: this.data.productInfo.currentPrice * this.data.count, //总价
      num: this.data.count,
      phone: this.data.phone,
      price: this.data.productInfo.currentPrice ,
      productId: this.data.productInfo.productId,
      productName: this.data.productInfo.productName,
      storeId: this.data.storeId
    },
    settleCardRequest: {
      cardId: this.data.cardId
    },
    memo: this.data.memo, //备注
    phone: this.data.phone,
    storeId: this.data.storeId,
    type: this.data.type
  }
  let verifyBalance;
  if (this.data.type == 'OPENCARD') {
    let orderId = new Date().getFullYear() + "" + new Date().getMonth() + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + MathRand.call(this, 10)
    data.buyProductRequest.orderId = orderId.substring(0, 18);
    data.openCardRquest = {
      ruleId: this.data.ruleId, //开卡的时候传
    }
    onlineBuyFun.call(self, data)
  } else if (this.data.type == 'DEDUCTION') {    
    payService.verifyBalance(data).subscribe({
      next: res => {
        verifyBalance = res;
        if (!res) {
          delete data.settleCardRequest;  //余额不足 不传卡id
          self.setData({
            type: 'PAY'
          })
          data.type = 'PAY';
          errDialog('会员卡余额不足');
        }
        onlineBuyFun.call(self, data)                  
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  } else {
    onlineBuyFun.call(self, data)                      
  } 
}

function MathRand(num) {
  var Num = "";
  for (var i = 0; i < num; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num
}

function onlineBuyFun(data) {
  let self = this;
  payService.onlineBuy(data).subscribe({
    next: res => {
      console.log(res);
      this.setData({
        orderId: res.orderId
      })
      if (self.data.type == 'DEDUCTION') {
        wx.navigateTo({
          url: '/pages/personal/order-form-detail/order-form-detail?orderId=' + this.data.orderId,
        })
      } else {
        wx.requestPayment({
          timeStamp: res.payInfo.timeStamp,
          nonceStr: res.payInfo.nonceStr,
          package: res.payInfo.package,
          signType: res.payInfo.signType,
          paySign: res.payInfo.paySign,
          success: function (res) {
            if (self.data.type == 'OPENCARD') {
              self.setData({
                showPaySuccess: true
              })
            } else {
              wx.navigateTo({
                url: '/pages/personal/order-form-detail/order-form-detail?orderId=' + self.data.orderId,
              })
            }
          },
          fail: function (result) {
            console.log(result);
          },
          complete: function (result) {
            console.log(result);
          }
        })
      }
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
} 