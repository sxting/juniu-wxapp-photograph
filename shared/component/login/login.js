import { service } from '../../../service';
import { constant } from '../../../utils/constant';

Component({
  properties: {
    
  },

  data: {
    userInfo: false
  },

  methods: {
    bindgetuserinfo(e) {
      let self = this;
      if (e.detail.errMsg == 'getUserInfo:ok') {
        self.setData({
          userInfo: true
        })
        wx.login({
          success: function (result) {
            self.setData({
              userInfo: true
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
      } else {
        self.setData({
          userInfo: fasle
        })
      }
    },
  }
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
          
        }
      })

    },
    error: err => errDialog(err),
    complete: () => wx.hideToast()
  })
}
