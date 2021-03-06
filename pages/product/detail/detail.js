import { productService } from '../shared/service.js'
import { errDialog, changeDate } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { service } from '../../../service';
import { homeService } from '../../home/shared/service';
import { formidService } from '../../../shared/service/formid.service.js';

//获取应用实例
var app = getApp()
Page({
  data: {
    productInfo: {},
    productId: '',
    storeId: '',
    storeName: '',
    juniuImg: '/asset/images/product.png',
    address: '',
    tel: '',
    shared: false
  },

  onShow: function() {
    let self = this;
    if (this.data.shared) {
      wx.getSetting({
        success: res => {
          // 如果授权  则直接登录  
          if (res.authSetting['scope.userInfo']) {
            let callbackFun = function () {
              getProductDetail.call(self);
              getStoreInfo.call(self, wx.getStorageSync(constant.STORE_INFO))
            };
            wx.login({
              success: function (result) {
                wx.getUserInfo({
                  success: res => {
                    service.logInFun(result.code, res.rawData, callbackFun);
                  },
                  fail: () => { }
                })
              }
            });
          } else {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目详情',
    })
    this.setData({
      productId: options.productId,
      storeId: options.storeId ? options.storeId : wx.getStorageSync(constant.STORE_INFO)
    })

    let self = this;
    if (options.type === 'shared') {
      wx.setStorageSync(constant.STORE_INFO, options.storeId);
      setTimeout(function() {
        self.setData({
          shared: true,
        })
      }, 500)
      wx.getSetting({
        success: res => {
          // 如果授权  则直接登录  
          if (res.authSetting['scope.userInfo']) {
            let callbackFun = function () {
              getProductDetail.call(self);
              getStoreInfo.call(self, wx.getStorageSync(constant.STORE_INFO))
            };
            wx.login({
              success: function (result) {
                wx.getUserInfo({
                  success: res => {
                    service.logInFun(result.code, res.rawData, callbackFun);
                  },
                  fail: () => {}
                })
              }
            });
          } else {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      getProductDetail.call(this);
      getStoreInfo.call(this, wx.getStorageSync(constant.STORE_INFO))
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('storeName'),
      path: '/pages/product/detail/detail?type=shared&storeId=' + this.data.storeId + '&productId=' + this.data.productId,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },

  onTelClick() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.tel
    })
  },

  formSubmit: function (e) {
    let formId = e.detail.formId; //获取formId
    formidService.collectFormIds(formId).subscribe({
      next: res => { }
    })
  },

  // 点击适用门店
  onStoreClick: function () {
    wx.navigateTo({
      url: '/pages/shop/list/list?productId=' + this.data.productId,
    })
  },

  // 点击立即购买
  alertCountSelect() {
    wx.navigateTo({
      url: '/pages/pay/pay?productId=' + this.data.productId + '&count=' + this.data.count,
    })
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
        let url = res.url;
        res.url = constant.OSS_IMAGE_URL + `${res.url}/resize_750_540/mode_fill`;
        res.url2 = constant.OSS_IMAGE_URL + `${url}/resize_280_200/mode_fill`;
      }
      if (res.descPicIds) {
        let descPicUrls = res.descPicIds.split(',');
        res.descPicUrls = [];
        descPicUrls.forEach(function(item) {
          item = constant.OSS_IMAGE_URL + `${item}/resize_750_480/mode_fill`;
          res.descPicUrls.push(item)
        })
      }
      if (res.notice) {
        res.noticeArr = JSON.parse(res.notice);
      }
      this.setData({
        productInfo: res
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}

//获取门店信息
function getStoreInfo(storId) {
  let self = this;
  homeService.storeInfoDetail({ storeId: storId }).subscribe({
    next: res => {
      self.setData({
        address: res.address,
        tel: res.mobile,
        storeName: res.storeName 
      });
      wx.setStorageSync(constant.address, res.address);
      wx.setStorageSync('storeName', res.storeName);
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}