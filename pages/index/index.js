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
      wx.navigateBack({
        delta: 1
      });
    }
  },
})