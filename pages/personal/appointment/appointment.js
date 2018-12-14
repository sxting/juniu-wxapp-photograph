import { personalService } from '../shared/service.js'
import { errDialog } from '../../../utils/util';
//获取应用实例
//     INIT("初始化预约"),SUCCESS("预约成功"),CANCEL("取消"),REFUSE("拒绝");
var app = getApp()
Page({
  data: {
    appointmentInfo: {}
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的预约',
    })
    personalService.reserveConfig().subscribe({
      next: res => {
        this.setData({
          appointmentInfo: res,
        });
      },
      error: err => errDialog(err),
      complete: () => wx.hideToast()
    })
  },
})
