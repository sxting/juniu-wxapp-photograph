import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
import { constant } from '../../utils/constant';

var app = getApp()
Page({
  data: {
    userInfo: {},
    userIsBind: false,
    TPLID: constant.TPLID,
    phone: '',
    optionStr: '',
    url: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录授权',
    })
  },

  bindgetuserinfo(e) {
    let self = this;
      if (e.detail.errMsg == 'getUserInfo:ok') {
          let callbackFun = function () {
              wx.navigateBack({
                  delta: 1
              });
          }

          wx.login({
              success: function (result) {
                  wx.getUserInfo({
                      success: res => {
                          service.logInFun(result.code, e.detail.rawData, callbackFun);
                      }
                  })
              }
          });
      } else {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      }
  },
})