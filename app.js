import { service } from 'service';
import { errDialog, loading } from 'utils/util'
import { constant } from 'utils/constant'

App({
  onShow: function (options) {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
        updateManager.applyUpdate()
    });
    // console.log(options);
    
    let self = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    let appId = 'wx0c66057a9b376be1';
    self.globalData.appId = extConfig.theAppid ? extConfig.theAppid : appId;

    // console.log(service);
    // return;

    // 登录
    // wx.login({
    //   success: result => {
    //     self.globalData.loginCode = result.code;
    //     // 获取用户信息
    //     wx.getSetting({
    //       success: res => {
    //         // console.log(res.authSetting['scope.userInfo']);
    //         // console.log(options.query);
    //         if (res.authSetting['scope.userInfo']) {
    //           // if (options.path === 'pages/pay/pay' || options.path === 'pages/collage/collage-submit/collage-submit') {
    //           //   return;
    //           // }
    //           // let str = ''
    //           // if (options.query) {
    //           //   for (let key in options.query) {
    //           //     str += `&${key}=${options.query[key]}`
    //           //   }
    //           //   str = str.substring(1);
    //           //   console.log(str);
    //           //   console.log(`/${options.path}?${str}`);
    //           //   wx.reLaunch({
    //           //     url: `/${options.path}?${str}`,
    //           //   })
    //           // } else {
    //           //   wx.reLaunch({
    //           //     url: `/${options.path}`,
    //           //   })
    //           // }
              
    //           wx.getUserInfo({
    //             success: res => {
    //               self.globalData.hasUserInfo = true;
    //               self.globalData.userInfo = res.userInfo;
    //               self.globalData.rawData = res.rawData;
    //               if (result.code) {
    //                 let reqData = { 
    //                   code: result.code, 
    //                   appid: extConfig.theAppid ? extConfig.theAppid : appId, 
    //                   rawData: res.rawData, 
    //                   tplid: constant.TPLID 
    //                 }
    //                 service.logIn(reqData).subscribe({
    //                   next: res => {
    //                     wx.setStorageSync(constant.MERCHANTID, res.merchantId ? res.merchantId : '153179997107784038184');
    //                     wx.setStorageSync(constant.CARD_LOGO, res.appHeadImg);
    //                     wx.setStorageSync(constant.sessionKey, res.sessionKey);
    //                     wx.setStorageSync(constant.USER_ID, res.userId);
    //                     wx.setStorageSync(constant.OPEN_ID, res.openid);
    //                     wx.setStorageSync(constant.CUSTOMER_ID, res.customerId);

    //                     if (res.ver == '2') {
    //                       wx.setStorageSync(constant.VER, 2);
    //                     } else {
    //                       wx.setStorageSync(constant.VER, 1);
    //                     }

    //                     wx.setStorage({
    //                       key: constant.TOKEN,
    //                       data: res.juniuToken,
    //                       success: function (res) {
    //                         if (self.userInfoReadyCallback) {
    //                           self.userInfoReadyCallback(res)
    //                         }
    //                       }
    //                     })

    //                   },
    //                   error: err => errDialog(err),
    //                   complete: () => wx.hideToast()
    //                 })
    //               } else {
    //                 console.log('获取用户登录态失败！' + result.errMsg)
    //               }
    //             },
    //             fail: () => {
    //               // this.globalData.hasUserInfo = false;
    //             }
    //           })
    //         } else {
    //           this.globalData.hasUserInfo = false;
    //           if (options.query) {
    //             let str = '';
    //             for (let key in options.query) {
    //               str += `&${key}=${options.query[key]}`
    //             }
    //             str = str.substring(1);
    //             wx.reLaunch({
    //               url: `/pages/index/index?url=${options.path}&optionStr=${str}`,
    //             })
    //           } else {
    //             wx.reLaunch({
    //               url: `/pages/index/index?url=${options.path}`,
    //             })
    //           }
    //         }
    //       }
    //     })
    //   }
    // })
  },
  onError:function(res){
    console.log(res)
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    loginCode: '',
    rawData: '',
    appId: ''
  }
})