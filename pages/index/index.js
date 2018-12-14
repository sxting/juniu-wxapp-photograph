import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
import { constant } from '../../utils/constant';

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userIsBind: false,
    TPLID: constant.TPLID,
    phone: '',
    options: ''
  },

  onLoad: function (options) {
    this.setData({
      options: options ? options : ''
    })
    wx.setNavigationBarTitle({
      title: '登录授权',
    })
  },

  bindgetuserinfo(e) {
    let self = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: function (result) {
          self.setData({
            getUserInfo: true
          })
          let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
          let appId = 'wx3bb038494cd68262';
          if (result.code) {
            logIn.call(self, result.code, extConfig.theAppid ? extConfig.theAppid : appId, e.detail.rawData);
          } else {
            console.log('获取用户登录态失败！' + result.errMsg)
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  },
})

function logIn(code, appId, rawData) {
  let reqData = {
    code: code,
    appid: appId,
    rawData: rawData,
    tplid: constant.TPLID
  };
  let self = this;
  service.logIn(reqData).subscribe({
    next: res => {
      wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
      wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
      wx.setStorageSync(constant.sessionKey, res.sessionKey);
      wx.setStorageSync(constant.USER_ID, res.userId)

      if (res.ver == '2') {
        wx.setStorageSync(constant.VER, 2);
      } else {
        wx.setStorageSync(constant.VER, 1);
      }

      wx.setStorage({
        key: constant.TOKEN,
        data: res.juniuToken,
        success: function (res) {
          // console.log(self.data.options);
          wx.reLaunch({
            url: '/pages/home/home',
          })

          setTimeout(function () {
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
            }
          }, 200)

          if (!self.data.options) {
            wx.reLaunch({
              url: '/pages/home/home',
            })
          } else {
            // let optionsJson = JSON.parse(self.data.options).options;
            // let url = optionsJson.url;
            // let options = '';
            // optionsJson.forEach(function(item) {
            //   options
            // })
            // wx.reLaunch({
            //   url: url + '?options=' + JSON.stringify(self.data.options),
            // })
          }
        }
      })

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}