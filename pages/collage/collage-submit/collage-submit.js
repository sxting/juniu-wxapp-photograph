
import { collageService } from '../shared/collage.service';
import { errDialog, loading } from '../../../utils/util';
import { constant } from '../../../utils/constant';
import { homeService } from '../../home/shared/service.js';
import { service } from '../../../service';
import { memberCardService } from '../../personal/member-card/shared/service';
import { formidService } from '../../../shared/service/formid.service.js';

Page({
  data: {
    jnImg: '/asset/images/product.png',
    data: '',
    tel: '',
    groupNo: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提交订单',
    })
    this.setData({
      data: options,
      groupNo: options.groupId ? options.groupId : ''
    })
  },

  // 填写手机号
  onTelChange: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  //授权手机号 
  getUserPhoneNumber: function (e) {
    console.log(e);
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let data = {
      encryptData: encryptedData,
      iv: iv
    }
    memberCardService.decodeUserPhone(data).subscribe({
      next: res => {
        this.setData({
          tel: res.phoneNumber
        })
        wx.setStorageSync(constant.phoneNumber, res.phoneNumber)
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },

  formSubmit: function (e) {
    let formId = e.detail.formId; //获取formId
    formidService.collectFormIds(formId).subscribe({
      next: res => { }
    })
  },

  // 点击提交订单
  onSubmitClick() {
    orderSubmit.call(this);
  }

})

// 订单提交
function orderSubmit() {
  let self = this;
  let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
  let appId = extConfig.theAppid ? extConfig.theAppid : 'wx0c66057a9b376be1';
  if ((this.data.tel + '').length !== 11) {
    errDialog('请填写正确的手机号'); return;
  }
  let data = {
    storeId: wx.getStorageSync(constant.STORE_INFO),
    activityId: this.data.data.pinTuanId,
    appid: appId,
    buyerPhone: this.data.tel,
    platform: 'WECHAT_SP'
  }
  if (this.data.groupNo) {
    data.groupNo = this.data.groupNo
  }
  collageService.payment(data).subscribe({
    next: res => {
      wx.requestPayment({
        timeStamp: res.payInfo.timeStamp,
        nonceStr: res.payInfo.nonceStr,
        package: res.payInfo.package,
        signType: res.payInfo.signType,
        paySign: res.payInfo.paySign,
        success: function (result) {
          wx.navigateTo({
            url: '/pages/personal/collage-order/detail/detail?orderNo=' + res.orderId,
          });
          console.log(result)
        },
        fail: function (result) {
          wx.navigateTo({
            url: '/pages/personal/collage-order/detail/detail?orderNo=' + res.orderId,
          });
          console.log(result);
        },
        complete: function (result) {
          // wx.navigateTo({
          //   url: '/pages/personal/collage-order/detail/detail?orderNo=' + res.orderId,
          // });
          console.log(result);
        }
      })
    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}



