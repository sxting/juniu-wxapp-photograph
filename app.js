import { service } from 'service';
import { errDialog, loading } from 'utils/util'
import { constant } from 'utils/constant'

App({
  onLaunch: function (options) {
    let self = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let appId = 'wx3bb038494cd68262';

    self.globalData.appId = extConfig.theAppid ? extConfig.theAppid : appId;
    // 登录
    wx.login({
      success: result => {
        self.globalData.loginCode = result.code;
        // 获取用户信息
        wx.getSetting({
          success: res => {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: res => {
                  self.globalData.hasUserInfo = true;
                  self.globalData.userInfo = res.userInfo;
                  self.globalData.rawData = res.rawData;
                  if (result.code) {
                    let reqData = { 
                      code: result.code, 
                      appid: extConfig.theAppid ? extConfig.theAppid : appId, 
                      rawData: res.rawData, 
                      tplid: constant.TPLID 
                    }
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
                            console.log(self.userInfoReadyCallback);
                            if (self.userInfoReadyCallback) {
                              self.userInfoReadyCallback(res)
                            }
                          }
                        })

                      },
                      error: err => errDialog(err),
                      complete: () => wx.hideToast()
                    })
                  } else {
                    console.log('获取用户登录态失败！' + result.errMsg)
                  }
                },
                fail: () => {
                  this.globalData.hasUserInfo = false;
                }
              })
            } else {
              this.globalData.hasUserInfo = false;
              wx.reLaunch({
                url: '/pages/index/index?options=' + JSON.stringify(options),
              })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    loginCode: '',
    rawData: '',
    appId: ''
  }
})